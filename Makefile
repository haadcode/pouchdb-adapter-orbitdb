all: start

deps:
	npm install

test: deps
	npm run test

start: deps
	npm start

clean:
	rm -rf hellodb/
	rm -rf orbitdb/
	rm -rf node_modules/

.PHONY: test start
