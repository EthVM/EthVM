pragma solidity 0.4.23;

contract Contract {
    address Owner;
    bytes32 public Name;

    constructor (bytes32 name) public {
        Owner = msg.sender;
        Name = name;
    }

    function changeName(bytes32 name) public {
        Name = name;
    }

    function destroy() public {
        selfdestruct(Owner);
    }
}

contract TracerDetectionOpCodes {

    constructor() public {
        // In total four OpCodes should appear: CREATE, CALL, CALL, SELFDESTRUCT

        // 1) This will trigger OpCode CREATE
        Contract c = new Contract("CREATE");

        // 2) This will trigger OpCode CALL
        c.changeName("CALL");

        // 3) This will trigger OpCode CALL & SELFDESTRUCT
        c.destroy();
    }
}
