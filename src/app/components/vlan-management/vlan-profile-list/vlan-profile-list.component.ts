import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { AREA, CITY, COUNTRY, PINCODE, STATE } from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LiveUserService } from "src/app/service/live-user.service";
import { LoginService } from "src/app/service/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { AcctProfileService } from "src/app/service/radius-profile.service";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { FormBuilder, FormGroup } from "@angular/forms";
import { VlanProfileService } from "src/app/service/vlan-profile.service";

declare var $: any;

@Component({
  selector: "app-vlan-profile-list",
  templateUrl: "./vlan-profile-list.component.html",
  styleUrls: ["./vlan-profile-list.component.scss"]
})
export class VlanProfileListComponent implements OnInit {
  searchkey: string;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  profileData: any;
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
  pageLimitOptions = [
    { value: 5 },
    { value: 10 },
    { value: 20 },
    { value: 50 },
    { value: 100 },
    { value: 500 },
    { value: 1000 }
  ];
  searchOptionSelect = [
    { label: "VLAN Name", value: "vlanName" },
    { label: "NAS Identifier", value: "nasIdentifier" }
  ];
  searchOption: any;
  selectedProfiles: Set<string> = new Set();
  newFirst: 0;
  isProfileChecked: boolean = false;
  isVlanAuditModel: boolean = false;
  vlanprofileId: any;
  auditDetails: any;
  vlanProfileDetailModal: boolean = false;
  vlanProfileData: any;
  userId: string;
  superAdminId: string;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private vlanProfileService: VlanProfileService,
    private fb: FormBuilder
  ) {
    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_VLAN_MANAGMENT_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_VLAN_MANAGMENT_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_VLAN_MANAGMENT_EDIT);
  }

  async ngOnInit() {
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.searchProfileForm = this.fb.group({
      vlanName: [""],
      nasIdentifier: [""]
    });
    this.findAllVLANProfile("");
    this.userId = localStorage.getItem("userId");
    this.superAdminId = RadiusConstants.SUPERADMINID;
  }

  async findAllVLANProfile(list) {
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
    var pageRequest = {
      size: size,
      page: page
    };
    this.vlanProfileService.findAllVLANProfile(pageRequest).subscribe(
      (response: any) => {
        let data = response.vlanList.data;
        this.profileData = data.map(element => {
          return { ...element, isSingleProfileChecked: this.selectedProfiles.has(element.vlanId) };
        });
        const allSelected = this.profileData.every(profile => profile.isSingleProfileChecked);
        this.isProfileChecked = allSelected;
        this.totalRecords = response.vlanList.totalRecords;
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

  allSelectProfiles(event: any) {
    const checked = event.checked;
    this.profileData.forEach(profile => {
      profile.isSingleProfileChecked = checked;
      if (checked) {
        this.selectedProfiles.add(profile.vlanId);
      } else {
        this.selectedProfiles.delete(profile.vlanId);
      }
    });
    this.isProfileChecked = event.checked;
  }

  addProfileChecked(vlanId: string, event: any) {
    const checked = event.checked;
    const profile = this.profileData.find(p => p.vlanId === vlanId);
    if (profile) {
      profile.isSingleProfileChecked = checked;
      if (checked) {
        this.selectedProfiles.add(vlanId);
      } else {
        this.selectedProfiles.delete(vlanId);
      }
    }
    this.isProfileChecked = this.profileData.every(profile => profile.isSingleProfileChecked);
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

  async searchProfileByName() {
    this.searchSubmitted = true;

    if (!this.searchkey || this.searchkey !== this.searchOption) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchOption;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }

    let page = this.currentPage;
    let size = this.itemsPerPage;
    if (this.searchProfileForm.valid) {
      this.profileData = [];
      this.vlanProfileService.search(this.searchProfileForm.value, page, size).subscribe(
        (response: any) => {
          this.profileData = response.vlanList.data;
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
      this.findAllVLANProfile("");
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
      this.findAllVLANProfile(this.showItemPerPage);
    } else {
      this.searchProfileByName();
    }
  }

  clearSearchForm() {
    this.searchSubmitted = false;
    this.searchProfileForm.reset();
    this.currentPage = 1;
    this.searchOption = "";
    this.findAllVLANProfile("");
  }

  deleteConfirm(vlanProfileId, selectedMvnoId, index) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Profile?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteVLANProfileById(vlanProfileId, selectedMvnoId, index);
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

  deleteMultipleVLAnConfirm() {
    this.confirmationService.confirm({
      message: "Do you want to delete multiple Vlan Profile?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteMultipleVLANProfile();
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

  deleteMultipleVLANProfile() {
    if (this.selectedProfiles.size === 0) {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "No users selected for deletion.",
        icon: "far fa-exclamation-circle"
      });
      return;
    }
    const vlanIds = Array.from(this.selectedProfiles);
    this.vlanProfileService.deleteVLANProfile(vlanIds).subscribe(
      (response: any) => {
        this.selectedProfiles.clear();
        this.currentPage = 1;
        if (!this.searchkey) {
          this.findAllVLANProfile("");
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

  async deleteVLANProfileById(vlanProfileId, selectedMvnoId, index) {
    let userId = localStorage.getItem("userId");
    let loggedInUser = localStorage.getItem("loggedInUser");
    this.vlanProfileService
      .deleteVLANProfileById(vlanProfileId, selectedMvnoId, userId, loggedInUser)
      .subscribe(
        (response: any) => {
          if (
            this.currentPage != 1 &&
            index == 0 &&
            this.profileData.length % this.itemsPerPage == 1
          ) {
            this.currentPage = this.currentPage - 1;
          }
          if (!this.searchkey) {
            this.findAllVLANProfile("");
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

  selSearchOption(event) {
    if (event.value == "vlanName") {
      this.searchProfileForm.patchValue({
        nasIdentifier: ""
      });
    } else {
      this.searchProfileForm.patchValue({
        vlanName: ""
      });
    }
  }
  viewAudit(vlanProfileId) {
    let size;
    this.vlanprofileId = vlanProfileId;
    let page = this.currentPage;
    var pageRequest = {
      size: this.itemsPerPage,
      page: this.currentPage
    };
    this.vlanProfileService.findVLANAudit(pageRequest, vlanProfileId).subscribe(
      (response: any) => {
        this.auditDetails = response.vlanAuditList.data;
        this.totalRecords = response.vlanAuditList.totalRecords;
        this.isVlanAuditModel = true;
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

  TotalItemPerPageAudit(pageNumber) {
    this.itemsPerPage = pageNumber.value;
    this.auditDetails = null;
    this.viewAudit(this.vlanprofileId);
  }
  pageAuditChanged(pageNumber) {
    this.currentPage = pageNumber;
    this.viewAudit(this.vlanprofileId);
  }

  //   TotalItemPerPage(event) {
  //     this.showItemPerPage = Number(event.value);
  //     if (this.currentPage > 1) {
  //       this.currentPage = 1;
  //     }
  //     if (!this.searchkey) {
  //       this.findAllVLANProfile(this.showItemPerPage);
  //     } else {
  //       this.searchProfileByName();
  //     }
  //   }
  closeAuditDetailsModel() {
    this.isVlanAuditModel = false;
  }

  getVlanProfileDetails(vlanId) {
    this.vlanProfileDetailModal = true;
    this.getVLANProfileById(vlanId);
  }

  closeVlanProfileDetails() {
    this.vlanProfileDetailModal = false;
  }

  getVLANProfileById(vlanProfileId) {
    this.vlanProfileService.getProfileById(vlanProfileId).subscribe(
      (response: any) => {
        this.vlanProfileData = response.vlan;
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
  findAllVLANAudit(list) {
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
    var pageRequest = {
      size: size,
      page: page
    };
    this.vlanProfileService.findAllVLANAudit(pageRequest).subscribe((response: any) => {});
  }
}
