from flask import Flask, request
from flask_app.sentiment import Sentiment 

app = Flask(__name__)

Sent = Sentiment(mode="all")

@app.route("/sentiment",methods=['GET','POST'])
def add_text():
    params = request.get_json(force=True)
    text = params.get('text')
    sentiment = Sent.analyse(text)
    return sentiment

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0",port=80)