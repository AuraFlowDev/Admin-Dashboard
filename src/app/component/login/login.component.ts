import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthResponseDto, LoginDto} from "../../dto/LoginDto";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ErrorDto} from "../../dto/ErrorDto";
import {ToastrService} from "ngx-toastr";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {


  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      const logindto: LoginDto = this.loginForm.value;
      console.log('Login DTO:', logindto);
      this.authservice.loginUser(logindto).subscribe(
        {
          next: (dto: AuthResponseDto) => {
            console.log('AuthResponseDto:', dto);
            this.toastr.success("Welcome Back " + dto.user.firstname);
            this.router.navigate(['/']);
          },
          error: (error: ErrorDto) => {
            this.toastr.error(error.error);
          }
        }
      );


    }
  }
}
