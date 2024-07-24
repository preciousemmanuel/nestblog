import { Controller ,Post,Body,ValidationPipe} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
   async signup( @Body(new ValidationPipe()) registerDto: RegisterDto) {
      return await this.authService.signup(registerDto);
    }


    @Post("login")
    async login( @Body(new ValidationPipe()) loginDto: LoginDto) {
       return await this.authService.login(loginDto);
     }
}
