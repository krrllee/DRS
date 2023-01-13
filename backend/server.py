import requests
from logging import FileHandler,WARNING
from collections import defaultdict
from datetime import datetime
from psycopg2 import pool
from flask import Flask, request, jsonify,session
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt 
from logic import Transaction, format_db_row_to_transaction
from logic import BOUGHT, SOLD
from pycoingecko import CoinGeckoAPI

LIVE_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price"

cg = CoinGeckoAPI()

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
        row[0],row[8],row[9]
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
    query_username_email = f"SELECT email, username FROM users WHERE email like %s AND username like %s"
    query_email = f"SELECT email, username FROM users WHERE email like %s"
    query_username = f"SELECT email, username FROM users WHERE username like %s"
    cursor.execute(query_username_email, [email, username])
    result_username_email = cursor.fetchall()
    cursor.execute(query_email, [email])
    result_email = cursor.fetchall()
    cursor.execute(query_username, [username])
    resault_username = cursor.fetchall()
    if len(resault_username) == 0 and len(result_email) == 0:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        insert_statement = f"INSERT INTO users (username, first_name, last_name, adress, city, state, phone_number, email, password) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(insert_statement, [username, first_name, last_name, adress, city, state, phone_number, email, hashed_password])
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
        sql = f"SELECT * FROM users WHERE email = %s"
        cursor.execute(sql, [_email])
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

    id = request.json["id"]
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
        query_update = f"UPDATE users SET username = %s WHERE id='{id}';"
        query_username = f"SELECT username FROM users WHERE username like %s"
        cursor.execute(query_username, [username])
        resault_username = cursor.fetchall()
        if(len(resault_username) == 0):
            cursor.execute(query_update, [username])
            connection.commit()
        else:
            print("Username is already in use!")
    if (len(first_name) != 0):
        query_update = f"UPDATE users SET first_name = %s WHERE id='{id}';"
        cursor.execute(query_update, [first_name])
        connection.commit()
    if (len(last_name) != 0):
        query_update = f"UPDATE users SET last_name = %s WHERE id='{id}';"
        cursor.execute(query_update, [last_name])
        connection.commit()
    if (len(adress) != 0):
        query_update = f"UPDATE users SET adress = %s WHERE id='{id}';"
        cursor.execute(query_update, [adress])
        connection.commit()
    if (len(city) != 0):
        query_update = f"UPDATE users SET city = %s WHERE id='{id}';"
        cursor.execute(query_update, [city])
        connection.commit()
    if (len(state) != 0): 
        query_update = f"UPDATE users SET state = %s WHERE id='{id}';"
        cursor.execute(query_update, [state])
        connection.commit()
    if (len(phone_number) != 0):
        query_update = f"UPDATE users SET phone_number = %s WHERE id='{id}';"
        cursor.execute(query_update, [phone_number])
        connection.commit()
    if (len(email) != 0):
        query_update = f"UPDATE users SET email = %s WHERE id='{id}';"
        cursor.execute(query_update, [email])
        connection.commit()
    if (len(password) != 0):
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        query_update = f"UPDATE users SET password = %s WHERE id='{id}';"
        cursor.execute(query_update, [hashed_password])
        connection.commit()
    return jsonify(request.json)

@app.route("/add_transaction",methods=["POST"])
def add_transaction():
    user_id = int(request.json["id"])
    coin_name = request.json["coin_name"]
    coin_symbol = request.json["coin_symbol"]
    transaction_type =request.json["transaction_type"]
    amount =float(request.json["amount"])*100
    time_transacted = datetime.fromtimestamp(request.json["time_transacted"])
    time_created = datetime.fromtimestamp(request.json["time_created"])
    price_purchased_at = float(request.json["price_purchased_at"])
    no_of_coins = amount/(price_purchased_at*100)

    connection = postgreSQL_pool.getconn()
    cursor = connection.cursor()

    insert_statement = f"INSERT INTO transactions (user_id, coin_name, coin_symbol, transaction_type, amount, time_transacted, time_created, price_purchase_at, no_of_coins) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(insert_statement, [user_id, coin_name, coin_symbol, transaction_type, amount, time_transacted, time_created, price_purchased_at, no_of_coins])
    connection.commit()

    coins = cg.get_coins_markets(vs_currency='usd', order='market_cap_desc', per_page='10', page ='1')
    coin_ids = []
    for coin in coins:
        coin_ids.append((coin['id'], coin['name'], coin['symbol']))

    return jsonify(request.json, coin_ids)

@app.route("/all_transactions")
def all_transactions():

    user_id = int(session.get("id"))

    connection = postgreSQL_pool.getconn()
    cursor = connection.cursor()
    querry = f"SELECT * FROM transactions WHERE user_id = {user_id}"
    cursor.execute(querry)

    transactions = cursor.fetchall()

    return jsonify(
    [
        format_db_row_to_transaction(transaction)
        for transaction in transactions

    ])

@app.route("/delete_transactions", methods = ["POST"])
def delete_transaction():

    user_id = int(session.get("id"))
    transaction_id = int(request.json["id"])

    connection = postgreSQL_pool.getconn()
    cursor = connection.cursor()

    delete = f"DELETE FROM transactions WHERE id = %s AND  user_id = {user_id};"
    cursor.execute(delete, [transaction_id])
    
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify("Message:Delete successfully.")
    
@app.route("/get_crypto")
def get_crypto():

    user_id = int(session.get("id"))

    portfolio = defaultdict(
        lambda: {
            "coins": 0,
            "total_cost": 0,
            "total_equity": 0,
            "live_price": 0
        }
    )
    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()
    res = f"SELECT coin_symbol, transaction_type, SUM(amount)/100 AS total_amount, SUM(no_of_coins) AS total_coins FROM transaction WHERE user_id = {user_id} GROUP BY coin_symbol, transaction_type;"  
    cur.execute(res)
    rows = cur.fetchall()

    for row in rows:
        coin = row[0]
        transaction_type = row[1]
        transaction_amount = row[2]
        transaction_coins = row[3]

        if transaction_type == 1:
            portfolio[coin]['total_cost'] += transaction_amount
            portfolio[coin]['coins'] += transaction_coins
        else:
            portfolio[coin]['total_cost'] -= transaction_amount
            portfolio[coin]['coins'] -= transaction_coins

    symbol_to_coin_id_map = {
        "BTC": "bitcoin",
        "SOL": "solana",
        "LINK": "chainlink",
        "ETH": "ethereum",
        "ADA": "cardano",
        "MANA": "decentraland",
    }

    data = []

    for symbol in portfolio:
        responce = request.get(
            f"{LIVE_PRICE_URL}?ids={symbol_to_coin_id_map[symbol]}&vs_currencies=usd").json()
    live_price = responce[symbol_to_coin_id_map[symbol]]['usd']

    portfolio[symbol]['live_price'] = live_price
    portfolio[symbol]['total_equity'] = float(portfolio[symbol]['coins']) * live_price

    #dobitak_gubitak po valuti
    gain_loss = 0
    gain_loss += (portfolio[symbol]['total_equity'] - portfolio[symbol]['total_cost']) 

    data.append(
        {
            "symbol": symbol,
            "live_price": portfolio[symbol]['live_price'],
            "total_equity": portfolio[symbol]['total_equity'],
            "coins": portfolio[symbol]['coins'],
            "total_cost": portfolio[symbol]['total_cost'],
            "gain_loss": portfolio[symbol]['gain_loss']
        }
    )
    return jsonify(data)




if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
