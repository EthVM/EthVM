pragma solidity ^0.4.24;
contract DummyContract {
    constructor() public {}
    function add(uint a, uint b) public returns (uint) {
        return a+b;
    }
}