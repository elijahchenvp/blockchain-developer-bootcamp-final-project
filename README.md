# Final project - Car Rental Service

## Deployed version url:

http://159.223.79.220:3000/

## How to run this project locally:

### Prerequisites

- Node.js >= v14
- Truffle and Ganache
- Npm
- `git checkout master`

### Contracts

- Run `npm install` in project root to install Truffle build and smart contract dependencies
- Run `npm install @openzeppelin/contracts`
- Run local testnet in port `8545` with an Ethereum client, e.g. Ganache
- `truffle migrate --network development`
- `truffle console --network development`
- Run tests in Truffle console: `test`
- `development` network id is 5777, remember to change it in Metamask as well!

### Frontend

- `cd client`
- `npm install`
- `npm run start`
- Open `http://localhost:3000`

## Screencast link

https://youtu.be/enwECpgoQUg

## Public Ethereum wallet for certification:

`0xE9B0aBC4298c876C1B94E0A65DC944ab44854443`

## Project description

This project is a car rental service that allows user to reserve or release a reserved car.

## Simple workflow

1. Enter service web site
2. Connect with Metamask
3. Register as user
4. Enter vehicle plate no.
5. Reserve a vehicle or release a reserved vehicle

## Directory structure

- `client`: Project's React frontend.
- `contracts`: Smart contracts that are deployed in the Ropsten testnet.
- `migrations`: Migration files for deploying contracts in `contracts` directory.
- `test`: Tests for smart contracts.

## Environment variables (not needed for running project locally)

```
REACT_APP_RINKEBY_INFURA_URL=""
REACT_APP_RINKEBY_MNEMONIC=""
```

## TODO features

- User payments tracking
- Vehicle removal
- Fund withdrawal