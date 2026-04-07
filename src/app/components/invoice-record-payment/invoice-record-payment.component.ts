import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";

import { CommondropdownService } from "src/app/service/commondropdown.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
declare var $: any;

@Component({
  selector: "app-invoice-record-payment",
  templateUrl: "./invoice-record-payment.component.html",
  styleUrls: ["./invoice-record-payment.component.css"]
})
export class InvoiceRecordPaymentComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private recordPaymentService: RecordPaymentService,
    public commondropdownService: CommondropdownService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public revenueManagementService: RevenueManagementService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }
  paymentFormGroup: FormGroup;
  submitted = false;
  customerData: any;
  createPaymentData: any;
  AclClassConstants;
  AclConstants;
  invoiceList: any = [];
  bankDataList: any;
  public loginService: LoginService;
  selectedcustInvoice: any = [];
  taxData: any = [];
  ngOnInit(): void {
    this.paymentFormGroup = this.fb.group({
      amount: [
        "",
        [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/), Validators.min(1)]
      ],
      customerid: ["", Validators.required],
      paymentdate: [""],
      paymentreferenceno: [""],
      paymode: ["Credit Note"],
      referenceno: ["", Validators.required],
      remark: ["", Validators.required],
      invoiceId: ["", Validators.required],
      type: ["creditnote"],
      paytype: ["creditnote"]
    });
    // this.paymentFormGroup.controls.branch.disable();
    // this.paymentFormGroup.controls.chequedate.disable();
    // this.paymentFormGroup.controls.bank.disable();
    // this.paymentFormGroup.controls.bankManagement.disable();
    // this.paymentFormGroup.controls.chequeno.disable();
    this.paymentFormGroup.controls.paymentreferenceno.disable();
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.getPostpaidplanData();
    // this.getCustomer();this api will remove by shivam
    this.getBankDetail();
    const serviceArea = localStorage.getItem("serviceArea");

    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
    } else {
      this.commondropdownService.getserviceAreaList();
    }
  }

  changeCustomer(event) {
    const url = "/invoiceListForCreditNote/byCustomer/";
    this.invoiceList = [];
    this.invoiceList = [
      {
        adjustedAmount: 0,
        createdByName: "",
        docnumber: "Advance",
        id: 0,
        refundAbleAmount: "0",
        status: "",
        tax: 0,
        totalamount: 0
      }
    ];
    this.revenueManagementService.getAllInvoiceByCustomer(url + event.value).subscribe(
      (response: any) => {
        if (Array.isArray(response?.invoiceList)) {
          this.invoiceList = [...this.invoiceList, ...response.invoiceList];
        }
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

  getCustomer() {
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    const custerlist = {
      page: 1,
      pageSize: 10000
    };
    this.recordPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
        // console.log("this.customerData", this.customerData);
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

  getBankDetail() {
    const url = "/bankManagement/searchByStatus?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
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

  addPayment(paymentId): void {
    this.submitted = true;

    if (this.paymentFormGroup.valid) {
      this.paymentFormGroup.value.type = "creditnote";
      this.paymentFormGroup.value.paymode = "Credit Note";
      this.paymentFormGroup.value.paytype = "creditnote";
      this.paymentFormGroup.value.paymentdate = new Date();
      this.createPaymentData = this.paymentFormGroup.value;
      //   let invoiceId = [];
      //   invoiceId.push(this.paymentFormGroup.controls.invoiceId.value);
      let invoiceId = null;
      if (this.paymentFormGroup.controls.invoiceId.value != 0) {
        invoiceId = [];
        invoiceId.push(this.paymentFormGroup.controls.invoiceId.value);
      }
      // invoices.push({
      //   id: this.paymentFormGroup.controls.invoiceId.value,
      //   amount: this.paymentFormGroup.controls.amount.value,
      //   includeTds: this.paymentFormGroup.controls.includeTds.value,
      //   includeAbbs: this.paymentFormGroup.controls.includeAbbs.value,
      // });
      this.createPaymentData.invoiceId = invoiceId;
      // this.createPaymentData.invoices = invoices;
      const formData = new FormData();
      formData.append("spojo", JSON.stringify(this.createPaymentData));

      const url = "/record/payment?mvnoId=" + localStorage.getItem("mvnoId");
      this.revenueManagementService.postMethod(url, formData).subscribe(
        (response: any) => {
          this.submitted = false;
          this.paymentFormGroup.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          if (error.error.status == 417 || error.error.status == 409) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
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
  }

  selectCustomerInvoice: boolean = false;
  modalOpenCustomerInvoice() {
    this.selectCustomerInvoice = true;
    this.newFirst = 0;
    this.selectedcustInvoice = [];
  }
  modalCloseCustomerInvoice() {
    this.selectCustomerInvoice = false;
    this.newFirst = 0;
  }
  saveSelCustomerInvoice() {
    this.paymentFormGroup.patchValue({
      invoiceId: this.selectedcustInvoice.id,
      amount: this.selectedcustInvoice.refundAbleAmount
      // includeTds: this.selectedcustInvoice.includeTds,
      // includeAbbs: this.selectedcustInvoice.includeAbbs,
    });
    this.selectCustomerInvoice = false;
    this.newFirst = 0;
  }
  taxDetails: boolean = false;
  openTaxModal(id) {
    this.invoiceList.forEach(element => {
      if (element.id == id) this.taxData = element.debitDocumentTAXRels;
    });
    if (this.taxData.length > 0) {
      this.taxDetails = true;
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Tax Data Not Found!",
        icon: "far fa-times-circle"
      });
    }
  }
  // paginate(event) {
  //   console.log("page event", this.selectedcustInvoice);
  //   this.currentPageParentCustomerListdata = event.page + 1;
  //   // this.first = event.first;
  //   this.changeCustomer()
  // }

  canExit() {
    if (!this.paymentFormGroup.dirty) return true;
    {
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          header: "Alert",
          message: "The filled data will be lost. Do you want to continue? (Yes/No)",
          icon: "pi pi-info-circle",
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          }
        });
        return false;
      });
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
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    this.recordPaymentService.postMethod(url, data).subscribe(
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

  modalCloseParentCustomer() {
    this.selectParentCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.customerList = [];

    // console.log("this.newFirst1", this.newFirst)
  }

  async saveSelCustomer() {
    this.parentCustList = [
      {
        id: Number(this.selectedParentCust.id),
        name: this.selectedParentCust.name
      }
    ];

    this.paymentFormGroup.patchValue({
      customerid: Number(this.selectedParentCust.id)
    });

    let customerId = {
      value: this.selectedParentCust.id
    };
    this.changeCustomer(customerId);
    this.modalCloseParentCustomer();
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

  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  searchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
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

    searchParentData.filters[0].filterValue = this.searchParentCustValue.trim();
    searchParentData.filters[0].filterColumn = this.searchParentCustOption.trim();

    const url =
      "/subscriber/getByInvoiceType/search/Group?mvnoId=" + localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.recordPaymentService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
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

  selParentSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
    this.searchParentCustValue = null;
  }

  newOfferPriceValidation(input) {
    var num = String.fromCharCode(input.which);
    const charStr = String.fromCharCode(input.which);

    if (
      !/^\d$/.test(charStr) &&
      charStr !== "0" &&
      charStr !== "1" &&
      charStr !== "2" &&
      charStr !== "3" &&
      charStr !== "4" &&
      charStr !== "5" &&
      charStr !== "6" &&
      charStr !== "7" &&
      charStr !== "8" &&
      charStr !== "9"
    ) {
      event.preventDefault();
    }
  }
}
