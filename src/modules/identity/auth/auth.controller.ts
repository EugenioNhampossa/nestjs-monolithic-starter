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
import { AuthCookiesConfig } from './config/cookies.config';
import { COOKIE_KEYS } from './constants';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly authCookiesConfig: AuthCookiesConfig,
  ) {}

  @Public()
  @Post('signup')
  @ApiGlobalResponse(AuthResponseDto)
  @ApiOperation({ description: 'Create a new user and login' })
  async signUp(
    @Body() body: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...authData } = await this.authService.signUp(body);
    const config = this.authCookiesConfig.getRefreshConfiguration();
    res.cookie(COOKIE_KEYS.refreshToken, refreshToken, config);
    return authData;
  }

  @Public()
  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiGlobalResponse(AuthResponseDto)
  @ApiOperation({
    description: 'User login/signin',
  })
  @ApiBody({ type: SignInDto })
  async signIn(@Request() req, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, ...authData } = await this.authService.signIn(
      req.user.id,
    );

    const config = this.authCookiesConfig.getRefreshConfiguration();
    res.cookie(COOKIE_KEYS.refreshToken, refreshToken, config);

    return authData;
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  @ApiGlobalResponse(AuthResponseDto)
  @ApiOperation({ description: 'Refresh current user accessToken' })
  @ApiBody({ type: AuthRefreshDto })
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...authData } = await this.authService.refreshToken(
      req.user.id,
    );

    const config = this.authCookiesConfig.getRefreshConfiguration();
    res.cookie(COOKIE_KEYS.refreshToken, refreshToken, config);

    return authData;
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

    const redirectUrl = this.configService.get(
      EnvVariables.client.webClientGoogleAuthCallBack,
    );

    const config = this.authCookiesConfig.getRefreshConfiguration();
    res.cookie(COOKIE_KEYS.refreshToken, response.refreshToken, config);

    res.redirect(
      `${redirectUrl}?userId=${response.userId}&accessToken=${response.accessToken}`,
    );
  }

  @Post('signout')
  @ApiBearerAuth()
  @ApiOperation({ description: 'Signs out the current user' })
  signout(@Request() req, @Res({ passthrough: true }) res: Response) {
    const config = this.authCookiesConfig.getRefreshConfiguration();

    const response = this.authService.signOut(req.user.id);

    res.clearCookie(COOKIE_KEYS.refreshToken, { ...config, maxAge: 0 });

    return response;
  }
}
