import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NotificationBaseService } from "./notification-base.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

@Injectable({
  providedIn: "root",
})
export class PaymentIntegrationService {
  mvnoId = localStorage.getItem("mvnoId");

  constructor(private http: HttpClient) {}

  baseUrl = RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT;
  integrationUrl = RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL;

  initiatePhonePePayment(data) {
    return this.http.post(`${this.integrationUrl}/phonpe/PhonePePaymentInitiate`, data);
  }
}
