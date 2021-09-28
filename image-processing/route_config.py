from flask import Flask, request

# app reference
app = Flask(__name__)


# This method executes before any API request
@app.before_request
def before_request():
    print('before API request')


# This is POST method which stores students details.
parkingData = []


@app.route('/api/test', methods=['GET', 'POST'])
def extractData():
    temp = request.form.to_dict()
    if request.method == 'POST':
        print('inside post',temp)
        for j in str(temp):
            parkingData.append(str(temp))
        parkingData[0] = str(temp)
        print(parkingData[0])
        print(temp)
        return 'data recieved'
    elif request.method == 'GET':
        print('inside get')
        return parkingData[0]
    else:
        return 'error'



# This method executes after every API request.
@app.after_request
def after_request(response):
    return response
