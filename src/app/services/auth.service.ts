import {Injectable} from '@angular/core';
import {isOneFactorResponse, LoginDto, LoginResponse, OneFactorResponse, VerifyRequest} from "../dto/LoginDto";
import {Observable, tap} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Globals} from "../globals/globals";
import {jwtDecode} from "jwt-decode";
import {Role} from "../dto/PrivilegeDtos";
import {setParamsFromDto} from "../utils/SetParamsFromDto";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl: string = this.globals.backendUrl + "/auth"
  private static authTokenKey: string = 'authToken';

  constructor(private http: HttpClient, private globals: Globals) {
  }

  loginUser(loginDto: LoginDto): Observable<LoginResponse> {
    return this.http.post<any>(this.authUrl + "/login", loginDto).pipe(
      tap((dto) => {
        if (isOneFactorResponse(dto)) {
          this.setToken(dto.token);
        }
      })
    )
  }

  verifyTwoFactor(dto: VerifyRequest): Observable<OneFactorResponse> {
    const params = setParamsFromDto(new HttpParams(), dto);
    return this.http.get<OneFactorResponse>(this.authUrl + "/login/verify", {
      params: params
    }).pipe(
      tap((dto) => {
        this.setToken(dto.token);
      })
    );

  }

  logoutUser(): void {
    localStorage.removeItem(AuthService.authTokenKey);
  }

  get token(): string | null {
    return localStorage.getItem(AuthService.authTokenKey);
  }


  private setToken(authResponse: string) {
    localStorage.setItem(AuthService.authTokenKey, authResponse);
  }

  isLoggedIn(): boolean {
    return !!this.token && (this.getTokenExpirationDate(this.token).valueOf() > new Date().valueOf())
  }

  get roles(): Role[] {
    const decoded = jwtDecode<{ roles: string[] }>(this.token!);

    return (decoded.roles ?? [])
      .filter((r): r is Role => Object.values(Role).includes(r as Role));
  }

  hasRole(role: Role): boolean {
    return this.roles.includes(role);
  }


  private getTokenExpirationDate(token: string): Date {

    const decoded: any = jwtDecode(token)
    const date = new Date(0);
    if (decoded.exp === undefined) {
      return date;
    }


    date.setUTCSeconds(decoded.exp);
    return date;
  }


}
