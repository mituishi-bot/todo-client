from flask import Flask, jsonify, request 
from flask_cors import CORS
import psycopg
import jwt
import datetime
from functools import wraps

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

# JWT秘密鍵
SECRET_KEY = "your_secret_key"


# # トークン検証用デコレーター
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # Bearer トークンの形式
        
        if not token:
            return jsonify({"message": "Token is missing!"}), 403
        
        try:
            # トークンをデコードしてユーザー情報を取り出す
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user_id = data['user_id']
            print(f"Current User ID: {current_user_id}")  # ここでユーザーIDを確認
        except:
            return jsonify({"message": "Token is invalid!"}), 403
        
        return f(current_user_id, *args, **kwargs)
    return decorated_function


# ユーザー登録
@app.route('/register', methods=['POST'])
#クライアントからユーザー名とパスワードを受け取り、データベースに保存
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (username, password) VALUES (%s, %s) RETURNING id;",
                (username, password)
            )
            user_id = cur.fetchone()[0]
            conn.commit()

    return jsonify({"id": user_id, "username": username}), 201
#新しいユーザーのIDとユーザー名を返します。


# ログイン
@app.route('/login', methods=['POST'])
def login():
    #クライアントから送信されたユーザー名とパスワードを検証。
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # データベースからユーザー情報を取得
    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, username, password FROM users WHERE username = %s;", (username,))
            user = cur.fetchone()

    if user and password == user[2]:  # パスワードをそのまま比較
        # JWTトークンを生成
        token = jwt.encode({'user_id': user[0], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, SECRET_KEY, algorithm="HS256")
        return jsonify({
            "message": "Login successful!",
            "token":token,
            "user_id": user[0],  # user_id を返す
            "username": user[1]  # username を返す
        }), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401


# タスク一覧を取得
@app.route('/tasks', methods=['GET'])
@token_required
def get_tasks(current_user_id):
    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT id, title, content, done, due_date, status FROM tasks WHERE user_id = %s ORDER BY id;", (current_user_id,))
            tasks = [
                {"id": row[0], "title": row[1], "content": row[2], "done": row[3], "due_date": row[4], "status": row[5]}
                for row in cur.fetchall()
            ]
    return jsonify(tasks)


# 新しいタスクを作成
@app.route('/tasks', methods=['POST'])
@token_required
def add_task(current_user_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    due_date = data.get('due_date')  # 期限日を受け取る
    status = data.get('status', '未完了')  # ステータス（デフォルトは未完了）
    done = False  # 初期状態では未完了にする
    
    if title and content:
        try:
            with psycopg.connect(**DB_CONFIG) as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO tasks (user_id, title, content, done, due_date, status) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id;",
                        (current_user_id, title, content, done, due_date, status)
                    )
                    task_id = cur.fetchone()[0]
            return jsonify({"id": task_id, "title": title, "content": content, "done": done, "due_date": due_date, "status": status}), 201
        except Exception as e:
            return jsonify({"error": "タスクの追加に失敗しました。"}), 500
    else:
        return jsonify({"error": "タイトルと内容は必須です。"}), 400


# タスクの完了状態を更新
@app.route('/tasks/<int:task_id>', methods=['PATCH'])
@token_required
def update_task(current_user_id, task_id):
    data = request.get_json()
    done = data.get('done')

    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE tasks SET done = %s WHERE id = %s AND user_id = %s;",
                (done, task_id, current_user_id)
            )
            conn.commit()

    return jsonify({"id": task_id, "done": done}), 200


# タスクを削除
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user_id, task_id):
    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM tasks WHERE id = %s AND user_id = %s;", (task_id, current_user_id))
            conn.commit()

    return '', 204


# タスクの内容を更新
@app.route('/tasks/<int:task_id>', methods=['PUT'])
@token_required
def edit_task(current_user_id, task_id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    due_date = data.get('due_date')  # 期限日も受け取る
    status = data.get('status')  # ステータスを受け取る（更新用）

    with psycopg.connect(**DB_CONFIG) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE tasks SET title = %s, content = %s, due_date = %s, status = %s WHERE id = %s AND user_id = %s;",
                (title, content, due_date, status, task_id, current_user_id)
            )
            conn.commit()

    return jsonify({"id": task_id, "title": title, "content": content, "due_date": due_date, "status": status}), 200


if __name__ == '__main__':
    app.run(debug=True)
