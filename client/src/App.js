import React, { Component } from "react";
import { useEffect, useState } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import CarSharingContract from "./contracts/CarSharing.json";
import getWeb3 from "./getWeb3";
import "./App.css";

const App = () => {
  
  const [message, setMessage] = useState(""); //default message
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [regStatus, setRegStatus] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState("User Registered 🔴");
  const [rentStatus, setRentStatus] = useState("Car Reserved 🔴");
  const [userRegistered, setUserRegistered] = useState("0");
  const [userRented, setUserRented] = useState("0");
  const [contract, setContract] = useState("");
  const [content, setContent] = useState("test");
  const [userName, setUserName] = useState("");
  const [license, setLicense] = useState("");
  const [plateNo, setPlateNo] = useState("");
  //state = { message: null, userName: null, userId: null, rentStatus: null, web3: null, accounts: null, contract: null };

  useEffect(async () => {
    await whenWalletConnected();
    // const message = "hello";
    // setMessage(message);
    
  }, []);

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
      setContract(instance);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      //this.setState({ web3, accounts, contract: instance }, this.startApp);

      instance.events.UserRegistered({}, (error, data) => {
        if (error) {
          setMessage(error.message);
        } else{
          setRegistrationStatus("User Registered 🟢");
          setUserRegistered("1");
        }
      });

      instance.events.CarReserved({}, (error, data) => {
        if (error) {
          setMessage(error.message);
        } else{
          setRentStatus("Car Reserved 🟢");
          setUserRented("1");
        }
      });

      instance.events.CarReleased({}, (error, data) => {
        if (error) {
          setMessage(error.message);
        } else{
          setRentStatus("Car Reserved 🔴");
        }
      });
  };

  const componentDidMount = async () => {
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
      //this.setState({ web3, accounts, contract: instance }, this.startApp);

      instance.events.UserRegistered({}, (error, data) => {
        if (error) {
          alert(error.message);
        } else{
          this.setState({ registrationStatus: "You are registered"});
        }
        
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  const runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

 const rentCar = async () => {
 await contract.methods.rentCar(10, plateNo).send({ from: walletAddress });
};

const unrentCar = async () => {
  await contract.methods.unrentCar(plateNo).send({ from: walletAddress });
 };

const registerUser = async () => {
  if(userRegistered == "0"){
    await contract.methods.registerDriver(userName, license).send({ from: walletAddress });
  }else{
    setRegStatus("You are already registered!");
  }
  
};

const getUserStatus = async (address) => {
  let response = await contract.methods.getRegistrationStatus(address).call();
  if(response){
    setRegistrationStatus("User Registered 🟢");
    setUserRegistered("1");
  }else{
    setRegistrationStatus("User Registered 🔴");
    setContent('<div>' 
     + '<h3 style={{ paddingTop: "18px" }}>User Registration</h3>'
     + ' <h3 style={{ paddingTop: "18px" }}>Name:</h3>'
     + '   <input'
     + '     type="text"'
     + '     placeholder="e.g. John Wick"'
     + '   />'
     + '  <h3 style={{ paddingTop: "18px" }}>License:</h3>'
     + '   <input'
     + '     type="text"'
     + '     placeholder="e.g. ID12345"'
     + '   />'
       
     + ' </div> '
     + ' <button id="publish" style={{ float: "right"}}>'
     + '     Register'
     + '   </button>');
  }

  response = await contract.methods.getRentStatus(address).call();
  if(response){
    setRentStatus("Car Reserved 🟢");
  }else{
    setRentStatus("Car Reserved 🔴");
  }
};


// getCurrentWalletConnected = async () => {
//   if (window.ethereum) {
//     try {
//       const addressArray = await window.ethereum.request({
//         method: "eth_accounts",
//       });
//       if (addressArray.length > 0) {
//         return {
//           address: addressArray[0],
//           status: "👆🏽 Write a message in the text-field above.",
//         };
//       } else {
//         return {
//           address: "",
//           status: "🦊 Connect to Metamask using the top right button.",
//         };
//       }
//     } catch (err) {
//       return {
//         address: "",
//         status: "😥 " + err.message,
//       };
//     }
//   } else {
//     return {
//       address: "",
//       status: (
//         <span>
//           <p>
//             {" "}
//             🦊{" "}
//             <a target="_blank" href={`https://metamask.io/download.html`}>
//               You must install Metamask, a virtual Ethereum wallet, in your
//               browser.
//             </a>
//           </p>
//         </span>
//       ),
//     };
//   }
// };

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

// const inputChanged = (e) => {
//   this.setState({ inputVal: e.target.value });
// }
  
const connectWalletPressed = async () => {
 await connectWallet().then((response) => {
  getUserStatus(response.address);
}, (error) => {
  /**
   * Handle error here
   */
});;
};

    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>;
    // }
    return (
      <div id="container">
      {/* <img id="logo" src={alchemylogo}></img> */}
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
        <h3 style={{ paddingTop: "18px" }}>Car Reservation</h3>
        <h4 style={{ paddingTop: "18px" }}>Plate No.:</h4>
     <input
        type="text"
        placeholder="e.g. SJW1011E"
        onChange={(e) => setPlateNo(e.target.value)}
        value={plateNo}
     />
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
