import {Globals} from "../globals/globals";

export const getPlaceholderRows = (baseArray: any[], customPageSize?: number) => {
  const pagesize = customPageSize ? customPageSize : Globals.defaultPageSize;
  let diff = Math.max(0, pagesize - baseArray.length);
  return new Array(diff).fill(0);
}
