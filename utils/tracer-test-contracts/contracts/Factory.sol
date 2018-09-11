pragma solidity 0.4.24;

import "Contract.sol";

contract Factory {
    address[] newContracts;

    function createContract (bytes32 name) public {
        address newContract = new Contract(name);
        newContracts.push(newContract);
    }
}
