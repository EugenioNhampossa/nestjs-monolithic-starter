import { Inject, Injectable } from '@nestjs/common';
import { CreateTokenVerificationDto } from './dto/create-token-verification.dto';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/database';
import { PrismaErrorFactory } from 'src/common/http';
import { Prisma } from '@prisma/client';

@Injectable()
export class TokenVerificationRepository {
  private readonly MODEL_NAME = Prisma.ModelName.TokenVerification;

  constructor(
    @Inject('PrismaService')
    private readonly prisma: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async create(dto: CreateTokenVerificationDto) {
    try {
      await this.prisma.client.$transaction(async (tx) => {
        await tx.tokenVerification.deleteMany({
          where: { identifier: dto.identifier },
        });

        return await tx.tokenVerification.create({
          data: dto,
        });
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async findByIdentifier(identifier: string) {
    try {
      return await this.prisma.client.tokenVerification.findFirstOrThrow({
        where: { identifier },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async findByToken(token: string) {
    try {
      return await this.prisma.client.tokenVerification.findFirstOrThrow({
        where: { token },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async findOne(identifier: string, token: string) {
    try {
      return await this.prisma.client.tokenVerification.findUniqueOrThrow({
        where: { identifier_token: { identifier, token } },
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }

  async delete(identifier: string) {
    try {
      await this.prisma.client.tokenVerification.deleteMany({
        where: { identifier },
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.MODEL_NAME);
    }
  }
}
