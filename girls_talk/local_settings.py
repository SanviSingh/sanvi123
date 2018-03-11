import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SECRET_KEY = 'j-gdk6ccyi#96i&23&9j+cdedyag!p65_77+n1ylbz7#tv)+3p'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

DEBUG = False
