// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A simulator for car sharing
/// @author Elijah T.
/// @notice You can use this contract for only the most basic simulation of car sharing service
/// @dev All function calls are currently implemented without side effects

interface Registerable {
	function registerDriver(string memory name, string memory license) external;
}

contract CarSharing is Registerable, Ownable{

	/// @notice wallet address mapping to balance of user
	mapping ( address => uint ) private balance;

	/// @notice wallet address mapping to car rent status of user
	mapping ( address => uint ) public rentStatus;

	/// @notice wallet address mapping to User struct
	mapping ( address => User ) public users;

	/// @notice plate No. mapping to Car struct
	mapping ( string => Car ) public cars;

	/// @notice wallet address mapping to registration status of user
	mapping ( address => uint ) public registered;

	/// @notice Car struct
	struct Car {
	bool reserved;
	address reservedBy;
	}

	/// @notice User struct
	struct User {
    string name;
    string license;
	bool registered;
	bool rented;
	bool banned;
  }

/// @notice Checks if user is registered
modifier registeredUser() {
	require(users[msg.sender].registered, "You have to be registered first");
	_;
}

/// @notice Checks if user is unregistered
modifier unregisteredUser() {
	require(!users[msg.sender].registered, "You are already registered");
	_;
}

/// @notice Checks if driver is currently renting other car
modifier onlyRentOne() { 
	require(!users[msg.sender].rented, "You can only rent 1 car at a time");
	_;
}

/// @notice Checks if user is banned
modifier checkIfBanned() { 
	require(!users[msg.sender].banned, "You have been banned, please contact support");
	_;
}

/// @notice Checks if user has reserved any cars
modifier checkIfRented(string memory plateNo) { 
	require(cars[plateNo].reserved, "You have not rented any car");
	require(cars[plateNo].reservedBy == msg.sender, "You have not rented any car");
	_;
}

/// @notice Emitted when a user is registered
/// @param user Account address
/// @param name Name of user 
/// @param license Driving license
event UserRegistered(address user, string name, string license);

/// @notice Emitted when a user reserves a car 
/// @param user Account address
/// @param plateNo Reserved car plate no. 
event CarReserved(address user, string plateNo);

/// @notice Emitted when a user releases a reserved car 
/// @param user Account address
/// @param plateNo Reserved car plate no. 
event CarReleased(address user, string plateNo);

 /// @notice Bans a user with a given wallet address
 /// @param _user Wallet address of the user
function banUser(address _user) onlyOwner private
    {
        users[_user].banned = true;
    }

/// @notice Registers a user 
/// @param name Name of user
/// @param license Driving license of user
function registerDriver(string memory name, string memory license) public unregisteredUser() {

	users[msg.sender] = User({
     name: name, 
     license: license,
	 registered: true,
	 rented: false,
	 banned: false
    });

	emit UserRegistered(msg.sender, name, license);
}

/// @notice Releases a reserved car
/// @param plateNo Plate No. of reserved car
function unrentCar(string memory plateNo) public payable registeredUser() checkIfRented(plateNo) checkIfBanned(){

	uint refundAmount = balance[msg.sender];
	balance[msg.sender] = 0;
	users[msg.sender].rented = false;
	cars[plateNo].reserved = false;
	payable(msg.sender).call{ value: refundAmount};
	emit CarReleased(msg.sender, plateNo);
}

/// @notice Reserves a car
/// @param fee Reserve fee
/// @param plateNo Plate No. of unreserved car
function rentCar(uint fee, string memory plateNo) public payable registeredUser() onlyRentOne() checkIfBanned(){
	
	balance[msg.sender] += fee;
	users[msg.sender].rented = true;
	cars[plateNo].reserved = true;
	cars[plateNo].reservedBy = msg.sender;
	emit CarReserved(msg.sender, plateNo);
}

/// @notice Return balance of user
function getBalance() public view returns (uint) {
	return balance[msg.sender];
}

/// @notice Return reserve status of user
/// @param _user Wallet address of user
function getRentStatus(address _user) public view returns (bool) {
	return users[_user].rented;
}

/// @notice Return registration status of user
/// @param _user Wallet address of user
function getRegistrationStatus(address _user) public view returns (bool) {
	return users[_user].registered;
}

}