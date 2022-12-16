#import requests
from logging import FileHandler,WARNING
from collections import defaultdict
from datetime import datetime
from psycopg2 import pool
from flask import Flask, request, jsonify,session
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt 


app = Flask(__name__)
app.secret_key = "super secret key"
file_handler = FileHandler('errorlog.txt')
file_handler.setLevel(WARNING)
cors = CORS(app,supports_credentials=True)
bcrypt = Bcrypt(app)

postgreSQL_pool = pool.SimpleConnectionPool(
    1, 1000, database="exampledb", user="docker", password="docker", host="127.0.0.1"
)

app.config['postgreSQL_pool'] = postgreSQL_pool

@app.route("/")
def health_check():
    return "I am health!"

@app.route("/@me")
def get_current_user():
    user_id = session.get("id")

    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    connection = postgreSQL_pool.getconn()
    cursor = connection.cursor()
    sql = f"SELECT * FROM users WHERE id='{user_id}'"
    cursor.execute(sql)
    row = cursor.fetchone()
    return jsonify(
        row[0],row[8]
    ) 

@app.route("/registration",methods=["POST"])
def registration():
    username =  request.json["username"]
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    adress = request.json["adress"]
    city = request.json["city"]
    state = request.json["state"]
    phone_number = request.json["phone_number"]
    email = request.json["email"]
    password = request.json["password"]

    connection = postgreSQL_pool.getconn()
    cursor = connection.cursor()
    query_username_email = f"SELECT email, username FROM users WHERE email like '{email}' AND username like '{username}'"
    query_email = f"SELECT email, username FROM users WHERE email like '{email}'"
    query_username = f"SELECT email, username FROM users WHERE username like '{username}'"
    cursor.execute(query_username_email)
    result_username_email = cursor.fetchall()
    cursor.execute(query_email)
    result_email = cursor.fetchall()
    cursor.execute(query_username)
    resault_username = cursor.fetchall()
    if len(resault_username) == 0 and len(result_email) == 0:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        insert_statement = f"INSERT INTO users (username, first_name, last_name, adress, city, state, phone_number, email, password) VALUES ('{username}', '{first_name}', '{last_name}', '{adress}', '{city}', '{state}', '{phone_number}', '{email}', '{hashed_password}')"
        cursor.execute(insert_statement)
        connection.commit()
        print("Korisnik je dodat")
    elif len(result_username_email) == 1:
        print("Korisnik je vec registrovan, prijavite se.")
    elif len(result_email) == 1 and len(resault_username) == 0:
        print("Email je zauzet od strane drugog korisnika.")
    elif len(resault_username) == 1 and len(result_email) == 0:
        print("Username je zauzet od strane drugog korisnika.")

    return jsonify(request.json)

@app.route("/login",methods=["POST"])
def login():
    _email = request.json["email"]
    _password = request.json["password"]
    if _email and _password:
        connection = postgreSQL_pool.getconn()
        cursor = connection.cursor()
        sql = f"SELECT * FROM users WHERE email='{_email}'"
        cursor.execute(sql)
        row = cursor.fetchone()
        user_id = row[0]
        email = row[8]
        password = row[9]
        if row:
            if bcrypt.check_password_hash(password,_password):
                session['id'] = user_id
                cursor.close()
                return jsonify({'message' : 'You are logged in successfully'})
            else:
                resp = jsonify({'message' : 'Bad Request - invalid password'})
                resp.status_code = 400
                return resp
    else:
        resp = jsonify({'message' : 'Bad Request - invalid password'})
        resp.status_code = 400
        return resp

@app.route('/logout', methods=["POST"])
def logout():
    if 'id' in session:
        session.pop('id',None)
    return jsonify({'message':'You successfully logged out'})

@app.route("/change_personal_info",methods=["POST"])
def change_personal_info():
    username =  request.json["username"]
    first_name = request.json["first_name"]
    last_name = request.json["last_name"]
    adress = request.json["adress"]
    city = request.json["city"]
    state = request.json["state"]
    phone_number = request.json["phone_number"]
    email = request.json["email"]
    password = request.json["password"]

    connection = postgreSQL_pool.getconn()
    cursor = connection.cursor()

    if (len(username) != 0):
        query_update = f"UPDATE users SET username = '{username}' WHERE email LIKE '{session['email']};"
        query_username = f"SELECT username FROM users WHERE username like '{username}'"
        cursor.execute(query_username)
        resault_username = cursor.fetchall()
        if(len(resault_username) == 0):
            cursor.execute(query_update)
            connection.commit()
        else:
            print("Username is already in use!")
    if (len(first_name) != 0):
        query_update = f"UPDATE users SET first_name = '{first_name}' WHERE email LIKE '{session['email']};"
        cursor.execute(query_update)
        connection.commit()
    if (len(last_name) != 0):
        query_update = f"UPDATE users SET last_name = '{last_name}' WHERE email LIKE '{session['email']};"
        cursor.execute(query_update)
        connection.commit()
    if (len(adress) != 0):
        query_update = f"UPDATE users SET adress = '{adress}' WHERE email LIKE '{session['email']};"
        cursor.execute(query_update)
        connection.commit()
    if (len(city) != 0):
        query_update = f"UPDATE users SET city = '{city}' WHERE email LIKE '{session['email']};"
        cursor.execute(query_update)
        connection.commit()
    if (len(state) != 0):
        query_update = f"UPDATE users SET state = '{state}' WHERE email LIKE '{session['email']};"
        cursor.execute(query_update)
        connection.commit()
    if (len(phone_number) != 0):
        query_update = f"UPDATE users SET phone_number = '{phone_number}' WHERE email LIKE '{session['email']};"
        cursor.execute(query_update)
        connection.commit()
    if (len(email) != 0):
        query_update = f"UPDATE users SET email = '{email}' WHERE email LIKE '{session['email']};"
        query_email = f"SELECT username FROM users WHERE username like '{email}'"
        cursor.execute(query_email)
        resault_email = cursor.fetchall()
        if(len(resault_email) == 0):
            cursor.execute(query_update)
            connection.commit()
            session['email'] = email
        else:
            print("Email is already in use!")
    if (len(password) != 0):
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        query_update = f"UPDATE users SET password = '{hashed_password}' WHERE email LIKE '{session['email']};"
        cursor.execute(query_update)
        connection.commit()

    return jsonify(request.json)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
