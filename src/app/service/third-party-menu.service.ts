import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class ThirdPartyMenuService {
  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL;

  getAllThirdPartyMenus(requestData) {
    return this.http.post(`${this.baseUrl}/thirdPartyMenu/getAllWithPagination`, requestData);
  }

  getParamsByEventAndClientName(clientName: string, eventName: string) {
    const url = `${this.baseUrl}/thirdPartyMenu/getParamsByEventAndClientName`;
    const body = {
      clientName: clientName,
      eventName: eventName
    };

    return this.http.post(url, body);
  }

  addThirdPartyMenu(requestData: any) {
    return this.http.post(`${this.baseUrl}/thirdPartyMenu/save`, requestData);
  }

  getThirdPartyMenuById(id) {
    return this.http.get(`${this.baseUrl}/thirdPartyMenu/get/` + id);
  }

  deleteThirdPartyMenu(id) {
    return this.http.delete(`${this.baseUrl}/thirdPartyMenu/delete/` + id);
  }

  updateThirdPartyMenu(url, requestData: any) {
    return this.http.put(`${this.baseUrl}/thirdPartyMenu/` + url, requestData);
  }
}
