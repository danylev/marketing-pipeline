import json 
import os
import hashlib

from dotenv import load_dotenv

from models import Articles, Clappers
load_dotenv()

CLAPPERS = [data for data in os.listdir() if 'CLAPPERS' in data]

def load_articles(path='./'):
    files = os.listdir(path)

    names = {}
    articles = [data for data in files if 'CLAPPERS' in data]
    for article in articles:
        with open(article) as raw_data:
            data = json.load(raw_data)
            for people in data['clappers']:
                if hashlib.sha224(people.get('name').encode('utf-8')).hexdigest() in names:
                    names[hashlib.sha224(people.get('name').encode('utf-8')).hexdigest()].get('liked').append(data.get('url'))
                else:
                    names.update({
                        hashlib.sha224(people.get('name').encode('utf-8')).hexdigest() : {
                        'name': people.get('name'),
                        'description': people.get('description'),
                        'mediumurl': people.get('profileUrl'),
                        'liked': [data.get('url'), ]
                        }
                     })
    return names

def dump_names(names):
    just_names = [value.get('name') for _,value in names.items()]
    with open('names.json', 'w') as data:
        json.dump(just_names, data, indent=2)
    with open('data.json', 'w') as output:
        json.dump(names, output, indent=2)

if __name__ == "__main__":
    names = load_articles(path='./')
   
