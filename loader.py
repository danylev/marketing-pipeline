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
    with open('FB_URLs.json', 'r') as links:
        with open('data.json', 'r') as persons:
            persons = json.load(persons)
            raw_urls = json.load(links)
            for link in raw_urls:
                identifier = hashlib.sha224(link.get('query').encode('utf-8')).hexdigest()
                person = persons.get(identifier)
                person['facebookurl'] = sanitize_url(link.get('facebookUrl'))
                persons[identifier] = person
            with open('data_with_url.json', 'w') as output:
                json.dump(persons, output, indent=2)
            with open('just_urls.json', 'w') as nextstep:
                json.dump([url['facebookUrl'] for url in raw_urls], nextstep, indent=2)
            with open('utility_mapping.json', 'w') as util:
                utility = {hashlib.sha224(v.get('facebookurl').encode('utf-8')).hexdigest(): hashlib.sha224(v.get('name').encode('utf-8')).hexdigest() for v in persons.values()}
                json.dump(utility, util, indent=2)
