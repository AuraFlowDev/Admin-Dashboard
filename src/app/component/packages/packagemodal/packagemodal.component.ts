import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PackageCreateDto} from "../../../dto/PackageDtos";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
  AffiliatePrivilegeDto,
  AllowListPrivilegeDto,
  PrivilegeType,
  PrivilegeTypeLabels,
  Role,
  RoleLabels,
  RolePrivilegeDto
} from "../../../dto/PrivilegeDtos";
import {CommonModule, NgForOf, NgIf} from "@angular/common";

type FormPrivilege =
  | { type: PrivilegeType.AFFILIATE }
  | { type: PrivilegeType.ROLE; role: Role }
  | { type: PrivilegeType.ALLOWLIST; whitelistSlots: number };


@Component({
  selector: 'app-packagemodal',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './packagemodal.component.html',
  styleUrl: './packagemodal.component.scss'
})
export class PackageModalComponent implements OnInit {
  @Input() open: boolean = false;
  @Input() show: boolean = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<PackageCreateDto>();

  form: FormGroup;

  roles = Object.values(Role);
  privilegeTypes = Object.values(PrivilegeType);


  constructor(private fb: FormBuilder) {
  }


  ngOnInit(): void {
    this.initForm();
  }


  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0), Validators.pattern("^\d+([.]\d{0,2})?$")]],
      privileges: this.fb.array([])
    });
  }


  get privileges(): FormArray {
    return this.form.get('privileges') as FormArray;
  }

  addPrivilege(type: PrivilegeType) {
    switch (type) {
      case PrivilegeType.AFFILIATE:
        this.privileges.push(this.fb.group({
          type: [PrivilegeType.AFFILIATE, Validators.required],
        }));
        break;

      case PrivilegeType.ROLE:
        this.privileges.push(this.fb.group({
          type: [PrivilegeType.ROLE, Validators.required],
          role: [this.roles[0], Validators.required],
        }));
        break;

      case PrivilegeType.ALLOWLIST:
        this.privileges.push(this.fb.group({
          type: [PrivilegeType.ALLOWLIST, Validators.required],
          whitelistSlots: [1, [Validators.required, Validators.min(1)]],
        }));
        break;
    }
  }

  removePrivilege(index: number) {
    this.privileges.removeAt(index);
  }

  onCancel(): void {
    this.cancel.emit();
    this.show = false;
  }

  onPriceInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const inputVal = input.value;
    if (!inputVal) return;
    if (inputVal === '.') input.value = String(0.0)
    if (inputVal.length > 15) input.value = inputVal.slice(0, 15);

    const floatVal = parseFloat(input.value);
    const [, decPart = ''] = input.value.split('.');
    if (decPart && decPart.length > 2) {
      const newval = Math.round((floatVal + Number.EPSILON) * 100) / 100;
      input.value = newval.toString();
      this.form.get('price')?.setValue(newval, {emitEvent: false});
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedChars = /[0-9.,]/;
    const controlKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab',
      'Home',
      'End'
    ];

    if (controlKeys.includes(event.key)) {
      return;
    }

    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
      return;
    }


    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
  }


  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const dto: PackageCreateDto = {
      name: raw.name,
      description: raw.description,
      price: raw.price,
      privileges: (raw.privileges as FormPrivilege[]).map((p) => {
        switch (p.type) {
          case PrivilegeType.AFFILIATE:
            return new AffiliatePrivilegeDto();

          case PrivilegeType.ROLE: {
            const roleDto = new RolePrivilegeDto();
            roleDto.role = p.role;
            return roleDto;
          }

          case PrivilegeType.ALLOWLIST: {
            const listDto = new AllowListPrivilegeDto();
            listDto.whitelistSlots = p.whitelistSlots; // ✅ camelCase
            return listDto;
          }
        }
      })

    }
    this.confirm.emit(dto);
    this.show = false;
  }

  protected readonly PrivilegeType = PrivilegeType;
  protected readonly RoleLabels = RoleLabels;
  protected readonly PrivilegeTypeLabels = PrivilegeTypeLabels;
}
