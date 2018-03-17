# Documentation for Aionda LEP


## General

### Registration

### Login
When a user logs in, the `/user/login` endpint returns a JSON Webtoken.
This token contains as payload:

| Key                | Value           |
| ------------------ | -------------|
| exp                | Expiration Timestamp of the token. Once a token is expired it cannot be used anymore |
| accountType        | Can be one of 'user', 'moderator', 'admin' |
| username           | The emailadress is used to identify the user. |
| maxExpireTimestamp | Up to this date, the token can be renewed via the `/user/renewToken` endpoint. |
| nRenew             | Number that counts the times that the token was renewed |



### Account types
There are three account types:

| account type | description |
| ------------ | ----------- |
| admin        | Has access to anything |
| moderator    | Is allowed to process requests |
| user         | Account type to send requests via the portal. Only whitelisted domains are able to register an account |

### Setup
Initially one admin account has to be created in order to manage the LEP. This can be done via the [createAccountCLI.js](../api/helpers/).

## Detailed informations
### [API](api/)

### [SPA](spa/)

### [Dev setup with docker](./docker.md)

### [Deploy to heroku](./herokuSetup.md)
