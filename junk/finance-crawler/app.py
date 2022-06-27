from flask import Flask, request
from flask_app.finance_data import FinancialData 
from flask_app.validators import is_json,validate_json


app = Flask(__name__)

Data = FinancialData(interval="1y")


@app.route("/stock",methods=['POST'])
@is_json
@validate_json
def add_text():
    params = request.get_json(force=True)
    text = params.get('Stock')
    stock = Data.get_stock_data(text)
    return stock



if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0",port=5000)

    import requests
    #create an empty dictionary
    baggage_handler = {}
    baggage_handler['Stock'] = "NVDA"

    print('[Sending to API!]')

    response = requests.post('http://127.0.0.1:5000/stock', data=baggage_handler)
    print("RESPONCE TXT", response.json())
    data = response.json()
    print(data)