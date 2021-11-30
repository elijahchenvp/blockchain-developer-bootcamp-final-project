import React, { Component } from "react";
import { useEffect, useState } from "react";
import "./App.css";

const Web3 = require('web3')
const web3 = new Web3(window.web3.currentProvider);
const contractABI = require("./contracts/CarSharing.json");
const contractAddress = "0x0cd63bd8F79a5Ee37d8BE920b695098245789c33";
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
  const [userName, setUserName] = useState("");
  const [license, setLicense] = useState("");
  const [plateNo, setPlateNo] = useState("");
  
  useEffect(async () => {
    getCurrentWalletConnected().then((response) => { 
      if(response.address != ""){
      getUserStatus(response.address); 
      setWallet(response.address);
      setStatus(response.status);
      addWalletListener();
      }
    });
      
      
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

 const rentCar = async () => {
  if(plateNo != ""){
    if(walletAddress != ""){
      if(userRented == "0"){
        setReserveStatus("");
        await contract.methods.rentCar(10, plateNo).send({ from: walletAddress });
      }else{
        setReserveStatus("You have already reserved a car!");
      }
    }
  }else{
    setReserveStatus("Please fill in vehicle plate no.!");
  }
};

const unrentCar = async () => {
  if(plateNo != ""){
    if(walletAddress != ""){
      if(userRented == "1"){
        setReserveStatus("");
        await contract.methods.unrentCar(plateNo).send({ from: walletAddress });
      }else{
        setReserveStatus("You do not have a car reserved!");
      }
    }
  }else{
    setReserveStatus("Please fill in vehicle plate no.!");
  }
 };

const registerUser = async () => {
  if(userName != "" || license != ""){
    if(walletAddress != ""){
      if(userRegistered == "0"){
        setRegStatus("");
        await contract.methods.registerDriver(userName, license).send({ from: walletAddress });
      }else{
        setRegStatus("You are already registered!");
      }
     }
  }else{
    setRegStatus("Please fill in name and license details!");
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
  addWalletListener();
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
