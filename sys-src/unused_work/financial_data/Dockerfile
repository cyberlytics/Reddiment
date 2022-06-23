# syntax=docker/dockerfile:1


FROM python:3.9-slim as base

# Setup env
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8pip
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONFAULTHANDLER 1


FROM base AS python-deps

# Install pipenv and compilation dependencies
RUN pip install pipenv
RUN apt-get update

# Install python dependencies in /.venv
COPY Pipfile .
COPY Pipfile.lock .
RUN PIPENV_VENV_IN_PROJECT=1 pipenv install --deploy 
#--ignore-pipfile

# ignore-pipfile : no interference with the local setup
# deploy: build will fail if pipfile.lock is out of date


FROM base AS runtime

# Copy virtual env from python-deps stage
COPY --from=python-deps /.venv /.venv
ENV PATH="/.venv/bin:$PATH"

# Install application into container

WORKDIR /app
COPY . /app

EXPOSE 5000
# run application 

CMD ["flask","run","-h", "0.0.0.0", "-p", "5000"]
