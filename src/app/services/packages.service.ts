import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Globals} from "../globals/globals";
import {Observable} from "rxjs";
import {PackageCreateDto, PackageDto, PackageFetchDto} from "../dto/PackageDtos";

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private baseUrl = this.globals.backendUrl + '/packages';

  constructor(private http: HttpClient, private globals: Globals) {
  }

  getPackages(): Observable<PackageFetchDto> {
    return this.http.get<PackageFetchDto>(this.baseUrl + '/all');
  }

  createPackage(dto: PackageCreateDto): Observable<PackageDto> {
    return this.http.post<PackageDto>(this.baseUrl, dto);
  }

  deletePackage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  activatePackage(id: number): Observable<PackageDto> {
    return this.http.put<PackageDto>(`${this.baseUrl}/${id}`, {});
  }

}
