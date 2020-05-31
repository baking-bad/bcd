dev:
	npm run serve

you:
	npm run serve -- --mode you

box:
	npm run serve -- --mode box

deploy-prod:
	curl -s https://api.github.com/repos/baking-bad/bcd/releases/latest | grep "browser_download_url.*bcd.tar.gz" | cut -d : -f 2,3 | tr -d \" | wget -qi -
	tar -xzf bcd.tar.gz
	cp -a ./dist/. /var/www/bcd
	nginx -s reload
	rm -rf dist
	rm -f bcd.tar.gz

deploy-test:
	curl -s https://api.github.com/repos/baking-bad/bcd/releases/latest | grep "browser_download_url.*bcd.tar.gz" | cut -d : -f 2,3 | tr -d \" | wget -qi -
	tar -xzf bcd.tar.gz
	cp -a ./dist/. /var/www/bcd-test
	nginx -s reload
	rm -rf dist
	rm -f bcd.tar.gz

latest:
	git tag latest -f && git push origin latest -f

image:
	docker build -t bakingbad/bcdhub-gui:latest .

release:
	BCD_VERSION=$$(cat package.json | grep version | awk -F\" '{ print $$4 }')
	git tag $$BCD_VERSION && git push origin $$BCD_VERSION