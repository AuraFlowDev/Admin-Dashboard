import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authservice = inject(AuthService)
  const router = inject(Router)
  //state url is for redirecting to the page after login which the user was trying to access
  return authservice.isLoggedIn() ? true : router.createUrlTree(['/login'], {queryParams: {redirectTo: state.url}});
};
