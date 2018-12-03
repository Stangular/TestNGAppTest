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
var forms_1 = require("@angular/forms");
var appData_service_1 = require("../../../dataManagement/service/appData.service");
var SelectListComponent = (function () {
    function SelectListComponent(appDataService) {
        this.appDataService = appDataService;
        this.List = [];
        this.actionClass = '';
        this.currentItem = 0;
        this.action = new core_1.EventEmitter();
    }
    SelectListComponent.prototype.ngOnInit = function () {
        this.List = this.appDataService.GetList(this.element.FieldID());
    };
    SelectListComponent.prototype.SelectItem = function (item) {
        this.action.emit(item.value);
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], SelectListComponent.prototype, "element", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", forms_1.FormGroup)
    ], SelectListComponent.prototype, "form", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], SelectListComponent.prototype, "actionClass", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], SelectListComponent.prototype, "currentItem", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], SelectListComponent.prototype, "action", void 0);
    SelectListComponent = __decorate([
        core_1.Component({
            selector: 'select-list',
            templateUrl: 'form-list-select.component.html'
        }),
        __metadata("design:paramtypes", [appData_service_1.AppDataService])
    ], SelectListComponent);
    return SelectListComponent;
}());
exports.SelectListComponent = SelectListComponent;
//# sourceMappingURL=form-list-select.component.js.map