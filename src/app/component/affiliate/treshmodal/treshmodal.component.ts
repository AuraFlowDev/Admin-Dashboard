import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BoundThresholdDto, ThresholdDto, ThresholdType, ThresholdTypeLabels} from "../../../dto/ThresholdDto";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Role, RoleLabels} from "../../../dto/PrivilegeDtos";

@Component({
  selector: 'app-treshmodal',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    NgClass
  ],
  templateUrl: './treshmodal.component.html',
  styleUrl: './treshmodal.component.scss'
})
export class TreshmodalComponent implements OnInit {

  @Input() show: boolean = false;
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>;
  @Output() confirm: EventEmitter<ThresholdDto> = new EventEmitter<ThresholdDto>;

  form: FormGroup;

  thresholdtypes = Object.values(ThresholdType)
  roletypes = Object.values(Role)

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      type: [ThresholdType.LessEqual, Validators.required],
      allowedRoles: this.fb.control<Role[]>([], Validators.required),
      rewardPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      bound: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const dto: ThresholdDto | BoundThresholdDto = {
      type: raw.type,
      allowedRoles: raw.allowedRoles,
      rewardPercentage: raw.rewardPercentage,
      ...(raw.type !== ThresholdType.OnlyRole && {bound: raw.bound})
    };

    this.confirm.emit(dto);
    this.show = false;
  }

  onCancel(): void {
    this.cancel.emit();
    this.show = false;
  }

  get allowedRoles(): Role[] {
    return this.form.get('allowedRoles')?.value ?? [] as Role[];
  }

  get allowedRolesCtrl() {
    return this.form.get('allowedRoles') as FormControl<Role[]>;
  }

  isRoleSelected(r: Role): boolean {
    return (this.allowedRolesCtrl.value ?? []).includes(r);
  }

  toggleRole(r: Role): void {
    const curr = this.allowedRolesCtrl.value ?? [];
    const next = this.isRoleSelected(r) ? curr.filter(x => x !== r) : [...curr, r];
    this.allowedRolesCtrl.setValue(next);
    this.allowedRolesCtrl.updateValueAndValidity({onlySelf: true});
  }

  get threshType(): ThresholdType {
    return this.form.get('type')?.value as ThresholdType;
  }

  addRole(r: Role) {
    if (!this.isRoleSelected(r)) this.toggleRole(r);
  }

  removeRole(r: Role) {
    if (this.isRoleSelected(r)) this.toggleRole(r);
  }

  isInvalid(path: string): boolean | undefined {
    return this.form.get(path)?.touched && this.form.get(path)?.invalid;
  }


  protected readonly ThresholdTypeLabels = ThresholdTypeLabels;
  protected readonly RoleLabels = RoleLabels;
  protected readonly ThresholdType = ThresholdType;
}
