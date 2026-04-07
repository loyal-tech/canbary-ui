import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ADOPT_INVENTORY_MANAGEMENT_BASE_URL } from "../RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root",
})
export class InventoryRequestService {
  constructor(private http: HttpClient) {}
  baseUrl = ADOPT_INVENTORY_MANAGEMENT_BASE_URL;
  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }
  forwardToWarehouse(forwardToReqId, remarks, reqId, plandata) {
    return this.http.post(
      `${this.baseUrl}/requestinventory/forwardReqInv?forwardToReqId=` +
        forwardToReqId +
        "&remarks=" +
        remarks +
        "&reqId=" +
        reqId,
      plandata
    );
  }
}
