import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Globals} from "../globals/globals";

export interface DashboardDto {
  totalrevenue: number;
  usercount: number;
  allowlistcount: number;
}

export interface PageDto<T> {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export interface PaymentDataDto {
  id: number;
  paymentId: string;
  payerId: number;
  paymentStatus: string;
  amount: number;
  affiliateCode: string;
}

export interface AffiliateStatsDto {
  firstname: string;
  lastname: string;
  affiliatecode: string;
  roles: string[];
  totalRevenue: number;
  totalrewards: number;
}

@Injectable({providedIn: 'root'})
export class AdminService {
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
    return this.http.get<PageDto<PaymentDataDto>>(`${this.baseUrl}/paymentdata`, { params });
  }

  getAffiliateData(page = 0, size = this.defaultPageSize): Observable<PageDto<AffiliateStatsDto>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageDto<AffiliateStatsDto>>(`${this.baseUrl}/affiliate`, {params});
  }
  get defaulPageSize() {
    return this.defaultPageSize;
  }
}
