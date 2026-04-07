import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificationBaseService } from "./notification-base.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root"
})
export class IntegrationConfigurationService {
  mvnoId = localStorage.getItem("mvnoId");

  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL;

  addIntegrationConfiguration(requestData: any) {
    return this.http.post(`${this.baseUrl}/config/create`, requestData);
  }

  updateIntegrationConfiguration(requestData: any) {
    return this.http.put(`${this.baseUrl}/config/update`, requestData);
  }

  deleteIntegrationConfiguration(configId) {
    return this.http.delete(`${this.baseUrl}/config/deleteConfig?id=` + configId);
  }

  getAllIntegrationConfiguration(requestData) {
    return this.http.post(`${this.baseUrl}/config/list`, requestData);
  }

  getIntegrationConfigurationById(configId) {
    return this.http.get(`${this.baseUrl}/config/findById?id=` + configId);
  }

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL + url);
  }
}
