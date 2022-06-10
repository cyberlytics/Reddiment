from tkinter import SE
from flask_app.sentiment import Sentiment
import pytest


def text_init_fail():
    with pytest.raises(ValueError):
        s = Sentiment(mode=None)
        s = Sentiment(mode=1)

@pytest.mark.parametrize("mode",["nltk","blob","all"]) 
def test_analyse(mode):
    s =  Sentiment(mode=mode)
    res = s.analyse("I love this movie")
    assert isinstance(res,str) == True


@pytest.mark.parametrize("mode",["nltk","blob","all"]) 
@pytest.mark.parametrize("error_text",[None,True,0])
def test_analyse_fail(mode,error_text):
    s = Sentiment(mode=mode)
    with pytest.raises(ValueError):
        text = s.analyse(error_text)
        assert text == '0.0'

@pytest.mark.parametrize("mode",["nltk","blob","all"]) 
@pytest.mark.parametrize("text",["I love this movie","","-----"])        
def text_analyse(mode,text):
    s = Sentiment(mode=mode)
    analyse = s.analyse(text=text)
    assert isinstance(analyse,str)

@pytest.mark.parametrize("scores,valid",[
    ([0.5,0.0],True),
    ([1.0,0.7],True),
    ([-0.5,-0.1],True),
    ([0.0001,0.0005],True),
    ([1.0,0.0001],True),
    ([-1.0,0.001],False),
    ([-2.5,-1.0],False),
    ([1.5,1.0],False)])
def test_validation_both_positive(scores,valid):
    s = Sentiment(mode='all')
    s.current_sentiments = scores
    assert s.validate_sentiments() == valid
    
def test_validation_one_sentiment():
    s = Sentiment(mode='all')
    s.current_sentiments = [0.5]
    valid = s.validate_sentiments()
    assert valid == False

def test_validation_two_invalid_sentiments():
    s = Sentiment(mode="all")
    s.current_sentiments = ['','']
    valid = s.validate_sentiments()
    assert valid == False
        
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
    

        