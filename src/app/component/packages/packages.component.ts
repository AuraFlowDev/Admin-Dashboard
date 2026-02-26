import {Component, OnInit} from '@angular/core';
import {PackageCreateDto, PackageDto, PackageUpdateDto} from "../../dto/PackageDtos";
import {PackageService} from "../../services/packages.service";
import {ToastrService} from "ngx-toastr";
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {Formatter} from "../../utils/Formatter";
import {PackageModalComponent} from "./packagemodal/packagemodal.component";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [
    NgForOf,
    PackageModalComponent,
    ConfirmDialogComponent,
    NgClass,
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss'
})
export class PackagesComponent implements OnInit {
  resetToken = 0;
  packages: PackageDto[] = [];
  showCreateModal: boolean = false;
  showEditModal: boolean = false;
  showConfirmModal: boolean = false;
  selected: PackageDto | null = null;
  showDetails: boolean = false;

  ngOnInit(): void {
    this.loadPackages();
  }

  constructor(private service: PackageService, private toastr: ToastrService) {
  }

  loadPackages() {
    this.service.getPackages().subscribe({
      next: (data) => {
        console.log(data);
        this.packages = data.packages;
      },
      error: (err) => {
        this.toastr.error(err.error.error);
      }
    })
  }

  createPackage(dto: PackageCreateDto) {
    this.service.createPackage(dto).subscribe({
      next: (data) => {
        data = {...data, active: true};
        this.packages.push(data);
        this.resetToken++;
        this.showCreateModal = false;
        this.toastr.success("Package created");
      },
      error: (err) => {
        this.toastr.error(err.error.error);
      }
    })
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  openCreateModal() {
    this.selected = null;
    this.showCreateModal = true;
    console.log("open modal:", this.showCreateModal);
  }

  openEditModal(packageDto: PackageDto) {
    this.showDetails = false;
    this.selected = packageDto;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selected = null;
  }

  updatePackage(dto: PackageUpdateDto) {
    if (!this.selected) return;
    const id = this.selected.id;
    const wasActive = this.selected.active;
    this.service.updatePackage(id, dto).subscribe({
      next: (updatedPkg) => {
        this.packages = this.packages.map(p => p.id === id ? {...updatedPkg, active: wasActive} : p);
        this.closeEditModal();
        this.toastr.success("Package updated");
      },
      error: (err) => {
        this.toastr.error(err.error.error);
      }
    })
  }

  openConfirmModal(packageDto: PackageDto) {
    this.showDetails = false;
    this.selected = packageDto;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.selected = null;
  }

  deletePackage() {
    if (!this.selected) return;
    if (!this.selected?.active) {
      this.toastr.error("Cannot deactivate inactive package");
      return;
    }
    const id = this.selected.id;
    this.service.deletePackage(this.selected.id).subscribe({
      next: () => {
        this.toastr.success("Package deactivated");
        this.setPackageActive(id, false);
      },
      error: (err) => {
        this.toastr.error(err.error.error);
      }
    })
    this.closeConfirmModal();
  }

  setPackageActive(id: number, active: boolean) {
    console.log("Setting package active: ", id, " to: ", active, "")
    this.packages = this.packages.map(p => p.id === id ? {...p, active: active} : p);
    console.log(this.packages)
  }

  activatePackage() {
    if (!this.selected) return;
    if (this.selected?.active) {
      this.toastr.error("Cannot activate active package");
      return;
    }
    const id = this.selected.id;
    this.service.activatePackage(this.selected.id).subscribe({
      next: () => {
        this.toastr.success("Package activated");
        this.setPackageActive(id, true);
      },
      error: (err) => {
        this.toastr.error(err.error.error);
      }
    })
    this.closeConfirmModal();
  }

  confirmPackageChange() {
    if (!this.selected) return;
    this.selected.active ? this.deletePackage() : this.activatePackage();
  }

  openDetailsModal(packageDto: PackageDto) {
    this.selected = packageDto;
    this.showDetails = true;
  }

  closeDetailsModal() {
    this.showDetails = false;
    this.selected = null;
  }


  protected readonly Formatter = Formatter;
}
