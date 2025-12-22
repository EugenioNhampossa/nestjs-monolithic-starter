import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Strategies } from '../constants';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(Strategies.google) {}
