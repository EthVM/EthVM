pragma solidity ^0.4.24;

import "./Seriality/Seriality.sol";
import "./PublicTokens.sol";

contract TokenBalances is Seriality {

    struct Token {
        bytes16 name;    // Name of the token
        bytes16 symbol;  // Symbol of the token
        address addr;    // Address of the token contract
        uint8 decimals;  // decimals of the token
        bytes32 website; // website of the token
        bytes32 email;   // support email of the token
        bool isValid;    // whether the token is valid or not
    }

    PublicTokens pubT;

    constructor(address tokenStorage) public {
        pubT = PublicTokens(tokenStorage);
    }

    function getTokenStorage() public view returns (address) {
        return pubT;
    }

    function isContract(address addr) internal view returns (bool) {
        uint32 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    function getToken(uint id) internal view returns (Token token) {
        (token.name, token.symbol, token.addr, token.decimals, token.website, token.email, token.isValid) = pubT.pubTokens(id);
    }

    function getTokenBalance(address tokenAddr, address addr) public view returns (uint bal) {
        bytes4 sig = bytes4(keccak256("balanceOf(address)"));
        assembly {
            // move pointer to free memory spot
            let ptr := mload(0x40)
            // put function sig at memory spot
            mstore(ptr, sig)
            // append argument after function sig
            mstore(add(ptr,0x04), addr)

            let result := call(
                150000,    // gas limit
                tokenAddr, // to addr. append var to _slot to access storage variable
                0,         // not transfer any ether
                ptr,       // Inputs are stored at location ptr
                0x24,      // Inputs are 36 bytes long
                ptr,       // Store output over input
                0x20)      // Outputs are 32 bytes long

            if iszero(result) {
                bal := 0 // return 0 on error and 0 balance
            }

            if gt(result, 0) {
                bal := mload(ptr) // Assign output to answer var
            }

            mstore(0x40, add(ptr,0x20)) // Set storage pointer to new space
        }
    }

    function getAllBalance(address _owner, bool name, bool website, bool email, uint _count) public view returns (bytes) {
        uint count;
        address tOwner = _owner;

        if (_count == 0) {
            count = pubT.tokenCount();
        } else {
            count = _count;
        }

        bool[] memory validTokens = new bool[](count + 1);
        uint bufferSize = 33; // assign 32 bytes to set the total number of tokens + define start
        bufferSize += 3;      // set name, website, email
        uint countValidTokens = 0;

        for (uint i = 1; i <= count; i++) {
            Token memory token = getToken(i);
            if (token.isValid && isContract(token.addr)) {
                validTokens[i] = true;
                countValidTokens++;
                if (name) bufferSize += 16;
                if (website) bufferSize += 32;
                if (email) bufferSize += 32;
                bufferSize += 69; // address (20) + symbol(16) + balance(32) + decimals(1)
    		} else {
                validTokens[i] = false;
            }
        }

        bytes memory result = new bytes(bufferSize);
        uint offset = bufferSize;

        // serialize
        boolToBytes(offset, true, result);
        offset -= 1;

        uintToBytes(offset, countValidTokens, result);
        offset -= 32;

        boolToBytes(offset, name, result);
        offset -= 1;

        boolToBytes(offset, website, result);
        offset -= 1;

        boolToBytes(offset, email, result);
        offset -= 1;

        for (i = 1; i <= count; i++) {
            if (!validTokens[i]) {
                continue;
            }

            token = getToken(i);

            bytes16ToBytesR(offset, token.symbol, result);
            offset -= 16;

            addressToBytes(offset, token.addr, result);
            offset -= 20;

            uintToBytes(offset, token.decimals, result);
            offset -= 1;

            uintToBytes(offset, getTokenBalance(token.addr, tOwner), result);
            offset -= 32;

            if (name) {
                bytes16ToBytesR(offset, token.name, result);
                offset -= 16;
    		}

            if (website) {
                bytes32ToBytesR(offset, token.website, result);
                offset -= 32;
    		}

            if (email) {
                bytes32ToBytesR(offset, token.email, result);
                offset -= 32;
    		}
        }

        return result;
    }
}
