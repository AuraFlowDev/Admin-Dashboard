import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {Role} from "../dto/PrivilegeDtos";

export const adminGuard: CanActivateFn = (route, state) => {
  const authservice = inject(AuthService);
  const router = inject(Router);

  return authservice.hasRole(Role.ADMIN) ? true : router.createUrlTree(['/login'], {queryParams: {redirectTo: state.url}});
};
