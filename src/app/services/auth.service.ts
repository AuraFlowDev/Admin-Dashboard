import {Injectable} from '@angular/core';
import {AuthResponseDto, LoginDto} from "../dto/LoginDto";
import {Observable, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Globals} from "../globals/globals";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl: string = this.globals.backendUrl + "/auth"
  private static authTokenKey: string = 'authToken';

  constructor(private http: HttpClient, private globals: Globals) {
  }

  loginUser(loginDto: LoginDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(this.authUrl + "/login", loginDto).pipe(
      tap(dto => {
        this.setToken(dto.token);
      })
    )
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
