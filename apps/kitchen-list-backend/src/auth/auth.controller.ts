import { Controller, Post, Body, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalGuard } from "../guards/local.guard";
import { LoginUserDto } from "../users/models/login-user.dto";
import { RegisterUserDto } from "../users/models/register-user.dto";

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
}