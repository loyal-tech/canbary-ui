import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificationBaseService } from "./notification-base.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class PaymentGatewayConfigurationService {
  mvnoId = localStorage.getItem("mvnoId");

  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT;

  getConfigParameterByname(name: String) {
    return this.http.get(`${this.baseUrl}/paymentconfig/getParameterByName?name=` + name);
  }

  addPaymentGatewayConfiguration(requestData: any) {
    return this.http.post(`${this.baseUrl}/paymentconfig/create`, requestData);
  }

  updatePaymentGatewayConfiguration(requestData: any) {
    return this.http.put(`${this.baseUrl}/paymentconfig/update`, requestData);
  }

  deletePaymentGatewayConfiguration(configId) {
    return this.http.delete(`${this.baseUrl}/paymentconfig/delete?paymentConfigId=` + configId);
  }

  changeStatusForPaymentGatewayConfiguration(requestData: any) {
    return this.http.put(`${this.baseUrl}/paymentconfig/changeStatus`, requestData);
  }

  getAlPaymentGatewayConfiguration(requestData) {
    return this.http.post(`${this.baseUrl}/paymentconfig/findByAllPaymentConfig`, requestData);
  }

  changePaymentGatewatConfigStatus(request) {
    return this.http.put(`${this.baseUrl}/paymentconfig/changeStatus`, request);
  }

  getPaymentgatewayConfigurationById(configId) {
    return this.http.get(
      `${this.baseUrl}/paymentconfig/findByPaymentConfigId?paymentConfigId=` + configId
    );
  }

  getActivePaymentConfiguration() {
    return this.http.get(
      `${this.baseUrl}/paymentconfig/getActivePaymentConfig?paymentGatewayFor=PAYMENT_GATEWAY_FOR_ADMIN`
    );
  }
}
