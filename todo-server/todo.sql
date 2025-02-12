DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'Medium',
    status VARCHAR(20) DEFAULT '未完了', 
    progress INTEGER DEFAULT 0,  -- 進捗度を追加
    FOREIGN KEY (user_id) REFERENCES users(id)
);
