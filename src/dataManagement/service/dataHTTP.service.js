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
var http_1 = require("@angular/http");
var http_2 = require("@angular/common/http");
var operators_1 = require("rxjs/operators");
var DataHTTPService = (function () {
    function DataHTTPService(http) {
        this.http = http;
        this._headers = new http_1.Headers();
    }
    DataHTTPService.prototype.InitializeOptions = function (userToken) {
        this._headers = new http_1.Headers({
            'Authorization': 'bearer ' + userToken,
            'Content-Type': 'application/json; charset=utf-8'
        });
        var requestOptions = {
            params: new http_2.HttpParams()
        };
        this._options = new http_1.RequestOptions({ headers: this._headers });
    };
    DataHTTPService.prototype.processData = function (res) {
        if (!res || res.arrayBuffer().byteLength == 0) {
            return {};
        }
        var body = res.json() || { Content: [], DependentContent: [] };
        return body || {};
    };
    DataHTTPService.prototype.handleError = function (error) {
        return error.statusText;
    };
    DataHTTPService.prototype.getContent = function (restPath) {
        var _this = this;
        return this.http.get(restPath)
            .pipe(operators_1.map(function (response) { return _this.processData(response); }, operators_1.catchError(this.handleError)));
    };
    DataHTTPService.prototype.startUpPromise = function (restPath) {
        var _this = this;
        this._startupData = null;
        return this.http.get(restPath)
            .pipe(operators_1.map(function (response) { return _this.processData(response); }, operators_1.catchError(this.handleError))).toPromise()
            .then(function (data) { return _this._startupData = data; });
    };
    Object.defineProperty(DataHTTPService.prototype, "startupData", {
        get: function () {
            return this._startupData;
        },
        enumerable: true,
        configurable: true
    });
    DataHTTPService.prototype.postContent = function (content, restPath) {
        var _this = this;
        return this.http.post(restPath, content)
            .pipe(operators_1.map(function (response) { return _this.processData(response); }, operators_1.catchError(this.handleError)));
    };
    DataHTTPService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_2.HttpClient])
    ], DataHTTPService);
    return DataHTTPService;
}());
exports.DataHTTPService = DataHTTPService;
//# sourceMappingURL=dataHTTP.service.js.map