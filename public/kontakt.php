<?php
/**
 * Обработка на запитванията от формата на vamo.bg
 *
 * Файлът стои в `public/`, значи влиза в билда и се качва при всеки деплой.
 * Редакции направени директно на сървъра ще бъдат презаписани — променяй тук.
 *
 * ---------------------------------------------------------------------------
 * Основният принцип: една заявка може да се провали по три различни причини и
 * всяка изисква различна реакция. Смесването им губи реални клиенти.
 *
 *   СПАМ       бот: попълнен honeypot, липсващ токен
 *              → тих drop. Редирект към благодарствената страница, без имейл.
 *                Ботът не бива да разбира, че е спрян, за да не пробва друго.
 *
 *   ГРЕШКА     човек: невалиден имейл, празно поле, липсващо съгласие
 *              → видима грешка. Връщане към формата с `?error=`.
 *                Тих drop тук значи изгубен клиент, който мисли, че е изпратил.
 *
 *   СЪМНЕНИЕ   гранично: линк в съобщението, странно бърза заявка
 *              → доставя се, но темата носи `[ЗА ПРОВЕРКА]`.
 *                По-добре да прегледаш ръчно, отколкото да изхвърлиш запитване.
 * ---------------------------------------------------------------------------
 */

declare(strict_types=1);

$CONFIG = [
    'to'         => 'office@vamo.bg',
    // `From` трябва да е от собствения домейн. Имейлът на подателя тук праща
    // писмото в спам, защото не минава SPF проверката на домейна му.
    'from'       => 'no-reply@vamo.bg',
    'from_name'  => 'VAMO',
    'thanks_url' => '/thanks/',
    'form_url'   => '/kontakti/#zapitvane',
    // Солта е обфускация, не сигурност: стои в публичния JS и е обратима.
    // Спира ботовете, които пращат суров POST без да изпълняват JS.
    'salt'       => 'vamo-bg-zapitvane-',
];

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method Not Allowed');
}

/**
 * Папка извън webroot-а. Съдържа запитванията, затова не бива да е достъпна
 * по HTTP при никакви обстоятелства. FTP акаунтът на деплоя е затворен в
 * `domains/vamo.bg`, така че тази папка не може да бъде презаписана от него;
 * PHP работи като собственика на акаунта и я създава сам.
 */
function private_dir(): ?string
{
    $candidates = [
        dirname($_SERVER['DOCUMENT_ROOT'] ?? '') . '/vamo-private',
        ($_SERVER['DOCUMENT_ROOT'] ?? '') . '/.private',
    ];
    foreach ($candidates as $dir) {
        if (is_dir($dir) && is_writable($dir)) {
            return $dir;
        }
        if (@mkdir($dir, 0700, true) && is_writable($dir)) {
            return $dir;
        }
    }
    return null;
}

/**
 * Дневник на блокираните заявки. Пише само причина, IP и час — никога самите
 * полета. При погрешно блокиран реален човек в дневника не бива да остават
 * личните му данни.
 */
function log_blocked(string $reason): void
{
    $dir = private_dir();
    if ($dir === null) {
        return;
    }
    $entry = json_encode([
        'ts'     => date('c'),
        'ip'     => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'reason' => $reason,
    ], JSON_UNESCAPED_UNICODE);
    @file_put_contents($dir . '/blocked.log', $entry . "\n", FILE_APPEND | LOCK_EX);
}

function redirect(string $url): void
{
    header('Location: ' . $url, true, 303);
    exit;
}

function silent_drop(string $reason, string $url): void
{
    log_blocked($reason);
    redirect($url);
}

function human_error(string $code, string $url): void
{
    $separator = strpos($url, '?') !== false ? '&' : '?';
    $anchor = '';
    if (strpos($url, '#') !== false) {
        [$url, $anchor] = explode('#', $url, 2);
        $anchor = '#' . $anchor;
    }
    redirect($url . $separator . 'error=' . urlencode($code) . $anchor);
}

/** Премахва нови редове — иначе подателят може да си впише свои имейл заглавия. */
function clean(string $value, bool $strip_newlines = true): string
{
    $value = trim($value);
    if ($strip_newlines) {
        $value = str_replace(["\r", "\n", "\0"], '', $value);
    }
    return $value;
}

// ── 1. Honeypot → тих drop ──────────────────────────────────────────────────
// Имената нарочно не са `name`, `email`, `phone`: браузърното автодопълване
// би ги попълнило и би блокирало реални хора.
foreach (['hp_fax', 'hp_website', 'hp_address_3'] as $trap) {
    if (!empty($_POST[$trap])) {
        silent_drop('honeypot', $CONFIG['thanks_url']);
    }
}

// ── 2. Дневен токен → тих drop ──────────────────────────────────────────────
$token = (string) ($_POST['form_token'] ?? '');
$valid = [
    base64_encode($CONFIG['salt'] . gmdate('Y-m-d')),
    base64_encode($CONFIG['salt'] . gmdate('Y-m-d', strtotime('-1 day'))),
    base64_encode($CONFIG['salt'] . gmdate('Y-m-d', strtotime('+1 day'))),
];
if (!in_array($token, $valid, true)) {
    silent_drop('invalid_token', $CONFIG['thanks_url']);
}

// ── 3. Време → флаг, не drop ────────────────────────────────────────────────
// Часовникът на клиента може да е разместен, затова бързата заявка се маркира,
// а не се изхвърля. Токенът вече е отсял ботовете.
$form_ts = (int) ($_POST['form_ts'] ?? 0);
$elapsed = time() - $form_ts;
$fast = ($form_ts > 0 && $elapsed >= 0 && $elapsed < 3);

// ── 4. Валидация → видима грешка ────────────────────────────────────────────
if (empty($_POST['consent'])) {
    human_error('consent', $CONFIG['form_url']);
}

$name    = clean((string) ($_POST['name'] ?? ''));
$email   = clean((string) ($_POST['email'] ?? ''));
$phone   = clean((string) ($_POST['phone'] ?? ''));
$message = clean((string) ($_POST['message'] ?? ''), false);

if ($name === '' || $phone === '') {
    human_error('required', $CONFIG['form_url']);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    human_error('email', $CONFIG['form_url']);
}
if (mb_strlen($name) > 120 || mb_strlen($email) > 150
    || mb_strlen($phone) > 40 || mb_strlen($message) > 5000) {
    human_error('length', $CONFIG['form_url']);
}

// ── 5. Линкове → флаг, не drop ──────────────────────────────────────────────
// Реални хора пращат линкове към сайта си или към карта. Маркираме, не трием.
$has_link = (bool) preg_match('~https?://|www\.|\[url=|<a\s~i', $message . ' ' . $name);

// ── Изпращане ───────────────────────────────────────────────────────────────
$flags = [];
if ($fast) {
    $flags[] = 'ВРЕМЕ';
}
if ($has_link) {
    $flags[] = 'ЛИНК';
}
if ($form_ts <= 0) {
    $flags[] = 'БЕЗ ВРЕМЕ';
}
$prefix = $flags ? '[ЗА ПРОВЕРКА: ' . implode(', ', $flags) . '] ' : '';

$from   = sprintf('%s <%s>', $CONFIG['from_name'], $CONFIG['from']);
$stamp  = date('d.m.Y H:i');
$source = clean((string) ($_POST['source'] ?? ''));

$body = "Ново запитване от vamo.bg\n"
      . str_repeat('-', 46) . "\n\n"
      . "Име и организация: {$name}\n"
      . 'Телефон:           ' . $phone . "\n"
      . 'Имейл:             ' . ($email !== '' ? $email : '(не е посочен)') . "\n"
      . "Получено:          {$stamp}\n"
      . ($source !== '' ? "От страница:       {$source}\n" : '')
      . "\nЗадача:\n" . ($message !== '' ? $message : '(не е описана)') . "\n";

$headers = [
    'From: ' . $from,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: vamo.bg',
];
// Отговорът отива право при подателя, когато е оставил имейл.
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

$sent = mail(
    $CONFIG['to'],
    '=?UTF-8?B?' . base64_encode($prefix . 'Ново запитване от сайта') . '?=',
    $body,
    implode("\r\n", $headers)
);

// ── Запис на хостинга ───────────────────────────────────────────────────────
// Пази се независимо от това дали имейлът е минал: писмо може да се загуби,
// запитването не бива.
$dir = private_dir();
if ($dir !== null) {
    $record = json_encode([
        'ts'      => date('c'),
        'name'    => $name,
        'phone'   => $phone,
        'email'   => $email,
        'message' => $message,
        'source'  => $source,
        'flags'   => $flags,
        'mailed'  => $sent,
        'ip'      => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    ], JSON_UNESCAPED_UNICODE);
    @file_put_contents($dir . '/zapitvaniya.jsonl', $record . "\n", FILE_APPEND | LOCK_EX);
}

// ── Потвърждение до подателя ────────────────────────────────────────────────
// Отговорът се насочва към office@vamo.bg, за да може човекът просто да
// натисне „Отговор" и да продължи разговора.
if ($email !== '') {
    $ack = "Здравейте, {$name},\n\n"
         . "Получихме вашето запитване и ще се свържем с вас.\n\n"
         . "Ето какво ни изпратихте:\n"
         . str_repeat('-', 46) . "\n"
         . 'Телефон: ' . $phone . "\n"
         . ($message !== '' ? "\n" . $message . "\n" : '')
         . str_repeat('-', 46) . "\n\n"
         . "Ако искате да допълните нещо, просто отговорете на това писмо.\n\n"
         . "VAMO\n"
         . "office@vamo.bg · 089 918 0790\n"
         . "https://vamo.bg/\n";

    @mail(
        $email,
        '=?UTF-8?B?' . base64_encode('Получихме вашето запитване — VAMO') . '?=',
        $ack,
        implode("\r\n", [
            'From: ' . $from,
            'Reply-To: ' . $CONFIG['to'],
            'Content-Type: text/plain; charset=UTF-8',
            'X-Mailer: vamo.bg',
        ])
    );
}

// Запитването е записано на хостинга, така че дори при отказ на пощата не е
// изгубено. Затова човекът вижда благодарствената страница, вместо грешка.
redirect($CONFIG['thanks_url']);
