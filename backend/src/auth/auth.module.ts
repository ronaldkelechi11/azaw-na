import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from './strategies/firebase.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [PassportModule],
  providers: [AuthService, FirebaseStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
