import { Component, OnDestroy, OnInit } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { FormBuilder, FormArray, FormGroup, Validators, FormControl } from "@angular/forms";
import { StaffService } from "src/app/service/staff.service";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { SystemconfigService } from "../../service/systemconfig.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { SETTINGS } from "src/app/constants/aclConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { error } from "console";
import { Subscription } from "rxjs";
import { StatusCheckService } from "src/app/service/status-check-service.service";

declare var $: any;

@Component({
  selector: "app-my-staff-details",
  templateUrl: "./my-staff-details.component.html",
  styleUrls: ["./my-staff-details.component.css"]
})
export class MyStaffDetailsComponent implements OnInit, OnDestroy {
  paymentReciptForm: FormGroup;
  radiusWalletGroupForm: FormGroup;
  changePasswordForm: FormGroup;

  staffImg: SafeResourceUrl;
  AclClassConstants;
  AclConstants;
  satffUserData: any = [];
  isStaffPersonalData = false;
  isStaffReceiptData = false;
  ifWalletStaffShow = false;

  parentStaffList: any = [];
  currentReceiptPage: number = 1;
  itemsReceiptPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalReceiptRecords: number;
  userId = "";
  currency: string;

  userName: "";
  ifgenerateOtpField = true;
  userNameForPasswordUpdate = "";
  mvnoIdForPwdChange = "";
  staffOTPValue = "";
  staffPhoneNumber = "";
  staffEmail = "";
  staffCountryCode = "";
  _passwordNewType = "password";
  showNewPassword = false;
  pageLimitOptionsLedger = RadiusConstants.pageLimitOptions;

  paymentModes = [];
  staffLegderChequeData = [];
  selectedCheques;
  searchOptionSelect = ["Mode", "Status"];
  searchOption: any;
  searchDeatil: any;
  additionalDetails: any = [];
  receiptAccess: boolean = false;
  receiptMgmtAccess: boolean = false;
  profileWalletAccess: boolean = false;
  profileChangePassAccess: boolean = false;

  private routerEventsSubscription: Subscription;
  settle_Amount_Access: boolean = false;
  staffWalletModal: boolean = false;
  paymentReciptModal = false;
  changePasswordModal = false;
  serviceareaModal = false;
  bussinessModal = false;
  teamModal = false;
  constructor(
    private staffService: StaffService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private systemService: SystemconfigService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public loginService: LoginService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private customerManagementService: CustomermanagementService,
    private router: Router,
    public statusCheckService: StatusCheckService
  ) {
    this.routerEventsSubscription = this.router.events.subscribe(event => {
      this.userId = this.route.snapshot.paramMap.get("id");
      if (event instanceof NavigationEnd) {
        this.userId = this.route.snapshot.paramMap.get("id")!;
        this.initData();
      }
    });
    this.userId = this.route.snapshot.paramMap.get("id");

    this.getDetails();
  }

  ngOnDestroy(): void {
    // Unsubscribe from the router events when the component is destroyed
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }

  getDetails() {
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }

  ngOnInit(): void {
    // this.userId = this.route.snapshot.paramMap.get("id");

    this.initData();
  }

  initData() {
    this.receiptAccess = false;
    this.receiptMgmtAccess = false;
    this.profileWalletAccess = false;
    this.profileChangePassAccess = false;
    const loggedInUserId = Number(localStorage.getItem("userId"));
    if (loggedInUserId == Number(this.userId)) {
      this.receiptAccess = this.loginService.hasPermission(SETTINGS.STAFF_RECEIPT);
      this.receiptMgmtAccess = this.loginService.hasPermission(SETTINGS.STAFF_RECEIPT_MGMT);
      this.profileWalletAccess = this.loginService.hasPermission(SETTINGS.MY_PROFILE_WALLET);
      this.profileChangePassAccess = this.loginService.hasPermission(
        SETTINGS.MY_PROFILE_CHANGE_PASSWORD
      );
    } else {
      this.receiptAccess = this.loginService.hasPermission(SETTINGS.STAFF_DETAILS_RECEIPT);
      this.receiptMgmtAccess = this.loginService.hasPermission(SETTINGS.STAFF_CREATE_RECEIPT);
      this.profileWalletAccess = this.loginService.hasPermission(SETTINGS.STAFF_DETAILS_WALLET);
      this.profileChangePassAccess = this.loginService.hasPermission(
        SETTINGS.STAFF_CHANGE_PASSWORD
      );
    }
    this.settle_Amount_Access = this.loginService.hasPermission(SETTINGS.SETTLE_AMOUNT);
    this.paymentReciptForm = this.fb.group({
      prefix: ["", Validators.required],
      receiptFrom: ["", Validators.required],
      receiptTo: ["", Validators.required]
    });

    this.radiusWalletGroupForm = this.fb.group({
      date: ["", Validators.required],
      paymentMode: ["", Validators.required],
      amount: [""],
      bankId: ["", Validators.required],
      remarks: ["", Validators.required]
    });
    this.changePasswordForm = this.fb.group({
      userName: [""],
      newPassword: ["", [Validators.required]]
    });

    this.staffDetialsOpen(this.userId);
    this.getBankDetail();
    this.openStaffID = this.userId;
  }

  staffreciptMappingList: any = [];
  openStaffID = "";
  staffDetialsOpen(id) {
    this.isStaffPersonalData = true;
    this.isStaffReceiptData = false;
    this.ifWalletStaffShow = false;
    this.openStaffID = id;
    this.getstaffData(id);
  }

  pageReceiptChanged(pageNumber) {
    this.currentReceiptPage = pageNumber;
  }

  getstaffData(id) {
    this.staffService.getStaff(id).subscribe((response: any) => {
      this.satffUserData = response.Staff;
      this.userName = this.satffUserData.username;
      if (this.statusCheckService.isActiveCMS) {
        this.getStaffReceiptDatabyStaffId(this.satffUserData.id);
      }
      this.staffImg = this.sanitizer.bypassSecurityTrustResourceUrl(
        `data:image/png;base64, ${this.satffUserData.profileImage}`
      );
    });
  }
  openStaffStaffReceipt() {
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = true;
    this.ifWalletStaffShow = false;
  }

  getWallatData: any;
  WalletAmount: any;
  openStaffWallet() {
    this.isStaffPersonalData = false;
    this.isStaffReceiptData = false;
    this.ifWalletStaffShow = true;
    this.additionalDetails = [];
    const url =
      "/staff_ledger_details/walletAmount/" +
      this.openStaffID +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
    this.staffService.getFromCMS(url).subscribe((response: any) => {
      this.getWallatData = response;
      this.WalletAmount = response.availableAmount;
    });

    this.getstaffLegderData();
  }

  staffRecepetId = "";
  addNewReceipt(id) {
    this.staffRecepetId = id;
    this.paymentReciptModal = true;
  }

  clearpaymentReciptForm() {
    this.staffRecepetId == "";
    this.paymentReciptForm.reset();
    this.paymentReciptModal = false;
  }

  saveNewRecipt() {
    let staffUserServiceMappingList = {
      fromreceiptnumber: this.paymentReciptForm.value.receiptFrom,
      id: "",
      identityKey: "",
      isActive: true,
      isDeleted: true,
      mvnoId: "",
      prefix: this.paymentReciptForm.value.prefix,
      stfmappingId: this.staffRecepetId,
      toreceiptnumber: this.paymentReciptForm.value.receiptTo
    };

    this.customerManagementService.addNewReceipt(staffUserServiceMappingList).subscribe(
      (response: any) => {
        this.getstaffData(this.staffRecepetId);
        this.paymentReciptModal = false;
        this.clearpaymentReciptForm();
        this.openStaffStaffReceipt();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
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
  }

  searchReceptNumber = "";
  clearReceiptForm() {
    this.searchReceptNumber = "";
    this.staffreciptMappingList = this.satffUserData.staffUserServiceMappingList;
  }

  bankDataList: any = [];
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

  showWithdrawalAmountModel() {
    this.staffWalletModal = true;
  }

  clearWalletStaffForm() {
    this.radiusWalletGroupForm.reset();
    this.selectedCheques = [];
  }

  closeWalletForm() {
    this.radiusWalletGroupForm.reset();
    this.selectedCheques = [];
    this.staffWalletModal = false;
  }
  saveManageBalance() {
    let data: any = {};
    let data1 = this.radiusWalletGroupForm.value;
    var dataList = [];
    if (this.radiusWalletGroupForm.value.paymentMode.toUpperCase() == "CHEQUE") {
      this.selectedCheques.forEach(element => {
        data = {
          action: "",
          amount: element.amount,
          bankId: this.radiusWalletGroupForm.value.bankId,
          bankName: this.bankDataList.find(
            item => item.id == this.radiusWalletGroupForm.value.bankId
          ).bankname,
          date: this.radiusWalletGroupForm.value.date,
          remarks: this.radiusWalletGroupForm.value.remarks,
          paymentMode: this.radiusWalletGroupForm.value.paymentMode,
          chequeno: element.chequeno,
          chequedate: element.chequedate,
          // transactionType: "DR",
          buId: "",
          creditDocId: "",
          custId: "",
          id: this.openStaffID,
          identityKey: "",
          mvnoId: ""
          // staffUser: {
          //   id: this.openStaffID,
          // },
        };
        dataList.push(data);
      });
    } else {
      data = {
        action: "",
        amount: this.radiusWalletGroupForm.value.amount,
        bankId: this.radiusWalletGroupForm.value.bankId,
        date: this.radiusWalletGroupForm.value.date,
        remarks: this.radiusWalletGroupForm.value.remarks,
        paymentMode: this.radiusWalletGroupForm.value.paymentMode,
        bankName: this.bankDataList.find(item => item.id == this.radiusWalletGroupForm.value.bankId)
          .bankname,
        // transactionType: "DR",
        buId: "",
        creditDocId: "",
        custId: "",
        id: this.openStaffID,
        identityKey: "",
        mvnoId: ""
        // staffUser: {
        //   id: this.openStaffID,
        // },
      };
      dataList.push(data);
    }
    const url = "/staff_ledger_details/transferredToBank";
    this.staffService.postApiFromCMS(url, dataList).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 405) {
          this.radiusWalletGroupForm.reset();
          this.paymentModes = [];
          this.staffWalletModal = false;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.radiusWalletGroupForm.reset();
          this.staffWalletModal = false;
          this.openStaffWallet();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
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

  itemsLegderPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentLegderPage = 1;
  totalLegderRecords: string;
  staffLegderData: any = [];

  pageLegderChanged(e) {
    this.currentLegderPage = e;
  }
  staffData: any;
  getstaffLegderData() {
    const url = "/staff_ledger_details/getStaffLedgerDetailsbyStaffId/" + this.openStaffID;
    this.staffService.getFromCMS(url).subscribe(
      (response: any) => {
        this.staffData = response.dataList;
        this.staffLegderData = response.dataList;
        this.staffLegderChequeData = this.staffLegderData.filter(
          item => item.paymentMode === "Cheque" && item.status === "Pending"
        );
        this.paymentModes = [];
        const uniqueModesMap = new Map();
        this.staffLegderData.forEach(item => {
          const mode = item.paymentMode?.trim();
          if (mode) {
            const key = mode.toLowerCase();
            if (!uniqueModesMap.has(key)) {
              uniqueModesMap.set(key, mode);
            }
          }
        });

        this.paymentModes = Array.from(uniqueModesMap.values()).map(mode => ({
          label: mode,
          value: mode
        }));
        this.additionalDetiails();
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

  onPaymentModeChange(event) {
    if (event.value === "CASH") {
      this.radiusWalletGroupForm.controls.amount.setValidators(Validators.required);
    } else if (event.value === "Cheque") {
      this.radiusWalletGroupForm.controls.amount.clearValidators();
    }
    this.radiusWalletGroupForm.controls.amount.updateValueAndValidity();
  }

  getCustomerDataForPasswordChange(staff) {
    this.changePasswordModal = true;
    this.ifgenerateOtpField = true;
    this.staffOTPValue = "";
    this.mvnoIdForPwdChange = staff.mvnoId;
    this.userNameForPasswordUpdate = staff.username;
    this.staffPhoneNumber = staff.phone;
    this.staffCountryCode = staff.countryCode;
    this.staffEmail = staff.email;
    this.changePasswordForm.patchValue({
      userName: this.userNameForPasswordUpdate
    });
  }
  // generate OTP
  genrateOtp() {
    this.staffOTPValue = "";
    let data = {
      countryCode: this.staffCountryCode,
      mobileNumber: this.staffPhoneNumber,
      emailId: this.staffEmail,
      profile: "OTP"
    };

    let url = "/otp/generate?mvnoId=" + localStorage.getItem("mvnoId");

    this.staffService.postApiFromCMS(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 405) {
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
            detail: response.otp,
            icon: "far fa-check-circle"
          });
        }
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

  // Validate OTP
  ValidOtp() {
    let data = {
      mobileNumber: this.staffPhoneNumber,
      emailId: this.staffEmail,
      otp: this.staffOTPValue
    };

    let url = "/otp/validate";

    this.staffService.postApiFromCMS(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.ifgenerateOtpField = true;

          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.ifgenerateOtpField = false;

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        }
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
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  changePassword() {
    this.changePasswordForm.value.userName = this.userNameForPasswordUpdate;
    this.staffService.changePassword(this.changePasswordForm.value).subscribe(
      (response: any) => {
        this.changePasswordModal = false;
        this.clearChangePasswordForm();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.responseMessage,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        if (error.status == 500) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
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

  clearChangePasswordForm() {
    this.ifgenerateOtpField = true;
    this.staffOTPValue = "";
    // this.changePasswordForm.controls.otp.reset();
    //this.changePasswordForm.reset();
  }

  totalItemPerPageForLedger(event): void {
    this.itemsLegderPerPage = Number(event.value);
    // if (this.currentPageCustomerDocListdata > 1) {
    //   this.currentLegderPage = 1;
    // }
  }
  search() {
    if (this.searchOption == "Mode") {
      this.staffLegderData = [];
      this.staffData.forEach(element => {
        if (element.paymentMode.toLowerCase() === this.searchDeatil.toLowerCase())
          this.staffLegderData.push(element);
      });
    } else if (this.searchOption == "Status") {
      this.staffLegderData = [];
      this.staffData.forEach(element => {
        if (element.status === this.searchDeatil) this.staffLegderData.push(element);
      });
    }
  }
  clearSearch() {
    this.staffLegderData = this.staffData;
    this.searchDeatil = null;
    this.searchOption = null;
  }
  additionalDetiails() {
    var lookup = {};
    var items = this.staffData;
    var result = [];

    for (var item, i = 0; (item = items[i++]); ) {
      var mode = item.paymentMode;

      if (!(mode in lookup)) {
        lookup[mode] = 1;
        result.push(mode);
      }
    }

    let totalCollection = 0;
    let totalWithdraw = 0;
    result.forEach(mode => {
      this.staffData.forEach(element => {
        if (element.paymentMode === mode && element.action === "Collected")
          totalCollection = totalCollection + element.amount;
        else if (element.paymentMode === mode && element.action === "Withdraw")
          totalWithdraw = totalWithdraw + element.amount;
      });
      let data = {
        mode: mode,
        credit: totalCollection,
        withdraw: totalWithdraw
      };
      this.additionalDetails.push(data);
    });
  }
  getStaffReceiptDatabyStaffId(id) {
    return this.customerManagementService
      .getStaffReceiptDataByStaffId(this.satffUserData.id)
      .subscribe(
        (response: any) => {
          this.staffreciptMappingList = response.dataList;
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

  navigateToRadiusStaff() {
    this.router.navigate(["/home/radiusstaff"]);
  }

  modalCloseChangePwd() {
    this.changePasswordModal = false;
  }

  modalCloseServiceList() {
    this.serviceareaModal = false;
  }

  openServiceArea() {
    this.serviceareaModal = true;
  }

  modalCloseBusinessModal() {
    this.bussinessModal = false;
  }
  openBusinessModal() {
    this.bussinessModal = true;
  }

  openTeamModal() {
    this.teamModal = true;
  }

  closeTeamModal() {
    this.teamModal = false;
  }
}
