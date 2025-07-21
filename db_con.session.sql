-- @block
SELECT * FROM links; 

-- @block
INSERT INTO links (id, token, file_id) VALUES (1, 'test_token', 1);

-- @block
-- First insert a user
INSERT INTO users (googleId, username, usersurname, email) 
VALUES ('123456', 'TestUser', 'TestLastName', 'test@example.com');

-- Then insert a file with id=1
INSERT INTO files (id, filename, original_name, file_path, size, mimetype, user_id) 
VALUES (1, 'test.txt', 'test.txt', '/path/to/file.txt', 1024, 'text/plain', 
       (SELECT id FROM users LIMIT 1));

-- @block
-- Now you can insert the link
INSERT INTO links (id, token, file_id) VALUES (1, 'test_token', 1);

-- @block
DELETE FROM links WHERE id = 11;

-- @block
SELECT * FROM files;

-- @block
SELECT * FROM users;

-- @block
SELECT * FROM fileAccess;