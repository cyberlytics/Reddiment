



import yfinance as yf
from typing import Optional
import pandas as pd
import re

class FinancialData:
    def __init__(self,cols:list[str]=['Close'], interval:Optional[str]=None):
        self.return_cols = cols
        self.return_intaval = interval if interval else '5y'

    def get_stock_data(self,stock:str)->dict:
        """
        Get stock data from Yahoo Finance
        """
        
        # check if stock is valid
        if not self.is_valid_stock_symbol(stock):
            return {"Data":"invalid stock symbol"}
        # download stock data from Yahoo Finance if available
        df = yf.Ticker(stock).history(period=self.return_intaval)
        print("df",df)
        if not self.is_valid_response(df):
            print("invalid response")
            return {"Data": "invalid response"}
        
        cols = self.extract_cols(df)
        return {"Data":cols.to_json()}
        
    def is_valid_response(self,df:pd.DataFrame)->bool:
        """check if length of df is not 0"""
        info = len(df)
        if info == 0:
            return False
        return True
    
    
    def is_valid_stock_symbol(self,stock:str)->bool:
        """
        Check if stock is valid
        """
        # pattern for 4-letter stock symbol
        if not re.match("([A-Z]{4})|([a-z]{4})", stock):
            return False
    
        return True
        
        
    def extract_cols(self,df:pd.DataFrame)->pd.DataFrame:
        """cut dataframe to specified columns"""
        if self.return_cols is None: # if no columns are specified, return all columns
            return df
        # retrun a dataframe with only self.return_cols
        return_cols = [col.lower() for col in self.return_cols]
        valid_cols = [column for column in df.columns if column.lower() in return_cols]
        if not any(valid_cols): # none of the columns are validquit
            return df
        return df.loc[:,valid_cols]
        
    

def main():

    f = FinancialData(cols=["Close"],interval='1y')
    ans = f.get_stock_data("AUQL")

    print(ans is not None, len(ans["Data"]), type(ans), ans.keys())


if __name__ == '__main__':
    main()