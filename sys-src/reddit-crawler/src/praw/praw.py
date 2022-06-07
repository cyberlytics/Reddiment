import praw

# create praw.Reddit instance with authentification information
reddit = praw.Reddit(
    client_id='2GL93cB08jBhkUZiR5AhYA', 
    client_secret='DSm09LSvZjAhY9gSVN7t1OXexm4xCw', 
    user_agent='Reddiment')

# get 10 hot posts from the MachineLearning subreddit
hot_posts = reddit.subreddit('MachineLearning').hot(limit=10)
# for post in hot_posts:
#     print(post.title)

# get hottest posts from all subreddits
hot_posts = reddit.subreddit('all').hot(limit=10)
# for post in hot_posts:
#     print(post.title)

# creating csv
import pandas as pd
posts = []
ml_subreddit = reddit.subreddit('MachineLearning')
for post in ml_subreddit.hot(limit=10):
    posts.append([post.title, post.score, post.id, post.subreddit, post.url, post.num_comments, post.selftext, post.created])
posts = pd.DataFrame(posts,columns=['title', 'score', 'id', 'subreddit', 'url', 'num_comments', 'body', 'created'])
print(posts)

# get MachineLearning subreddit data
ml_subreddit = reddit.subreddit('MachineLearning')
print(ml_subreddit.description)

# get comments from a specific post
# create/obtain a submission object and loop through the comments attribute 
submission = reddit.submission(url="https://www.reddit.com/r/MapPorn/comments/a3p0uq/an_image_of_gps_tracking_of_multiple_wolves_in/")
# or 
submission = reddit.submission(id="a3p0uq")

# get top-level comments 
for top_level_comment in submission.comments:
    print(top_level_comment.body)
# if 'MoreComments' error occures:
from praw.models import MoreComments
for top_level_comment in submission.comments:
    if isinstance(top_level_comment, MoreComments):
        continue
    print(top_level_comment.body)
#or
submission.comments.replace_more(limit=0)
for top_level_comment in submission.comments:
    print(top_level_comment.body)

# to get comments of a comment
submission.comments.replace_more(limit=0)
for comment in submission.comments.list():
    print(comment.body)
