import nltk
nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from textblob import TextBlob
from typing import Optional


class Sentiment:
    """class for extracting the sentiment of a given text"""

    def __init__(self,mode="all",default_sentiment=0.0):
        if mode not in ["nltk","blob","all"]:
            raise ValueError("mode must be either 'nltk','blob' or 'all'")
        self.mode = mode
        self.text = ""
        self.current_sentiments = []
        self.sia = SentimentIntensityAnalyzer()
        self.default_sentiment = default_sentiment
        
    def analyse(self, text:str)->Optional[str]:
        """
        :param text: text to be analysed
        :return: returns a list of the sentiment of the text
        """
        if text == '': # no text given
            return str(0.0)
        
        if not isinstance(text,str): 
            raise ValueError("text must be a valid string")
        
        self.text = text
        sentiment = -2.0
        if self.mode == "nltk":
            sentiment = self.nltk_sentiment_score()
        elif self.mode ==  "blob":
            sentiment = self.text_blob_sentiment_score()
        elif self.mode ==  "all":
            sentiment = self.analyse_with_validation()
        return str(sentiment)
        
    def analyse_with_validation(self)->float:
        """uses all methods for sentiment analysis and compares them"""
        self.current_sentiments = []
        # first method: nltk sentiment
        nltk_score = self.nltk_sentiment_score()
        self.current_sentiments.append(nltk_score)
        # second method: textblob sentiment
        text_blob_score = self.text_blob_sentiment_score()
        self.current_sentiments.append(text_blob_score)
        
        valid = self.validate_sentiments()
        
        if not valid:
            return self.default_sentiment
        # else return the first sentiment
        return self.current_sentiments[0]
        
    def text_blob_sentiment_score(self)->float:
        """analyses self.text for sentiment with text blob"""
        analysis = TextBlob(self.text).sentiment.polarity
        if analysis is None:
            return 0.0
        return analysis

    def translate_sentiment_to_text(self,analysis:float)->str:
        """return string representation of sentiment from text blob"""
        if not isinstance(analysis,float):
            raise ValueError("analysis must be a float")

        if analysis == '':
            raise ValueError("analysis must not be empty")
        
        if analysis >= 0.001:
            return 'Positive'
        elif analysis <= -0.001:
            return 'Negative'
        return 'Neutral'
     
    def nltk_sentiment_score(self)->float:
        """ analyses self.text for sentiment with nltk"""
        vs = self.sia.polarity_scores(self.text)
        score =  vs.get("compound")
        if score is None:
            return 0.0
        return score    
        
    def validate_sentiments(self, log=True, only_log=False)->bool:
        """checks if both methods agree"""
        if log == False and only_log == False:
            return False
        
        if log:
            self.log_results()
        
        if only_log:
            return True
        
        if not self.mode == 'all':
            raise ValueError("mode must be 'all'")
        
        # no sentiment given or only one answer given
        if not(any(self.current_sentiments)) or len(self.current_sentiments) != 2:
            return False
        
        if not self.in_bounds():
            return False
        
        nltk_sentiment = self.translate_sentiment_to_text(self.current_sentiments[0])
        text_blob_sentiment = self.translate_sentiment_to_text(self.current_sentiments[1])
        
        if nltk_sentiment == text_blob_sentiment:
            return True # both methods agree
        elif 'Neutral' in [nltk_sentiment,text_blob_sentiment]:
            return True # if one method predicts 'text is neutral', then the other is valid
        else:
            return False # methods disagree
    
    def in_bounds(self):
        """checks if the sentiment is within the bounds of -1.0 and 1.0"""
        if self.current_sentiments[0] < -1.0 or self.current_sentiments[0] > 1.0:
            return False
        if self.current_sentiments[1] < -1.0 or self.current_sentiments[1] > 1.0:
            return False
        return True

    def log_results(self):
        """logs the resulting sentiment scores (float) of the analysis"""
        with open("sentiment.log","a") as f:
            f.write("\n NEXT RUN" + str(self.current_sentiments))
            f.write(self.text)
            f.write("\n\n")
            
            
if __name__ == "__main__":
    Sent = Sentiment(mode="all")
    print(Sent.analyse("I am very happy"))
    Sent.current_sentiments = [0.0001,-0.5]
    print(Sent.analyse_with_validation())
         