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
 *   СПАМ       бот: попълнен honeypot
 *              → тих drop. Редирект към благодарствената страница, без имейл.
 *                Ботът не бива да разбира, че е спрян, за да не пробва друго.
 *
 *   ГРЕШКА     човек: невалиден имейл, празно поле, липсващо съгласие
 *              → видима грешка, изписана от PHP без нужда от JavaScript.
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
    'rate_limit' => 10,
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
    $candidates = [dirname($_SERVER['DOCUMENT_ROOT'] ?? '') . '/vamo-private'];
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

/** HTML е изцяло от PHP, за да се вижда грешката и при спрян JavaScript. */
function human_error(string $code, int $status = 422): void
{
    $messages = [
        'consent' => 'Моля, отметнете съгласието за обработка на данните.',
        'required' => 'Моля, попълнете име и телефон.',
        'email' => 'Имейл адресът изглежда невалиден.',
        'length' => 'Едно от полетата е твърде дълго.',
        'rate' => 'Получихме твърде много запитвания от тази връзка. Опитайте по-късно или се свържете с нас по телефон.',
        'send' => 'Възникна техническа грешка. Опитайте отново или се свържете с нас по телефон.',
    ];
    $message = $messages[$code] ?? $messages['send'];
    $escape = static fn($value): string => htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $name = $escape(is_scalar($_POST['name'] ?? null) ? $_POST['name'] : '');
    $email = $escape(is_scalar($_POST['email'] ?? null) ? $_POST['email'] : '');
    $phone = $escape(is_scalar($_POST['phone'] ?? null) ? $_POST['phone'] : '');
    $details = $escape(is_scalar($_POST['message'] ?? null) ? $_POST['message'] : '');
    $checked = !empty($_POST['consent']) ? ' checked' : '';
    http_response_code($status);
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    echo '<!doctype html><html lang="bg"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Поправете запитването — VAMO</title>';
    echo '<style>body{margin:0;background:#faf9f7;color:#111;font:1rem/1.6 system-ui,sans-serif}main{width:min(100% - 2rem,42rem);margin:4rem auto}a{color:#b91c1c}form{display:grid;gap:1rem;margin-top:2rem}label{display:grid;gap:.35rem;font-weight:600}input,textarea{box-sizing:border-box;width:100%;min-height:2.75rem;padding:.65rem;border:1px solid #57564f;border-radius:.25rem;background:#fff;font:inherit}textarea{min-height:8rem}.error{padding:1rem;border-left:3px solid #e3061a;background:#fef2f2}.consent{display:flex;align-items:start;gap:.75rem;font-weight:400}.consent input{width:1.25rem;min-height:1.25rem;margin-top:.2rem}button{min-height:2.75rem;justify-self:start;padding:.6rem 1.2rem;border:0;border-radius:.25rem;background:#e3061a;color:#fff;font:600 1rem system-ui,sans-serif;cursor:pointer}:focus-visible{outline:3px solid #2563eb;outline-offset:3px}.trap{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}</style></head><body><main>';
    echo '<a href="/kontakti/">← Към страницата за контакт</a><h1>Поправете запитването</h1><p class="error" role="alert">' . $escape($message) . '</p>';
    echo '<form action="/kontakt.php" method="post"><label>Име и организация<input name="name" autocomplete="name" required value="' . $name . '"></label>';
    echo '<label>Имейл (по желание)<input type="email" name="email" autocomplete="email" value="' . $email . '"></label>';
    echo '<label>Телефон<input type="tel" name="phone" autocomplete="tel" required value="' . $phone . '"></label>';
    echo '<label>Каква е задачата?<textarea name="message">' . $details . '</textarea></label>';
    echo '<div class="trap" aria-hidden="true"><input name="hp_fax" tabindex="-1" autocomplete="off"><input name="hp_website" tabindex="-1" autocomplete="off"><input name="hp_address_3" tabindex="-1" autocomplete="off"></div>';
    echo '<label class="consent"><input type="checkbox" name="consent" value="1" required' . $checked . '><span>Съгласен/съгласна съм предоставените данни да бъдат използвани за отговор на запитването. <a href="/politika-za-poveritelnost/">Политика за поверителност</a></span></label>';
    echo '<button type="submit">Изпратете запитването</button></form></main></body></html>';
    exit;
}

/** Атомарен плъзгащ се лимит по IP за последния час. */
function rate_limited(int $limit): bool
{
    $dir = private_dir();
    if ($dir === null) return false;
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = $dir . '/rate-' . hash('sha256', $ip) . '.json';
    $handle = @fopen($file, 'c+');
    if ($handle === false) return false;
    try {
        if (!flock($handle, LOCK_EX)) return false;
        $raw = stream_get_contents($handle);
        $decoded = json_decode($raw ?: '[]', true);
        $now = time();
        $hits = array_values(array_filter(is_array($decoded) ? $decoded : [], static fn($hit) => is_numeric($hit) && $now - (int) $hit < 3600));
        if (count($hits) >= $limit) return true;
        $hits[] = $now;
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($hits));
        fflush($handle);
        return false;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
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

// ── 2. Дневен токен → сигнал, никога условие за приемане ───────────────────
$token = (string) ($_POST['form_token'] ?? '');
$valid = [
    base64_encode($CONFIG['salt'] . gmdate('Y-m-d')),
    base64_encode($CONFIG['salt'] . gmdate('Y-m-d', strtotime('-1 day'))),
    base64_encode($CONFIG['salt'] . gmdate('Y-m-d', strtotime('+1 day'))),
];
$invalid_token = $token !== '' && !in_array($token, $valid, true);

// ── 3. Време → флаг, не drop ────────────────────────────────────────────────
// Часовникът на клиента може да е разместен, затова бързата заявка се маркира.
$form_ts = (int) ($_POST['form_ts'] ?? 0);
$elapsed = time() - $form_ts;
$fast = ($form_ts > 0 && $elapsed >= 0 && $elapsed < 3);

// ── 4. Валидация → видима грешка ────────────────────────────────────────────
if (empty($_POST['consent'])) {
    human_error('consent');
}

$name    = clean(is_scalar($_POST['name'] ?? null) ? (string) $_POST['name'] : '');
$email   = clean(is_scalar($_POST['email'] ?? null) ? (string) $_POST['email'] : '');
$phone   = clean(is_scalar($_POST['phone'] ?? null) ? (string) $_POST['phone'] : '');
$message = clean(is_scalar($_POST['message'] ?? null) ? (string) $_POST['message'] : '', false);

if ($name === '' || $phone === '') {
    human_error('required');
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    human_error('email');
}
if (mb_strlen($name) > 120 || mb_strlen($email) > 150
    || mb_strlen($phone) > 40 || mb_strlen($message) > 5000) {
    human_error('length');
}

if (rate_limited($CONFIG['rate_limit'])) {
    log_blocked('rate_limit');
    human_error('rate', 429);
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
if ($invalid_token) {
    $flags[] = 'НЕВАЛИДЕН ТОКЕН';
}
$prefix = $flags ? '[ЗА ПРОВЕРКА: ' . implode(', ', $flags) . '] ' : '';

$from   = sprintf('%s <%s>', $CONFIG['from_name'], $CONFIG['from']);
$stamp  = date('d.m.Y H:i');
$source = clean(is_scalar($_POST['source'] ?? null) ? (string) $_POST['source'] : '');

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
$saved = false;
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
    $saved = @file_put_contents($dir . '/zapitvaniya.jsonl', $record . "\n", FILE_APPEND | LOCK_EX) !== false;
}

if (!$sent && !$saved) {
    human_error('send', 503);
}

// ── Потвърждение до подателя ────────────────────────────────────────────────
// Отговорът се насочва към office@vamo.bg, за да може човекът просто да
// натисне „Отговор" и да продължи разговора.
if ($email !== '' && !$flags) {
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
