from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg

app = Flask(__name__)
CORS(app)

# データベース接続設定
DB_CONFIG = {
    "dbname": "todo",
    "user": "postgres",
    "password": "password",
    "host": "localhost",
    "port": 5432
}

# ユーザー登録
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # パスワードをそのまま保存
    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id;",
                (username, password)  
            )
            user_id = cur.fetchone()[0]
            conn.commit()

    return jsonify({"id": user_id, "username": username}), 201


# ログイン
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # データベースからユーザー情報を取得
    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, username, password FROM users WHERE username = %s;", (username,))
            user = cur.fetchone()

    # パスワードをそのまま比較
    if user and password == user[2]:  
        return jsonify({"message": "Login successful!", "username": username}), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401


# タスク一覧を取得
@app.route('/tasks', methods=['GET'])
def get_tasks():
    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, title, content, done FROM tasks ORDER BY id;")
            tasks = [
                {"id": row[0], "title": row[1], "content": row[2], "done": row[3]}
                for row in cur.fetchall()
            ]
    return jsonify(tasks)


# 新しいタスクを作成
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')

    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO tasks (title, content, done) VALUES (%s, %s, %s) RETURNING id;",
                (title, content, False)
            )
            task_id = cur.fetchone()[0]
            conn.commit()

    return jsonify({"id": task_id, "title": title, "content": content, "done": False}), 201


# タスクの完了状態を更新
@app.route('/tasks/<int:task_id>', methods=['PATCH'])
def update_task(task_id):
    data = request.get_json()
    done = data.get('done')

    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE tasks SET done = %s WHERE id = %s;",
                (done, task_id)
            )
            conn.commit()

    return jsonify({"id": task_id, "done": done}), 200


# タスクを削除
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM tasks WHERE id = %s;", (task_id,))
            conn.commit()

    return '', 204


if __name__ == '__main__':
    app.run(debug=True)
