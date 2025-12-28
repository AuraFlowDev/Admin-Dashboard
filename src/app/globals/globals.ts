import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Globals {
  private static readonly backendUrl: string = 'https://api.auraflow.at/fundraising-dev';
  static readonly defaultPageSize: number = 10;

  get backendUrl(): string {
    return Globals.backendUrl;
  }
}
