import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppErrorCode } from '../enums';
import { PrismaDelegate } from '../interfaces/prisma-delegate.interface';
import { PrismaErrorFactory } from '../http/PrismaErrorFactory';
import { DomainException } from '../http';
import { OffsetPaginationQuery } from 'src/libs/pagination';

//TODO: Review and implement this base repo in the project
export abstract class BaseRepository<
  T,
  CreateDto,
  UpdateDto,
  FilterDto = OffsetPaginationQuery,
> {
  constructor(
    protected readonly modelDelegate: PrismaDelegate<
      T,
      CreateDto,
      UpdateDto,
      FilterDto
    >,
    protected readonly modelName: Prisma.ModelName,
  ) {}

  async create(data: CreateDto): Promise<T> {
    try {
      return await this.modelDelegate.create({ data });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.modelName);
    }
  }

  async findOne(id: string): Promise<T> {
    const record = await this.modelDelegate.findUnique({ where: { id } });

    if (!record) {
      throw new DomainException(
        this.getNotFoundCode(),
        `${this.modelName} with ID ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return record;
  }

  async findAll(params: any): Promise<T[]> {
    return this.modelDelegate.findMany(params);
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    try {
      return await this.modelDelegate.update({
        where: { id },
        data,
      });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.modelName);
    }
  }

  async delete(id: string): Promise<T> {
    try {
      return await this.modelDelegate.delete({ where: { id } });
    } catch (error) {
      PrismaErrorFactory.handle(error, this.modelName);
    }
  }

  private getNotFoundCode(): AppErrorCode {
    const mapping: Partial<Record<Prisma.ModelName, AppErrorCode>> = {
      [Prisma.ModelName.User]: AppErrorCode.USER_NOT_FOUND,
    };
    return mapping[this.modelName] || AppErrorCode.DB_RECORD_NOT_FOUND;
  }
}
