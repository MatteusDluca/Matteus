import { Request } from 'express';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto, UpdateUserDto } from '../../application/dtos/user.dto';
import { UserStatus } from '../../domain/entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<import("../../domain/entities/user.entity").User[]>;
    findMe(userId: string): Promise<import("../../domain/entities/user.entity").User>;
    findOne(id: string): Promise<import("../../domain/entities/user.entity").User>;
    findByEmail(email: string): Promise<import("../../domain/entities/user.entity").User>;
    create(createUserDto: CreateUserDto, adminId: string, req: Request): Promise<import("../../domain/entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto, adminId: string, req: Request): Promise<import("../../domain/entities/user.entity").User>;
    updateStatus(id: string, status: UserStatus, adminId: string, req: Request): Promise<import("../../domain/entities/user.entity").User>;
    resetPassword(id: string, adminId: string, req: Request): Promise<{
        password: string;
    }>;
    remove(id: string, adminId: string, req: Request): Promise<void>;
}
