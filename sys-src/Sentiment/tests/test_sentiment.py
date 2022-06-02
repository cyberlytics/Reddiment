from tkinter import SE
from flask_app.sentiment import Sentiment
import pytest


def text_init_fail():
    with pytest.raises(ValueError):
        s = Sentiment(mode=None)
        s = Sentiment(mode=1)
    
def test_init():
    s =  Sentiment(mode="all")
    assert s.mode == "all"
        
def test_analyse():
    s =  Sentiment(mode="all")
    res = s.analyse("I love this movie")
    assert isinstance(res,str) == True
    assert float(res) == s.text_blob_sentiment_score()
    
def test_analyse_fail():
    s = Sentiment(mode="all")
    with pytest.raises(ValueError):
        s.analyse("")
    with pytest.raises(ValueError):
        s.analyse(None)
    with pytest.raises(ValueError):
        s.analyse(0)
    with pytest.raises(ValueError):
        s.analyse(True)

def test_validation_both_positive():
    s = Sentiment(mode="all")
    s.current_sentiments = [0.5,0.5]
    print(s.validate_sentiments())
    assert s.validate_sentiments() == True
    
def test_validation_both_positive_max_min_values():
    s = Sentiment(mode="all")
    s.current_sentiments = [1.0,1.0]
    print(s.validate_sentiments())
    assert s.validate_sentiments() == True
    
    s.current_sentiments = [-1.0,-1.0]
    print(s.validate_sentiments())
    assert s.validate_sentiments() == True
    
def test_validation_both_negative_max_min_values_fail():
    s = Sentiment(mode="all")
    s.current_sentiments = [-2.0,-0.2]
    with pytest.raises(ValueError):
        s.validate_sentiments()
        
    s.current_sentiments = [2.0,-0.2]
    with pytest.raises(ValueError):
        s.validate_sentiments()
    
    s.current_sentiments = [0.0,-20.2]
    with pytest.raises(ValueError):
        s.validate_sentiments()
    

def test_validation_both_negative():
    s = Sentiment(mode="all")
    s.current_sentiments = [-0.5,-0.5]
    assert s.validate_sentiments() == True

def test_validation_different():
    s = Sentiment(mode="all")
    s.current_sentiments = [0.5,-0.5]
    assert s.validate_sentiments() == False
    
def test_validation_one_sentiment():
    s = Sentiment(mode="all")
    s.current_sentiments = [0.5]
    with pytest.raises(ValueError):
        s.validate_sentiments()

def test_validation_two_invalid_sentiments():
    s = Sentiment(mode="all")
    with pytest.raises(ValueError):
        s.current_sentiments = ['','']
        s.validate_sentiments()
        
def test_sentiment_nltk():
    s = Sentiment(mode="nltk")
    res = s.analyse("I love this movie")
    assert isinstance(res,str) == True
    assert -1 <= float(res) <= 1
    assert float(res) == s.nltk_sentiment_score()
    
def test_sentiment_text_blob():
    s = Sentiment(mode="blob")
    res = s.analyse("I love this movie")
    assert isinstance(res,str) == True
    assert -1 <= float(res) <= 1
    assert float(res) == s.text_blob_sentiment_score()
    
        
        