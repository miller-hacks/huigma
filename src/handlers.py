# encoding: utf-8
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, main page")


class PasswordHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, password handler")