import { OmitType } from '@nestjs/swagger';
import { SignUpDto } from './auth-signup.dto';

export class SignInDto extends OmitType(SignUpDto, ['name'] as const) {}
