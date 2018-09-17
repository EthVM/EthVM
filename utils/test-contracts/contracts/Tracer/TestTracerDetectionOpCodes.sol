pragma solidity 0.4.23;

contract Contract {
    bytes32 public Name;

    constructor (bytes32 name) public {
        Name = name;
    }
}

contract Factory {
    address[] newContracts;

    function createOpcodeCreateContract () public {
        address newContract = new Contract("CREATE");
        newContracts.push(newContract);
    }
}
