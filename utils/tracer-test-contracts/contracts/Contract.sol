pragma solidity 0.4.24;

contract Contract {
    bytes32 public Name;

    constructor (bytes32 name) public {
        Name = name;
    }
}
