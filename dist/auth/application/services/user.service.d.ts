import { User, UserStatus } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { AuditLogService } from './audit-log.service';
export declare class UserService extends BaseService<User> {
    private readonly userRepository;
    private readonly auditLogService;
    constructor(userRepository: IUserRepository, auditLogService: AuditLogService);
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User>;
    create(createUserDto: CreateUserDto, adminId?: string, ipAddress?: string, userAgent?: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto, adminId?: string, ipAddress?: string, userAgent?: string): Promise<User>;
    resetPassword(id: string, adminId: string, ipAddress?: string, userAgent?: string): Promise<{
        password: string;
    }>;
    updateStatus(id: string, status: UserStatus, adminId: string, ipAddress?: string, userAgent?: string): Promise<User>;
    delete(id: string, adminId?: string, ipAddress?: string, userAgent?: string): Promise<void>;
    private generateRandomPassword;
    private hashPassword;
}
