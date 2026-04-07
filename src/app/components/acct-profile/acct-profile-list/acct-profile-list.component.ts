import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LoginService } from "src/app/service/login.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { AcctProfileService } from "src/app/service/radius-profile.service";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { FormBuilder, FormGroup } from "@angular/forms";

declare var $: any;

@Component({
  selector: "app-acct-profile-list",
  templateUrl: "./acct-profile-list.component.html",
  styleUrls: ["./acct-profile-list.component.scss"]
})
export class AcctProfileListComponent implements OnInit {
  searchkey: string;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  profileData: any = [];
  totalRecords: number;
  createAccess: any;
  editAccess: any;
  deleteAccess: any;
  loggedInUser: any;
  radiusProfileDetail: any = [];
  proxyServerName: string = "-";
  coaDMProfileName: string = "-";
  mappingMasterName: string = "-";
  checkItem: string = "-";
  isProfileDetailsModelVisible: boolean = false;
  modalToggle: boolean = true;
  searchSubmitted = false;
  searchProfileForm: FormGroup;
  showItemPerPage: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private acctProfileService: AcctProfileService,
    private fb: FormBuilder
  ) {
    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROFILES_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROFILES_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROFILES_EDIT);
  }

  async ngOnInit() {
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.searchProfileForm = this.fb.group({
      name: [""]
    });
    this.findAllAcctProfile("");
  }

  async findAllAcctProfile(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.profileData = [];
    this.acctProfileService.findAllAcctProfile(page, size).subscribe(
      (response: any) => {
        this.profileData = response.radiusProfileList;
      },
      error => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.errorMessage,
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

  async getRadiusProfileDetail(radiusProfileId, selectedMvnoId) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.isProfileDetailsModelVisible = true;
      this.acctProfileService.getProfileById(radiusProfileId).subscribe(
        (response: any) => {
          this.radiusProfileDetail = response.radiusProfile;
          if (this.radiusProfileDetail.proxyServer != null) {
            this.proxyServerName = this.radiusProfileDetail.proxyServer.name;
          } else {
            this.proxyServerName = "-";
          }
          if (this.radiusProfileDetail.checkItem != null) {
            this.checkItem = this.radiusProfileDetail.checkItem;
          } else {
            this.checkItem = "-";
          }
          if (this.radiusProfileDetail.coaDMProfile != null) {
            this.coaDMProfileName = this.radiusProfileDetail.coaDMProfile.name;
          } else {
            this.coaDMProfileName = "-";
          }
          if (this.radiusProfileDetail.mappingMaster != null) {
            this.mappingMasterName = this.radiusProfileDetail.mappingMaster.name;
          } else {
            this.mappingMasterName = "-";
          }
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
  }

  validateUserToPerformOperations(selectedMvnoId) {
    let loggedInUserMvnoId = localStorage.getItem("mvnoId");
    let userId = localStorage.getItem("userId");
    if (userId != RadiusConstants.SUPERADMINID && selectedMvnoId != loggedInUserMvnoId) {
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You are not authorized to do this operation. Please contact to the administrator",
        icon: "far fa-check-circle"
      });
      return false;
    }
    return true;
  }

  closeProfileDetailsModel() {
    this.isProfileDetailsModelVisible = false;
  }

  async changeStatus(name, status, selectedMvnoId, event) {
    event.preventDefault();
    this.modalToggle = true;
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      if (status == "Active") {
        status = "Inactive";
      } else {
        status = "Active";
      }
      this.acctProfileService.changeSatus(name, status, selectedMvnoId).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          if (!this.searchkey) {
            this.findAllAcctProfile("");
          } else {
            this.searchProfileByName();
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
  }

  async searchProfileByName() {
    this.searchSubmitted = true;
    if (this.searchProfileForm.value.name == null) {
      this.searchProfileForm.value.name = "";
    }
    if (!this.searchkey || this.searchkey !== this.searchProfileForm.value.name) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchProfileForm.value.name;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    let name = this.searchProfileForm.value.name.trim()
      ? this.searchProfileForm.value.name.trim()
      : "";
    if (this.searchProfileForm.valid) {
      this.profileData = [];
      this.acctProfileService.findByName(name).subscribe(
        (response: any) => {
          this.profileData = response.radiusProfileList;
        },
        error => {
          this.totalRecords = 0;
          if (error.error.status == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error.errorMessage,
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

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.findAllAcctProfile("");
    } else {
      this.searchProfileByName();
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllAcctProfile(this.showItemPerPage);
    } else {
      this.searchProfileByName();
    }
  }

  clearSearchForm() {
    this.searchSubmitted = false;
    this.searchProfileForm.reset();
    this.currentPage = 1;
    this.findAllAcctProfile("");
  }

  deleteConfirm(radiusProfileId, selectedMvnoId, index) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Profile?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteAcctProfileById(radiusProfileId, selectedMvnoId, index);
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

  async deleteAcctProfileById(radiusProfileId, selectedMvnoId, index) {
    this.acctProfileService.deleteAcctProfileById(radiusProfileId, selectedMvnoId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && index == 0 && this.profileData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.findAllAcctProfile("");
        } else {
          this.searchProfileByName();
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
