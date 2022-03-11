from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class JsonException(Exception):
    def __init__(self, **kwargs):
        self.content = kwargs


def registerException(app: FastAPI):
    async def json_exception_handler(req: Request, exc: JsonException):
        return JSONResponse(
            status_code=400,
            content=exc.content
        )

    app.exception_handler(JsonException)(json_exception_handler)
