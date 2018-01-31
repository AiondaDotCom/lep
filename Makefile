installDependencies:
	######################
	# Fetch node_modules #
	######################
	docker-compose build helper
	docker run --rm -v $(CURDIR):/src lep_helper yarn install --ignore-scripts

buildAngular:
	#####################
	# Build Angular SPA #
	#####################
	docker run --rm -v $(CURDIR):/src lep_helper yarn postinstall

test: installDependencies
	############
	# Test API #
	############
	docker-compose run api npm test /srv/api

dev: installDependencies buildAngular
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
