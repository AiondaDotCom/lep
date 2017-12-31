installDependencies:
	######################
	# Fetch node_modules #
	######################
	docker-compose build helper
	docker run --rm -v $(CURDIR):/src lep_helper yarn install

dev: installDependencies
	#################################
	# Build and start docker images #
	#################################
	docker-compose stop
	docker-compose build
	docker-compose up -d

deploy:
	####################
	# Deploy to heroku #
	####################
	git push heroku dev:master
