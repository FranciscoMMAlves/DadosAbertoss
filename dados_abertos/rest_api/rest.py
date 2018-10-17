#!/usr/bin/env python
from flask import Flask, jsonify, render_template, make_response, request, current_app
app = Flask(__name__)
import psycopg2
import sys
import base64
from datetime import datetime, timedelta
make_response, request, current_app
from functools import update_wrapper

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, str):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, str):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator


@app.route('/live/<args>')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='*')
def get_live_recommender(args):
    st_ids = []
    date_hour = datetime.now().strftime('%Y-%m-%d %H')
    try:
        conn = psycopg2.connect("host='localhost' dbname='TestGIS' user='postgres' password='alves'")
        try:
            cur = conn.cursor()
            query = "SELECT * from viseu_hour_agg"
            cur.execute(query)
            rows = cur.fetchall()
            #print(rows)
            return jsonify(station_id=rows[0])
            # return jsonify(results="{'points':"+points+",'max_count':"+str(max_v)+",'min_count':"+str(min_v)+"}")
        except:
            return "error- when performin query!"
    except:
        return "I am unable to connect to the database."


@app.route('/first')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_first_data():
    query = "select date_time, lat, lon, t_count as t_count from ag_day_agg_count"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        dates = []
        f_points = []
        counts = []
        for row in rows:
            f_points.append({"latitude" : float(row[1]), "longitude" : float(row[2]), "date":str(row[0]).split(" ")[0],"count" :int(row[3]) })
        return jsonify(points = f_points, min_countm=6, max_count=6532)

@app.route('/totals')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_totals_data():
    query = "select sum(t_count) as t_count from ag_month_agg_count"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        #f_points = []
        #counts = []
        #for row in rows:
            #f_points.append({"latitude" : float(row[1]), "longitude" : float(row[2]), "date":str(row[0]).split(" ")[0],"count" :int(row[3]) })
        print(str(rows[0][0]))
        return jsonify(total = int(rows[0][0]))

@app.route('/total_cars')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_cars_data():
    query = "select count(*) as t_count from agueda_cont_trafego where vehicle = 'Car'"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        #f_points = []
        #counts = []
        #for row in rows:
            #f_points.append({"latitude" : float(row[1]), "longitude" : float(row[2]), "date":str(row[0]).split(" ")[0],"count" :int(row[3]) })
        print(str(rows[0][0]))
        return jsonify(total = int(rows[0][0]))

@app.route('/total_two_wheelers')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_two_wheelers_data():
    query = "select count(*) as t_count from agueda_cont_trafego where vehicle = 'Two-wheelers'"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        #f_points = []
        #counts = []
        #for row in rows:
            #f_points.append({"latitude" : float(row[1]), "longitude" : float(row[2]), "date":str(row[0]).split(" ")[0],"count" :int(row[3]) })
        print(str(rows[0][0]))
        return jsonify(total = int(rows[0][0]))

@app.route('/total_vans')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_vans_data():
    query = "select count(*) as t_count from agueda_cont_trafego where vehicle = 'Vans'"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        #f_points = []
        #counts = []
        #for row in rows:
            #f_points.append({"latitude" : float(row[1]), "longitude" : float(row[2]), "date":str(row[0]).split(" ")[0],"count" :int(row[3]) })
        print(str(rows[0][0]))
        return jsonify(total = int(rows[0][0]))

@app.route('/total_semi_trucks')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_s_truck_data():
    query = "select count(*) as t_count from agueda_cont_trafego where vehicle = 'Semi-Truck'"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        #f_points = []
        #counts = []
        #for row in rows:
            #f_points.append({"latitude" : float(row[1]), "longitude" : float(row[2]), "date":str(row[0]).split(" ")[0],"count" :int(row[3]) })
        print(str(rows[0][0]))
        return jsonify(total = int(rows[0][0]))


@app.route('/total_trucks')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_truck_data():
    query = "select count(*) as t_count from agueda_cont_trafego where vehicle = 'Trucks'"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        #f_points = []
        #counts = []
        #for row in rows:
            #f_points.append({"latitude" : float(row[1]), "longitude" : float(row[2]), "date":str(row[0]).split(" ")[0],"count" :int(row[3]) })
        print(str(rows[0][0]))
        return jsonify(total = int(rows[0][0]))

@app.route('/vehicles')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_vehicles_data():
    query = "select vehicle, count(*) as t_count from agueda_cont_trafego group by vehicle order by t_count desc"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        res = []
        min_v = 999999
        max_v = 0
        #counts = []
        for row in rows:
            res.append({"name" : str(row[0]), "value" : int(row[1])})
            if int(row[1]) < min_v:
                min_v = int(row[1])
            if int(row[1]) > max_v:
                max_v = int(row[1])
        #print(str(rows))
        return jsonify(period_data = res, min_count = min_v, max_count = max_v)

@app.route('/direction')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_dir_data():
    query = "select direction, count(*) as t_count from agueda_cont_trafego group by direction order by t_count desc"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        res = []
        min_v = 999999
        max_v = 0
        #counts = []
        for row in rows:
            res.append({"name" : str(row[0]), "value" : int(row[1])})
            if int(row[1]) < min_v:
                min_v = int(row[1])
            if int(row[1]) > max_v:
                max_v = int(row[1])
        #print(str(rows))
        return jsonify(period_data = res, min_count = min_v, max_count = max_v)

@app.route('/streets')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_streets_data():
    query = "select street, count(*) as t_count from agueda_cont_trafego group by street order by t_count desc"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        res = []
        min_v = 999999
        max_v = 0
        #counts = []
        for row in rows:
            res.append({"name" : str(row[0]), "value" : int(row[1])})
            if int(row[1]) < min_v:
                min_v = int(row[1])
            if int(row[1]) > max_v:
                max_v = int(row[1])
        #print(str(rows))
        return jsonify(streets_data = res, min_count = min_v, max_count = max_v)


@app.route('/speed')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_speeds_data():
    query = "select speed, count(*) as t_count from agueda_cont_trafego group by speed order by t_count desc"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        res = []
        min_v = 999999
        max_v = 0
        #counts = []
        for row in rows:
            res.append({"name" : str(row[0]), "value" : int(row[1])})
            if int(row[1]) < min_v:
                min_v = int(row[1])
            if int(row[1]) > max_v:
                max_v = int(row[1])
        #print(str(rows))
        return jsonify(speed_data = res, min_count = min_v, max_count = max_v)


@app.route('/conters')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_total_conters_data():
    query = "select distinct (lat,lon) from ag_day_agg_count"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        #dates = []
        res = []
        for row in rows:
            print(str(row))
            res.append(row)
        #print(str(rows))
        return jsonify(counters = res)

@app.route('/alldata')
@crossdomain(origin='*',methods='GET, OPTIONS',headers='Content-Type,X-PINGOTHER, pingpong')
def get_all_data():
    query = "select lat, lon, count(*) as t_count from agueda_cont_trafego group by (lat,lon)"
    rows = performQuery(query,"localhost","TestGIS","postgres","alves")
    if rows == "error- when performing query!" or rows == "I am unable to connect to the database.":
        return rows
    else:
        dates = []
        f_points = []
        counts = []
        for row in rows:
            f_points.append({"latitude" : float(row[0]), "longitude" : float(row[1]), "count" :int(row[2]) })
        return jsonify(points = f_points)


def performQuery(query,host,db,user,password):
    try:
        conn=psycopg2.connect("host="+host+" dbname="+db+" user="+user+" password="+password)
        try:
            cur = conn.cursor()
            cur.execute(query)
            return cur.fetchall()
        except:
            return "error- when performing query!"
    except:
        return "I am unable to connect to the database."
#@app.route('/recording/<args>')
#def get_ga_recommender(args):


if __name__ == "__main__":
    print(sys.argv[1:])
    if sys.argv[1] == '--port' and sys.argv[2]!='':
        app.run(host='0.0.0.0',port=int(sys.argv[2]))
    else:
        app.run(host='0.0.0.0',port=9000)
