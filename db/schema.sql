-- ============================================================
-- QUINIELA MUNDIAL 2026 - Schema PostgreSQL
-- ============================================================

-- Limpiar si ya existe (útil para desarrollo)
DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS group_members CASCADE;
DROP TABLE IF EXISTS groups CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS stadiums CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'user', -- 'user' | 'admin'
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TOKENS (para manejar logout / revocación)
-- ============================================================
CREATE TABLE tokens (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(512) NOT NULL UNIQUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- STADIUMS (16 sedes del Mundial 2026)
-- ============================================================
CREATE TABLE stadiums (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)   NOT NULL,
    city        VARCHAR(255)   NOT NULL,
    country     VARCHAR(100)   NOT NULL,
    latitude    DECIMAL(10, 7) NOT NULL,
    longitude   DECIMAL(10, 7) NOT NULL,
    capacity    INTEGER        NOT NULL,
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MATCHES
-- ============================================================
CREATE TABLE matches (
    id                  SERIAL PRIMARY KEY,
    home_team           VARCHAR(100)   NOT NULL,
    away_team           VARCHAR(100)   NOT NULL,
    match_date          TIMESTAMP      NOT NULL,
    phase               VARCHAR(50)    NOT NULL,
    -- Valores: group | round_of_32 | round_of_16 | quarter | semi | third_place | final
    group_name          VARCHAR(10),
    -- Solo aplica para fase de grupos (ej: 'A', 'B', etc). NULL en fases eliminatorias.
    stadium_id          INTEGER        REFERENCES stadiums(id) ON DELETE SET NULL,
    status              VARCHAR(20)    NOT NULL DEFAULT 'scheduled',
    -- Valores: scheduled | live | finished
    home_score          INTEGER,
    -- NULL hasta que el partido inicie
    away_score          INTEGER,
    -- NULL hasta que el partido inicie
    external_id         VARCHAR(100),
    -- ID del partido en thesportsdb.com para sincronización
    updated_at          TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at_score    TIMESTAMP,
    -- Se actualiza SOLO cuando cambia el resultado (usado para sincronización incremental)
    created_at          TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ============================================================
-- GROUPS
-- ============================================================
CREATE TABLE groups (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    invite_code VARCHAR(8)   NOT NULL UNIQUE,
    -- Siempre 8 caracteres en mayúsculas (ej: ABCD1234)
    owner_id    INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- GROUP_MEMBERS (tabla pivot users <-> groups)
-- ============================================================
CREATE TABLE group_members (
    id          SERIAL PRIMARY KEY,
    group_id    INTEGER   NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id     INTEGER   NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (group_id, user_id)
    -- Un usuario no puede estar dos veces en el mismo grupo
);

-- ============================================================
-- PREDICTIONS
-- ============================================================
CREATE TABLE predictions (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER   NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    match_id        INTEGER   NOT NULL REFERENCES matches(id)  ON DELETE CASCADE,
    home_score      INTEGER   NOT NULL,
    away_score      INTEGER   NOT NULL,
    points_earned   INTEGER   NOT NULL DEFAULT 0,
    status          VARCHAR(30) NOT NULL DEFAULT 'pending',
    -- Valores: pending | correct_score | correct_winner | incorrect
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, match_id)
    -- Un usuario solo puede tener un pronóstico por partido (upsert)
);

-- ============================================================
-- ÍNDICES para consultas frecuentes
-- ============================================================
CREATE INDEX idx_matches_status       ON matches(status);
CREATE INDEX idx_matches_phase        ON matches(phase);
CREATE INDEX idx_matches_date         ON matches(match_date);
CREATE INDEX idx_matches_updated_at_score ON matches(updated_at_score);
CREATE INDEX idx_predictions_user     ON predictions(user_id);
CREATE INDEX idx_predictions_match    ON predictions(match_id);
CREATE INDEX idx_group_members_user   ON group_members(user_id);
CREATE INDEX idx_group_members_group  ON group_members(group_id);
CREATE INDEX idx_tokens_user          ON tokens(user_id);
CREATE INDEX idx_tokens_token         ON tokens(token);
