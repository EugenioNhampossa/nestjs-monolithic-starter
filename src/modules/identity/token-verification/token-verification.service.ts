import { HttpStatus, Injectable } from '@nestjs/common';
import { TokenVerificationRepository } from './token-verification.repository';
import { HashHelper } from 'src/helpers';
import { CreateTokenVerificationDto } from './dto/create-token-verification.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';
import { DomainException } from 'src/common/http';
import { AppErrorCode } from 'src/common/enums';
import { createHash } from 'crypto';

@Injectable()
export class TokenVerificationService {
  constructor(private readonly repository: TokenVerificationRepository) { }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async create(dto: CreateTokenVerificationDto) {
    const hashedToken = this.hashToken(dto.token);

    await this.repository.create({
      identifier: dto.identifier,
      token: hashedToken,
      expiresAt: dto.expiresAt,
    });
  }

  async findByIdentifier(identifier: string) {
    return await this.repository.findByIdentifier(identifier);
  }

  async findByToken(token: string) {
    const hashedToken = this.hashToken(token);
    return await this.repository.findByToken(hashedToken);
  }

  async delete(identifier: string) {
    await this.repository.delete(identifier);
  }

  async isTokenValid(dto: ValidateTokenDto) {
    const hashedToken = this.hashToken(dto.token);
    const result = await this.repository.findOne(dto.identifier, hashedToken);

    if (!result || new Date() > result.expiresAt)
      throw new DomainException(
        AppErrorCode.AUTH_INVALID_TOKEN,
        'The token provided is expired, please request a new one.',
        HttpStatus.BAD_REQUEST,
      );

    if (result.token !== hashedToken)
      throw new DomainException(
        AppErrorCode.AUTH_INVALID_TOKEN,
        'The token provided is invalid, please request a new one.',
        HttpStatus.BAD_REQUEST,
      );

    return true;
  }
}
