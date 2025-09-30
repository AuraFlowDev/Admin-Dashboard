import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Globals {
  private static readonly backendUrl: string = 'https://dev.auraflow.at/api';
  static readonly defaultPageSize: number = 10;

  get backendUrl(): string {
    return Globals.backendUrl;
  }
}
