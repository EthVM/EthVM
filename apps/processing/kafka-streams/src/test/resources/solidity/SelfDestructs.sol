pragma solidity ^0.4.24;

contract ImmediateSelfDestruct {

    constructor() public payable {
        selfdestruct(msg.sender);
    }
}

contract SelfDestruct {

    constructor() public payable {}

    function destroy() public payable {
        selfdestruct(msg.sender);
    }

}
