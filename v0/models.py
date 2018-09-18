import datetime

from mongoengine import (
    connect, 
    Document, 
    StringField, 
    DateTimeField, 
    ListField,
    ReferenceField, 
    BooleanField, 
    IntField,
    CASCADE)

class Articles(Document):
    url = StringField(max_length=512, required=True, unique=True)
    scraped = DateTimeField(default=False)

    meta = {
        "ordering": ["scraped"],
    }


class Clappers(Document):
    name = StringField(max_length=512, required=True, unique=True)
    modified = DateTimeField(default=datetime.datetime.now)
    description = StringField(max_length=512, default='No description')
    liked = ListField(ReferenceField(Articles, reverse_delete_rule=CASCADE))
    mediumurl = StringField(max_length=512)
    facebookurl = StringField(max_length=512)
    facebookurl = IntField(unique=True)

    meta = {
        "ordering": ["-modified"],
    }
