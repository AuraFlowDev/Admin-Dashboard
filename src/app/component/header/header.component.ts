import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {NgbModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../services/auth.service";
import {UserDto} from "../../dto/UserDto";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";
import {handleError} from "../../dto/ErrorDto";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {PassChangeDto} from "../../dto/PassChangeDto";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  private static passwordregex: string = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

  user: UserDto | null = null;
  changePassword: boolean = false;

  changeForm: FormGroup;

  @ViewChild('profileOver') profileModal: any;


  constructor(
    private router: Router,
    private authservice: AuthService,
    private userservice: UserService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
  }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.getUserInfo();
    this.changeForm = this.fb.group({
      email: ['', [Validators.email]],
      firstname: [''],
      lastname: [''],
      oldPassword: ['', [Validators.pattern(HeaderComponent.passwordregex)]],
      newPassword: ['', [Validators.pattern(HeaderComponent.passwordregex)]],
      newPasswordConfirmation: ['',
        [Validators.pattern(HeaderComponent.passwordregex)]]

    })
  }

  openProfileModal(): void {

    this.modalService.open(this.profileModal, {ariaLabelledBy: 'modal-basic-title'});
  }

  saveChanges(): void {
    if (this.changeForm.valid) {
      const updateData: Partial<UserDto> = {};
      if (this.changeForm.get('firstname')?.value) {
        updateData.firstname = this.changeForm.get('firstname')?.value;
      }
      if (this.changeForm.get('lastname')?.value) {
        updateData.lastname = this.changeForm.get('lastname')?.value;
      }
      if (this.changeForm.get('email')?.value) {
        updateData.email = this.changeForm.get('email')?.value;
      }

      // Only make the API call if there are changes
      if (Object.keys(updateData).length > 0) {
        this.userservice.updateUserInfo(updateData as UserDto).subscribe({
          next: (updatedUser: UserDto) => {
            this.user = updatedUser;
            this.toastr.success('Profile updated successfully');
          },
          error: (error) => {
            this.toastr.error(handleError(error));
          }
        });
      }
      if (this.changePassword) {
        const passChangeDto: PassChangeDto = {
          oldPassword: this.changeForm.get('oldPassword')?.value,
          newPassword: this.changeForm.get('newPassword')?.value,
          newPasswordConfirmation: this.changeForm.get('newPasswordConfirmation')?.value
        }
        if (passChangeDto.newPassword !== passChangeDto.newPasswordConfirmation) {
          this.toastr.error("New password and confirmation do not match");
          return;
        }
        this.userservice.changePassword(passChangeDto).subscribe({
          next: (updatedUser: UserDto) => {
            this.toastr.success('Password changed successfully');
          },
          error: (error) => {
            this.toastr.error(handleError(error));
          }
        })
      }
      this.closeModal()
    } else {
      this.toastr.error("Please correct the errors in the form");
    }


    // // Create an object with only the filled fields
    // const updateData: Partial<UserDto> = {};
    //
    // if (this.editedUser.firstname) {
    //   updateData.firstname = this.editedUser.firstname;
    // }
    // if (this.editedUser.lastname) {
    //   updateData.lastname = this.editedUser.lastname;
    // }
    // if (this.editedUser.email) {
    //   updateData.email = this.editedUser.email;
    // }
    //
    // // Only make the API call if there are changes
    // if (Object.keys(updateData).length > 0) {
    //   this.userservice.updateUserInfo(updateData as UserDto).subscribe({
    //     next: (updatedUser: UserDto) => {
    //       this.user = updatedUser;
    //       this.toastr.success('Profile updated successfully');
    //       this.modalService.dismissAll();
    //     },
    //     error: (error) => {
    //       this.toastr.error(handleError(error));
    //     }
    //   });
    // } else {
    //   this.modalService.dismissAll();
    // }
    // if (this.changePassword) {
    //
    // }
  }

  wasChangedInvalidly(field: string): boolean {
    const control = this.changeForm.get(field);
    const invalid: boolean | undefined = control?.invalid && control?.touched
    return invalid || false;
  }


  closeModal(): void {
    this.modalService.dismissAll();
    this.changePassword = false;
    this.changeForm.reset();
  }

  togglePasswordChange(): void {
    if (!this.changePassword) {
      this.changePassword = true;
    } else {
      this.changePassword = false;
      this.changeForm.patchValue({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirmation: ''
      });
    }
  }


  logout(): void {
    this.authservice.logoutUser();
    this.router.navigate(['/login']);
  }

  getUserInfo() {
    this.userservice.getUserInfo().subscribe({
      next: (user: UserDto) => {
        this.user = user;
      },
      error: (error) => {
        this.toastr.error(handleError(error))
      }
    })
  }

}
