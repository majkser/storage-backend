-- @block
CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    usersurname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- @block
DROP TABLE users;

-- @block
SELECT * FROM users;

-- @block
DELETE FROM users WHERE id = 6;