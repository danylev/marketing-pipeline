import json 
import os
import hashlib

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

def extract_urls(raw_urls):
    just_urls = [value.get('facebookUrl') for value in raw_urls]
    with open('face_urls.json', 'w') as output:
        json.dump(just_urls, output, indent=2)

def sanitize_url(url):
    return '/'.join(url.split('/')[:4])+'/'
if __name__ == "__main__":
    with open('data_with_url.json') as fd1:
        data = json.load(fd1)
        with open('utility_mapping.json') as fd2:
            mapping = json.load(fd2)
            with open('FB_IDs') as fd3:
                ids = json.load(fd3)
                for some_id in ids:
                    url = some_id.get('originalUrl')
                    print(url)
                    if not url.endswith('/'):
                        url = url + '/'
                    url_id = hashlib.sha224(url.encode('utf-8')).hexdigest()
                    id_to_append = some_id.get('id')
                    try:
                        person_id = mapping[url_id]
                    except KeyError:
                        splitted = url.split('/')
                        person_id = mapping[hashlib.sha224(('/'.join(splitted[:4])+'/').encode('utf-8')).hexdigest()]
                    person_data = data[person_id]
                    person_data['id'] = id_to_append if id_to_append else 'Private or non existing FB'
                    data[person_id] = person_data
                with open('data_full.json', 'w') as fd4:
                    json.dump(data, fd4, indent=2)
