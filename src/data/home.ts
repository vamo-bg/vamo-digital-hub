export interface HomeProblem {
  number: `${number}${number}`;
  title: string;
  linkLabel: string;
  href: string;
}

export interface HomeProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface HomeOutcome {
  title: string;
  description: string;
  serviceId: string;
  icon: string;
}

export const homeProblems: readonly HomeProblem[] = [
  {
    number: '01',
    title:
      'Инвестираме в маркетинг, но не виждаме резултат и не знаем къде изтича бюджетът',
    linkLabel: 'Решение',
    href: '/resheniya/digitalna-strategiya/',
  },
  {
    number: '02',
    title: 'Разчитаме на препоръки и нямаме предвидим поток от клиенти',
    linkLabel: 'Решение',
    href: '/resheniya/digitalna-strategiya/',
  },
  {
    number: '03',
    title:
      'Публикуваме, рекламираме, пробваме, но няма ясен и устойчив резултат',
    linkLabel: 'Решение',
    href: '/resheniya/komunikatsii-i-pr/',
  },
  {
    number: '04',
    title: 'Липсва ни структура и човек, който да поеме посоката',
    linkLabel: 'Решение',
    href: '/kak-rabotim/',
  },
];

export const homeProcessSteps: readonly HomeProcessStep[] = [
  {
    number: 1,
    title: 'Диагностика',
    description:
      'Откриваме къде губите запитвания и какво спира резултатите.',
  },
  {
    number: 2,
    title: 'Стратегия',
    description:
      'Създаваме ясен план с приоритети — какво носи резултат и какво спирате.',
  },
  {
    number: 3,
    title: 'Реализация',
    description:
      'Изпълняваме с точните хора — без да управлявате различни изпълнители.',
  },
  {
    number: 4,
    title: 'Публичност',
    description:
      'Осигуряваме достигане, което води до реални запитвания, не само присъствие.',
  },
];

export const homeOutcomes: readonly HomeOutcome[] = [
  {
    title: 'Разпознаваемост',
    description:
      'Чрез бранд визия и комуникация, която хората запомнят.',
    serviceId: 'dizayn-i-reklamni-materiali',
    icon: 'eye',
  },
  {
    title: 'Авторитет',
    description:
      'Чрез съдържание, подкасти и интервю формати, които изграждат доверие.',
    serviceId: 'podkast-i-intervyu-formati',
    icon: 'microphone-stage',
  },
  {
    title: 'Спокойствие',
    description:
      'Чрез организация на събития, в която процесът е подреден от начало до край.',
    serviceId: 'sabitiya-i-logistika',
    icon: 'calendar-check',
  },
  {
    title: 'Сигурност',
    description:
      'Чрез публичност и отчетност по европейски и публични проекти.',
    serviceId: 'eu-visibility-compliance',
    icon: 'shield-check',
  },
];
