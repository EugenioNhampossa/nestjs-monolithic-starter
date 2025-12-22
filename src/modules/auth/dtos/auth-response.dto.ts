import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from './token.dto';

export class AuthResponseDto extends TokenDto {
  @ApiProperty()
  userId: string;
}
