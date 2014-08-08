#encoding: utf-8

import tornado.ioloop
import tornado.web
import os
from tornado.options import define, options
from handlers import MainHandler, ApiHandler
from storage import SecretStorage

define("port", default=8000, help="run on the given port", type=int)
TASK_INTERVAL = 1000


class Application(tornado.web.Application):
    def __init__(self):
        self.storage = SecretStorage()
        handlers = [
            (r"/", MainHandler),
            (r"/api/(?P<key>[A-Za-z0-9-]+)", ApiHandler),
        ]
        settings = dict(
            cookie_secret="(d(34@)%g(6@056!z78+!z_&#no@)3$y0@l*8hmy08@v7nkw1v",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)

    def expire_update(self):
        """
        Task for check data expire
        """
        self.storage.expire()


def run():
    tornado.options.parse_command_line()
    app = Application()
    app.listen(options.port)
    tornado.ioloop.PeriodicCallback(app.expire_update, TASK_INTERVAL).start()
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    run()