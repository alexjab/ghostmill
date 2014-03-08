install:
	npm install

install_globals:
	npm install forever -g gulp -g

init:
	cp conf.js.tpl conf.js && gulp

start:
	forever start app.js && forever start core.js

stop:
	forever stop app.js && forever stop core.js

kill:
	forever kill app.js && forever kill core.js

restart:
	forever restart app.js && forever restart core.js

.PHONY: install init start stop kill restart