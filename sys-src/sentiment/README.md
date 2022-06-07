### Docker start

build container
`docker build . -t sentiment`

run container
`docker run -p 80:80 sentiment`

ask for sentiment
`curl http://localhost:80/sentiment -p'{"text":"I love reddiment"}'`

get results
`0.8%` -> greter than 0: positive
`-0.8%` -> less than 0: negative
`0.0%` -> neutral
