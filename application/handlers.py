# encoding: utf-8
import tornado.web
import json


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

    def wrong_data(self, code, message):
        self.clear()
        self.set_status(code)
        self.finish(message)

    def get(self, key):
        """
        Try to get secret by hash or Http 400
        """
        data = self.application.storage.get(key)
        if data is None:
            self.wrong_data(404, 'Wrong key')
        else:
            self.write(data)

    def post(self):
        """
        Load params from post data and save secret
        N.B.> returns 400 for empty text message
        """
        print self.request.__dict__
        body = json.loads(self.request.body)
        content = body.get('content', None)
        params = dict()
        for key in ['expire', 'num', 'callback']:
            value = body.get(key, None)
            if value:
                params[key] = value
        if content:
            key = self.application.storage.save(content, **params)
            ret = {'key': key, 'link': '%s/%s' % (self.request.host, key)}
            self.write(json.dumps(ret))
        else:
            self.wrong_data(400, 'No content')
