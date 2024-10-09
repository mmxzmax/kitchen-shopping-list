import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { IUser } from '../users/models/user.interface';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(
    user: IUser,
    done: (err: Error, user: { id: number; role: string }) => void
  ) {
    done(null, { id: user.id, role: user.role });
  }

  async deserializeUser(
    payload: { id: number; role: string },
    done: (err: Error, user: Omit<IUser, 'password'>) => void
  ) {
    const user = await this.authService.findById(payload.id);
    done(null, user);
  }
}
