import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { LoginService } from "./login.service";
import { catchError, finalize, map } from "rxjs/operators";
import { Router } from "@angular/router";
const TOKEN_HEADER_KEY = "Authorization";
import * as CryptoJS from "crypto-js";
import { RADIUS_CONSTANTS } from "../constants/aclConstants";
import { SECRETKEY } from "../RadiusUtils/RadiusConstants";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  COUNT: number = 0;
  secretKey = SECRETKEY;
  constructor(
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinner.show();
    req ? this.COUNT++ : "";
    let newRequest = req;
    let token = this.loginService.getToken();
    if (token != null) {
      if (this.loginService.isTokenExpired(token)) {
        this.handleTokenExpiration();
        return;
      }
      const headers = new HttpHeaders({
        "Access-Control-Allow-Origin": `*`
      });
      if (
        req.urlWithParams.includes(
          "http://137.184.153.97:40080/AdoptBillingEngine/postpaidbillingprocess"
        ) ||
        req.urlWithParams.includes(
          "http://137.184.153.97:40080/AdoptBillingEngine/trialbillingprocess"
        )
      ) {
        newRequest = req.clone();
      } else {
        token = this.loginService.getToken();
        const payload = req.body ? JSON.stringify(req.body) : "";
        const currentMilliseconds = Date.now();
        let hash = "";
        // console.log("calll 1 req.urlWithParams :::::::::: ",req.urlWithParams);
        // Compute HMAC SHA256 hash
        if (payload != "" && payload != "{}") {
          const queryString = req.urlWithParams.split("?")[1] || "";
          const plusAsSpace = queryString.replace(/\+/g, " ");
          const decodedQueryPart = decodeURIComponent(plusAsSpace);
          const combinedData = payload + decodedQueryPart.trim() + currentMilliseconds;
          const secretKeyUtf8 = CryptoJS.enc.Utf8.parse(this.secretKey);
          const wordArray = CryptoJS.HmacSHA256(combinedData, secretKeyUtf8);
          hash = CryptoJS.enc.Base64.stringify(wordArray);
        } else if (req.body instanceof FormData) {
          let formDataString = "";
          const queryString = req.urlWithParams.split("?")[1];
          const queryPart = queryString ? queryString.trim() : "";
          req.body.forEach((value: any, key: string) => {
            if (value instanceof File) return; // skip file
            const encodedValue = typeof value === "object" ? JSON.stringify(value) : value;
            formDataString += `${key}=${encodedValue}&`;
          });
          formDataString = formDataString.slice(0, -1); // remove trailing '&'
          const combinedData = formDataString + queryPart + currentMilliseconds;
          const secretKeyUtf8 = CryptoJS.enc.Utf8.parse(this.secretKey);
          const wordArray = CryptoJS.HmacSHA256(combinedData, secretKeyUtf8);
          hash = CryptoJS.enc.Base64.stringify(wordArray);
        } else if (req.urlWithParams.includes("?")) {
          const queryString = req.urlWithParams.split("?")[1];
          const combinedData = queryString.trim() + currentMilliseconds;
          const secretKeyUtf8 = CryptoJS.enc.Utf8.parse(this.secretKey);
          const wordArray = CryptoJS.HmacSHA256(combinedData, secretKeyUtf8);
          hash = CryptoJS.enc.Base64.stringify(wordArray);
        } else {
          const urlParts = req.urlWithParams.split("/");
          const idFromUrl = urlParts[urlParts.length - 1];
          if (idFromUrl) {
            const secretKeyUtf8 = CryptoJS.enc.Utf8.parse(this.secretKey);
            const wordArray = CryptoJS.HmacSHA256(idFromUrl + currentMilliseconds, secretKeyUtf8);
            hash = CryptoJS.enc.Base64.stringify(wordArray);
          } else {
            console.warn("❗ Could not extract ID from URL for hashing");
          }
        }
        let header = {
          Authorization: `${token}`,
          requestFrom: `gui`,
          "X-HMAC-SIGNATURE": hash,
          "X-REQUEST-MILLISEC": currentMilliseconds.toString()
        };
        Object.assign(header, localStorage.getItem("partnerId") === "1" ? {} : { rf: "pw" });
        newRequest = req.clone({
          setHeaders: header
        });
      }
    } else {
      token = this.loginService.getToken();
      const payload = req.body ? JSON.stringify(req.body) : "";
      const currentMilliseconds = Date.now();
      let hash = "";
      //   console.log("calll 1");
      // Compute HMAC SHA256 hash

      if (payload != "") {
        const queryString = req.urlWithParams.split("?")[1];
        const queryPart = queryString ? queryString : "";
        const combinedData = payload + queryPart + currentMilliseconds;
        const secretKeyUtf8 = CryptoJS.enc.Utf8.parse(this.secretKey);
        const wordArray = CryptoJS.HmacSHA256(combinedData, secretKeyUtf8);
        hash = CryptoJS.enc.Base64.stringify(wordArray);
      } else if (req.urlWithParams.includes("?")) {
        const queryString = req.urlWithParams.split("?")[1];
        const combinedData = queryString.trim() + currentMilliseconds;
        const secretKeyUtf8 = CryptoJS.enc.Utf8.parse(this.secretKey);
        const wordArray = CryptoJS.HmacSHA256(combinedData, secretKeyUtf8);
        hash = CryptoJS.enc.Base64.stringify(wordArray);
      } else {
        const urlParts = req.urlWithParams.split("/");
        const idFromUrl = urlParts[urlParts.length - 1];

        if (idFromUrl) {
          const secretKeyUtf8 = CryptoJS.enc.Utf8.parse(this.secretKey);
          const wordArray = CryptoJS.HmacSHA256(idFromUrl + currentMilliseconds, secretKeyUtf8);
          hash = CryptoJS.enc.Base64.stringify(wordArray);
        } else {
          console.warn("❗ Could not extract ID from URL for hashing");
        }
      }
      let header = {
        requestFrom: `gui`,
        "X-HMAC-SIGNATURE": hash,
        "X-REQUEST-MILLISEC": currentMilliseconds.toString()
      };
      newRequest = req.clone({
        setHeaders: header
      });
    }
    return next.handle(newRequest).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const responseBody = JSON.stringify(event.body || {});
          const serverHash = event.headers.get("X-RESPONSE-HMAC");
          const currentMillis = event.headers.get("X-currentMillis");
          if (serverHash) {
            const calculatedHash = CryptoJS.enc.Base64.stringify(
              CryptoJS.HmacSHA256(
                responseBody + currentMillis,
                CryptoJS.enc.Utf8.parse(this.secretKey)
              )
            );
            if (serverHash !== calculatedHash) {
              console.error("❌ Response HMAC mismatch");
              throw new Error("Response integrity check failed");
            } else {
            }
          }
        }

        return event;
      }),
      catchError((error: any) => {
        if (error.status === 401) {
          this.handleTokenExpiration();
        }
        return throwError(error);
      }),
      finalize(() => {
        this.COUNT--;

        return this.COUNT == 0 ? this.spinner.hide() : this.spinner.show();
      })
    );
  }

  /**
   * Handles token expiration by clearing storage, redirecting, and reloading the page.
   */
  private handleTokenExpiration(): void {
    this.loginService.logout(); // Clear token from storage
    this.router.navigate(["/login"]).then(() => {
      window.location.reload(); // Refresh after navigation
    });
  }
}
