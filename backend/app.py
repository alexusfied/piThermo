from flask import Flask, request, jsonify
from flask_cors import CORS
from read_temperature import read_temp
from datetime import datetime
from dotenv import load_dotenv
import os
import sqlite3
from flask import Flask, request, g
from flask_cors import CORS
from read_temperature import read_temp

load_dotenv("./.env")
app = Flask(__name__)
cors = CORS(app)
DATABASE = os.getenv("DATABASE_PATH")

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    cursor = get_db().execute(query, args)
    rv = cursor.fetchall()
    cursor.close()
    return (rv[0] if rv else None) if one else rv

# Helper functions
# create_response_arr takes in an empty list and requestData and appends the responses from db queries to it
def create_response_arr(requestData, responseArr):
    if requestData["date"] and not requestData["minTemp"] and not requestData["maxTemp"]:
        for temperature in query_db('SELECT * FROM temperature WHERE datetime LIKE ?', [requestData["date"] + "%"]):
            responseArr.append({"date": temperature["datetime"], "temperature": str(temperature["temp"])})

    elif requestData["date"] and requestData["minTemp"] and not requestData["maxTemp"]:
        for temperature in query_db('SELECT * FROM temperature WHERE datetime LIKE ? AND temp >= ?', [requestData["date"] + "%", requestData["minTemp"]]):
            responseArr.append({"date": temperature["datetime"], "temperature": str(temperature["temp"])})

    elif requestData["date"] and not requestData["minTemp"] and requestData["maxTemp"]:
        for temperature in query_db('SELECT * FROM temperature WHERE datetime LIKE ? AND temp <= ?', [requestData["date"] + "%", requestData["maxTemp"]]):
            responseArr.append({"date": temperature["datetime"], "temperature": str(temperature["temp"])})

    elif requestData["date"] and requestData["minTemp"] and requestData["maxTemp"]:
        for temperature in query_db('SELECT * FROM temperature WHERE datetime LIKE ? AND temp >= ? AND temp <= ?', [requestData["date"] + "%", requestData["minTemp"], requestData["maxTemp"]]):
            responseArr.append({"date": temperature["datetime"], "temperature": str(temperature["temp"])})

    elif not requestData["date"] and not requestData["minTemp"] and not requestData["maxTemp"]:
        for temperature in query_db('SELECT * FROM temperature'):
             responseArr.append({"date": temperature["datetime"], "temperature": str(temperature["temp"])})

    elif not requestData["date"] and requestData["minTemp"] and not requestData["maxTemp"]:
        for temperature in query_db('SELECT * FROM temperature WHERE temp >= ?', [requestData["minTemp"]]):
             responseArr.append({"date": temperature["datetime"], "temperature": str(temperature["temp"])})

    elif not requestData["date"] and not requestData["minTemp"] and requestData["maxTemp"]:
        for temperature in query_db('SELECT * FROM temperature WHERE temp <= ?', [requestData["maxTemp"]]):
             responseArr.append({"date": temperature["datetime"], "temperature": str(temperature["temp"])})

    elif not requestData["date"] and requestData["minTemp"] and requestData["maxTemp"]:
        for temperature in query_db('SELECT * FROM temperature WHERE temp >= ? AND temp <= ? ORDER BY datetime DESC', [requestData["minTemp"], requestData["maxTemp"]]):
            responseArr.append({"date": temperature["datetime"], "temperature": str(temperature["temp"])})

    return responseArr

# Get the number of days the current month has
def get_days_current_month():
    currentMonth = datetime.today().strftime("%m");
    daysThisMonth = 31
    if currentMonth == "02":
        daysThisMonth = 28
    elif currentMonth == "04" or currentMonth == "06" or currentMonth == "09" or currentMonth == "11":
        daysThisMonth = 30
    return daysThisMonth

# Routes
@app.route('/current_temp', methods=['GET'])
def get_current_temp():
    currentTemp = read_temp()

    return {
        "temp": currentTemp
    }

@app.route("/avg_temp_total", methods=["GET"])
def get_avg_temp_total():
    avgTempTotal = query_db("SELECT avg(temp) AS temp FROM temperature",[], True)["temp"]
    avgTempTotal = round(avgTempTotal, 2)
    return {
        "temp": avgTempTotal
    }

@app.route("/highest_temp_total", methods=["GET"])
def get_highest_temp_total():
    highestTempTotal = query_db("SELECT max(temp) AS temp FROM temperature", [], True)["temp"]
    highestTempTotal = round(highestTempTotal, 2)
    return {
        "temp": highestTempTotal
    }

@app.route("/lowest_temp_total", methods=["GET"])
def get_lowest_temp_total():
    lowestTempTotal = query_db("SELECT min(temp) AS temp FROM temperature", [], True)["temp"]
    lowestTempTotal = round(lowestTempTotal, 2)
    return {
        "temp": lowestTempTotal
    }

@app.route('/todays_temps', methods=['GET'])
def get_todays_temps():
    dateToday = datetime.today().strftime('%Y-%m-%d')
    response = {
        "temperatures": [],
    }
    for temperature in query_db('SELECT temp FROM temperature WHERE datetime LIKE ?', [dateToday + '%']):
        response["temperatures"].append(temperature["temp"])
    return response

@app.route('/temps_this_month', methods=['GET'])
def get_temps_this_month():
    currentYear = datetime.today().strftime("%Y")
    currentMonth = datetime.today().strftime("%m")
    averagesPerDay = {}
    for day in range(1,get_days_current_month()):
        averageTempDay = query_db("SELECT avg(temp) AS temp FROM temperature WHERE datetime LIKE ?", [f"{currentYear}-{currentMonth}-{'0' + str(day) if day < 10 else day}%"], True)["temp"]
        averagesPerDay[day] = averageTempDay
    return averagesPerDay

@app.route('/temps_this_year', methods=['GET'])
def get_temps_this_year():
    currentYear = datetime.today().strftime("%Y")
    monthsPerYear = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    averagesPerMonth = {}
    for month in monthsPerYear:
        averageTempMonth = query_db('SELECT avg(temp) AS temp FROM temperature WHERE datetime LIKE ?', [f"{currentYear}-%{month}-%"], True)["temp"]
        averagesPerMonth[month] = averageTempMonth
    return averagesPerMonth

@app.route('/search_temp', methods=['POST'])
def get_search_results():
    requestData = request.json
    temperatures = []
    create_response_arr(requestData, temperatures)
    return {
        "body": temperatures
    }

@app.route('/search_temp_pagination', methods=['POST'])
def get_search_results_paginated():
    requestData = request.json
    temperatures = []
    create_response_arr(requestData, temperatures)
    response = {}
    pageCount = 1
    for index, temperature in enumerate(temperatures, start=1):
        if pageCount in list(response.keys()):
            if index % 10 != 0:
                response[pageCount].append(temperature)
            else:
                response[pageCount].append(temperature)
                pageCount += 1
                continue
        else:
            response[pageCount] = []
            response[pageCount].append(temperature)
    return {
        "body": response
    }

# Main
if __name__ == '__main__':
    app.run()