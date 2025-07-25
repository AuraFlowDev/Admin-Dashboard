import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {


  constructor(private router: Router, private authservice: AuthService) {
  }


  logout() : void {
  this.authservice.logoutUser();
  this.router.navigate(['/login']);
  }

}
