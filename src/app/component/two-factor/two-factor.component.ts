import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {VerifyRequest} from "../../dto/LoginDto";
import {NgIf} from "@angular/common";
import {ToastrService} from "ngx-toastr";
import {handleError} from "../../dto/ErrorDto";

@Component({
  selector: 'app-two-factor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './two-factor.component.html',
  styleUrl: './two-factor.component.scss'
})
export class TwoFactorComponent implements OnInit {
  reqId!: string;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: AuthService,
    private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.reqId = this.route.snapshot.paramMap.get('reqId') ?? '';
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: VerifyRequest = {
      reqId: this.reqId,
      token: this.form.value.code as string
    };

    this.service.verifyTwoFactor(dto).subscribe({
      next: (res) => {
        this.toastr.success("Welcome Back " + res.user.firstname);
        const redirectTo = this.route.snapshot.queryParamMap.get('redirectTo') || '/';
        this.router.navigateByUrl(redirectTo);
      },
      error: (err) => {
        this.toastr.error(handleError(err))
      }
    })
  }

  onCancel(): void {
    this.router.navigate(['/login']);
  }
}
