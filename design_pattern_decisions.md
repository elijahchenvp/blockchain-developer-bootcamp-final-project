# Design patterns used

## Access Control Design Patterns

- `Ownable` design pattern used in administrative function: `banUser()`. This function do not need to be used by anyone else apart from the contract creator, i.e. the party that is responsible for managing the Car Sharing operations.

## Inheritance and Interfaces

- `CarSharing` contract inherits the OpenZeppelin `Ownable` contract to enable ownership for one managing user/party.