# investment-bitcoin-api

## How to run

### Preparing .env file
Initially you may copy the `.env.example` to `.env` file, changing the values that you need like the following ones:
- SEND_GRID_API_TOKEN
- SEND_GRID_SENDER
This env vars cannot be on example because of data sensibility. The other ones are referencing the local environment.
Some envs have default value inside the `src/main/config/env` file that validates the required envs to start the application

The NODE_ENV have the following available values to use at this moment:
* test: this value disables the sendgrid email sender to not exceed the email limit while running tests and bitcoin api response are mocked
* dev: only the send grid sender is disabled, the bitcoin api returns the value from api
* production: this value enable the sendgrid email sender, use at your with caution

### Running on docker
After prepared your env file, now you can run docker containers to use the application. At this step you can choose to run or not the api on the container, its your preference!
If you do, you can run the following command:
````shell
  docker compose up -d
````
After that, you need to run the db migrations using `docker exec -it investment-bitcoin-api yarn migrate:push`.
Now, your application and the environment required to proceed are ready to use, have fun! 🚀

### Running locally
But, if you want to run all the other containers but not the api to run it locally, you can use the following command:
````shell
  docker compose up -d db rabbitmq cache
````
Now you need to run the api locally to proceed with the tests, to do this, you first need to change your node version to the one used to build the project (available on .npmrc, if you have nvm, you can run `nvm install` to install the correct version) and run the following commands:
````shell
  yarn
  yarn dev
````
After that, you need to run the db migrations using `yarn migrate:push`.
*Obs:* The hot reload functionality was present on the both situations, select the one you like more 🔥.

### Running tests
To run the tests if you are using all dockerized application you can run:
````shell
  docker exec -it investment-bitcoin-api yarn test:coverage
````
Or, if you are using the api locally you can run:
````shell
  yarn test:coverage
````
Some other test commands are available to use like test and test:watch 

## Testing

To test the application manually calling the requests, you can use:
* The swagger available at the endpoint `/docs`
* The `requests.http` file using the rest client extension on vscode
* Or the http client of your preference like Postman, Insomnia, Httpie, and others

If you want, you can run `yarn prisma studio` or `docker exec -it investment-bitcoin-api yarn prisma studio` to get inside the database gui and check the registers.
You can also see the dashboard of the rabbit mq accessing the `http://localhost:15672` and access this using the `guest` user with password `guest`. 