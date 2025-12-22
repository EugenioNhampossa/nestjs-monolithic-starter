import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services';
import { AuthResponseDto, SignInDto, SignUpDto } from './dtos';
import { GoogleAuthGuard, LocalAuthGuard, RefreshAuthGuard } from './guards';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiGlobalResponse } from 'src/common/decorators';
import { AuthRefreshDto } from './dtos/auth-refresh.dto';
import { EnvVariables } from 'src/config';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('signup')
  @ApiGlobalResponse(AuthResponseDto)
  @ApiOperation({ description: 'Create a new user' })
  async signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Public()
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiGlobalResponse(AuthResponseDto)
  @ApiOperation({
    description: 'User login/signin',
  })
  @ApiBody({ type: SignInDto })
  async signIn(@Request() req) {
    return this.authService.signIn(req.user.id);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @ApiGlobalResponse(AuthResponseDto)
  @ApiOperation({ description: 'Refresh current user accessToekn' })
  @ApiBody({ type: AuthRefreshDto })
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    description: 'Google signin, returns the googleOAuth2 signin page',
  })
  @Get('google/signin')
  googleSignin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    const response = await this.authService.signIn(req.user.id);
    res.redirect(
      `${this.configService.get(EnvVariables.client.web)}?userId=${response.userId}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}`,
    );
  }

  @Post('signout')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Signs out the current user' })
  signout(@Request() req) {
    return this.authService.signOut(req.user.id);
  }
}
