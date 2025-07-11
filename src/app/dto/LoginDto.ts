import {UserDto} from "./UserDto";

export class LoginDto {
  email: string;
  password: string;
}

export class AuthResponseDto{
  user:UserDto;
  token: string;
}
