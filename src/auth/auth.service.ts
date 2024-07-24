import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from "bcryptjs"
import { User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
constructor(private readonly jwtService:JwtService,private readonly database:DatabaseService){}

async login(loginDto:LoginDto):Promise<any>{
const {username,password}=loginDto;
const user=await this.database.user.findFirst({where:{username}});
if (!user) {
    throw new NotFoundException("User with the username does not exist");
}
const validatePassword=await bcrypt.compare(password,user.password);
if (!validatePassword) {
    throw new NotFoundException("User with the username does not exist");
}

return this.generateToken(user);

}

async signup(registerDto:RegisterDto):Promise<any>{
    const {username,password,name}=registerDto;
    const userFound=await this.database.user.findFirst({where:{username}});
    if (userFound) {
        throw new NotFoundException("User with the username already exist");
    }

    const hashedPassword=await bcrypt.hash(password,10);
    const createdUser=await this.database.user.create({data:{
        name,username,password:hashedPassword
    }})
    
    return this.generateToken(createdUser);
    
    }

async generateToken(user:User): Promise<any> {
    const tokenPayload={
     sub:user.id,
     username:user.username
    };
    const accessToken=await this.jwtService.signAsync(tokenPayload);
    delete user.password;

     return {accessToken,...user};
 }

}
