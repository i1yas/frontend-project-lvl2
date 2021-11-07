setup:
	npm install
publish:
	npm publish --dry-run
link:
	npm link
lint:
	npx eslint .
test:
	npx jest --config ./jest.config.js --watch
