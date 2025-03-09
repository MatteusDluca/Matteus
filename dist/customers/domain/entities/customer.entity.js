"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = exports.DocumentType = void 0;
const base_entity_1 = require("../../../shared/domain/entities/base.entity");
var DocumentType;
(function (DocumentType) {
    DocumentType["CPF"] = "CPF";
    DocumentType["CNPJ"] = "CNPJ";
})(DocumentType || (exports.DocumentType = DocumentType = {}));
class Customer extends base_entity_1.BaseEntity {
}
exports.Customer = Customer;
//# sourceMappingURL=customer.entity.js.map