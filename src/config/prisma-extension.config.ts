import { Injectable } from '@nestjs/common';
import { CustomPrismaClientFactory } from 'nestjs-prisma';
import {
  type ExtendedPrismaClient,
  extendedPrismaClient,
} from '../database/prisma.extension';

@Injectable()
export class ExtendedPrismaConfigService implements CustomPrismaClientFactory<ExtendedPrismaClient> {
  constructor() {}

  createPrismaClient(): ExtendedPrismaClient {
    return extendedPrismaClient;
  }
}
