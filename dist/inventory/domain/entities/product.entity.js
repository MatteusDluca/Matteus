"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductStatus = void 0;
const base_entity_1 = require("../../../shared/domain/entities/base.entity");
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["AVAILABLE"] = "AVAILABLE";
    ProductStatus["RENTED"] = "RENTED";
    ProductStatus["MAINTENANCE"] = "MAINTENANCE";
    ProductStatus["CLEANING"] = "CLEANING";
    ProductStatus["DISCARDED"] = "DISCARDED";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
class Product extends base_entity_1.BaseEntity {
}
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map