import { IBaseRepository } from '../../../shared/domain/repositories/base.repository.interface';
import { User, UserStatus } from '../entities/user.entity';
export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): Promise<User | null>;
    updatePassword(id: string, hashedPassword: string): Promise<User>;
    incrementFailedLoginAttempts(id: string): Promise<User>;
    resetFailedLoginAttempts(id: string): Promise<User>;
    updateLastLogin(id: string): Promise<User>;
    updateStatus(id: string, status: UserStatus): Promise<User>;
    updateTwoFactorSecret(id: string, secret: string): Promise<User>;
    enableTwoFactor(id: string, enabled: boolean): Promise<User>;
}
