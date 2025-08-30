import {Component, OnInit} from '@angular/core';
import {AdminService, AffiliateStatsDto, DashboardDto, PaymentDataDto} from '../../services/admin.service';
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Formatter} from "../../utils/Formatter";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dash.component.html',
  imports: [
    NgForOf,
    NgIf, FormsModule
  ],
  standalone: true
})
export class DashComponent implements OnInit {
  dashboardStats: DashboardDto | null = null;
  payments: PaymentDataDto[] = [];
  affiliates: AffiliateStatsDto[] = [];
  paymentPage = 0;
  affiliatePage = 0;
  totalPaymentPages = 0;
  totalAffiliatePages = 0;
  paymentStatusFilter = '';


  constructor(private adminService: AdminService) {
  }

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe(data => this.dashboardStats = data);
    this.loadPayments();
    this.loadAffiliates();
  }

  loadPayments() {
    this.adminService.getPaymentData(this.paymentPage, undefined, this.paymentStatusFilter).subscribe(data => {
      this.payments = data.content;
      this.totalPaymentPages = data.totalPages;
    });
  }

  loadAffiliates() {
    this.adminService.getAffiliateData(this.affiliatePage).subscribe(data => {
      this.affiliates = data.content;
      this.totalAffiliatePages = data.totalPages;
    });
  }

  onStatusFilterChange(newStatus: string) {
    this.paymentStatusFilter = newStatus;
    this.paymentPage = 0;
    this.loadPayments();
  }

  changePaymentPage(delta: number) {
    this.paymentPage += delta;
    this.loadPayments();
  }

  changeAffiliatePage(delta: number) {
    this.affiliatePage += delta;
    this.loadAffiliates();
  }

  get totalrevenue() {
    return Formatter.formatMoney(this.dashboardStats?.totalrevenue);
  }

  get usercount() {
    return this.dashboardStats?.usercount;
  }

  get allowlistcount() {
    return this.dashboardStats?.allowlistcount;
  }

  calcPlaceholderrows(baselist: Object[]): number[] {
    let amountOfRows: number = this.adminService.defaulPageSize;
    let diff = Math.max(0, amountOfRows - baselist.length);
    return new Array(diff).fill(0);
  }

  protected readonly Formatter = Formatter;
}
