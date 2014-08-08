# encoding: utf-8
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, main page")


class ApiHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, password handler")

    def post(self):
        self.write("post")
