import {PaginationDto} from "./PaginationDto";
import {BaseAffiliateDto} from "./DashboardDtos";

export class PayoutReqDto extends PaginationDto {
  month: number = new Date().getUTCMonth() + 1;
  year: number = new Date().getUTCFullYear();
  affiliatecode?: string;
  claimed?: boolean;

}

export interface PayoutResDto extends BaseAffiliateDto {
  rewardId: number;
  claimed: boolean;
  rewardAmount: number;
}

export interface ClaimDto {
  rewardIds: number[];
}
