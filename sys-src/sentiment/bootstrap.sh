
#!/bin/sh
export FLASK_APP=run.py # flask app
source $(pipenv --venv)/bin/activate
flask run -h 0.0.0.0