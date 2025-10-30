import {Routes} from '@angular/router';
import {LoginComponent} from "./component/login/login.component";
import {DashComponent} from "./component/dash/dash.component";
import {LayoutComponent} from "./component/layout/layout.component";
import {authGuard} from "./guards/auth.guard";
import {guestGuard} from "./guards/guest.guard";
import {PayoutsComponent} from "./component/payouts/payouts.component";
import {PackagesComponent} from "./component/packages/packages.component";
import {ThreshComponent} from "./component/affiliate/thresh/thresh.component";
import {TwoFactorComponent} from "./component/two-factor/two-factor.component";
import {adminGuard} from "./guards/admin.guard";

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [authGuard, adminGuard], canActivateChild: [authGuard, adminGuard], children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashComponent},
      {
        path: 'affiliate', children: [
          {path: 'payouts', component: PayoutsComponent},
          {path: 'thresholds', component: ThreshComponent}
        ],
      },
      {path: 'packages', component: PackagesComponent}
    ]
  },

  {path: 'login', component: LoginComponent, canActivate: [guestGuard]},
  {path: 'verify/:reqId', component: TwoFactorComponent, canActivate: [guestGuard]}
];
