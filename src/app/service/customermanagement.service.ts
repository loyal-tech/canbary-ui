import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class CustomermanagementService {
  baseUrl = RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL;
  baseradiusUrl = RadiusConstants.ADOPT_RADIUS_BASE_URL;
  billingEngineUrl = RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL;
  protalUrl = RadiusConstants.ADOPT_SUBSCRIBER_BASE_URL;
  notificationUrl = RadiusConstants.ADOPT_NOTIFICATION_BASE_URL;
  loggedInUser = localStorage.getItem("loggedInUser");
  mvnoId = localStorage.getItem("mvnoId");
  constructor(private http: HttpClient) {}

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }
  getMethodForIntegration(url) {
    return this.http.get(RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL + url);
  }

  getMethodForRadius(url) {
    return this.http.get(RadiusConstants.ADOPT_RADIUS_BASE_URL + url);
  }

  getByIdMethodForNetConf(url) {
    return this.http.get(RadiusConstants.ADOPT_API_GATEWAY_NETCONF_CUSTOMER + url);
  }

  getMethodForLeadApproveStaff(url, data) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  postMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  postMethodForIntegration(url, data) {
    return this.http.post(RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL + url, data);
  }

  postMethodRadius(url, data) {
    return this.http.post(RadiusConstants.ADOPT_RADIUS_BASE_URL + url, data);
  }

  postMethodForNetConf(url, data) {
    return this.http.post(RadiusConstants.ADOPT_API_GATEWAY_NETCONF_CUSTOMER + url, data);
  }
  postMethodInventory(url, data) {
    return this.http.post(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  notidicationpostMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_NOTIFICATION_BASE_URL + url, data);
  }

  deleteMethod(url) {
    return this.http.delete(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  updateMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
  }

  updateRadiusMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_RADIUS_BASE_URL + url, data);
  }
  updateNetConf(url, data) {
    return this.http.put(RadiusConstants.ADOPT_API_GATEWAY_NETCONF_CUSTOMER + url, data);
  }

  updateInventoryMethod(url, data) {
    return this.http.put(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url, data);
  }

  PostSubMethod(url, data) {
    return this.http.post(RadiusConstants.ADOPT_SUBSCRIBER_BASE_URL + url, data);
  }

  paymentData(url) {
    return this.http.get(RadiusConstants.ADOPT_SUBSCRIBER_BASE_URL + url);
  }

  getCutomerTicketData(url) {
    return this.http.get(RadiusConstants.ADOPT_SUBSCRIBER_BASE_URL + url);
  }

  getCustQuotaList(custid: any) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + "/customer/custQuota/" + custid);
  }
  getRetunItemList(custid: any) {
    return this.http.get(
      RadiusConstants.ADOPT_COMMON_BASE_URL + "/getReturnforCustomer?id=" + custid
    );
  }

  getPaytmLink(custid) {
    return this.http.post(`${this.baseUrl}/generatePaytmLinkAndSend?custId=` + custid, "");
  }

  // https://bss.5net.in:30080/AdoptRadius/findAcctCdrByUserName?mvnoId=1&page=1&size=5&userName=surya123&framedIpAddress=&fromDate=&toDate=

  getAcctCdrDataByUsername(userName, framedIpAddress, fromDate, toDate, page, size) {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(
      `${this.baseradiusUrl}/findAcctCdrByUserName?mvnoId=${this.mvnoId}&page=${page}&size=${size}&userName=` +
        encodeURIComponent(userName) +
        "&framedIpAddress=" +
        encodeURIComponent(framedIpAddress) +
        "&fromDate=" +
        fromDate +
        "&toDate=" +
        toDate
    );
  }

  getAcctCdrDataByUsernameAndcustId(
    userName,
    framedIpAddress,
    custId,
    fromDate,
    toDate,
    page,
    size,
    mvnoId
  ) {
    this.mvnoId = mvnoId ? mvnoId : localStorage.getItem("mvnoId");
    let reqbody = {
      page: page,
      size: size,
      fromDate: fromDate,
      toDate: toDate,
      userName: userName,
      framedIpAddress: framedIpAddress,
      nasIpAddress: "",
      classAttribute: "",
      acctStatusType: "",
      nasIdentifier: "",
      framedRoute: "",
      nasPortType: "",
      nasPortId: "",
      acctMultiSessionId: "",
      framedIpv6Address: "",
      acctSessionId: "",
      custId: custId
    };
    return this.http.post(
      `${this.baseradiusUrl}/findAcctCdrByUserName?mvnoId=${this.mvnoId}`,
      reqbody
    );
  }
  getAllCDRsForExport() {
    this.mvnoId = localStorage.getItem("mvnoId");
    return this.http.get(`${this.baseradiusUrl}/getAllCDRSForExport?mvnoId=${this.mvnoId}`);
  }

  exportExcel(data: any) {
    this.mvnoId = localStorage.getItem("mvnoId");
    if (data.username && data.framedIpAddress == null) {
      return this.http.get(
        `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&userName=radiustest` +
          data.username
      );
    } else if (data.username == null && data.framedIpAddress) {
      return this.http.get(
        `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&framedId=` + data.framedIpAddress
      );
    } else {
      return this.http.get(
        `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&framedId=` +
          data.framedIpAddress +
          `&userName=` +
          data.username
      );
    }
  }
  AllAcctCdrData(page, size) {
    return this.http.get(
      `${this.baseradiusUrl}/acctCdrs?mvnoId=${this.mvnoId}&page=${page}&size=${size}`
    );
  }

  getAllCDRExport(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    const url =
      `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&userName=` +
      data.userName +
      "&fromDate" +
      data.fromDate +
      "&toDate" +
      data.toDate;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
      })
    );
  }

  getAllCDRExportWithCustId(data) {
    this.mvnoId = localStorage.getItem("mvnoId");
    const url =
      `${this.baseradiusUrl}/exportExcel?mvnoId=${this.mvnoId}&page=${data.page}&size=${data.size}&userName=` +
      data.userName +
      "&custId=" +
      encodeURIComponent(data.custId) +
      "&fromDate" +
      data.fromDate +
      "&toDate" +
      data.toDate;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
      })
    );
  }
  downloadPDFInvoice(type: any): any {
    const url = RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], { type: "application/pdf" });
      })
    );
  }

  generateMethodInvoice(url) {
    return this.http.get(RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + url);
  }

  getofferPriceWithTax(planId: any, discount, planGroupId: any = "") {
    let plangroup = "";
    if (planGroupId !== "planGroupId") {
      plangroup = "&planGroupId=" + planGroupId;
    }
    return this.http.get(
      `${this.billingEngineUrl}/getOfferPriceWithTax/plan?planIds=` +
        planId +
        "&discount=" +
        discount +
        plangroup
    );
  }

  downloadInvoice(type: any): any {
    const url = RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + `${type}`;
    return this.http.get(url, { responseType: "blob" }).pipe(
      map((res: any) => {
        return new Blob([res], { type: "application/pdf" });
      })
    );
  }

  postMethodPasssHeader(url, data) {
    const headers = { rf: "bss" };
    return this.http.post(`${this.baseUrl}` + url, data, {
      headers
    });
  }

  getProtalMethod(url) {
    return this.http.get(this.protalUrl + url);
  }
  adoptRadius(url) {
    return this.http.get(this.baseradiusUrl + url);
  }

  getPlansByTypeServiceModeStatusAndServiceArea(
    url,
    type,
    serviceId,
    serviceAreaId,
    mode,
    status,
    planGroup,
    validty,
    unitV
  ) {
    if (status == null) status = "ACTIVE";
    return this.http.get(
      `${RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL}${url}?serviceAreaId=${serviceAreaId}&serviceId=${serviceId}&type=${type}&mode=${mode}&status=${status}&planGroup=${planGroup}&unitsOfValidity=${unitV}&validity=${validty}`
    );
  }

  getPlansByTypeServiceModeStatusAndServiceAreaWithoutService(
    url,
    type,
    serviceId,
    serviceAreaId,
    mode,
    status,
    planGroup
  ) {
    if (status == null) status = "ACTIVE";
    return this.http.get(
      `${RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL}${url}?serviceAreaId=${serviceAreaId}&serviceId=${serviceId}&type=${type}&mode=${mode}&status=${status}&planGroup=${planGroup}`
    );
  }
  getCustNetworkLocDetail(url) {
    return this.http.get(RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL + url);
  }
  getActivePlanList(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }
  getPaymentHistory(url) {
    return this.http.get(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url);
  }
  searchLocation(searchLocationname: string) {
    return this.http.get(this.baseUrl + `/getPlaceId?query=${searchLocationname}`);
  }

  addNewReceipt(data) {
    return this.http.post(`${RadiusConstants.ADOPT_COMMON_BASE_URL}/staff/Reciept`, data);
  }
  getStaffReceiptDataByStaffId(id) {
    return this.http.get(`${RadiusConstants.ADOPT_COMMON_BASE_URL}/staffReceipt/` + id);
  }

  getCustQuotaListFromRadius(custid: any) {
    return this.http.get(RadiusConstants.ADOPT_RADIUS_BASE_URL + "/customer/custQuota/" + custid);
  }

  resetQuota(custid: any, cprid: any) {
    return this.http.get(
      RadiusConstants.ADOPT_RADIUS_BASE_URL +
        "/updateCustQuotaDetails?custId=" +
        custid +
        "&cprId=" +
        cprid
    );
  }

  getDownloadMethod(url) {
    return this.http
      .get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, { responseType: "blob" })
      .pipe(
        map((res: any) => {
          return new Blob([res], { type: "application/pdf" });
        })
      );
  }
  getDownloadServiceArea(url) {
    return this.http
      .get(RadiusConstants.ADOPT_API_GATEWAY_COMMON_MANAGEMENT + url, { responseType: "blob" })
      .pipe(
        map((res: any) => {
          return new Blob([res], { type: "application/pdf" });
        })
      );
  }

  postMethodForCustNotes(url, data, mvnoid, staffid) {
    return this.http.post(RadiusConstants.ADOPT_COMMON_BASE_URL + url, data, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        mvnoid: mvnoid,
        staffid: staffid
      })
    });
  }

  getMethodForCustomerNotes(url) {
    return this.http.get(RadiusConstants.ADOPT_COMMON_BASE_URL + url);
  }

  getCustomerChangePlanDueAmount(url, data) {
    return this.http.post(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url, data);
  }
}
