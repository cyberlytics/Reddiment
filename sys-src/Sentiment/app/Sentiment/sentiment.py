import nltk
#nltk.download('vader_lexicon')
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from textblob import TextBlob


class Sentiment:
    """class for extracting the sentiment of a given text"""

    def __init__(self):
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
        self.current_sentiments.append(self.text_blob_sentiment())
        self.current_sentiments.append(self.nltk_sentiment())
        self.validate_sentiments()
        return self.current_sentiments
        
    def text_blob_sentiment(self):
        """analyses self.text for sentiment with text blob"""
        analysis = TextBlob(self.text)
        if analysis.sentiment.polarity >= 0.001:
            if analysis.sentiment.polarity > 0:
                return 'Positive'

        elif analysis.sentiment.polarity <= -0.001:
            if analysis.sentiment.polarity <= 0:
                return 'Negative'
        else: return 'Neutral'
     
    def nltk_sentiment(self):
        """ analyses self.text for sentiment with nltk"""
        vs = self.sia.polarity_scores(self.text)
        if not vs['neg'] > 0.05:
            if vs['pos'] - vs['neg'] > 0:
                return 'Positive'
            else: return 'Neutral'

        elif not vs['pos'] > 0.05:
            if vs['pos'] - vs['neg'] <= 0:
                return 'Negative'
            else: return 'Neutral'
        else: return 'Neutral' 
        
    def validate_sentiments(self):
        """checks if both methods agree"""
        self.log_results()
        if self.current_sentiments[0] == self.current_sentiments[1]:
            return True # both methods agree
        elif 'Neutral' in self.current_sentiments:
            return True # if one method predicts 'text is neutral', then it is valid
        else:
            return False # methods disagree
        
    def log_results(self):
        """logs the results of the analysis"""
        with open("sentiment.log","a") as f:
            f.writelines(self.current_sentiments)
            f.write(self.text)
            f.write("\n\n")
            
            
if __name__ == "__main__":
    Sent = Sentiment()
    print(Sent.analyse("I am very happy"))
         