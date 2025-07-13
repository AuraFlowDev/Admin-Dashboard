import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Globals {
  private static readonly backendUrl: string = 'http://194.182.175.77';

  get backendUrl(): string {
    return Globals.backendUrl;
  }
}
