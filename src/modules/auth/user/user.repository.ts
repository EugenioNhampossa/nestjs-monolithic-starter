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
import { $Enums } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async create(
    dto: CreateUserDto,
    provider: $Enums.Provider,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.client.user.create({
      data: { ...dto, provider },
      omit: {
        password: true,
        deletedAt: true,
      },
    });

    return user;
  }

  async findAll(
    filter: FilterUserDto,
  ): Promise<OffsetPaginationResponseDto<UserResponseDto>> {
    const [result, meta] = await this.prisma.client.user
      .paginate({
        where: {
          deletedAt: null,
        },
        omit: {
          password: true,
          deletedAt: true,
        },
      })
      .withPages({
        limit: filter.limit || DEFAULT_PAGE_SIZE,
        page: filter.page,
        includePageCount: true,
      });
    return { result, meta };
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.client.user.findUniqueOrThrow({
      where: { id },
      omit: {
        password: true,
        deletedAt: true,
      },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
      omit: {
        deletedAt: true,
      },
    });
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<void> {
    await this.prisma.client.user.update({
      where: {
        id,
      },
      data: { ...dto },
    });
  }

  async updateRefreshToken(
    id: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    await this.prisma.client.user.update({
      where: {
        id,
      },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async remove(id: string) {
    await this.prisma.client.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
