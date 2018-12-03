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
var DataItem = (function () {
    function DataItem(_ID) {
        this._ID = _ID;
    }
    DataItem.prototype.ID = function () {
        return this._ID;
    };
    return DataItem;
}());
exports.DataItem = DataItem;
var DataItems = (function (_super) {
    __extends(DataItems, _super);
    function DataItems(ID, _items) {
        if (_items === void 0) { _items = []; }
        var _this = _super.call(this, ID) || this;
        _this._items = _items;
        if (_items.length <= 0) {
            _this.addDefaultItem();
        }
        return _this;
    }
    Object.defineProperty(DataItems.prototype, "Count", {
        get: function () {
            return this._items.length;
        },
        enumerable: true,
        configurable: true
    });
    DataItems.prototype.ID = function () {
        return _super.prototype.ID.call(this);
    };
    DataItems.prototype.AddItem = function (item) {
        this._items.push(item);
        this.Goto(this._items.length - 1);
    };
    DataItems.prototype.RemoveItem = function () {
        this._items = this._items.splice(this._selectedItem);
        if (this._items.length <= 0) {
            this.addDefaultItem();
        }
        else {
            this.Goto(this._items.length - 1);
        }
    };
    DataItems.prototype.SelectedIndex = function () {
        return this._selectedItem;
    };
    DataItems.prototype.Goto = function (value) {
        this._selectedItem = -1;
        var c = this.Count - 1;
        if (value >= 0 && c >= 0 && value < c) {
            this._selectedItem = value;
            return true;
        }
        return false;
    };
    DataItems.prototype.First = function () {
        return this.Goto(0);
    };
    DataItems.prototype.Final = function () {
        return this.Goto(this.Count - 1);
    };
    DataItems.prototype.Next = function () {
        return this.Goto(this._selectedItem + 1);
    };
    DataItems.prototype.Previous = function () {
        return this.Goto(this._selectedItem - 1);
    };
    DataItems.prototype.SelectItem = function (ID) {
        return this.Goto(this._items.findIndex(function (i) { return i.ID() === ID; }));
    };
    return DataItems;
}(DataItem));
exports.DataItems = DataItems;
//# sourceMappingURL=dataitem.js.map