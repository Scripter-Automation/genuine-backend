import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Observable } from 'rxjs';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private firebase_service:FirebaseService){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1];

    if(!token){
      console.error("Invalid or Missing Token")
      return false;
    }

    return this.firebase_service.verify_user(token);


  }
}
