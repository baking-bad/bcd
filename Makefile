.ONESHELL:
.PHONY: release

dev:
	npm run serve

you:
	npm run serve -- --mode you

box:
	npm run serve -- --mode box

deploy:
	curl -s https://api.github.com/repos/baking-bad/bcd/releases/latest | grep "browser_download_url.*bcd.tar.gz" | cut -d : -f 2,3 | tr -d \" | wget -qi -
	tar -xzf bcd.tar.gz
	cp -a ./dist/. /var/www/bcd
	nginx -s reload
	rm -rf dist
	rm -f bcd.tar.gz
	nginx -s reload

latest:
	git tag latest -f && git push origin latest -f

image:
	docker build -t bakingbad/bcdhub-gui:latest .

stable-image:
 	STABLE_TAG=$$(cat package.json | grep version | awk -F\" '{ print $$4 }' |  cut -d '.' -f1-2)
	docker build -t bakingbad/bcdhub-gui:$$STABLE_TAG .

release:
	BCD_VERSION=$$(cat package.json | grep version | awk -F\" '{ print $$4 }')
	git tag $$BCD_VERSION && git push origin $$BCD_VERSION
