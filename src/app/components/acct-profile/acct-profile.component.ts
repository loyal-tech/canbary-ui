import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup} from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Iprofile } from "src/app/components/model/acct-profile";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-acct-profile",
  templateUrl: "./acct-profile.component.html",
  styleUrls: ["./acct-profile.component.css"],
})
export class AcctProfileComponent implements OnInit {
  submitted = false;
  searchSubmitted = false;
  //   acctProfileForm: FormGroup;
  searchProfileForm: FormGroup;
  authenticationMode: any[] = [];
  //Client Group datah
  proxyServerData: any = [];
  mappingMasterData: any = [];
  profileData: any = [];
  //Used and required for pagination
  totalRecords: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  editProfileData: Iprofile;
  editProfileId: number;
  editMode: boolean = false;
  status = [{ label: "Active" }, { label: "Inactive" }];
  status1 = [{ label: "Enable" }, { label: "Disable" }];
  type = [];
  coA = [{ label: "None" }, { label: "CoA" }, { label: "DM" }];
  showProfile: boolean = false;
  mvnoData: any;
  loggedInUser: any;
  mvnoId: any;
  modalToggle: boolean = true;
  filteredMappingList: Array<any> = [];
  filteredCoADMProfileList: Array<any> = [];
  filteredProxyServerList: Array<any> = [];
  deviceDriverList: Array<any> = [];
  accessData: any = JSON.parse(localStorage.getItem("accessData"));

  @ViewChild("profileName") usernameRef: ElementRef;
  showMacAttribute: boolean = false;
  showMACAuth: boolean = false;

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  createAccess: any;
  editAccess: any;
  deleteAccess: any;
  isShowMenu = true;
  isShowCreateView = true;
  isShowListView = true;

  constructor(
    loginService: LoginService,
    private route: ActivatedRoute
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROFILES_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROFILES_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_PROFILES_EDIT);
    // this.findAllAcctProfile("");
    // this.commondropdownService
    //   .getMethodWithCache("/commonList/generic/RADIUS_REQUEST_TYPE")
    //   .subscribe((response: any) => {
    //     this.type = response.dataList;
    //   });
    //this.getAllProxyServer();
  }

  ngOnInit(): void {
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // if (this.loggedInUser == "superadmin") {
    //   this.acctProfileForm = this.fb.group({
    //     name: ["", Validators.required],
    //     status: ["", Validators.required],
    //     authenticationMode: ["", Validators.required],
    //     checkItem: [""],
    //     accountCdrStatus: ["", Validators.required],
    //     sessionStatus: ["", Validators.required],
    //     priority: [""],
    //     requestType: ["", Validators.required],
    //     authAudit: ["", Validators.required],
    //     proxyServerName: [""],
    //     // coadm: [""],
    //     // coaDMProfile: [""],
    //     mappingMaster: ["", Validators.required],
    //     mvnoName: ["", Validators.required],
    //     autoProvisionMac: ["Disable", Validators.required],
    //     deviceDriverName: [""],
    //   });
    // } else {
    //   this.acctProfileForm = this.fb.group({
    //     name: ["", Validators.required],
    //     status: ["", Validators.required],
    //     authenticationMode: ["", Validators.required],
    //     checkItem: [""],
    //     accountCdrStatus: ["", Validators.required],
    //     sessionStatus: ["", Validators.required],
    //     priority: [""],
    //     requestType: ["", Validators.required],
    //     authAudit: ["", Validators.required],
    //     proxyServerName: [""],
    //     // coadm: [""],
    //     // coaDMProfile: [""],
    //     mappingMaster: ["", Validators.required],
    //     mvnoName: [""],
    //     autoProvisionMac: ["Disable", Validators.required],
    //     deviceDriverName: [""],
    //   });
    // }
    // this.searchProfileForm = this.fb.group({
    //   name: [""],
    // });
    // this.getAllMappingMasters();
    // this.getAllProxyServer();
    // this.getAllDeviceDriverList();
    // // this.getAuthenticationMode();
    // this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    // this.loggedInUser = localStorage.getItem("loggedInUser");
    // this.mvnoId = localStorage.getItem("mvnoId");

    const childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    if (childUrlSegment === "list") {
      this.isShowMenu = true;
      this.isShowListView = true;
      this.isShowCreateView = false;
    } else if (childUrlSegment === "create" || childUrlSegment === "edit") {
      this.isShowMenu = true;
      this.isShowCreateView = true;
      this.isShowListView = false;
    } else {
      this.isShowMenu = false;
      this.isShowCreateView = false;
      this.isShowListView = false;
    }
  }

  //   coaData: any = [];

  //   createRadiusProfile() {
  //     this.editMode = false;
  //     this.submitted = false;
  //     this.showMacAttribute = false;
  //     this.showMACAuth = false;
  //     // this.acctProfileForm.reset();
  //     // this.acctProfileForm.get("coaDMProfile").clearValidators();
  //     // this.acctProfileForm.get("coaDMProfile").updateValueAndValidity();
  //     // this.acctProfileForm.get("macAttribute").clearValidators();
  //     // this.acctProfileForm.get("macAttribute").updateValueAndValidity();
  //     // this.acctProfileForm.patchValue({
  //     //   macAuth: "Disable",
  //     // });
  //     this.usernameRef.nativeElement.focus();
  //   }

  //   getAuthenticationMode() {
  //     this.commondropdownService
  //       .getMethodWithCache("/commonList/generic/radius_profile_mode")
  //       .subscribe((response: any) => {
  //         this.authenticationMode = response.dataList;
  //       });
  //   }

  //   getcoaDMProfiles(type, mvno) {
  //     if (type) {
  //       this.coaService.getCoAByType(type).subscribe(
  //         (response: any) => {
  //           if (mvno == RadiusConstants.SUPER_ADMIN_MVNO) {
  //             this.filteredCoADMProfileList = response.coaDMProfileList;
  //           } else {
  //             this.filteredCoADMProfileList = response.coaDMProfileList.filter(
  //               element => element.mvnoId == mvno || element.mvnoId == 1
  //             );
  //           }
  //         },
  //         error => {
  //           this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: error.error.errorMessage,
  //             icon: "far fa-times-circle",
  //           });
  //         }
  //       );
  //     } else {
  //     }
  //   }

  //   TotalItemPerPage(event) {
  //     this.showItemPerPage = Number(event.value);
  //     if (this.currentPage > 1) {
  //       this.currentPage = 1;
  //     }
  //     if (!this.searchkey) {
  //       this.findAllAcctProfile(this.showItemPerPage);
  //     } else {
  //       this.searchProfileByName();
  //     }
  //   }

  //   async searchProfileByName() {
  //     this.searchSubmitted = true;
  //     if (this.searchProfileForm.value.name == null) {
  //       this.searchProfileForm.value.name = "";
  //     }
  //     // this.currentPage = 1;
  //     if (!this.searchkey || this.searchkey !== this.searchProfileForm.value.name) {
  //       this.currentPage = 1;
  //     }
  //     this.searchkey = this.searchProfileForm.value.name;
  //     if (this.showItemPerPage) {
  //       this.itemsPerPage = this.showItemPerPage;
  //     }
  //     let name = this.searchProfileForm.value.name.trim()
  //       ? this.searchProfileForm.value.name.trim()
  //       : "";
  //     if (this.searchProfileForm.valid) {
  //       this.profileData = [];
  //       this.acctProfileService.findByName(name).subscribe(
  //         (response: any) => {
  //           this.profileData = response.radiusProfileList;
  //           // this.totalRecords = response.radiusProfileList.totalRecords;
  //         },
  //         error => {
  //           this.totalRecords = 0;
  //           if (error.error.status == 404) {
  //             this.messageService.add({
  //               severity: "info",
  //               summary: "Info",
  //               detail: error.error.errorMessage,
  //               icon: "far fa-times-circle",
  //             });
  //           } else {
  //             this.messageService.add({
  //               severity: "error",
  //               summary: "Error",
  //               detail: error.error.errorMessage,
  //               icon: "far fa-times-circle",
  //             });
  //           }
  //         }
  //       );
  //     }
  //   }

  //   clearSearchForm() {
  //     this.clearFormData();
  //     this.searchSubmitted = false;
  //     this.searchProfileForm.reset();
  //     this.currentPage = 1;
  //     this.findAllAcctProfile("");
  //   }

  //   clearFormData() {
  //     this.editMode = false;
  //     this.submitted = false;
  //     // this.acctProfileForm.reset();
  //     // this.acctProfileForm.controls.autoProvisionMac.setValue("Disable");
  //   }

  //   async findAllAcctProfile(list) {
  //     let size;
  //     this.searchkey = "";
  //     let page = this.currentPage;
  //     if (list) {
  //       size = list;
  //       this.itemsPerPage = list;
  //     } else {
  //       size = this.itemsPerPage;
  //     }
  //     this.profileData = [];
  //     this.acctProfileService.findAllAcctProfile(page, size).subscribe(
  //       (response: any) => {
  //         this.profileData = response.radiusProfileList;
  //         // this.totalRecords = response.radiusProfileList.totalRecords;
  //       },
  //       error => {
  //         this.totalRecords = 0;
  //         if (error.error.status == 404) {
  //           this.messageService.add({
  //             severity: "info",
  //             summary: "Info",
  //             detail: error.error.errorMessage,
  //             icon: "far fa-times-circle",
  //           });
  //         } else {
  //           this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: error.error.errorMessage,
  //             icon: "far fa-times-circle",
  //           });
  //         }
  //       }
  //     );
  //   }

  //   async getAllMappingMasters() {
  //     this.dbMappingMasterService.findAllActiveDBMappingMasters().subscribe(
  //       (response: any) => {
  //         this.mappingMasterData = response;
  //         this.getDetailsByMVNO(JSON.parse(localStorage.getItem("mvnoId")));
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.errorMessage,
  //           icon: "far fa-times-circle",
  //         });
  //       }
  //     );
  //   }

  //   async getAllProxyServer() {
  //     this.acctProfileService.getProxyServer().subscribe(
  //       (response: any) => {
  //         this.proxyServerData = response;
  //         this.getDetailsByMVNO(localStorage.getItem("mvnoId"));
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.errorMessage,
  //           icon: "far fa-times-circle",
  //         });
  //       }
  //     );
  //   }

  //   //   async addAcctProfile() {
  //   //     this.submitted = true;
  //   //     if (this.acctProfileForm.valid) {
  //   //       if (this.editMode) {
  //   //         this.editProfileData = this.acctProfileForm.value;
  //   //         this.editProfileData.radiusProfileId = this.editProfileId;
  //   //         this.acctProfileService.updateAcctProfile(this.editProfileData).subscribe(
  //   //           (response: any) => {
  //   //             this.editMode = false;
  //   //             this.submitted = false;
  //   //             if (!this.searchkey) {
  //   //               this.findAllAcctProfile("");
  //   //             } else {
  //   //               this.searchProfileByName();
  //   //             }
  //   //             this.acctProfileForm.reset();
  //   //             this.messageService.add({
  //   //               severity: "success",
  //   //               summary: "Successfully",
  //   //               detail: response.message,
  //   //               icon: "far fa-check-circle",
  //   //             });
  //   //           },
  //   //           (error: any) => {
  //   //             this.messageService.add({
  //   //               severity: "error",
  //   //               summary: "Error",
  //   //               detail: error.error.errorMessage,
  //   //               icon: "far fa-times-circle",
  //   //             });
  //   //           }
  //   //         );
  //   //       } else {
  //   //         console.log(this.acctProfileForm.value);

  //   //         this.acctProfileService.addNewAcctProfile(this.acctProfileForm.value).subscribe(
  //   //           (response: any) => {
  //   //             this.submitted = false;
  //   //             this.findAllAcctProfile("");
  //   //             this.acctProfileForm.reset();
  //   //             this.messageService.add({
  //   //               severity: "success",
  //   //               summary: "Successfully",
  //   //               detail: response.message,
  //   //               icon: "far fa-check-circle",
  //   //             });
  //   //           },
  //   //           (error: any) => {
  //   //             this.messageService.add({
  //   //               severity: "error",
  //   //               summary: "Error",
  //   //               detail: error.error.errorMessage,
  //   //               icon: "far fa-times-circle",
  //   //             });
  //   //           }
  //   //         );
  //   //       }
  //   //     }
  //   //     this.showProfile = false;
  //   //   }

  //   deleteConfirm(radiusProfileId, selectedMvnoId, index) {
  //     if (this.validateUserToPerformOperations(selectedMvnoId)) {
  //       this.confirmationService.confirm({
  //         message: "Do you want to delete this Profile?",
  //         header: "Delete Confirmation",
  //         icon: "pi pi-info-circle",
  //         accept: () => {
  //           this.deleteAcctProfileById(radiusProfileId, selectedMvnoId, index);
  //         },
  //         reject: () => {
  //           this.messageService.add({
  //             severity: "info",
  //             summary: "Rejected",
  //             detail: "You have rejected",
  //           });
  //         },
  //       });
  //     }
  //   }

  //   async deleteAcctProfileById(radiusProfileId, selectedMvnoId, index) {
  //     this.acctProfileService.deleteAcctProfileById(radiusProfileId, selectedMvnoId).subscribe(
  //       (response: any) => {
  //         if (this.currentPage != 1 && index == 0 && this.profileData.length == 1) {
  //           this.currentPage = this.currentPage - 1;
  //         }
  //         if (!this.searchkey) {
  //           this.findAllAcctProfile("");
  //         } else {
  //           this.searchProfileByName();
  //         }
  //         this.messageService.add({
  //           severity: "success",
  //           summary: "Successfully",
  //           detail: response.message,
  //           icon: "far fa-check-circle",
  //         });
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error.error.errorMessage,
  //           icon: "far fa-times-circle",
  //         });
  //       }
  //     );
  //   }

  //   async editAcctProfileById(radiusProfileId, index, selectedMvnoId) {
  //     if (this.validateUserToPerformOperations(selectedMvnoId)) {
  //       this.editMode = true;

  //       this.acctProfileService.getProfileById(radiusProfileId).subscribe(
  //         (response: any) => {
  //           console.log(response);
  //           this.editProfileData = response.radiusProfile;
  //           this.getcoaDMProfiles(this.editProfileData.coadm, selectedMvnoId);

  //           let proxyServerName;
  //           let coaDMProfileName;
  //           let mappingMasterName;
  //           if (response.radiusProfile.proxyServer != null) {
  //             proxyServerName = response.radiusProfile.proxyServer.name;
  //           }
  //           if (response.radiusProfile.coaDMProfile != null) {
  //             coaDMProfileName = response.radiusProfile.coaDMProfile.name;
  //           }
  //           if (response.radiusProfile.mappingMaster != null) {
  //             mappingMasterName = response.radiusProfile.mappingMaster.name;
  //           }
  //           this.editProfileId = this.editProfileData.radiusProfileId;
  //           this.onChangeofRequestType(this.editProfileData.requestType);
  //           this.acctProfileForm.patchValue({
  //             name: this.editProfileData.name,
  //             status: this.editProfileData.status,
  //             checkItem: this.editProfileData.checkItem,
  //             accountCdrStatus: this.editProfileData.accountCdrStatus,
  //             sessionStatus: this.editProfileData.sessionStatus,
  //             mappingMaster: mappingMasterName,
  //             priority: this.editProfileData.priority,
  //             requestType: this.editProfileData.requestType,
  //             authAudit: this.editProfileData.authAudit,
  //             proxyServerName: proxyServerName,
  //             authenticationMode: this.editProfileData.authenticationMode,
  //             // coadm: this.editProfileData.coadm,
  //             // coaDMProfile: coaDMProfileName,
  //             mvnoName: this.editProfileData.mvnoId,
  //             autoProvisionMac: this.editProfileData.autoProvisionMac,
  //             deviceDriverName: this.editProfileData.deviceDriverName,
  //           });

  //           this.hideField();
  //         },
  //         error => {
  //           this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: error.error.errorMessage,
  //             icon: "far fa-times-circle",
  //           });
  //         }
  //       );
  //     }
  //   }

  //   async changeStatus(name, status, selectedMvnoId, event) {
  //     event.preventDefault();
  //     this.modalToggle = true;
  //     if (this.validateUserToPerformOperations(selectedMvnoId)) {
  //       if (status == "Active") {
  //         status = "Inactive";
  //       } else {
  //         status = "Active";
  //       }
  //       this.acctProfileService.changeSatus(name, status, selectedMvnoId).subscribe(
  //         (response: any) => {
  //           this.messageService.add({
  //             severity: "success",
  //             summary: "Successfully",
  //             detail: response.message,
  //             icon: "far fa-check-circle",
  //           });
  //           if (!this.searchkey) {
  //             this.findAllAcctProfile("");
  //           } else {
  //             this.searchProfileByName();
  //           }
  //         },
  //         (error: any) => {
  //           this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: error.error.errorMessage,
  //             icon: "far fa-times-circle",
  //           });
  //         }
  //       );
  //     }
  //   }

  //   pageChanged(pageNumber) {
  //     this.currentPage = pageNumber;
  //     if (!this.searchkey) {
  //       this.findAllAcctProfile("");
  //     } else {
  //       this.searchProfileByName();
  //     }
  //   }

  //   radiusProfileDetail: any = [];
  //   proxyServerName: string = "-";
  //   coaDMProfileName: string = "-";
  //   mappingMasterName: string = "-";
  //   checkItem: string = "-";

  //   async getRadiusProfileDetail(radiusProfileId, selectedMvnoId) {
  //     if (this.validateUserToPerformOperations(selectedMvnoId)) {
  //       this.acctProfileService.getProfileById(radiusProfileId).subscribe(
  //         (response: any) => {
  //           this.radiusProfileDetail = response.radiusProfile;
  //           if (this.radiusProfileDetail.proxyServer != null) {
  //             this.proxyServerName = this.radiusProfileDetail.proxyServer.name;
  //           } else {
  //             this.proxyServerName = "-";
  //           }
  //           if (this.radiusProfileDetail.checkItem != null) {
  //             this.checkItem = this.radiusProfileDetail.checkItem;
  //           } else {
  //             this.checkItem = "-";
  //           }
  //           if (this.radiusProfileDetail.coaDMProfile != null) {
  //             this.coaDMProfileName = this.radiusProfileDetail.coaDMProfile.name;
  //           } else {
  //             this.coaDMProfileName = "-";
  //           }
  //           if (this.radiusProfileDetail.mappingMaster != null) {
  //             this.mappingMasterName = this.radiusProfileDetail.mappingMaster.name;
  //           } else {
  //             this.mappingMasterName = "-";
  //           }
  //           if (this.radiusProfileDetail.authenticationMode != null) {
  //             // this.acctProfileForm.patchValue({
  //             //   authenticationMode: this.radiusProfileDetail.authenticationMode,
  //             // });
  //           } else {
  //             this.mappingMasterName = "-";
  //           }
  //         },
  //         error => {
  //           this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: error.error.errorMessage,
  //             icon: "far fa-times-circle",
  //           });
  //         }
  //       );
  //     }
  //   }

  //   hideField() {
  //     if (this.acctProfileForm.value.coadm == "CoA") {
  //       this.showProfile = true;

  //       if (this.loggedInUser == "superadmin") {
  //         this.getcoaDMProfiles("CoA", this.acctProfileForm.controls.mvnoName.value);
  //       } else {
  //         this.getcoaDMProfiles("CoA", this.mvnoId);
  //       }
  //     } else if (this.acctProfileForm.value.coadm == "DM") {
  //       this.showProfile = true;
  //       if (this.loggedInUser == "superadmin") {
  //         this.getcoaDMProfiles("DM", this.acctProfileForm.controls.mvnoName.value);
  //       } else {
  //         this.getcoaDMProfiles("DM", this.mvnoId);
  //       }
  //     } else if (this.acctProfileForm.value.coadm == "None") {
  //       this.showProfile = false;
  //     }

  //     if (this.acctProfileForm.value.coadm == "CoA" || this.acctProfileForm.value.coadm == "DM") {
  //     }
  //   }

  //   validateUserToPerformOperations(selectedMvnoId) {
  //     let loggedInUserMvnoId = localStorage.getItem("mvnoId");
  //     if (this.loggedInUser != "superadmin superadmin" && selectedMvnoId != loggedInUserMvnoId) {
  //       //  this.reset();
  //       this.messageService.add({
  //         severity: "info",
  //         summary: "Rejected",
  //         detail: "You are not authorized to do this operation. Please contact to the administrator",
  //         icon: "far fa-check-circle",
  //       });
  //       //   this.modalToggle = false;
  //       return false;
  //     }
  //     return true;
  //   }

  //   getDetailsByMVNO(mvnoId) {
  //     this.filteredCoADMProfileList = [];
  //     this.filteredProxyServerList = [];
  //     let allMappingList = this.mappingMasterData.mappingList
  //       ? this.mappingMasterData.mappingList
  //       : [];
  //     let allProxyServerList = this.proxyServerData.proxyServerList
  //       ? this.proxyServerData.proxyServerList
  //       : [];
  //     this.showProfile = false;
  //     if (mvnoId == 1) {
  //       this.filteredMappingList = allMappingList;
  //       this.filteredProxyServerList = allProxyServerList.filter(
  //         element => element.status !== "Inactive"
  //       );
  //     } else {
  //       this.filteredMappingList = allMappingList.filter(
  //         element => element.mvnoId == mvnoId || element.mvnoId == 1
  //       );
  //       this.filteredProxyServerList = allProxyServerList.filter(
  //         element =>
  //           (element.mvnoId == mvnoId || element.mvnoId == 1) && element.status !== "Inactive"
  //       );
  //     }
  //   }

  //   //   onChangeofRequestType(requestType) {
  //   //     if (requestType === "Authentication") {
  //   //       this.acctProfileForm.patchValue({
  //   //         accountCdrStatus: [""],
  //   //         sessionStatus: [""],
  //   //         mappingMaster: [""],
  //   //         authAudit: ["", Validators.required],
  //   //         autoProvisionMac: ["Disable", Validators.required],
  //   //       });
  //   //       this.acctProfileForm.controls.accountCdrStatus.disable();
  //   //       this.acctProfileForm.controls.sessionStatus.disable();
  //   //       this.acctProfileForm.controls.mappingMaster.disable();
  //   //       this.acctProfileForm.controls.authAudit.enable();
  //   //       this.acctProfileForm.controls.autoProvisionMac.enable();
  //   //       this.acctProfileForm.controls.autoProvisionMac.setValue("Disable");
  //   //     } else if (requestType === "Accounting") {
  //   //       this.acctProfileForm.patchValue({
  //   //         accountCdrStatus: ["", Validators.required],
  //   //         sessionStatus: ["", Validators.required],
  //   //         mappingMaster: ["", Validators.required],
  //   //         authAudit: [""],
  //   //         autoProvisionMac: [""],
  //   //       });
  //   //       this.acctProfileForm.controls.accountCdrStatus.enable();
  //   //       this.acctProfileForm.controls.sessionStatus.enable();
  //   //       this.acctProfileForm.controls.mappingMaster.enable();
  //   //       this.acctProfileForm.controls.authAudit.disable();
  //   //       this.acctProfileForm.controls.autoProvisionMac.disable();
  //   //     } else {
  //   //       this.acctProfileForm.patchValue({
  //   //         accountCdrStatus: [""],
  //   //         sessionStatus: [""],
  //   //         mappingMaster: [""],
  //   //         authAudit: [""],
  //   //         autoProvisionMac: [""],
  //   //       });
  //   //       this.acctProfileForm.controls.accountCdrStatus.disable();
  //   //       this.acctProfileForm.controls.sessionStatus.disable();
  //   //       this.acctProfileForm.controls.mappingMaster.disable();
  //   //       this.acctProfileForm.controls.authAudit.disable();
  //   //       this.acctProfileForm.controls.autoProvisionMac.disable();
  //   //     }
  //   //   }

  //   getAllDeviceDriverList() {
  //     this.deviceDriverService.findAllDeviceDrivers("", "").subscribe(
  //       (response: any) => {
  //         if (response.deviceList.length > 0) {
  //           //   this.deviceDriverList = response.radiusProfileList;
  //           this.deviceDriverList = response.deviceList.map((data: any) => ({
  //             value: data.name,
  //             label: data.name,
  //           }));
  //         }
  //         var defaultData = {
  //           value: "Adopt BSS",
  //           label: "Adopt BSS",
  //         };
  //         this.deviceDriverList.push(defaultData);
  //       },
  //       error => {
  //         this.totalRecords = 0;
  //         if (error.error.status == 404) {
  //           this.messageService.add({
  //             severity: "info",
  //             summary: "Info",
  //             detail: error.error.errorMessage,
  //             icon: "far fa-times-circle",
  //           });
  //         } else {
  //           this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: error.error.errorMessage,
  //             icon: "far fa-times-circle",
  //           });
  //         }
  //       }
  //     );
  //   }
}
