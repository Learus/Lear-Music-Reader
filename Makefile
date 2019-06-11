.PHONY: clean erase install build start dev

start:
	@npm start

dev:
	@npm run dev

clean:
	@rm -rf build
	@rm -rf dist
	@rm -rf lear-music*

erase:
	@rm -rf node_modules

build:
	@npm run build

pack:
	@npm run electron-pack

install:
	@npm install