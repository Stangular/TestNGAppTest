"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
var recordsError;
(function (recordsError) {
    recordsError[recordsError["none"] = 0] = "none";
    recordsError[recordsError["invalidIndex"] = 1] = "invalidIndex";
    recordsError[recordsError["isDirty"] = 2] = "isDirty";
})(recordsError = exports.recordsError || (exports.recordsError = {}));
var Converter = (function () {
    function Converter(uiid, dataid) {
        this.uiid = uiid;
        this.dataid = dataid;
    }
    Object.defineProperty(Converter.prototype, "UIID", {
        get: function () {
            return this.uiid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Converter.prototype, "DataID", {
        get: function () {
            return this.dataid;
        },
        enumerable: true,
        configurable: true
    });
    return Converter;
}());
exports.Converter = Converter;
var KeyValue = (function () {
    function KeyValue() {
    }
    return KeyValue;
}());
exports.KeyValue = KeyValue;
var Hydrator = (function () {
    function Hydrator() {
        this._values = [];
    }
    Hydrator.prototype.SetValue = function (key, value) {
        var h = this._values.find(function (v) { return v.key == key; });
        if (!!h) {
            h.value = value;
            return true;
        }
        else {
            var kv = new KeyValue();
            kv.key = key;
            kv.value = value;
            this._values.push(kv);
        }
        return false;
    };
    Hydrator.prototype.GetValue = function (key, defaultValue) {
        var h = this._values.find(function (v) { return v.key == key; });
        if (!!h) {
            return h.value;
        }
        return defaultValue;
    };
    Object.defineProperty(Hydrator.prototype, "KeyList", {
        get: function () {
            var list = [];
            this._values.forEach(function (v) { return list.push(v.key); });
            return list;
        },
        enumerable: true,
        configurable: true
    });
    return Hydrator;
}());
exports.Hydrator = Hydrator;
var Records = (function () {
    function Records(formName, _fields, _recordCount) {
        if (_fields === void 0) { _fields = []; }
        if (_recordCount === void 0) { _recordCount = 0; }
        this.formName = formName;
        this._fields = _fields;
        this._recordCount = _recordCount;
        this._UIElements = [];
        this._childRecords = [];
        this._selectedItem = -1;
        this._filter = [];
        this._sort = [];
        this._selectedItem = 0;
        this.createFormGroup();
    }
    Object.defineProperty(Records.prototype, "FormElements", {
        get: function () {
            return this._UIElements;
        },
        enumerable: true,
        configurable: true
    });
    Records.prototype.createFormGroup = function () {
        var group = {};
        this.GetFormDefinition();
        this._UIElements.forEach(function (e) {
            group[e.FieldID()] = new forms_1.FormControl(e.CurrentValue() || '');
        });
        this._form = new forms_1.FormGroup(group);
    };
    Records.prototype.AddDependentRecord = function (records) {
        this._childRecords.push(records);
    };
    Object.defineProperty(Records.prototype, "UIElements", {
        get: function () {
            return this._UIElements;
        },
        enumerable: true,
        configurable: true
    });
    Records.prototype.AddElementDefinition = function (elmdef) {
        if (elmdef) {
            this._UIElements.push(elmdef);
            var c = new forms_1.FormControl(elmdef.CurrentValue() || '');
            this._form.addControl(elmdef.FieldID(), c);
        }
    };
    Object.defineProperty(Records.prototype, "FormName", {
        get: function () {
            return this.formName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Records.prototype, "Form", {
        get: function () {
            return this._form;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Records.prototype, "IsDirty", {
        get: function () {
            return this._UIElements.some(function (e) { return e.isDirty(); })
                || this._childRecords.some(function (r) { return r.IsDirty; });
        },
        enumerable: true,
        configurable: true
    });
    Records.prototype.IsValid = function () {
        return this._selectedItem >= 1;
    };
    Object.defineProperty(Records.prototype, "Count", {
        get: function () {
            return this._recordCount;
        },
        enumerable: true,
        configurable: true
    });
    Records.prototype.NewRecord = function () {
        var _this = this;
        if (this.IsDirty) {
            return false;
        }
        this._fields.forEach(function (f) {
            return f.AddNew(_this._UIElements
                .find(function (e) { return e.FieldID() == f.FieldId; }));
        });
        this._selectedItem = this._recordCount;
        this._recordCount = this._recordCount + 1;
        this.UpdateUI();
    };
    Records.prototype.CopyRecord = function (recordNumber) {
        if (this.IsDirty) {
            return false;
        }
        this._fields.forEach(function (f) { return f.Copy(recordNumber); });
        this._recordCount = this._recordCount + 1;
        return this.Final();
    };
    Records.prototype.LoadData = function (content, converters, recordCount) {
        if (content === void 0) { content = []; }
        if (converters === void 0) { converters = []; }
        if (recordCount === void 0) { recordCount = 0; }
        var self = this;
        this._recordCount = recordCount;
        content.forEach(function (c, i) {
            var fldID = c.fieldID;
            var convert = converters.find(function (x) { return x.DataID == fldID; });
            if (!!convert) {
                fldID = convert.UIID;
                c.fieldID = fldID;
            }
            var fldElm = self._UIElements.find(function (e) { return e.FieldID() == fldID; });
            if (!!fldElm) {
                self._fields.push(self.New(c));
                fldElm.ResetToDefault();
            }
        });
        return this.First();
    };
    Records.prototype.First = function () {
        return this.Goto(0);
    };
    Records.prototype.Final = function () {
        return this.Goto(this.Count - 1);
    };
    Records.prototype.Next = function () {
        return this.Goto(this._selectedItem + 1);
    };
    Records.prototype.Previous = function () {
        return this.Goto(this._selectedItem - 1);
    };
    Records.prototype.SelectItem = function (value) {
        return this.SelectItemByField('ID', value);
    };
    Records.prototype.SelectItemByField = function (fieldId, value) {
        var fld = this._fields.find(function (f) { return f.FieldId == fieldId; });
        if (!!fld) {
            return this.Goto(fld.ValueIndex(value));
        }
        return false;
    };
    Records.prototype.Goto = function (index) {
        if (index < 0 || index >= this.Count) {
            return false;
        }
        if (this.IsDirty) {
            console.log(index + ' is dirty');
            return false;
        }
        this._selectedItem = index;
        this.UpdateUI();
        return true;
    };
    Records.prototype.UpdateUI = function () {
        var _this = this;
        var self = this;
        this._fields.forEach(function (f) { return _this.InitUIField(f); });
        this.UpdateDependentUI();
    };
    Records.prototype.InitUIField = function (field) {
        if (!!field) {
            var elmdef = this._UIElements.find(function (e) { return e.FieldID() == field.FieldId; });
            var contrl = this._form.controls[field.FieldId];
            elmdef.SetInitialValue(field.Value(this._selectedItem));
            contrl.setValue(elmdef.CurrentValue());
        }
    };
    Records.prototype.UpdateModel = function () {
        var self = this;
        var fldElm;
        this._fields.forEach(function (f, i) {
            fldElm = self._UIElements.find(function (e) { return e.FieldID() == f.FieldId; });
            fldElm.UpdateCurrentValue(self.GetUIValue(f.FieldId));
        });
    };
    Records.prototype.GetModelValue = function (fieldID, defaultValue) {
        var fld = this._UIElements.find(function (f) { return f.FieldID() == fieldID; });
        if (!!fld) {
            return fld.CurrentValue();
        }
        return defaultValue;
    };
    Records.prototype.SelectedIndex = function () {
        return this._selectedItem;
    };
    Records.prototype.GetOutputContent = function () {
        var content = this._UIElements.map(function (f) {
            return {
                fieldID: f.FieldID(),
                values: [f.CurrentValue()]
            };
        });
        return content;
    };
    Records.prototype.GetAllValues = function (fieldID) {
        var out = [];
        var field = this._fields.find(function (f) { return f.FieldId == fieldID; });
        if (!!field) {
            for (var i = 0; i < this._recordCount; i = i + 1) {
                out.push(field.Value(i));
            }
        }
        return out;
    };
    Records.prototype.GetFieldValue = function (fieldID) {
        var field = this._UIElements.find(function (e) { return e.FieldID() == fieldID; });
        if (!!field) {
            return field.CurrentValue();
        }
        return null;
    };
    Records.prototype.OutputCurrentValues = function (converters) {
        if (converters === void 0) { converters = []; }
        this.UpdateModel();
        return this.GetOutputContent();
    };
    Records.prototype.OutputAll = function () {
        return {
            FormName: this.formName,
            RecordCount: 1,
            Content: this.OutputCurrentValues()
        };
    };
    Records.prototype.addElement = function (elm) {
        this._UIElements.push(elm);
    };
    return Records;
}());
exports.Records = Records;
//# sourceMappingURL=records.js.map