import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { InvoiceMasterService } from "src/app/service/invoice-master.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
import { ActivatedRoute, Router } from "@angular/router";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { InvoiceDetalisModelComponent } from "../invoice-detalis-model/invoice-detalis-model.component";
import { BehaviorSubject } from "rxjs";

import { CustomerDetailsComponent } from "../common/customer-details/customer-details.component";
import { CustomerDetailsService } from "src/app/service/customer-details.service";
import * as FileSaver from "file-saver";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { InvoicePaymentDetailsModalComponent } from "../invoice-payment-details-modal/invoice-payment-details-modal.component";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { Paginator } from "primeng/paginator";
import { DatePipe } from "@angular/common";
import { SearchPaymentService } from "src/app/service/search-payment.service";
import { StaffService } from "src/app/service/staff.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { INVOICE_SYSTEMS } from "src/app/constants/aclConstants";
declare var $: any;

@Component({
  selector: "app-prepaid-invoice-master",
  templateUrl: "./prepaid-invoice-master.component.html",
  styleUrls: ["./prepaid-invoice-master.component.css"]
})
export class PrepaidInvoiceMasterComponent implements OnInit {
  dialogId: boolean = false;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private Activatedroute: ActivatedRoute,
    private messageService: MessageService,
    private invoiceMasterService: InvoiceMasterService,
    private invoiceDetailsService: InvoiceDetailsService,
    private customerDetailsService: CustomerDetailsService,
    public invoicePaymentListService: InvoicePaymentListService,
    private systemService: SystemconfigService,
    private searchPaymentService: SearchPaymentService,
    private revenueManagementService: RevenueManagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private staffService: StaffService,
    loginService: LoginService
  ) {
    this.partnerId = Number(localStorage.getItem("partnerId"));
    this.downloadAccess = loginService.hasPermission(INVOICE_SYSTEMS.PRE_BILL_INVOICE_DOWNLOAD);
    this.invoiceAccess = loginService.hasPermission(INVOICE_SYSTEMS.PRE_BILL_INVOICE_PAY_LIST);
    this.voidAccess = loginService.hasPermission(INVOICE_SYSTEMS.PRE_BILL_INVOICE_VOID);
    this.reprintAccess = loginService.hasPermission(INVOICE_SYSTEMS.PRE_BILL_INVOICE_REPRINT);
    this.cancelRegenerateAccess = loginService.hasPermission(INVOICE_SYSTEMS.PRE_BILL_INVOICE_CR);
    this.recordPaymentAccess = loginService.hasPermission(
      INVOICE_SYSTEMS.PREPAID_INVOICE_MASTER_RECORD
    );
    this.viewInvoiceAccess = loginService.hasPermission(INVOICE_SYSTEMS.PRE_BILL_INVOICE_VIEW);
    this.mileStoneAccess = loginService.hasPermission(INVOICE_SYSTEMS.PRE_BILL_INVOICE_MILESTONE);
    const url = "/commonList/paymentMode";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.paymentMode = response.dataList;
      },
      (error: any) => {}
    );
  }
  @ViewChild("closebutton") closebutton;
  @ViewChild(InvoiceDetalisModelComponent)
  InvoiceDetailModal: InvoiceDetalisModelComponent;
  @ViewChild("pgn", { static: false }) paginator: Paginator;
  @ViewChild(CustomerDetailsComponent)
  customerDetailModal: CustomerDetailsComponent;
  @ViewChild(InvoicePaymentDetailsModalComponent)
  invoicePaymentDetailModal: InvoicePaymentDetailsModalComponent;
  searchInvoiceMasterFormGroup: FormGroup;
  pipe = new DatePipe("en-US");
  invoiceMasterCategoryList: any;
  invoiceMasterListData: any = [];
  viewinvoiceMasterListData: any = [];
  searchinvoiceMasterUrl: any;
  isInvoiceView: boolean = false;
  downloadAccess: boolean = false;
  viewInvoiceAccess: boolean = false;
  mileStoneAccess: boolean = false;
  voidAccess: boolean = false;
  cancelRegenerateAccess: boolean = false;
  recordPaymentAccess: boolean = false;
  reprintAccess: boolean = false;
  invoiceAccess: boolean = false;
  isInvoiceEdit: boolean = false;
  isInvoiceDelete: boolean = false;
  isDownloadInvoice: boolean = false;
  isCancelInvoice: boolean = false;
  currentPageinvoiceMasterSlab = 1;
  invoiceMasteritemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  invoiceMastertotalRecords = 0;
  isInvoiceDetail = false;
  searchInvoiceData: any;
  isInvoiceSearch = false;
  customerListData: any;
  InvoiceDATA = new BehaviorSubject({
    InvoiceDATA: ""
  });
  custId = new BehaviorSubject({
    custId: ""
  });
  custID: number;
  invoiceId = new BehaviorSubject({
    invoiceId: ""
  });
  pageITEM = RadiusConstants.PER_PAGE_ITEMS;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  totaladjustedAmount = 0;
  parentstaffListdatatotalRecords: any;
  selectedStaffCust: any = [];
  searchDeatil: any = "";
  invoicePaymentData = [];
  invoiceID = "";
  invoicePaymentItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageinvoicePaymentList = 1;
  invoicePaymenttotalRecords: number;
  ifInvoicePayment = false;
  serviceAreaId = "";
  branchName = "";
  partnerName = "";
  searchkey: string;
  searchData: any;
  currentPage = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  staffCustList: any = [];
  staffid: any = "";
  allchakedPaymentData = [];
  ispaymentChecked = false;
  allIsChecked = false;
  isSinglepaymentChecked = false;
  masterSelected: any;
  paymentFormGroup: FormGroup;
  currentPageParentStaffListdata = 1;
  staffData = [];
  paymentMode = [
    { label: "Cash", value: "Cash" },
    { label: "Cheque", value: "Cheque" },
    { label: "Online", value: "Online" },
    { label: "EFTs", value: "EFTs" },
    { label: "Barter", value: "barter" },
    { label: "Direct Deposit", value: "Direct Deposit" },
    { label: "VAT Receiveable", value: "VAT Receiveable" },
    { label: "Non Cash Adjustment", value: "Non Cash Adjustment" },
    { label: "POS Adjustmnet", value: "POS Adjustmnet" },
    { label: "QR", value: "QR" },
    { label: "OPG Adjustment", value: "OPG Adjustment" }
  ];

  invoiceStatusList = [
    { label: "Unpaid (Pending Sent/Pending Accepted)", value: "Unpaid" },
    { label: "Clear", value: "Clear" },
    { label: "Cancelled", value: "Cancelled" },
    { label: "Partialy Pending", value: "Partial Pending" },
    { label: "Partialy Paid", value: "Partialy Paid" },
    { label: "Pending", value: "Pending" }
  ];
  tdsInclude: boolean = false;
  abbsInclude: boolean = false;
  tdsPercent: number;
  abbsPercent: number;
  currency: string;
  checkedList: any = [];
  fileName: any;
  file: any = "";
  submitted = false;
  selectedInvoiceIdList: any = [];
  isRecordPaymentOpen: boolean = false;
  tempInvoiceMasterData: any = [];
  partnerId;
  customerLedgerDetailData: any = {
    title: "",
    firstname: "",
    lastname: "",
    contactperson: "",
    gst: "",
    pan: "",
    aadhar: "",
    passportNo: "",
    cafno: "",
    acctno: "",
    username: "",
    mobile: "",
    phone: "",
    email: "",
    serviceareaid: "",
    servicetype: "",
    custtype: "",
    latitude: "",
    longitude: "",
    didno: "",
    voicesrvtype: "",
    partnerid: "",
    salesremark: "",
    paymentDetails: {
      amount: "",
      referenceno: "",
      paymode: "",
      paymentdate: ""
    },
    addressList: [
      {
        fullAddress: "",
        pincodeId: "",
        areaId: "",
        cityId: "",
        stateId: "",
        countryId: ""
      }
    ]
  };
  attribute: FormArray;
  chequeDateName = "Cheque Date";
  parentStaffListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  ngOnInit(): void {
    let staffID = localStorage.getItem("userId");
    let loggedInUser = localStorage.getItem("loggedInUser");
    this.staffCustList = [
      {
        id: Number(staffID),
        name: loggedInUser
      }
    ];
    let defaultSelectedStatus = ["Unpaid", "Partial Pending"];
    this.searchData = {
      filters: [
        {
          filterDataType: "string",
          filterValue: "string",
          filterColumn: "any",
          filterOperator: "string",
          filterCondition: "string"
        }
      ],
      page: "",
      pageSize: ""
    };
    this.attribute = this.fb.array([]);
    this.searchInvoiceMasterFormGroup = this.fb.group({
      billfromdate: [""],
      // billrunid: [""],
      billtodate: [""],
      custMobile: ["", Validators.minLength(3)],
      custname: [""],
      docnumber: [""],
      customerid: [""],
      serviceAreaId: [""],
      branchName: [""],
      partnerName: [""],
      staffid: [Number(staffID)],
      status: [defaultSelectedStatus]
    });
    this.paymentFormGroup = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      bank: [""],
      branch: [""],
      chequedate: ["", Validators.required],
      chequeno: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      customerid: ["", Validators.required],
      paymode: ["", Validators.required],
      referenceno: [""],
      remark: ["", Validators.required],
      bankManagement: ["", Validators.required],
      destinationBank: ["", Validators.required],
      reciptNo: [""],
      type: ["Payment"],
      paytype: [""],
      tdsAmount: [0],
      abbsAmount: [0],
      invoiceId: ["", Validators.required],
      // invoices: [[], Validators.required],
      onlinesource: [""],
      batchname: [""],
      file: [""],
      filename: [""]
    });
    this.resetPayMode();

    if (this.Activatedroute.snapshot.queryParamMap.get("id")) {
      this.searchinvoiceMaster(this.Activatedroute.snapshot.queryParamMap.get("id"), "");
    }

    this.commondropdownService.getBillRunMasterList();
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getPostpaidplanData();
    this.commondropdownService.getsystemconfigList();

    const serviceArea = localStorage.getItem("serviceArea");

    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
    } else {
      this.commondropdownService.getserviceAreaList();
    }
    // this.commondropdownService.getCustomer();
    // this.getcustomerList();
    this.systemService.getConfigurationByName("TDS").subscribe((res: any) => {
      this.tdsPercent = res.data.value;
    });
    this.systemService.getConfigurationByName("ABBS").subscribe((res: any) => {
      this.abbsPercent = res.data.value;
    });

    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
    this.searchinvoiceMaster("", "");
  }

  getcustomerList() {
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    const custerlist = {
      page: 1,
      pageSize: 10000
    };
    this.invoiceMasterService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        const customerListData = response.customerList.filter(cust => cust.custtype == "Prepaid");
        this.customerListData = customerListData;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  generatePDF(custId) {
    if (custId) {
      const url = "/generatePdfByInvoiceId/" + custId;
      this.invoiceMasterService.generateMethod(url).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
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

  openInvoiceModal(invoice) {
    this.isInvoiceDetail = true;
    this.invoiceID = invoice.id;
    this.custID = invoice.custid;
  }

  closeInvoiceDetails() {
    this.isInvoiceDetail = false;
    this.invoiceID = "";
    this.custID = 0;
  }

  openCustomerModal(id, custId) {
    this.dialogId = true;
    this.custId.next({
      custId: custId
    });
    // this.customerDetailsService.show(id);
    // this.custId.next({
    //   custId,
    // });
  }

  openInvoicePaymentModal(id, invoiceId) {
    this.invoicePaymentListService.show(id);
    this.invoiceId.next({
      invoiceId
    });
  }

  pageChangedinvoiceMasterList(pageNumber) {
    this.tempInvoiceMasterData = [];
    this.currentPageinvoiceMasterSlab = pageNumber;
    this.searchinvoiceMaster("", "");
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageinvoiceMasterSlab > 1) {
      this.currentPageinvoiceMasterSlab = 1;
    }
    this.searchinvoiceMaster("", this.showItemPerPage);
  }
  searchInvoices() {
    this.currentPageinvoiceMasterSlab = 1;
    this.searchinvoiceMaster("", "");
  }
  searchinvoiceMaster(id, size) {
    let statusList = this.searchInvoiceMasterFormGroup.value.status;
    let page_list;
    if (size) {
      page_list = size;
      this.invoiceMasteritemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.invoiceMasteritemsPerPage = this.pageITEM;
      } else {
        this.invoiceMasteritemsPerPage = this.showItemPerPage;
      }
    }

    const searchList = [];
    let url;

    // if (id) {
    //   this.searchInvoiceMasterFormGroup.value.billrunid = id;
    //   this.searchInvoiceMasterFormGroup.patchValue({
    //     billrunid: Number(id)
    //   });
    // }

    if (this.searchInvoiceMasterFormGroup.value.docnumber == null) {
      this.searchInvoiceMasterFormGroup.value.docnumber = "";
    }
    if (this.searchInvoiceMasterFormGroup.value.custMobile == null) {
      this.searchInvoiceMasterFormGroup.value.custMobile = "";
    }

    let dtoData = {
      page: this.currentPageinvoiceMasterSlab,
      pageSize: this.invoiceMasteritemsPerPage
    };
    url =
      "/invoice/search?billrunid=" +
      "&docnumber=" +
      this.searchInvoiceMasterFormGroup.value.docnumber.trim() +
      "&customerid=" +
      this.searchInvoiceMasterFormGroup.value.customerid +
      "&billfromdate=" +
      this.searchInvoiceMasterFormGroup.value.billfromdate +
      "&billtodate=" +
      this.searchInvoiceMasterFormGroup.value.billtodate +
      "&custmobile=" +
      this.searchInvoiceMasterFormGroup.value.custMobile +
      "&serviceAreaId=" +
      this.searchInvoiceMasterFormGroup.value.serviceAreaId +
      "&branchId=" +
      this.searchInvoiceMasterFormGroup.value.branchName +
      "&partnerId=" +
      this.searchInvoiceMasterFormGroup.value.partnerName +
      "&staffId=" +
      this.searchInvoiceMasterFormGroup.value.staffid +
      "&status=" +
      statusList +
      "&type=Prepaid" +
      "&isInvoiceVoid=true";
    this.invoiceMasterService.postMethod(url, dtoData).subscribe(
      (response: any) => {
        this.invoiceMasterListData = response.invoicesearchlist;
        this.tempInvoiceMasterData = response.invoicesearchlist.map(item => {
          // for filter data at the time of payment page close
          return item.id;
        });
        this.invoiceMastertotalRecords = response.pageDetails.totalRecords;
        this.invoiceMasterListData.forEach(element => {
          let isElementAlreadyExist = this.selectedInvoiceIdList.some(function (el) {
            return el.id === element.id;
          });
          if (isElementAlreadyExist) {
            element.isSelected = true;
          }
          let payment: Number = element.totalamount - element.adjustedAmount;
          element.paymentAmount = Number(payment.toFixed(2));
          element.includeTds = false;
          element.includeAbbs = false;
          element.tdsCheck = 0;
          element.abbsCheck = 0;
        });
        this.isInvoiceSearch = true;
        this.getBankDetail();
        this.getBankDestinationDetail();
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
    // this.searchInvoiceMasterFormGroup.controls.billrunid.setValue("");
    this.searchInvoiceMasterFormGroup.controls.docnumber.setValue("");
    this.searchInvoiceMasterFormGroup.controls.custname.setValue("");
    this.searchInvoiceMasterFormGroup.controls.billfromdate.setValue("");
    this.searchInvoiceMasterFormGroup.controls.billtodate.setValue("");
    this.searchInvoiceMasterFormGroup.controls.customerid.setValue("");
    this.searchInvoiceMasterFormGroup.controls.serviceAreaId.setValue("");
    this.searchInvoiceMasterFormGroup.controls.branchName.setValue("");
    this.searchInvoiceMasterFormGroup.controls.partnerName.setValue("");
    this.searchInvoiceMasterFormGroup.controls.staffid.setValue("");
    this.searchInvoiceMasterFormGroup.controls.status.setValue([]);
    this.searchInvoiceMasterFormGroup.updateValueAndValidity();
    this.invoiceMasterListData = [];
  }

  downloadPDF(docNo) {
    if (docNo) {
      const downloadUrl = "/invoicePdf/download/" + docNo;
      this.invoiceMasterService.downloadPDF(downloadUrl).subscribe(
        (response: any) => {
          const file = new Blob([response], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(file);
          FileSaver.saveAs(file);
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

  pageChangedInvoicePaymentList(pageNumber) {
    this.currentPageinvoicePaymentList = pageNumber;
  }
  invoicePaymentCloseModal() {
    this.invoicePayment = false;
    this.ifInvoicePayment = false;
    this.ispaymentChecked = false;
    this.allIsChecked = false;
    this.isSinglepaymentChecked = false;
    this.invoicePaymentData = [];
    this.allchakedPaymentData = [];
  }

  paymentPageClose() {
    this.isRecordPaymentOpen = false;
    this.paymentFormGroup.reset();
    this.invoiceMasterListData = this.invoiceMasterListData.filter(a =>
      this.tempInvoiceMasterData.some(b => b === a.id)
    );
  }
  invoicePayment: boolean = false;
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
      this.invoicePayment = true;
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
        this.searchinvoiceMaster("", "");
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
            this.invoiceCancelRemarksModal = false;
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

  invoiceCancelRemarks = null;
  invoiceCancelRemarksType = null;
  showdata: any = [];
  displayNoteModal: boolean = false;
  displayNote(invoiceId) {
    this.displayNoteModal = true;
    this.showdata = this.invoiceMasterListData.filter(
      invoice =>
        (invoice.billrunstatus === "Cancelled" || invoice.billrunstatus === "VOID") &&
        invoice.id == invoiceId
    );
  }

  hideNote() {
    this.displayNoteModal = false;
  }

  invoiceCancelRemarksModal: boolean = false;

  hideRemarkModal() {
    this.invoiceCancelRemarksModal = false;
  }
  invoiceRemarks(invoice, type) {
    this.invoiceID = invoice.id;
    this.invoiceCancelRemarksType = type;
    this.invoiceCancelRemarksModal = true;
  }

  addInvoiceRemarks() {
    if (this.invoiceCancelRemarksType === "void") {
      this.voidInvoice();
    } else if (this.invoiceCancelRemarksType === "cancelRegenerate") {
      this.cancelRegenrateInvoice();
    }
  }

  cancelRegenrateInvoice() {
    const data = {};

    const url =
      "/cancelAndRegenerate/" +
      this.invoiceID +
      "?isCaf=false&invoiceCancelRemarks=" +
      this.invoiceCancelRemarks;
    this.revenueManagementService.postMethodPasssHeader1(url, data).subscribe(
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
        this.invoiceCancelRemarksModal = false;

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
  generatePDFInvoice(custId) {
    if (custId) {
      const url = "/generatePdfByInvoiceId/" + custId;
      this.invoiceMasterService.generateMethod(url).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          setTimeout(() => {
            this.searchinvoiceMaster("", "");
          }, 500);
          //
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

  downloadPDFINvoice(docNo, customerName) {
    if (docNo) {
      const downloadUrl = "/invoicePdf/download/" + docNo;
      this.invoiceMasterService.downloadPDFInvoice(downloadUrl).subscribe(
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

  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;
  selectedParentCust: any = [];
  selectedParentCustId: any;
  parentCustList: any;
  newFirst = 0;
  searchParentCustOption = "";
  searchParentCustValue = "";
  parentFieldEnable = false;
  customerList = [];
  searchOptionSelect = this.commondropdownService.customerSearchOption;

  // customer dropdown

  getParentCustomerData() {
    let currentPage;
    currentPage = this.currentPageParentCustomerListdata;
    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    // const url = "/customers/list";
    const url =
      `/customers/list/` +
      RadiusConstants.CUSTOMER_TYPE.PREPAID +
      "?orgcusttype=false&mvnoId=" +
      localStorage.getItem("mvnoId");
    this.invoiceMasterService.postMethod(url, data).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
        this.newFirst = 1;
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
  selectParentCustomer: boolean = false;
  async modalOpenParentCustomer() {
    this.selectParentCustomer = true;
    await this.getParentCustomerData();
    this.newFirst = 1;
    this.selectedParentCust = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  modalCloseParentCustomer(event) {
    this.selectParentCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.paginator.changePageToFirst(event);
    this.newFirst = 1;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.customerList = [];

    // console.log("this.newFirst1", this.newFirst)
  }

  async saveSelCustomer(event) {
    this.parentCustList = [
      {
        id: Number(this.selectedParentCust.id),
        name: this.selectedParentCust.name
      }
    ];

    this.searchInvoiceMasterFormGroup.patchValue({
      customerid: Number(this.selectedParentCust.id)
    });
    this.modalCloseParentCustomer(event);
  }

  paginate(event) {
    this.currentPageParentCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchParentCustomer();
    } else {
      this.getParentCustomerData();
    }
  }

  clearSearchParentCustomer(event) {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.paginator.changePageToFirst(event);
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  onClickSearchParentCustomer(event) {
    this.currentPageParentCustomerListdata = 1;
    this.paginator.changePageToFirst(event);
    this.searchParentCustomer();
  }

  searchParentCustomer() {
    const searchParentData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageParentCustomerListdata,
      pageSize: this.parentCustomerListdataitemsPerPage
    };

    searchParentData.filters[0].filterValue = this.searchParentCustValue;
    searchParentData.filters[0].filterColumn = this.searchParentCustOption.trim();

    const url =
      "/customers/search/" +
      RadiusConstants.CUSTOMER_TYPE.PREPAID +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.invoiceMasterService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.currentPageParentCustomerListdata = response.pageDetails.currentPageNumber;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
        this.customerList = [];
        if (error.error.status == 400 || error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          // this.customerListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }
  modalTitle: boolean = false;
  openModal(invoiceData, custId) {
    this.modalTitle = true;
    this.totalAmount = invoiceData.totalamount;
    this.adjustedAmount = invoiceData.adjustedAmount ? invoiceData.adjustedAmount : 0;
    this.count = 0;
    this.onAddAttribute();
  }

  closeCustDetails() {
    this.dialogId = false;
  }

  selParentSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  isAllSelectedInvoice() {
    this.masterSelected = this.invoiceMasterListData.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemListInvoice();
  }

  checkUncheckAllInvoice() {
    for (let i = 0; i < this.invoiceMasterListData.length; i++) {
      this.invoiceMasterListData[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemListInvoice();
  }

  getCheckedItemListInvoice() {
    this.checkedList = [];
    for (let i = 0; i < this.invoiceMasterListData.length; i++) {
      if (this.invoiceMasterListData[i].isSelected) {
        this.checkedList.push(this.invoiceMasterListData[i]);
        if (this.selectedInvoiceIdList.indexOf(this.invoiceMasterListData[i]) === -1) {
          this.selectedInvoiceIdList.push(this.invoiceMasterListData[i]);
        }
      } else {
        let isElementAlreadyExist = this.selectedInvoiceIdList.find(
          obj => obj.id === this.invoiceMasterListData[i].id
        );
        if (
          isElementAlreadyExist != undefined &&
          isElementAlreadyExist &&
          !this.invoiceMasterListData[i].isSelected
        ) {
          const index: number = this.selectedInvoiceIdList.findIndex(
            obj => obj.id === this.invoiceMasterListData[i].id
          );
          this.selectedInvoiceIdList.splice(index, 1);
        }
      }
    }
  }
  resetPayMode() {
    this.paymentFormGroup.controls.chequeno.disable();
    this.paymentFormGroup.controls.chequedate.disable();
    this.paymentFormGroup.controls.bankManagement.disable();
    this.paymentFormGroup.controls.branch.disable();
    this.paymentFormGroup.controls.destinationBank.disable();
    this.paymentFormGroup.controls.reciptNo.enable();
    this.chequeDateName = "Cheque Date";
    this.paymentFormGroup.controls.referenceno.setValidators([]);
    this.paymentFormGroup.controls.chequedate.setValidators([]);
    this.paymentFormGroup.controls.destinationBank.setValidators([]);
    this.paymentFormGroup.controls.bankManagement.setValidators([]);
    this.paymentFormGroup.controls.chequeno.setValidators([]);
    this.paymentFormGroup.controls.onlinesource.setValidators([]);
    this.paymentFormGroup.updateValueAndValidity();
  }

  selPayModeRecord(event) {
    this.resetPayMode();
    const payMode = event.value.toLowerCase();
    if (payMode == "POS".toLowerCase() || payMode == "VatReceiveable".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "Online".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.paymentFormGroup.controls.referenceno.setValidators([Validators.required]);
      this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "Direct Deposit".toLowerCase()) {
      this.paymentFormGroup.controls.branch.enable();
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.paymentFormGroup.controls.destinationBank.enable();
      this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
      this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
      this.paymentFormGroup.controls.reciptNo.disable();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "NEFT_RTGS".toLowerCase()) {
      this.paymentFormGroup.controls.bankManagement.enable();
      this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
      this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
      this.paymentFormGroup.controls.destinationBank.enable();
      this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
      this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
    } else if (payMode == "Cheque".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.paymentFormGroup.controls.bankManagement.enable();
      this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
      this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
      this.paymentFormGroup.controls.chequeno.enable();
      this.paymentFormGroup.controls.chequeno.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
      this.paymentFormGroup.controls.branch.enable();
    }
    this.commondropdownService.getOnlineSourceData(payMode.toLowerCase());
    if (this.commondropdownService.onlineSourceData.length > 0) {
      this.paymentFormGroup.controls.onlinesource.setValidators([Validators.required]);
      this.paymentFormGroup.controls.onlinesource.updateValueAndValidity();
    }
    let isAbbsTdsMode = this.checkPaymentMode(payMode);
    if (isAbbsTdsMode) {
      this.paymentFormGroup.patchValue({
        tdsAmount: 0,
        abbsAmount: 0
      });
      if (this.checkedList.length > 0) {
        this.checkedList.map(element => {
          element.tds = 0;
          element.abbs = 0;
        });
      }
    }
  }

  checkPaymentMode(formPayModeValue) {
    if (
      formPayModeValue == "vatreceiveable" ||
      formPayModeValue == "tds" ||
      formPayModeValue == "abbs"
    ) {
      return true;
    } else {
      return false;
    }
  }

  selPaySourceRecord(event) {
    const paySource = event.value.toLowerCase();
    switch (paySource) {
      case "Cash_via_Bank".toLowerCase():
        this.paymentFormGroup.controls.destinationBank.enable();
        this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
        this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
        this.paymentFormGroup.controls.branch.enable();
        break;
    }
  }

  onChangeOFAmount(event) {
    let tdsAmount = (event * this.tdsPercent) / 100;
    let abbsAmount = (event * this.abbsPercent) / 100;
    // let tdsAmount = 0;
    // let abbsAmount = 0;
    // this.checkedList.forEach(element => {
    //   tdsAmount += element.includeTds ? (element.totalamount * this.tdsPercent) / 100 : 0;
    //   abbsAmount += element.includeAbbs ? (element.totalamount * this.abbsPercent) / 100 : 0;
    // });
    if (!this.paymentFormGroup.controls.abbsAmount.disabled && this.abbsInclude) {
      this.paymentFormGroup.controls.abbsAmount.setValue(abbsAmount);
    }
    if (!this.paymentFormGroup.controls.tdsAmount.disabled && this.tdsInclude) {
      this.paymentFormGroup.controls.tdsAmount.setValue(tdsAmount);
    }
  }
  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = "";
      this.fileName = event.target.files[0].name;
      this.file = event.target.files[0];
    }
  }
  calculateTDS(event) {
    if (!event.target.checked) {
      this.tdsInclude = false;
      this.paymentFormGroup.controls.tdsAmount.disable();
      this.paymentFormGroup.controls.tdsAmount.setValue(0);
    } else {
      this.tdsInclude = true;
      this.paymentFormGroup.controls.tdsAmount.enable();
      this.onChangeOFAmount(this.paymentFormGroup.controls.amount.value);
    }
  }
  calculateABBS(event) {
    if (!event.target.checked) {
      this.abbsInclude = false;
      this.paymentFormGroup.controls.abbsAmount.disable();
      this.paymentFormGroup.controls.abbsAmount.setValue(0);
    } else {
      this.abbsInclude = true;
      this.paymentFormGroup.controls.abbsAmount.enable();
      this.onChangeOFAmount(this.paymentFormGroup.controls.amount.value);
    }
  }
  onChangeOFTDS(event) {
    let tdsAmount = event;
    let abbsAmount = this.paymentFormGroup.controls.abbsAmount.value;
    let totalAmount = this.paymentFormGroup.controls.amount.value;
    let diff = totalAmount - abbsAmount - tdsAmount;

    if (diff < 0 && tdsAmount != 0) {
      this.paymentFormGroup.controls.tdsAmount.setValue(0);
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "TDS/ABBS total can not be greater than amount.",
        icon: "far fa-check-circle"
      });
    }
  }
  onChangeOFABBS(event) {
    let abbsAmount = event;
    let tdsAmount = this.paymentFormGroup.controls.tdsAmount.value;
    let totalAmount = this.paymentFormGroup.controls.amount.value;
    let diff = totalAmount - abbsAmount - tdsAmount;

    if (diff < 0 && abbsAmount != 0) {
      this.paymentFormGroup.controls.abbsAmount.setValue(0);
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "TDS/ABBS total can not be greater than amount.",
        icon: "far fa-check-circle"
      });
    }
  }
  createPaymentData: any = [];

  getRecordPayment() {
    this.isRecordPaymentOpen = true;
    this.recordPayment = true;
    let amount = 0;
    let tds = 0;
    let abbs = 0;
    this.selectedInvoiceIdList.forEach(obj => {
      let isElementAlreadyExist = this.invoiceMasterListData.find(ele => ele.id === obj.id)
        ? true
        : false;
      if (!isElementAlreadyExist) {
        this.invoiceMasterListData.push(obj);
      }
    });
    this.invoiceMasterListData.forEach(element => {
      if (element.isSelected) {
        amount = amount + element.paymentAmount;
        tds = Number(tds) + Number(element.tdsCheck);
        abbs = Number(abbs) + Number(element.abbsCheck);
      }
    });
    this.paymentFormGroup.patchValue({
      amount: Number(amount).toFixed(2),
      tdsAmount: tds,
      abbsAmount: abbs
    });
    this.resetPayMode();
  }
  bankDataList: any;
  bankDestination: any;
  getBankDetail() {
    const url = `/bankManagement/searchByStatus?banktype=other&mvnoId=${localStorage.getItem("mvnoId")}`;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
        // this.bankDestination = response.dataList.banktype
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getBankDestinationDetail() {
    const url =
      "/bankManagement/searchByStatus?banktype=operator&mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        // this.bankDataList = response.dataList.banktype;
        this.bankDestination = response.dataList;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  recordPayment: boolean = false;
  addPayment() {
    this.submitted = true;
    let data = [];
    const formData = new FormData();
    this.createPaymentData = [];

    let abbsAmount = this.paymentFormGroup.controls.abbsAmount.value;
    let tdsAmount = this.paymentFormGroup.controls.tdsAmount.value;
    let totalAmount = this.paymentFormGroup.controls.amount.value;
    let diff = totalAmount - abbsAmount - tdsAmount;

    if (diff < 0) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "TDS/ABBS total can not be greater than amount.",
        icon: "far fa-check-circle"
      });
      return;
    }

    this.invoiceMasterListData.forEach(element => {
      if (element.isSelected) {
        this.paymentFormGroup.patchValue({
          type: "Payment",
          customerid: element.custid,
          amount: element.paymentAmount,
          invoiceId: [element.id],
          // invoices: [
          //   {
          //     id: element.id,
          //     amount: element.paymentAmount,
          //     includeTds: element.includeTds,
          //     includeAbbs: element.includeAbbs,
          //   },
          // ],
          filename: this.fileName
        });

        this.paymentFormGroup.value.paymentListPojos = [];
        this.paymentFormGroup.value.paymentListPojos.push({
          tdsAmountAgainstInvoice: tdsAmount,
          abbsAmountAgainstInvoice: abbsAmount,
          amountAgainstInvoice: this.paymentFormGroup.value.amount,
          invoiceId: element.id
        });
        this.createPaymentData.push(this.paymentFormGroup.value);
      }
    });
    formData.append("file", this.file);
    formData.append("recordpaymentDtos", JSON.stringify(this.createPaymentData));
    formData.append("batchname", this.paymentFormGroup.value.batchname);
    if (this.paymentFormGroup.valid) {
      const url = "/paymentGateway/record/bulkpayment";
      delete this.createPaymentData.file;

      this.revenueManagementService.postMethod(url, formData).subscribe(
        (response: any) => {
          this.submitted = false;
          this.paymentFormGroup.reset();
          this.searchinvoiceMaster("", "");
          this.messageService.add({
            severity: "success",
            summary: "Payment Created Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.recordPayment = false;
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
  totalAmount: number;
  adjustedAmount: number;
  count: number = 0;
  date = new Date();
  deleteConfirmAttribute(attributeIndex: number) {
    this.attribute.removeAt(attributeIndex);
  }
  onAddAttribute() {
    this.submitted = false;
    this.attribute.push(this.createAttributeFormGroup());
  }
  createAttributeFormGroup(): FormGroup {
    this.count = this.count + 1;
    this.date.setDate(this.date.getDate() + 1);
    const newDate = this.pipe.transform(this.date, "dd/MM/YYYY");
    return this.fb.group({
      milestoneNumber: [this.count],
      amount: [this.count === 1 ? this.totalAmount - this.adjustedAmount : "", Validators.required],
      dueDate: [newDate, Validators.required]
    });
  }

  onChangeOFTDSTest(event, data) {
    if (event && data.totalamount) {
      data.tdsCheck = ((data.totalamount * this.tdsPercent) / 100).toFixed(2);
    } else {
      data.tdsCheck = 0;
    }
  }

  onChangeOFABBSTest(event, data) {
    if (event && data.totalamount) {
      data.abbsCheck = ((data.totalamount * this.abbsPercent) / 100).toFixed(2);
    } else {
      data.abbsCheck = 0;
    }
  }

  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSelectedInvoice(event, data) {
    if (event > 0) {
      // if (data.includeTds) {
      //   data.tdsCheck = ((data.paymentAmount * this.tdsPercent) / 100).toFixed(2);
      // }
      // if (data.includeAbbs) {
      //   data.abbsCheck = ((data.paymentAmount * this.abbsPercent) / 100).toFixed(2);
      // }
    } else {
      data.includeTds = false;
      data.includeAbbs = false;
      data.tdsCheck = 0;
      data.abbsCheck = 0;
    }
  }

  getStaff() {
    let currentPage;
    currentPage = this.currentPageParentStaffListdata;
    const data = {
      page: currentPage,
      pageSize: this.parentStaffListdataitemsPerPage
    };
    const url = "/staffuser/list?product=BSS";
    this.adoptCommonBaseService.post(url, data).subscribe(
      (response: any) => {
        this.staffData = response.staffUserlist;
        this.parentstaffListdatatotalRecords = response.pageDetails.totalRecords;

        //   console.log("staff", this.staffData);
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
  selectStaff: boolean = false;
  async modalOpenStaff() {
    this.selectStaff = true;
    await this.getStaff();
    this.newFirst = 1;
    this.selectedStaffCust = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  searchStaffByName() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage == 1) {
      this.itemsPerPage = this.pageITEM;
    } else {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchDeatil.trim();
    this.staffService.staffSearch(this.searchData).subscribe(
      (response: any) => {
        //
        this.staffData = response.dataList;
        this.totalRecords = response.totalRecords;
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.staffData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  clearSearchForm() {
    this.searchDeatil = "";
  }
  modalCloseStaff() {
    this.selectStaff = false;
    this.currentPageParentStaffListdata = 1;
    this.newFirst = 1;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    // console.log("this.newFirst1", this.newFirst)
  }

  async saveSelstaff() {
    this.staffCustList = [
      {
        id: Number(this.selectedStaffCust.id),
        name: this.selectedStaffCust.firstname
      }
    ];
    this.searchInvoiceMasterFormGroup.patchValue({
      staffid: Number(this.selectedStaffCust.id)
    });
    this.staffid = Number(this.selectedStaffCust.id);
    this.modalCloseStaff();
  }

  removeSelStaff() {
    this.staffCustList = [];
    this.staffid = null;
  }

  removeSelParentCust() {
    this.parentCustList = [];
  }
}
