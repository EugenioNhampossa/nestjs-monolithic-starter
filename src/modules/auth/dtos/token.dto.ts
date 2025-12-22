import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty()
  tokenType: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  accessTokenExpires: string;
}
