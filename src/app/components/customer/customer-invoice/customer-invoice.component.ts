import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ConfirmationService, MessageService } from "primeng/api";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { BehaviorSubject, interval, Subscription } from "rxjs";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import * as FileSaver from "file-saver";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import * as uuid from "uuid";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
import { countries } from "../../model/country";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CurrencyConfigService } from "src/app/service/currency-config.service";

@Component({
  selector: "app-customer-invoice",
  templateUrl: "./customer-invoice.component.html",
  styleUrls: ["./customer-invoice.component.scss"]
})
export class CustomerInvoiceComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  customerId: number;
  searchInvoiceMasterFormGroup: FormGroup;
  currentPageinvoiceMasterSlab = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoicePaymentItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageInvoice = 1;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  invoiceMasterListData: any = [];
  customerLedgerDetailData: any;
  invoiceMastertotalRecords: String;
  searchInvoiceData: any;
  isInvoiceSearch = false;
  invoiceID = "";
  custID = 0;
  invoicePaymentData = [];
  invoicePaymenttotalRecords: number;
  totaladjustedAmount = 0;
  invoiceCancelRemarks = null;
  invoiceCancelRemarksType = null;
  ifInvoicePayment = false;
  ispaymentChecked = false;
  allIsChecked = false;
  isSinglepaymentChecked = false;
  allchakedPaymentData = [];
  showdata: any = [];
  planNotes = false;
  currentPageinvoicePaymentList = 1;
  AclClassConstants;
  AclConstants;

  InvoiceDATA = new BehaviorSubject({
    InvoiceDATA: ""
  });
  invoiceId = new BehaviorSubject({
    invoiceId: ""
  });
  isInvoiceDetail = false;
  currency: string;
  Remark: boolean = false;
  displayPaymentDetails: boolean = false;
  generateAccess: boolean = false;
  viewInvoiceAccess: boolean = false;
  invoicePaymentListAccess: boolean = false;
  voidInvoiceAcces: boolean = false;
  reprintInvoiceAccess: boolean = false;
  cancelAndRegenerateAccess: boolean = false;
  displayInvoicePaymentDialog: boolean;
  savedConfig: any;
  invoice: any;
  exitBuy: boolean = true;
  paymentstatusCount = RadiusConstants.TIMER_COUNT;
  paymentConfirmationModal: boolean = false;
  subscription2: Subscription;
  obs1$ = interval(1000);
  transactionStatus: boolean = false;
  customerLedgerData: any = [];
  paymentSucessModel: boolean = false;
  presentAdressDATA: any = [];
  isPaymentGatewayConfigured: boolean = false;
  sendTraInvoiceAccess: boolean = false;
  paymentGateway: any;
  paymentkeyValuePairs: { [key: string]: any } = {};
  presentFullAddress: any;
  isTraEnable: boolean = false;
  mpinModal: boolean = false;
  mpinForm: FormGroup;
  momoPayinvoice: any;
  isMpinFormSubmitted: boolean = false;
  inputMobile: string = "";
  countries: any = countries;
  payMethod: any;
  isWriteOffModel: boolean = false;
  writeOffAmount: any = "";
  writeOffAmountFirst: any = "";
  writeOffInvoice: any;
  writeOffRemark: any = "";
  holdDays: any;
  isGracePeriodModel: boolean;
  gracePeriod: string;
  gracePeriodData: any;
  auditListModal: boolean = false;
  auditListData: any;
  searchkey: string;
  currentPageAuditListSlab = 1;
  auditListitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  auditTotalRecords: any;
  showItemPerPage = 1;
  searchOption: string = "";
  searchInput: string = ""; // New variable for user-entered text

  searchOptions = [
    { label: "Username", value: "username" },
    { label: "Invoice Number", value: "invoicenumber" }
  ];
  searchData: any;
  customerAddressDetails: any;
  displayMpesaOptionsDialog: boolean;
  selectedMpesaOption: string = "";
  invoiceForMpesa: any;

  constructor(
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private revenueManagementService: RevenueManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private invoiceDetailsService: InvoiceDetailsService,
    public invoicePaymentListService: InvoicePaymentListService,
    private confirmationService: ConfirmationService,
    private invoiceMasterService: InvoiceMasterService,
    public loginService: LoginService,
    private recordPaymentService: RecordPaymentService,
    private systemService: SystemconfigService,
    public commondropdownService: CommondropdownService,
    public customerdetailsilsService: CustomerdetailsilsService,
    private currencyConfigService: CurrencyConfigService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.currencyConfigService.clearCache();
    this.generateAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_GENERATE
        : POST_CUST_CONSTANTS.POST_CUST_INVOICES_GENERATE
    );
    this.invoicePaymentListAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_LIST
        : POST_CUST_CONSTANTS.POST_CUST_INVOICES_PAYMENT_LIST
    );
    this.voidInvoiceAcces = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_VOID
        : POST_CUST_CONSTANTS.POST_CUST_INVOICES_VOID
    );
    this.reprintInvoiceAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_REPRINT
        : POST_CUST_CONSTANTS.POST_CUST_INVOICES_REPRINT
    );
    this.cancelAndRegenerateAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_CANCEL_REGENERATE
        : POST_CUST_CONSTANTS.POST_CUST_INVOICES_CANCEL_REGENERATE
    );
    this.viewInvoiceAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_VIEW
        : POST_CUST_CONSTANTS.POST_CUST_INVOICES_VIEW
    );
    this.sendTraInvoiceAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_SEND_TRA_INVOICE
        : POST_CUST_CONSTANTS.POST_CUST_INVOICES_VIEW
    );
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    // this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.searchInvoiceMasterFormGroup = this.fb.group({
      billfromdate: [""],
      billrunid: [""],
      billtodate: [""],
      custMobile: [""],
      custname: [""],
      docnumber: [""],
      customerid: [""]
    });

    this.getCustomersDetail(this.customerId);
    this.searchinvoiceMaster(this.customerId, "");

    this.mpinForm = this.fb.group({
      countryCode: [""],
      mobileNumber: ["", [Validators.required]]
    });
    this.checkPaymentGatewayConfiguration();
    this.checkInvoiceIntigration();
    this.searchData = {
      filters: [
        {
          filterColumn: "any",
          filterValue: ""
        }
      ],
      page: "",
      pageSize: "",
      sortOrder: "",
      sortBy: this.customerId,
      filterBy: ""
    };
    this.commondropdownService.mobileNumberLengthSubject$.subscribe(lengthObj => {
      if (lengthObj) {
        this.mpinForm
          .get("mobileNumber")
          ?.setValidators([
            Validators.required,
            Validators.minLength(lengthObj.min),
            Validators.maxLength(lengthObj.max)
          ]);
        this.mpinForm.get("mobileNumber")?.updateValueAndValidity();
      }
    });
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerLedgerDetailData = response.customers;
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.customerLedgerDetailData?.mvnoId
          : localStorage.getItem("mvnoId");
      this.commondropdownService.getsystemconfigList(mvnoId);

      //Address
      if (this.customerLedgerDetailData.addressList.length > 0) {
        if (this.customerLedgerDetailData.addressList[0].addressType) {
          this.presentFullAddress = this.customerLedgerDetailData.addressList[0].fullAddress;
          let areaurl = "/area/" + this.customerLedgerDetailData.addressList[0].areaId;

          this.customerdetailsilsService.commonGetMethod(areaurl).subscribe((response: any) => {
            this.presentAdressDATA = response.data;
          });
        }
      }
      this.customerLedgerDetailData?.currency
        ? (this.currency = this.customerLedgerDetailData?.currency)
        : this.systemService
            .getConfigurationByName("CURRENCY_FOR_PAYMENT", mvnoId)
            .subscribe((res: any) => {
              this.currency = res.data.value;
            });
    });
  }

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  searchInvoices() {
    this.currentPageinvoiceMasterSlab = 1;
    this.searchinvoiceMaster("", "");
  }

  searchinvoiceMaster(id, size) {
    let page_list;
    if (size) {
      page_list = size;
      this.invoiceMasteritemsPerPage = size;
    } else {
      // if (this.showItemPerPageInvoice == 1) {
      this.invoiceMasteritemsPerPage = this.pageITEM;
      // } else {
      //     this.invoiceMasteritemsPerPage = this.showItemPerPageInvoice;
      // }
    }

    let url;
    const dtoData = {
      page: this.currentPageinvoiceMasterSlab,
      pageSize: this.invoiceMasteritemsPerPage
    };

    this.searchInvoiceMasterFormGroup.value.custMobile = "";
    this.searchInvoiceMasterFormGroup.value.customerid = this.customerId;

    url =
      "/invoice/search?billrunid=" +
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
        this.spinner.hide();
        const invoiceMasterListData = response.invoicesearchlist.filter(
          invoice => invoice.custType == this.custType
        );
        this.invoiceMasterListData = invoiceMasterListData;
        this.invoiceMastertotalRecords = response.pageDetails.totalRecords;
        // this.invoiceMasterListData = response.invoicesearchlist;

        this.isInvoiceSearch = true;
        // console.log("this.searchPaymentData", this.invoiceMasterListData);
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
    // this.searchInvoiceMasterFormGroup.controls.staffid.setValue("");
    this.invoiceMasterListData = [];
    this.searchinvoiceMaster("", "");
  }

  openInvoiceModal(invoice) {
   this.invoiceID = invoice.id;
   this.custID = invoice.custid;
   this.isInvoiceDetail = true;
  }
  closeInvoiceDetails() {
    this.isInvoiceDetail = false;
    this.invoiceID = "";
    this.custID = 0;
  }

  openInvoicePaymentModal(id, invoiceId) {
    this.invoicePaymentListService.show(id);
    this.invoiceId.next({
      invoiceId
    });
  }

  downloadPDFINvoice(docNo, customerName) {
    if (docNo) {
      const downloadUrl = "/invoicePdf/download/" + docNo;
      this.customerManagementService.downloadPDFInvoice(downloadUrl).subscribe(
        (response: any) => {
          const file = new Blob([response], { type: "application/pdf" });
          // var fileURL = URL.createObjectURL(file,customerName + docNo);
          // FileSaver.saveAs(file);
          const fileURL = URL.createObjectURL(file);
          FileSaver.saveAs(file, customerName + docNo);
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

  generatePDFInvoice(custId) {
    if (custId) {
      const url = "/generatePdfByInvoiceId/" + custId;
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
          //     severity: "info",
          //     summary: "Info",
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

  invoicePaymentList(invoice) {
    this.invoiceID = invoice.id;

    this.invoicePaymentData = [];
    if (invoice.adjustedAmount >= invoice.totalamount) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Total payment is already adjusted",
        icon: "far fa-times-circle"
      });
    } else {
      this.displayPaymentDetails = true;
      const url = "/paymentmapping/" + this.invoiceID;
      this.revenueManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.invoicePaymentData = response.Paymentlist;
          this.invoicePaymenttotalRecords = this.invoicePaymentData.length;

          this.invoicePaymentData.forEach((value, index) => {
            this.invoicePaymentData[index].isSinglepaymentChecked = false;
            this.totaladjustedAmount =
              this.totaladjustedAmount + this.invoicePaymentData[index].adjustedAmount;
          });
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

  invoiceRemarks(invoice, type) {
    this.invoiceID = invoice.id;
    this.invoiceCancelRemarksType = type;
    this.Remark = true;
  }

  addInvoiceRemarks() {
    if (this.invoiceCancelRemarksType === "void") {
      this.voidInvoice();
    } else if (this.invoiceCancelRemarksType === "cancelRegenerate") {
      this.cancelRegenrateInvoice();
    }
  }

  voidInvoice(): void {
    // if (invoice) {
    this.confirmationService.confirm({
      message: "Do you wish to VOID this invoice?",
      header: "VOID Invoice Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        const url = `/voidInvoice?invoiceId=${this.invoiceID}&invoiceCancelRemarks=${this.invoiceCancelRemarks}`;
        this.revenueManagementService.getMethod(url).subscribe(
          (response: any) => {
            // this.closebutton.nativeElement.click();
            this.ifInvoicePayment = false;
            this.ispaymentChecked = false;
            this.allIsChecked = false;
            this.isSinglepaymentChecked = false;
            this.invoiceCancelRemarks = null;
            this.invoiceCancelRemarksType = null;
            this.invoicePaymentData = [];
            this.allchakedPaymentData = [];
            this.searchinvoiceMaster("", "");
            this.Remark = false;
            if (response.responseCode == 417) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
            }
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
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
      }
    });
    // }
  }

  cancelRegenrateInvoice() {
    const data = {};

    const url =
      "/cancelAndRegenerate/" +
      this.invoiceID +
      "?isCaf=false&invoiceCancelRemarks=" +
      this.invoiceCancelRemarks;
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        // this.closebutton.nativeElement.click();
        this.ifInvoicePayment = false;
        this.ispaymentChecked = false;
        this.allIsChecked = false;
        this.isSinglepaymentChecked = false;
        this.invoiceCancelRemarks = null;
        this.invoiceCancelRemarksType = null;
        this.invoicePaymentData = [];
        this.allchakedPaymentData = [];
        this.searchinvoiceMaster("", "");
        this.Remark = false;

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Information",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
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

  InvoiceReprint(docnumber, custname) {
    const url = "/regeneratepdfsub/" + docnumber;
    this.invoiceMasterService.downloadPDF(url).subscribe(
      (response: any) => {
        const file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        FileSaver.saveAs(file, custname);

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

  viewInvoice(docnumber, custname) {
    const url = "/regeneratepdfsub/" + docnumber;
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

  displayNote(type) {
    if (type === "invoice") {
      this.planNotes = false;
      this.showdata = this.invoiceMasterListData.filter(
        invoice => invoice.billrunstatus === "Cancelled" || invoice.billrunstatus === "VOID"
      );
    }
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

  closeInvoiceCancelremark() {
    this.invoiceCancelRemarks = "";
    this.Remark = false;
  }

  checkInvoicePaymentAll(event) {
    if (event.checked == true) {
      this.allchakedPaymentData = [];
      const checkedData = this.invoicePaymentData;
      for (let i = 0; i < checkedData.length; i++) {
        this.allchakedPaymentData.push({
          id: this.invoicePaymentData[i].id,
          amount: this.invoicePaymentData[i].amount
        });
      }
      this.allchakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.id) {
            element.isSinglepaymentChecked = true;
          }
        });
      });
      this.ispaymentChecked = true;
      // console.log(this.allchakedPaymentData);
    }
    if (event.checked == false) {
      const checkedData = this.invoicePaymentData;
      this.allchakedPaymentData.forEach((value, index) => {
        checkedData.forEach(element => {
          if (element.id == value.id) {
            element.isSinglepaymentChecked = false;
          }
        });
      });
      this.allchakedPaymentData = [];
      // console.log(this.allchakedPaymentData);
      this.ispaymentChecked = false;
      this.allIsChecked = false;
    }
  }

  addInvoicePaymentChecked(id, event) {
    if (event.checked) {
      this.invoicePaymentData.forEach((value, i) => {
        if (value.id == id) {
          this.allchakedPaymentData.push({
            id: value.id,
            amount: value.amount
          });
        }
      });

      if (this.invoicePaymentData.length === this.allchakedPaymentData.length) {
        this.ispaymentChecked = true;
        this.allIsChecked = true;
      }
      // console.log(this.allchakedPaymentData);
    } else {
      const checkedData = this.invoicePaymentData;
      checkedData.forEach(element => {
        if (element.id == id) {
          element.isSinglepaymentChecked = false;
        }
      });
      this.allchakedPaymentData.forEach((value, index) => {
        if (value.id == id) {
          this.allchakedPaymentData.splice(index, 1);
          // console.log(this.allchakedPaymentData);
        }
      });

      if (
        this.allchakedPaymentData.length == 0 ||
        this.allchakedPaymentData.length !== this.invoicePaymentData.length
      ) {
        this.ispaymentChecked = false;
      }
    }
  }

  pageChangedInvoicePaymentList(pageNumber) {
    this.currentPageinvoicePaymentList = pageNumber;
  }

  invoicePaymentAdjsment() {
    const data = {
      invoiceId: this.invoiceID,
      creditDocumentList: this.allchakedPaymentData
    };

    const url = "/invoicePaymentAdjust";
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        // this.closebutton.nativeElement.click();
        this.ifInvoicePayment = false;
        this.ispaymentChecked = false;
        this.allIsChecked = false;
        this.isSinglepaymentChecked = false;
        this.invoicePaymentData = [];
        this.allchakedPaymentData = [];
        this.searchinvoiceMaster(this.customerLedgerDetailData.id, "");

        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });

        this.displayPaymentDetails = false;
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

  invoicePaymentCloseModal() {
    this.ifInvoicePayment = false;
    this.ispaymentChecked = false;
    this.allIsChecked = false;
    this.isSinglepaymentChecked = false;
    this.invoicePaymentData = [];
    this.allchakedPaymentData = [];

    this.displayPaymentDetails = false;
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
      } else if (this.savedConfig[0].paymentConfigName === "SELCOM") {
        this.spinner.show();
        this.selcomPayPlan(invoice);
      } else if (this.savedConfig[0].paymentConfigName === "Wave Pay") {
        this.spinner.show();
        this.buyWaveMoneyPayPlan(invoice);
      } else if (this.savedConfig[0].paymentConfigName == "ONEPAY") {
        this.spinner.show();
        this.buyOnePayInvoicePayment(invoice);
      } else if (this.savedConfig[0].paymentConfigName == "TRANSACTEASE") {
        this.spinner.show();
        this.getCustomerAddressDetails(invoice);
      } else if (this.savedConfig[0].paymentConfigName == "MPESA") {
        this.displayMpesaOptionsDialog = true;
        this.invoiceForMpesa = invoice;
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

  onKeymobilelength(event) {
    const str = this.mpinForm.value.mobileNumber.toString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (mobilenumberlength === 0 || mobilenumberlength === null) {
      mobilenumberlength = 10;
    }
    if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobile = `${mobilenumberlength} character required.`;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobile = "";
    } else {
      this.inputMobile = `${mobilenumberlength} character required.`;
    }
  }

  mobileError: boolean = false;

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

  showMpinModal() {
    this.displayInvoicePaymentDialog = false;
    this.mpinModal = true;
    // this.momoPayinvoice = invoice;
    this.mpinForm.controls.countryCode.setValue(this.customerLedgerDetailData.countryCode);
    this.mpinForm.controls.mobileNumber.setValue(this.customerLedgerDetailData.mobile);
    // this.mpinForm.controls.mobileNumber.reset();
  }

  hideMpinModal() {
    this.isMpinFormSubmitted = false;
    this.mpinForm.reset();
    this.mpinForm.controls.countryCode.setValue("");
    this.mpinForm.controls.mobileNumber.setValue("");
    // this.mpinForm.updateValueAndValidity();
    this.mpinModal = false;
    this.mobileError = false;
    this.inputMobile = "";
  }

  keypressId(event: any) {
    const pattern = /^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  invoicePayment(savedConfig: any) {
    this.invoicePaymentpaymentGateway(savedConfig);
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
      this.showMpinModal();
      //   this.buyOnePayInvoicePayment(this.invoice);
    } else if (this.payMethod == "TRANSACTEASE") {
      this.getCustomerAddressDetails();
    } else {
      this.showMpinModal();
    }
  }
  buyOnePayInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerLedgerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      isAdvancePayment: true,
      //   isBuyPlan: true,
      merchantName: "ONEPAY",
      customerUserName: this.customerLedgerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerLedgerDetailData.mvnoId,
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      payerMobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      partnerId: this.customerLedgerDetailData.partnerid,
      accountNumber: this.customerLedgerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerLedgerDetailData.buId
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

  invoicePaymentGateway() {
    if (this.payMethod === "MoMo Pay") {
      this.spinner.show();
      this.buyMomoInvoicePayment(this.invoice);
    } else if (this.payMethod === "AIRTEL") {
      this.spinner.show();
      this.airtelPayPlan(this.invoice);
    } else if (this.payMethod === "SELCOM") {
      this.spinner.show();
      this.selcomPayPlan(this.invoice);
    } else if (this.payMethod === "MPESA") {
      this.displayMpesaOptionsDialog = true;
      this.invoiceForMpesa = this.invoice;
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

  buyMomoInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerLedgerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      merchantName: "MoMo Pay",
      customerUserName: this.customerLedgerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerLedgerDetailData.mvnoId,
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      invoiceId: invoice.id,
      partnerId: this.customerLedgerDetailData.partnerid,
      accountNumber: this.customerLedgerDetailData?.acctno ?? ""
    };
    this.customerdetailsilsService.buyPlanUsingMomoInvoice(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        (localStorage.setItem("transactionId", response.data.data.orderId),
          (this.paymentConfirmationModal = true));
        this.isMpinFormSubmitted = false;
        this.mobileError = false;
        this.inputMobile = "";
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
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
    this.customerdetailsilsService.getIntigrationTransactionstatusInvoice(data).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          if (response.data.istransactionsuccess === "true") {
            this.transactionStatus = response.istransactionsuccess;
            let data = {
              userName: this.customerLedgerData.username,
              password: this.customerLedgerData.password
            };
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
  hidepaymentConfirmDialog() {
    this.paymentConfirmationModal = false;
    this.displayInvoicePaymentDialog = false;
  }

  hidepaymentSucessDialog() {
    this.paymentSucessModel = false;
  }

  airtelPayPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerLedgerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      merchantName: "AIRTEL",
      customerUserName: this.customerLedgerDetailData.username,
      mvnoId: this.customerLedgerDetailData.mvnoId,
      mobileNumber: this.mpinForm.value.mobileNumber ?? "",
      invoiceId: invoice.id,
      partnerId: this.customerLedgerDetailData.partnerid,
      accountNumber: this.customerLedgerDetailData?.acctno ?? ""
    };
    this.customerdetailsilsService.buyPlanUsingAirtelInvoice(data).subscribe(
      (response: any) => {
        this.spinner.hide();
        this.isMpinFormSubmitted = false;
        this.mpinForm.reset();
        this.mpinForm.controls.countryCode.setValue("");
        this.mpinForm.controls.mobileNumber.setValue("");
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
          (this.exitBuy = false));

        this.paymentConfirmationModal = true;
        this.mobileError = false;
        this.inputMobile = "";
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
      buid: this.customerLedgerDetailData.buId,
      custServiceMappingId: this.customerLedgerDetailData.planMappingList[0].custServiceMappingId,
      customerId: this.customerLedgerDetailData.id,
      customerUUID: uuid.v4(),
      customerUserName: this.customerLedgerDetailData.username,
      invoiceId: invoice.id,
      isBuyPlan: true,
      isFromCaptive: true,
      merchantName: "SELCOM",
      mobileNumber:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      mvnoId: this.customerLedgerDetailData.mvnoId,
      orderId: null,
      partnerId: this.customerLedgerDetailData.partnerid,
      partnerPaymentId: this.customerLedgerDetailData.partnerPaymentId ?? null,
      planId: this.customerLedgerDetailData.planMappingList[0].planId,
      requestFor: this.customerLedgerDetailData.requestFor ?? null,
      status: this.customerLedgerDetailData.status
    };

    let selcomPayPayment = {
      vendor: "",
      order_id: null,
      buyer_email: this.customerLedgerDetailData.email,
      buyer_name: this.customerLedgerDetailData.username,
      buyer_phone:
        this.mpinForm.value.countryCode.replace("+", "") + (this.mpinForm.value.mobileNumber ?? ""),
      gateway_buyer_uuid: "",
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      currency: "",
      payment_methods: "",
      "billing.firstname": this.customerLedgerDetailData.firstname ?? "",
      "billing.lastname": this.customerLedgerDetailData.lastname ?? "",
      "billing.address_1": this.customerLedgerDetailData?.addressList[0]?.landmark ?? "",
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
        this.inputMobile = "";
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
  checkInvoiceIntigration() {
    this.customerdetailsilsService
      .checkInvoiceIntigration("Invoice Creation")
      .subscribe((response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        if (response.status === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.ERROR,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.status === 200) {
          if (this.isClientPresent(response.thirdPartyIntegrationMenuData, "TRA Integration")) {
            this.isTraEnable = true;
          }
        }
        this.spinner.hide();
      });
  }

  isClientPresent(data, clientName: string): boolean {
    return data.some(item => item.clientName === clientName);
  }

  sendInvoiceTraIntigration(invoice) {
    this.customerdetailsilsService
      .sendTraInvoiceIntigration(invoice.id)
      .subscribe((response: any) => {
        this.spinner.hide();
        //localStorage.setItem("transactionId"),
        if (response.status === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.ERROR,
            icon: "far fa-times-circle"
          });
          return;
        } else if (response.status === 200) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.message,
            icon: "far fa-info-circle"
          });
          this.spinner.show();
          setTimeout(() => {
            this.clearSearchinvoiceMaster();
          }, 3000);
        } else if (response.status === 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.message,
            icon: "far fa-info-circle"
          });
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.ERROR,
            icon: "far fa-info-circle"
          });
        }
        this.spinner.hide();
      });
  }

  openPaymentGateways(invoice) {
    const url = "/generatePaymentLink/" + invoice.custid;
    this.customerManagementService.postMethod(url, null).subscribe(
      (response: any) => {
        let payData = response.data;
        if (response.data == null) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Unpaid Invoice Found for this Customer",
            icon: "far fa-times-circle"
          });
        } else {
          window.open(`${window.location.origin}/#/customer/payMethod/${payData}`);
          //   this.router.navigate(["/customer/payMethod/" + payData]);
        }
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
  sendemailinvoice(docNo) {
    if (docNo) {
      const downloadUrl = "/invoice/send/" + docNo;
      this.customerdetailsilsService.getmethodforrevenue(downloadUrl).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
          });
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
  }
  keypress(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  openWriteOff(invoice) {
    this.isWriteOffModel = true;
    this.writeOffAmountFirst = invoice?.totalamount - invoice?.adjustedAmount;
    this.writeOffAmount = +(invoice?.totalamount - invoice?.adjustedAmount).toFixed(2);
    this.writeOffAmountFirst = this.writeOffAmount;
    this.writeOffInvoice = invoice;
    this.writeOffRemark = "";
  }
  closeWriteOff() {
    this.isWriteOffModel = false;
    this.writeOffAmountFirst = "";
    this.writeOffAmount = "";
    this.writeOffInvoice = "";
    this.writeOffRemark = "";
  }
  confirmWriteOff() {
    if (this.writeOffAmount) {
      this.spinner.show();
      const url = "/writeOffByDebitDocId";
      let obj = {
        debitDocId: this.writeOffInvoice.id,
        writeOffAmount: this.writeOffAmount,
        remarks: this.writeOffRemark
      };
      this.customerdetailsilsService.postRevenueMethod(url, obj).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
          });
          this.closeWriteOff();
          this.invoiceMasterListData = [];
          this.searchinvoiceMaster("", "");
        },
        (error: any) => {
          this.spinner.hide();
          this.closeWriteOff();
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
  checkWriteOff() {
    if (this.writeOffAmountFirst === this.writeOffAmount) {
      this.confirmWriteOff();
    } else {
      this.confirmationService.confirm({
        message:
          "The provided amount is insufficient to clear the ledger balance.<br>Do you want to continue?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.confirmWriteOff();
        },
        reject: () => {}
      });
    }
  }
  buyWaveMoneyPayPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerLedgerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      isAdvancePayment: true,
      isBuyPlan: true,
      merchantName: "Wave Pay",
      customerUserName: this.customerLedgerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerLedgerDetailData.mvnoId,
      custServiceMappingId: this.customerLedgerDetailData.planMappingList[0].custServiceMappingId,
      mobileNumber:
        this.customerLedgerDetailData.countryCode.replace("+", "") +
        (this.customerLedgerDetailData.mobile ?? ""),
      partnerId: this.customerLedgerDetailData.partnerid,
      accountNumber: this.customerLedgerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerLedgerDetailData.buId,
      planId: null
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
  openGracePeriod(invoice) {
    this.isGracePeriodModel = true;
    this.gracePeriod = invoice.debitDocGraceDays;
    this.gracePeriodData = invoice;
  }
  closeGracePeriod() {
    this.isGracePeriodModel = false;
    this.gracePeriodData = "";
    this.gracePeriod = "";
  }
  saveGracePeriod() {
    if (this.gracePeriod) {
      this.spinner.show();
      let gracedata = {
        debitDocId: this.gracePeriodData.id,
        debitDocGraceDays: Number(this.gracePeriod)
      };
      const url = "/duedaywithgracdays";
      this.customerdetailsilsService.postRevenueMethod(url, gracedata).subscribe(
        (response: any) => {
          this.spinner.hide();
          if (response.responseCode === 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.responseMessage,
              icon: "far fa-check-circle"
            });
            this.closeGracePeriod();
            this.gracePeriodData = [];
            this.searchinvoiceMaster("", "");
          }
        },
        (error: any) => {
          this.spinner.hide();
          this.closeGracePeriod();
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
  validateHoldDays(event: any) {
    const value = parseInt(event.target.value, 10);
    if (value < 1) {
      event.target.value = 1;
      this.holdDays = 1;
    } else if (value > 31) {
      event.target.value = 31;
      this.holdDays = 31;
    }
  }
  buyKbzInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerLedgerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      isFromCaptive: false,
      isAdvancePayment: true,
      //   isBuyPlan: true,
      merchantName: "KBZPAY",
      customerUserName: this.customerLedgerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerLedgerDetailData.mvnoId,
      mobileNumber:
        this.customerLedgerDetailData.countryCode.replace("+", "") +
        (this.customerLedgerDetailData.mobile ?? ""),
      invoiceId: invoice.id,
      partnerId: this.customerLedgerDetailData.partnerid,
      accountNumber: this.customerLedgerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerLedgerDetailData.buId
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
  getAuditData(size) {
    let page = this.currentPageAuditListSlab;
    let page_list;
    if (size) {
      page_list = size;
      this.auditListitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.auditListitemsPerPage = 5;
      } else {
        this.auditListitemsPerPage = 5;
      }
    }
    this.auditListData = [];
    let data = {
      page: page,
      pageSize: this.auditListitemsPerPage,
      sortBy: "id",
      sortOrder: 0
    };
    const url = "/auditLog/getAuditList/" + this.customerId;
    this.revenueManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.auditListData = response.dataList;
        this.auditTotalRecords = response.totalRecords;
        this.auditListModal = true;
        //this.auditList = response.dataList;
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
  closeAuditListData() {
    this.auditListModal = false;
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageAuditListSlab > 1) {
      this.currentPageAuditListSlab = 1;
    }
    if (!this.searchkey) {
      this.getAuditData(this.showItemPerPage);
    } else {
      this.searchAudit();
    }
  }
  pageChangedList(pageNumber) {
    this.currentPageAuditListSlab = pageNumber;
    if (this.searchkey) {
      this.searchAudit();
    } else {
      this.getAuditData("");
    }
  }
  searchAudit() {
    if (this.searchOption && this.searchInput) {
      this.searchData.filters[0].filterColumn = this.searchOption;
      this.searchData.filters[0].filterValue = this.searchInput;
    } else {
      this.searchData.filters[0].filterColumn = "any";
      this.searchData.filters[0].filterValue = "";
    }
    this.searchData.page = this.currentPageAuditListSlab || 1;
    this.searchData.pageSize = this.auditListitemsPerPage || 10;
    this.searchData.sortBy = "entityRefId";
    this.searchData.sortOrder = 1;
    this.searchData.status = "";
    this.searchData.filterBy = "";
    const url = `/auditLog/getSearchAudit/${this.customerId}`;
    this.revenueManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response?.auditListData?.length === 0) {
          this.auditListModal = true;
          this.auditListData = [];
          this.auditTotalRecords = 0;
        } else {
          this.auditListData = response.dataList;
          this.auditTotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.auditListData = [];
        this.auditTotalRecords = 0;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.ERROR || "Something went wrong.",
          icon: "far fa-times-circle"
        });
      }
    );
  }
  clearAuditSearch() {
    this.searchOption = "";
    this.searchInput = "";
    this.searchData = {
      filters: [
        {
          filterColumn: "any",
          filterValue: ""
        }
      ],
      page: "",
      pageSize: "",
      sortOrder: "",
      sortBy: "entityRefId",
      filterBy: "",
      status: ""
    };
    this.getAuditData("");
  }
  buyTransacteasePayment(invoice) {
    const newTab = window.open("", "_blank");
    // this.getCustomerAddressDetails(this.customerId)
    this.spinner.show();
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    let data = {
      customerId: this.customerLedgerDetailData.id,
      amount: (invoice.totalamount - invoice.adjustedAmount).toString(),
      //   amount: (this.amountsData + (this.amountsData * this.commissionPer) / 100).toString(),
      //   commission: (invoice.totalamount * this.commissionPer) / 100,
      billAddressLine1: this.customerAddressDetails?.landmark,
      billAddressLine2: this.customerAddressDetails?.landmark,
      billToAddressCity: this.customerAddressDetails?.cityName,
      billToAddressState: this.customerAddressDetails?.stateName,
      billToAddressZip: this.customerAddressDetails?.pincode,
      custServiceMappingId: this.customerLedgerDetailData.planMappingList[0].custServiceMappingId,
      email: this.customerLedgerDetailData?.email,
      isBuyPlan: true,
      isFromCaptive: true,
      actualAmount: invoice.totalamount.toString(),
      isAdvancePayment: true,
      merchantName: "TRANSACTEASE",
      customerUserName: this.customerLedgerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerLedgerDetailData.mvnoId,
      mobileNumber:
        this.customerLedgerDetailData.countryCode.replace("+", "") +
        (this.customerLedgerDetailData.mobile ?? ""),
      payerMobileNumber:
        this.customerLedgerDetailData.countryCode.replace("+", "") +
        (this.customerLedgerDetailData.mobile ?? ""),
      partnerId: this.customerLedgerDetailData.partnerid,
      accountNumber: this.customerLedgerDetailData?.acctno ?? "",
      hash: "",
      buid: this.customerLedgerDetailData.buId
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
  getCustomerAddressDetails(invoice?: any) {
    try {
      this.customerdetailsilsService
        .getCustomerAddressDetails(this.customerLedgerDetailData.id)
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
  // Add method to close MPESA options dialog
  closeMpesaOptionsDialog() {
    this.displayMpesaOptionsDialog = false;
  }

  buyMpesaInvoicePayment(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerLedgerDetailData.id,
      amount: (invoice?.totalamount - invoice?.adjustedAmount).toString(),
      isFromCaptive: false,
      customerUserName: this.customerLedgerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerLedgerDetailData.mvnoId,
      mobileNumber:
        this.customerLedgerDetailData.countryCode.replace("+", "") +
        (this.customerLedgerDetailData.mobile ?? ""),
      invoiceId: invoice.id,
      partnerId: this.customerLedgerDetailData.partnerid,
      accountNumber: this.customerLedgerDetailData?.acctno ?? "",
      custServiceMappingId: this.customerLedgerDetailData.planMappingList[0].custServiceMappingId,
      buid: this.customerLedgerDetailData?.buId,
      orderId: "",
      planId: this.customerLedgerDetailData.planMappingList[0].planId
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
  buyMpesaExpressPlan(invoice) {
    this.exitBuy = true;
    this.isMpinFormSubmitted = true;
    this.mpinModal = false;
    this.paymentstatusCount = RadiusConstants.TIMER_COUNT;
    let data = {
      customerId: this.customerLedgerDetailData.id,
      amount: (invoice?.totalamount - invoice?.adjustedAmount).toString(),
      isFromCaptive: true,
      customerUserName: this.customerLedgerDetailData.username,
      customerUUID: uuid.v4(),
      mvnoId: this.customerLedgerDetailData.mvnoId,
      mobileNumber:
        this.customerLedgerDetailData.countryCode.replace("+", "") +
        (this.customerLedgerDetailData.mobile ?? ""),
      payerMobileNumber:
        this.customerLedgerDetailData.countryCode.replace("+", "") +
        (this.customerLedgerDetailData.mobile ?? ""),
      merchantName: null,
      invoiceId: invoice.id,
      partnerId: this.customerLedgerDetailData.partnerid,
      accountNumber: this.customerLedgerDetailData?.acctno ?? "",
      custServiceMappingId: this.customerLedgerDetailData.planMappingList[0].custServiceMappingId,
      buid: this.customerLedgerDetailData?.buId,
      orderId: "",
      planId: this.customerLedgerDetailData.planMappingList[0].planId,
      hash: null,
      isAdvancePayment: false,
      isBuyPlan: true,
      partnerPaymentId: this.customerLedgerDetailData.partnerid,
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
  onSearchOptionChange() {
   this.searchInput = null;
}
}
