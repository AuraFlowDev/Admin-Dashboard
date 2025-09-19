import {Component, OnInit} from '@angular/core';
import {PayoutReqDto, PayoutResDto} from "../../dto/PayoutDtos";
import {PayoutService} from "../../services/payout.service";
import {PageDto} from "../../dto/PageDto";
import {ToastrService} from "ngx-toastr";
import {ErrorDto} from "../../dto/ErrorDto";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {getPlaceholderRows} from "../../utils/TableUtils";
import {Formatter} from "../../utils/Formatter";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-payouts',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ConfirmDialogComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './payouts.component.html',
  styleUrl: './payouts.component.scss'
})
export class PayoutsComponent implements OnInit {
  payouts: PayoutResDto[] = [];
  page: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;
  pageSize: number = 20;
  month: number;
  year: number;
  affiliateCode: string | null = null;
  claimed: boolean | null = null
  selected: number[] = [];
  showDialog: boolean = false;

  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December"];
  years: number[] = [];

  constructor(private payoutService: PayoutService, private toastr: ToastrService) {
    this.month = new Date().getUTCMonth() + 1;
    this.year = new Date().getUTCFullYear();
    this.years = Array.from({length: 6}, (_, i) => this.year - i);
  }


  ngOnInit(): void {
    this.loadPayouts()
  }


  loadPayouts() {
    let payoutDto = this.createPayoutDto();
    console.log(payoutDto);

    this.payoutService.getPayouts(payoutDto).subscribe({
        next: (pageDto: PageDto<PayoutResDto>) => {
          this.payouts = pageDto.content;
          this.hasNext = pageDto.hasNext;
          this.hasPrevious = pageDto.hasPrevious;
          console.log(pageDto);
        },
        error: (error: ErrorDto) => {
          console.log(error);
          this.toastr.error(error.error)
        }
      }
    )
  }

  setAffiliateCode(code: string) {
    this.affiliateCode = code;
  }

  private createPayoutDto() {
    let payoutDto = new PayoutReqDto();
    payoutDto.page = this.page;
    payoutDto.size = this.pageSize;
    payoutDto.affiliatecode = this.affiliateCode ? this.affiliateCode.trim() : undefined;
    payoutDto.claimed = this.claimed === null ? undefined : this.claimed;
    const date = new Date();
    payoutDto.month = this.validateMonth() ? this.month : date.getUTCMonth() + 1;
    payoutDto.year = this.validateYear() ? this.year : date.getUTCFullYear();
    return payoutDto;
  }

  applyFilter() {
    this.page = 0;
    this.loadPayouts();
  }

  clearFilter() {
    this.month = new Date().getUTCMonth() + 1;
    this.year = new Date().getUTCFullYear();
    this.affiliateCode = null;
    this.claimed = null;
    this.applyFilter();
  }

  validateYear(): boolean {
    const year = this.year;
    return year >= 1970 && year <= new Date().getUTCFullYear();
  }

  validateMonth(): boolean {
    const month = this.month;
    return month >= 1 && month <= 12;
  }

  changePage(delta: number) {
    this.page += delta;
    this.loadPayouts();
  }

  openConfirm() {
    this.showDialog = true;
  }

  isSelected(rewardId: number): boolean {
    return this.selected.includes(rewardId);
  }

  toggleSelection(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    console.log("Toggling selection for ID:", id, "Checked:", checked);

    if (checked) {
      if (!this.selected.includes(id)) {
        console.log("Adding to selection: ", id)
        this.selected.push(id);
      }
    } else {
      this.selected = this.selected.filter(x => x !== id);
    }
  }

  closeConfirm() {
    this.showDialog = false;
    this.selected = [];
  }

  issuePayout() {
    if (this.selected.length === 0) return;
    const cleanedSelected = this.cleanSelected();

    const dto = {
      rewardIds: cleanedSelected
    }
    this.payoutService.postPayoutClaim(dto).subscribe({
      next: () => {
        this.toastr.success('Payed out ' + cleanedSelected.length + ' rewards successfully');
        this.loadPayouts();

      }, error: (error) => {
        this.toastr.error(error.error.error)
      }
    })
    this.closeConfirm();
  }

  clearSelection() {
    this.selected = [];
  }

  private cleanSelected(): number[] {
    return this.selected.filter(x => this.payouts.find(p => p.rewardId === x && !p.claimed) !== undefined);
  }

  get payoutAmount(): number {
    return this.selected.map(x => this.payouts.find(p => p.rewardId === x && !p.claimed)?.rewardAmount).map(x => x === undefined ?
      0 :
      x).reduce((a, b) => a + b, 0);
  }

  get numOfPayouts(): number {
    return this.cleanSelected().length;
  }

  protected readonly getPlaceholderRows = getPlaceholderRows;
  protected readonly Formatter = Formatter;
}
