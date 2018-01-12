import bn from 'bignumber.js';
import ethUnits from 'ethereumjs-units';
var Hex = /** @class */ (function () {
    function Hex(_hex) {
        this.hexString = '0x' + new Buffer(_hex).toString('hex');
    }
    Hex.prototype.toString = function () {
        return this.hexString;
    };
    Hex.prototype.toBuffer = function () {
        return new Buffer(this.hexString.substring(2), 'hex');
    };
    return Hex;
}());
var HexTime = /** @class */ (function () {
    function HexTime(_time) {
        this.time = '0x' + new Buffer(_time).toString('hex');
    }
    HexTime.prototype.toString = function () {
        return this.time;
    };
    HexTime.prototype.toBuffer = function () {
        return new Buffer(this.time.substring(2), 'hex');
    };
    HexTime.prototype.toDate = function () {
        return new Date(new bn(this.time).toNumber() * 1000);
    };
    return HexTime;
}());
var Address = /** @class */ (function () {
    function Address(_add) {
        this.address = '0x' + new Buffer(_add).toString('hex');
        this.address = this.address == '0x' ? '0x0000000000000000000000000000000000000000' : this.address;
    }
    Address.prototype.toString = function () {
        return this.address;
    };
    Address.prototype.toBuffer = function () {
        return new Buffer(this.address.substring(2), 'hex');
    };
    return Address;
}());
var Hash = /** @class */ (function () {
    function Hash(_hash) {
        this.hash = '0x' + new Buffer(_hash).toString('hex');
        this.hash = this.hash == '0x' ? '0x0' : this.hash;
    }
    Hash.prototype.toString = function () {
        return this.hash;
    };
    Hash.prototype.toBuffer = function () {
        return new Buffer(this.hash.substring(2), 'hex');
    };
    return Hash;
}());
var EthValue = /** @class */ (function () {
    function EthValue(_value) {
        this.value = '0x' + new Buffer(_value).toString('hex');
        this.value = this.value == '0x' ? '0x0' : this.value;
    }
    EthValue.prototype.toEth = function () {
        return ethUnits.convert(new bn(this.value).toFixed(), 'wei', 'eth');
    };
    EthValue.prototype.toWei = function () {
        return ethUnits.convert(new bn(this.value).toFixed(), 'wei', 'wei');
    };
    EthValue.prototype.toGWei = function () {
        return ethUnits.convert(new bn(this.value).toFixed(), 'wei', 'gwei');
    };
    EthValue.prototype.toString = function () {
        return this.value;
    };
    return EthValue;
}());
var HexNumber = /** @class */ (function () {
    function HexNumber(_value) {
        this.value = '0x' + new Buffer(_value).toString('hex');
        this.value = this.value == '0x' ? '0x0' : this.value;
    }
    HexNumber.prototype.toNumber = function () {
        return new bn(this.value).toFixed();
    };
    HexNumber.prototype.toString = function () {
        return this.value;
    };
    return HexNumber;
}());
var common = {
    Hash: function (_hash) {
        return new Hash(_hash);
    },
    EthValue: function (_value) {
        return new EthValue(_value);
    },
    HexNumber: function (_value) {
        return new HexNumber(_value);
    },
    Address: function (_add) {
        return new Address(_add);
    },
    Hex: function (_hex) {
        return new Hex(_hex);
    },
    HexTime: function (_time) {
        return new HexTime(_time);
    }
};
export { common, Hash, EthValue, HexNumber, Address, Hex, HexTime };
//# sourceMappingURL=common.js.map