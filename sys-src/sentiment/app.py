from flask import Flask, request
from flask_app.sentiment import Sentiment 
from flask_app.validators import is_json,validate_json


app = Flask(__name__)

Sent = Sentiment(mode="all")


@app.route("/sentiment",methods=['POST'])
@is_json
@validate_json
def add_text():
    params = request.get_json(force=True)
    text = params.get('text')
    sentiment = Sent.analyse(text)
    return sentiment



if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0",port=80)