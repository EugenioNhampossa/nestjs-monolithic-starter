import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashHelper } from 'src/helpers';
import { TokenService } from './token.service';
import { SignUpDto } from '../dtos';
import { $Enums } from '@prisma/client';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private tokenService: TokenService,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = await this.userService.create(dto, $Enums.Provider.LOCAL);
    return this.signIn(user.id);
  }

  async signIn(userId: string) {
    const tokens = await this.tokenService.generateAuthToken({
      sub: userId,
    });

    const hashedRefreshToken = await HashHelper.encrypt(tokens.refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);

    return {
      userId,
      ...tokens,
    };
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const isPasswordMached = await HashHelper.compare(password, user.password);

    if (!isPasswordMached)
      throw new UnauthorizedException('Invalid credentials');

    return { id: user.id, email: user.email, role: user.role };
  }

  async validadeJwtUser(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return { id: user.id, role: user.role };
  }

  async validadeRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');

    const tokenMatched = await HashHelper.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!tokenMatched) throw new UnauthorizedException('Invalid refresh token');

    return { id: user.id, role: user.role };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser, $Enums.Provider.GOOGLE);
  }

  async refreshToken(userId: string) {
    const tokens = await this.tokenService.generateAuthToken({
      sub: userId,
    });

    const hashedRefreshToken = await HashHelper.encrypt(tokens.refreshToken);
    await this.userService.updateRefreshToken(userId, hashedRefreshToken);

    return {
      userId,
      ...tokens,
    };
  }

  async signOut(userId: string) {
    await this.userService.updateRefreshToken(userId, null);
  }
}
