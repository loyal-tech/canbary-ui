import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class MigrationService {
  mvnoId = localStorage.getItem("mvnoId");

  constructor(private http: HttpClient) {}

  integrationUrl = RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL;
  cmsUrl = RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL;

  downloadBulkPlanUpdateSheet() {
    return this.http
      .get(`${this.integrationUrl}/migration/downloadPlan`, { responseType: "blob" })
      .pipe(
        map((res: any) => {
          return new Blob([res], { type: "application/pdf" });
        })
      );
  }

  uploadBulkPlanUpdateSheet(data) {
    return this.http.post(`${this.integrationUrl}/migration/bulkPlanUpload`, data);
  }

  uploadBulkPlanUpdateSheetCMS(data) {
    return this.http.post(`${this.cmsUrl}/uploadPlanUpdatebulk`, data);
  }
}
