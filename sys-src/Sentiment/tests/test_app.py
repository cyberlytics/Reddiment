from app import app
import pytest

class MockSentiment:
    def __init__(self,mode):
        self.mode = mode
    
    def analyse(self,text):
        return {"sentiment":str(0.5)}    

@pytest.fixture
def client():
    app.testing = True
    return app.test_client()

def test_post_normal(client):
    response = client.post("/sentiment",json={'text':'I love this movie'})
    assert response.status_code == 200
    
    
def test_post_fail(client):
    with pytest.raises(ValueError):
        response = client.post("/sentiment",json={'text':2})
        assert response.status_code == 500
        

def test_post_wrong_key(client):
    
    response = client.post("/sentiment",json={'t':'I love this movie'})
    assert response.status_code == 500
        
def test_post_text(client):
    with pytest.raises(ValueError):
        response = client.post("/sentiment",'I love this movie')
        assert response.status_code == 500


    