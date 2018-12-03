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
var Field = (function () {
    function Field(data) {
        this._data = [];
        this._dataID = '';
        this._fieldId = data.fieldID || '';
        this._data = data.values.concat([]);
    }
    Object.defineProperty(Field.prototype, "FieldId", {
        get: function () {
            return this._fieldId;
        },
        enumerable: true,
        configurable: true
    });
    Field.prototype.ValueIndex = function (value) {
        return this._data.findIndex(function (v) { return v === value; });
    };
    Field.prototype.OutputValue = function (recordNumber) {
        return this.Value(recordNumber);
    };
    Field.prototype.AddNew = function (fieldDef) {
        this._data.push(fieldDef.DefaultValue());
    };
    Field.prototype.Copy = function (recordNumber) {
        this._data.push(this._data[recordNumber]);
    };
    return Field;
}());
exports.Field = Field;
var BaseField = (function (_super) {
    __extends(BaseField, _super);
    function BaseField(data) {
        return _super.call(this, data) || this;
    }
    BaseField.prototype.Value = function (recordNumber) {
        return this._data[recordNumber];
    };
    BaseField.prototype.UpdateValue = function (value, recordNumber) {
        if (recordNumber === void 0) { recordNumber = 0; }
        this._data[recordNumber] = value;
    };
    return BaseField;
}(Field));
exports.BaseField = BaseField;
var DateField = (function (_super) {
    __extends(DateField, _super);
    function DateField(data) {
        return _super.call(this, data) || this;
    }
    DateField.prototype.Value = function (recordNumber) {
        return new Date(this._data[recordNumber]);
    };
    DateField.prototype.UpdateValue = function (value, recordNumber) {
        if (recordNumber === void 0) { recordNumber = 0; }
        this._data[recordNumber] = value.toString();
    };
    return DateField;
}(Field));
exports.DateField = DateField;
//# sourceMappingURL=field.js.map