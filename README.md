# Paywall для детской игры

Мобильный paywall для webview: два тарифа, тестовая покупка с записью в БД, восстановление покупок.
Nuxt 4 + TypeScript, frontend и backend в одном проекте.

- **Figma:** https://www.figma.com/design/2veZOBASXHkRIt48uzPKp6/Untitled?node-id=1-36
- **Demo:** https://amaya-soft-test.vercel.app · демо ошибок: `/?fail=offers`, `/?fail=purchase`, `/?fail=restore`

## Запуск локально

```bash
npm install
npm run dev          # http://localhost:3000
```

БД настраивать не нужно: без `DATABASE_URL` в dev используется [PGlite](https://pglite.dev) — Postgres в WASM, данные в `.data/`.
Чтобы работать с Neon, скопируйте `.env.example` → `.env`. Проверки: `npm run lint`, `npm run typecheck`.

Dev-инструменты для сверки с макетом: `/?state=loading|offers-error|purchasing|purchase-error|restored|success`
фиксирует экран в нужном состоянии, `&overlay` накладывает PNG из Figma с прозрачностью 50%.

## Где что лежит

| | |
|---|---|
| Frontend | страница `app/pages/index.vue`; компоненты `app/components/ui/` (примитивы), `paywall/` (блоки экрана), `dev/` (сверка с макетом); логика состояний — `app/composables/usePaywall.ts` |
| Server routes | `server/api/offers.get.ts`, `purchase.post.ts`, `restore.post.ts` |
| БД | схема `server/db/schema.ts`, подключение `server/utils/db.ts` |
| Общее | `shared/` — типы и форматирование цены для клиента и сервера |
| Макет | `docs/design-spec.md` (спецификация), `figma-plugin/` (генератор макета), `design/` (экспорт PNG) |

Сервер — источник правды по тарифам: клиент передаёт только `offerId`. Покупка идемпотентна (`idempotencyKey`):
ретрай после обрыва сети не создаст дубль. Вход валидируется Zod.

## Деплой и БД

**Vercel + Neon Postgres.** Vercel запускает Nuxt server routes без настройки, Neon подключается к нему из Marketplace
в один клик и сам прописывает `DATABASE_URL`. Neon работает по HTTP, поэтому подходит для serverless.
Таблица одна, поэтому она создаётся идемпотентно при первом запросе (`CREATE TABLE IF NOT EXISTS`) вместо миграций.

## AI-инструменты

**Claude Code** — спецификация макета, Figma-плагин (макет собран им на Auto Layout, со стилями и компонентами, затем
проверен вручную), код проекта.

Что проверено:
- pixel perfect: скриншоты 390×844 @2x (Playwright) сравнены с PNG из Figma (pixelmatch) — **99.65–99.98%** по всем 7
  состояниям; остаток — сглаживание шрифтов. Найдено и исправлено расхождение высоты карточки (обводка в layout Figma);
- API: успешная покупка, повтор с тем же ключом, конфликт ключа (409), неизвестный тариф и невалидное тело (400), restore;
- сценарий в браузере: выбор тарифа → покупка → успех, восстановление, ошибка и повтор, ширины 360/390/430 и 360×640;
- прод: покупка пишется в Neon, повтор с тем же ключом не создаёт дубль, restore читает запись из БД.

## Если бы было ещё 2 часа

- **Родительский контроль** перед покупкой — требование App Store для категории Kids.
- Реальный мост с нативным приложением: сейчас `postToHost` отправляет события, но покупка тестовая.
- Компактная раскладка для низких экранов (≤ 640 px): сейчас тарифы там доступны только после прокрутки.
- Playwright-тесты и визуальная регрессия против макета в CI (скрипты сверки пока вне репозитория).
- Миграции через drizzle-kit, rate limit на `/api/purchase`.
