pragma solidity ^0.4.24;

contract PingPong {

  event Pinged(address from);
  event Ponged(address from);

  constructor() public payable {
  }

  function start(address _other) public {
    PingPong other = PingPong(_other);
    other.ping();
  }

  function ping() public {
    emit Pinged(msg.sender);
  }

  function pong() public {
    emit Ponged(msg.sender);
  }

}

