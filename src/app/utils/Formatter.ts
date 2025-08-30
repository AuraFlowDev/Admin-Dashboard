export class Formatter {
  public static formatMoney(amount: number | undefined): string {
    if (!amount) {
      amount = 0;
    }
    return new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(amount)
  }
}
