import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {Globals} from "../globals/globals";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private globals: Globals, private authservice: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("AuthInterceptor with uri:", req.url);
    const loginUri = this.globals.backendUrl + "/auth/login";
    if (req.url === loginUri) {
      return next.handle(req);
    }

    const bearerReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.authservice.token)
    })

    return next.handle(bearerReq);

  }
}
