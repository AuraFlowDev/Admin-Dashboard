import {Component} from '@angular/core';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HeaderComponent} from "./component/header/header.component";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgbModule, HeaderComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Admin-Dashboard';
}
