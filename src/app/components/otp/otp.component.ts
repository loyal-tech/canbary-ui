import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { OtpService } from "src/app/service/otp.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { NOTIFICATIONS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.css"],
})
export class OtpComponent implements OnInit {
  mvnoData: any;
  loggedInUser: any;
  otpProfiles: any = [];
  otpProfileList: any[] = [];
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;

  profileName: string;
  selectedAllowedValues: [];
  searchForm: FormGroup;
  detailGroupForm: FormGroup;

  editId: any;
  submitted: boolean = false;
  searchSubmitted = false;

  allowedValues = [
    { label: "Upper Case", value: "UPPER_CASE" },
    { label: "Lower Case", value: "LOWER_CASE" },
    { label: "Symbol", value: "SYMBOL" },
    { label: "Number", value: "NUMBER" },
  ];
  generationTypes = [
    { label: "Always New", value: "ALWAYS_NEW" },
    { label: "Reuse", value: "REUSE" },
    { label: "Static", value: "STATIC" },
  ];

  @ViewChild("focusOnOTP") usernameRef: ElementRef;
  showDetailsDialogue: boolean;
  otpProfileData: any = [];

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: any = "";
  totalDataListLength = 0;

  AclClassConstants;
  AclConstants;
  createAccess: boolean = false;
  editAccess: boolean = false;
  deleteAccess: boolean = false;
  sendAccess: boolean = false;
  public loginService: LoginService;
  constructor(
    private otpService: OtpService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private radiusUtility: RadiusUtility,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_OTP_CREATE);
    this.deleteAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_OTP_DELETE);
    this.editAccess = loginService.hasPermission(NOTIFICATIONS.NOTIFICATION_OTP_EDIT);
    this.editId = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.getAll("");
    this.detailGroupForm = this.fb.group({
      name: ["", Validators.required],
      length: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      validity: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      selectedGenerationType: [[], Validators.required],
      selectedAllowedValues: ["", Validators.required],
      staticOtp: [""],
    });
    this.searchForm = this.fb.group({
      name: [""],
    });
  }

  createNewOtp() {
    if (
      !this.loginService.hasOperationPermission(
        AclClassConstants.ACL_OTP,
        AclConstants.OPERATION_OTP_ADD,
        AclConstants.OPERATION_OTP_ALL
      )
    ) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Sorry you have not privilege to add or edit operation!",
        icon: "far fa-times-circle",
      });
    } else {
      this.clearFormData();
      this.usernameRef.nativeElement.focus();
    }
  }

  getAll(list) {
    let size;
    this.searchkey = "";
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      if (this.showItemPerPage == 1) {
        this.itemsPerPage = this.pageITEM;
      } else {
        this.itemsPerPage = this.showItemPerPage;
      }
    }

    this.otpService.getAll().subscribe(
      (response: any) => {
        this.otpProfiles = response.otpProfileList;
        // this.totalRecords =  this.otpProfiles.length;
        this.otpProfileList = this.otpProfiles;

        if (this.showItemPerPage > this.itemsPerPage) {
          this.totalDataListLength = this.otpProfiles.length % this.showItemPerPage;
        } else {
          this.totalDataListLength = this.otpProfiles.length % this.showItemPerPage;
        }
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.errorMessage,
            icon: "far fa-times-circle",
          });
        }
        this.otpProfileList = [];
        this.totalRecords = 0;
      }
    );
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAll(this.showItemPerPage);
    } else {
      this.search();
    }
  }

  getGenerationType(generationType: string) {
    return generationType.replace("_", " ");
  }

  search() {
    if (this.searchForm.valid) {
      // this.currentPage = 1;
      if (!this.searchkey || this.searchkey !== this.searchForm.controls.name.value.trim()) {
        this.currentPage = 1;
      }

      if (this.showItemPerPage == 1) {
        this.itemsPerPage = this.pageITEM;
      } else {
        this.itemsPerPage = this.showItemPerPage;
      }

      this.searchkey = this.searchForm.controls.name.value;

      this.searchSubmitted = true;

      this.otpProfileList = [];
      let profileName = this.searchForm.controls.name.value
        ? this.searchForm.controls.name.value
        : "";
      this.otpService.getByName(profileName).subscribe(
        (response: any) => {
          this.otpProfiles = response.otpProfileList;
          this.totalRecords = this.otpProfiles.length;
          this.otpProfileList = this.otpProfiles;

          if (this.showItemPerPage > this.itemsPerPage) {
            this.totalDataListLength = this.otpProfiles.length % this.showItemPerPage;
          } else {
            this.totalDataListLength = this.otpProfiles.length % this.showItemPerPage;
          }
        },
        (error: any) => {
          if (error.error.status == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.msg,
              icon: "far fa-times-circle",
            });
          } else if (error.error.status == 400) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: "Data Not Found",
              icon: "far fa-times-circle",
            });
          } else {
            this.totalRecords = 0;
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.errorMessage,
              icon: "far fa-times-circle",
            });
          }
          this.totalRecords = 0;
          this.otpProfileList = [];
        }
      );
    }
  }
  deleteConfirm(profileId, index) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Profile?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.delete(profileId, index);
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected",
        });
      },
    });
  }
  delete(profileId, index) {
    this.otpService.deleteById(profileId).subscribe(
      (response: any) => {
        this.clearFormData();
        if (this.currentPage != 1 && this.totalDataListLength == 1) {
          this.currentPage = this.currentPage - 1;
        }

        if (!this.searchkey) {
          this.getAll("");
        } else {
          this.search();
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage || error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  edit(profileId) {
    this.editId = profileId;

    this.otpService.getById(profileId).subscribe(
      (response: any) => {
        let otpProfileData = response.otpProfile;

        this.detailGroupForm.patchValue({
          name: otpProfileData.profileName,
          length: otpProfileData.otpLength,
          validity: otpProfileData.otpValidityInMin,
          selectedAllowedValues: otpProfileData.type,
          selectedGenerationType: otpProfileData.generationType,
          staticOtp: otpProfileData.staticOtp,
        });
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  mvnoId: any;
  addOrUpdate() {
    this.submitted = true;
    if (this.detailGroupForm.invalid) {
      return;
    }
    this.mvnoId = this.detailGroupForm.value.mvnoName;
    if (this.editId) {
      let otpProfileData = {
        profileId: this.editId,
        profileName: this.detailGroupForm.value.name,
        otpLength: this.detailGroupForm.value.length,
        otpValidityInMin: this.detailGroupForm.value.validity,
        generationType: this.detailGroupForm.value.selectedGenerationType,
        type: this.detailGroupForm.value.selectedAllowedValues,
        staticOtp: this.detailGroupForm.value.staticOtp,
      };

      this.update(otpProfileData);
    } else {
      let otpProfileData = {
        profileId: null,
        profileName: this.detailGroupForm.value.name,
        otpLength: this.detailGroupForm.value.length,
        otpValidityInMin: this.detailGroupForm.value.validity,
        generationType: this.detailGroupForm.value.selectedGenerationType,
        type: this.detailGroupForm.value.selectedAllowedValues,
        staticOtp: this.detailGroupForm.value.staticOtp,
      };
      this.add(otpProfileData);
    }
  }

  private add(otpProfileData) {
    this.otpService.add(otpProfileData).subscribe(
      (response: any) => {
        this.getAll("");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        this.clearFormData();
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  private update(data: any) {
    this.otpService.update(this.editId, data).subscribe(
      (response: any) => {
        if (!this.searchkey) {
          this.getAll("");
        } else {
          this.search();
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle",
        });
        this.clearFormData();
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage || error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  clearFormData() {
    this.editId = null;
    this.submitted = false;
    this.detailGroupForm.reset();
    this.detailGroupForm.get("selectedAllowedValues").patchValue([]);
  }

  clearSearchForm() {
    this.clearFormData();
    this.searchSubmitted = false;
    this.searchForm.reset();
    this.currentPage = 1;
    this.getAll("");
    this.searchForm.controls.name.setValue("");
  }

  pageChanged(pageNumber) {
    this.clearFormData();
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getAll("");
    } else {
      this.search();
    }
  }

  getOTPDetail(profileId) {
    this.showDetailsDialogue = true;

    this.otpService.getById(profileId).subscribe(
      (response: any) => {
        this.otpProfileData = response.otpProfile;
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  canExit() {
    if (!this.detailGroupForm.dirty) return true;
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
          },
        });
        return false;
      });
    }
  }

  generationTypeChange(event: any) {
    let value = event.value;
    if (value === "STATIC") {
      this.detailGroupForm.get("staticOtp").setValidators([Validators.required]);
      this.detailGroupForm.get("staticOtp").updateValueAndValidity();
    } else {
      this.detailGroupForm.get("staticOtp").clearValidators();
      this.detailGroupForm.get("staticOtp").updateValueAndValidity();
    }
  }
}
