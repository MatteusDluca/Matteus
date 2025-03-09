"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.ContractStatus = void 0;
const base_entity_1 = require("../../../shared/domain/entities/base.entity");
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "DRAFT";
    ContractStatus["FITTING_SCHEDULED"] = "FITTING_SCHEDULED";
    ContractStatus["SIGNED"] = "SIGNED";
    ContractStatus["PAID"] = "PAID";
    ContractStatus["PICKED_UP"] = "PICKED_UP";
    ContractStatus["RETURNED"] = "RETURNED";
    ContractStatus["COMPLETED"] = "COMPLETED";
    ContractStatus["CANCELLED"] = "CANCELLED";
    ContractStatus["LATE"] = "LATE";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
class Contract extends base_entity_1.BaseEntity {
}
exports.Contract = Contract;
//# sourceMappingURL=contract.entity.js.map