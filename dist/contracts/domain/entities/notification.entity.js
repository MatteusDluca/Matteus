"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = exports.NotificationType = void 0;
const base_entity_1 = require("../../../shared/domain/entities/base.entity");
var NotificationType;
(function (NotificationType) {
    NotificationType["FITTING_REMINDER"] = "FITTING_REMINDER";
    NotificationType["RESERVATION_CONFIRMATION"] = "RESERVATION_CONFIRMATION";
    NotificationType["RETURN_ALERT"] = "RETURN_ALERT";
    NotificationType["BIRTHDAY"] = "BIRTHDAY";
    NotificationType["PAYMENT_CONFIRMATION"] = "PAYMENT_CONFIRMATION";
    NotificationType["GENERAL"] = "GENERAL";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
class Notification extends base_entity_1.BaseEntity {
}
exports.Notification = Notification;
//# sourceMappingURL=notification.entity.js.map