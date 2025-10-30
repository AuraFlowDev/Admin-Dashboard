import {UserDto} from "./UserDto";

export type LoginResponse = OneFactorResponse | TwoFactorResponse;

export class LoginDto {
  email: string;
  password: string;
}

export class VerifyRequest{
  reqId: string;
  token: string;
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

export function isTwoFactorResponse(x: any): x is TwoFactorResponse {
  return x && typeof x === 'object' && typeof x.reqId === 'string';
}

export function isOneFactorResponse(x: any): x is OneFactorResponse {
  return x && typeof x === 'object' && typeof x.token === 'string';
}
