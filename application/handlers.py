# encoding: utf-8
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    template_name = 'base.html'

    def get(self):
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
        data = self.application.storage.get(key)
        if data is None:
            self.wrong_data('Wrong key')
        else:
            self.write(data)

    def post(self):
        content = self.get_argument('content', None)
        params = dict()
        for key in ['expire', 'num', 'callback']:
            value = self.get_argument(key, None)
            if value:
                params[key] = value
        if content:
            self.write(self.application.storage.save(content, **params))
        else:
            self.wrong_data('no content')
