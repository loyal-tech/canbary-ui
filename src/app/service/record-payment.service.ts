import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as RadiusConstants from 'src/app/RadiusUtils/RadiusConstants';

@Injectable({
    providedIn: 'root'
})
export class RecordPaymentService {

    constructor(private http: HttpClient) { }

    getMethod(url) {
        return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
    }

    postMethod(url, data) {
        return this.http.post(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
    }

    postMethodForRevenue(url, data) {
        return this.http.post(RadiusConstants.ADOPT_PAYMENT_RECEIPT_BASE_URL + url, data);
    }
    postMethodForIntegration(url, data) {
        return this.http.post(RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL + url, data);
    }
    deleteMethod(url) {
        return this.http.delete(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
    }

    updateMethod(url, data) {
        return this.http.put(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url, data);
    }

    getAllInvoiceByCustomer(url) {
        return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
    }
    getDataTOExport(obj) {
        return this.http.post(
            `${RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL}/onlinePayAudit/exportTransactionsToCSV`, obj
        );
    }
}
