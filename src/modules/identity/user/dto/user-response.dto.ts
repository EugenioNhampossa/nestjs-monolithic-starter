import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { BaseResponseDto } from 'src/common/dtos';
import { $Enums } from '@prisma/client';

export class UserResponseDto extends IntersectionType(
  OmitType(CreateUserDto, ['password']),
  BaseResponseDto,
) {
  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ nullable: true })
  emailVerified: Date | null;

  @ApiProperty({ enum: $Enums.Role })
  role: $Enums.Role;
}
