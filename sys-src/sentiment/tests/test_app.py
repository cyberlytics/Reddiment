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

@pytest.mark.parametrize("text,code",[({'text':'I love this movie'},200),
                                      ({'text':''},200),
                                      ({'t':"I love this movie"},500)])
def test_post_normal(client,text,code):
    response = client.post("/sentiment",json=text)
    assert response.status_code == code
    
    
@pytest.mark.parametrize("fail_text,fail_code",[({'text':None},500),
                                                ({'text':2},500)])    
def test_post_fail(client,fail_text,fail_code):
    with pytest.raises(ValueError):
        response = client.post("/sentiment",json=fail_text)
        assert response.status_code == fail_code
        



    