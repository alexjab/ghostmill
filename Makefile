install:
	npm install

install_globals:
	npm install forever -g gulp -g mocha -g

init: init_conf init_static init_db

init_conf:
	cp conf.js.tpl conf.js

init_static:
	gulp

init_db:
	node init_db.js

all: install install_globals init

start:
	forever start ghostmill-app.js && forever start ghostmill-core.js

stop:
	forever stop ghostmill-app.js && forever stop ghostmill-core.js

kill:
	forever kill ghostmill-app.js && forever kill ghostmill-core.js

restart:
	forever restart ghostmill-app.js && forever restart ghostmill-core.js

test:
	export NODE_ENV=test && mocha --ui bdd -R spec

.PHONY: install install_globals init start stop kill restart test