import json

from falcon import HTTP_200, HTTP_201

from vortex.utils.db import establish_connection


class MediumPosts:

    def on_get(self, request, response):
        conn = establish_connection()
        data = dir(conn)
        response.body = json.dumps({'hello': ' '.join(data)})
        response.status = HTTP_200
