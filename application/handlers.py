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

    def get(self, key):
        data = self.application.storage.get(key)
        if data is None:
            self.clear()
            self.set_status(400)
            self.finish('Wrong key')
        else:
            self.write(data)

    def post(self):
        self.write("post")
