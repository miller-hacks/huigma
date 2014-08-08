# encoding: utf-8
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    template_name = 'base.html'

    def get(self):
        """
        Just return front end static
        """
        self.render(self.template_name)


class ApiHandler(tornado.web.RequestHandler):
    def __init__(self, *args, **kwargs):
        super(ApiHandler, self).__init__(*args, **kwargs)
        self.set_header('Content-Type', 'application/json; charset="utf-8"')

    def wrong_data(self, message):
        self.clear()
        self.set_status(400)
        self.finish(message)

    def get(self, key):
        """
        Try to get secret by hash or Http 400
        """
        data = self.application.storage.get(key)
        if data is None:
            self.wrong_data('Wrong key')
        else:
            self.write(data)

    def post(self):
        """
        Load params from post data and save secret
        N.B.> returns 400 for empty text message
        """
        print(self.request.__dict__)
        content = self.get_argument('content', None)
        params = dict()
        for key in ['expire', 'num', 'callback']:
            value = self.get_argument(key, None)
            if value:
                params[key] = value
        if content:
            self.write(self.application.storage.save(content, **params))
        else:
            self.wrong_data('No content')
