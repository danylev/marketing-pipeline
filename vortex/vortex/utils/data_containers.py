from collections import Mapping


class PageDict(Mapping):

    default = ''

    def __init__(self, *args, **kwargs):
        self._storage = dict(*args, **kwargs)

    def __getitem__(self, key):
        try:
            return self._storage[key]
        except KeyError:
            return self.default

    def __iter__(self):
        return iter(self._storage)

    def __len__(self):
        return len(self._storage)

    @property
    def xpath(self):
        return self._storage.get('xpath')

    @property
    def css(self):
        return self._storage.get('css')

    @property
    def name(self):
        return self._storage.get('name')
