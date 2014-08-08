#encoding: utf-8
import heapq
from hashlib import md5


class SecretStorage():
    def __init__(self, *args, **kwargs):
        self.keys = {}

    def save(self, content, expire=1800, num=1, callback=None):
        """
        :param content:
        :param expire: expire in seconds
        :param num: number of possible views
        :param callback: callback url or email
        :return: json {link: '', hash: ''}
        """

    def get(self, key):
        """
        :param key: secret hash
        :return: content
        """
        pass

    def expire(self):
        pass

    def generate_secret(self):
        return u'{0}{1}'.format(md5().hexdigest(), md5().hexdigest())
