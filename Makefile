.ONESHELL:
.PHONY: release

dev:
	yarn serve

white:
	yarn serve -- --mode white

test:
	yarn serve -- --mode test

api:
	yarn serve -- --mode api

image:
	docker build -t bakingbad/bcdhub-gui:latest .

stable-image:
	STABLE_TAG=$$(cat package.json | grep version | awk -F\" '{ print $$4 }' |  cut -d '.' -f1-2)
	docker build -t bakingbad/bcdhub-gui:$$STABLE_TAG .

release:
	BCD_VERSION=$$(cat package.json | grep version | awk -F\" '{ print $$4 }') && git tag $$BCD_VERSION && git push origin $$BCD_VERSION
