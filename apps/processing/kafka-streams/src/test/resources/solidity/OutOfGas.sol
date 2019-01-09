contract OutOfGasInConstructor {

    constructor() public payable {
        while (true) {}
    }

}

contract OutOfGasInMethod {

    constructor() public payable {}

    function infiniteLoop() public {
        while (true) {}
    }
}