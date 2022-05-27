from flask import Flask, request
from app.sentiment.sentiment import Sentiment 

app = Flask(__name__)

Text = ""
Sent = Sentiment()

@app.route("/sentiment")
def get_sentiment():
    return Sent.analyse(Text)

@app.route("/sentiment",methods=['POST'])
def add_text():
    Text = request.get_json()
    return "", 204

if __name__ == "__main__":
    app.run(debug=True)