install: install-deps

run:
	bin/gendiff.js

install-deps:
	npm ci 

link:
	npm link

lint:
	npx eslint .

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

publish:
	npm publish --dry-run
