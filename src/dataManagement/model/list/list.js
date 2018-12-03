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
var ListType;
(function (ListType) {
    ListType[ListType["SELECT"] = 0] = "SELECT";
    ListType[ListType["CHECK"] = 1] = "CHECK";
    ListType[ListType["RADIO"] = 2] = "RADIO";
    ListType[ListType["TYPEAHEAD"] = 3] = "TYPEAHEAD";
})(ListType = exports.ListType || (exports.ListType = {}));
var ListItem = (function () {
    function ListItem(_id, _content) {
        this._id = _id;
        this._content = _content;
    }
    ListItem.prototype.ID = function () { return this._id; };
    ListItem.prototype.Content = function () { return this._content; };
    return ListItem;
}());
exports.ListItem = ListItem;
var List = (function (_super) {
    __extends(List, _super);
    function List(_name, _id, listType, _items) {
        if (listType === void 0) { listType = ListType.SELECT; }
        if (_items === void 0) { _items = []; }
        var _this = _super.call(this, _id, _name) || this;
        _this.listType = listType;
        _this._items = _items;
        return _this;
    }
    List.prototype.AddItem = function (id, content) {
        this._items.push(new ListItem(id, content));
    };
    Object.defineProperty(List.prototype, "Items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    return List;
}(ListItem));
exports.List = List;
//# sourceMappingURL=list.js.map