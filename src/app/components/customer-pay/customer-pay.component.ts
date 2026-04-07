import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { countries } from "../model/country";
import * as uuid from "uuid";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
import { Subscription, interval } from "rxjs";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-customer-pay",
  templateUrl: "./customer-pay.component.html",
  styleUrls: ["./customer-pay.component.css"]
})
export class CustomerPayComponent implements OnInit {
  customerId: number;
  custType: any;
  bearToken: string;
  paymethd: string;
  userName: string;
  submitted: boolean = false;
  mpinForm: FormGroup;
  countries: any = countries;
  subscription2: Subscription;
  paymentstatusCount = RadiusConstants.TIMER_COUNT;
  transactionStatus: boolean = false;
  obs1$ = interval(1000);
  customerDetailData: any;
  paymentConfirmationModal: boolean = false;
  paymentSucessModel: boolean = false;
  exitBuy: boolean = true;
  hash: string = null;
  //   isRenew: boolean = false;
  errorMessage: string = "";
  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public customerdetailsilsService: CustomerdetailsilsService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.hash = this.route.snapshot.paramMap.get("hash")!;
    this.getPaymentDetailsByHash();
    // this.isRenew = this.route.snapshot.queryParamMap.get("isRenew") === "true";
    this.mpinForm = this.fb.group({
      countryCode: ["+256"],
      amount: ["", Validators.required],
      mobileNumber: ["", [Validators.required]]
    });
  }

  paymentData() {
    this.submitted = true;
    if (this.mpinForm.valid) {
      let mobileNo = this.mpinForm.controls["mobileNumber"].value;
      let url = "/gateway/getGatewayFromPrefix?mobileNumber=" + mobileNo;
      this.customerdetailsilsService.intigrationGetMethod(url).subscribe(
        (response: any) => {
          if (response?.responseCode == 204) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            if (response.data == "MoMo Pay") this.buyMomoInvoicePayment();
            else if (response.data == "AIRTEL") this.airtelPayPlan();
            else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            }
          }
          this.spinner.hide();
        },
        (error: any) => {
          this.spinner.show();
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail:
              "Something went wrong with the payment screen. Please contact your administrator.",
            icon: "far fa-times-circle"
          });
          this.spinner.hide();
        }
      );
    }
  }

  getPaymentDetailsByHash() {
    this.spinner.show();
    if (this.hash == null || this.hash == undefined || this.hash == "") {
      this.errorMessage = "This link is expired! Please regenerate a new link.";
      this.spinner.hide();
      return;
    } else {
      let url = "/open/getPaymentDetailsByHash?hash=" + this.hash;
      this.customerdetailsilsService.getMethodForPay(url).subscribe(
        (response: any) => {
          if (response?.status == 226) {
            this.errorMessage = response.message;
          } else if (response?.status == 204) {
            this.errorMessage = response.message;
          } else {
            this.customerDetailData = response.paymentDetails;
            this.mpinForm.controls["amount"].setValue(this.customerDetailData.amount);
            let token = this.customerDetailData?.token;
            localStorage.setItem("payLinkToken", token);
            this.errorMessage = "";
          }
          this.spinner.hide();
        },
        (error: any) => {
          this.spinner.show();
          this.errorMessage =
            "Something went wrong with the payment screen. Please contact your administrator.";
          this.spinner.hide();
        }
      );
    }
  }

  buyMomoInvoicePayment() {
    this.exitBuy = true;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.custId,
      amount: this.mpinForm.value.amount.toString(),
      isFromCaptive: false,
      merchantName: "MoMo Pay",
      customerUserName: this.customerDetailData.customerUsername,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      partnerId: this.customerDetailData?.partnerid,
      hash: this.hash,
      accountNumber: this.customerDetailData?.accountNumber ?? ""
    };
    this.customerdetailsilsService.buyPlanUsingMomo(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        localStorage.setItem("transactionId", response.data.data.orderId), this.mpinForm.reset();
        this.submitted = false;
        this.paymentConfirmationModal = true;
        this.exitBuy = false;

        // this.subscription2 = this.obs1$.subscribe(d => {
        //   if (this.paymentstatusCount > 0) {
        //     this.paymentstatusCount = this.paymentstatusCount - 1;
        //     this.getStatusSuccessByMomo("SUCCESSFUL");
        //     if (this.transactionStatus === true) {
        //       this.subscription2.unsubscribe();
        //     }
        //   }
        //   if (this.paymentstatusCount == 0) {
        //     this.subscription2.unsubscribe();
        //   }
        // });
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getStatusSuccessByMomo(status) {
    this.spinner.hide();
    let data = {
      orderId: localStorage.getItem("transactionId"),
      status: status
    };
    this.customerdetailsilsService.getIntigrationTransactionstatus(data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (response.data.istransactionsuccess === "true") {
            this.transactionStatus = response.istransactionsuccess;
            // this.getDevice(data);
            this.paymentConfirmationModal = false;
            this.subscription2.unsubscribe();
            this.paymentSucessModel = true;
          }
        }
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  airtelPayPlan() {
    this.exitBuy = true;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.custId,
      amount: this.mpinForm.value.amount.toString(),
      isFromCaptive: false,
      merchantName: "AIRTEL",
      customerUserName: this.customerDetailData.customerUsername,
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber: this.mpinForm.value.mobileNumber ?? "",
      partnerId: this.customerDetailData.partnerid,
      hash: this.hash,
      accountNumber: this.customerDetailData?.accountNumber ?? ""
    };
    this.customerdetailsilsService.buyPlanUsingAirtel(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.mpinForm.reset();
        this.submitted = false;
        this.paymentConfirmationModal = true;
        //localStorage.setItem("transactionId"),
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        }
        localStorage.setItem("transactionId", response.data.data.transaction.id),
          (this.exitBuy = false);

        // this.subscription2 = this.obs1$.subscribe(d => {
        //   if (this.paymentstatusCount > 0) {
        //     this.paymentstatusCount = this.paymentstatusCount - 1;
        //     this.getStatusSuccessByMomo("SUCCESSFUL");
        //     if (this.transactionStatus === true) {
        //       this.subscription2.unsubscribe();
        //     }
        //   }
        //   if (this.paymentstatusCount == 0) {
        //     this.subscription2.unsubscribe();
        //   }
        // });
        this.spinner.hide();
      },
      (error: any) => {
        this.spinner.hide();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  hidepaymentConfirmDialog() {
    this.paymentConfirmationModal = false;
  }

  hidepaymentSucessDialog() {
    this.paymentSucessModel = false;
  }
}
