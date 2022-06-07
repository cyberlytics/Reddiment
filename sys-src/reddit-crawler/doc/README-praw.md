### Getting Started

PRAW can be installed using conda or pip:
    conda install -c conda-forge praw
    or
    pip install praw

Import Python Reddit API Wrapper 
    import praw

Getting authentication information by creating a reddit app on
    https://www.reddit.com/prefs/apps

    client_id='2GL93cB08jBhkUZiR5AhYA'
    client_secret='DSm09LSvZjAhY9gSVN7t1OXexm4xCw'
    user_agent='Reddiment'

Creating a praw instance
    reddit = praw.Reddit(client_id='my_client_id', client_secret='my_client_secret', user_agent='my_user_agent')

More information in PRAW documentation
    https://praw.readthedocs.io/en/latest/getting_started/authentication.html#script-application

Example
    https://towardsdatascience.com/scraping-reddit-data-1c0af3040768
    