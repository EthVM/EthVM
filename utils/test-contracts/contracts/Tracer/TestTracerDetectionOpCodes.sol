pragma solidity 0.4.23;

contract Contract {
    bytes32 public Name;

    constructor (bytes32 name) public {
        Name = name;
    }

    function changeName(bytes32 name) public {
        Name = name;
    }
}

contract Factory {
    address[] contracts;

    constructor() public {
        // This will trigger OpCode CREATE
        Contract c = new Contract("CREATE");
        contracts.push(c);

        // This will trigger OpCode CALL
        c.changeName("CALL");
    }
}
