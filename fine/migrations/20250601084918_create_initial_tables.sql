CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegramId TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  balance INTEGER NOT NULL DEFAULT 1000, -- ₱10.00 in centavos
  inviteCount INTEGER NOT NULL DEFAULT 0,
  lastGuessTime TIMESTAMP,
  dailyGuessCount INTEGER NOT NULL DEFAULT 0,
  lastResetDate TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE withdrawals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  gcashNumber TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrerId INTEGER NOT NULL,
  referredId INTEGER NOT NULL,
  rewarded BOOLEAN NOT NULL DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referrerId) REFERENCES users(id),
  FOREIGN KEY (referredId) REFERENCES users(id)
);

CREATE TABLE countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  flag TEXT NOT NULL
);

-- Insert some initial countries data
INSERT INTO countries (code, name, flag) VALUES
('PH', 'Philippines', '🇵🇭'),
('US', 'United States', '🇺🇸'),
('JP', 'Japan', '🇯🇵'),
('GB', 'United Kingdom', '🇬🇧'),
('FR', 'France', '🇫🇷'),
('DE', 'Germany', '🇩🇪'),
('IT', 'Italy', '🇮🇹'),
('CA', 'Canada', '🇨🇦'),
('AU', 'Australia', '🇦🇺'),
('BR', 'Brazil', '🇧🇷'),
('CN', 'China', '🇨🇳'),
('IN', 'India', '🇮🇳'),
('RU', 'Russia', '🇷🇺'),
('ZA', 'South Africa', '🇿🇦'),
('MX', 'Mexico', '🇲🇽'),
('AR', 'Argentina', '🇦🇷'),
('ES', 'Spain', '🇪🇸'),
('KR', 'South Korea', '🇰🇷'),
('SG', 'Singapore', '🇸🇬'),
('NZ', 'New Zealand', '🇳🇿');