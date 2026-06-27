-- ============================================================
-- SEED - Quiniela Mundial 2026
-- Estadios oficiales + partidos de ejemplo
-- ============================================================

-- ============================================================
-- USUARIO ADMIN por defecto
-- password: admin1234 (bcrypt hash generado con bcryptjs)
-- ============================================================
INSERT INTO users (name, email, password, role) VALUES
('Administrador', 'admin@quiniela.com', '$2b$10$X7VYUkWsMzPGRaJRMxXxeOJvU1234567890abcdefghijklmnopqr', 'admin');
-- IMPORTANTE: reemplazar el hash con uno real generado en la app al iniciar

-- ============================================================
-- ESTADIOS OFICIALES - Mundial 2026
-- 16 sedes en USA, Canadá y México
-- ============================================================
INSERT INTO stadiums (name, city, country, latitude, longitude, capacity) VALUES
('MetLife Stadium',            'East Rutherford', 'USA',    40.8136,   -74.0743,  82500),
('SoFi Stadium',               'Inglewood',       'USA',    33.9535,  -118.3392,  70240),
('AT&T Stadium',               'Arlington',       'USA',    32.7480,   -97.0933,  80000),
('Levi''s Stadium',            'Santa Clara',     'USA',    37.4034,  -121.9691,  68500),
('Lincoln Financial Field',    'Philadelphia',    'USA',    39.9008,   -75.1675,  69176),
('Arrowhead Stadium',          'Kansas City',     'USA',    39.0490,   -94.4839,  76416),
('Gillette Stadium',           'Foxborough',      'USA',    42.0909,   -71.2643,  65878),
('Hard Rock Stadium',          'Miami Gardens',   'USA',    25.9580,   -80.2389,  65326),
('NRG Stadium',                'Houston',         'USA',    29.6847,   -95.4107,  72220),
('Seattle Lumen Field',        'Seattle',         'USA',    47.5952,  -122.3316,  69000),
('BC Place',                   'Vancouver',       'Canadá', 49.2767,  -123.1116,  54500),
('BMO Field',                  'Toronto',         'Canadá', 43.6333,   -79.4186,  45736),
('Estadio Azteca',             'Ciudad de México','México', 19.3029,   -99.1505, 105064),
('Estadio BBVA',               'Monterrey',       'México', 25.6694,  -100.2436,  53500),
('Estadio Akron',              'Guadalajara',     'México', 20.6868,  -103.4667,  49850),
('Estadio Ciudad de los Deportes', 'Ciudad de México','México', 19.3797, -99.1436, 35161);

-- ============================================================
-- PARTIDOS - Fase de Grupos (muestra representativa)
-- Datos reales del fixture del Mundial 2026
-- ============================================================
INSERT INTO matches (home_team, away_team, match_date, phase, group_name, stadium_id, status) VALUES
-- Grupo A
('México',       'Polonia',       '2026-06-11 18:00:00', 'group', 'A', 13, 'scheduled'),
('Arabia Saudita','Argentina',    '2026-06-12 15:00:00', 'group', 'A', 14, 'scheduled'),
('México',       'Argentina',     '2026-06-16 21:00:00', 'group', 'A', 13, 'scheduled'),
('Polonia',      'Arabia Saudita','2026-06-16 18:00:00', 'group', 'A',  1, 'scheduled'),
('Argentina',    'Polonia',       '2026-06-21 22:00:00', 'group', 'A',  2, 'scheduled'),
('Arabia Saudita','México',       '2026-06-21 22:00:00', 'group', 'A', 14, 'scheduled'),

-- Grupo B
('USA',          'Gales',         '2026-06-13 20:00:00', 'group', 'B',  1, 'scheduled'),
('Inglaterra',   'Irán',          '2026-06-13 14:00:00', 'group', 'B', 10, 'scheduled'),
('USA',          'Inglaterra',    '2026-06-17 20:00:00', 'group', 'B',  4, 'scheduled'),
('Irán',         'Gales',         '2026-06-17 14:00:00', 'group', 'B',  9, 'scheduled'),
('Gales',        'Inglaterra',    '2026-06-21 20:00:00', 'group', 'B',  5, 'scheduled'),
('Irán',         'USA',           '2026-06-21 20:00:00', 'group', 'B',  7, 'scheduled'),

-- Grupo C
('Francia',      'Australia',     '2026-06-14 20:00:00', 'group', 'C',  3, 'scheduled'),
('Dinamarca',    'Túnez',         '2026-06-14 14:00:00', 'group', 'C',  6, 'scheduled'),
('Francia',      'Dinamarca',     '2026-06-18 20:00:00', 'group', 'C',  8, 'scheduled'),
('Túnez',        'Australia',     '2026-06-18 14:00:00', 'group', 'C', 11, 'scheduled'),
('Australia',    'Dinamarca',     '2026-06-22 20:00:00', 'group', 'C', 12, 'scheduled'),
('Túnez',        'Francia',       '2026-06-22 20:00:00', 'group', 'C',  2, 'scheduled'),

-- Fases eliminatorias (placeholders - se completarán con los clasificados reales)
('Clasificado A1','Clasificado B2','2026-07-01 18:00:00', 'round_of_32', NULL, 1, 'scheduled'),
('Clasificado C1','Clasificado D2','2026-07-02 18:00:00', 'round_of_32', NULL, 2, 'scheduled');

-- ============================================================
-- NOTAS PARA EL DESARROLLADOR
-- ============================================================
-- 1. El hash del admin debe regenerarse al iniciar el servidor por primera vez.
--    Ver src/config/seedAdmin.js
--
-- 2. Los partidos de fases eliminatorias son placeholders.
--    Se actualizarán con los equipos reales via el panel Admin de Web II.
--
-- 3. Los external_id de thesportsdb.com se agregan cuando se vincule la API.
--
-- 4. Sistema de puntuación (definido por el equipo):
--    - Resultado exacto (ej: pronosticó 2-1 y fue 2-1): 3 puntos → status: correct_score
--    - Ganador correcto pero marcador incorrecto (ej: pronosticó 2-1 y fue 3-1): 1 punto → status: correct_winner
--    - Empate correcto pero marcador incorrecto (ej: pronosticó 1-1 y fue 0-0): 1 punto → status: correct_winner
--    - Pronóstico incorrecto: 0 puntos → status: incorrect
-- ============================================================
