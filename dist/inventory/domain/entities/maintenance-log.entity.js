"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceLog = exports.MaintenanceStatus = void 0;
const base_entity_1 = require("../../../shared/domain/entities/base.entity");
var MaintenanceStatus;
(function (MaintenanceStatus) {
    MaintenanceStatus["SCHEDULED"] = "SCHEDULED";
    MaintenanceStatus["IN_PROGRESS"] = "IN_PROGRESS";
    MaintenanceStatus["COMPLETED"] = "COMPLETED";
    MaintenanceStatus["CANCELLED"] = "CANCELLED";
})(MaintenanceStatus || (exports.MaintenanceStatus = MaintenanceStatus = {}));
class MaintenanceLog extends base_entity_1.BaseEntity {
}
exports.MaintenanceLog = MaintenanceLog;
//# sourceMappingURL=maintenance-log.entity.js.map