import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class PrepaidRejectedReasonService {
  constructor(private http: HttpClient) {}

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_PREPAID_REJECT_REASON_BASE_URL + url);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_PREPAID_REJECT_REASON_BASE_URL + url, data);
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_PREPAID_REJECT_REASON_BASE_URL + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_PREPAID_REJECT_REASON_BASE_URL + url, data);
  }

  getAllRejectedReasonsList() {
    return this.http.get(
      RadiusConstants.ADOPT_PREPAID_REJECT_REASON_BASE_URL + "/rejectReason/allRejectedReasonsList"
    );
  }
}
