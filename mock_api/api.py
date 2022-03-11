import enum
from optparse import Option
from typing import Optional
from fastapi import FastAPI, HTTPException, Header, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from json_exception import JsonException, registerException as registerJsonException
from consts import TOKEN


app = FastAPI()
registerJsonException(app)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


'''
    Add authentication mocks
'''

# class AuthenticatePostRequest(BaseModel):
#     username: str
#     password: str

# class AuthenticatePostResponse(BaseModel):
#     token: str

# @app.post("/api/authenticate", response_model=AuthenticatePostResponse)
# async def api_authenticate  (request: AuthenticatePostRequest):
#     if request.username != "foo":
#         raise JsonException(username="Wrong username!")

#     if request.password != "bar":
#         raise HTTPException(status_code=400, detail="Username/password is wrong!")

#     return {"token": TOKEN}



'''
    Dependency injection

    Quick guide to "Depends" function
'''
async def common_parameters(q: Optional[str] = None, skip: int = 0, limit: int = 100):
    return {"q": q, "skip": skip, "limit": limit}

@app.get("/dependent_items")
async def read_dependent_items(commons: dict = Depends(common_parameters)):
    return commons

@app.get("/dependent_users")
async def read_dependent_users(commons: dict = Depends(common_parameters)):
    return commons


'''
    Header dependency
'''
@app.get("/headers_items")
async def read_headers_items(user_agent: Optional[str] = Header(None)):
    return {"User-Agent": user_agent}

'''
    User info mocks
'''
# class UserResponse(BaseModel):
#     class UserType(enum.Enum):
#         PRIVATE = "PRIVATE"
#         SHELTER = "SHELTER"

#     email: str
#     type: UserType

# @app.get("/api/user/")
# async def get_user(request: UserResponse)


'''
    Read items
'''
class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: bool = False

def fake_decode_token(token):
    if token == TOKEN:
        return User(username='foo', email='foo@baz.com', full_name='Foo Bar')

    return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = fake_decode_token(token)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != 'foo' or form_data.password != 'foo':
        raise HTTPException(status_code=400, detail="Wrong username or password")

    return {"access_token": TOKEN, "token_type": "bearer"}


@app.get("/users/me")
async def read_users_me(user: User = Depends(get_current_user)):
    return user
