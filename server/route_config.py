from flask import Flask, request
# app reference
app = Flask(__name__)
# This method executes before any API request
data = {'carCounts':11, 'totalSpots':50}
@app.before_request
def before_request():
    print('before API request')
# This method returns students 
# list and by default method will be GET
@app.route('/api/students')
def get_students_list():
    return data
# This is POST method which stores students details.
@app.route('/api/dataFromModel', methods=['POST'])
def extractData():
    temp = request.data
    return temp
# This method executes after every API request.
@app.after_request
def after_request(response):
    return response


