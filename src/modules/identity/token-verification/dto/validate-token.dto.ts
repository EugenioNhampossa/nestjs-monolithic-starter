import { OmitType } from '@nestjs/swagger';
import { CreateTokenVerificationDto } from './create-token-verification.dto';

export class ValidateTokenDto extends OmitType(CreateTokenVerificationDto, [
  'expiresAt',
] as const) {}
