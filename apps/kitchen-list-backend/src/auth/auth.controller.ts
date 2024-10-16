import { Controller, Post, Body, UseGuards, Req, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from '../guards/local.guard';
import { LoginUserDto } from '../users/models/login-user.dto';
import { RegisterUserDto } from '../users/models/register-user.dto';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() user: RegisterUserDto) {
    return this.authService.registerUser(user);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  loginUser(@Req() req, @Body() _user: LoginUserDto) {
    return req.session['passport'];
  }

  @UseGuards(LoggedInGuard)
  @Get('status')
  status() {
    return true;
  }

  @UseGuards(AdminGuard)
  @Get('is-admin')
  isAdmin() {
    return true;
  }

  @Get('logout')
  async logout(@Req() req, @Res() res ) {
    req.logout(req.user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout." });
      }
      res.status(200).json({ message: "Logout successful." });
    });
  }
}
