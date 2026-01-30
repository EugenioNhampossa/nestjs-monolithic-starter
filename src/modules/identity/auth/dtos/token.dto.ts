import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  tokenType: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty({ description: 'Time to expire in seconds' })
  expiresIn: number;
}
