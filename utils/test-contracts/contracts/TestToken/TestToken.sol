pragma solidity ^0.4.23;

import "./ERC20.sol";

contract TestToken is ERC20 {
    constructor() public {
      _mint(msg.sender, 20000000000000);
    }
}
