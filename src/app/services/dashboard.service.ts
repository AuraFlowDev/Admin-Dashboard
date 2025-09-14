import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Globals} from "../globals/globals";
import {Observable} from "rxjs";
import {AffiliateStatsDto, DashboardDto, PaymentDataDto} from "../dto/DashboardDtos";
import {PageDto} from "../dto/PageDto";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = this.globals.backendUrl + '/admin';
  private defaultPageSize = 10;

  constructor(private http: HttpClient, private globals: Globals) {
  }

  getDashboardStats(): Observable<DashboardDto> {
    return this.http.get<DashboardDto>(`${this.baseUrl}/dashboardstats`);
  }

  getPaymentData(page = 0, size = 10, status?: string): Observable<PageDto<PaymentDataDto>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<PageDto<PaymentDataDto>>(`${this.baseUrl}/paymentdata`, {params});
  }

  getAffiliateData(page = 0, size = this.defaultPageSize): Observable<PageDto<AffiliateStatsDto>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageDto<AffiliateStatsDto>>(`${this.baseUrl}/affiliate`, {params});
  }

  get defaulPageSize() {
    return this.defaultPageSize;
  }
}
