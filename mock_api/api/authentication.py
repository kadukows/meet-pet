from rest_framework import authentication


class TokenBearerAuth(authentication.TokenAuthentication):
    keyword = "Bearer"
