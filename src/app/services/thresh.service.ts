import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Globals} from "../globals/globals";
import {ThresholdDto, ThresholdFetchDto} from "../dto/ThresholdDto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThreshService {
  private baseUrl = this.globals.backendUrl + '/thresholds';

  constructor(private http: HttpClient, private globals: Globals) {
  }

  getThresholds(active: boolean | null): Observable<ThresholdFetchDto> {
    let params: HttpParams = new HttpParams();
    if (active !== null) {
      params = params.set('active', active);
    }

    return this.http.get<ThresholdFetchDto>(`${this.baseUrl}`, {params});
  }

  activateThreshold(id: number): Observable<ThresholdDto> {
    return this.http.put<ThresholdDto>(`${this.baseUrl}/${id}`, {});
  }


  deactivateThreshold(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  createThreshold(threshold: ThresholdDto): Observable<ThresholdDto> {
    return this.http.post<ThresholdDto>(`${this.baseUrl}`, threshold);
  }


}
