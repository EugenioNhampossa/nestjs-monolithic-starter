import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { BaseResponseDto } from 'src/common/dtos';
import { $Enums } from '@prisma/client';

export class UserResponseDto extends IntersectionType(
  OmitType(CreateUserDto, ['password']),
  BaseResponseDto,
) {
  refreshToken: string;

  @ApiProperty({ enum: $Enums.Role })
  role: $Enums.Role;
}
