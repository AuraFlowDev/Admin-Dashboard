
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

export interface AffiliateStatsDto {
  firstname: string;
  lastname: string;
  affiliatecode: string;
  roles: string[];
  totalRevenue: number;
  totalrewards: number;
}
