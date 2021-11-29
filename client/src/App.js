import React, { Component } from "react";
import { useEffect, useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CarSharingContract from "./contracts/CarSharing.json";
import getWeb3 from "./getWeb3";
import "./App.css";
const Web3 = require('web3')
const web3 = new Web3(window.web3.currentProvider);

const contractABI = require("./contracts/CarSharing.json");
const contractAddress = "0xe1850F5244bD1F9dF72b3f7a8411aFb79de1170F";
const contract = new web3.eth.Contract(
contractABI.abi, contractAddress
);


const App = () => {

  const [message, setMessage] = useState(""); //default message
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [regStatus, setRegStatus] = useState("");
  const [reserveStatus, setReserveStatus] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("User Registered 🔴");
  const [rentStatus, setRentStatus] = useState("Car Reserved 🔴");
  const [userRegistered, setUserRegistered] = useState("0");
  const [userRented, setUserRented] = useState("0");
  //const [contract, setContract] = useState("");
  const [content, setContent] = useState("test");
  const [userName, setUserName] = useState("");
  const [license, setLicense] = useState("");
  const [plateNo, setPlateNo] = useState("");
  const [web3, setWeb3] = useState("");
  //state = { message: null, userName: null, userId: null, rentStatus: null, web3: null, accounts: null, contract: null };
  
  useEffect(async () => {
    getCurrentWalletConnected().then((response) => { 
    
      getUserStatus(response.address); 
      setWallet(response.address);
      setStatus(response.status);});
      
      addWalletListener();
      addEventListener();
  }, []);

  function addEventListener() {
    contract.events.UserRegistered({}, (error, data) => {
      if (error) {
        setMessage(error.message);
      } else{
        setRegistrationStatus("User Registered 🟢");
        setUserRegistered("1");
      }
    });

    contract.events.CarReserved({}, (error, data) => {
      if (error) {
        setMessage(error.message);
      } else{
        setRentStatus("Car Reserved 🟢");
        setUserRented("1");
      }
    });

    contract.events.CarReleased({}, (error, data) => {
      if (error) {
        setMessage(error.message);
      } else{
        setRentStatus("Car Reserved 🔴");
      }
    });
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }

  const whenWalletConnected = async () => {
      const web3 = await getWeb3();
      
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CarSharingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CarSharingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );  
      //setContract(instance);
  };

 const rentCar = async () => {
  if(walletAddress != ""){
    if(userRented == "0"){
      await contract.methods.rentCar(10, plateNo).send({ from: walletAddress });
    }else{
      setReserveStatus("You have already reserved a car!");
    }
  }
};

const unrentCar = async () => {
  if(walletAddress != ""){
    if(userRented == "1"){
      await contract.methods.unrentCar(plateNo).send({ from: walletAddress });
    }else{
      setReserveStatus("You do not have a car reserved!");
    }
  }
 };

const registerUser = async () => {
  if(walletAddress != ""){
    if(userRegistered == "0"){
      await contract.methods.registerDriver(userName, license).send({ from: walletAddress });
    }else{
      setRegStatus("You are already registered!");
    }
}
};

const getUserStatus = async (address) => {
  let response = await contract.methods.getRegistrationStatus(address).call();

  if(response){
    setRegistrationStatus("User Registered 🟢");
    setUserRegistered("1");
  }else{
    setRegistrationStatus("User Registered 🔴");
  }

  response = await contract.methods.getRentStatus(address).call();
  if(response){
    setRentStatus("Car Reserved 🟢");
  }else{
    setRentStatus("Car Reserved 🔴");
  }
  
};


const getCurrentWalletConnected = async () => {
 
  if (window.ethereum) {

    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Enter any Teslo car plate no. above to reserve!",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "👆🏽 Enter any Teslo car plate no. above to reserve!",
        regStatus: "👆🏽 Register first to start car sharing!",
        address: addressArray[0],
      };
      setStatus(obj.status);
      setRegStatus(obj.regStatus)
      setWallet(obj.address);
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
  
};  
  
const connectWalletPressed = async () => {
 await connectWallet().then((response) => {
  getUserStatus(response.address);
}, (error) => {
  /**
   * Handle error here
   */
});;
};

    return (
      <div id="container">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h1 style={{ paddingTop: "50px" }}>Teslo Car Sharing Service</h1>
        <p id="registrationStatus">{registrationStatus}</p>
        <p id="rentStatus">{rentStatus}</p>
        <p>{message}</p>
      <div> 
        <h3 style={{ paddingTop: "18px" }}>User Registration</h3>
        <h4 style={{ paddingTop: "18px" }}>Name:</h4>
     <input
        type="text"
        placeholder="e.g. John Wick"
        onChange={(e) => setUserName(e.target.value)}
        value={userName}
     />
     <h4 style={{ paddingTop: "18px" }}>License:</h4>
      <input
        type="text"
        placeholder="e.g. ID12345"
        onChange={(e) => setLicense(e.target.value)}
        value={license}
      />
       <p id="status">{regStatus}</p>
     </div> 
     <button id="publish" style={{ float: "right"}} onClick={registerUser}>
        Register
     </button>


     <div> 
        <h3 style={{ paddingTop: "18px"}}>Car Reservation</h3>
        <h4 style={{ paddingTop: "18px"}}>Plate No.:</h4>
     <input
        type="text"
        placeholder="e.g. SJW1011E"
        onChange={(e) => setPlateNo(e.target.value)}
        value={plateNo}
     />
     <p id="status">{reserveStatus}</p>
     </div> 
     <button id="publish" style={{ float: "right"}} onClick={rentCar}>
        Reserve
     </button>
     <button id="publish" style={{ float: "right"}} onClick={unrentCar}>
        Release
     </button>
       <p id="status">{status}</p>
       
    </div>
    );
  };



export default App;
