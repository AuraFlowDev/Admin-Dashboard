import {Role} from "./PrivilegeDtos";

export class ThresholdFetchDto {
  thresholds: ThresholdDto[] = [];
}


export class ThresholdDto {
  id?: number;
  allowedRoles: Role[];
  rewardPercentage: number;
  active?: boolean;
  type: ThresholdType;
}

export class BoundThresholdDto extends ThresholdDto {
  bound: number;
}

export enum ThresholdType {
  LessEqual = "LESSEQ",
  GreaterEqual = "GREATEREQ",
  OnlyRole = "ROLE"
}

export const ThresholdTypeLabels: Record<ThresholdType, String> = {
  [ThresholdType.LessEqual]: "Less or Equal",
  [ThresholdType.GreaterEqual]: "Greater or Equal",
  [ThresholdType.OnlyRole]: "Only Role"
}
