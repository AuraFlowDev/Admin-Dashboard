import {Globals} from "../globals/globals";

export class PaginationDto {
  page: number = 0;
  size: number = Globals.defaultPageSize;
}

export enum SortOrder {ASC, DESC}
