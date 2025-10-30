import {UserDto} from "./UserDto";

export class LoginDto {
  email: string;
  password: string;
}

export class UserContextResponse {
  user:UserDto;
}

export class OneFactorResponse extends UserContextResponse{
  token: string;
}

export class TwoFactorResponse extends UserContextResponse{
  reqId: string;
}
