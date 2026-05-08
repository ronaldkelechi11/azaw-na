import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor() {
    // Note: To properly initialize Firebase Admin, you would typically inject credentials
    // using environment variables, e.g., GOOGLE_APPLICATION_CREDENTIALS
    if (admin.apps.length === 0) {
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      } catch (e) {
        console.error('Firebase Admin init error', e);
      }
    }
  }
}
