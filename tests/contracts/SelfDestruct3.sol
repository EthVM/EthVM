pragma solidity >=0.4.25 <0.6.0;
contract AutoSender {
    address payable public randomAddress = 0x01711853335F857442eF6f349B2467C531731318;
    function() external payable{}
    constructor(SelfDestruct3 sf) public payable {}
    function recurseTransferEth(uint amount, address payable add, AutoSender sf, uint count) public {
        add.transfer(amount);
        sf.recurseSend((count+1), this);
    }
    function transferEth(uint amount, address payable add) public {
        add.transfer(amount);
    }
    function destroyMe(address payable add) public {
        selfdestruct(add);
    }
    function recurseSend(uint count, AutoSender add) public {
        if(count < 50){
            add.recurseTransferEth(1, randomAddress, this, count);
        }
    }
}
contract SelfDestruct3 {
    address payable public randomAddress = 0x01711853335F857442eF6f349B2467C531731318;
    constructor() public payable {
        AutoSender sf1 = (new AutoSender).value(500 wei)(this);
        AutoSender sf2 = (new AutoSender).value(250 wei)(this);
        sf2.recurseSend(0, sf2);
        sf1.recurseSend(0, sf1);
        for(uint i = 0; i < 10; i++) {
            sf1.transferEth(1, randomAddress);
            sf1.destroyMe(address(uint160(address(sf2))));
            sf2.transferEth(1, randomAddress);
            sf2.destroyMe(address(uint160(address(sf1))));
        }
    }
    function destroy() public {
        assembly {
            selfdestruct(address)
        }
    }
}