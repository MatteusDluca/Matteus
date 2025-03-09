"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserStatus = exports.Role = void 0;
const base_entity_1 = require("../../../shared/domain/entities/base.entity");
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["MANAGER"] = "MANAGER";
    Role["EMPLOYEE"] = "EMPLOYEE";
    Role["USER"] = "USER";
})(Role || (exports.Role = Role = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["BLOCKED"] = "BLOCKED";
    UserStatus["TEMP_PASSWORD"] = "TEMP_PASSWORD";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
class User extends base_entity_1.BaseEntity {
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map