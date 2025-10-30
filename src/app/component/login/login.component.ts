import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {isOneFactorResponse, LoginDto, LoginResponse, OneFactorResponse, TwoFactorResponse} from "../../dto/LoginDto";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {handleError} from "../../dto/ErrorDto";
import {ToastrService} from "ngx-toastr";
import {NgIf} from "@angular/common";
import {Role} from "../../dto/PrivilegeDtos";

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

  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService) {
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
          next: (dto: LoginResponse) => {
            isOneFactorResponse(dto) ? this.handle1FA(dto) : this.handle2FA(dto);
          },
          error: (error) => {
            this.toastr.error(handleError(error))

          }
        }
      );


    }
  }

  handle2FA(dto: TwoFactorResponse): void {
    this.toastr.info("Two Factor Authentication is required. Please check your email for the verification code.");
    this.router.navigate(['/verify', dto.reqId], {
      queryParamsHandling: 'preserve',
    })
  }

  handle1FA(dto: OneFactorResponse): void {
    if (!this.authservice.hasRole(Role.ADMIN)) {
      this.authservice.logoutUser()
      this.toastr.error("You do not have the required permissions to access this page")
      this.router.navigate(['/login'])
      return;
    }
    this.toastr.success("Welcome Back " + dto.user.firstname);
    const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/';
    this.router.navigateByUrl(redirectTo);
  }

}
