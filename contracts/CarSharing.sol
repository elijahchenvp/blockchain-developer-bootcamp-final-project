// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5 <0.9.0;

/// @title A simulator for car sharing
/// @author Elijah T.
/// @notice You can use this contract for only the most basic simulation
/// @dev All function calls are currently implemented without side effects

contract Ownable 
{    
  // Variable that maintains 
  // owner address
  address private _owner;
  
  // Sets the original owner of 
  // contract when it is deployed
  constructor()
  {
    _owner = msg.sender;
  }
  
  // Publicly exposes who is the
  // owner of this contract
  function owner() public view returns(address) 
  {
    return _owner;
  }
  
  // onlyOwner modifier that validates only 
  // if caller of function is contract owner, 
  // otherwise not
  modifier onlyOwner() 
  {
    require(isOwner(),
    "Function accessible only by the owner !!");
    _;
  }
  
  // function for owners to verify their ownership. 
  // Returns true for owners otherwise false
  function isOwner() public view returns(bool) 
  {
    return msg.sender == _owner;
  }
}

interface Token {
	function registerDriver(string memory name, string memory license) external;
}

contract CarSharing is Token, Ownable{

	mapping ( address => uint ) private balance;
	mapping ( address => uint ) public rentStatus;
	mapping ( address => User ) public users;
	mapping ( string => Car ) public cars;
	mapping ( address => uint ) public registered;

	// TODO 
	// Function to create vehicle records
	struct Car {
	bool reserved;
	address reservedBy;
	}

	struct User {
    string name;
    string license;
	bool registered;
	bool rented;
	bool banned;
  }


modifier registeredUser() {
	// checks if user is registered
	require(users[msg.sender].registered, "You have to be registered first");
	_;
}

modifier onlyRentOne() { 
	// checks if driver is currently renting other car
	require(!users[msg.sender].rented, "You can only rent 1 car at a time");
	_;
}

modifier checkIfBanned() { 
	// checks if driver is currently renting other car
	require(!users[msg.sender].banned, "You have been banned, please contact support");
	_;
}

modifier checkIfRented(string memory plateNo) { 
	// checks if user has rented car
	require(cars[plateNo].reserved, "You have not rented any car");
	require(cars[plateNo].reservedBy == msg.sender, "You have not rented any car");
	_;
}



event Received(address accountAddress, uint amount, string message);
event UserRegistered(address user, string name, string license);
event CarReserved(address user, string plateNo);
event CarReleased(address user, string plateNo);


fallback() external payable {
        emit Received(msg.sender, msg.value, "Fallback was called");
    }

function banUser(address _user) onlyOwner private
    {
        users[_user].banned = true;
    }

function registerDriver(string memory name, string memory license) public  {
	// check if already registered
	require(!users[msg.sender].registered, "You are already registered");

	//registered[msg.sender] = 1;

	// registers driver
	users[msg.sender] = User({
     name: name, 
     license: license,
	 registered: true,
	 rented: false,
	 banned: false
    });

	emit UserRegistered(msg.sender, name, license);
}

function unrentCar(string memory plateNo) public payable registeredUser() checkIfRented(plateNo) checkIfBanned(){

	// return stakeAmount - fees back to user
	uint refundAmount = balance[msg.sender];
	balance[msg.sender] = 0;

	// finish rental of car and release the reservation slot
	users[msg.sender].rented = false;
	cars[plateNo].reserved = false;

	payable(msg.sender).call{ value: refundAmount};
	emit CarReleased(msg.sender, plateNo);
}


function rentCar(uint x, string memory plateNo) public payable registeredUser() onlyRentOne() checkIfBanned(){
	
	// TODO
	// Set specific payable amount for user to reserve vehicle
	//balance[msg.sender] += x;
	users[msg.sender].rented = true;
	cars[plateNo].reserved = true;
	cars[plateNo].reservedBy = msg.sender;
	// reserves and start rental of car
	emit CarReserved(msg.sender, plateNo);
}

function getBalance() public view returns (uint) {
	return balance[msg.sender];
	// reserves and start rental of car

}

function getRentStatus(address _user) public view returns (bool) {
	return users[_user].rented;
	// reserves and start rental of car

}

function getRegistrationStatus(address _user) public view returns (bool) {
	return users[_user].registered;
	// reserves and start rental of car

}

}