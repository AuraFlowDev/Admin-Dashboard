import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Globals} from "../globals/globals";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  whiteList : Map<String, boolean> = new Map<String, boolean>();

  constructor(private globals: Globals, private authservice: AuthService) {
    this.whiteList.set(this.globals.backendUrl + "/auth/login", true);
    this.whiteList.set(this.globals.backendUrl + "/auth/login/verify", true);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("AuthInterceptor with uri:", req.url);
    if (this.whiteList.get(req.url)) {
      return next.handle(req);
    }

    const bearerReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.authservice.token)
    })

    return next.handle(bearerReq);

  }
}
