#import requests
from logging import FileHandler,WARNING
from collections import defaultdict
from datetime import datetime
from psycopg2 import pool
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt 


app = Flask(__name__)
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

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)

