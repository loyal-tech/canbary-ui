import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class LeadManagementService {
  constructor(private http: HttpClient) {}

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_LEAD_BASE_URL + url);
  }

  getMethodCMS(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  postleadMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_LEAD_BASE_URL + url, data);
  }
  getConnection(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }

  getLinkTypes(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }
  getCircuitAreas(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }
  getBusinessVerticals(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }
  getSubBusinessVerticals(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }

  postMethod(url, data, mvnoid, staffid) {
    return this.http.post(RadiusConstants.ADOPT_LEAD_BASE_URL + url, data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        mvnoid: mvnoid,
        staffid: staffid,
      }),
    });
  }

  sendTOcustomer(url, data) {
    return this.http.post(RadiusConstants.ADOPT_LEAD_BASE_URL + url, data);
  }

  assignPO(url, data) {
    return this.http.post(RadiusConstants.ADOPT_LEAD_BASE_URL + url, data);
  }

  assignMethod(url, formData) {
    return this.http.put(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, formData);
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_LEAD_BASE_URL + url);
  }

  updateMethod(url, data, mvnoid, staffid) {
    return this.http.put(RadiusConstants.ADOPT_LEAD_BASE_URL + url, data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        mvnoid: mvnoid,
        staffid: staffid,
      }),
    });
  }

  getMethodForAdoptApi(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }

  getMethodAPIGateway(url) {
    return this.http.get(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + url);
  }

  convertCAFPostMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_LEAD_BASE_URL + url, data);
  }

  downloadLeadPDF(type: any): any {
    const url = RadiusConstants.ADOPT_LEAD_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], { type: "application/pdf" });
      })
    );
  }

  planMappingList: any;
  findCPRForLeadToCAFConvertionForEnterpriseCustomer(leadId: any): any {
    const url =
      RadiusConstants.ADOPT_LEAD_BASE_URL +
      `/leadMaster/findCPRForLeadToCAFConvertionForEnterpriseCustomer?leadId=` +
      leadId;
    return this.http.get(url);
    // return this.planMappingList;
  }
}
