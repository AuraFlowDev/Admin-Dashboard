export interface DashboardDto {
  totalrevenue: number;
  usercount: number;
  allowlistcount: number;
}

export interface PaymentDataDto {
  id: number;
  paymentId: string;
  payerId: number;
  paymentStatus: string;
  amount: number;
  affiliateCode: string;
}

export interface BaseAffiliateDto {
  firstname: string;
  lastname: string;
  affiliatecode: string;
  roles: string[];
}

export interface AffiliateStatsDto extends BaseAffiliateDto {
  totalRevenue: number;
  totalRewards: number;
}
