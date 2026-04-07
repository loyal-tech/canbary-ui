import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { StaffService } from "src/app/service/staff.service";

declare var $: any;

@Component({
  selector: "app-record-payment",
  templateUrl: "./record-payment.component.html",
  styleUrls: ["./record-payment.component.css"]
})
export class RecordPaymentComponent implements OnInit {
  @ViewChild("dt", { static: false }) dt: any;
  paymentFormGroup: FormGroup;
  submitted = false;
  customerData: any;
  createPaymentData: any;
  AclClassConstants;
  AclConstants;
  invoiceList: any = [];
  onlineSourceData = [];

  paymentMode = [
    // { label: "Cash", value: "Cash" },
    // { label: "Cheque", value: "Cheque" },
    // { label: "Online", value: "Online" },
    // { label: "EFTs", value: "EFTs" },
    // { label: "Barter", value: "barter" },
    // { label: "Direct Deposit", value: "Direct Deposit" },
    // { label: "VAT Receiveable", value: "VAT Receiveable" },
    // { label: "Non Cash Adjustment", value: "Non Cash Adjustment" },
    // { label: "POS Adjustmnet", value: "POS Adjustmnet" },
    // { label: "QR", value: "QR" },
    // { label: "OPG Adjustment", value: "OPG Adjustment" },
  ];
  invoicedropdownValue = [{ docnumber: "Advance", id: 0 }];
  customerList: any;

  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;
  selectedParentCust: any = [];
  selectedParentCustId: any;
  parentCustList: any;
  editCustomerId: any;
  newFirst = 0;
  searchParentCustOption = "";
  searchParentCustValue = "";
  serviceAreaDisable = false;
  parentFieldEnable = false;
  public loginService: LoginService;
  bankDataList: any;
  bankDestination: any;
  searchOptionSelect = this.commondropdownService.customerSearchOption;
  fileName: any;
  file: any = "";
  taxData: any = [];
  selectedInvoices: any[];
  isShowInvoiceList: boolean = false;
  recordPaymentAccess: boolean = false;
  masterSelected: boolean;
  checklist: any;
  checkedList: any[] = [];
  tdsInclude = false;
  abbsInclude = false;
  tdsPercent: number;
  abbsPercent: number;
  chequeDateName = "Cheque Date";
  custType: string;
  collectedCurrency: string;
  isDisplayConvertedAmount: boolean = false;
  convertedExchangeRate: any;
  currency: string;
  systemConfigCurrency: string;
  staffWalletLimit: number = 0;
  WalletAmount: number = 0;
  today: string;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private revenueManagementService: RevenueManagementService,
    private recordPaymentService: RecordPaymentService,
    public commondropdownService: CommondropdownService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    loginService: LoginService,
    private systemService: SystemconfigService,
    private staffService: StaffService
  ) {
    this.recordPaymentAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PAYMENT_RECORD
        : POST_CUST_CONSTANTS.POST_CUST_PAYMENT_RECORD
    );
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    const url = "/commonList/paymentMode";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.paymentMode = response.dataList;
      },
      (error: any) => {}
    );
  }

  ngOnInit(): void {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split("T")[0];
    this.paymentFormGroup = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      bank: [""],
      branch: [""],
      chequedate: ["", Validators.required],
      chequeno: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      customerid: ["", Validators.required],
      paymode: ["", Validators.required],
      referenceno: ["", Validators.required],
      remark: ["", Validators.required],
      bankManagement: ["", Validators.required],
      destinationBank: ["", Validators.required],
      reciptNo: [""],
      type: ["Payment"],
      paytype: [""],
      file: [""],
      tdsAmount: [0],
      abbsAmount: [0],
      invoiceId: ["", Validators.required],
      onlinesource: [""]
    });
    // this.paymentFormGroup.controls.bank.disable();
    // this.paymentFormGroup.controls.branch.disable();
    // this.paymentFormGroup.controls.chequedate.disable();
    // this.paymentFormGroup.controls.bankManagement.disable();
    // this.paymentFormGroup.controls.chequeno.disable();
    // this.paymentFormGroup.controls.onlinesource.disable();
    this.resetPayMode();
    // this.getCustomer();this api will remove by shivam

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
    this.commondropdownService.getAllCurrencyData();
    this.openStaffWallet();
    this.systemService.getConfigurationByName("STAFF_WALLET_LIMIT").subscribe((res: any) => {
      this.staffWalletLimit = res?.data ? Number(res?.data?.value) : 0;
    });
  }

  changeCustomer(custId) {
    const url = `/invoiceList/byCustomer/${custId}`;
    this.invoiceList = [];
    this.masterSelected = false;

    this.revenueManagementService.getAllInvoiceByCustomer(url).subscribe(
      (response: any) => {
        const invoiceList = response.invoiceList;
        if (response.invoiceList == null || response.invoiceList.length === 0) {
          this.invoiceList.push(...this.invoicedropdownValue);
        } else {
          this.invoiceList.push(...invoiceList);
        }
        this.invoiceList.forEach(element => {
          element.tdsCheck = 0;
          element.abbsCheck = 0;
          element.includeTds = false;
          element.includeAbbs = false;
          element.isSelected = false;
          if (element.adjustedAmount) {
            element.testamount = (element.totalamount - element.adjustedAmount).toFixed(2);
          } else {
            element.testamount = element.totalamount?.toFixed(2);
          }
          element.convertedAmount = element.testamount * this.convertedExchangeRate;
          element.currency = this.selectedParentCust?.currency
            ? this.selectedParentCust?.currency
            : this.currency;
        });
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

  getBankDetail(mvnoId) {
    const url = `/bankManagement/searchByStatus?banktype=other&mvnoId=${mvnoId}`;
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

  getBankDestinationDetail(mvnoId) {
    const url = "/bankManagement/searchByStatus?banktype=operator&mvnoId=" + mvnoId;
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

  addPayment(paymentId) {
    this.submitted = true;
    if (this.paymentFormGroup.valid) {
      let totalAmount = Number(this.WalletAmount) + Number(this.paymentFormGroup?.value.amount);
      if (this.paymentFormGroup.value.invoiceId == 0) {
        this.paymentFormGroup.value.paytype = "advance";
      } else {
        this.paymentFormGroup.value.paytype = "invoice";
      }
      if (this.checkedList.length == 0) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please select atleat one invoice or advance mode.",
          icon: "far fa-check-circle"
        });
        return;
      } else {
        if (this.staffWalletLimit < totalAmount) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Staff balance exceeds the threshold. Please clear the balance first",
            icon: "far fa-check-circle"
          });
          return;
        } else {
          const url = "/record/payment?mvnoId=" + localStorage.getItem("mvnoId");
          this.paymentFormGroup.value.type = "Payment";
          this.createPaymentData = this.paymentFormGroup.value;
          this.createPaymentData.onlinesource = this.paymentFormGroup.controls.onlinesource.value;
          this.createPaymentData.filename = this.fileName;
          this.selectedParentCust.id = "";
          this.resetPayMode();
          const invoiceId = [];
          // const invoices = [];
          this.checkedList.forEach(element => {
            invoiceId.push(element.id);
            // invoices.push({
            //   id: element.id,
            //   amount: element.paymentAmount,
            //   includeTds: element.includeTds,
            //   includeAbbs: element.includeAbbs,
            // });
          });
          this.createPaymentData.invoiceId = invoiceId;
          // this.createPaymentData.invoices = invoices;
          delete this.createPaymentData.file;
          const formData = new FormData();
          let fileArray: FileList;
          var paymentListPojos = [];

          this.checkedList.forEach(element => {
            let data = {
              tdsAmountAgainstInvoice: element.tds,
              abbsAmountAgainstInvoice: element.abbs,
              amountAgainstInvoice: element.testamount,
              invoiceId: element.id
            };
            paymentListPojos.push(data);
          });
          this.createPaymentData.paymentListPojos = paymentListPojos;
          formData.append("file", this.file);
          formData.append("spojo", JSON.stringify(this.createPaymentData));
          this.revenueManagementService.postMethod(url, formData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.paymentFormGroup.reset();
              this.isShowInvoiceList = false;
              this.paymentFormGroup.get("type").setValue("Payment");
              this.parentCustList = [];
              this.invoiceList = [];
              this.checkedList = [];
              this.messageService.add({
                severity: "success",
                summary: "Payment Created Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
            },
            (error: any) => {
              if (error.error.status == 500) {
                this.messageService.add({
                  severity: "error",
                  summary: "Attachment size too large",
                  detail: error.error.ERROR,
                  icon: "pi pi-info-circle"
                });
              } else if (error.error.status == 409) {
                this.messageService.add({
                  severity: "info",
                  summary: "info",
                  detail: error.error.ERROR,
                  icon: "pi pi-info-circle"
                });
              } else {
                // console.log(error, "error")

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
    }
  }

  async selPayModeRecord(event) {
    this.resetPayMode();
    const payMode = event.value.toLowerCase();
    if (payMode == "POS".toLowerCase() || payMode == "VatReceiveable".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      //   this.paymentFormGroup.controls.referenceno.clearValidators();
      this.paymentFormGroup.controls.reciptNo.enable();
      this.paymentFormGroup.controls.chequeno.reset();
      this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
      this.paymentFormGroup.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "Online".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      //   this.paymentFormGroup.controls.referenceno.setValidators([Validators.required]);
      this.paymentFormGroup.controls.reciptNo.enable();
      //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
      this.paymentFormGroup.controls.chequeno.reset();
      this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "Direct Deposit".toLowerCase()) {
      this.paymentFormGroup.controls.branch.enable();
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.paymentFormGroup.controls.destinationBank.enable();
      this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
      //   this.paymentFormGroup.controls.referenceno.clearValidators();
      //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
      this.paymentFormGroup.controls.reciptNo.disable();
      this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
      this.paymentFormGroup.controls.chequeno.reset();
      this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "NEFT_RTGS".toLowerCase()) {
      this.paymentFormGroup.controls.bankManagement.enable();
      this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
      this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
      this.paymentFormGroup.controls.destinationBank.enable();
      this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
      //   this.paymentFormGroup.controls.referenceno.clearValidators();
      //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
      this.paymentFormGroup.controls.reciptNo.enable();
      this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
      this.paymentFormGroup.controls.chequedate.reset();
      this.paymentFormGroup.controls.chequeno.reset();
      this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
    } else if (payMode == "Cheque".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.paymentFormGroup.controls.bankManagement.enable();
      this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
      this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
      this.paymentFormGroup.controls.chequeno.enable();
      this.paymentFormGroup.controls.chequeno.setValidators([
        Validators.required,
        Validators.pattern(Regex.numeric)
      ]);
      //   this.paymentFormGroup.controls.referenceno.clearValidators();
      //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
      this.paymentFormGroup.controls.reciptNo.enable();
      this.paymentFormGroup.controls.branch.enable();
      this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
    } else if (
      payMode != "Cheque".toLowerCase() &&
      payMode != "NEFT_RTGS".toLowerCase() &&
      payMode != "Direct Deposit".toLowerCase() &&
      payMode != "Online".toLowerCase() &&
      (payMode != "POS".toLowerCase() || payMode != "VatReceiveable".toLowerCase())
    ) {
      this.paymentFormGroup.controls.chequedate.reset();
      this.paymentFormGroup.controls.chequeno.reset();
      this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
    }
    // await this.commondropdownService.getOnlineSourceData(payMode.toLowerCase());

    const url = "/commonList/generic/" + payMode;
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.onlineSourceData = response.dataList;
        this.paymentFormGroup.patchValue({
          onlinesource: ""
        });
        if (this.onlineSourceData.length > 0) {
          this.paymentFormGroup.controls.onlinesource.setValidators([Validators.required]);
          this.paymentFormGroup.controls.onlinesource.updateValueAndValidity();
        } else {
          this.paymentFormGroup.controls.onlinesource.clearValidators();
          this.paymentFormGroup.controls.onlinesource.updateValueAndValidity();
        }
        this.paymentFormGroup.updateValueAndValidity();
      },
      (error: any) => {
        this.onlineSourceData = [];
      }
    );
    this.paymentFormGroup.updateValueAndValidity();
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

  resetPayMode() {
    this.paymentFormGroup.controls.chequeno.disable();
    this.paymentFormGroup.controls.chequedate.disable();
    this.paymentFormGroup.controls.bankManagement.disable();
    this.paymentFormGroup.controls.branch.disable();
    this.paymentFormGroup.controls.destinationBank.disable();
    this.paymentFormGroup.controls.reciptNo.enable();
    this.chequeDateName = "Cheque Date";
    // this.paymentFormGroup.controls.referenceno.clearValidators();
    // this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
    this.paymentFormGroup.controls.chequedate.setValidators([]);
    this.paymentFormGroup.controls.destinationBank.setValidators([]);
    this.paymentFormGroup.controls.bankManagement.setValidators([]);
    this.paymentFormGroup.controls.chequeno.setValidators([]);
    this.paymentFormGroup.controls.onlinesource.setValidators([]);
    this.paymentFormGroup.updateValueAndValidity();
  }

  selPaySourceRecord(event) {
    const paySource = event.value.toLowerCase();
    switch (paySource) {
      case "cash_via_bank":
        this.paymentFormGroup.controls.destinationBank.enable();
        this.paymentFormGroup.controls.destinationBank.setValidators([Validators.required]);
        this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
        this.paymentFormGroup.controls.branch.enable();
        break;
      case "cash_in_hand":
        this.paymentFormGroup.controls.destinationBank.disable();
        this.paymentFormGroup.controls.destinationBank.clearValidators();
        this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
        this.paymentFormGroup.controls.branch.disable();
        break;
    }
  }

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
    if (this.selectedParentCust?.mvnoId) {
      this.systemService
        .getConfigurationByName("TDS", this.selectedParentCust?.mvnoId)
        .subscribe((res: any) => {
          this.tdsPercent = res.data.value;
        });
      this.systemService
        .getConfigurationByName("ABBS", this.selectedParentCust?.mvnoId)
        .subscribe((res: any) => {
          this.abbsPercent = res.data.value;
        });

      this.systemService
        .getConfigurationByName("CURRENCY_FOR_PAYMENT", this.selectedParentCust?.mvnoId)
        .subscribe((res: any) => {
          this.currency = res.data.value;
        });
      this.systemService
        .getConfigurationByName("CONVERTED_EXCHANGE_RATE", this.selectedParentCust?.mvnoId)
        .subscribe((res: any) => {
          this.convertedExchangeRate = parseFloat(res?.data?.value.replace(/,/g, "")) || 1;
        });
      this.getBankDetail(this.selectedParentCust?.mvnoId);
      this.getBankDestinationDetail(this.selectedParentCust?.mvnoId);
    }
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
    this.modalCloseParentCustomer();
    // if (this.selectedParentCust.id) {
    //   this.changeCustomer(this.selectedParentCust.id);
    // }
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

    searchParentData.filters[0].filterValue = this.searchParentCustValue;
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
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = "";
      this.fileName = event.target.files[0].name;
      this.file = event.target.files[0];
      // this.paymentFormGroup.patchValue({
      //   file: file,
      // });
    }
  }
  selectInvoice: boolean = false;
  modalOpenInvoice() {
    this.selectInvoice = true;
    this.newFirst = 0;
    this.isDisplayConvertedAmount = false;
    this.collectedCurrency = this.selectedParentCust?.currency
      ? this.selectedParentCust?.currency
      : this.currency;
    if (this.selectedParentCust.id) {
      this.changeCustomer(this.selectedParentCust.id);
    }
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (let i = 0; i < this.invoiceList.length; i++) {
      this.invoiceList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.invoiceList.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList() {
    this.checkedList = [];
    for (let i = 0; i < this.invoiceList.length; i++) {
      if (this.invoiceList[i].isSelected) {
        this.checkedList.push(this.invoiceList[i]);
      }
    }
  }

  // bindInvoice() {
  //   if (this.checkedList.length == 1) {
  //     this.paymentFormGroup.patchValue({
  //       invoiceId: this.checkedList[0].id,
  //       amount: this.checkedList[0].totalamount - this.checkedList[0].adjustedAmount,
  //     });
  //   }
  //   this.onChangeOFAmount(this.paymentFormGroup.controls.amount.value);
  //   if (this.checkedList.length == 0) {
  //     this.messageService.add({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Please select atleat one invoice or advance mode.",
  //       icon: "far fa-check-circle",
  //     });
  //   } else if (this.checkedList.length == 2) {
  //     this.checkedList.forEach(element => {
  //       if (element.docnumber == "Advance") {
  //         this.checkedList = [];
  //         this.invoiceList.forEach(element => {
  //           element.isSelected = false;
  //         });
  //         this.masterSelected = false;
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: "Please select advance mode value only.",
  //           icon: "far fa-check-circle",
  //         });
  //       }
  //     });
  //   }
  // }

  Amount: any = 0;
  bindInvoice() {
    if (this.checkedList.length >= 1) {
      this.selectInvoice = false;
      this.isShowInvoiceList = true;
      this.Amount = 0;
      this.checkedList.forEach(element => {
        if (element.testamount && element.totalamount !== null) {
          this.Amount += Number(element.testamount);
        }
      });
      this.paymentFormGroup.patchValue({
        invoiceId: this.checkedList[0].id,
        amount: parseFloat(this.Amount).toFixed(2)
      });
      this.onChangeOFAmountTest(this.checkedList);
    }
    if (this.checkedList.length == 0) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select atleast one invoice or advance mode.",
        icon: "far fa-check-circle"
      });
    } else if (this.checkedList.length == 2) {
      this.checkedList.forEach(element => {
        if (element.docnumber == "Advance") {
          this.checkedList = [];
          this.invoiceList.forEach(element => {
            element.isSelected = false;
          });
          this.masterSelected = false;
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please select advance mode value only.",
            icon: "far fa-check-circle"
          });
        }
      });
    }
  }

  openTaxModal(id) {
    this.invoiceList.forEach(element => {
      if (element.id == id) {
        this.taxData = element.debitDocumentTAXRels;
      }
    });
    if (this.taxData.length > 0) {
      $("#taxDetails").modal("show");
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Tax Data Not Found!",
        icon: "far fa-times-circle"
      });
    }
  }

  // calculateTDS(event) {
  //   if (!event.target.checked) {
  //     this.tdsInclude = false;
  //     this.paymentFormGroup.controls.tdsAmount.disable();
  //     this.paymentFormGroup.controls.tdsAmount.setValue(0);
  //   } else {
  //     this.tdsInclude = true;
  //     this.paymentFormGroup.controls.tdsAmount.enable();
  //     this.onChangeOFAmount(this.paymentFormGroup.controls.amount.value);
  //   }
  // }

  // calculateABBS(event) {
  //   if (!event.target.checked) {
  //     this.abbsInclude = false;
  //     this.paymentFormGroup.controls.abbsAmount.disable();
  //     this.paymentFormGroup.controls.abbsAmount.setValue(0);
  //   } else {
  //     this.abbsInclude = true;
  //     this.paymentFormGroup.controls.abbsAmount.enable();
  //     this.onChangeOFAmount(this.paymentFormGroup.controls.amount.value);
  //   }
  // }

  onChangeOFAmount(event) {
    const tdsAmount = (event * this.tdsPercent) / 100;
    const abbsAmount = (event * this.abbsPercent) / 100;

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

  // onChangeOFTDS(event) {
  //   const tdsAmount = event;
  //   const abbsAmount = this.paymentFormGroup.controls.abbsAmount.value;
  //   const totalAmount = this.paymentFormGroup.controls.amount.value;
  //   const diff = totalAmount - abbsAmount - tdsAmount;

  //   if (diff < 0 && tdsAmount != 0) {
  //     this.paymentFormGroup.controls.tdsAmount.setValue(0);
  //   }
  // }

  // onChangeOFABBS(event) {
  //   const abbsAmount = event;
  //   const tdsAmount = this.paymentFormGroup.controls.tdsAmount.value;
  //   const totalAmount = this.paymentFormGroup.controls.amount.value;
  //   const diff = totalAmount - abbsAmount - tdsAmount;

  //   if (diff < 0 && abbsAmount != 0) {
  //     this.paymentFormGroup.controls.abbsAmount.setValue(0);
  //   }
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
  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onChangeOFTDSTest(event, data) {
    if (event && data.testamount) {
      data.tdsCheck = ((data.totalamount * this.tdsPercent) / 100).toFixed(2);
    } else {
      data.tdsCheck = 0;
    }
  }

  onChangeOFABBSTest(event, data) {
    if (event && data.testamount) {
      data.abbsCheck = ((data.totalamount * this.abbsPercent) / 100).toFixed(2);
    } else {
      data.abbsCheck = 0;
    }
  }
  isTdsFlag: boolean = false;
  isAbbsFlag: boolean = false;
  testamount: number = 0;
  onChangeOFAmountTest(event) {
    if (this.checkedList.length >= 1) {
      let formPayModeValue = this.paymentFormGroup.controls.paymode.value.toLowerCase();
      let isAbbsTdsMode = this.checkPaymentMode(formPayModeValue);
      let totaltdsAmount = 0;
      let totalabbsAmount = 0;
      this.checkedList.forEach(element => {
        let tds = 0;
        let abbs = 0;
        if (element.includeTds && element.testamount != null && element.testamount > 0) {
          if (element.includeTds === true) {
            tds = Number(element.tdsCheck);
            totaltdsAmount = Number(element.tdsCheck) + Number(totaltdsAmount);
            this.isTdsFlag = true;
          }
        }
        if (element.includeAbbs && element.testamount != null && element.testamount > 0) {
          if (element.includeAbbs === true) {
            abbs = Number(element.abbsCheck);
            totalabbsAmount = Number(element.abbsCheck) + Number(totalabbsAmount);
            this.isAbbsFlag = true;
          }
        }
        if (isAbbsTdsMode) {
          element.tds = 0;
          element.abbs = 0;
        } else {
          element.tds = tds;
          element.abbs = abbs;
        }
      });
      const tdsAmount = totaltdsAmount;
      const abbsAmount = totalabbsAmount;

      if (isAbbsTdsMode) {
        this.paymentFormGroup.controls.abbsAmount.setValue(0);
        this.paymentFormGroup.controls.tdsAmount.setValue(0);
      } else {
        if (this.isAbbsFlag) {
          this.paymentFormGroup.controls.abbsAmount.setValue(abbsAmount);
        }
        if (this.isTdsFlag) {
          this.paymentFormGroup.controls.tdsAmount.setValue(tdsAmount);
        }
      }
    }
  }
  isSelectedInvoice = true;
  onSelectedInvoice(event, data) {
    if (event > 0) {
      // this.isSelectedInvoice = false;
      // if (data.includeTds) {
      //   data.tdsCheck = (data.testamount * this.tdsPercent) / 100;
      // }
      // if (data.includeAbbs) {
      //   data.abbsCheck = (data.testamount * this.abbsPercent) / 100;
      // }
    } else {
      data.includeTds = false;
      data.includeAbbs = false;
      data.tdsCheck = 0;
      data.abbsCheck = 0;
    }
    data.convertedAmount = data.testamount * this.convertedExchangeRate;
  }

  closeInvoiceListModel() {
    this.selectInvoice = false;
    this.masterSelected = false;
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

  onCurrencyChange(event: any, invoice: any) {
    // invoice.selectedCurrency = event.value;
    // invoice.isDisplayConvertedAmount = event.value !== this.customerLedgerDetailData?.currency;
    this.isDisplayConvertedAmount =
      event.value !=
      (this.selectedParentCust?.currency ? this.selectedParentCust?.currency : this.currency);
  }

  onConvertedAmountChange(event, data) {
    data.testamount = event / this.convertedExchangeRate;
    // data.convertedAmount = event;
  }

  onConvertedRateChange() {
    this.invoiceList.forEach(element => {
      element.convertedAmount = element.testamount * this.convertedExchangeRate;
    });
  }

  openStaffWallet() {
    let staffId = localStorage.getItem("userId");
    const url =
      "/staff_ledger_details/walletAmount/" + staffId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.staffService.getFromCMS(url).subscribe((response: any) => {
      this.WalletAmount = response.availableAmount;
    });
  }
  allowNumbersOnly(event: any) {
    const value = event.target.value;
    event.target.value = value.replace(/[^0-9]/g, "");
    this.paymentFormGroup.controls.chequeno.setValue(event.target.value);
  }
}
