class SecretStorage():
    def __new__(cls):
        if not hasattr(cls, 'instance'):
            cls.instance = super(SecretStorage, cls).__new__(cls)
        return cls.instance

    def save(self, content, expire=1800, num=1, callback=None):
        """
        :param content:
        :param expire: expire in seconds
        :param num: number of possible views
        :param callback: callback url or email
        :return: json {link: '', hash: ''}
        """
        pass

    def get(self, key):
        """
        :param key: secret hash
        :return: content
        """
        pass
