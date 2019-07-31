pragma solidity >=0.4.25 <0.6.0;

contract SelfDestruct {

    constructor() public payable {
    }
    function payableFunc() public payable {}
    function destroy() public {
        assembly {
            selfdestruct(address)
        }
    }
}