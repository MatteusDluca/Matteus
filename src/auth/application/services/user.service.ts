// src/auth/application/services/user.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserStatus } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { BaseService } from '../../../shared/application/services/base.service';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly auditLogService: AuditLogService,
  ) {
    super(userRepository);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }
    return user;
  }

  async create(
    createUserDto: CreateUserDto,
    adminId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<User> {
    // Verificar se já existe um usuário com o mesmo email
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException(`Já existe um usuário com o email ${createUserDto.email}`);
    }

    // Hash da senha
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Criar o usuário
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      failedLoginAttempts: 0,
    });

    // Registrar o evento de auditoria
    if (adminId) {
      await this.auditLogService.create({
        userId: adminId,
        action: 'USER_CREATE',
        resource: 'USER',
        details: `Criação de usuário: ${user.id} (${user.email})`,
        ipAddress,
        userAgent,
      });
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    adminId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<User> {
    // Verificar se o usuário existe
    await this.findById(id);

    // Se estiver atualizando o email, verificar se já existe outro usuário com esse email
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException(`Já existe um usuário com o email ${updateUserDto.email}`);
      }
    }

    // Atualizar o usuário
    const updatedUser = await this.userRepository.update(id, updateUserDto);

    // Registrar o evento de auditoria
    if (adminId) {
      await this.auditLogService.create({
        userId: adminId,
        action: 'USER_UPDATE',
        resource: 'USER',
        details: `Atualização de usuário: ${id} (${updatedUser.email})`,
        ipAddress,
        userAgent,
      });
    }

    return updatedUser;
  }

  async resetPassword(
    id: string,
    adminId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ password: string }> {
    // Verificar se o usuário existe
    const user = await this.findById(id);

    // Gerar senha temporária
    const tempPassword = this.generateRandomPassword();
    const hashedPassword = await this.hashPassword(tempPassword);

    // Atualizar senha e status do usuário
    await this.userRepository.update(id, {
      password: hashedPassword,
      status: UserStatus.TEMP_PASSWORD,
      failedLoginAttempts: 0,
    });

    // Registrar o evento de auditoria
    await this.auditLogService.create({
      userId: adminId,
      action: 'PASSWORD_RESET',
      resource: 'USER',
      details: `Reset de senha para usuário: ${id} (${user.email})`,
      ipAddress,
      userAgent,
    });

    return { password: tempPassword };
  }

  async updateStatus(
    id: string,
    status: UserStatus,
    adminId: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<User> {
    // Verificar se o usuário existe
    const user = await this.findById(id);

    // Atualizar status do usuário
    const updatedUser = await this.userRepository.updateStatus(id, status);

    // Registrar o evento de auditoria
    await this.auditLogService.create({
      userId: adminId,
      action: 'STATUS_CHANGE',
      resource: 'USER',
      details: `Alteração de status para usuário: ${id} (${user.email}) - Novo status: ${status}`,
      ipAddress,
      userAgent,
    });

    return updatedUser;
  }

  async delete(
    id: string,
    adminId?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    // Verificar se o usuário existe
    const user = await this.findById(id);

    // Excluir o usuário
    await this.userRepository.delete(id);

    // Registrar o evento de auditoria
    if (adminId) {
      await this.auditLogService.create({
        userId: adminId,
        action: 'USER_DELETE',
        resource: 'USER',
        details: `Exclusão de usuário: ${id} (${user.email})`,
        ipAddress,
        userAgent,
      });
    }
  }

  /**
   * Gera uma senha aleatória segura
   */
  private generateRandomPassword(length = 10): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    return password;
  }

  /**
   * Hash de senha usando bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
