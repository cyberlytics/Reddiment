import nltk
#nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from textblob import TextBlob
from typing import Optional


class Sentiment:
    """class for extracting the sentiment of a given text"""

    def __init__(self,mode="all"):
        if mode not in ["nltk","blob","all"]:
            raise ValueError("mode must be either 'nltk','blob' or 'all'")
        self.mode = mode
        self.text = ""
        self.current_sentiments = []
        self.sia = SentimentIntensityAnalyzer()
        
    def analyse(self, text:str)->Optional[str]:
        """
        :param text: text to be analysed
        :return: returns a list of the sentiment of the text
        """
        if not isinstance(text,str) or text == "":
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
        self.current_sentiments.append(self.nltk_sentiment_score())
        self.current_sentiments.append(self.text_blob_sentiment_score())
        valid = self.validate_sentiments()
        if valid:
            return self.current_sentiments[1]
        else: return 0.0
        
    def text_blob_sentiment_score(self)->float:
        """analyses self.text for sentiment with text blob"""
        analysis = TextBlob(self.text).sentiment.polarity
        return analysis

    def translate_sentiment_to_text(self,analysis:float)->str:
        """return string representation of sentiment from text blob"""
        if not isinstance(analysis,float):
            raise ValueError("analysis must be a float")

        if analysis == '':
            raise ValueError("analysis must not be empty")
        
        if analysis >= 0.001:
            #if analysis > 0:
            return 'Positive'
        elif analysis <= -0.001:
            #if analysis <= 0:
            return 'Negative'
        return 'Neutral'
     
    def nltk_sentiment_score(self)->Optional[float]:
        """ analyses self.text for sentiment with nltk"""
        vs = self.sia.polarity_scores(self.text)
        return vs.get("compound")
    
        
    def validate_sentiments(self,only_log=False)->bool:
        """checks if both methods agree"""
        self.log_results()
        
        if not self.mode == 'all':
            raise ValueError("mode must be 'all'")
        
        if only_log:
            return True
        
        # no sentiment given or only one answer given
        if not(any(self.current_sentiments)) or len(self.current_sentiments) != 2:
            raise ValueError("current_sentiments must be a list of length 2 and must not be empty")
        
        self.check_bounds()
        
        nltk_sentiment = self.translate_sentiment_to_text(self.current_sentiments[0])
        text_blob_sentiment = self.translate_sentiment_to_text(self.current_sentiments[1])
        
        if nltk_sentiment == text_blob_sentiment:
            return True # both methods agree
        elif 'Neutral' in [nltk_sentiment,text_blob_sentiment]:
            return True # if one method predicts 'text is neutral', then it is valid
        else:
            return False # methods disagree
    
    def check_bounds(self):
        """checks if the sentiment is within the bounds of -1.0 and 1.0"""
        if self.current_sentiments[0] < -1.0 or self.current_sentiments[0] > 1.0:
            raise ValueError("nltk sentiment score is out of bounds")
        if self.current_sentiments[1] < -1.0 or self.current_sentiments[1] > 1.0:
            raise ValueError("text blob sentiment score is out of bounds")

            
    def log_results(self):
        """logs the resulting sentiment scores (float) of the analysis"""
        with open("sentiment.log","a") as f:
            f.write("\n NEXT RUN" + str(self.current_sentiments))
            f.write(self.text)
            f.write("\n\n")
            
            
if __name__ == "__main__":
    Sent = Sentiment(mode="all")
    print(Sent.analyse("I am very happy"))
    Sent.current_sentiments = ['','']
    print(Sent.validate_sentiments())
         