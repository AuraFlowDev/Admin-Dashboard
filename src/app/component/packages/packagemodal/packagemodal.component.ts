import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PackageCreateDto, PackageDto, PackageUpdateDto} from "../../../dto/PackageDtos";
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
export class PackageModalComponent implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() resetToken = 0;
  @Input() package: PackageDto | null = null;
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

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['resetToken'];
    if (change && !change.firstChange) {
      this.initForm();
    }

    const pkgChange = changes['package'];
    if (pkgChange && pkgChange.currentValue) {
      this.initForm(pkgChange.currentValue);
    }
  }


  initForm(pkg: PackageDto | null = null) {
    this.form = this.fb.group({
      name: [pkg?.name || '', Validators.required],
      description: [pkg?.description || ''],
      price: [pkg?.price || 0, [Validators.required, Validators.min(0), Validators.pattern("^\\d+(\\.\\d{1,2})?$")]],
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


  get isChanged(): boolean {
    if (!this.package || !this.form) return true;
    const raw = this.form.getRawValue();
    const description = (raw.description as string).trim();
    return (
      raw.name !== this.package.name ||
      description !== (this.package.description || "") ||
      Number(raw.price) !== Number(this.package.price)
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.package && !this.isChanged) {
      this.onCancel();
      return;
    }

    const raw = this.form.getRawValue();
    const description = (raw.description as string).trim();

    if (this.package) {
      const dto: PackageUpdateDto = {
        name: raw.name,
        description: description === "" ? undefined : description,
        price: raw.price
      };
      this.confirm.emit(dto as any);
      return;
    }

    const dto: PackageCreateDto = {
      name: raw.name,
      description: description === "" ? undefined : description,
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
            listDto.whitelistSlots = p.whitelistSlots;
            return listDto;
          }
        }
      })

    }
    this.confirm.emit(dto);
  }

  protected readonly PrivilegeType = PrivilegeType;
  protected readonly RoleLabels = RoleLabels;
  protected readonly PrivilegeTypeLabels = PrivilegeTypeLabels;
}
