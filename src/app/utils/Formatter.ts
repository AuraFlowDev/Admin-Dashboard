export class Formatter {
  public static formatMoney(amount: number | undefined): string {
    if (!amount) {
      amount = 0;
    }
    return new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(amount)
  }


  public static formatRoles(roles: string[] | undefined): string {
    if (!roles || roles.length === 0) {
      return 'No roles';

    }
    const formattedroles = roles.map(role => role.replace('ROLE_', '')).map(role => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase())
    return formattedroles.join(', ');
  }
}
