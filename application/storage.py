#encoding: utf-8
import heapq
from hashlib import md5
from datetime import datetime, timedelta


class SecretStorage():
    def __init__(self, *args, **kwargs):
        self.keys = {}
        self.expire_heap = []

    def save(self, content, expire=1800, num=1, callback=None):
        """
        :param content:
        :param expire: expire in seconds
        :param num: number of possible views
        :param callback: callback url or email
        :return: json {link: '', hash: ''}
        """
        secret_key = self.generate_secret()
        now = datetime.now()
        expire_at = now + timedelta(expire)
        self.keys[secret_key] = {
            'content': content,
            'expire': expire_at,
            'num': num,
            'callback': callback
        }
        heapq.heappush(self.expire_heap, (expire_at, secret_key))

    def get(self, key):
        """
        :param key: secret hash
        :return: content or None
        """
        now = datetime.now()
        if not key in self.keys:
            return None
        else:
            if self.keys[key]['expire'] > now:
                self.keys.pop(key)
                return None
            self.keys[key]['num'] -= 1
            if self.keys[key]['num'] <= 0:
                return self.keys.pop(key)
            return self.keys[key]

    def expire(self):
        pass

    def generate_secret(self):
        return u'{0}{1}'.format(md5().hexdigest(), md5().hexdigest())
