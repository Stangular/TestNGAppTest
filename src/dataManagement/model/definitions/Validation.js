"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Validation = (function () {
    function Validation() {
    }
    Validation.prototype.validateValue = function (v, fieldName) {
        var m = this.Message;
        if (!this.validate(v)) {
            if (m.length > 0) {
                return true;
            }
            return false;
        }
        return true;
    };
    return Validation;
}());
exports.Validation = Validation;
var Validator = (function (_super) {
    __extends(Validator, _super);
    function Validator(message, _regex) {
        if (message === void 0) { message = ''; }
        var _this = _super.call(this) || this;
        _this.message = message;
        _this._regex = _regex;
        return _this;
    }
    Object.defineProperty(Validator.prototype, "Message", {
        get: function () {
            return this.message;
        },
        enumerable: true,
        configurable: true
    });
    Validator.prototype.validate = function (v) {
        if (!this._regex) {
            return true;
        }
        if (!this._regex.test(v)) {
            return false;
        }
        return true;
    };
    return Validator;
}(Validation));
exports.Validator = Validator;
var ValueValidator = (function (_super) {
    __extends(ValueValidator, _super);
    function ValueValidator(message, value, compare) {
        var _this = _super.call(this) || this;
        _this.message = message;
        _this.value = value;
        _this.compare = compare;
        return _this;
    }
    Object.defineProperty(ValueValidator.prototype, "Message", {
        get: function () {
            return this.message;
        },
        enumerable: true,
        configurable: true
    });
    ValueValidator.prototype.validate = function (val) {
        var r = false;
        var v = parseInt(val);
        switch (this.compare) {
            case 0:
                r = v === this.value;
                break;
            case 1:
                r = v < this.value;
                break;
            case 2:
                r = v > this.value;
                break;
            case 3:
                r = v <= this.value;
                break;
            case 4:
                r = v >= this.value;
                break;
            case 5:
                r = v != this.value;
                break;
        }
        return r;
    };
    return ValueValidator;
}(Validation));
exports.ValueValidator = ValueValidator;
var NumberValidator = (function (_super) {
    __extends(NumberValidator, _super);
    function NumberValidator(message, max, min) {
        var _this = _super.call(this) || this;
        _this.message = message;
        _this.max = max;
        _this.min = min;
        return _this;
    }
    Object.defineProperty(NumberValidator.prototype, "Message", {
        get: function () {
            return this.message;
        },
        enumerable: true,
        configurable: true
    });
    NumberValidator.prototype.validate = function (v) {
        var y = parseInt(v);
        if (this.max < y) {
            return false;
        }
        if (this.min && this.min > y) {
            return false;
        }
        return true;
    };
    return NumberValidator;
}(Validation));
exports.NumberValidator = NumberValidator;
//# sourceMappingURL=Validation.js.map