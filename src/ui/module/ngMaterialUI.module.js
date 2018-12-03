"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var ngMaterialModule = (function () {
    function ngMaterialModule() {
    }
    ngMaterialModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                material_1.MatIconModule,
                material_1.MatToolbarModule,
                material_1.MatListModule,
                material_1.MatMenuModule,
                material_1.MatButtonModule,
                material_1.MatInputModule,
                material_1.MatCardModule,
                material_1.MatSelectModule
            ],
            declarations: [],
            exports: [
                material_1.MatListModule,
                material_1.MatIconModule,
                material_1.MatToolbarModule,
                material_1.MatMenuModule,
                material_1.MatButtonModule,
                material_1.MatInputModule,
                material_1.MatCardModule,
                material_1.MatSelectModule
            ],
            providers: []
        })
    ], ngMaterialModule);
    return ngMaterialModule;
}());
exports.ngMaterialModule = ngMaterialModule;
//# sourceMappingURL=ngMaterialUI.module.js.map