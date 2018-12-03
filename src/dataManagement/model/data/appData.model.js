"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ListItem = (function () {
    function ListItem(id, value, label) {
        this.id = id;
        this.value = value;
        this.label = label;
    }
    return ListItem;
}());
exports.ListItem = ListItem;
var List = (function () {
    function List(listName, items) {
        if (items === void 0) { items = []; }
        this.listName = listName;
        this.items = items;
    }
    List.prototype.AddListItem = function (id, value, label) {
        this.items.push(new ListItem(id, value, label));
    };
    return List;
}());
exports.List = List;
var AppDataModel = (function () {
    function AppDataModel() {
        this.Lists = [];
    }
    AppDataModel.prototype.SetLists = function (data) {
        if (!data) {
            return;
        }
        var self = this;
        var listItems = data.content.find(function (c) { return c.fieldID == "ListItem"; });
        var listNames = data.content.find(function (c) { return c.fieldID == "ListName"; });
        var listValues = data.content.find(function (c) { return c.fieldID == "ListValue"; });
        var listIds = data.content.find(function (c) { return c.fieldID == "Id"; });
        listNames.values.forEach(function (listname, n) {
            var l = self.Lists.find(function (x) { return x.listName == listname; });
            if (!l) {
                l = new List(listname);
                var list = listNames.values.filter(function (x) { return x == listname; });
                for (var i = 0; i < list.length; i = i + 1) {
                    var x = n + i;
                    l.AddListItem(listIds.values[x], listValues.values[x], listItems.values[x]);
                }
                self.Lists.push(l);
            }
        });
    };
    return AppDataModel;
}());
exports.AppDataModel = AppDataModel;
//# sourceMappingURL=appData.model.js.map