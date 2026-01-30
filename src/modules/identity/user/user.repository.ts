import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { DEFAULT_PAGE_SIZE, ExtendedPrismaClient } from 'src/database';
import {
  CreateUserDto,
  FilterUserDto,
  UpdateUserDto,
  UserResponseDto,
} from './dto';
import { OffsetPaginationResponseDto } from 'src/libs/pagination';
import { $Enums, Prisma } from '@prisma/client';
import { PrismaErrorFactory } from 'src/common/http';

@Injectable()
export class UserRepository {
  private readonly MODEL_NAME = Prisma.ModelName.User;

  constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async create(
    dto: CreateUserDto,
    provider: $Enums.Provider,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.client.user.create({
        data: {
          ...dto,
          provider,
          emailVerified:
            provider === $Enums.Provider.GOOGLE ? new Date() : null,
        },
        omit: {
          password: true,
          deletedAt: true,
        },
      });

      return user;
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async findAll(
    filter: FilterUserDto,
  ): Promise<OffsetPaginationResponseDto<UserResponseDto>> {
    try {
      const [result, meta] = await this.prisma.client.user
        .paginate({
          where: {
            deletedAt: null,
          },
          omit: {
            password: true,
            deletedAt: true,
            refreshToken: true,
          },
        })
        .withPages({
          limit: filter.limit || DEFAULT_PAGE_SIZE,
          page: filter.page,
          includePageCount: true,
        });
      return { result, meta };
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async findById(id: string) {
    try {
      const user = await this.prisma.client.user.findUnique({
        where: { id },
        omit: {
          password: true,
          deletedAt: true,
        },
      });
      return user;
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.client.user.findUnique({
        where: { email },
        omit: {
          deletedAt: true,
        },
      });
      return user;
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<void> {
    try {
      await this.prisma.client.user.update({
        where: {
          id,
        },
        data: { ...dto },
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async updateRefreshToken(
    id: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    try {
      await this.prisma.client.user.update({
        where: {
          id,
        },
        data: { refreshToken: hashedRefreshToken },
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async verifyEmail(userId: string) {
    try {
      await this.prisma.client.user.update({
        where: { id: userId },
        data: { emailVerified: new Date() },
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async resetPassword(email: string, newPassword: string) {
    try {
      await this.prisma.client.user.update({
        where: { email },
        data: { password: newPassword },
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.client.user.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }
}
