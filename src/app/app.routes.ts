import {Routes} from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {DashComponent} from "./component/dash/dash.component";
import {LayoutComponent} from "./component/layout/layout.component";
import {authGuard} from "./guards/auth.guard";
import {guestGuard} from "./guards/guest.guard";
import {PayoutsComponent} from "./component/payouts/payouts.component";

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [authGuard], canActivateChild: [authGuard], children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashComponent},
      {
        path: 'affiliate', children: [
          {path: 'payouts', component: PayoutsComponent}
        ]
      }
    ]
  },

  {path: 'login', component: LoginComponent, canActivate: [guestGuard]},
];
