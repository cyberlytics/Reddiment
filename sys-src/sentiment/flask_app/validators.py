
from flask import request
from functools import wraps

def is_json(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if request.is_json:
            return f(*args, **kwargs)
        else:
            return {"sentiment":"-2.0"}, 500
    return wrapper


def validate_json(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        
        params = request.get_json(force=True)
        if 'text' in params.keys():
            return f(*args, **kwargs)
        else:
            return {"sentiment":"-2.0"}, 500
    return wrapper