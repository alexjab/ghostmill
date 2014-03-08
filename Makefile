install:
	npm install

install_globals:
	npm install forever -g gulp -g

init:
	cp conf.js.tpl conf.js && gulp

start:
	forever start gm-app.js && forever start gm-core.js

stop:
	forever stop gm-app.js && forever stop gm-core.js

kill:
	forever kill gm-app.js && forever kill gm-core.js

restart:
	forever restart gm-app.js && forever restart gm-core.js

.PHONY: install init start stop kill restart