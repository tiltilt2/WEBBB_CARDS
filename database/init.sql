CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Техника ЭПЛ',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, description, price, image, category)
VALUES
(
    'Беспроводные наушники',
    'Удобные наушники с хорошим качеством звука.',
    20000,
    '/img/headphones.jpeg',
    'Наушники'
),
(
    'Механическая клавиатура',
    'Компактная клавиатура для работы и игр.',
    10000,
    '/img/keyboard.jpeg',
    'Клавиатура'
),
(
    'Компьютерная мышь',
    'Удобная беспроводная мышь для компьютера.',
    7000,
    '/img/mouse.jpeg',
    'Мышь'
),
(
    'Тоже беспроводные наушники',
    'Удобные наушники с хорошим качеством звука.',
    52000,
    '/img/airpods.jpeg',
    'Наушники'
),
(
    'Умный комп',
    'Самый классный самый лучший, но дорого',
    132000,
    '/img/imac.jpeg',
    'Компьютер'
),
(
    'Тоже умный комп',
    'И тоже самый классный самый лучший, но дорого',
    89000,
    '/img/macbook.jpeg',
    'Компьютер'
),


