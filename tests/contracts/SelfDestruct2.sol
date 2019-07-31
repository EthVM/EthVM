pragma solidity >=0.4.25 <0.6.0;
import "./SelfDestruct.sol";

contract SelfDestruct2 {

    constructor() public payable {
        SelfDestruct sf1 = (new SelfDestruct).value(1 ether)();
        SelfDestruct sf2 = (new SelfDestruct).value(2 ether)();
        SelfDestruct sf3 = (new SelfDestruct).value(3 ether)();
        sf1.destroy();
        sf1.payableFunc.value(4 ether)();
        sf2.destroy();
        sf2.payableFunc.value(5 ether)();
        sf3.payableFunc.value(6 ether)();
    }

    function destroy() public {
        assembly {
            selfdestruct(address)
        }
    }
}