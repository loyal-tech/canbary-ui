import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { RevenueManagementService } from "src/app/service/RevenueManagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { LoginService } from "src/app/service/login.service";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Regex } from "src/app/constants/regex";
import { StaffService } from "src/app/service/staff.service";
import { PaymentAmountModelComponent } from "../../payment-amount-model/payment-amount-model.component";
import { BehaviorSubject } from "rxjs";
import * as FileSaver from "file-saver";
import { PaymentamountService } from "src/app/service/paymentamount.service";

@Component({
  selector: "app-customer-caf-payment",
  templateUrl: "./customer-caf-payment.component.html",
  styleUrls: ["./customer-caf-payment.component.css"]
})
export class CustomerCafPaymentComponent implements OnInit {
  customerId = 0;
  custType: string = "";
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerNotesList: any = [];
  totalRecords: number;
  customerDetailData: any;
  viewCustomerPaymentList = false;
  staffData: any = [];
  staffDetailModal: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  customerPaymentdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  paymentShowItemPerPage = 1;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  viewcustomerPaymentData: any;
  invoiceList: any;

  tdsPercent: any;
  abbsPercent: any;
  paymentMode: any;
  bankDataList: any;
  bankDestination: any;
  file: any = "";

  currency: any;
  paymentFormGroup: FormGroup;
  systemConfigCurrency: string;
  recordPaymentAccess: any;
  displayRecordPaymentDialog: boolean;
  customerData: any;
  fileName: any;
  customerIdRecord: any;
  WalletDataAmount: any;
  staffWalletLimit: number;
  viewcustomerFailedPaymentData: any[];
  displayFailedPaymentDialog: boolean;
  displayInvoiceDetails: boolean = false;
  PaymentDetailModal: PaymentAmountModelComponent;
  paymentId = new BehaviorSubject({
    paymentId: ""
  });
  customerPaymentdatatotalRecords: String;
  currentPagecustomerPaymentdata = 1;
  submitted: boolean;
  isShowInvoiceList: boolean;
  selectedInvoice: any[];
  masterSelected: boolean;
  invoicedropdownValue = [{ docnumber: "Advance", id: 0 }];
  convertedExchangeRate: any;
  displaySelectInvoiceDialog: boolean;
  isDisplayConvertedAmount: boolean;
  collectedCurrency: string;
  newFirst = 0;
  chequeDateName = "Cheque Date";
  onlineSourceData: any;
  createPaymentData: any;
  destinationbank: boolean;
  checkedList: any[];
  Amount: any = 0;
  isTdsFlag: boolean = false;
  isAbbsFlag: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private revenueManagementService: RevenueManagementService,
    public commondropdownService: CommondropdownService,
    private systemService: SystemconfigService,
    private loginService: LoginService,
    private recordPaymentService: RecordPaymentService,
    public fb: FormBuilder,
    private staffService: StaffService,
    public PaymentamountService: PaymentamountService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.recordPaymentAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_PAYMENT_RECORD
        : POST_CUST_CONSTANTS.POST_CUST_PAYMENT_RECORD
    );
  }

  ngOnInit() {
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
    this.commondropdownService.getAllCurrencyData();
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
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.customerDetailData?.mvnoId
            ? this.customerDetailData?.mvnoId
            : localStorage.getItem("mvnoId")
          : localStorage.getItem("mvnoId");
      this.customerDetailData?.currency
        ? (this.currency = this.customerDetailData?.currency)
        : this.systemService
            .getConfigurationByName("CURRENCY_FOR_PAYMENT", mvnoId)
            .subscribe((res: any) => {
              this.currency = res.data.value;
            });
      this.systemService.getConfigurationByName("TDS", mvnoId).subscribe((res: any) => {
        this.tdsPercent = res.data.value;
      });
      this.systemService.getConfigurationByName("ABBS", mvnoId).subscribe((res: any) => {
        this.abbsPercent = res.data.value;
      });
      this.systemService
        .getConfigurationByName("CONVERTED_EXCHANGE_RATE", mvnoId)
        .subscribe((res: any) => {
          this.convertedExchangeRate = parseFloat(res?.data?.value.replace(/,/g, "")) || 1;
        });
      this.getBankDestinationDetail(mvnoId);
      this.getBankDetailType(mvnoId);
      this.openCustomersPaymentData(this.customerDetailData.id, this.paymentShowItemPerPage);
    });
  }

  openCustomersPaymentData(id, size) {
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
    });
    this.paymentModeData();
  }

  getBankDetailType(mvnoId) {
    const url = `/bankManagement/searchByStatus?banktype=other&mvnoId=${mvnoId}`;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
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

  getBankDestinationDetail(mvnoId?: any): void {
    let actualMvnoId: number | null = null;

    if (mvnoId !== undefined && mvnoId !== null) {
      actualMvnoId = mvnoId;
    } else {
      const storedMvnoId = localStorage.getItem("mvnoId");

      if (storedMvnoId === "1") {
        actualMvnoId = this.customerDetailData?.mvnoId || null;
      } else if (storedMvnoId !== null) {
        actualMvnoId = Number(storedMvnoId);
      }
    }
    const url = `/bankManagement/searchByStatus?banktype=operator&mvnoId=${actualMvnoId}`;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDestination = response.dataList;
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error?.error?.ERROR || "Failed to fetch bank details.",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  paymentModeData() {
    const url = "/commonList/paymentMode";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.paymentMode = response.dataList;
      },
      (error: any) => {}
    );
  }

  getCustomerPaymentRecord() {
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.customerDetailData?.mvnoId
          ? this.customerDetailData?.mvnoId
          : localStorage.getItem("mvnoId")
        : localStorage.getItem("mvnoId");
    this.displayRecordPaymentDialog = true;
    const url = "/customers/list?mvnoId=" + mvnoId;
    const custerlist = {};
    this.recordPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
        this.paymentFormGroup.patchValue({
          customerid: this.customerIdRecord
        });
        this.openStaffWallet();
        this.systemService.getConfigurationByName("STAFF_WALLET_LIMIT").subscribe((res: any) => {
          this.staffWalletLimit = res?.data ? Number(res?.data?.value) : 0;
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
  openStaffWallet() {
    let staffId = localStorage.getItem("userId");
    const url =
      "/staff_ledger_details/walletAmount/" + staffId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.staffService.getFromCMS(url).subscribe((response: any) => {
      this.WalletDataAmount = response.availableAmount;
    });
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
  closeParentCust() {
    this.displayInvoiceDetails = false;
  }

  downloadInvoice(docId, custId, fileName) {
    const url = "/documentForInvoice/download/" + docId + "/" + custId;
    this.customerManagementService.downloadInvoice(url).subscribe(
      (response: any) => {
        var fileType = "";
        // if (fileName.includes(".png")) {
        //   fileType =
        // }
        var file = new Blob([response]);
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
    this.openCustomersPaymentData(this.customerDetailData.id, "");
  }

  TotalPaymentItemPerPage(event) {
    this.paymentShowItemPerPage = Number(event.value);
    if (this.currentPagecustomerPaymentdata > 1) {
      this.currentPagecustomerPaymentdata = 1;
    }
    this.openCustomersPaymentData(this.customerDetailData.id, this.paymentShowItemPerPage);
  }
  closePaymentForm() {
    this.paymentFormGroup.reset();
    this.displayRecordPaymentDialog = false;
    this.submitted = false;
    this.isShowInvoiceList = false;
    this.selectedInvoice = [];
    this.file = "";
    this.fileName = null;
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
        // this.invoiceList = Data;
        this.invoiceList.forEach(item => {
          item.tdsCheck = 0;
          item.abbsCheck = 0;
          item.tds = 0;
          item.abbs = 0;
          item.includeTds = false;
          item.includeAbbs = false;
          item.testamount = this.getPendingAmount(item);
          item.convertedAmount = item.testamount * this.convertedExchangeRate;
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

  modalOpenInvoice(id) {
    this.displaySelectInvoiceDialog = true;
    this.isDisplayConvertedAmount = false;
    this.collectedCurrency = this.customerDetailData?.currency
      ? this.customerDetailData?.currency
      : this.systemConfigCurrency;
    if (id) {
      this.InvoiceListByCustomer(id);
    }
    this.newFirst = 0;
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
  bindInvoice() {
    this.selectedInvoice = this.checkedList;
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
        severity: "error",
        summary: "Error",
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

  keypressId(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
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
            localStorage.getItem("mvnoId") == "1"
              ? this.customerDetailData.mvnoId
              : Number(localStorage.getItem("mvnoId"));
          const url = "/record/payment?mvnoId=" + mvnoId;
          this.paymentFormGroup.value.customerid = this.customerDetailData.id;
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
    }
    this.displayRecordPaymentDialog = false;
  }
  onCurrencyChange(event: any, invoice: any) {
    // invoice.selectedCurrency = event.value;
    // invoice.isDisplayConvertedAmount = event.value !== this.customerLedgerDetailData?.currency;
    this.isDisplayConvertedAmount =
      event.value !=
      (this.customerDetailData?.currency ? this.customerDetailData?.currency : this.currency);
  }

  onConvertedRateChange() {
    this.invoiceList.forEach(element => {
      element.convertedAmount = element.testamount * this.convertedExchangeRate;
    });
  }

  checkUncheckAllInvoice() {
    for (let i = 0; i < this.invoiceList.length; i++) {
      this.invoiceList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemListInvoice();
  }
  getCheckedItemListInvoice() {
    this.checkedList = [];
    for (let i = 0; i < this.invoiceList.length; i++) {
      if (this.invoiceList[i].isSelected) {
        this.checkedList.push(this.invoiceList[i]);
      }
    }
  }

  isAllSelectedInvoice() {
    this.masterSelected = this.invoiceList.every(function (item: any) {
      return item.isSelected == true;
    });
    this.getCheckedItemListInvoice();
  }

  modalCloseInvoiceList() {
    this.displaySelectInvoiceDialog = false;
  }

  openPaymentInvoiceModal(id, paymentId) {
    this.displayInvoiceDetails = true;
    this.PaymentamountService.show(id);
    this.paymentId.next({
      paymentId
    });
  }
}
