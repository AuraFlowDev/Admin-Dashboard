import {Component, OnInit} from '@angular/core';
import {PackageDto} from "../../dto/PackageDtos";
import {PackageService} from "../../services/packages.service";
import {ToastrService} from "ngx-toastr";
import {NgForOf} from "@angular/common";
import {Formatter} from "../../utils/Formatter";

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.scss'
})
export class PackagesComponent implements OnInit {

  packages: PackageDto[] = [];

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


  protected readonly Formatter = Formatter;
}
