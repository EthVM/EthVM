pragma solidity ^0.4.24;
contract DummyToken {
    constructor(address addr) public {
        balances[addr] = 500000000000000;
    }
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value, "low sender balance");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }
    function killMe() public {
        selfdestruct(this);
    }
    mapping (address => uint256) balances;
    mapping (address => mapping (address => uint256)) allowed;
}