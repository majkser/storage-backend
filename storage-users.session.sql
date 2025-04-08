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

CREATE TABLE files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    size BIGINT NOT NULL,
    mimetype VARCHAR(100) NOT NULL,
    user_id VARCHAR(36),
    parent_folder_id BIGINT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id)

);


-- @block
DROP TABLE users;

-- @block
SELECT * FROM users;

-- @block
DELETE FROM users WHERE id = 6;