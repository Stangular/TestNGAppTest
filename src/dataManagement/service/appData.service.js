"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dataHTTP_service_1 = require("../../dataManagement/service/dataHTTP.service");
var appData_model_1 = require("../../dataManagement/model/data/appData.model");
var AppDataService = (function () {
    function AppDataService(_httpService) {
        this._httpService = _httpService;
        this._appData = new appData_model_1.AppDataModel();
    }
    AppDataService.prototype.GetList = function (listName) {
        var list = this._appData.Lists.find(function (l) { return l.listName == listName; });
        if (!list || !list.items || list.items.length <= 0) {
            return [new appData_model_1.ListItem(1, 0, 'List not available')];
        }
        return list.items;
    };
    AppDataService.prototype.GetListIdFromName = function (listType, name) {
        var list = this.GetList(listType);
        var item = list.find(function (i) { return i.label == name; });
        return item ? item.id : -1;
    };
    AppDataService.prototype.GetListNameFromId = function (listType, id) {
        var list = this.GetList(listType);
        var item = list.find(function (i) { return i.id == id; });
        return item ? item.label : '';
    };
    AppDataService.prototype.HasContent = function (type) {
        var list = this._appData.Lists.find(function (l) { return l.listName == type; });
        return (!!list && list.items.length > 0);
    };
    AppDataService.prototype.PromiseLoad = function (appName) {
        var _this = this;
        if (appName === void 0) { appName = ''; }
        var p = 'http://localhost:52462/api/data/lists';
        return this._httpService.startUpPromise(p).then(function (data) {
            if (data) {
                _this._appData.SetLists(data);
                return data;
            }
            else {
                return false;
            }
        });
    };
    AppDataService.prototype.load = function () {
    };
    AppDataService.prototype.subscribeSuccess = function (data) {
        this._appData.SetLists(data);
    };
    AppDataService.prototype.subscribeError = function (data) {
    };
    AppDataService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [dataHTTP_service_1.DataHTTPService])
    ], AppDataService);
    return AppDataService;
}());
exports.AppDataService = AppDataService;
//# sourceMappingURL=appData.service.js.map