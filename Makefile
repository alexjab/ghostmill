install:
	npm install

install_globals:
	npm install forever -g gulp -g

init: init_conf init_static init_db

init_conf:
	cp conf.js.tpl conf.js

init_static:
	gulp

init_db:
	node init_db.js

start:
	forever start gm-app.js && forever start gm-core.js

stop:
	forever stop gm-app.js && forever stop gm-core.js

kill:
	forever kill gm-app.js && forever kill gm-core.js

restart:
	forever restart gm-app.js && forever restart gm-core.js

.PHONY: install install_globals init start stop kill restart