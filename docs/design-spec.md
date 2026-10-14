# Paywall — спецификация макета и инструкция по Figma

Документ — единый источник правды для макета и вёрстки. Все числа здесь = числа в коде.
Если по ходу рисования что-то меняете — меняйте и в этом файле (или скажите мне).

---

## 0. Концепция

Детская развивающая игра «условная». Экран открывается во webview поверх игры.
Тон: дружелюбный, светлый, спокойный (покупку видит родитель). Фиолетовый бренд + жёлтая звезда.

Сценарий пользователя:
1. Видит, что получит (заголовок + 3 пункта ценности).
2. Выбирает тариф (по умолчанию выбран «Год» — выгоднее).
3. Жмёт большую кнопку внизу → видит загрузку → видит успех (или понятную ошибку с «Повторить»).
4. Если уже покупал — «Восстановить покупки».

---

## 1. Общие правила pixel perfect (важно прочитать до начала)

Эти правила гарантируют, что браузер нарисует то же самое, что Figma:

| Правило | Почему |
|---|---|
| Все размеры, координаты, отступы — **целые числа** | дробные px по-разному округляются |
| **Line height — всегда в px** (не `Auto`, не %) | `Auto` в Figma ≠ `normal` в CSS |
| **Letter spacing — 0** везде | проценты Figma плохо переносятся |
| Текст: Vertical trim — **Standard** (по умолчанию, не трогать) | CSS считает высоту строки так же |
| Многострочный текст — **явный перенос `Shift+Enter`** | иначе браузер может перенести слово иначе |
| Ширина блоков — `Fill container`, высота — `Hug contents` | один-в-один ложится на flexbox |
| Stroke у карточек — **Inside** | не меняет размеры блока |
| Иконки и иллюстрацию **экспортируем в SVG** и используем в коде | гарантированное совпадение |
| Эмодзи **не используем** | в Figma и на телефоне это разные картинки |
| Не используем Scale-инструмент (K) по готовым блокам | масштабирует обводки и тексты в дробные значения |

Включите: `Main menu → Preferences → Snap to pixel grid` (должна стоять галочка).

---

## 2. Дизайн-токены

### 2.1 Цвета (создать как Color styles)

| Имя стиля в Figma | HEX | Где используется |
|---|---|---|
| `bg/page` | `#F5F3FF` | фон экрана |
| `bg/surface` | `#FFFFFF` | карточки, футер, кнопка закрытия |
| `brand/primary` | `#6C4CF5` | CTA, выбранный тариф, ссылки |
| `brand/primary-disabled` | `#B9AAFA` | неактивная CTA |
| `brand/primary-soft` | `#EEEAFE` | подложки иконок, круг иллюстрации, info-баннер |
| `accent/amber` | `#FFB020` | бейдж «Выгода 50%», мелкий декор |
| `accent/star` | `#FFC83D` | звезда в иллюстрации |
| `text/primary` | `#1F1A3D` | основной текст |
| `text/secondary` | `#6B6785` | второстепенный текст |
| `text/on-primary` | `#FFFFFF` | текст на CTA |
| `border/default` | `#E4E0F5` | обводка невыбранной карточки |
| `border/radio` | `#CFC9E8` | пустой радио-кружок |
| `skeleton` | `#E9E5F8` | скелетоны при загрузке |
| `success` | `#1FA971` | иконка успеха |
| `success/soft` | `#E3F7EF` | круг под иконкой успеха |
| `error` | `#E5484D` | иконка ошибки |
| `error/soft` | `#FDECEC` | фон баннера ошибки |
| `error/text` | `#B4232A` | текст ошибки |

### 2.2 Типографика (создать как Text styles)

Шрифт: **Nunito** (есть в Figma по умолчанию, в коде подключу тот же из Google Fonts).

| Имя стиля | Начертание | Size / Line height | Где |
|---|---|---|---|
| `title` | ExtraBold (800) | 28 / 34 | заголовок экрана, заголовок успеха |
| `body` | Medium (500) | 16 / 22 | подзаголовок, текст успеха |
| `feature` | SemiBold (600) | 15 / 20 | пункты ценности |
| `card-title` | Bold (700) | 17 / 22 | «Год», «Месяц», заголовок ошибки загрузки |
| `price` | ExtraBold (800) | 20 / 24 | цена в карточке |
| `caption` | Medium (500) | 13 / 18 | подписи в карточках, «Номер покупки» |
| `caption-strong` | Bold (700) | 13 / 18 | значение номера покупки |
| `badge` | ExtraBold (800) | 11 / 14, **Case: UPPER** | бейдж «Выгода 50%» |
| `button` | ExtraBold (800) | 18 / 24 | текст CTA |
| `link` | Bold (700) | 15 / 20 | «Восстановить покупки», вторичная кнопка |
| `banner` | SemiBold (600) | 14 / 20 | текст баннеров |
| `legal` | Medium (500) | 12 / 16 | мелкий текст внизу |

Letter spacing у всех = 0. Paragraph spacing = 0.

> Проверьте, что знак `₽` в Nunito отображается Nunito, а не системным шрифтом
> (если выглядит «чужим» — напишите, заменим на «руб.»).

### 2.3 Радиусы, отступы, тени

- Сетка отступов: кратно 4 (4, 8, 12, 16, 20, 24).
- Боковые поля экрана: **20**. Ширина контента при 390 = **350**.
- Радиусы: кнопка закрытия — 18 (круг), иконки фич — 8, баннер — 14, CTA — 16, карточки — 20, футер — 24 сверху.

| Имя (Effect style) | X | Y | Blur | Spread | Цвет | Где |
|---|---|---|---|---|---|---|
| `shadow/selected` | 0 | 8 | 24 | 0 | `#6C4CF5` 16% | выбранная карточка тарифа |
| `shadow/cta` | 0 | 8 | 20 | 0 | `#6C4CF5` 30% | активная CTA |
| `shadow/footer` | 0 | -4 | 24 | 0 | `#1F1A3D` 8% | белый футер |

(Effect styles в Figma: выделить слой → Effects → `+` → Drop shadow → ввести значения → иконка стилей `⋮⋮` → `+` создать стиль.)

---

## 3. Иконки

Используем набор **Lucide** (в Figma — плагин «Lucide Icons», в коде — те же SVG).

| Иконка Lucide | Размер | Stroke | Цвет | Где |
|---|---|---|---|---|
| `x` | 20 | 2 | `text/secondary` | кнопка закрытия |
| `gamepad-2` | 16 | 2 | `brand/primary` | фича 1 |
| `shield-check` | 16 | 2 | `brand/primary` | фича 2 |
| `sparkles` | 16 | 2 | `brand/primary` | фича 3 |
| `circle-alert` | 20 | 2 | `error` | баннер ошибки |
| `info` | 20 | 2 | `brand/primary` | info-баннер (восстановление) |
| `wifi-off` | 24 | 2 | `error` | ошибка загрузки тарифов |
| `check` | 56 | 3 | `success` | экран успеха |

Плагин вставляет иконки 24×24. Чтобы получить 16 или 20: выделить иконку → в правой панели задать W/H
(обычным полем, **не** инструментом K) → если толщина линии изменилась, вернуть Stroke = нужное значение.

---

## 4. Главный экран — `Paywall / Default`

### 4.1 Схема (координаты Y при фрейме 390×844)

```
y=0    ┌──────────────────────────────────────┐  фон bg/page
       │                                  (✕) │  TopBar      y 8–52
y=52   │              ╭───────╮               │
       │              │  ★    │               │  Illustration y 52–180 (128×128)
y=180  │              ╰───────╯               │
y=196  │        Открой все уровни!            │  Title       y 196–230
y=238  │  Развивающие игры и задания для детей│  Subtitle    y 238–282 (2 строки)
       │       4–8 лет без рекламы            │
y=306  │ ┌──────────────────────────────────┐ │
       │ │ [▣] Все 120 уровней и мини-игр   │ │  Features    y 306–446
       │ │ [▣] Никакой рекламы              │ │
       │ │ [▣] Новые задания каждую неделю  │ │
y=446  │ └──────────────────────────────────┘ │
y=460  │                        [ВЫГОДА 50%]  │  бейдж выходит за карточку на 10px
y=470  │ ┌══════════════════════════════════┐ │
       │ ║ (●) Год               249 ₽      ║ │  OfferCard selected y 470–550
       │ ║     2 990 ₽ в год     в месяц    ║ │
y=550  │ └══════════════════════════════════┘ │
y=562  │ ┌──────────────────────────────────┐ │
       │ │ ( ) Месяц             499 ₽      │ │  OfferCard      y 562–642
       │ │     Оплата каждый месяц в месяц  │ │
y=642  │ └──────────────────────────────────┘ │
       │                                      │  (свободно ~22px)
y=688  ╞══════════════════════════════════════╡  Footer (белый, скруглён сверху)
y=704  │ ┌──────────────────────────────────┐ │
       │ │      Открыть всё за 2 990 ₽      │ │  CTA         y 704–760
y=760  │ └──────────────────────────────────┘ │
y=764  │        Восстановить покупки          │  RestoreLink y 764–808 (зона 44)
y=812  │ Тестовая покупка · Отмена в любой момент │  Legal   y 812–828
y=844  └──────────────────────────────────────┘
```

### 4.2 Дерево слоёв (имена слоёв = имена компонентов в коде)

```
Paywall / Default            Frame 390×844, fill bg/page, Auto layout ↓ vertical, gap 0, padding 0
├── Content                  Auto layout ↓, W Fill, H Fill, padding T8 R20 B24 L20, gap 24, align top-center,
│                            Clip content ON (на коротких экранах контент уходит под футер и скроллится)
│   ├── Header               Auto layout ↓, W Fill, H Hug, gap 0, align center
│   │   ├── TopBar           Auto layout →, W Fill, H 44 (fixed), justify: right (packed right)
│   │   │   └── CloseButton  (instance)
│   │   └── Hero             Auto layout ↓, W Fill, gap 16, align center
│   │       ├── Illustration 128×128 (group/frame, экспорт в SVG)
│   │       └── Texts        Auto layout ↓, W Fill, gap 8, align center
│   │           ├── Title    text style `title`, color text/primary, align center, W Fill
│   │           └── Subtitle text style `body`, color text/secondary, align center, W Fill
│   ├── Features             Auto layout ↓, W Fill, padding 16, gap 12, fill bg/surface, radius 20
│   │   ├── FeatureRow ×3    (instances)
│   └── OfferList            Auto layout ↓, W Fill, gap 12
│       ├── OfferCard (Год, Selected=true, Badge=true)
│       └── OfferCard (Месяц, Selected=false, Badge=false)
└── Footer                   Auto layout ↓, W Fill, H Hug, padding T16 R20 B16 L20, gap 4, align center,
    │                        fill bg/surface, radius 24 24 0 0, effect shadow/footer
    ├── Actions              Auto layout ↓, W Fill, gap 12   (сюда в состояниях добавляется Banner)
    │   └── CtaButton        (instance, State=Default)
    ├── RestoreLink          Auto layout →, H 44 (fixed), W Hug, padding L12 R12, align center
    │   └── «Восстановить покупки»  style `link`, color brand/primary
    └── Legal                «Тестовая покупка · Отмена в любой момент», style `legal`, text/secondary, center
```

Тексты:
- Title: `Открой все уровни!`
- Subtitle: `Развивающие игры и задания для детей` ⏎(Shift+Enter) `4–8 лет без рекламы`
  (тире — длинное «–», en dash; в Windows: Alt+0150)

### 4.3 Компоненты главного экрана

**CloseButton** — Frame 44×44 без заливки (это зона нажатия), Auto layout, всё по центру.
Внутри: Frame 36×36, fill bg/surface, radius 18, Auto layout по центру → иконка `x` 20.
Итого видимый кружок отстоит на 24px от правого края экрана и на 12px от верха.

**Illustration** — Frame 128×128, без auto layout:
- Ellipse 128×128, x0 y0, fill `brand/primary-soft`.
- Star (инструмент Star, в меню рядом с Rectangle): 72×72, по центру (x28 y28), 5 лучей, Ratio 45%,
  Corner radius 6, fill `accent/star`.
- Ellipse 12×12, x100 y14, fill `accent/amber`.
- Ellipse 8×8, x18 y98, fill `brand/primary`.
- Экспорт фрейма: SVG, имя `hero.svg`.

**FeatureRow** — Auto layout →, W Fill, gap 12, align center-left.
- IconBox: Frame 28×28, fill `brand/primary-soft`, radius 8, Auto layout по центру → иконка 16.
- Text: style `feature`, color text/primary, W Fill.
- Тексты: `Все 120 уровней и мини-игр` (gamepad-2), `Никакой рекламы` (shield-check),
  `Новые задания каждую неделю` (sparkles).
- Высота строки = 28 (по IconBox). Features итого: 16 + 28·3 + 12·2 + 16 = **140**.

**OfferCard** — компонент с вариантами `Selected = true / false`, `Badge = true / false`.
- Auto layout →, W Fill, H Hug, padding 16 со всех сторон, gap 12, align center-left.
- Fill bg/surface, radius 20, **Stroke 2 Inside**:
  - Selected=false → stroke `border/default`, без тени;
  - Selected=true → stroke `brand/primary`, effect `shadow/selected`.
- **Clip content — выключить** (иначе бейдж обрежется).
- Дети:
  1. **Radio** — 24×24:
     - false: Ellipse 24×24, без заливки, Stroke 2 Inside `border/radio`;
     - true: Ellipse 24×24 fill `brand/primary` + по центру Ellipse 10×10 fill `#FFFFFF`.
  2. **Info** — Auto layout ↓, W Fill, gap 4:
     - Title (`card-title`, text/primary): `Год` / `Месяц`
     - Subtitle (`caption`, text/secondary): `2 990 ₽ в год` / `Оплата каждый месяц`
  3. **Price** — Auto layout ↓, W Hug, gap 2, align right:
     - Amount (`price`, text/primary, text-align right): `249 ₽` / `499 ₽`
     - Period (`caption`, text/secondary, text-align right): `в месяц`
  4. **Badge** (только Badge=true) — включить **Absolute position** (иконка в правой панели при выделенном
     слое внутри auto layout), Constraints: Right + Top. Положение: отступ справа 16, y = −10.
     Сам бейдж: Auto layout →, padding T3 R8 B3 L8, radius 10, fill `accent/amber`,
     текст `Выгода 50%` style `badge` (Case UPPER), color text/primary. Высота = 20.
- Высота карточки: 2 + 16 + 44 + 16 + 2 = **80** (Info: 22 + 4 + 18 = 44; Price: 24 + 2 + 18 = 44).
  Обводка 2 учитывается в layout (в Figma — «Strokes included in layout»), в CSS это border 2 + padding 16.

**CtaButton** — компонент с вариантами `State = Default / Disabled / Loading`.
- Auto layout →, W Fill, H 56 (fixed), gap 8, всё по центру, radius 16.
- Default: fill `brand/primary`, effect `shadow/cta`, текст `Открыть всё за 2 990 ₽` (`button`, text/on-primary).
- Disabled: fill `brand/primary-disabled`, без тени, текст `Загружаем тарифы…`.
- Loading: fill `brand/primary`, без тени, Spinner + текст `Оформляем покупку…`.
- **Spinner** 20×20: Ellipse 20×20, без заливки, Stroke 3 Center `#FFFFFF`; в панели Ellipse задать
  Arc → Sweep 75% (наведите на эллипс — появится точка «Arc»). Stroke cap — Round.
- В коде: при выборе «Месяц» текст становится `Открыть всё за 499 ₽`. Отдельный фрейм не нужен.

---

## 5. Состояния (отдельные фреймы рядом с главным)

Все — дубликаты `Paywall / Default` (Ctrl+D) с изменениями ниже. Размер 390×844.

### 5.1 `Paywall / Loading` — тарифы загружаются
- В OfferList вместо двух OfferCard — два **Skeleton**: Rectangle W Fill × H 76, radius 20, fill `skeleton`.
- CtaButton → State=Disabled (`Загружаем тарифы…`).
- (В коде скелетоны будут с мягкой анимацией-переливом.)

### 5.2 `Paywall / Offers error` — не удалось загрузить тарифы
- В OfferList вместо карточек один блок **OffersError**:
  Auto layout ↓, W Fill, padding 20, gap 12, align center, fill bg/surface, radius 20.
  - иконка `wifi-off` 24 (`error`);
  - Texts (Auto layout ↓, gap 4, align center):
    `Не удалось загрузить тарифы` (`card-title`, text/primary, center),
    `Проверьте интернет и попробуйте снова` (`caption`, text/secondary, center);
  - **SecondaryButton**: Auto layout →, H 44, padding L20 R20, radius 12, fill `brand/primary-soft`,
    текст `Повторить` (`link`, brand/primary).
- CtaButton → State=Disabled, текст `Открыть всё`.

### 5.3 `Paywall / Purchasing` — идёт покупка
- CtaButton → State=Loading.
- OfferList и RestoreLink — Layer opacity **50%** (заблокированы).

### 5.4 `Paywall / Purchase error` — покупка не прошла
- В `Footer / Actions` **над** CtaButton добавить **Banner** (Type=Error):
  Auto layout →, W Fill, padding 12, gap 10, align center-left, radius 14, fill `error/soft`.
  - иконка `circle-alert` 20 (`error`);
  - текст в одну строку (`banner`, `error/text`, W Fill): `Не удалось оформить покупку`
  - Высота: 12 + 20 + 12 = 44. Между Banner и CTA — 12 (gap группы Actions).
- CtaButton → Default, текст `Попробовать снова`.
- Футер станет выше на 56px (верх на y=632), и низ карточки «Месяц» уйдёт под футер.
  Так и задумано: в браузере контент прокручивается под закреплённым футером, и до прокрутки картина
  будет точно такой же. Убедитесь, что у `Content` включено **Clip content**, а высота — **Fill container**.

### 5.5 `Paywall / Restored` — результат «Восстановить покупки» (по желанию, если есть время)
- Как 5.4, но Banner Type=Info: fill `brand/primary-soft`, иконка `info` (`brand/primary`),
  текст `text/primary`: `Покупки не найдены`.
- Сделайте Banner компонентом с вариантом `Type = Error / Info`.

### 5.6 `Paywall / Success` — покупка прошла

```
Paywall / Success            Frame 390×844, fill bg/page, Auto layout ↓, gap 0
├── Content                  Auto layout ↓, W Fill, H Fill, padding L20 R20, gap 0, align CENTER-center
│   ├── SuccessIcon          Frame 112×112, radius 56, fill success/soft, по центру иконка check 56 (stroke 3, success)
│   ├── (gap 24 — сделайте пустым отступом через Spacer или задайте gap группы ↓)
│   ├── Texts                Auto layout ↓, W Fill, gap 8, align center
│   │   ├── «Готово! Всё открыто»                         title, text/primary, center
│   │   └── «Тариф «Год» активирован.» ⏎ «Приятной игры!» body, text/secondary, center
│   └── Receipt              Auto layout →, W Fill, padding T12 R16 B12 L16, radius 16, fill bg/surface,
│                            justify space-between
│       ├── «Номер покупки»  caption, text/secondary
│       └── «#7F3A2C»        caption + Bold (или отдельный стиль), text/primary
└── Footer                   как на главном, но внутри только CtaButton «Начать играть» (без ссылки и legal)
```
Проще всего: Content — Auto layout ↓, gap 24, children: SuccessIcon, Texts, Receipt; align center по обеим осям.

### 5.7 Интерактивные состояния (рисовать не нужно — сделаю в коде)
- Нажатие на CTA/карточку: `scale(0.98)` + CTA цвет `#5835E8`.
- Фокус с клавиатуры: обводка 2px `brand/primary` с отступом 2px.

---

## 6. Как это нарисовать в Figma — пошагово

Хоткеи (Windows): `F` фрейм · `R` прямоугольник · `O` эллипс · `T` текст · `Shift+A` auto layout ·
`Ctrl+Alt+K` создать компонент · `Ctrl+D` дублировать · `Alt` + наведение = расстояние между слоями ·
`Shift+R` линейки · `Ctrl+Shift+H` скрыть/показать.

### Шаг 1. Файл (2 мин)
1. figma.com → **New design file**. Переименуйте: `Paywall — Kids Game`.
2. Создайте 2 страницы (панель Pages слева, `+`): `Components` и `Screens`.

### Шаг 2. Стили цветов (5 мин)
1. На странице Components нарисуйте квадрат `R` 40×40.
2. В правой панели Fill → введите HEX → нажмите иконку стилей (четыре точки `⋮⋮`) → `+` →
   имя, например `brand/primary` (слэш создаёт папку). Create style.
3. Повторите для всех цветов из таблицы 2.1 (дублируйте квадрат `Ctrl+D`, меняйте HEX, создавайте стиль).

### Шаг 3. Стили текста (5 мин)
1. `T` → напишите «Aa». В правой панели Typography: шрифт **Nunito**, начертание, Size, Line height
   (введите число, например `34` — это px), Letter spacing `0`.
2. Иконка стилей `⋮⋮` → `+` → имя (`title`). Create style.
3. Повторите для всех стилей из 2.2. Для `badge`: в Typography → `…` (Type details) → Case → **AG** (UPPER).

### Шаг 4. Тени (2 мин)
Создайте 3 Effect styles из таблицы 2.3 (см. там же как).

### Шаг 5. Иконки (5 мин)
1. `Shift+I` (Resources) → Plugins → найдите **Lucide Icons** → Run.
2. Вставьте иконки из раздела 3, задайте размеры и stroke, покрасьте стилем цвета.

### Шаг 6. Компоненты (15–20 мин) — на странице Components
Порядок: CloseButton → FeatureRow → OfferCard → CtaButton → Banner.

Как делается любой компонент на auto layout (на примере CtaButton):
1. `T` — текст «Открыть всё за 2 990 ₽», примените стиль `button`, цвет `text/on-primary`.
2. Выделите текст → `Shift+A` — текст обернётся во фрейм с auto layout.
3. В правой панели Auto layout: направление →, gap 8, выравнивание по центру (центральная точка в сетке 3×3),
   padding 0. Ширина фрейма: **Fixed 350**, высота **Fixed 56**.
4. Fill `brand/primary`, Corner radius 16, Effect `shadow/cta`.
5. Переименуйте слой (двойной клик по имени) → `CtaButton`. `Ctrl+Alt+K` — стал компонентом (фиолетовая иконка ◆).
6. **Варианты:** выделите компонент → в правой панели `+` рядом с «Properties»/«Variants» → **Add variant**.
   Появится набор с двумя вариантами. Переименуйте свойство в `State`, значения — `Default`, `Disabled`,
   `Loading`. Во втором/третьем варианте поменяйте заливку/текст/добавьте Spinner согласно 4.3.

Для OfferCard — два свойства: `Selected` (true/false) и `Badge` (true/false). Достаточно трёх вариантов:
`Selected=true, Badge=true`, `Selected=false, Badge=false`, `Selected=false, Badge=true` (последний — по желанию).

Тексты в инстансах можно менять прямо на экране — компонент не ломается.

### Шаг 7. Главный экран (15 мин) — на странице Screens
1. `F` → справа в списке пресетов **Phone → iPhone 14** (390×844). Имя: `Paywall / Default`. Fill `bg/page`.
2. Собирайте **снизу вверх по вложенности** (сначала мелкие группы, потом крупные):
   - Перетащите инстансы из Assets (`Alt+2`) на холст.
   - Выделите Title + Subtitle → `Shift+A` → ↓, gap 8 → назовите `Texts`.
   - Illustration + Texts → `Shift+A` → ↓, gap 16, align center → `Hero`.
   - Создайте TopBar: инстанс CloseButton → `Shift+A` → ширина Fill, высота Fixed 44, выравнивание вправо.
   - TopBar + Hero → `Shift+A` → ↓, gap 0 → `Header`.
   - 3 × FeatureRow → `Shift+A` → ↓, gap 12, padding 16, fill white, radius 20 → `Features`.
   - 2 × OfferCard → `Shift+A` → ↓, gap 12 → `OfferList`.
   - Header + Features + OfferList → `Shift+A` → ↓, gap 24, padding T8 R20 B24 L20 → `Content`.
   - CtaButton → `Shift+A` → `Actions` (↓, gap 12). Actions + RestoreLink + Legal → `Shift+A` → `Footer`
     (↓, gap 4, padding T16 R20 B16 L20, fill white, radius: нажмите иконку «независимые углы» → 24/24/0/0,
     effect `shadow/footer`).
3. Выделите сам фрейм `Paywall / Default` → `Shift+A` → ↓, gap 0, padding 0.
   **Снимите** у фрейма `Hug` по высоте — поставьте **Fixed 844**.
4. Content → высота **Fill container**. Footer → высота Hug. Все дети с шириной → **Fill container**.
   (Fill/Hug/Fixed — выпадающие списки рядом с W и H в правой панели.)
5. Проверка: `Footer` прижат к низу, его верх ровно на **y = 688**; карточка «Год» — на **y = 470**.
   Удерживайте `Alt` и наводите на слои — Figma покажет расстояния. Сверьте со схемой 4.1.

### Шаг 8. Состояния (10 мин)
Выделите `Paywall / Default` → `Ctrl+D` 5 раз → переименуйте и правьте по разделу 5.
Расставьте фреймы в ряд слева направо с шагом 80px.

### Шаг 9. Проверка адаптива (2 мин)
Потяните правый край фрейма Default до ширины **360**, затем **430**: всё должно растягиваться,
тексты не переноситься иначе, бейдж оставаться прижатым вправо. Верните **390**.

### Шаг 10. Экспорт для вёрстки (3 мин)
Создайте в проекте папку `design/` и положите туда:
1. Каждый фрейм-экран: выделить → правая панель Export → `+` → **PNG, 1x** → Export. Имена:
   `01-default.png`, `02-loading.png`, `03-offers-error.png`, `04-purchasing.png`,
   `05-purchase-error.png`, `06-success.png` (`07-restored.png` — если делали).
2. Иллюстрацию: Illustration → Export **SVG** → `hero.svg`.
3. Все иконки, если меняли что-то относительно Lucide, — тоже SVG (имя = имя иконки, например `x.svg`).

PNG я открою и сверю с вёрсткой (в т.ч. оверлеем с прозрачностью 50%).

### Шаг 11. Ссылка (1 мин)
**Share** (справа сверху) → General access: **Anyone with the link** → **can view** → **Copy link**.
Пришлите ссылку — она же пойдёт в README.

---

## 7. Чеклист перед отправкой

- [ ] Все экраны 390×844, имена фреймов `Paywall / …`
- [ ] Заголовок + объяснение ценности, 2 тарифа, выбранный заметен, CTA, «Восстановить покупки», загрузка/ошибка
- [ ] Все цвета и тексты — через стили (в правой панели нет «голых» HEX)
- [ ] Line height везде в px, letter spacing 0
- [ ] Зоны нажатия ≥ 44px: CloseButton 44, RestoreLink 44, CTA 56, карточки 80
- [ ] Footer верх на y=688, «Год» на y=470
- [ ] PNG и SVG в папке `design/`
- [ ] Ссылка с правом просмотра скопирована
