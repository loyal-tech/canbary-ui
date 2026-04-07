import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { SmsNotificationService } from "src/app/service/sms-notification.service";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { eventNames } from "process";
import { countries } from "src/app/components/model/country";
import { LoginService } from "src/app/service/login.service";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Observable, Observer } from "rxjs";
import { NOTIFICATIONS } from "src/app/constants/aclConstants";
@Component({
  selector: "app-sms-notification",
  templateUrl: "./sms-notification.component.html",
  styleUrls: ["./sms-notification.component.css"]
})
export class SmsNotificationComponent implements OnInit {
  //@ViewChild('smsDetailsForm') smsDetailsForm: NgForm;
  //@ViewChild('searchForm') searchForm: NgForm;
  public loginService: LoginService;
  AclClassConstants;
  AclConstants;

  countries: any = countries;
  searchSubmitted = false;
  submitted = false;
  searchForm: FormGroup;
  smsDetailsForm: FormGroup;
  smsId: number;
  sourceName = "";
  statusMsg = "";
  newGroupData = {
    sourceName: "",
    countryCode: "",
    mobileNo: "",
    message: "",
    eventName: ""
  };
  editGroupData = {
    smsId: "",
    sourceName: "",
    countryCode: "",
    mobileNo: "",
    message: "",
    eventName: ""
  };
  searchGroupData = {
    sourceName: ""
  };

  changeStatusData: any = [];
  groupData: any = [];
  sourceNameValue = [
    { label: "Adopt Radius" },
    { label: "Adopt Wifi" },
    { label: "Adopt Common" },
    { label: "Adopt BSS API GATEWAY" },
    { label: "Notification Schedular" },
    { label: "Sales Crms BSS API" }
  ];
  eventTypeValue: any = [];
  //sourceNameValue: String[] = ["Adopt Radius", "Adopt Wifi", "Adopt Common"];
  //Used and required for pagination
  totalRecords: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  //Used to store error data and error message
  errorData: any = [];
  errorMsg = "";

  @ViewChild("mobileNumberFocus") el: ElementRef;
  //Used for alert message.
  alert_success: boolean = false;
  alert_update_success: boolean = false;
  alert_delete_success: boolean = false;
  alert_send_success: boolean = false;
  alert_InActive_success: boolean = false;
  alert_Active_success: boolean = false;
  alert_error_message: boolean = false;
  alert_search_error_message: boolean = false;
  editMode: boolean = false;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: string;
  totalDataListLength = 0;
  inputMobile: string;
  createAccess: boolean = false;
  editAccess: boolean = false;
  deleteAccess: boolean = false;
  sendAccess: boolean = false;
  emailAccess: boolean = false;
  constructor(
    private smsNotificationService: SmsNotificationService,
    private radiusUtility: RadiusUtility,
    private messageService: MessageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_SMS_CREATE);
    this.deleteAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_SMS_DELETE);
    this.sendAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_SMS_SEND);
    this.editAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_SMS_EDIT);
    this.emailAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_SMS);
    this.loginService = loginService;
    this.editMode = !this.createAccess && this.editAccess ? true : false;
    this.findAllSms("");
  }

  ngOnInit(): void {
    this.getEventType();
    this.commondropdownService.getsystemconfigList();
    this.smsDetailsForm = this.fb.group({
      sourceName: ["", Validators.required],
      countryCode: [this.commondropdownService.commonCountryCode],
      mobileNo: ["", Validators.required],
      message: ["", Validators.required],
      eventId: ["", Validators.required]
    });
    this.searchForm = this.fb.group({
      mobileNo: [""]
    });
    this.commondropdownService.mobileNumberLengthSubject$.subscribe(lengthObj => {
      if (lengthObj) {
        this.smsDetailsForm
          .get("mobileNo")
          ?.setValidators([
            Validators.required,
            Validators.minLength(lengthObj.min),
            Validators.maxLength(lengthObj.max)
          ]);
        this.smsDetailsForm.get("mobileNo")?.updateValueAndValidity();
      }
    });
    this.commondropdownService.mobileNumberLengthSubject$.subscribe(lengthObj => {
      if (lengthObj) {
        this.searchForm
          .get("mobileNo")
          ?.setValidators([
            Validators.required,
            Validators.minLength(lengthObj.min),
            Validators.maxLength(lengthObj.max)
          ]);
        this.searchForm.get("mobileNo")?.updateValueAndValidity();
      }
    });
  }

  onKeymobilelength(event) {
    const str = this.smsDetailsForm.value.mobileNo.toLocaleString();
    const withoutCommas = str.replace(/,/g, "");
    const strrr = withoutCommas.trim();
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    if (strrr.length > Number(mobilenumberlength)) {
      this.inputMobile = `${mobilenumberlength} character required.`;
    } else if (strrr.length == Number(mobilenumberlength)) {
      this.inputMobile = "";
    } else {
      this.inputMobile = `${mobilenumberlength} character required.`;
    }
  }

  //Properties of Confirmation Popup
  popoverTitle: string = RadiusConstants.CONFIRM_DIALOG_TITLE;
  popoverMessage: string = RadiusConstants.DELETE_GROUP_CONFIRM_MESSAGE;
  confirmedClicked: boolean = false;
  cancelClicked: boolean = false;
  closeOnOutsideClick: boolean = true;
  message: string;

  async searchBySourceName() {
    this.clearMessageAlert();
    if (this.searchForm.value.sourceName == null) {
      this.searchForm.value.sourceName = "";
    }
    if (!this.searchkey || this.searchkey !== this.searchForm.value) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchForm.value;

    if (this.showItemPerPage == 1) {
      this.itemsPerPage = this.pageITEM;
    } else {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchSubmitted = true;
    let name = this.searchForm.value.mobileNo.trim() ? this.searchForm.value.mobileNo.trim() : "";
    if (this.searchForm.valid) {
      this.smsNotificationService.getSmsDataBySourceName(name).subscribe(
        (response: any) => {
          this.reset();
          this.groupData = response.smsList;
          this.totalRecords = this.groupData.length;
          if (this.showItemPerPage > this.itemsPerPage) {
            this.totalDataListLength = this.groupData.length % this.showItemPerPage;
          } else {
            this.totalDataListLength = this.groupData.length % this.itemsPerPage;
          }
        },
        (error: any) => {
          if (error.error.status == 404) {
            this.groupData = [];
            this.totalRecords = 0;
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.message,
              icon: "far fa-times-circle"
            });
          } else if (error.error.status == 400) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: "Data Not Found",
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        }
      );
    }
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllSms(this.showItemPerPage);
    } else {
      this.searchBySourceName();
    }
  }

  async findAllSms(size) {
    let pageSize;
    this.searchkey = "";
    if (size) {
      pageSize = size;
      this.itemsPerPage = size;
    } else {
      if (this.showItemPerPage == 1) {
        this.itemsPerPage = this.pageITEM;
      } else {
        this.itemsPerPage = this.showItemPerPage;
      }
    }
    let pageData;

    this.smsNotificationService.findAllSmsData(this.itemsPerPage, this.currentPage).subscribe(
      (response: any) => {
        if (response.message) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.message,
            icon: "far fa-times-circle"
          });
        } else {
          this.groupData = response.smsList.data;
          this.totalRecords = response.smsList.totalRecords;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  async deleteSmsById(smsId) {
    this.smsNotificationService.deleteSmsById(smsId).subscribe(
      (response: any) => {
        this.reset();
        if (this.currentPage != 1 && this.totalDataListLength == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.findAllSms("");
        } else {
          this.searchBySourceName();
        }
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
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  async addSmsDetails() {
    this.submitted = true;
    if (this.smsDetailsForm.valid) {
      if (this.editMode) {
        const updatedGroupData = {
          smsId: this.editGroupData.smsId,
          sourceName: this.smsDetailsForm.value.sourceName,
          countryCode: this.smsDetailsForm.value.countryCode,
          mobileNo: this.smsDetailsForm.value.mobileNo,
          message: this.smsDetailsForm.value.message,
          eventId: this.smsDetailsForm.value.eventId
        };
        this.smsNotificationService.updateSmsDetails(updatedGroupData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.smsDetailsForm.reset();
            if (!this.searchkey) {
              this.findAllSms("");
            } else {
              this.searchBySourceName();
            }
            this.editMode = false;
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
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        const saveData = {
          sourceName: this.smsDetailsForm.value.sourceName,
          countryCode: this.smsDetailsForm.value.countryCode,
          mobileNo: this.smsDetailsForm.value.mobileNo,
          message: this.smsDetailsForm.value.message,
          eventId: this.smsDetailsForm.value.eventId
        };
        this.smsNotificationService.addSmsDetails(saveData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.smsDetailsForm.reset();
            if (!this.searchkey) {
              this.findAllSms("");
            } else {
              this.searchBySourceName();
            }
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
              detail: error.error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        );
      }
    }
  }
  async sendSmsById(smsId) {
    this.smsNotificationService.sendSmsById(smsId).subscribe(
      (response: any) => {
        this.reset();
        this.findAllSms("");
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
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  getEventType() {
    this.smsNotificationService.getEvents().subscribe(
      (response: any) => {
        this.eventTypeValue = response;
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  editSmsById(smsId, index) {
    this.editMode = true;
    //this.spinner.show();
    // index = this.radiusUtility.getIndexOfSelectedRecord(
    //   index,
    //   this.currentPage,
    //   this.itemsPerPage,
    // )
    this.smsDetailsForm.patchValue({
      //smsId: this.groupData[index].smsId,
      sourceName: this.groupData[index].sourceName,
      countryCode: this.groupData[index].countryCode,
      mobileNo: this.groupData[index].mobileNo,
      message: this.groupData[index].message,
      eventId: this.groupData[index].eventId
    });

    this.editGroupData = {
      smsId: this.groupData[index].smsId,
      sourceName: "",
      countryCode: "",
      mobileNo: "",
      message: "",
      eventName: ""
    };
  }

  clearFormData() {
    this.editMode = false;
    this.smsDetailsForm.setValue({
      sourceName: "",
      countryCode: "",
      mobileNo: "",
      message: "",
      eventId: ""
    });
  }
  deleteConfirm(smsId) {
    this.confirmationService.confirm({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteSmsById(smsId);
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
  clearMessageAlert() {
    this.alert_success = false;
    this.alert_update_success = false;
    this.alert_delete_success = false;
    this.alert_send_success = false;
    this.alert_Active_success = false;
    this.alert_InActive_success = false;
    this.alert_error_message = false;
    this.alert_search_error_message = false;
  }

  clearSearchForm() {
    this.searchSubmitted = false;
    this.reset();
    this.currentPage = 1;
    this.searchForm.reset();
    this.findAllSms("");
    this.smsDetailsForm.reset();
  }

  reset() {
    this.clearMessageAlert();
    this.clearFormData();
  }

  pageChanged(pageNumber) {
    this.reset();
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.findAllSms("");
    } else {
      this.searchBySourceName();
    }
  }

  canExit() {
    if (!this.smsDetailsForm.dirty) return true;
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

  onInput(event: any) {
    const pattern = /^[0-9]+$/;
    let inputValue = event.target.value;
    let mobilenumberlength = this.commondropdownService.commonMoNumberLength;
    // Remove non-numeric characters
    inputValue = inputValue.replace(/[^0-9]/g, "");

    // Limit to 10 digits
    inputValue = inputValue.slice(0, mobilenumberlength);

    // Update the input value only if it doesn't exceed the maximum length
    if (event.target.value.length <= mobilenumberlength) {
      event.target.value = inputValue;
    }

    // Now, you can access the 10-digit value in your Angular code
    const mobileNo = inputValue;
  }
}
