import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";
import { LoginService } from "./login.service";

@Injectable({
  providedIn: "root"
})
export class CustomerdetailsilsService {
  baseUrl = RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL;
  paymentUrl = RadiusConstants.ADOPT_SUBSCRIBER_BASE_URL;
  subscribeUrl = RadiusConstants.ADOPT_SUBSCRIBER_BASE_URL;
  commonUrl = RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT;
  revenueUrl = RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL;
  intigrationUrl = RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL;
  baseUrlForPay = RadiusConstants.ADOPT_PAY;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  getMethod(id) {
    return this.http.get(`${this.baseUrl}` + id);
  }

  intigrationGetMethod(id) {
    return this.http.get(`${this.intigrationUrl}` + id);
  }

  revenueGetMethod(id) {
    return this.http.get(`${this.revenueUrl}` + id);
  }

  commonGetMethod(id) {
    return this.http.get(`${this.commonUrl}` + id);
  }

  getPaymentMethod(id) {
    return this.http.get(`${this.paymentUrl}` + id);
  }

  postMethod(url, data) {
    return this.http.post(`${this.baseUrl}` + url, data);
  }

  postRevenueMethod(url, data) {
    return this.http.post(`${this.revenueUrl}` + url, data);
  }

  postSubscriberMethod(url, data) {
    return this.http.post(`${this.subscribeUrl}` + url, data);
  }

  addPayment(data) {
    return this.http.post(`${this.baseUrl}/addCustomerPaymentStatus`, data);
  }

  updatePayment(orderId, status) {
    return this.http.post(
      `${this.baseUrl}/updateCustomerPaymentStatus?orderid=${orderId}&status=${status}`,
      ""
    );
  }
  putMethod(url: string, body: any = {}) {
  return this.http.put(`${this.baseUrl}${url}`, body);
}


  paymentGateway(data) {
    return this.http.post(`${this.baseUrl}/submitPaymentDetail`, data);
  }

  getCutomerTicketData(url) {
    return this.http.get(RadiusConstants.ADOPT_SUBSCRIBER_BASE_URL + url);
  }

  downloadPDFInvoice(type: any): any {
    const url = this.revenueUrl + `${type}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], { type: "application/pdf" });
      })
    );
  }

  getCustomerLedger(data) {
    const url = "/customerLedgers";
    return this.http.post(`${this.revenueUrl}` + url, data);
  }

  getSubscriberPaymentHistory(id) {
    const url = "/paymentHistory/" + id;
    return this.http.get(`${this.revenueUrl}` + url);
  }

  updateMethod(url, data) {
    return this.http.put(this.baseUrl + url, data);
  }

  getmethodforrevenue(url) {
    return this.http.get(this.revenueUrl + url);
  }

  getBalanceData(data) {
    return this.http.get(`${this.baseUrl}/getbalance?fri=` + data);
  }

  sendDebit(data) {
    return this.http.post(`${this.baseUrl}/debit`, data);
  }

  updateCustomerMobile(data) {
    return this.http.post(`${this.baseUrl}/customers/updateCustomerMobileNo`, data);
  }

  getTransactionstatus(data) {
    return this.http.post(`${this.baseUrl}/paymentGateway/gettransactionstatus`, data);
  }

  getDeviceDetails(data: any, mvnoId) {
    return this.http.post(`${this.baseUrl}/Device/getDeviceData?mvnoId=` + mvnoId, data);
  }
  getConfigurationByName(data) {
    return this.http.get(
      `${this.baseUrl}/system/configuration/getConfigurationByName?name=${data}&mvnoId=${localStorage.getItem("mvnoId")}`
    );
  }

  getActivePaymentConfiguration() {
    return this.http.get(
      `${this.commonUrl}/paymentconfig/getActivePaymentConfig?paymentGatewayFor=PAYMENT_GATEWAY_FOR_CWSC`
    );
  }
  razorpaycallback(url, data) {
    return this.http.post(url, data);
  }

  buyPlanUsingMomo(data) {
    const token = localStorage.getItem("payLinkToken");
    let headers = new HttpHeaders({
      Authorization: `${token}`,
      requestFrom: "gui"
    });

    if (localStorage.getItem("partnerId") !== "1") {
      headers = headers.set("rf", "pw");
    }
    return this.http.post(`${this.intigrationUrl}/requestToPay`, data, {
      headers
    });
  }

  getIntigrationTransactionstatus(data) {
    const token = localStorage.getItem("payLinkToken");
    let headers = new HttpHeaders({
      Authorization: `${token}`,
      requestFrom: "gui"
    });

    if (localStorage.getItem("partnerId") !== "1") {
      headers = headers.set("rf", "pw");
    }
    return this.http.post(`${this.intigrationUrl}/getpaymentstatus`, data, {
      headers
    });
    // return this.http.post(`${this.intigrationUrl}/getpaymentstatus`, data);
  }

  buyPlanUsingAirtel(data) {
    const token = localStorage.getItem("payLinkToken");
    let headers = new HttpHeaders({
      Authorization: `${token}`,
      requestFrom: "gui"
    });

    if (localStorage.getItem("partnerId") !== "1") {
      headers = headers.set("rf", "pw");
    }
    return this.http.post(`${this.intigrationUrl}/airtel/requestToPay`, data, {
      headers
    });
    // return this.http.post(`${this.intigrationUrl}/airtel/requestToPay`, data);
  }

  buyPlanUsingMomoInvoice(data) {
    return this.http.post(`${this.intigrationUrl}/requestToPay`, data);
  }

  getIntigrationTransactionstatusInvoice(data) {
    return this.http.post(`${this.intigrationUrl}/getpaymentstatus`, data);
  }

  buyPlanUsingAirtelInvoice(data) {
    return this.http.post(`${this.intigrationUrl}/airtel/requestToPay`, data);
  }

  buyPlanUsingSelcom(data) {
    return this.http.post(`${this.intigrationUrl}/selcomPay`, data);
  }

  checkInvoiceIntigration(event) {
    return this.http.get(
      `${this.intigrationUrl}/thirdPartyMenu/getThirdPartyConfigurationByEvent?eventName=` + event
    );
  }

  sendTraInvoiceIntigration(debitdocumentId) {
    return this.http.get(`${this.revenueUrl}/invoice/reSendQrPayload/` + debitdocumentId);
  }

  getMethodForPay(url) {
    return this.http.get(`${this.baseUrlForPay}` + url);
  }

  buyPlanUsingWaveMoney(data) {
    return this.http.post(`${this.intigrationUrl}/waveMoneyPay`, data);
  }

  buyPlanUsingKbz(data) {
    return this.http.post(`${this.intigrationUrl}/kbzPay`, data);
  }
  buyPlanUsingOnePay(data) {
    return this.http.post(`${this.intigrationUrl}/onePayPayment`, data);
  }
  buyPlanUsingTransactease(data) {
    return this.http.post(`${this.intigrationUrl}/transactease/initiatePayment`, data, {
      responseType: "text"
    });
  }

  getCustomerAddressDetails(data) {
    return this.http.get(
      RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + "/getCustomerAddressDetails/" + data
    );
  }

  buyPlanUsingMpesa(data) {
    return this.http.post(`${this.intigrationUrl}/mpesaB2C/initiateB2CPayment`, data);
  }
  buyPlanUsingMpesaExpress(data) {
    return this.http.post(`${this.intigrationUrl}/c2b/mpesa/express/initiatePayment`, data);
  }
}
