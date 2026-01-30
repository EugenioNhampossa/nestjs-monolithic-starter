import {
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { HashHelper } from 'src/helpers';
import { FilterUserDto } from './dto';
import { $Enums } from '@prisma/client';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { DomainException } from 'src/common/http';
import { AppErrorCode } from 'src/common/enums';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => EmailVerificationService))
    private readonly emailVerificationService: EmailVerificationService,
    private readonly repository: UserRepository,
  ) {}

  async create(dto: CreateUserDto, provider: $Enums.Provider) {
    const userExists = await this.repository.findByEmail(dto.email);

    if (userExists) {
      throw new DomainException(
        AppErrorCode.USER_EMAIL_ALREADY_EXISTS,
        'User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const { password, ...data } = dto;
    const hashedPassword = await HashHelper.encrypt(password);

    const result = await this.repository.create(
      {
        password: hashedPassword,
        ...data,
      },
      provider,
    );

    if (result) {
      await this.emailVerificationService.issueVerificationToken({
        userId: result.id,
        email: result.email,
      });
    }

    return result;
  }

  async findAll(filter: FilterUserDto) {
    return await this.repository.findAll(filter);
  }

  async findById(id: string) {
    return await this.repository.findById(id);
  }

  async findByEmail(email: string) {
    return await this.repository.findByEmail(email);
  }

  async verifyEmail(id: string) {
    return await this.repository.verifyEmail(id);
  }

  async resetPassword(email: string, newPassword: string) {
    const hashedPassword = await HashHelper.encrypt(newPassword);

    await this.repository.resetPassword(email, hashedPassword);
  }

  async update(id: string, dto: UpdateUserDto) {
    return await this.repository.update(id, dto);
  }

  async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
    return await this.repository.updateRefreshToken(userId, hashedRefreshToken);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }
}
