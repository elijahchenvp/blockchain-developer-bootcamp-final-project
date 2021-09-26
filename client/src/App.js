import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CarSharingContract from "./contracts/CarSharing.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { rentStatus: null, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = SimpleStorageContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CarSharingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CarSharingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.rentCar);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  rentCar = async () => {
    const { accounts, contract } = this.state;
    // Stores a given value
   await contract.methods.rentCar().send({ from: accounts[0] });

   // Get the value from the contract to prove it worked.
   const response = await contract.methods.getRentStatus(accounts[0]).call();
    if(response == 1){
      return this.setState({ rentStatus: "Car Rented" });
    }else{
      return this.setState({ rentStatus: "Car Not Rented" });
    }
 };

  setStorage = async () => {

    // Stores a given value
   await this.state.contract.methods.set(3).send({ from: this.state.accounts });

   // Get the value from the contract to prove it worked.
   const response = await this.state.contract.methods.get().call();

   // Update state with the result.
   return this.setState({ storageValue: response });
 };
  
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Welcome to SG Car Sharing Service!!</h1>
        <p>Enter vehicle number to start.</p>
          <div>Status: {this.state.rentStatus}</div>
      </div>
    );
  }
}

export default App;
