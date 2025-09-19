export class PrivilegeDto {
}

export class AffiliatePrivilegeDto extends PrivilegeDto {
  type: 'AFFILIATECODE';
}

export class RolePrivilegeDto extends PrivilegeDto {
  type: 'ROLE';
  role: Role;
}

export class AllowListPrivilegeDto extends PrivilegeDto {
  type: 'WHITELISTSLOT';
  whitelistSlots: number;
}


enum Role {
  ROLE_FAN, ROLE_INVESTOR, ROLE_VIP, ROLE_INFLUENCER
}
