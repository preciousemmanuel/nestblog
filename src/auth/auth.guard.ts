import { CanActivate, ExecutionContext, Injectable ,UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService:JwtService){}
  async canActivate(
    context: ExecutionContext,
  ) {
    const request=context.switchToHttp().getRequest();

    const bearer=request.headers.authorization;

    if(!bearer || !bearer.startsWith("Bearer ")){
      // return res.status(401).json({error:"Unauthorized"});
      throw new UnauthorizedException();
  
  }

  const token=bearer.split("Bearer ")[1].trim();

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
    const tokenPayload = await this.jwtService.verifyAsync(token);
    request.user={
      userId:tokenPayload.sub,
      username:tokenPayload.username
    }
    return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  
  }
}
