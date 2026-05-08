import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string) {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token, true);
      if (!decodedToken) {
        throw new UnauthorizedException();
      }
      return decodedToken;
    } catch (err) {
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }
}
