import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Globals {
  private static readonly backendUrl: string = 'http://localhost:8080';

  get backendUrl(): string {
    return Globals.backendUrl;
  }
}
