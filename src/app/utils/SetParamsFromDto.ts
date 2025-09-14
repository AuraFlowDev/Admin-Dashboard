import {HttpParams} from "@angular/common/http";

export const setParamsFromDto = (params: HttpParams, dto: any) => {
  Object.keys(dto).forEach(key => {
    if (dto[key] !== undefined) {
      params = params.set(key, dto[key]);
    }
  });
  return params;
}
