import {mapToCanActivate, Routes} from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {DashComponent} from "./component/dash/dash.component";
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {path: '', component: DashComponent, canActivate: mapToCanActivate([AuthGuard])},
  {
    path: 'login', component: LoginComponent
  }
];
