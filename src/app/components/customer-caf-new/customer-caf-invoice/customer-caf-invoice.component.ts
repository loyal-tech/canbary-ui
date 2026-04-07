import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { InvoicePaymentDetailsModalComponent } from "../../invoice-payment-details-modal/invoice-payment-details-modal.component";
import { BehaviorSubject } from "rxjs";
import * as FileSaver from "file-saver";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
import * as uuid from "uuid";
import { countries } from "../../model/country";
import { CommondropdownService } from "src/app/service/commondropdown.service";

@Component({
  selector: "app-customer-caf-invoice",
  templateUrl: "./customer-caf-invoice.component.html",
  styleUrls: ["./customer-caf-invoice.component.css"]
})
export class CustomerCafInvoiceComponent implements OnInit {
  customerId = 0;
  custType: string = "";
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerNotesList: any = [];
  totalRecords: number;
  customerDetailData: any;
  staffData: any = [];
  staffDetailModal: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  searchInvoiceMasterFormGroup: FormGroup;
  invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceMastertotalRecords: String;
  searchInvoiceData: any;
  invoiceMasterListData: any = [];
  showItemPerPageInvoice = 1;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  currentPageinvoiceMasterSlab = 1;
  isInvoiceSearch = false;
  @ViewChild(InvoicePaymentDetailsModalComponent)
  invoicePaymentDetailModal: InvoicePaymentDetailsModalComponent;
  invoiceId = new BehaviorSubject({
    invoiceId: ""
  });
  isInvoiceDetail = false;
  invoiceID = "";
  generatePdfAccess: boolean = false;
  reprintAccess: boolean = false;
  viewInvoiceAccess: boolean = false;
  displayInvoicePaymentDialog: boolean;
  savedConfig: any;
  exitBuy: boolean = true;
  isMpinFormSubmitted: boolean = false;
  mpinModal: boolean = false;
  paymentConfirmationModal: boolean = false;
  mobileError: boolean = false;
  mpinForm: FormGroup;
  inputMobileNumber: string = "";
  invoice: any;
  paymentstatusCount = RadiusConstants.TIMER_COUNT;
  presentAdressDATA: any = [];
  inputMobile = "";
  displayMpesaOptionsDialog: boolean;
  invoiceForMpesa: any;
  customerAddressDetails: any;
  payMethod: string;
  momoPayinvoice: any;
  isPaymentGatewayConfigured: boolean = false;
  paymentkeyValuePairs: { [key: string]: any } = {};
  paymentGateway: any;
  countries: any = countries;
  selectedMpesaOption: string = "";
  invoicesPaymentAccess: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private fb: FormBuilder,
    private revenueManagementService: RevenueManagementService,
    public loginService: LoginService,
    private invoiceMasterService: InvoiceMasterService,
    private spinner: NgxSpinnerService,
    public customerdetailsilsService: CustomerdetailsilsService,
    public commondropdownService: CommondropdownService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.generatePdfAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_INVOICES_GENERATE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_INVOICES_GENERATE
    );
    this.reprintAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_INVOICES_REPRINT
        : POST_CUST_CONSTANTS.POST_CUST_CAF_INVOICES_REPRINT
    );
    this.viewInvoiceAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_INVOICES_VIEW
        : POST_CUST_CONSTANTS.POST_CUST_CAF_INVOICES_VIEW
    );
    this.invoicesPaymentAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_INVOICES_PAYMENT
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
  }

  ngOnInit() {
    this.searchInvoiceMasterFormGroup = this.fb.group({
      billfromdate: [""],
      billrunid: [""],
      billtodate: [""],
      custMobile: ["", Validators.minLength(3)],
      custname: [""],
      docnumber: [""],
      customerid: [""]
    });
    this.mpinForm = this.fb.group({
      countryCode: [""],
      mobileNumber: ["", [Validators.required, Validators.maxLength(10)]]
    });

    this.getCustomersDetail(this.customerId);
    this.checkPaymentGatewayConfiguration();
  }
  customerDetailOpen() {
    this.router.navigate([
      "/home/customer-caf-new/details/" + this.custType + "/x/" + this.customerId
    ]);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerDetailData = response.customers;
      this.searchinvoiceMaster("", "");
    });
  }

  searchinvoiceMaster(id, size) {
    let page_list;
    if (size) {
      page_list = size;
      this.invoiceMasteritemsPerPage = size;
    } else {
      if (this.showItemPerPageInvoice == 1) {
        this.invoiceMasteritemsPerPage = this.pageITEM;
      } else {
        this.invoiceMasteritemsPerPage = this.showItemPerPageInvoice;
      }
    }

    let dtoData = {
      page: this.currentPageinvoiceMasterSlab,
      pageSize: this.invoiceMasteritemsPerPage
    };
    let url;

    // if (id) {
    //   this.searchInvoiceMasterFormGroup.value.billrunid = id
    //   this.searchInvoiceMasterFormGroup.patchValue({
    //     billrunid: Number(id),
    //   })
    // }

    this.searchInvoiceMasterFormGroup.value.custMobile = "";
    this.searchInvoiceMasterFormGroup.value.customerid = this.customerDetailData.id;

    url =
      "/trial/invoice/search?billrunid=" +
      this.searchInvoiceMasterFormGroup.value.billrunid +
      "&docnumber=" +
      this.searchInvoiceMasterFormGroup.value.docnumber.trim() +
      "&customerid=" +
      this.searchInvoiceMasterFormGroup.value.customerid +
      "&billfromdate=" +
      this.searchInvoiceMasterFormGroup.value.billfromdate +
      "&billtodate=" +
      this.searchInvoiceMasterFormGroup.value.billtodate +
      "&custmobile=" +
      this.searchInvoiceMasterFormGroup.value.custMobile.trim() +
      "&isInvoiceVoid=true";
    this.revenueManagementService.postMethod(url, dtoData).subscribe(
      (response: any) => {
        const invoiceMasterListData = response.invoicesearchlist;
        // .filter(
        //   invoice => invoice.custType == "Prepaid"
        // );
        this.invoiceMasterListData = response.invoicesearchlist;

        this.invoiceMastertotalRecords = response.pageDetails.totalRecords;
        // this.invoiceMasterListData = response.invoicesearchlist;

        this.isInvoiceSearch = true;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  clearSearchinvoiceMaster() {
    this.isInvoiceSearch = false;
    this.searchInvoiceMasterFormGroup.reset();
    this.searchInvoiceMasterFormGroup.controls.billrunid.setValue("");
    this.searchInvoiceMasterFormGroup.controls.docnumber.setValue("");
    this.searchInvoiceMasterFormGroup.controls.custname.setValue("");
    this.searchInvoiceMasterFormGroup.controls.billfromdate.setValue("");
    this.searchInvoiceMasterFormGroup.controls.billtodate.setValue("");
    this.searchInvoiceMasterFormGroup.controls.customerid.setValue("");
    this.invoiceMasterListData = [];
    this.currentPageinvoiceMasterSlab = 1;
    this.invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    this.showItemPerPageInvoice = 1;
    this.searchinvoiceMaster("", "");
  }
  openInvoiceModal(invoice) {
    this.isInvoiceDetail = true;
    this.invoiceID = invoice.id;
    this.customerId = invoice.custid;
  }
  closeInvoiceDetails() {
    this.isInvoiceDetail = false;
    this.invoiceID = "";
    this.customerId = 0;
  }

  downloadPDFINvoice(docNo, customerName) {
    if (docNo) {
      const downloadUrl = "/trialinvoicePdf/download/" + docNo;
      this.customerManagementService.downloadPDFInvoice(downloadUrl).subscribe(
        (response: any) => {
          const file = new Blob([response], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          FileSaver.saveAs(file, customerName + docNo);
        },
        (error: any) => {
          // console.log(error, "error");
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }
  generatePDFInvoice(custId) {
    if (custId) {
      const url = "/generateTrialPdfByInvoiceId/" + custId;
      this.customerManagementService.generateMethodInvoice(url).subscribe(
        (response: any) => {
          if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            // this.searchInvoiceData("", "");
            this.searchinvoiceMaster("", "");
          } else {
            response.responseCode == 417;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          }
          //   this.messageService.add({
          //     severity: "success",
          //     summary: "Success",
          //     detail: response.responseMessage,
          //     icon: "far fa-times-circle"
          //   });
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  viewInvoice(docnumber, custname) {
    const url = "/regeneratePdfForTrail/" + docnumber;
    this.invoiceMasterService.downloadPDF(url).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, "_blank");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  openPaymentGatewaysforInvoicePayment(invoice: any) {
    this.displayInvoicePaymentDialog = false;
    if (this.savedConfig.length === 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Payment Gateway Configuration Not Found!!!",
        icon: "far fa-times-circle"
      });
    } else if (this.savedConfig.length === 1) {
      if (this.savedConfig[0].paymentConfigName === "MoMo Pay") {
        this.spinner.show();
        this.buyMomoInvoicePayment(invoice);
      } else if (this.savedConfig[0].paymentConfigName === "AIRTEL") {
        this.spinner.show();
        this.airtelPayPlan(invoice);
      } else if (this.savedConfig[0].paymentConfigName === "MPESA") {
        this.displayMpesaOptionsDialog = true;
        this.invoiceForMpesa = invoice;
      } else if (this.savedConfig[0].paymentConfigName === "SELCOM") {
        this.spinner.show();
        this.selcomPayPlan(invoice);
      } else if (this.savedConfig[0].paymentConfigName === "Wave Pay") {
        this.spinner.show();
        this.buyWaveMoneyPayPlan(invoice);
      } else if (this.savedConfig[0].paymentConfigName == "ONEPAY") {
        this.spinner.show();
        this.buyOnePayInvoicePayment(this.invoice);
      } else if (this.savedConfig[0].paymentConfigName == "TRANSACTEASE") {
        this.spinner.show();
        this.getCustomerAddressDetails(this.invoice);
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Invoice payment is not available for this gateway.",
          icon: "far fa-times-circle"
        });
      }
    } else if (this.savedConfig.length >= 1) {
      this.invoice = invoice;
      this.displayInvoicePaymentDialog = true;
    }
  }

  buyMomoInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      merchantName: "MoMo Pay",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      planId: null,
      hash: null
    };
    this.customerdetailsilsService.buyPlanUsingMomoInvoice(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        (localStorage.setItem("transactionId", response.data.data.orderId),
          (this.paymentConfirmationModal = true));
        this.isMpinFormSubmitted = false;
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.mobileError = false;
        this.inputMobileNumber = "";
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

  airtelPayPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      merchantName: "AIRTEL",
      customerUserName: this.customerDetailData.username,
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber: this.mpinForm.value.mobileNumber ?? "",
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      planId: null,
      hash: null,
      accountNumber: this.customerDetailData?.acctno ?? ""
    };
    this.customerdetailsilsService.buyPlanUsingAirtelInvoice(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.isMpinFormSubmitted = false;
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.mobileError = false;
        this.inputMobileNumber = "";
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
        (localStorage.setItem("transactionId", response.data.data.transaction.id),
          (this.paymentConfirmationModal = true));
        this.exitBuy = false;

        // this.subscription2 = this.obs1$.subscribe(d => {
        //     if (this.paymentstatusCount > 0) {
        //         this.paymentstatusCount = this.paymentstatusCount - 1;
        //         this.getStatusSuccessByMomo("SUCCESSFUL");
        //         if (this.transactionStatus === true) {
        //             this.subscription2.unsubscribe();
        //         }
        //     }
        //     if (this.paymentstatusCount == 0) {
        //         this.subscription2.unsubscribe();
        //     }
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
  selcomPayPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let customerPaymentDTO = {
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      buid: this.customerDetailData.buId,
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      customerId: this.customerDetailData.id,
      customerUUID: uuid.v4(),
      customerUserName: this.customerDetailData.username,
      invoiceId: invoice.id,
      isBuyPlan: true,
      isFromCaptive: true,
      merchantName: "SELCOM",
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      mvnoId: this.customerDetailData.mvnoId,
      orderId: null,
      partnerId: this.customerDetailData.partnerid,
      partnerPaymentId: this.customerDetailData.partnerPaymentId ?? null,
      planId: this.customerDetailData.planMappingList[0].planId,
      requestFor: this.customerDetailData.requestFor ?? null,
      status: this.customerDetailData.status
    };
    let selcomPayPayment = {
      vendor: "",
      order_id: null,
      buyer_email: this.customerDetailData.email,
      buyer_name: this.customerDetailData.username,
      buyer_phone:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      gateway_buyer_uuid: "",
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      currency: "",
      payment_methods: "",
      "billing.firstname": this.customerDetailData.firstname ?? "",
      "billing.lastname": this.customerDetailData.lastname ?? "",
      "billing.address_1": this.customerDetailData?.addressList[0]?.landmark ?? "",
      "billing.city": this.presentAdressDATA.cityName ?? "",
      "billing.state_or_region": this.presentAdressDATA.stateName ?? "",
      "billing.country": this.presentAdressDATA.countryName ?? "",
      "billing.phone":
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      no_of_items: 1,
      webhook: ""
    };
    let data = {
      customerPaymentDTO: customerPaymentDTO,
      selcomPayPayment: selcomPayPayment
    };
    this.customerdetailsilsService.buyPlanUsingSelcom(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.isMpinFormSubmitted = false;
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.mobileError = false;
        this.inputMobileNumber = "";
        //localStorage.setItem("transactionId"),
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.responseCode === 200 && response.data && response.data.data) {
          const paymentLink = response.data.data;
          window.open(paymentLink, "_blank");
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
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

  buyWaveMoneyPayPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      isAdvancePayment: true,
      isBuyPlan: true,
      merchantName: "Wave Pay",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerDetailData.buId,
      //   planId: this.customerDetailData.planMappingList[0].planId
      planId: null //as per keval suggested
    };
    this.customerdetailsilsService.buyPlanUsingWaveMoney(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        // localStorage.setItem("transactionId", response.data.data.orderId),
        this.paymentConfirmationModal = true;
        this.isMpinFormSubmitted = false;
        this.mobileError = false;
        this.inputMobile = "";
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.exitBuy = false;
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.responseCode === 200 && response.data) {
          const paymentLink = response.data;
          window.open(paymentLink, "_blank");
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
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

  buyOnePayInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      isAdvancePayment: true,
      //   isBuyPlan: true,
      merchantName: "ONEPAY",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      payerMobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerDetailData.buId
    };
    this.customerdetailsilsService.buyPlanUsingOnePay(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        // localStorage.setItem("transactionId", response.data.data.orderId),
        this.paymentConfirmationModal = true;
        this.isMpinFormSubmitted = false;
        this.mobileError = false;
        this.inputMobile = "";
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.exitBuy = false;
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.responseCode === 200 && response.data) {
          const paymentLink = response.data;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.data.message,
            icon: "far fa-times-circle"
          });
          //   window.open(paymentLink, "_blank");
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
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

  getCustomerAddressDetails(invoice?: any) {
    try {
      this.customerdetailsilsService
        .getCustomerAddressDetails(this.customerDetailData.id)
        .subscribe(
          (result: any) => {
            this.customerAddressDetails =
              result.dataList && result.dataList?.length > 0 ? result.dataList[0] : [];
            this.buyTransacteasePayment(this.invoice);
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
    } catch (error) {
      console.error("ERror in api", error);
    }
  }
  buyTransacteasePayment(invoice) {
    const newTab = window.open("", "_blank");
    // this.getCustomerAddressDetails(this.customerDetailData.id);
    this.spinner.show();
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      //   amount: (this.amountsData + (this.amountsData * this.commissionPer) / 100).toString(),
      //   commission: (invoice.totalamount * this.commissionPer) / 100,
      billAddressLine1: this.customerAddressDetails?.landmark,
      billAddressLine2: this.customerAddressDetails?.landmark,
      billToAddressCity: this.customerAddressDetails?.cityName,
      billToAddressState: this.customerAddressDetails?.stateName,
      billToAddressZip: this.customerAddressDetails?.pincode,
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      email: this.customerDetailData?.email,
      isBuyPlan: true,
      isFromCaptive: true,
      actualAmount: invoice.totalamount.toString(),
      isAdvancePayment: true,
      merchantName: "TRANSACTEASE",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      payerMobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerDetailData.buId
    };
    this.customerdetailsilsService.buyPlanUsingTransactease(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.paymentConfirmationModal = true;
        this.isMpinFormSubmitted = false;
        this.mobileError = false;
        this.inputMobile = "";
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.exitBuy = false;
        if (response) {
          //   let paymentUrl = response.data;
          //   window.open(paymentUrl, "_blank");
          //   //   this.messageService.add({
          //   //     severity: "info",
          //   //     summary: "KBZPay Not Supported on Web",
          //   //     detail: "Please open the payment link on your mobile device using the KBZPay app.",
          //   //     icon: "pi pi-info-circle"
          //   //   });
          //   this.messageService.add({
          //     severity: "success",
          //     summary: "Successfully",
          //     detail: response.data.message,
          //     icon: "far fa-times-circle"
          //   });
          const htmlString = response;
          if (typeof htmlString === "string" && htmlString.trim().startsWith("<!DOCTYPE html")) {
            if (newTab) {
              newTab.document.open();
              newTab.document.write(htmlString);
              newTab.document.close();
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Popup Blocked",
                detail: "Please allow popups for this site."
              });
            }
          }
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
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

  pageChangedinvoiceMasterList(pageNumber) {
    this.currentPageinvoiceMasterSlab = pageNumber;
    this.searchinvoiceMaster("", "");
  }

  TotalItemPerPageInvoice(event) {
    this.showItemPerPageInvoice = Number(event.value);
    if (this.currentPageinvoiceMasterSlab > 1) {
      this.currentPageinvoiceMasterSlab = 1;
    }
    this.searchinvoiceMaster("", this.showItemPerPageInvoice);
  }

  invoicePaymentpaymentGateway(selectedConfig: any) {
    this.payMethod = selectedConfig.paymentConfigName;
    if (this.payMethod === "Wave Pay") {
      this.spinner.show();
      this.buyWaveMoneyPayPlan(this.invoice);
    } else if (this.payMethod === "KBZPAY") {
      this.spinner.show();
      this.buyKbzInvoicePayment(this.invoice);
    } else if (this.payMethod == "ONEPAY") {
      this.spinner.show();
      //   this.buyOnePayInvoicePayment(this.invoice);
      this.showMpinModal(this.invoice);
    } else if (this.payMethod == "TRANSACTEASE") {
      this.spinner.show();
      this.getCustomerAddressDetails();
    } else {
      this.showMpinModal(this.invoice);
    }
  }

  buyKbzInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      isAdvancePayment: true,
      //   isBuyPlan: true,
      merchantName: "KBZPAY",
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerDetailData.buId
    };

    this.customerdetailsilsService.buyPlanUsingKbz(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.paymentConfirmationModal = false;
        this.isMpinFormSubmitted = false;
        this.mobileError = false;
        this.inputMobile = "";
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
        this.exitBuy = false;
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.responseCode === 200 && response.data) {
          const paymentLink = response.data;
          this.messageService.add({
            severity: "info",
            summary: "KBZPay Not Supported on Web",
            detail: "Please open the payment link on your mobile device using the KBZPay app.",
            icon: "pi pi-info-circle"
          });

          //   const kbzurl = paymentLink.split("?kbzurl=")[1];
          //   this.router.navigate(["/kbz-pay"], {
          //     queryParams: { kbzurl: kbzurl }
          //   });
          //   window.open(paymentLink, "_blank");
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "Unexpected response received.",
            icon: "far fa-info-circle"
          });
        }
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
  showMpinModal(invoice) {
    this.spinner.hide();
    this.displayInvoicePaymentDialog = false;
    this.mpinModal = true;
    this.momoPayinvoice = invoice;
    this.mpinForm.controls.countryCode.setValue(this.customerDetailData.countryCode);
    this.mpinForm.controls.mobileNumber.setValue(this.customerDetailData.mobile);
    // this.mpinForm.controls.mobileNumber.reset();
  }

  checkPaymentGatewayConfiguration() {
    this.spinner.show();
    this.customerdetailsilsService.getActivePaymentConfiguration().subscribe(
      (response: any) => {
        this.savedConfig = [];
        if (response.status == 204) {
          this.isPaymentGatewayConfigured = false;
        } else {
          var activeConfig = response.activePaymentConfig;
          var config = activeConfig.some(config => config.paymentConfigName == this.paymentGateway);
          this.savedConfig = activeConfig;
          const keyValuePairs: { [key: string]: any } = {};
          for (const config of this.savedConfig) {
            for (const mappingItem of config.paymentConfigMappingList) {
              keyValuePairs[mappingItem.paymentParameterName] = mappingItem.paymentParameterValue;
            }
          }
          this.paymentkeyValuePairs = keyValuePairs;
          this.isPaymentGatewayConfigured = config;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
        this.spinner.hide();
      }
    );
  }

  hideMpinModal() {
    this.isMpinFormSubmitted = false;
    this.mpinForm.reset();
    this.mpinForm.controls.countryCode.setValue("");
    this.mpinForm.controls.mobileNumber.setValue("");
    // this.mpinForm.updateValueAndValidity();
    this.mpinModal = false;
    this.mobileError = false;
    this.inputMobileNumber = "";
  }

  onInputMobile(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Check if the input starts with 0
    if (inputValue.startsWith("0")) {
      this.mobileError = true;
    } else {
      this.mobileError = false;
    }
  }
  invoicePaymentGateway() {
    if (this.payMethod === "MoMo Pay") {
      this.spinner.show();
      this.buyMomoInvoicePayment(this.invoice);
    } else if (this.payMethod === "AIRTEL") {
      this.spinner.show();
      this.airtelPayPlan(this.invoice);
    } else if (this.payMethod === "MPESA") {
      this.displayMpesaOptionsDialog = true;
      this.invoiceForMpesa = this.invoice;
    } else if (this.payMethod === "SELCOM") {
      this.spinner.show();
      this.selcomPayPlan(this.invoice);
    } else if (this.payMethod === "ONEPAY") {
      this.spinner.show();
      this.buyOnePayInvoicePayment(this.invoice);
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Invoice payment is not available for this gateway.",
        icon: "far fa-times-circle"
      });
    }
  }
  closeMpesaOptionsDialog() {
    this.displayMpesaOptionsDialog = false;
  }

  handleMpesaPaymentOption(option: string) {
    this.spinner.hide();
    this.displayMpesaOptionsDialog = false;
    if (option === "Mpesa-Express") {
      this.buyMpesaExpressPlan(this.invoiceForMpesa);
    } else if (option === "Mpesa-B2C") {
      this.spinner.show();
      this.buyMpesaInvoicePayment(this.invoiceForMpesa);
    }
  }

  buyMpesaExpressPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice?.totalamount - invoice?.adjustedAmount).toString(),
      isFromCaptive: true,
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      payerMobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      merchantName: null,
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      buid: this.customerDetailData?.buId,
      orderId: "",
      //   planId: this.customerDetailData.planMappingList[0].planId,
      planId: null,
      hash: null,
      isAdvancePayment: false,
      isBuyPlan: true,
      partnerPaymentId: this.customerDetailData.partnerid,
      status: "PENDING"
    };
    this.customerdetailsilsService.buyPlanUsingMpesaExpress(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.responseCode == 200) {
          this.paymentConfirmationModal = true;
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.data.ResponseDescription,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response?.data?.errorMessage,
            icon: "far fa-times-circle"
          });
        }
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
  buyMpesaInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerDetailData.id,
      amount: (invoice?.totalamount - invoice?.adjustedAmount).toString(),
      isFromCaptive: false,
      customerUserName: this.customerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerDetailData.mvnoId,
      mobileNumber:
        this.customerDetailData.countryCode.replace("+", "") +
        (this.customerDetailData.mobile ?? ""),
      invoiceId: invoice.id,
      partnerId: this.customerDetailData.partnerid,
      accountNumber: this.customerDetailData?.acctno ?? "",
      custServiceMappingId: this.customerDetailData.planMappingList[0].custServiceMappingId,
      buid: this.customerDetailData?.buId,
      orderId: "",
      //   planId: this.customerDetailData.planMappingList[0].planId
      planId: null
    };
    this.customerdetailsilsService.buyPlanUsingMpesa(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        if (response.responseCode == 200) {
          this.paymentConfirmationModal = true;
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.data.ResponseDescription,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response?.data?.errorMessage,
            icon: "far fa-times-circle"
          });
        }
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
}
