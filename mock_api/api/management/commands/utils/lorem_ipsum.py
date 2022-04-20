from typing import List
from itertools import cycle
from urllib import request


class LoremIpsum:
    def __init__(self):
        self._pars = None

    def _get_pars(self):
        with request.urlopen("http://loripsum.net/api/20/medium/plaintext") as res:
            result = [s for s in res.read().decode("UTF-8").split("\n") if s]
        return result

    def lorem(self, length=2):
        if self._pars is None:
            pars = self._get_pars()
            assert len(pars) == 20
            self._pars = cycle(pars)

        return [p for (_, p) in zip(range(length), self._pars)]


_lorem = LoremIpsum()


def get_lorem(length=2) -> List[str]:
    return _lorem.lorem(length)
