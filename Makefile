debug:
	npm run serve -- --mode staging

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
