import {Injectable} from '@angular/core';
import {Globals} from "../globals/globals";
import {HttpClient} from '@angular/common/http';
import {UserDto} from "../dto/UserDto";
import {Observable} from "rxjs";
import {PassChangeDto} from "../dto/PassChangeDto";


@Injectable({
    providedIn: 'root'
})
export class UserService {

    private baseUrl = this.globals.backendUrl + '/account';

    constructor(private http: HttpClient, private globals: Globals) {
    }

    getUserInfo(): Observable<UserDto> {
        return this.http.get<UserDto>(this.baseUrl);

    }

    changePassword(dto: PassChangeDto): Observable<UserDto> {
        return this.http.put<UserDto>(this.baseUrl + '/password', dto);
    }


    updateUserInfo(user: UserDto): Observable<UserDto> {
        return this.http.put<UserDto>(this.baseUrl, user);

    }
}
