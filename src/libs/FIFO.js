var FIFO = /** @class */ (function () {
    function FIFO(_limit, _processor) {
        this.arr = [];
        this.limit = _limit;
        this.processor = _processor;
    }
    FIFO.prototype.items = function () {
        return this.arr;
    };
    FIFO.prototype.add = function (item) {
        this.arr = this.processor(item, this.arr);
        if (this.arr.length > this.limit)
            this.arr = this.arr.slice(0, this.arr.length - 1);
    };
    FIFO.prototype.top = function () {
        return this.arr[0];
    };
    FIFO.prototype.remove = function (index) {
        this.arr.splice(index, 1);
    };
    return FIFO;
}());
export default FIFO;
//# sourceMappingURL=FIFO.js.map