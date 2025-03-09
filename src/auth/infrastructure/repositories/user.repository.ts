// src/auth/infrastructure/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { email: 'asc' },
    });
    return users as unknown as User[];
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user as unknown as User | null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user as unknown as User | null;
  }

  async create(data: Partial<User>): Promise<User> {
    if (!data.email || !data.password || !data.role) {
      throw new Error('Campos obrigatórios não podem ser undefined');
    }

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status ?? UserStatus.ACTIVE,
        failedLoginAttempts: data.failedLoginAttempts ?? 0,
        lastLoginAt: data.lastLoginAt ?? null,
        twoFactorEnabled: data.twoFactorEnabled ?? false,
        twoFactorSecret: data.twoFactorSecret ?? null,
      },
    });
    return user as unknown as User;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: data as any,
    });
    return user as unknown as User;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        failedLoginAttempts: 0, // Reset failed attempts on password change
        status: UserStatus.ACTIVE, // Ensure account is active after password change
      },
    });
    return user as unknown as User;
  }

  async incrementFailedLoginAttempts(id: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
      },
    });
    return user as unknown as User;
  }

  async resetFailedLoginAttempts(id: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        failedLoginAttempts: 0,
      },
    });
    return user as unknown as User;
  }

  async updateLastLogin(id: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
    });
    return user as unknown as User;
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        status,
      },
    });
    return user as unknown as User;
  }

  async updateTwoFactorSecret(id: string, secret: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        twoFactorSecret: secret,
      },
    });
    return user as unknown as User;
  }

  async enableTwoFactor(id: string, enabled: boolean): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        twoFactorEnabled: enabled,
      },
    });
    return user as unknown as User;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
