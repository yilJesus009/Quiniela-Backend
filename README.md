# Quiniela Mundial 2026 — Backend

API REST construida con NestJS + TypeORM + PostgreSQL.

---

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+

---

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# 3. Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE quiniela2026;"

# 4. Ejecutar el schema (crea las tablas)
psql -U postgres -d quiniela2026 -f db/schema.sql

# 5. Ejecutar el seed (estadios + partidos de ejemplo)
psql -U postgres -d quiniela2026 -f db/seed.sql

# 6. Levantar en modo desarrollo
npm run start:dev
```

El servidor queda disponible en http://localhost:8000

---

## Endpoints disponibles

Todas las rutas llevan el prefijo /api.

### Auth (públicas)
POST   /api/register
POST   /api/login
POST   /api/logout         (requiere token)

### Perfil
GET    /api/profile

### Partidos
GET    /api/matches                          (filtros: ?phase= ?status= ?date= ?next=true)
GET    /api/matches/updates?since=ISO_DATE
GET    /api/matches/:id

### Grupos
GET    /api/groups
POST   /api/groups
POST   /api/groups/join
GET    /api/groups/:id
GET    /api/groups/:id/leaderboard

### Pronósticos
POST   /api/predictions
GET    /api/predictions/me

### Estadios
GET    /api/stadiums
GET    /api/stadiums/:id
GET    /api/stadiums/:id/matches

### Admin (requiere rol admin)
POST   /api/admin/matches
PATCH  /api/admin/matches/:id

---

## Usuario admin por defecto

El seed crea admin@quiniela.com con un hash placeholder.
Para generar el hash real, ejecutá una sola vez:

  node -e "const b=require('bcryptjs');b.hash('admin1234',10).then(h=>console.log(h));"

Luego actualizá en psql:
  UPDATE users SET password = 'EL_HASH' WHERE email = 'admin@quiniela.com';

---

## Sincronización con thesportsdb.com

El cron se ejecuta cada 20 minutos automáticamente.
Los partidos necesitan el campo external_id con el ID del evento en thesportsdb.
Se asigna con: PATCH /api/admin/matches/:id  { "external_id": "ID" }

---

## Sistema de puntuación

Marcador exacto (2-1 vs 2-1)     → 3 puntos  → correct_score
Ganador correcto (2-1 vs 3-0)    → 1 punto   → correct_winner
Empate correcto  (1-1 vs 0-0)    → 1 punto   → correct_winner
Pronóstico incorrecto             → 0 puntos  → incorrect
