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
var FormInputElementComponent = (function () {
    function FormInputElementComponent() {
        this.actionClass = '';
        this.action = new core_1.EventEmitter();
    }
    FormInputElementComponent.prototype.onAction = function (value) {
        this.action.emit(this.actionClass);
    };
    FormInputElementComponent.prototype.ngOnInit = function () {
    };
    FormInputElementComponent.prototype.Init = function () {
    };
    Object.defineProperty(FormInputElementComponent.prototype, "isValid", {
        get: function () {
            var v = this.form.controls[this.element.FieldID()].value;
            var valid = this.element.validateValue(v);
            return valid;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FormInputElementComponent.prototype, "element", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", forms_1.FormGroup)
    ], FormInputElementComponent.prototype, "form", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], FormInputElementComponent.prototype, "actionClass", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], FormInputElementComponent.prototype, "action", void 0);
    FormInputElementComponent = __decorate([
        core_1.Component({
            selector: 'input-edit',
            templateUrl: 'form-input.component.html'
        }),
        __metadata("design:paramtypes", [])
    ], FormInputElementComponent);
    return FormInputElementComponent;
}());
exports.FormInputElementComponent = FormInputElementComponent;
//# sourceMappingURL=form-input.component.js.map