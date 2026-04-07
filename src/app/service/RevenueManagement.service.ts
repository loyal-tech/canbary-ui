import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class RevenueManagementService {
    baseUrl = RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL;
    baseradiusUrl = RadiusConstants.ADOPT_RADIUS_BASE_URL;
    billingEngineUrl = RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL;
    protalUrl = RadiusConstants.ADOPT_SUBSCRIBER_BASE_URL;
    notificationUrl = RadiusConstants.ADOPT_NOTIFICATION_BASE_URL;
    loggedInUser = localStorage.getItem("loggedInUser");
    mvnoId = localStorage.getItem("mvnoId");
    constructor(private http: HttpClient) { }

    getMethod(url) {
        return this.http.get(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url);
    }

    postMethod(url, data) {
        return this.http.post(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url, data);
    }

    deleteMethod(url) {
        return this.http.delete(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url);
    }

    updateMethod(url, data) {
        return this.http.put(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url, data);
    }
    downloadPDF(type: any): any {
        const url = RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + `${type}`;
        return this.http.get(url, { responseType: "blob" }).pipe(
            map((res: any) => {
                return new Blob([res], { type: "application/pdf" });
            })
        );
    }
    generateMethod(url) {
        return this.http.get(RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + url);
    }
    getAllInvoiceByCustomer(url) {
        return this.http.get(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url);
    }

    postMethodPasssHeader(url, data) {
        const headers = { rf: "bss" };
        return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data, {
            headers
        });
    }

    postMethodPasssHeader1(url, data) {
        const headers = { rf: "bss" };
        return this.http.post(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url, data, {
            headers
        });
    }

    downloadPDFInvoice(type: any): any {
        const url = RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + `${type}`;
        return this.http.get(url, { responseType: "blob" }).pipe(
            map((res: any) => {
                return new Blob([res], { type: "application/pdf" });
            })
        );
    }

    paymentData(url) {
        return this.http.get(RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + url);
    }

    downloadInvoice(type: any): any {
        const url = RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + `${type}`;
        return this.http.get(url, { responseType: "blob" }).pipe(
            map((res: any) => {
                return new Blob([res], { type: "application/pdf" });
            })
        );
    }

    getInvoiceDataById(id) {
        return this.http.get(`${this.baseUrl}/partnerInvoiceDetails/` + id);
    }

    postMethodWithData(url) {
        return this.http.post(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url, null);
    }

    getIspPayload(url) {
        return this.http.get(RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL + url);
    }
}
