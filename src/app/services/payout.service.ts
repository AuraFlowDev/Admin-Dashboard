import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Globals} from "../globals/globals";
import {ClaimDto, PayoutReqDto, PayoutResDto} from "../dto/PayoutDtos";
import {setParamsFromDto} from "../utils/SetParamsFromDto";
import {Observable} from "rxjs";
import {PageDto} from "../dto/PageDto";

@Injectable({
  providedIn: 'root'
})
export class PayoutService {

  private baseUrl = this.globals.backendUrl + '/admin';

  constructor(private http: HttpClient, private globals: Globals) {
  }


  getPayouts(payoutDto: PayoutReqDto): Observable<PageDto<PayoutResDto>> {
    const params = setParamsFromDto(new HttpParams(), payoutDto);
    return this.http.get<PageDto<PayoutResDto>>(`${this.baseUrl}/payouts`, {params});

  }

  postPayoutClaim(claimDto: ClaimDto): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/payouts`, claimDto);
  }


}
