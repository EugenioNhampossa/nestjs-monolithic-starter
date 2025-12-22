import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Strategies } from '../constants';

@Injectable()
export class RefreshAuthGuard extends AuthGuard(Strategies.jwt) {}
