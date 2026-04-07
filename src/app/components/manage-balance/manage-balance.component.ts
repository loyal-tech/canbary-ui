import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { PartnerService } from "src/app/service/partner.service";
import { Regex } from "src/app/constants/regex";
import { ActivatedRoute, Router } from "@angular/router";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { PARTNERS } from "src/app/constants/aclConstants";
import { PaymentGatewayConfigurationService } from "src/app/service/payment-gateway-configuration.service";
import { PaymentIntegrationService } from "src/app/service/payment-integration.service";
declare var $: any;

@Component({
  selector: "app-manage-balance",
  templateUrl: "./manage-balance.component.html",
  styleUrls: ["./manage-balance.component.css"]
})
export class ManageBalanceComponent implements OnInit {
  manageBalanceGroupForm: FormGroup;
  ifTransferBalance = false;
  ifAddBalance = false;
  submitted = false;
  ifCommisionToBalance = false;
  ifBalanceToCommision = false;
  ifwithdrawalCommision = false;
  ifWithdrawalOnlineMode = false;
  ifWithdrawalCash = false;
  partnerData = [];
  BalanceOpertation = [
    { label: "Add Balance", value: "AddBalance" },
    { label: "Transfer Balance", value: "TrasferBalance" },
    { label: " Withdrawal Of Commission", value: "withdrawalOfCommission" }
  ];
  paymentmodecase = [{ label: "Cash", value: "Cash" }];
  paymentmode = [
    { label: "Cash", value: "Cash" },
    { label: "Online", value: "Online" }
  ];
  transferBalance = [
    { label: "Balance to Commission", value: "BalanceToCommission" },
    { label: "Commission to Balance", value: "CommissionToBalance" }
  ];
  partnerName: any;
  ifRedirectManageBalance = false;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  showCreate: boolean = false;
  assignApporvePlanModal: boolean = false;
  showList: boolean;
  currentPageInvoiceListdata = 1;
  invoiceListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceListdatatotalRecords: any;
  invoiceListData: any = [];
  invoiceListDataselector: any;
  pageLimitOptionsInvoice = RadiusConstants.pageLimitOptions;
  pageITEMInvoice = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPageInvoice = 1;
  invoiceListDatalength = 0;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  assignPartnerBalanceForm: FormGroup;
  rejectPartnerBalanceForm: FormGroup;
  assignPartnerBalancesubmitted: boolean = false;
  rejectPartnerBalanceSubmitted: boolean = false;
  rejectPlanModal: boolean = false;
  partnerPaymentassign: boolean = false;
  boolean = false;
  assignPartnerBalanceID: any;
  nextApproverId: any;
  selectStaff: any;
  selectStaffReject: any;
  approvePartnerBalanceData = [];
  approved = false;
  rejectPartnerBalanceData = [];
  reject = false;
  staffId: any;
  workflowAuditData1: any = [];
  currentPageMasterSlab1 = 1;
  MasteritemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords1: String;
  workflowID: any;
  showItemPerPage = 0;
  partnerTypeData: any = [];
  partnerDropdownData: any = [];
  CommissionLabel = "Commission";
  PartnerPayableCommission = "Partner Payable commission";
  PartnerCommission = "Partner Commission";
  selectPartnerData: any = [];
  modeErrorFlag: boolean;
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  searchName: any = "";
  searchkey: string;
  totalRecords: number;
  searchServiceAreaName: any = "";
  filtermanagePartnerListData: any = [];
  managepartnerListDataselector: any;
  totalDataListLength = 0;
  searchAddressType: any = "";
  searchData: any;
  staffID: any;
  ifModelIsShow: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  isPaymentGatewayConfigured: boolean = false;
  savedConfig: any;
  isPaymentThroughOnlinePayment: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private partnerService: PartnerService,
    loginService: LoginService,
    private router: Router,
    public PaymentamountService: PaymentamountService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private Activatedroute: ActivatedRoute,
    public paymentGatewayConfigService: PaymentGatewayConfigurationService,
    public paymentIntegrationService: PaymentIntegrationService
  ) {
    this.createAccess = loginService.hasPermission(PARTNERS.MANAGE_BALANCE_CREATE);
    // this.deleteAccess = loginService.hasPermission(PARTNERS.PARTNER_DELETE);
    // this.editAccess = loginService.hasPermission(PARTNERS.PARTNER_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.showCreate = false;
    this.showList = true;
  }
  remark: any;
  assignPaymentForm: FormGroup;
  chequeDateName = "Cheque Date";
  bankDataList: any;
  bankDestination: any;

  ngOnInit(): void {
    let staffID = localStorage.getItem("userId");
    this.staffID = Number(staffID);

    this.manageBalanceGroupForm = this.fb.group({
      operation: ["", Validators.required],
      mode: [""],
      partnerId: [""],
      currentBalance: [""],
      commission: [""],
      addBalance: ["", [Validators.pattern(Regex.numeric)]],
      totalBalance: [""],
      remarks: ["", [Validators.required]],
      transfer: [""],
      amount: ["", [Validators.pattern(Regex.numeric)]],
      newCommission: [""],
      newBalance: [""],
      withdrawalAmount: [""],
      ReamainingCommision: [""],
      PaymentDate: [""],
      referenceNo: [""],
      bank: [""],
      branch: [""],
      addcredit: [""],
      currentCredit: [""],
      NewCredit: [""],
      partnerType: [""],
      creditConsume: [""],
      chequedate: [""],
      chequeno: ["", [Validators.pattern(Regex.numeric)]],
      referenceno: [""],
      bankManagement: [""],
      destinationBank: [""],
      onlinesource: [""]
    });

    this.assignPartnerBalanceForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectPartnerBalanceForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.assignPaymentForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.assignPaymentForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.staffId = localStorage.getItem("userId");

    if (this.Activatedroute.snapshot.queryParamMap.get("id")) {
      this.selectPartnerData = {
        value: this.Activatedroute.snapshot.queryParamMap.get("id")
      };

      this.manageBalanceGroupForm.patchValue({
        partnerId: Number(this.selectPartnerData.value)
      });
      this.ifRedirectManageBalance = true;
      this.selectpartner(this.selectPartnerData);
      this.addBalance();
    } else {
      this.getInvoicePendingApprovals("");
    }
    this.getPartnerType();
    const url = "/commonList/paymentMode";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.paymentmodecase = response.dataList;
        this.paymentmodecase = this.paymentmodecase.filter(
          paymode =>
            paymode.value !== "VatReceiveable" &&
            paymode.value !== "barter" &&
            paymode.value !== "TDS"
        );
        //barter,VAT,TDS
      },
      (error: any) => {}
    );

    this.getBankDetail();
    this.getBankDestinationDetail();
    this.searchData = {
      filters: [
        {
          filterColumn: "any",
          filterCondition: "and",
          filterDataType: "",
          filterOperator: "equalto",
          filterValue: "",
          serviceArea: ""
        }
      ],
      page: "",
      pageSize: ""
    };

    this.checkPaymentGatewayConfiguration();
  }

  searchManagePartner() {
    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPageInvoiceListdata = 1;
    }

    if (this.showItemPerPage == 0) {
      this.invoiceListdataitemsPerPage = this.pageITEMInvoice;
    } else {
      this.invoiceListdataitemsPerPage = this.showItemPerPage;
    }
    let url = "/SearchPartnerBalance";

    this.searchData.filters[0].filterValue = this.searchName.trim();
    this.searchData.filters[0].serviceArea = Number(this.searchServiceAreaName);
    this.searchData.page = this.currentPageInvoiceListdata;
    this.searchData.pageSize = this.invoiceListdataitemsPerPage;
    this.searchkey = this.searchName;
    this.invoiceListData = [];
    this.filtermanagePartnerListData = [];
    this.managepartnerListDataselector = [];
    this.partnerService.searchManagePartner(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.invoiceListData = response.dataList;
          this.invoiceListdatatotalRecords = response.totalRecords;
          if (this.showItemPerPage > this.invoiceListdataitemsPerPage) {
            this.totalDataListLength = this.invoiceListData.length % this.showItemPerPage;
          } else {
            this.totalDataListLength =
              this.invoiceListData.length % this.invoiceListdataitemsPerPage;
          }
        }
      },
      (error: any) => {
        this.invoiceListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.invoiceListData = [];
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

  clearManagePartner() {
    this.getInvoicePendingApprovals("");
  }

  selectPartnerType(event) {
    if (event.value == "LCO") {
      this.CommissionLabel = "Revenue";
      this.getPartnerTypeData(event.value);
      this.BalanceOpertation = [{ label: "Add Balance", value: "AddBalance" }];
    } else {
      this.CommissionLabel = "Commission";
      this.getPartnerTypeData(event.value);
      this.BalanceOpertation = [
        { label: "Add Balance", value: "AddBalance" },
        { label: "Transfer Balance", value: "TrasferBalance" },
        { label: "Withdrawal Of Commission", value: "withdrawalOfCommission" }
      ];
    }
  }

  getPartnerType() {
    const url = `/commonList/partnerType`;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.partnerTypeData = response.dataList;
    });
  }

  getPartnerTypeData(partnerType) {
    let type = partnerType.toUpperCase();
    const url = "/partner/type/" + type;
    this.partnerService.getMethodNew(url).subscribe((response: any) => {
      this.partnerDropdownData = response.partnerlist.filter(data => data.id !== 1);
    });
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  getOpetationType(event) {
    let operationType = event.value;
    if (operationType == "AddBalance") {
      this.ifTransferBalance = false;
      this.ifAddBalance = true;
      this.ifwithdrawalCommision = false;
      this.manageBalanceGroupForm.patchValue({
        Mode: "Cash"
      });
      this.clearTransferData();
      this.clearWithdrawalCommission();
      this.validationAdd();
    } else if (operationType == "TrasferBalance") {
      this.ifTransferBalance = true;
      this.ifAddBalance = false;
      this.ifwithdrawalCommision = false;
      this.clearAddData();
      this.clearWithdrawalCommission();
      this.validationTransfer();
    } else if (operationType == "withdrawalOfCommission") {
      this.ifTransferBalance = false;
      this.ifAddBalance = false;
      this.ifwithdrawalCommision = true;
      this.clearTransferData();
      this.clearAddData();
      this.validationWithdrawalCommission();
    } else if (operationType == "") {
      this.ifTransferBalance = false;
      this.ifAddBalance = false;
      this.ifwithdrawalCommision = false;
      this.clearTransferData();
      this.clearAddData();
      this.clearWithdrawalCommission();
    }
  }

  selectpartner(event) {
    let PartnerId = event.value;
    if (PartnerId) {
      const url = "/partner/" + PartnerId;
      this.partnerService.getMethodNew(url).subscribe(
        (response: any) => {
          this.partnerName = response.partnerlist.name;
          let viewpartnerListData = response.partnerlist;
          this.manageBalanceGroupForm.patchValue({
            partnerId: Number(PartnerId),
            currentBalance: viewpartnerListData.balance,
            currentCredit: viewpartnerListData.credit,
            commission: viewpartnerListData.commrelvalue,
            partnerType: viewpartnerListData.partnerType,
            creditConsume: viewpartnerListData.creditConsume
          });
          if (viewpartnerListData.partnerType == "LCO") {
            this.CommissionLabel = "Revenue";
            this.PartnerPayableCommission = "Revenue Share Amount";
            this.PartnerCommission = "Payable Revenue Share Amount";
            this.getPartnerTypeData(viewpartnerListData.partnerType);
            this.BalanceOpertation = [{ label: "Add Balance", value: "AddBalance" }];
          } else {
            this.CommissionLabel = "Commission";
            this.PartnerPayableCommission = "Partner Payable commission";
            this.PartnerCommission = "Partner Commission";
            this.getPartnerTypeData(viewpartnerListData.partnerType);
            this.BalanceOpertation = [
              { label: "Add Balance", value: "AddBalance" },
              { label: "Transfer Balance", value: "TrasferBalance" },
              { label: " Withdrawal Of Commission", value: "withdrawalOfCommission" }
            ];
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
  }
  onKey(e: any) {
    if (!this.ifAddBalance) {
      this.manageBalanceGroupForm.value.totalBalance = (
        Number(this.manageBalanceGroupForm.value.currentBalance) +
        Number(this.manageBalanceGroupForm.value.addBalance)
      ).toFixed(2);

      this.manageBalanceGroupForm.patchValue({
        totalBalance: this.manageBalanceGroupForm.value.totalBalance
      });
    } else {
      let totalBal =
        Number(this.manageBalanceGroupForm.value.currentBalance) +
        Number(this.manageBalanceGroupForm.value.addBalance);

      let creditconsume = Number(this.manageBalanceGroupForm.value.creditConsume);
      let totalBalance = Number(totalBal.toFixed(2));
      if (totalBalance > creditconsume) {
        let newBalnce = totalBal - creditconsume;
        this.manageBalanceGroupForm.patchValue({
          totalBalance: newBalnce.toFixed(2)
        });
      } else if (totalBalance < creditconsume) {
        this.manageBalanceGroupForm.patchValue({
          totalBalance: 0
        });
      }
    }
  }
  balanceTransferType(event) {
    if (this.manageBalanceGroupForm.value.transfer == "BalanceToCommission") {
      this.ifBalanceToCommision = true;
      this.ifCommisionToBalance = false;
    } else if (this.manageBalanceGroupForm.value.transfer == "CommissionToBalance") {
      this.ifCommisionToBalance = true;
      this.ifBalanceToCommision = false;
    }
    if (this.manageBalanceGroupForm.value.amount > 0) {
      this.onKeyAmoutTransfer("");
    } else {
      this.manageBalanceGroupForm.patchValue({
        amount: 0,
        newBalance: 0,
        newCommission: 0
      });
    }
  }
  onKeyAmoutTransfer(e: any) {
    if (this.manageBalanceGroupForm.value.transfer == "BalanceToCommission") {
      if (
        Number(this.manageBalanceGroupForm.value.amount) <=
        this.manageBalanceGroupForm.value.currentBalance
      ) {
        this.ifBalanceToCommision = true;
        this.ifCommisionToBalance = false;
        this.manageBalanceGroupForm.value.newCommission =
          Number(this.manageBalanceGroupForm.value.commission) +
          Number(this.manageBalanceGroupForm.value.amount);
        this.manageBalanceGroupForm.patchValue({
          newCommission: this.manageBalanceGroupForm.value.newCommission
        });
      } else {
        this.manageBalanceGroupForm.patchValue({
          amount: 0,
          newBalance: 0,
          newCommission: 0
        });
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail:
            "You have rejected the transfer because the value of the amount greater than current balance"
        });
      }
    } else if (this.manageBalanceGroupForm.value.transfer == "CommissionToBalance") {
      if (
        Number(this.manageBalanceGroupForm.value.amount) <=
        this.manageBalanceGroupForm.value.commission
      ) {
        this.ifCommisionToBalance = true;
        this.ifBalanceToCommision = false;
        this.manageBalanceGroupForm.value.newBalance =
          Number(this.manageBalanceGroupForm.value.currentBalance) +
          Number(this.manageBalanceGroupForm.value.amount);
        this.manageBalanceGroupForm.patchValue({
          newBalance: this.manageBalanceGroupForm.value.newBalance
        });
      } else {
        this.manageBalanceGroupForm.patchValue({
          amount: 0,
          newBalance: 0,
          newCommission: 0
        });
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail:
            "You have rejected the transfer because the value of the amount greater than commission"
        });
      }
    } else {
      this.ifCommisionToBalance = false;
      this.ifBalanceToCommision = false;
      this.manageBalanceGroupForm.patchValue({
        newBalance: 0,
        newCommission: 0
      });
    }
  }

  getOpetationMode(event) {
    let modeType = event.value;
    if (modeType == "Cash") {
      this.ifWithdrawalOnlineMode = false;
      this.ifWithdrawalCash = true;
      //this.validationAdd();
      this.OnlineFieldClear();
    } else if (modeType == "Online") {
      this.ifWithdrawalOnlineMode = true;
      this.ifWithdrawalCash = false;
      this.OnlineFieldValidation();
    } else {
      this.ifWithdrawalOnlineMode = false;
      this.ifWithdrawalCash = false;
      this.OnlineFieldClear();
    }
  }
  onKeyWithdrawalAmount() {
    let amount =
      Number(this.manageBalanceGroupForm.value.commission) -
      Number(this.manageBalanceGroupForm.value.withdrawalAmount);

    this.manageBalanceGroupForm.patchValue({
      ReamainingCommision: amount
    });
  }
  submitBalance() {
    this.submitted = true;

    if (this.manageBalanceGroupForm.valid) {
      if (this.manageBalanceGroupForm.value.operation == "AddBalance") {
        if (this.manageBalanceGroupForm.value.mode == "") {
          this.modeErrorFlag = true;
        } else {
          this.modeErrorFlag = false;
          let data = {
            balance: this.manageBalanceGroupForm.value.addBalance,
            credit: this.manageBalanceGroupForm.value.addcredit,
            partnerId: this.manageBalanceGroupForm.value.partnerId,
            paymentMode: this.manageBalanceGroupForm.value.mode,
            remark: this.manageBalanceGroupForm.value.remarks,
            chequedate: this.manageBalanceGroupForm.value.chequedate,
            chequeno: this.manageBalanceGroupForm.value.chequeno,
            sourceBank: this.manageBalanceGroupForm.value.bankManagement,
            destinationBank: this.manageBalanceGroupForm.value.destinationBank,
            onlinesource: this.manageBalanceGroupForm.value.onlinesource,
            referenceno: this.manageBalanceGroupForm.value.referenceno
          };
          this.checkPaymentMode(data);
        }
      } else if (this.manageBalanceGroupForm.value.operation == "TrasferBalance") {
        if (this.manageBalanceGroupForm.value.transfer == "BalanceToCommission") {
          let data = {
            amount: this.manageBalanceGroupForm.value.amount,
            partnerId: this.manageBalanceGroupForm.value.partnerId,
            transferFrom: "Balance"
          };
          this.trasfetBalance(data);
        } else if (this.manageBalanceGroupForm.value.transfer == "CommissionToBalance") {
          let data = {
            amount: this.manageBalanceGroupForm.value.amount,
            partnerId: this.manageBalanceGroupForm.value.partnerId,
            transferFrom: "Commission"
          };
          this.trasfetBalance(data);
        }
      }
      if (this.manageBalanceGroupForm.value.operation == "withdrawalOfCommission") {
        if (this.manageBalanceGroupForm.value.mode == "Cash") {
          let data = {
            bank: "",
            branch: "",
            partnerId: this.manageBalanceGroupForm.value.partnerId,
            paymentDate: this.manageBalanceGroupForm.value.PaymentDate,
            paymentMode: this.manageBalanceGroupForm.value.mode,
            referNo: this.manageBalanceGroupForm.value.referenceNo,
            remark: this.manageBalanceGroupForm.value.remarks,
            withdrawAmount: this.manageBalanceGroupForm.value.withdrawalAmount
          };
          this.withdrawalAmount(data);
        } else if (this.manageBalanceGroupForm.value.mode == "Online") {
          let data = {
            bank: this.manageBalanceGroupForm.value.bank,
            branch: this.manageBalanceGroupForm.value.branch,
            partnerId: this.manageBalanceGroupForm.value.partnerId,
            paymentDate: this.manageBalanceGroupForm.value.PaymentDate,
            paymentMode: this.manageBalanceGroupForm.value.mode,
            referNo: this.manageBalanceGroupForm.value.referenceNo,
            remark: this.manageBalanceGroupForm.value.remarks,
            withdrawAmount: this.manageBalanceGroupForm.value.withdrawalAmount
          };
          this.withdrawalAmount(data);
        }
      }
    }
  }

  cashModeADDBalance(data) {
    if (data.balance != 0 || data.credit != 0) {
      this.partnerService.addBalance(data).subscribe(
        (response: any) => {
          if (this.isPaymentThroughOnlinePayment) {
            this.intiatePhonePe(response.data);
          } else {
            this.clearManageBalance();

            this.router.navigate(["/home/manageBalance"]);

            this.showListMangebalnceData();
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
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
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You have rejected the transfer because the value of the Appliced Balance is Zero"
      });
    }
  }

  checkPaymentMode(data) {
    if (data.balance != 0 || data.credit != 0) {
      if (data.paymentMode == "ONLINE" && data.onlinesource == "PHONEPE") {
        var config = this.savedConfig.some(config => config.paymentConfigName == "PHONEPE");
        if (config) {
          this.isPaymentThroughOnlinePayment = true;
          this.cashModeADDBalance(data);
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "Payment GateWay Not Configured",
            icon: "far fa-times-circle"
          });
        }
      } else {
        this.isPaymentThroughOnlinePayment = false;
        this.cashModeADDBalance(data);
      }
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You have rejected the transfer because the value of the Appliced Balance is Zero"
      });
    }
  }

  trasfetBalance(data) {
    if (data.amount != 0) {
      this.partnerService.transferBalance(data).subscribe(
        (response: any) => {
          // this.BalanceAllData = response.partnerLedgerDtls
          this.clearManageBalance();

          this.router.navigate(["/home/manageBalance"]);
          // this.ifRedirectManageBalance = false;

          this.showListMangebalnceData();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
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
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You have rejected the transfer because the value of the Transfer Amount is Zero"
      });
    }
  }
  withdrawalAmount(data) {
    if (data.withdrawAmount != 0) {
      this.partnerService.withdrawalCommission(data).subscribe(
        (response: any) => {
          // this.ifRedirectManageBalance = false;
          this.router.navigate(["/home/manageBalance"]);
          this.clearManageBalance();

          this.showListMangebalnceData();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
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
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You have rejected the transfer because the value of the Withdrawal Amount is Zero"
      });
    }
  }

  clearManageBalance() {
    this.ifTransferBalance = false;
    this.ifAddBalance = false;
    this.submitted = false;
    this.ifBalanceToCommision = false;
    this.ifCommisionToBalance = false;
    this.ifWithdrawalOnlineMode = false;
    this.ifWithdrawalCash = false;
    this.ifwithdrawalCommision = false;
    this.manageBalanceGroupForm.reset();
    this.manageBalanceGroupForm.controls.operation.setValue("");
    this.manageBalanceGroupForm.controls.mode.setValue("");
    this.manageBalanceGroupForm.controls.partnerId.setValue("");
    this.manageBalanceGroupForm.controls.transfer.setValue("");
    this.clearTransferData();
    this.clearAddData();
    this.clearWithdrawalCommission();
    this.OnlineFieldClear();
  }

  // validation function
  validationAdd() {
    this.manageBalanceGroupForm.get("mode").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("mode").updateValueAndValidity();

    this.manageBalanceGroupForm.get("addBalance").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("addBalance").updateValueAndValidity();

    this.manageBalanceGroupForm.get("addcredit").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("addcredit").updateValueAndValidity();
    this.manageBalanceGroupForm.get("totalBalance").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("totalBalance").updateValueAndValidity();
    this.manageBalanceGroupForm.get("remarks").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("remarks").updateValueAndValidity();
  }

  validationTransfer() {
    this.manageBalanceGroupForm.get("transfer").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("transfer").updateValueAndValidity();
    this.manageBalanceGroupForm.get("amount").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("amount").updateValueAndValidity();
    this.manageBalanceGroupForm.get("remarks").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("remarks").updateValueAndValidity();
  }

  clearTransferData() {
    this.manageBalanceGroupForm.get("transfer").clearValidators();
    this.manageBalanceGroupForm.get("transfer").updateValueAndValidity();
    this.manageBalanceGroupForm.get("amount").clearValidators();
    this.manageBalanceGroupForm.get("amount").updateValueAndValidity();
    this.manageBalanceGroupForm.get("remarks").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("remarks").updateValueAndValidity();
  }

  clearAddData() {
    this.manageBalanceGroupForm.get("mode").clearValidators();
    this.manageBalanceGroupForm.get("mode").updateValueAndValidity();
    this.manageBalanceGroupForm.get("addBalance").clearValidators();
    this.manageBalanceGroupForm.get("addBalance").updateValueAndValidity();
    this.manageBalanceGroupForm.get("addcredit").clearValidators();
    this.manageBalanceGroupForm.get("addcredit").updateValueAndValidity();
    this.manageBalanceGroupForm.get("totalBalance").clearValidators();
    this.manageBalanceGroupForm.get("totalBalance").updateValueAndValidity();
    this.manageBalanceGroupForm.get("remarks").clearValidators();
    this.manageBalanceGroupForm.get("remarks").updateValueAndValidity();
  }

  validationWithdrawalCommission() {
    this.manageBalanceGroupForm.get("mode").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("mode").updateValueAndValidity();
    this.manageBalanceGroupForm.get("remarks").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("remarks").updateValueAndValidity();
    this.manageBalanceGroupForm.get("PaymentDate").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("PaymentDate").updateValueAndValidity();
    this.manageBalanceGroupForm.get("referenceNo").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("referenceNo").updateValueAndValidity();

    this.manageBalanceGroupForm.get("withdrawalAmount").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("withdrawalAmount").updateValueAndValidity();
  }
  clearWithdrawalCommission() {
    this.manageBalanceGroupForm.get("mode").clearValidators();
    this.manageBalanceGroupForm.get("mode").updateValueAndValidity();
    this.manageBalanceGroupForm.get("withdrawalAmount").clearValidators();
    this.manageBalanceGroupForm.get("withdrawalAmount").updateValueAndValidity();
    this.manageBalanceGroupForm.get("PaymentDate").clearValidators();
    this.manageBalanceGroupForm.get("PaymentDate").updateValueAndValidity();
    this.manageBalanceGroupForm.get("referenceNo").clearValidators();
    this.manageBalanceGroupForm.get("referenceNo").updateValueAndValidity();
    this.manageBalanceGroupForm.get("remarks").clearValidators();
    this.manageBalanceGroupForm.get("remarks").updateValueAndValidity();
  }

  OnlineFieldValidation() {
    this.manageBalanceGroupForm.get("bank").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("bank").updateValueAndValidity();
    this.manageBalanceGroupForm.get("branch").setValidators([Validators.required]);
    this.manageBalanceGroupForm.get("branch").updateValueAndValidity();
  }

  OnlineFieldClear() {
    this.manageBalanceGroupForm.get("bank").clearValidators();
    this.manageBalanceGroupForm.get("bank").updateValueAndValidity();
    this.manageBalanceGroupForm.get("branch").clearValidators();
    this.manageBalanceGroupForm.get("branch").updateValueAndValidity();
  }

  onKeyaddcredit(e) {
    this.manageBalanceGroupForm.value.NewCredit =
      Number(this.manageBalanceGroupForm.value.currentCredit) +
      Number(this.manageBalanceGroupForm.value.addcredit);

    this.manageBalanceGroupForm.patchValue({
      NewCredit: this.manageBalanceGroupForm.value.NewCredit
    });
  }

  cancelMangeBalnce() {
    this.ifRedirectManageBalance = false;
    this.clearManageBalance();
    this.router.navigate(["/home/manageBalance"]);
  }

  addBalance() {
    this.showCreate = true;
    this.showList = false;
    if (this.ifRedirectManageBalance) {
      this.ifRedirectManageBalance = true;
      this.selectpartner(this.selectPartnerData);
    }
  }
  showListMangebalnceData() {
    this.showCreate = false;
    this.showList = true;
    this.getInvoicePendingApprovals("");
  }

  getInvoicePendingApprovals(list): void {
    let size;
    const page = this.currentPageInvoiceListdata;
    if (list) {
      size = list;
      this.invoiceListdataitemsPerPage = list;
    } else {
      size = this.invoiceListdataitemsPerPage;
    }
    let mvnoId = localStorage.getItem("mvnoId");
    const url = `/getAllPartnerBalance?mvnoId=` + mvnoId;
    const custerlist = {
      page,
      pageSize: size
    };
    this.partnerService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.invoiceListData = response.dataList;
        this.invoiceListDataselector = response.dataList;
        this.invoiceListdatatotalRecords = response.totalRecords;
        if (this.showItemPerPageInvoice > this.invoiceListdataitemsPerPage) {
          this.invoiceListDatalength = this.invoiceListData.length % this.showItemPerPageInvoice;
        } else {
          this.invoiceListDatalength =
            this.invoiceListData.length % this.invoiceListdataitemsPerPage;
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

  totalItemPerPageForInvoiceApprovals(event): void {
    this.showItemPerPageInvoice = Number(event.value);
    if (this.currentPageInvoiceListdata > 1) {
      this.currentPageInvoiceListdata = 1;
    }
    this.getInvoicePendingApprovals(this.showItemPerPageInvoice);
  }

  pageChangedForInvoiceApprovals(pageNumber): void {
    this.currentPageInvoiceListdata = pageNumber;
    this.getInvoicePendingApprovals("");
  }

  rejectPartnerBalanceOpen(partnerBalanceId, nextApproverId) {
    this.reject = false;
    this.selectStaff = null;
    this.rejectPartnerBalanceData = [];
    this.rejectPlanModal = true;
    this.assignPartnerBalanceID = partnerBalanceId;
    this.nextApproverId = nextApproverId;
  }

  approvePartnerBalanceOpen(partnerBalanceId, nextApproverId) {
    this.approved = false;
    this.selectStaff = null;
    this.approvePartnerBalanceData = [];
    this.assignApporvePlanModal = true;
    this.assignPartnerBalanceID = partnerBalanceId;
    this.nextApproverId = nextApproverId;
  }

  assignPartnerBalance() {
    this.assignPartnerBalancesubmitted = true;
    this.approved = false;
    this.selectStaff = null;
    this.approvePartnerBalanceData = [];
    if (this.assignPartnerBalanceForm.valid) {
      let url = "/approvePartnerBalance";
      let assignCAFData = {
        partnerPaymentId: this.assignPartnerBalanceID,
        nextStaffId: "",
        flag: "approved",
        remark: this.assignPartnerBalanceForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
      };

      this.partnerService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.assignPartnerBalanceForm.reset();
          this.assignPartnerBalancesubmitted = false;
          if (response.result.dataList != null) {
            this.approvePartnerBalanceData = response.result.dataList;
            this.approved = true;
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
              icon: "far fa-times-circle"
            });
            this.assignApporvePlanModal = false;
            this.getInvoicePendingApprovals("");
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
  }

  closeAssignApporvePlanModal() {
    this.assignApporvePlanModal = false;
  }

  rejectPartnerBalance() {
    this.rejectPartnerBalanceSubmitted = true;
    if (this.rejectPartnerBalanceForm.valid) {
      let assignCAFData = {
        partnerPaymentId: this.assignPartnerBalanceID,
        nextStaffId: "",
        flag: "Rejected",
        remark: this.rejectPartnerBalanceForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
      };

      let url = "/approvePartnerBalance";
      this.partnerService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.rejectPartnerBalanceForm.reset();
          this.rejectPartnerBalanceSubmitted = false;
          if (response.result.dataList != null) {
            this.rejectPartnerBalanceData = response.result.dataList;
            this.reject = true;
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
              icon: "far fa-times-circle"
            });
            this.rejectPlanModal = false;
            this.getInvoicePendingApprovals("");
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
  }

  assignToStaff(flag) {
    let url: any;
    if (!this.selectStaff && !this.selectStaffReject) {
      url = `/teamHierarchy/assignEveryStaff?entityId=${
        this.assignPartnerBalanceID
      }&eventName=${"PARTNER_BALANCE"}&isApproveRequest=${flag}`;
    } else {
      if (flag == true) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${
          this.assignPartnerBalanceID
        }&eventName=${"PARTNER_BALANCE"}&nextAssignStaff=${
          this.selectStaff
        }&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignFromStaffList?entityId=${
          this.assignPartnerBalanceID
        }&eventName=${"PARTNER_BALANCE"}&nextAssignStaff=${
          this.selectStaffReject
        }&isApproveRequest=${flag}`;
      }
    }

    this.partnerService.getMethod(url).subscribe(
      (response: any) => {
        this.assignApporvePlanModal = false;
        this.rejectPlanModal = false;

        this.getInvoicePendingApprovals("");
        this.messageService.add({
          severity: "success",
          summary: "success",
          detail: response.responseMessage,
          icon: "far fa-times-circle"
        });
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  closeRejectPlanModal() {
    this.rejectPlanModal = false;
  }

  closePartnerPaymentassign() {
    this.partnerPaymentassign = false;
  }

  getworkflowAuditDetails(size, id, name) {
    let page = this.currentPageMasterSlab1;
    let page_list;
    if (size) {
      page_list = size;
      this.MasteritemsPerPage1 = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.MasteritemsPerPage1 = 5;
      } else {
        this.MasteritemsPerPage1 = 5;
      }
    }

    this.workflowAuditData1 = [];

    let data = {
      page: page,
      pageSize: this.MasteritemsPerPage1
    };

    let url = "/workflowaudit/list?entityId=" + id + "&eventName=" + name;

    this.partnerService.postMethod(url, data).subscribe(
      (response: any) => {
        this.workflowAuditData1 = response.dataList;
        this.MastertotalRecords1 = response.totalRecords;
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.ERROR,
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

  canExit() {
    if (!this.manageBalanceGroupForm.dirty) return true;
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
  openPaymentWorkFlow(id, auditcustid) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "PARTNER_BALANCE",
      planId: ""
    });
  }
  pickModalOpen(data) {
    let url = "/workflow/pickupworkflow?eventName=PARTNER_BALANCE&entityId=" + data.id;
    this.partnerService.getMethod(url).subscribe(
      (response: any) => {
        this.getInvoicePendingApprovals("");

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
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
  reassignWorkflow() {
    let url: any;
    this.remark = this.assignPaymentForm.value.remark;
    url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignPartnerBalanceID}&eventName=PARTNER_BALANCE&assignToStaffId=${this.selectStaff}&remark=${this.remark}`;
    if (this.assignPartnerBalanceID == null) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please approve before reasign",
        icon: "far fa-times-circle"
      });
    } else {
      this.partnerService.getMethod(url).subscribe(
        (response: any) => {
          $("#reasignPlanGroup").modal("hide");
          this.partnerPaymentassign = false;
          this.showListMangebalnceData();

          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.showListMangebalnceData();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Assigned to the next staff successfully.",
              icon: "far fa-times-circle"
            });
          }
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
          this.partnerPaymentassign = false;
        }
      );
    }
  }

  StaffReasignList(id) {
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${id}&eventName=PARTNER_BALANCE`;
    this.partnerService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
        if (response.dataList != null) {
          this.approvePartnerBalanceData = response.dataList;
          this.approved = true;
          this.partnerPaymentassign = true;
        } else {
          this.partnerPaymentassign = false;
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

  resetPayMode() {
    this.manageBalanceGroupForm.controls.chequeno.disable();
    this.manageBalanceGroupForm.controls.chequedate.disable();
    this.manageBalanceGroupForm.controls.bankManagement.disable();
    this.manageBalanceGroupForm.controls.branch.disable();
    this.manageBalanceGroupForm.controls.destinationBank.disable();
    this.chequeDateName = "Cheque Date";
    this.manageBalanceGroupForm.controls.referenceno.setValidators([]);
    this.manageBalanceGroupForm.controls.chequedate.setValidators([]);
    this.manageBalanceGroupForm.controls.destinationBank.setValidators([]);
    this.manageBalanceGroupForm.controls.bankManagement.setValidators([]);
    this.manageBalanceGroupForm.controls.chequeno.setValidators([]);
    this.manageBalanceGroupForm.controls.onlinesource.setValidators([]);
    this.manageBalanceGroupForm.updateValueAndValidity();
  }

  selPayModeRecord(event) {
    this.resetPayMode();
    const payMode = event.value.toLowerCase();
    if (payMode == "POS".toLowerCase() || payMode == "VatReceiveable".toLowerCase()) {
      this.manageBalanceGroupForm.controls.chequedate.enable();
      this.manageBalanceGroupForm.controls.chequedate.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.chequedate.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "Online".toLowerCase()) {
      this.manageBalanceGroupForm.controls.chequedate.enable();
      this.manageBalanceGroupForm.controls.chequedate.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.chequedate.updateValueAndValidity();
      this.manageBalanceGroupForm.controls.referenceno.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.referenceno.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "Direct Deposit".toLowerCase()) {
      this.manageBalanceGroupForm.controls.branch.enable();
      this.manageBalanceGroupForm.controls.chequedate.enable();
      this.manageBalanceGroupForm.controls.chequedate.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.chequedate.updateValueAndValidity();
      this.manageBalanceGroupForm.controls.destinationBank.enable();
      this.manageBalanceGroupForm.controls.destinationBank.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.destinationBank.updateValueAndValidity();
      this.chequeDateName = "Transaction date";
    } else if (payMode == "NEFT_RTGS".toLowerCase()) {
      this.manageBalanceGroupForm.controls.bankManagement.enable();
      this.manageBalanceGroupForm.controls.bankManagement.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.bankManagement.updateValueAndValidity();
      this.manageBalanceGroupForm.controls.destinationBank.enable();
      this.manageBalanceGroupForm.controls.destinationBank.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.destinationBank.updateValueAndValidity();
    } else if (payMode == "Cheque".toLowerCase()) {
      this.manageBalanceGroupForm.controls.chequedate.enable();
      this.manageBalanceGroupForm.controls.chequedate.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.chequedate.updateValueAndValidity();
      this.manageBalanceGroupForm.controls.bankManagement.enable();
      this.manageBalanceGroupForm.controls.bankManagement.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.bankManagement.updateValueAndValidity();
      this.manageBalanceGroupForm.controls.chequeno.enable();
      this.manageBalanceGroupForm.controls.chequeno.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.chequeno.updateValueAndValidity();
      this.manageBalanceGroupForm.controls.branch.enable();
      this.manageBalanceGroupForm.controls.destinationBank.enable();
      this.manageBalanceGroupForm.controls.destinationBank.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.destinationBank.updateValueAndValidity();
    }
    this.commondropdownService.getOnlineSourceData(payMode.toLowerCase());
    if (this.commondropdownService.onlineSourceData.length > 0) {
      this.manageBalanceGroupForm.controls.onlinesource.setValidators([Validators.required]);
      this.manageBalanceGroupForm.controls.onlinesource.updateValueAndValidity();
    }
  }

  selPaySourceRecord(event) {
    const paySource = event.value.toLowerCase();
    switch (paySource) {
      case "Cash_via_Bank".toLowerCase():
        this.manageBalanceGroupForm.controls.destinationBank.enable();
        this.manageBalanceGroupForm.controls.destinationBank.setValidators([Validators.required]);
        this.manageBalanceGroupForm.controls.destinationBank.updateValueAndValidity();
        this.manageBalanceGroupForm.controls.branch.enable();
        break;
    }
  }

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

  checkPaymentGatewayConfiguration() {
    this.spinner.show();
    this.paymentGatewayConfigService.getActivePaymentConfiguration().subscribe(
      (response: any) => {
        this.savedConfig = [];
        if (response.status == 204) {
          this.isPaymentGatewayConfigured = false;
        } else {
          this.savedConfig = response.activePaymentConfig;
          this.isPaymentGatewayConfigured = true;
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

  intiatePhonePe(partnerPayment) {
    let data;
    let amounts = (partnerPayment.amount * 100).toString();
    data = {
      partnerId: partnerPayment.partnerId,
      amount: amounts,
      isFromCaptive: false,
      requestFor: "payment",
      mvnoId: partnerPayment.mvnoId,
      partnerPaymentId: partnerPayment.id
    };
    this.paymentIntegrationService.initiatePhonePePayment(data).subscribe(
      (response: any) => {
        this.clearManageBalance();
        this.router.navigate(["/home/manageBalance"]);
        this.showListMangebalnceData();
        let redirectURL = JSON.parse(response.data.data).instrumentResponse.redirectInfo.url;
        window.open(redirectURL, "_blank");
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
