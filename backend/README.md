# Backend - CaféHub

API REST para autenticación, catálogo de cafés, favoritos, reseñas y administración.

## Requisitos

- Node.js 18+
- MongoDB (local o Docker)

## Configuración

- Copiar `.env.example` a `.env` y ajustar valores.

## Levantar MongoDB (Docker)

Desde `backend/`:

```bash
docker compose up -d mongodb
```

## Ejecutar backend

Desde `backend/`:

```bash
npm install
npm run dev
```

Servidor: `http://localhost:3000`

## Documentación de API (Swagger)

- UI: `http://localhost:3000/api-docs`
- Fuente: [swagger.yaml](file:///c:/Users/Maria/cafehud/backend/swagger.yaml)

## Endpoints principales (base: /api/v1)

- Auth: `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout`
- Cafés: `/cafes`, `/cafes/:id`, `/cafes/:id/vote`, `/cafes/:id/reviews`
- Favoritos: `/favorites`, `/favorites/:cafeId/toggle`
- Reseñas: `/reviews/mine`, `/reviews/:reviewId`
- Admin: `/admin/*`

## Tests (Jest)

Desde `backend/`:

```bash
npm test
```

Pruebas críticas:
- Auth: [tests/auth.test.js](file:///c:/Users/Maria/cafehud/backend/tests/auth.test.js)
- Cafés + flujo protegido: [tests/cafes.test.js](file:///c:/Users/Maria/cafehud/backend/tests/cafes.test.js)
