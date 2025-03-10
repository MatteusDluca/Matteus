"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const event_controller_1 = require("./presentation/controllers/event.controller");
const location_controller_1 = require("./presentation/controllers/location.controller");
const event_service_1 = require("./application/services/event.service");
const location_service_1 = require("./application/services/location.service");
const event_repository_1 = require("./infrastructure/repositories/event.repository");
const location_repository_1 = require("./infrastructure/repositories/location.repository");
const prisma_module_1 = require("../shared/infrastructure/prisma/prisma.module");
const pdf_module_1 = require("../shared/infrastructure/pdf/pdf.module");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, pdf_module_1.PDFModule],
        controllers: [event_controller_1.EventController, location_controller_1.LocationController],
        providers: [
            event_service_1.EventService,
            location_service_1.LocationService,
            {
                provide: 'IEventRepository',
                useClass: event_repository_1.EventRepository,
            },
            {
                provide: 'ILocationRepository',
                useClass: location_repository_1.LocationRepository,
            },
        ],
        exports: [event_service_1.EventService, location_service_1.LocationService],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map