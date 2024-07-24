
import { IsString} from "class-validator";

export class LoginDto{
    @IsString({message:"username is required"})
    username:string
    @IsString({message:"password is required"})
    password:string
}