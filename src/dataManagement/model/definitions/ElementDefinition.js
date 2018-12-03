"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var EditElementDefinition = (function () {
    function EditElementDefinition(_formID, _fieldID, _observe, _defaultValue, _initialValue, _currentValue, _label, _type, _mask, _validators) {
        if (_initialValue === void 0) { _initialValue = _defaultValue; }
        if (_currentValue === void 0) { _currentValue = _initialValue; }
        if (_label === void 0) { _label = ''; }
        if (_type === void 0) { _type = 'text'; }
        if (_mask === void 0) { _mask = []; }
        if (_validators === void 0) { _validators = []; }
        this._formID = _formID;
        this._fieldID = _fieldID;
        this._observe = _observe;
        this._defaultValue = _defaultValue;
        this._initialValue = _initialValue;
        this._currentValue = _currentValue;
        this._label = _label;
        this._type = _type;
        this._mask = _mask;
        this._validators = _validators;
        if (!this._validators) {
            _validators = [];
        }
        this.ResetToDefault();
    }
    EditElementDefinition.prototype.init = function () {
    };
    EditElementDefinition.prototype.Label = function () {
        return this._label;
    };
    EditElementDefinition.prototype.Type = function () {
        return this._type;
    };
    EditElementDefinition.prototype.FormID = function () {
        return this._formID;
    };
    EditElementDefinition.prototype.FieldID = function () {
        return this._fieldID;
    };
    EditElementDefinition.prototype.Observable = function () {
        return this._observe;
    };
    EditElementDefinition.prototype.Mask = function () {
        return this._mask;
    };
    EditElementDefinition.prototype.DefaultValue = function () {
        return this._defaultValue;
    };
    EditElementDefinition.prototype.InitialValue = function () {
        return this._initialValue || this.DefaultValue();
    };
    EditElementDefinition.prototype.CurrentValue = function () {
        return this._currentValue || this.InitialValue();
    };
    EditElementDefinition.prototype.isDirty = function () {
        return this._initialValue !== this._currentValue;
    };
    EditElementDefinition.prototype.ResetToDefault = function () {
        this._initialValue = this._defaultValue;
        this._currentValue = this._defaultValue;
    };
    EditElementDefinition.prototype.Clean = function () {
        this._initialValue = this._currentValue;
    };
    EditElementDefinition.prototype.validateValue = function (v) {
        var res = true;
        for (var _i = 0, _a = this._validators; _i < _a.length; _i++) {
            var validator = _a[_i];
            if (!validator.validate(v.toString())) {
                res = false;
            }
        }
        return res;
    };
    EditElementDefinition.prototype.SetInitialValue = function (v) {
        var res = this.validateValue(v);
        if (res) {
            this._initialValue = v;
            this._currentValue = this._initialValue;
        }
        return res;
    };
    EditElementDefinition.prototype.UpdateCurrentValue = function (v) {
        var res = this.validateValue(v);
        if (res) {
            this._currentValue = v;
        }
        return res;
    };
    return EditElementDefinition;
}());
exports.EditElementDefinition = EditElementDefinition;
;
//# sourceMappingURL=ElementDefinition.js.map