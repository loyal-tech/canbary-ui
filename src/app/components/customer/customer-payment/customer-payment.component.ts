import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { ConfirmationService, MessageService } from "primeng/api";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Regex } from "src/app/constants/regex";
import { SearchPaymentService } from "src/app/service/search-payment.service";
import * as FileSaver from "file-saver";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { sortBy } from "lodash";
import { StaffService } from "src/app/service/staff.service";

declare var $: any;

@Component({
  selector: "app-customer-payment",
  templateUrl: "./customer-payment.component.html",
  styleUrls: ["./customer-payment.component.scss"]
})
export class CustomerPaymentComponent implements OnInit {
  custType: any;
  loggedInStaffId = localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  customerId: number;
  showError: boolean = false;
  customerLedgerDetailData: any;
  isDisable: boolean = false;
  customerPaymentdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  paymentShowItemPerPage = 1;
  viewcustomerPaymentData: any;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  invoiceList = [];
  masterSelected: boolean;
  invoicedropdownValue = [{ docnumber: "Advance", id: 0 }];
  customerData: any;
  paymentFormGroup: FormGroup;
  searchData: any = {};
  chequeDetail = [];
  showChequeDetails: boolean = false;
  AclClassConstants;
  AclConstants;
  currentPagecustomerPaymentdata = 1;
  newFirst = 0;
  selectedInvoice: any = [];
  isSelectedInvoice = true;
  tdsPercent: number;
  abbsPercent: number;
  isShowInvoiceList: boolean = false;
  destinationbank: boolean = false;
  Amount: any = 0;
  isTdsFlag: boolean = false;
  isAbbsFlag: boolean = false;
  chequeDateName = "Cheque Date";
  paymentMode = [];
  test: any = "true";
  fileName: any;
  file: any = "";
  submitted = false;
  createPaymentData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  paymentId = new BehaviorSubject({
    paymentId: ""
  });
  displayInvoiceDetails: boolean = false;
  currency: string;
  systemConfigCurrency: string;
  collectedCurrency: string;
  displayRecordPaymentDialog: boolean = false;
  displayFailedPaymentDialog: boolean = false;
  displaySelectInvoiceDialog: boolean = false;
  recordPaymentAccess: boolean = false;
  selectedCheckboxStates: boolean[] = [];
  viewcustomerFailedPaymentData: any = [];

  bankDataList: any;
  bankDestination: any;
  failureReasonDialog: boolean = false;
  transModal: boolean = false;
  transactionNo: any;
  addToWalletOrderId: any;
  failureReason: string = "";
  retryPaymentAccess: boolean = false;
  manuallySettlement: boolean = false;
  verifyBudpaystatus: any;

  isDisplayConvertedAmount: boolean = false;
  convertedExchangeRate: any;
  staffWalletLimit: number = 0;
  WalletDataAmount: number = 0;
  today: string;
  paymentApprovalHeader: boolean = false;
  paymentMsg: any;
  apiExchangeRate: number;
  savedInvoice: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private revenueManagementService: RevenueManagementService,
    private route: ActivatedRoute,
    private router: Router,
    private recordPaymentService: RecordPaymentService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private searchPaymentService: SearchPaymentService,
    public loginService: LoginService,
    public commondropdownService: CommondropdownService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private systemService: SystemconfigService,
    private confirmationService: ConfirmationService,
    private staffService: StaffService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;

    this.recordPaymentAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PAYMENT_RECORD
        : POST_CUST_CONSTANTS.POST_CUST_PAYMENT_RECORD
    );
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.retryPaymentAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.RETRY_PAYMENTSTATUS
        : POST_CUST_CONSTANTS.POST_RETRY_PAYMENTSTATUS
    );
    this.manuallySettlement = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.MANUALLY_SETTLEMENT
        : POST_CUST_CONSTANTS.POST_MANUALLY_SETTLEMENT
    );
  }

  async ngOnInit() {
    this.today = new Date().toISOString().split("T")[0];
    this.selectedCheckboxStates = this.invoiceList.map(invoice => invoice.isSelected);
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

    this.getCustomersDetail(this.customerId);
    this.getPaymentMode();
    this.resetPayMode();
    this.commondropdownService.getAllCurrencyData();
  }
  paymentData: any;
  retryPayment(orderId) {
    this.paymentData = [];
    const url = "/ByOrderId?orderId=" + orderId;
    this.customerManagementService.getMethodForIntegration(url).subscribe(
      (response: any) => {
        // this.paymentData = response.onlineAuditData;
        this.getFailedPayments();
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
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;

    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerLedgerDetailData = response.customers;
      this.openStaffWallet();
      this.getBankDetail();
      this.getBankDestinationDetail();
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.customerLedgerDetailData?.mvnoId
          : localStorage.getItem("mvnoId");
      this.systemService
        .getConfigurationByName("CONVERTED_EXCHANGE_RATE", mvnoId)
        .subscribe((res: any) => {
          this.apiExchangeRate = parseFloat(res?.data?.value.replace(/,/g, "")) || 1;
          this.convertedExchangeRate = this.apiExchangeRate;
        });
      this.systemService.getConfigurationByName("STAFF_WALLET_LIMIT").subscribe((res: any) => {
        this.staffWalletLimit = res?.data ? Number(res?.data?.value) : 0;
      });
      this.systemService.getConfigurationByName("TDS", mvnoId).subscribe((res: any) => {
        this.tdsPercent = res.data.value;
      });
      this.systemService.getConfigurationByName("ABBS", mvnoId).subscribe((res: any) => {
        this.abbsPercent = res.data.value;
      });
      this.openCustomersPaymentData(this.customerId, "");
      this.customerLedgerDetailData?.currency
        ? (this.currency = this.customerLedgerDetailData?.currency)
        : this.systemService
            .getConfigurationByName("CURRENCY_FOR_PAYMENT")
            .subscribe((res: any) => {
              this.currency = res.data.value;
            });
    });
  }

  openCustomersPaymentData(id, size) {
    if (
      this.customerLedgerDetailData.parentCustomerId == "null" ||
      this.customerLedgerDetailData.invoiceType == "Group"
    ) {
      this.isDisable = true;
    }
    let page_list;

    if (size) {
      page_list = size;
      this.customerPaymentdataitemsPerPage = size;
    } else {
      if (this.paymentShowItemPerPage == 1) {
        this.customerPaymentdataitemsPerPage = this.pageITEM;
      } else {
        this.customerPaymentdataitemsPerPage = this.paymentShowItemPerPage;
      }
    }

    const url = "/paymentHistory/" + id;
    this.revenueManagementService.paymentData(url).subscribe((response: any) => {
      this.viewcustomerPaymentData = response.dataList;
      this.InvoiceListByCustomer(id);
    });
  }

  InvoiceListByCustomer(id) {
    const url = "/invoiceList/byCustomer/" + id;
    this.invoiceList = [];
    const Data = [];
    this.masterSelected = false;

    this.revenueManagementService.getAllInvoiceByCustomer(url).subscribe(
      (response: any) => {
        const invoicedata = [];

        if (response.invoiceList != null && response.invoiceList.length != 0) {
          this.invoiceList.push(...response.invoiceList);
        } else {
          this.invoiceList.push(...this.invoicedropdownValue);
        }

        this.invoiceList.forEach(item => {
          item.tdsCheck = 0;
          item.abbsCheck = 0;
          item.tds = 0;
          item.abbs = 0;
          item.includeTds = false;
          item.includeAbbs = false;
          item.testamount = this.getPendingAmount(item);
          item.convertedAmount = item.testamount * this.convertedExchangeRate;
          item.currency = this.customerLedgerDetailData?.currency
            ? this.customerLedgerDetailData?.currency
            : this.currency;
        });

        if (this.selectedInvoice && this.selectedInvoice.length > 0) {
          this.invoiceList.forEach(inv => {
            const match = this.selectedInvoice.find(sel => sel.id === inv.id);
            if (match) {
              inv.isSelected = true;
            }
          });
        }
        this.masterSelected = this.selectedInvoice.length === this.invoiceList.length;
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

  onCurrencyChange(event: any, invoice: any) {
    // invoice.selectedCurrency = event.value;
    // invoice.isDisplayConvertedAmount = event.value !== this.customerLedgerDetailData?.currency;
    this.isDisplayConvertedAmount =
      event.value !=
      (this.customerLedgerDetailData?.currency
        ? this.customerLedgerDetailData?.currency
        : this.currency);
  }

  //   get shouldShowCollectedAmountColumnonInvoice(): boolean {
  //     return this.selectedInvoice?.some(row => row.isDisplayConvertedAmount);
  //   }

  //   get shouldShowCollectedAmountColumn():boolean{
  //     return this.invoiceList?.some(row=>row.isDisplayConvertedAmount);
  //   }

  getPendingAmount(item) {
    var amount = 0;
    if (item.adjustedAmount) {
      amount = item.totalamount - item.adjustedAmount;
    } else if (item.pendingAmt) {
      amount = item.totalamount - item.pendingAmt;
    } else if (item.adjustedAmount) {
      amount = item.totalamount - item.adjustedAmount;
    } else {
      amount = item.totalamount;
    }
    if (amount) return amount.toFixed(2);
    else return 0;
  }

  getCustomer() {
    this.displayRecordPaymentDialog = true;
    this.savedInvoice = false;
    // this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
    //   this.systemConfigCurrency = res.data.value;
    //   this.isDisplayConvertedAmount =
    //     this.systemConfigCurrency != this.customerLedgerDetailData?.currency;
    // });
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerLedgerDetailData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url = "/customers/list?mvnoId=" + mvnoId;
    const custerlist = {};
    this.recordPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
        this.paymentFormGroup.patchValue({
          customerid: this.customerLedgerDetailData.id
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

  getPaymentApproval(selectedInvoiceIds) {
    let invoiceIds = selectedInvoiceIds.map(x => x.id);
    let obj = { invoiceId: invoiceIds, customerid: this.customerId };
    const url = "/recordPaymentStatusByInvoiceIds";
    this.revenueManagementService.postMethod(url, obj).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.paymentApprovalHeader = true;
          this.paymentMsg = response.responseMessage;
        } else if (response.responseCode == 204) {
          this.paymentApprovalHeader = false;
          this.displayRecordPaymentDialog = true;
          //   this.paymentMsg = response.responseMessage;
        }
      },
      (error: any) => {
        this.paymentApprovalHeader = false;
        this.displayRecordPaymentDialog = true;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  paymentApproval() {
    this.paymentApprovalHeader = false;
  }

  closePyamentApproval() {
    this.displayRecordPaymentDialog = false;
    this.paymentApprovalHeader = false;
  }

  addToWallet(orderId) {
    this.transModal = true;
    this.addToWalletOrderId = orderId;
  }
  openPaymentModal(id) {
    if (this.searchData.filters) {
      this.searchData.filters[0].filterValue = "";
      this.searchData.filters[0].filterColumn = "";
      this.searchData.page = "";
      this.searchData.pageSize = "";
    }

    let url = "/getChequeDetail/" + id;
    this.searchPaymentService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.chequeDetail = response.dataList;
        this.showChequeDetails = true;
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

  openPaymentInvoiceModal(id, paymentId) {
    // this.PaymentamountService.show(id);
    this.displayInvoiceDetails = true;
    this.paymentId.next({
      paymentId
    });
  }

  downloadInvoice(docId, custId, fileName) {
    const url = "/documentForInvoice/download/" + docId + "/" + custId;
    this.revenueManagementService.downloadInvoice(url).subscribe(
      (response: any) => {
        var fileType = "";
        var file = new Blob([response], { type: "application/pdf" });
        var fileURL = URL.createObjectURL(file);
        FileSaver.saveAs(file, fileName);
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

  pageChangedcustomerPaymentList(pageNumber) {
    this.currentPagecustomerPaymentdata = pageNumber;
    this.openCustomersPaymentData(this.customerId, "");
  }

  TotalPaymentItemPerPage(event) {
    this.paymentShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerPaymentdata > 1) {
      this.currentPagecustomerPaymentdata = 1;
    }
    this.openCustomersPaymentData(this.customerLedgerDetailData.id, this.paymentShowItemPerPage);
  }

  modalOpenInvoice(id) {
    this.displaySelectInvoiceDialog = true;
    this.isDisplayConvertedAmount = false;
    this.collectedCurrency = this.customerLedgerDetailData?.currency
      ? this.customerLedgerDetailData?.currency
      : this.currency;
    if (id) {
      this.InvoiceListByCustomer(id);
    }
    this.newFirst = 0;
  }

  checkUncheckAllInvoice() {
    for (let i = 0; i < this.invoiceList.length; i++) {
      this.invoiceList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemListInvoice();
  }

  getCheckedItemListInvoice() {
    this.selectedInvoice = [];
    for (let i = 0; i < this.invoiceList.length; i++) {
      if (this.invoiceList[i].isSelected) {
        this.selectedInvoice.push(this.invoiceList[i]);
      }
    }
  }

  isAllSelectedInvoice() {
    this.masterSelected = this.invoiceList.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemListInvoice();
  }

  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSelectedInvoice(event, data, isTDS, isABBS) {
    if (event > 0) {
      this.isSelectedInvoice = false;
      if (isTDS) {
        data.tdsCheck = ((data.testamount * this.tdsPercent) / 100).toFixed(2);
      }
      if (isABBS) {
        data.abbsCheck = ((data.testamount * this.abbsPercent) / 100).toFixed(2);
      }
    } else {
      //   data.includeTds = false;
      //   data.includeAbbs = false;
      data.tdsCheck = 0;
      data.abbsCheck = 0;
    }
    data.convertedAmount = data.testamount * this.convertedExchangeRate;
  }

  onConvertedAmountChange(event, data) {
    data.testamount = event / this.convertedExchangeRate;
    // data.convertedAmount = event;
  }

  onChangeOFTDSTest(event, data) {
    if (event.checked && data.totalamount) {
      data.includeTds = true;
      data.tdsCheck = ((data.testamount * this.tdsPercent) / 100).toFixed(2);
      data.tds = ((data.testamount * this.tdsPercent) / 100).toFixed(2);
    } else {
      data.includeTds = false;
      data.tdsCheck = 0;
      data.tds = 0;
    }
  }

  onChangeOFABBSTest(event, data) {
    if (event.checked && data.totalamount) {
      data.includeAbbs = true;
      data.abbsCheck = ((data.testamount * this.abbsPercent) / 100).toFixed(2);
      data.abbs = ((data.testamount * this.abbsPercent) / 100).toFixed(2);
    } else {
      data.includeAbbs = false;
      data.abbsCheck = 0;
      data.abbs = 0;
    }
  }

  modalCloseInvoiceList() {
    if (this.savedInvoice) {
      this.convertedExchangeRate = this.apiExchangeRate;
      const ids = this.selectedInvoice.map(item => item.id);
      const totalAmount = this.selectedInvoice.reduce((sum, item) => {
        return sum + (item.testamount ? parseFloat(item.testamount) : 0);
      }, 0);
      this.paymentFormGroup.patchValue({
        invoiceId: ids,
        amount: parseFloat(totalAmount.toFixed(2))
      });
      this.isShowInvoiceList = true;
      this.displaySelectInvoiceDialog = false;
      this.newFirst = 0;
      this.destinationbank = this.selectedInvoice.length > 0;
    } else {
      this.displaySelectInvoiceDialog = false;
    }
  }

  saveSelInvoice() {
    this.modalCloseInvoiceList();
  }

  bindInvoice() {
    this.savedInvoice = true;
    this.convertedExchangeRate = this.apiExchangeRate;
    if (this.selectedInvoice.length >= 1) {
      this.isShowInvoiceList = true;
      this.Amount = 0;
      this.selectedInvoice.forEach(element => {
        if (element.testamount !== null) {
          this.Amount += parseFloat(element.testamount);
        }
      });
      this.paymentFormGroup.patchValue({
        invoiceId: this.selectedInvoice.map(item => item.id),
        amount: this.Amount.toFixed(2)
      });
      this.onChangeOFAmountTest(this.selectedInvoice);
      this.destinationbank = true;
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Please select at least one invoice or advance mode.",
        icon: "far fa-check-circle"
      });
    }
    if (this.selectedInvoice.length == 2) {
      this.selectedInvoice.forEach(element => {
        if (element.docnumber == "Advance") {
          this.selectedInvoice = [];
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
    this.getPaymentApproval(this.selectedInvoice);
    this.displaySelectInvoiceDialog = false;
  }

  onChangeOFAmountTest(event) {
    if (this.selectedInvoice.length >= 1) {
      let isAbbsTdsMode: boolean = false;
      if (this.paymentFormGroup.controls.paymode.value) {
        let formPayModeValue = this.paymentFormGroup.controls.paymode.value.toLowerCase();
        isAbbsTdsMode = this.checkPaymentMode(formPayModeValue);
      }
      let totaltdsAmount = 0;
      let totalabbsAmount = 0;
      this.selectedInvoice.forEach(element => {
        let tds = 0;
        let abbs = 0;
        if (element.includeTds) {
          if (element.includeTds === true) {
            tds = Number(element.tdsCheck);
            totaltdsAmount = Number(element.tdsCheck) + Number(totaltdsAmount);
            this.isTdsFlag = true;
          }
        }
        if (element.includeAbbs) {
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
        // if (this.isAbbsFlag) {
        this.paymentFormGroup.controls.abbsAmount.setValue(abbsAmount);
        // }
        // if (this.isTdsFlag) {
        this.paymentFormGroup.controls.tdsAmount.setValue(tdsAmount);
        // }
      }
    }
  }

  checkPaymentMode(formPayModeValue) {
    if (
      formPayModeValue &&
      (formPayModeValue == "vatreceiveable" ||
        formPayModeValue == "tds" ||
        formPayModeValue == "abbs")
    ) {
      return true;
    } else {
      return false;
    }
  }

  closeInvoiceModel() {
    this.invoiceList = [];
    this.masterSelected = false;
    this.displaySelectInvoiceDialog = false;
  }

  onlineSourceData = [];
  async selPayModeRecord(event) {
    this.resetPayMode();
    this.paymentFormGroup.patchValue({
      chequeno: null,
      chequedate: null,
      branch: null
    });
    const payMode = event.value.toLowerCase();
    if (payMode == "POS".toLowerCase() || payMode == "VatReceiveable".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      //   this.paymentFormGroup.controls.referenceno.clearValidators();
      this.paymentFormGroup.controls.reciptNo.enable();
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
      this.paymentFormGroup.get("reciptNo")?.reset();
      this.paymentFormGroup.controls.reciptNo.disable();
      this.paymentFormGroup.controls.reciptNo.updateValueAndValidity();
      this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
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
    } else if (payMode == "Cheque".toLowerCase()) {
      this.paymentFormGroup.controls.chequedate.enable();
      this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
      this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
      this.paymentFormGroup.controls.bankManagement.enable();
      this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
      this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
      this.paymentFormGroup.controls.chequeno.enable();
      this.paymentFormGroup.controls.chequeno.setValidators([Validators.required]);
      //   this.paymentFormGroup.controls.referenceno.clearValidators();
      //   this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
      this.paymentFormGroup.controls.reciptNo.enable();
      this.paymentFormGroup.controls.branch.enable();
      this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
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
      if (this.selectedInvoice.length > 0) {
        this.selectedInvoice.map(element => {
          element.tds = 0;
          element.abbs = 0;
        });
      }
    }
  }

  resetPayMode() {
    this.paymentFormGroup.get("chequeno")?.reset();
    this.paymentFormGroup.get("chequedate")?.reset();
    this.paymentFormGroup.get("bankManagement")?.reset();
    this.paymentFormGroup.get("branch")?.reset();
    this.paymentFormGroup.get("destinationBank")?.reset();
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

  getBankDetail() {
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerLedgerDetailData?.mvnoId
        : localStorage.getItem("mvnoId");
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

  getBankDestinationDetail() {
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerLedgerDetailData?.mvnoId
        : localStorage.getItem("mvnoId");
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

  getPaymentMode() {
    const url = "/commonList/paymentMode";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.paymentMode = response.dataList;
      },
      (error: any) => {}
    );
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
        this.paymentFormGroup.get("destinationBank")?.reset();
        this.paymentFormGroup.controls.destinationBank.disable();
        this.paymentFormGroup.controls.destinationBank.clearValidators();
        this.paymentFormGroup.controls.destinationBank.updateValueAndValidity();
        this.paymentFormGroup.get("branch")?.reset();
        this.paymentFormGroup.controls.branch.disable();
        this.paymentFormGroup.controls.branch.clearValidators();
        this.paymentFormGroup.controls.branch.updateValueAndValidity();
        break;
      case "cheque_in_hand":
        this.paymentFormGroup.controls.chequedate.enable();
        this.paymentFormGroup.controls.chequedate.setValidators([Validators.required]);
        this.paymentFormGroup.controls.chequedate.updateValueAndValidity();
        this.paymentFormGroup.controls.bankManagement.enable();
        this.paymentFormGroup.controls.bankManagement.setValidators([Validators.required]);
        this.paymentFormGroup.controls.bankManagement.updateValueAndValidity();
        this.paymentFormGroup.controls.chequeno.enable();
        this.paymentFormGroup.controls.chequeno.setValidators([Validators.required]);
        // this.paymentFormGroup.controls.referenceno.clearValidators();
        // this.paymentFormGroup.controls.referenceno.updateValueAndValidity();
        this.paymentFormGroup.controls.reciptNo.enable();
        this.paymentFormGroup.controls.branch.enable();
        this.paymentFormGroup.controls.chequeno.updateValueAndValidity();
        break;
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.file = "";
      this.fileName = event.target.files[0].name;
      this.file = event.target.files[0];
    }
  }

  addPayment(paymentId) {
    this.submitted = true;
    if (this.paymentFormGroup.valid) {
      let totalAmount = Number(this.WalletDataAmount) + Number(this.paymentFormGroup?.value.amount);
      if (this.paymentFormGroup.value.invoiceId == 0) {
        this.paymentFormGroup.value.paytype = "advance";
      } else {
        this.paymentFormGroup.value.paytype = "invoice";
      }

      if (this.selectedInvoice.length == 0) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Please select atleat one invoice or advance mode.",
          icon: "far fa-check-circle"
        });
        return;
      }
      const maxSize = 1048576; // 1MB
      if (this.file && this.file.size > maxSize) {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "File size cannot exceed 1MB.",
          icon: "far fa-info-circle"
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
          let mvnoId =
            localStorage.getItem("mvnoId") === "1"
              ? this.customerLedgerDetailData?.mvnoId
              : localStorage.getItem("mvnoId");
          const url = "/record/payment?mvnoId=" + mvnoId;
          this.paymentFormGroup.value.customerid = this.customerLedgerDetailData.id;
          this.paymentFormGroup.value.type = "Payment";
          this.createPaymentData = this.paymentFormGroup.value;
          this.createPaymentData.onlinesource = this.paymentFormGroup.controls.onlinesource.value;
          if (this.paymentFormGroup.controls.chequedate.value) {
            this.createPaymentData.chequedate = this.paymentFormGroup.controls.chequedate.value;
            this.createPaymentData.chequedatestr = this.paymentFormGroup.controls.chequedate.value;
          }
          this.createPaymentData.filename = this.fileName;
          let invoiceId = [];
          this.selectedInvoice.forEach(element => {
            invoiceId.push(element.id);
          });
          this.createPaymentData.invoiceId = invoiceId;
          // this.createPaymentData.invoices = invoices;
          delete this.createPaymentData.file;
          const formData = new FormData();
          var paymentListPojos = [];
          this.selectedInvoice.forEach(element => {
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
              this.destinationbank = false;
              this.paymentFormGroup.reset();
              this.openCustomersPaymentData(this.customerId, "");
              this.currentPagecustomerPaymentdata = 1;
              this.invoiceList = [];
              this.file = "";
              this.fileName = null;
              this.isShowInvoiceList = false;
              this.messageService.add({
                severity: "success",
                summary: "Payment Created Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.displayRecordPaymentDialog = false;
              this.selectedInvoice = [];
            },
            (error: any) => {
              if (error.error.status === 409) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: error.error.ERROR,
                  icon: "far fa-info-circle"
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
    }
    this.displayRecordPaymentDialog = false;
  }

  closePaymentForm() {
    this.paymentFormGroup.reset();
    this.displayRecordPaymentDialog = false;
    this.submitted = false;
    this.isShowInvoiceList = false;
    this.selectedInvoice = [];
    if (this.invoiceList && this.invoiceList.length > 0) {
      this.invoiceList.forEach(item => {
        item.isSelected = false;
        item.testamount = null;
        item.tdsCheck = 0;
        item.abbsCheck = 0;
        item.includeTds = false;
        item.includeAbbs = false;
      });
    }
    this.masterSelected = false;
    this.file = "";
    this.fileName = null;
  }

  getFailedPayments() {
    this.viewcustomerFailedPaymentData = [];
    const url = "/onlinePayAudit/allByCustId?custId=" + this.customerId;
    this.customerManagementService.getMethodForIntegration(url).subscribe(
      (response: any) => {
        this.viewcustomerFailedPaymentData = response.onlineAuditData;
        if (this.viewcustomerFailedPaymentData.length !== 0) {
          this.displayFailedPaymentDialog = true;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Payment Found !! ",
            icon: "far fa-times-circle"
          });
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
  closeFailedPaymentForm() {
    this.displayFailedPaymentDialog = false;
  }

  openFailureReason(data) {
    this.failureReason = data;
    this.failureReasonDialog = true;
  }
  closeFailureReason() {
    this.failureReasonDialog = false;
    this.failureReason = "";
  }

  addToWalletAPI() {
    const url =
      "/addToWalletByOrderId?orderId=" +
      this.addToWalletOrderId +
      "&transactionId=" +
      this.transactionNo;
    this.recordPaymentService.postMethodForIntegration(url, null).subscribe(
      (response: any) => {
        if (response?.responseCode === 500) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response?.data,
            icon: "far fa-times-circle"
          });
          return;
        }
        if ([405, 406, 417, 415].includes(response?.responseCode)) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response?.data,
            icon: "far fa-info-circle"
          });
          return;
        }
        this.customerData = response.customerList;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: response?.data,
          icon: "far fa-check-circle"
        });
        this.transModal = false;
        this.addToWalletOrderId = "";
        this.transactionNo = "";
        this.getFailedPayments();
      },
      (error: any) => {
        console.error("Error:", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  ConfirmonTransactionNumber() {
    if (this.addToWalletOrderId) {
      this.confirmationService.confirm({
        message: "Do you want to confirm this transaction no?",
        header: "Transaction No Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.addToWalletAPI();
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    }
  }

  transactionModal() {
    this.transModal = false;
    this.addToWalletOrderId = "";
    this.transactionNo = "";
  }

  onConvertedRateChange() {
    this.invoiceList.forEach(element => {
      element.convertedAmount = element.testamount * this.convertedExchangeRate;
    });
  }

  openStaffWallet() {
    let staffId = localStorage.getItem("userId");
    let mvnoId = localStorage.getItem("mvnoId");
    const url = "/staff_ledger_details/walletAmount/" + staffId + "?mvnoId=" + mvnoId;
    this.staffService.getFromCMS(url).subscribe((response: any) => {
      this.WalletDataAmount = response.availableAmount;
    });
  }

  verifyBudpay(orderId) {
    const url = "/verifyBudPayPayment?reference=" + orderId;
    this.customerManagementService.getActivePlanList(url).subscribe(
      (response: any) => {
        if (response.responseCode === 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          return;
        }
        this.verifyBudpaystatus = response.dataList;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.responseMessage,
          icon: "far fa-check-circle"
        });
        this.getFailedPayments();
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
  allowNumbersOnly(event: any) {
    const value = event.target.value;
    event.target.value = value.replace(/[^0-9]/g, "");
    this.paymentFormGroup.controls.chequeno.setValue(event.target.value);
  }
}
