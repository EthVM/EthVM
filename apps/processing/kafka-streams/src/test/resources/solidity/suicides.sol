pragma solidity ^0.4.24;

contract Suicide {

    constructor() public payable {
        selfdestruct(msg.sender);
    }
}

contract LazySuicide {

    constructor() public payable {}

    function killYourself() public payable {
        selfdestruct(msg.sender);
    }

}

contract SuicideFactory {

    function newSuicide() public payable {
        (new Suicide).value(address(this).balance)();
    }

}
