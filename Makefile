dev:
	docker-compose build
	docker-compose up -d

deploy:
	##############
	# Deploy API #
	##############
	(cd lep-api && git push heroku)
	
	##############
	# Deploy SPA #
	##############
	(cd lep-spa && git push heroku)
