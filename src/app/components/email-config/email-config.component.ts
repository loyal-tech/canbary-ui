import { Component, OnInit, ViewChild } from "@angular/core";
import { EmailConfigService } from "src/app/service/email-config.service";
import {
  FormBuilder,
  Validators,
  FormGroup,
  NgForm,
  AbstractControl,
  ValidationErrors
} from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { MASTERS, NOTIFICATIONS } from "src/app/constants/aclConstants";
// import { ConfirmationService } from 'primeng/api';

@Component({
  selector: "app-email-config",
  templateUrl: "./email-config.component.html",
  styleUrls: ["./email-config.component.css"]
})
export class EmailConfigComponent implements OnInit {
  AclClassConstants;
  AclConstants;
  groupName = "";
  statusMsg = "";
  newGroupData = {
    name: "",
    cgStatus: ""
  };
  editGroupData = {
    emailConfigId: "",
    userName: "",
    password: "",
    authParam: "",
    authValue: "",
    //starttlsParam: '',
    authType: "",
    hostParam: "",
    hostValue: "",
    portParam: "",
    portValue: ""
  };

  changeStatusData: any = [];
  groupData: any = [];
  serviceType: any;
  editForm: FormGroup;
  submitted = false;
  isEmailConfigEdit = true;

  //Used and required for pagination
  totalRecords: String;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  //Used to store error data and error message
  errorData: any = [];
  errorMsg = "";

  editMode: boolean = false;
  smtpAuth = [
    { label: "true", value: true },
    { label: "false", value: false }
  ];
  authType = [
    { label: "StartTLS", value: "StartTLS" },
    { label: "SSL", value: "SSL" }
  ];
  accessData: any = JSON.parse(localStorage.getItem("accessData"));
  loginmvnoid: any = JSON.parse(localStorage.getItem("mvnoId"));

  //hostServer = [{ label: 'smtp.gmail.com' }, { label: 'smtp.live.com' }, { label: 'smtp.office365.com	' }, { label: 'smtp.mail.yahoo.com' }, { label: 'plus.smtp.mail.yahoo' }];
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  loggedInUser: string;

  showPassword = false;
  _passwordType = "password";

  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  mvnoId: any;
  constructor(
    private messageService: MessageService,
    private emailConfigService: EmailConfigService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private confirmationService: ConfirmationService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public loginService: LoginService // private confirmationService: ConfirmationService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.createAccess = loginService.hasPermission(NOTIFICATIONS.EMAIL_CONFIG_CREATE);
    this.editAccess = loginService.hasPermission(NOTIFICATIONS.EMAIL_CONFIG_EDIT);
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      userName: ["", [Validators.required, this.noSpaceValidator]],
      password: ["", [Validators.required, this.noSpaceValidator]],
      authValue: ["", Validators.required],
      authType: ["", Validators.required],
      hostValue: ["", Validators.required],
      portValue: ["", Validators.required],
      mvnoName: [""],
      createdBy: [""],
      lastModifiedBy: [""]
    });
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.getCurrentStaffBUId();
  }

  //Properties of Confirmation Popup
  popoverTitle: string = RadiusConstants.CONFIRM_DIALOG_TITLE;
  popoverMessage: string = RadiusConstants.DELETE_GROUP_CONFIRM_MESSAGE;
  confirmedClicked: boolean = false;
  cancelClicked: boolean = false;
  closeOnOutsideClick: boolean = true;

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    this.findAll(this.showItemPerPage);
  }

  async findAll(size) {
    this.serviceType = "BSS";
    let page_list;
    if (size) {
      page_list = size;
      this.itemsPerPage = size;
    } else {
      if (this.showItemPerPage == 1) {
        this.itemsPerPage = this.pageITEM;
      } else {
        this.itemsPerPage = this.showItemPerPage;
      }
    }

    this.emailConfigService.findAll(this.currentStaffBuid, this.serviceType).subscribe(
      (response: any) => {
        this.groupData = response.emailConfigList;
        this.totalRecords = this.groupData.length;
        // const hasMVNOIdOne = this.groupData.some(item => item.mvnoId === 1);
        // if (this.loginmvnoid == 1) {
        //   if (hasMVNOIdOne && this.groupData !== null && this.groupData.length > 0) {
        //     this.editMode = true;
        //   }
        // } else {
        //   if (hasMVNOIdOne) {
        //     if (this.groupData !== null && this.groupData.length > 1) {
        //       this.editMode = false;
        //     }
        //   } else {
        //     if (this.groupData !== null && this.groupData.length > 0) {
        //       this.editMode = false;
        //     }
        //   }
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

  async getEdit() {
    if (this.groupData.size > 1) {
      this.editMode = true;
    }
  }
  async addeditEmailConfig(id) {
    this.serviceType = "BSS";
    this.submitted = true;
    if (this.editMode) {
      if (this.editForm.valid) {
        const updatedGroupData = {
          emailConfigId: this.editGroupData.emailConfigId,
          userName: this.editForm.value.userName,
          password: this.editForm.value.password,
          smtpAuth: this.editForm.value.authValue,
          authType: this.editForm.value.authType,
          hostServer: this.editForm.value.hostValue,
          port: this.editForm.value.portValue,
          mvnoId: this.editForm.value.mvnoName,
          createdBy: this.editForm.value.createdBy,
          lastModifiedBy: this.loggedInUser,
          serviceType: this.serviceType
        };

        this.emailConfigService
          .updateEmailConfig(updatedGroupData, this.currentStaffBuid)
          .subscribe(
            (response: any) => {
              this.submitted = false;
              this.editForm.reset();
              this.findAll("");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Updated Successfuly",
                icon: "far fa-check-circle"
              });
              this.editMode = false;
              this.isEmailConfigEdit = true;
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
    } else {
      if (this.editForm.valid) {
        const updatedGroupData = {
          emailConfigId: this.editGroupData.emailConfigId,
          userName: this.editForm.value.userName,
          password: this.editForm.value.password,
          smtpAuth: this.editForm.value.authValue,
          authType: this.editForm.value.authType,
          hostServer: this.editForm.value.hostValue,
          port: this.editForm.value.portValue,
          mvnoId: this.editForm.value.mvnoName,
          createdBy: this.editForm.value.createdBy,
          lastModifiedBy: this.loggedInUser,
          serviceType: this.serviceType
        };
        this.emailConfigService.addEmailConfig(updatedGroupData, this.currentStaffBuid).subscribe(
          (response: any) => {
            this.submitted = false;
            localStorage.setItem("isEdit", "true");
            this.editForm.reset();
            this.findAll("");
            this.editMode = true;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "add Successfuly",
              icon: "far fa-check-circle"
            });
            location.reload();
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
  // else{
  //   if(this.editForm.valid){
  //     console.log("addEmailConfig buid:::", this.currentStaffBuid);
  //
  //     const updatedGroupData = {
  //       emailConfigId: this.editGroupData.emailConfigId,
  //       userName: this.editForm.value.userName,
  //       password: this.editForm.value.password,
  //       smtpAuth: this.editForm.value.authValue,
  //       authType: this.editForm.value.authType,
  //       hostServer: this.editForm.value.hostValue,
  //       port: this.editForm.value.portValue,
  //       mvnoId: this.editForm.value.mvnoName,
  //       createdBy: this.editForm.value.createdBy,
  //       lastModifiedBy: this.loggedInUser,
  //     };
  //     this.emailConfigService.addEmailConfig(updatedGroupData , this.currentStaffBuid).subscribe(
  //       (response: any) => {
  //         this.submitted = false;
  //         localStorage.setItem("isEdit" ,"true");
  //         this.editForm.reset();
  //         this.findAll("");
  //         this.editMode = true;
  //         this.messageService.add({
  //           severity: "success",
  //           summary: "Successfully",
  //           detail: "add Successfuly",
  //           icon: "far fa-check-circle",
  //         });
  //         location.reload();
  //
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: error.error.errorMessage,
  //           detail: error.error.errorMessage,
  //           icon: "far fa-times-circle",
  //         });
  //
  //       }
  //     );
  //   }
  // }
  // }

  editConfigById(emailConfigId, index) {
    this.editMode = true;
    this.isEmailConfigEdit = false;
    // index = this.radiusUtility.getIndexOfSelectedRecord(
    //   index,
    //   this.currentPage,
    //   this.itemsPerPage,
    // )

    this.editForm.patchValue({
      userName: this.groupData[index].userName,
      password: this.groupData[index].password,
      authValue: this.groupData[index].smtpAuth,
      authType: this.groupData[index].authType,
      hostValue: this.groupData[index].hostServer,
      portValue: this.groupData[index].port,
      mvnoName: this.groupData[index].mvnoId
    });

    this.editGroupData = {
      emailConfigId: this.groupData[index].emailConfigId,
      userName: "",
      password: "",
      authParam: "",
      authValue: "",
      // starttlsParam: '',
      authType: "",
      hostParam: "",
      hostValue: "",
      portParam: "",
      portValue: ""
    };
  }

  async clearSearchForm() {
    this.currentPage = 1;
    this.findAll("");
  }

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
  }

  canExit() {
    if (!this.editForm.dirty) return true;
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

  currentLoginStaffData: any;
  currentStaffBuid: any;
  async getCurrentStaffBUId() {
    const url =
      "/staffuser/" + localStorage.getItem("userId") + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      async (response: any) => {
        if (response.status == 200) {
          this.currentLoginStaffData = await response.Staff;
          this.currentStaffBuid = this.currentLoginStaffData?.businessUnitIdsList || [];
          if (!Array.isArray(this.currentStaffBuid)) {
            this.currentStaffBuid = [];
          }
          if (this.currentStaffBuid.length === 1) {
            this.currentStaffBuid = this.currentStaffBuid[0];
            this.findAll("");
          } else if (this.currentStaffBuid.length === 0) {
            this.currentStaffBuid = 0;
            this.findAll("");
          } else if (this.currentStaffBuid.length > 1) {
            this.currentStaffBuid = 0;
            this.findAll("");
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: "Multiple BU found in given staff",
              icon: "far fa-times-circle"
            });
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.ERROR || "An unexpected error occurred",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  noSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.includes(" ")) {
      return { noSpace: true };
    }
    return null;
  }
}
