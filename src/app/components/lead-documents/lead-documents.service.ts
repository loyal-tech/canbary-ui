import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { HttpParams } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs'
import { catchError, last, map, tap } from 'rxjs/operators'
import { ADOPT_COMMON_BASE_URL } from '../../RadiusUtils/RadiusConstants'
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
}

const BASE_API_URL = ADOPT_COMMON_BASE_URL + '/'

const ADOPT_LEAD_BASE_URL  = RadiusConstants.ADOPT_LEAD_BASE_URL+'/';

@Injectable({
  providedIn: 'root',
})
export class LeadDocumentService {
  constructor(private http: HttpClient) {}

  getUrl() {
    return BASE_API_URL
  }

  getMethod(url) {
    return this.http.get(RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL + url);
  }

  downloadFile(docId, leadId): Observable<any> {
    const get_url =
    ADOPT_LEAD_BASE_URL + 'leadDoc/document/download/' + docId + '/' + leadId
    return this.http.get(get_url, {
      responseType: 'blob',
      headers: httpOptions.headers,
    })
  }

  getLeadDocumentByCustId(url: any): Observable<any> {
    const get_url = ADOPT_LEAD_BASE_URL + url;
    return this.http.get<any>(get_url, { headers: httpOptions.headers })
  }

  getLeadDocumentById(Id: any): Observable<any> {
    const get_url = ADOPT_LEAD_BASE_URL + 'leadDoc/findById/' + Id
    return this.http
      .get<any>(get_url, { headers: httpOptions.headers })
      .pipe(
        map((res) => res),
        catchError((error: any) => {
          return throwError(error)
        }),
      )
  }

  getLeadDocumentPDF(): Observable<any> {
    const get_url = BASE_API_URL + 'leadDoc/pdf'
    return this.http
      .get<any>(get_url, { headers: httpOptions.headers })
      .pipe(
        map((res) => res),
        catchError((error: any) => {
          return throwError(error)
        }),
      )
  }

  getLeadDocumentExcel(): Observable<any> {
    const get_url = BASE_API_URL + 'leadDoc/excel'
    return this.http
      .get<any>(get_url, { headers: httpOptions.headers })
      .pipe(
        map((res) => res),
        catchError((error: any) => {
          return throwError(error)
        }),
      )
  }

  insertLeadDocument(data: any): Observable<any> {
    const post_url = ADOPT_LEAD_BASE_URL + 'leadDoc/save'
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res
      }),
      catchError((error: any) => {
        return throwError(error)
      }),
    )
  }

  updateLeadDocument(data: any): Observable<any> {
    const post_url = ADOPT_LEAD_BASE_URL + 'leadDoc/update'
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res
      }),
      catchError((error: any) => {
        return throwError(error)
      }),
    )
  }

  deleteLeadDocument(data: any): Observable<any> {
    const post_url = ADOPT_LEAD_BASE_URL + 'leadDoc/delete/'+data.docId;
    return this.http.delete<any>(post_url).pipe(
      map((res: any) => {
        return res
      }),
      catchError((error: any) => {
        return throwError(error)
      }),
    )
  }

  saveLeadDocument(data: any): Observable<any> {
    const post_url = ADOPT_LEAD_BASE_URL + 'leadDoc/save'
    return this.http.post<any>(post_url, data).pipe(
      map((res: any) => {
        return res
      }),
      catchError((error: any) => {
        return throwError(error)
      }),
    )
  }

  getDocStatusList(): Observable<any> {
    const get_url = BASE_API_URL + 'commonList/generic/docStatus'
    return this.http
      .get<any>(get_url, { headers: httpOptions.headers })
      .pipe(
        map((data) => data),
        catchError((error: any) => {
          return throwError(error)
        }),
      )
  }

  getDocTypeForLeadList(): Observable<any> {
    const get_url = BASE_API_URL + 'subscriber/getDocTypeForCustomer'
    return this.http
      .get<any>(get_url, { headers: httpOptions.headers })
      .pipe(
        map((res: any) => {
          return res
        }),
        catchError((error: any) => {
          return throwError(error)
        }),
      )
  }

  isCustDocPending(leadId: any): Observable<any> {
    const get_url = ADOPT_LEAD_BASE_URL + 'leadDoc/isCustDocPending/' + leadId
    return this.http.get<any>(get_url, { headers: httpOptions.headers })
  }

  approvedCustDoc(docId: any, status: any): Observable<any> {
    const get_url =
    ADOPT_LEAD_BASE_URL + 'leadDoc/approveDoc/' + docId + '/' + status
    return this.http.get<any>(get_url, { headers: httpOptions.headers })
  }

  LeadgetMethod(url) {
    return this.http.get(BASE_API_URL + url)
  }

  DocumentVerify(data) {
    return this.http.post(ADOPT_LEAD_BASE_URL + 'leadDoc/verifyDocument', data)
  }

  saveLeadOnlineDocument(data) {
    return this.http.post(
      ADOPT_LEAD_BASE_URL + 'leadDoc/uploadDocOnline?isUpdate=false ',
      data,
    )
  }
  updateLeadOnlineDocument(data) {
    return this.http.post(
      ADOPT_LEAD_BASE_URL + 'leadDoc/uploadDocOnline?isUpdate=true ',
      data,
    )
  }
}
