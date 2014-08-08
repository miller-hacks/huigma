#encoding: utf-8

import tornado.ioloop
from handlers import MainHandler, PasswordHandler

application = tornado.web.Application([
    (r"/", MainHandler),
    (r"/password/", PasswordHandler),
])

if __name__ == "__main__":
    application.listen(8000)
    tornado.ioloop.IOLoop.instance().start()