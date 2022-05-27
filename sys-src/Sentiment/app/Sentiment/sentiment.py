import nltk
#nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from textblob import TextBlob


class Sentiment:
    """class for extracting the sentiment of a given text"""

    def __init__(self,mode="nltk"):
        if mode not in ["nltk","blob","all"]:
            raise ValueError("mode must be either 'nltk','blob' or 'all'")
        self.mode = mode
        self.text = ""
        self.current_sentiments = []
        self.sia = SentimentIntensityAnalyzer()
        
    def analyse(self, text:str):
        """
        :param text: text to be analysed
        :return: returns a list of the sentiment of the text
        """
        self.current_sentiments = []
        self.text = text
        match self.mode:
            case"nltk":
                self.current_sentiments.append(self.nltk_sentiment_score())
            case "blob":
                self.current_sentiments.append(self.text_blob_sentiment_score())
            case "all":
                self.current_sentiments.append(self.nltk_sentiment_score())
                self.current_sentiments.append(self.text_blob_sentiment_score())
        self.validate_sentiments()
        return self.current_sentiments
        
    def text_blob_sentiment_score(self)->float:
        """analyses self.text for sentiment with text blob"""
        analysis = TextBlob(self.text)
        return analysis.sentiment.polarity

    def text_blob_sentiment(self,analysis:float)->str:
        """return string representation of sentiment from text blob"""
        if analysis >= 0.001:
            if analysis > 0:
                return 'Positive'
        elif analysis <= -0.001:
            if analysis <= 0:
                return 'Negative'
        return 'Neutral'
     
    def nltk_sentiment_score(self)->float:
        """ analyses self.text for sentiment with nltk"""
        vs = self.sia.polarity_scores(self.text)
        print(vs,type(vs))
        return vs
    
    def nltk_sentiment(self,vs)->str:
        """ return string representation of sentiment from nltk"""
        if not vs['neg'] > 0.05:
            if vs['pos'] - vs['neg'] > 0:
                return 'Positive'

        elif not vs['pos'] > 0.05:
            if vs['pos'] - vs['neg'] <= 0:
                return 'Negative'

        return 'Neutral' 
        
    def validate_sentiments(self)->bool:
        """checks if both methods agree"""
        self.log_results()
        nltk_sentiment = self.nltk_sentiment(self.current_sentiments[1])
        text_blob_sentiment = self.text_blob_sentiment(self.current_sentiments[0])
        if nltk_sentiment == text_blob_sentiment:
            return True # both methods agree
        elif 'Neutral' in [nltk_sentiment,text_blob_sentiment]:
            return True # if one method predicts 'text is neutral', then it is valid
        else:
            return False # methods disagree
        
    def log_results(self):
        """logs the resulting sentiment scores (float) of the analysis"""
        with open("sentiment.log","a") as f:
            f.write(str(self.current_sentiments))
            f.write(self.text)
            f.write("\n\n")
            
            
if __name__ == "__main__":
    Sent = Sentiment()
    print(Sent.analyse("I am very happy"))
         