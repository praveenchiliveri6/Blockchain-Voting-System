Blockchain-Voting-System
=======
## Overview
The Block Chain Based Voting system is a project created by Blocksmiths team, In this project we used solidty to create the smart contract
and hosted it on Ganache, (you can also deploy the contract on public ethereum ledger) .The frontend DApp is developed using Reactjs and integrated with the smart contract using Web3.js


## Pre-requisites
1. Install Javascript
2. Install `Metamask` Wallet.
3. Install `ganache` 
4. Install truffle
   
## Running VotingDapp Locally

Clone Repo: 

```sh
git clone https://github.com/praveenchiliveri6/Blockchain-Project.git
cd Blockchain-Project
```

Quickstart the blockchain network in the ganache application, add the ganache test network into the metamask, import the private key of any ganache ethereum wallet address into metamask.

Add a new Admin address(Ethereum Wallet Address) in the constructor of src/contracts/VotingContract.sol file.

update new Admin address(Ethereum Wallet Address) in the src/components/updateCandidate/UpdateCandi.js file.

To build and deploy smart contract on ganache network:
```sh
cd src
truffle compile
truffle migrate
cd ..
```

Get the smart contract address of the above deployed contract.

update the contract address of the above deployed contract in src/components/Wallet/Wallet.js

Install Dependencies:

```sh
npm install
```

Run The Application:

```sh
npm start
```

 Open `localhost:3000` to access the application!

To start using the voting application, please watch the youtube video at https://youtube.com/

