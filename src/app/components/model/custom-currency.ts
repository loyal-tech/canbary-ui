import { Inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { CurrencyConfigService } from "src/app/service/currency-config.service";

@Pipe({
  name: "customCurrency",
  pure: false
})
export class CustomCurrencyPipe implements PipeTransform {
  private mvnoCurrency: { [id: number]: string } = {};

  constructor(
    private currencyPipe: CurrencyPipe,
    private currencyConfigService: CurrencyConfigService,
    @Inject(LOCALE_ID) private defaultLocale: string
  ) {}

  transform(
    value: number,
    currencyCode: string,
    mvnoId?: number,
    locale?: string,
    digits: string = "1.2-2"
  ): string {
    if (value == null || isNaN(value)) return "";

    // If mvnoId provided, fetch currency via shared stream
    if (mvnoId) {
      if (!this.mvnoCurrency[mvnoId]) {
        this.currencyConfigService.getCurrency(mvnoId).subscribe(currency => {
          this.mvnoCurrency[mvnoId] = currency;
        });
      }
      currencyCode = currencyCode ? currencyCode : this.mvnoCurrency[mvnoId] || currencyCode;
    }else{
        let actualMvnoId = Number(localStorage.getItem('mvnoId'));
        if (!this.mvnoCurrency[actualMvnoId]) {
            this.currencyConfigService.getCurrency(actualMvnoId).subscribe(currency => {
            this.mvnoCurrency[actualMvnoId] = currency;
            });        
        }
        currencyCode = currencyCode ? currencyCode : this.mvnoCurrency[actualMvnoId] || currencyCode;
    }

    const effectiveLocale = locale || this.defaultLocale;
    const isNegative = value < 0;

    // Format using absolute value to avoid duplicate negative signs
    const formatted = this.currencyPipe.transform(
      Math.abs(value),
      currencyCode,
      "symbol",
      digits,
      effectiveLocale
    );

    if (!formatted) return "";

    // Match symbol and number cleanly
    const match = formatted.match(/^([^0-9\-.,]*)([\d.,]+)([^0-9\-.,]*)$/);

    if (!match) {
      // fallback
      return isNegative ? `- ${formatted}` : formatted;
    }
    const [, symbolBefore, numberPart, symbolAfter] = match;

    const symbol = (symbolBefore + symbolAfter).trim();

    return isNegative ? `- ${numberPart} ${symbol}` : `${numberPart} ${symbol}`;
  }
}
