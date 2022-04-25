from urllib import request
from urllib.error import HTTPError
import tempfile


class ProxyImage:
    def __init__(self, image_json, apikey):
        self.json = image_json
        assert "url" in self.json
        self.apikey = apikey

        self.file = None
        self.validated = False
        self.is_valid_value = None

    def is_valid(self):
        if not self.validated:
            try:
                img_request = request.Request(
                    self.json["url"],
                    headers={
                        # "x-api-key": self.apikey,
                        "user-agent": "Mozilla/5.0 (X11; U; Linux i686) Gecko/20071127 Firefox/2.0.0.11",
                    },
                )
                with request.urlopen(img_request) as res:
                    self.file = tempfile.NamedTemporaryFile(mode="wb")
                    self.file.write(res.read())
                    self.is_valid_value = True
            except HTTPError as e:
                self.is_valid_value = False

            self.validated = True

        return self.is_valid_value

    def get_path(self):
        if not self.validated:
            raise RuntimeError("ProxyImage(): you need to validate the image first")

        if not self.is_valid_value:
            raise RuntimeError("ProxyImage(): wrongly validated")

        assert self.file is not None

        return self.file.name
