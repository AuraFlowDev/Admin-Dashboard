import {Component, OnInit} from '@angular/core';
import {PackageCreateDto, PackageDto} from "../../dto/PackageDtos";
import {PackageService} from "../../services/packages.service";
import {ToastrService} from "ngx-toastr";
import {NgForOf} from "@angular/common";
import {Formatter} from "../../utils/Formatter";
import {PackageModalComponent} from "./packagemodal/packagemodal.component";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [
    NgForOf
    NgForOf,
    PackageModalComponent,
  ],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss'
})
export class PackagesComponent implements OnInit {

  packages: PackageDto[] = [];
  showCreateModal: boolean = false;

  ngOnInit(): void {
    this.loadPackages();
  }

  constructor(private service: PackageService, private toastr: ToastrService) {
  }

  loadPackages() {
    this.service.getPackages().subscribe({
      next: (data) => {
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
        this.toastr.success("Package created");
        this.packages.push(data);
      },
      error: (err) => {
        this.toastr.error(err.error.error);
      }
    })
    this.showCreateModal = false;
  }

  closeCreateModal() {
    this.showCreateModal = false;
  }

  openCreateModal() {
    this.showCreateModal = true;
    console.log("open modal:", this.showCreateModal);
  }


  protected readonly Formatter = Formatter;
}
