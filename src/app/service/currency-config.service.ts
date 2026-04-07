import { Injectable } from "@angular/core";
import { SystemconfigService } from "../service/systemconfig.service";
import { Observable, of } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CurrencyConfigService {
  private cache = new Map<number, Observable<string>>();

  constructor(private systemService: SystemconfigService) {}

  getCurrency(mvnoId: number): Observable<string> {
    // Already cached using shareReplay
    if (this.cache.has(mvnoId)) {
      return this.cache.get(mvnoId)!;
    }

    // Make API call only once per mvnoId
    const currency$ = this.systemService
      .getConfigurationByName("CURRENCY_FOR_PAYMENT", mvnoId)
      .pipe(
        map((res: any) => res?.data?.value || "MMK"), // fallback
        shareReplay(1) // caches last value and replays it
      );

    this.cache.set(mvnoId, currency$);
    return currency$;
  }

  clearCache() {
    this.cache.clear();
  }
}
