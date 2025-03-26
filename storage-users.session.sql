-- @block
CREATE TABLE users(
    id VARCHAR(36) DEFAULT (UUID()) PRIMARY KEY,
    googleId VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    usersurname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
DROP TABLE users;

-- @block
SELECT * FROM users;

-- @block
DELETE FROM users WHERE id = 6;