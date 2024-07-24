import { IsString} from "class-validator";


export class RegisterDto{
    @IsString({message:"username is required"})
    username:string
    @IsString({message:"password is required"})
    password:string

    @IsString({message:"name is required"})
    name:string
}