import { Component, OnInit, ViewChild } from "@angular/core";
import { EmailNotificationService } from "src/app/service/email-notification.service";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { LoginService } from "src/app/service/login.service";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { Observable, Observer } from "rxjs";
import { NOTIFICATIONS } from "src/app/constants/aclConstants";
@Component({
  selector: "app-email-notification",
  templateUrl: "./email-notification.component.html",
  styleUrls: ["./email-notification.component.css"]
})
export class EmailNotificationComponent implements OnInit {
  //@ViewChild('emailDetailsForm') emailDetailsForm: NgForm;
  // @ViewChild('searchForm') searchForm: NgForm;
  public loginService: LoginService;
  AclClassConstants;
  AclConstants;
  searchSubmitted = false;
  submitted = false;
  searchForm: FormGroup;
  emailDetailsForm: FormGroup;
  message: string;
  emailAddress: string;
  sourceName = "";
  statusMsg = "";
  newGroupData = {
    sourceName: "",
    emailAddress: "",
    message: "",
    eventName: ""
  };
  editGroupData = {
    emailId: "",
    sourceName: "",
    emailAddress: "",
    message: "",
    eventName: ""
  };
  searchGroupData = {
    sourceName: ""
  };

  changeStatusData: any = [];
  groupData = [];
  sourceNameValue = [
    { label: "Adopt Radius" },
    { label: "Adopt Wifi" },
    { label: "Adopt BSS API GATEWAY" },
    { label: "Adopt Common" },
    { label: "ADOPT Ticket" }
  ];
  eventTypeValue: any = [];
  eventList: any = [];
  //sourceNameValue: String[] = ["Adopt Radius", "Adopt Wifi", "Adopt Common"];
  //Used and required for pagination
  totalRecords: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  //Used to store error data and error message
  errorData: any = [];
  errorMsg = "";

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
  createAccess: boolean = false;
  editAccess: boolean = false;
  deleteAccess: boolean = false;
  sendAccess: boolean = false;
  constructor(
    private emailNotificationService: EmailNotificationService,
    private radiusUtility: RadiusUtility,
    private messageService: MessageService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_EMAIL_CREATE);
    this.deleteAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_EMAIL_DELETE);
    this.sendAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_EMAIL_SEND);
    this.editAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_EMAIL_EDIT);
    this.editMode = !this.createAccess && this.editAccess ? true : false;
    this.findAllEmail("");
  }

  ngOnInit(): void {
    this.getEventType();
    this.emailDetailsForm = this.fb.group({
      sourceName: ["", Validators.required],
      emailAddress: ["", Validators.required],
      message: ["", Validators.required],
      eventId: ["", Validators.required]
    });
    this.searchForm = this.fb.group({
      emailAddress: [""]
    });
  }

  //Properties of Confirmation Popup
  popoverTitle: string = RadiusConstants.CONFIRM_DIALOG_TITLE;
  popoverMessage: string = RadiusConstants.DELETE_GROUP_CONFIRM_MESSAGE;
  confirmedClicked: boolean = false;
  cancelClicked: boolean = false;
  closeOnOutsideClick: boolean = true;
  async searchBySourceName() {
    this.clearMessageAlert();
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

    if (this.searchForm.value.emailAddress == null) {
      this.searchForm.value.emailAddress = "";
    }
    let name = this.searchForm.value.emailAddress.trim()
      ? this.searchForm.value.emailAddress.trim()
      : "";
    if (this.searchForm.valid) {
      this.emailNotificationService.getEmailDataBySourceName(name).subscribe(
        (response: any) => {
          this.reset();
          this.groupData = response.emailList;
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
  getEventById(id) {
    this.emailNotificationService.getEventById(id).subscribe(
      (response: any) => {
        this.eventList = response;
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
  getEventType() {
    this.emailNotificationService.getEvents().subscribe(
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllEmail(this.showItemPerPage);
    } else {
      this.searchBySourceName();
    }
  }
  async findAllEmail(size) {
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

    this.emailNotificationService.findAllEmailData(this.itemsPerPage, this.currentPage).subscribe(
      (response: any) => {
        // this.groupData = response.emailList.data;
        // this.totalRecords = response.emailList.totalRecords;
        //console.log(this.totalRecords);
        // if (this.showItemPerPage > this.itemsPerPage) {
        //   this.totalDataListLength = this.groupData.length % this.showItemPerPage;
        // } else {
        //   this.totalDataListLength = this.groupData.length % this.itemsPerPage;
        if (response.message) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.message,
            icon: "far fa-times-circle"
          });
        } else {
          this.groupData = response.emailList.data;
          this.totalRecords = response.emailList.totalRecords;
        }
        // }
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

  async deleteEmailById(emailId) {
    this.emailNotificationService.deleteEmailById(emailId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.totalDataListLength == 1) {
          this.currentPage = this.currentPage - 1;
        }
        this.reset();
        if (!this.searchkey) {
          this.findAllEmail("");
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

  async addEmailDetails() {
    this.submitted = true;
    if (this.emailDetailsForm.valid) {
      if (this.editMode) {
        const updatedGroupData = {
          emailId: this.editGroupData.emailId,
          sourceName: this.emailDetailsForm.value.sourceName,
          emailAddress: this.emailDetailsForm.value.emailAddress,
          message: this.emailDetailsForm.value.message,
          eventId: this.emailDetailsForm.value.eventId
        };
        this.emailNotificationService.updateEmailDetails(updatedGroupData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.emailDetailsForm.reset();
            //this.reset();
            if (!this.searchkey) {
              this.findAllEmail("");
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
        //  this.newGroupData = data;
        // this.getEventById(this.emailDetailsForm.value.eventId);
        const saveData = {
          sourceName: this.emailDetailsForm.value.sourceName,
          emailAddress: this.emailDetailsForm.value.emailAddress,
          message: this.emailDetailsForm.value.message,
          eventId: this.emailDetailsForm.value.eventId
        };
        this.emailNotificationService.addEmailDetails(saveData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.emailDetailsForm.reset();
            //this.reset();
            if (!this.searchkey) {
              this.findAllEmail("");
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
  async sendEmailById(emailId) {
    -this.emailNotificationService.sendEmailById(emailId).subscribe(
      (response: any) => {
        this.reset();
        this.findAllEmail("");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.clearFormData();
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  editEmailById(emailId, index) {
    this.editMode = true;
    index = this.radiusUtility.getIndexOfSelectedRecord(index, this.currentPage, this.itemsPerPage);
    this.emailNotificationService.getFindEmailById(emailId).subscribe(
      (response: any) => {
        this.emailDetailsForm.patchValue({
          sourceName: response.email?.sourceName ?? "Adopt BSS API GATEWAY",
          emailAddress: response.email.emailAddress,
          message: response.email.message,
          eventId: response.email.event.eventId
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
    this.editGroupData = {
      emailId: emailId,
      sourceName: "",
      emailAddress: "",
      message: "",
      eventName: ""
    };
  }

  clearFormData() {
    this.editMode = false;
    this.emailDetailsForm.setValue({
      sourceName: "",
      emailAddress: "",
      message: "",
      eventId: ""
    });
  }
  deleteConfirm(emailId) {
    this.confirmationService.confirm({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteEmailById(emailId);
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
  createEmailNotification() {
    if (
      !this.loginService.hasOperationPermission(
        AclClassConstants.ACL_EMAIL,
        AclConstants.OPERATION_EMAIL_ADD,
        AclConstants.OPERATION_EMAIL_ALL
      )
    ) {
      this.messageService.add({
        severity: "error",
        summary: "ERROR",
        detail: "Sorry you have not privilege to add operation!"
      });
    } else {
      this.submitted = false;
      this.editMode = false;
      this.emailDetailsForm.reset();
    }
  }
  clearSearchForm() {
    this.searchSubmitted = false;
    this.reset();
    this.currentPage = 1;
    this.searchForm.reset();
    this.findAllEmail("");
    this.emailDetailsForm.reset();
  }

  reset() {
    this.clearMessageAlert();
    this.clearFormData();
  }

  pageChanged(pageNumber) {
    this.reset();
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.findAllEmail("");
    } else {
      this.searchBySourceName();
    }
  }

  canExit() {
    if (!this.emailDetailsForm.dirty) return true;
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
}
