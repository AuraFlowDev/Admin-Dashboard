import {Role, RoleLabels} from "../dto/PrivilegeDtos";

export class Formatter {
  public static formatMoney(amount: number | undefined): string {
    if (!amount) {
      amount = 0;
    }
    return new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(amount)
  }


  public static formatRoles(roles: Role[] | undefined): string {
    if (!roles || roles.length === 0) {
      return 'No roles';

    }
    const formattedroles = roles.map(r=>RoleLabels[r]);
    return formattedroles.join(', ');
  }
}
