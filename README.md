# Цепочка обмена — frontend

Клиентская часть MVP сервиса многостороннего обмена (Кейс 6, Avito Start).

## Стек

- **React 19** + **TypeScript** (strict)
- **Vite** — сборка и dev-сервер
- **TanStack Query** — серверное состояние (запросы к Go-бэкенду)
- **Zustand** — клиентское состояние
- **oxlint** — линтер, **Prettier** — форматирование
- Структура — Feature-Sliced Design (`app / pages / widgets / features / entities / shared`)

## Команды

```bash
pnpm install      # установка зависимостей
pnpm dev          # dev-сервер (http://localhost:5173)
pnpm build        # прод-сборка в dist/
pnpm preview      # локальный просмотр прод-сборки
pnpm lint         # линт (oxlint)
pnpm format       # форматирование (prettier --write)
```

## Docker

```bash
docker build -t avito-chain-front .
docker run -p 8080:80 avito-chain-front
```

Многостадийная сборка (Node → сборка, nginx → раздача статики) с SPA-fallback.
В общем `docker-compose.yml` монорепо поднимается вместе с Go-бэкендом; проксирование
`/api` на бэкенд — в `nginx.conf`.
