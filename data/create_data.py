#!/usr/bin/env python3

import json
import re
from os import path
from glob import glob
from natsort import natsorted
from collections import defaultdict
from bs4 import BeautifulSoup

BILARA_DATA_DIR = '../../bilara-data/'
SC_DATA_DIR = '../../sc-data/'

# load acronyms and author data
with open(path.join(SC_DATA_DIR, 'misc/uid_expansion.json')) as f:
    acronyms = { a['uid']: a for a in json.loads(f.read()) }

with open(path.join(SC_DATA_DIR, 'additional-info/author_edition.json')) as f:
    authors = { a['long_name']: a for a in json.loads(f.read()) }


# source: https://www.oreilly.com/library/view/python-cookbook/0596001673/ch03s24.html
def int_to_roman(inp):
    """ Convert an integer to a Roman numeral. """

    if not isinstance(inp, type(1)):
        raise TypeError("expected integer, got %s" % type(inp))
    if not 0 < inp < 4000:
        raise ValueError("Argument must be between 1 and 3999")
    ints = (1000, 900,  500, 400, 100,  90, 50,  40, 10,  9,   5,  4,   1)
    nums = ('M',  'CM', 'D', 'CD','C', 'XC','L','XL','X','IX','V','IV','I')
    result = []
    for i in range(len(ints)):
        count = int(inp / ints[i])
        result.append(nums[i] * count)
        inp -= ints[i] * count
    
    return ''.join(result).lower()

def extract_vol_pos(pts_ref: str):
    """ Extract volume and position from reference id. """

    match_position = re.search(r'([0-9]+\.)?([0-9]+)$', pts_ref)
    assert match_position != None and match_position.group(2) != None

    volume = match_position.group(1)
    volume = int_to_roman(int(volume.replace('.', ''))) if volume else None
    position = int(match_position.group(2))

    return '%s %i' % (volume, position) if volume else position

def extract_book(uid: str):
    """ Extract book acronym from uid. """

    book_id = re.match(r'^([^0-9]+)', uid).group(1)
    book_id = book_id.replace('pli-tv-vb-', '').replace('pli-tv-bi-', '').replace('pli-tv-bu', '').replace('pli-tv', '')

    assert book_id in acronyms
    assert acronyms[book_id]['acro']

    return acronyms[book_id]['acro']

def extract_edition(pts_ref: str):
    """ Extract edition number if exists. """

    edition = ''

    m = re.search(r'pts-vp-pli(1ed|2ed)', pts_ref)
    if m and m.group(1):
        edition = m.group(1)

    return edition

def format_pts(uid: str, pts_ref: str):
    """ Use SC segment reference and uid to convert PTS reference """

    edition = extract_edition(pts_ref)
    book = extract_book(uid)
    vol_pos = extract_vol_pos(pts_ref)

    return '%s (%s) %s' % (book, edition, vol_pos) if edition else '%s %s' % (book, vol_pos)


pts_to_refs = defaultdict(list)

# get all possible cross-refs for every pts ref
for ref_file in natsorted(glob(path.join(BILARA_DATA_DIR, 'reference/pli/ms/sutta/**/*.json'), recursive=True)):
    with open(ref_file) as f:
        ref_data = json.loads(f.read())

    for uid, reference_list in ref_data.items():
        all_refs = [uid] + [x.strip() for x in reference_list.split(',')]
        pts_refs = []

        for ref in all_refs:
            if ref.startswith('pts-vp-pli'):
                pts_refs.append(ref)


        for ref in pts_refs:
            pts_to_refs[format_pts(uid, ref)].append({
                'file': path.basename(ref_file).replace('.json', '').replace('_reference', ''),
                'refs': all_refs
            })

language_lookup = {}

for pts_formatted, items in pts_to_refs.items():
    for item in items:
        html_files = glob(path.join(SC_DATA_DIR, 'html_text', '*', 'pli', '**', item['file'] + '.html'), recursive=True)
        
        for html_file in html_files:
            language = html_file.split('html_text')[1][1:3]
            
            if not language in language_lookup:
                language_lookup[language] = defaultdict(list)

            try:
                with open(html_file) as f:
                    soup = BeautifulSoup(f.read(), 'html.parser')

                article = soup.find('article').attrs
                article_id = article['id']
                assert article_id                

                author = soup.find('meta', { 'name': 'author' })
                author_uid = authors[author['content']]['uid']
                assert author_uid
                
                # find first marker for link
                for ref in item['refs']:
                    marker = soup.find('a', { 'id': ref })

                    if marker:
                        link = 'https://suttacentral.net/%s/%s/%s#%s' % (article_id, language, author_uid, ref)
                        language_lookup[language][pts_formatted].append([article_id, link])
                        break
            except Exception as e:
                raise e
                print('error', html_file, e)

with open('data.json', 'w') as f:
    f.write(json.dumps(language_lookup))
