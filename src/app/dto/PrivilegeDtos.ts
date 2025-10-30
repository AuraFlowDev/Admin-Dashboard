export class PrivilegeDto {
}

export enum PrivilegeType {
  AFFILIATE = 'AFFILIATECODE', ROLE = 'ROLE', ALLOWLIST = 'WHITELISTSLOT'
}

export const PrivilegeTypeLabels: Record<PrivilegeType, String> = {
  [PrivilegeType.AFFILIATE]: "Affiliate Code",
  [PrivilegeType.ROLE]: "Role",
  [PrivilegeType.ALLOWLIST]: "Allowlist Slot"
}

export class AffiliatePrivilegeDto extends PrivilegeDto {
  type: PrivilegeType = PrivilegeType.AFFILIATE
}

export class RolePrivilegeDto extends PrivilegeDto {
  type: PrivilegeType = PrivilegeType.ROLE;
  role: Role;
}

export class AllowListPrivilegeDto extends PrivilegeDto {
  type: PrivilegeType = PrivilegeType.ALLOWLIST;
  whitelistSlots: number;
}


export enum Role {
  FAN = 'ROLE_FAN', INVESTOR = 'ROLE_INVESTOR', VIP = 'ROLE_VIP', INFLUENCER = 'ROLE_INFLUENCER', ADMIN = 'ROLE_ADMIN'
}

export const RoleLabels: Record<Role, String> = {
  [Role.FAN]: "Fan",
  [Role.INVESTOR]: "Investor",
  [Role.VIP]: "VIP",
  [Role.INFLUENCER]: "Influencer",
  [Role.ADMIN]: "Admin"
}
