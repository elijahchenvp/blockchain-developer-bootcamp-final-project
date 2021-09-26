// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16 <0.9.0;

contract CarSharing {

	mapping ( address => uint ) public stakeAmount;
	mapping ( address => uint ) public rentStatus;


constructor () public {

}
// modifier onlyRentOne() { 
    
// 	// checks if driver is currently renting other car
// 	_;
// };

// function registerDriver(address _driver) {

// 	// registers driver

// };

// function unrentCar(address _driver) {

// 	// finish rental of car and release the reservation slot

// };

function rentCar() public payable {
	stakeAmount[msg.sender] = msg.value;
	rentStatus[msg.sender] = 1;
	// reserves and start rental of car

}

function getRentStatus(address _user) public view returns (uint) {
	return rentStatus[_user];
	// reserves and start rental of car

}

}