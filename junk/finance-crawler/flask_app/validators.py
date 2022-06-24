from flask import request
from functools import wraps

def is_json(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if request.is_json:
            return f(*args, **kwargs)
        else:
            return {"Stock":"","Data":""}, 500
    return wrapper


def validate_json(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        
        params = request.get_json(force=True)
        if 'Stock' in params.keys():
            return f(*args, **kwargs)
        else:
            return {"Stock":"","Data":""}, 500
    return wrapper
