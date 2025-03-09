import { User, UserStatus } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
export declare class UserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    updatePassword(id: string, hashedPassword: string): Promise<User>;
    incrementFailedLoginAttempts(id: string): Promise<User>;
    resetFailedLoginAttempts(id: string): Promise<User>;
    updateLastLogin(id: string): Promise<User>;
    updateStatus(id: string, status: UserStatus): Promise<User>;
    updateTwoFactorSecret(id: string, secret: string): Promise<User>;
    enableTwoFactor(id: string, enabled: boolean): Promise<User>;
    delete(id: string): Promise<void>;
}
