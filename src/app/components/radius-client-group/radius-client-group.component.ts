import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { element } from "protractor";
import { Observable, Observer } from "rxjs";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { PRE_CUST_CONSTANTS, RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { ClientGroupService } from "src/app/service/client-group.service";
import { CoaService } from "src/app/service/coa.service";
import { DBMappingMasterService } from "src/app/service/db-mapping-master.service";
import { DictionaryService } from "src/app/service/dictionary.service";
import { LoginService } from "src/app/service/login.service";
import { AcctProfileService } from "src/app/service/radius-profile.service";
import { VlanProfileService } from "src/app/service/vlan-profile.service";

@Component({
  selector: "app-radius-client-group",
  templateUrl: "./radius-client-group.component.html",
  styleUrls: ["./radius-client-group.component.css"]
})
export class RadiusClientGroupComponent implements OnInit {
  showList: boolean;
  showCreate: boolean;

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  viewAccess: any;
  createAccess: any;
  editAccess: any;
  deleteAccess: any;
  allPermanentDisconnectProfiles: any[] = [];
  customerAttributes: any[] = [];
  vlanAttributes: any[] = [];
  authenticationProfileDropdownList = [
    { label: "Enable", value: "Enable" },
    { label: "Disable", value: "Disable" }
  ];
  cacheMappingDropdownList = [
    { label: "Enable", value: "Enable" },
    { label: "Disable", value: "Disable" }
  ];
  cacheCriteriaDropdownList = [
    { label: "Equal", value: "equal" },
    { label: "Not Equal", value: "notequal" },
    { label: "Contains", value: "contains" }
  ];
  radiusClientDetail: any;

  dynamicAttributeItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  dynamicAttributetotalRecords: String;
  dynamicAttributeList = 1;

  vlanProfileItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  vlanProfiletotalRecords: String;
  currentPageVlanProfileList = 1;

  authenticateAttrItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  authenticateAttrtotalRecords: String;
  currentPageAuthenticateAttrList: 1;

  authenticateAttrProfileItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  authenticateAttrProfiletotalRecords: String;
  currentPageAuthenticateAttrProfileList: 1;

  coaDmItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  coaDmtotalRecords: String;
  currentPageCoaDmList: 1;

  coaDmProfileItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  coaDmProfiletotalRecords: String;
  currentPageCoaDmProfileList: 1;

  custInActiveProfileItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  inActiveProfileAddtotalRecords: String;
  currentPageInActiveProfileAddList: 1;

  custNewActiveProfileItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  newActiveProfileAddtotalRecords: String;
  currentPageNewActiveProfileAddList: 1;

  suspendedProfileAddItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  suspendedProfiletotalRecords: String;
  currentPageSuspendedProfileList: 1;

  unknownItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  unknowntotalRecords: String;
  currentPageUnknownList: 1;
  permanentDisconnectProfileName: String = "";
  createGroupForm: FormGroup;
  clearCache = "Disable";
  userId: string;
  superAdminId: string;

  constructor(
    private messageService: MessageService,
    private clientGroupService: ClientGroupService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private dictionaryService: DictionaryService,
    private vlanProfileService: VlanProfileService,
    private coaService: CoaService,
    private dbMappingMasterService: DBMappingMasterService,
    private AcctProfileService: AcctProfileService,
    private commonBaseService: AdoptCommonBaseService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_GROUP_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_GROUP_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_GROUP_EDIT);

    // this.findAllClientGroup("");
    this.attribute = this.fb.array([]);
    this.authenticatioProfileAttribute = this.fb.array([]);
    this.cacheMappingProfileAttribute = this.fb.array([]);
    this.coadDmMapping = this.fb.array([]);
    this.coaAttribute = this.fb.array([]);
    this.unknownAttribute = this.fb.array([]);
    this.suspendedAttribute = this.fb.array([]);
    this.inActiveAttribute = this.fb.array([]);
    this.newActiveAttribute = this.fb.array([]);
    this.dynamicAttribute = this.fb.array([]);
    // this.vlanAttribute = this.fb.array([]);
    // this.onAddAttribute();
    // this.onInactiveAddAttribute();
    // this.onUnknownAddAttribute();
    this.createGroupForm = this.fb.group({
      name: ["", Validators.required],
      cgStatus: ["", Validators.required],
      mvnoName: [""],
      coaDMProfile: [""],
      dmprofile: [""],
      clientReplyList: [this.attribute.value],
      inactiveProfileMappings: [this.inActiveAttribute.value],
      newactiveProfileMappings: [this.newActiveAttribute.value],
      unknownProfileMappings: [this.unknownAttribute.value],
      suspendedProfileMappings: [this.suspendedAttribute.value],
      coaDMProfileMappings: [this.coadDmMapping.value],
      dynamicAttributeMappings: [],
      vlanProfileMapping: [],
      validateNasAttribute: [""],
      validateNasAttributeValue: [""],
      validateIpAttribute: [""],
      validateIpAttributeValue: [""],
      enableActiveProfileMapping: [""],
      //   enableNewActiveProfileMapping: [""],
      enableSuspendedProfileMapping: [""],
      enableUnknownProfileMapping: [""],
      permanentDisconnectProfileId: [""],
      startStopAttributeValue: ["Acct-Status-Type"],
      inputPacketAttributeValue: ["Acct-Input-Octets"],
      outputPacketAttributeValue: ["Acct-Output-Octets"],
      packetType: ["Byte"],
      standardAttributeChecked: [""],
      vlanCheckRequired: [""],
      vlanAttribute: [""],
      checkConcurrency: [true],
      logoutOldSessionOnNew: [false],
      triggerCOADMOnMacRemove: [true],
      authenticationProfile: ["Disable"],
      customerMacAttribute: ["Calling-Station-Id", Validators.required],
      //   customerUserNameAttribute: ["User-Name", Validators.required],
      //   usernameIdentityRegex: [""],
      clearCacheMappings: [this.cacheMappingProfileAttribute.value],
      dynamicAcctSessionAttribute: ["Acct-Session-Id"],
      enableNewactiveProfileMapping: [""]
    });
  }

  changeStatusData: any = [];
  groupData: any = [];
  searchGroupByNameForm: FormGroup;
  dynamicAttributesForm: FormGroup;
  vlanProfileForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  // Used and required for pagination
  name: string;
  totalRecords: string;
  totalRecordsA: string;
  currentPage = 1;
  attribute: FormArray;
  authenticatioProfileAttribute: FormArray;
  cacheMappingProfileAttribute: FormArray;
  inActiveAttribute: FormArray;
  newActiveAttribute: FormArray;
  dynamicAttribute: FormArray;
  unknownAttribute: FormArray;
  suspendedAttribute: FormArray;
  coadDmMapping: FormArray;
  vlanAttributeValue: FormArray;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageA = 1;
  itemsPerPageA = RadiusConstants.ITEMS_PER_PAGE;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  editClientGroupId: number;
  editAttributeValues: any;
  editMode = false;
  status = [{ label: "Active" }, { label: "Inactive" }];

  // Client Group datah
  proxyServerData: any = [];
  mappingMasterData: any = [];
  coA = [
    { label: "None" },
    { label: "CoA" },
    { label: "DM" },
    { label: "Both" },
    { label: "SNMP" }
  ];
  failCount: number;
  mvnoData: any;
  loggedInUser: any;
  mvnoId: any;
  modalToggle = true;
  dictionaryAttributeData: any = [];
  vlanColoumnData: any = [];
  accessData: any = JSON.parse(localStorage.getItem("accessData"));

  // Properties of Confirmation Popup
  popoverTitle: string = RadiusConstants.CONFIRM_DIALOG_TITLE;
  popoverMessage: string = RadiusConstants.DELETE_GROUP_CONFIRM_MESSAGE;
  confirmedClicked = false;
  cancelClicked = false;
  closeOnOutsideClick = true;
  selectedGroupId: "";
  groupDataIndex: any;

  showProfile = false;

  filteredMappingList: Array<any> = [];
  filteredCoADMProfileList: Array<any> = [];
  filteredProxyServerList: Array<any> = [];
  filterDMProfileList = [];
  filterCoAProfileList: any = [];

  list: any[] = [
    { label: "TRUE", value: "true" },
    { label: "FALSE", value: "false" }
  ];

  coaAttribute: FormArray;

  packetType = [{ label: "Byte" }, { label: "KB" }, { label: "MB" }, { label: "GB" }];

  ngOnInit(): void {
    this.showList = true;
    this.searchGroupByNameForm = this.fb.group({
      name: [""]
    });
    this.dynamicAttributesForm = this.fb.group({
      customerAttribute: [""],
      radiusAttribute: [""],
      isAbsenceAccepted: [false]
    });
    this.vlanProfileForm = this.fb.group({
      attribute: [""],
      coloumn: [""]
    });
    this.getAllDictionaryAttributes();
    this.getAllVlanColoumns();
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    this.userId = localStorage.getItem("userId");
    this.superAdminId = RadiusConstants.SUPERADMINID;
    this.findAllClientGroup("");
    this.getAlPermanentDisconnectProfiles();
    this.getCustomerAttributes();
  }

  async searchGroupByName() {
    this.searchSubmitted = true;
    if (this.searchGroupByNameForm.value.name == null) {
      this.searchGroupByNameForm.value.name = "";
    }
    if (this.searchGroupByNameForm.valid) {
      if (!this.searchkey || this.searchkey !== this.searchGroupByNameForm.value.name.trim()) {
        this.currentPage = 1;
      }
      if (this.showItemPerPage) {
        this.itemsPerPage = this.showItemPerPage;
      }

      const name = this.searchGroupByNameForm.value.name.trim()
        ? this.searchGroupByNameForm.value.name.trim()
        : "";
      this.searchkey = name;
      this.groupData = [];
      this.clientGroupService
        .findAllClientGroupData(this.currentPage, this.itemsPerPage, name)
        .subscribe(
          (response: any) => {
            this.groupData = response.clientGroupList;
            // this.totalRecords = response.clientGroupList.totalRecords;
          },
          (error: any) => {
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllClientGroup(this.showItemPerPage);
    } else {
      this.searchGroupByName();
    }
  }

  async findAllClientGroup(list) {
    let size;
    this.searchkey = "";
    const page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }

    this.clientGroupService.findAllClientGroupData(page, size, (this.name = "")).subscribe(
      (response: any) => {
        if (response.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.message,
            icon: "far fa-times-circle"
          });
        } else {
          this.groupData = response.clientGroupList;
          // this.totalRecords = response.clientGroupList.totalRecords;
        }
      },
      (error: any) => {
        if (error.error.status == "404") {
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

  async deleteGroupById(groupId, selectedMvnoId, index) {
    this.clientGroupService.deleteClientGroupById(groupId, selectedMvnoId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && index == 0 && this.groupData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.findAllClientGroup("");
        } else {
          this.searchGroupByName();
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

  async addClientGroup() {
    this.submitted = true;

    if (this.createGroupForm.valid && this.attribute.valid && this.coadDmMapping.valid) {
      if (this.authenticatioProfileAttribute.value.length > 0) {
        this.authenticatioProfileAttribute.controls.forEach(control => {
          this.attribute.push(control);
        });
      }
      this.attribute.value.forEach(element => {
        element.clientGroupId = this.selectedGroupId;
      });
      this.coadDmMapping.value.forEach(element => {
        element.clientGroupId = this.selectedGroupId;
      });
      this.unknownAttribute.value.forEach(element => {
        element.clientGroupId = this.selectedGroupId;
      });
      this.suspendedAttribute.value.forEach(element => {
        element.clientGroupId = this.selectedGroupId;
      });
      this.inActiveAttribute.value.forEach(element => {
        element.clientGroupId = this.selectedGroupId;
      });
      this.newActiveAttribute.value.forEach(element => {
        element.clientGroupId = this.selectedGroupId;
      });

      if (this.editMode) {
        this.coA;
        const attributeValue = this.attribute.value;
        this.coaAttribute.value.forEach(element => {
          element.clientGroupId = this.selectedGroupId;
          attributeValue.push(element);
        });

        const updatedGroupData = {
          // clientGroupId: this.editClientGroupId,
          name: this.createGroupForm.value.name,
          cgStatus: this.createGroupForm.value.cgStatus,
          mvnoId: this.createGroupForm.value.mvnoName,
          clientReplyList: attributeValue,
          coadm: this.createGroupForm.value.coadm,
          coaDMProfile: this.createGroupForm.value.coaDMProfile
            ? this.createGroupForm.value.coaDMProfile
            : "",
          dmprofile: this.createGroupForm.value.dmprofile,
          unknownProfileMappings: this.unknownAttribute.value,
          suspendedProfileMappings: this.suspendedAttribute.value,
          inactiveProfileMappings: this.inActiveAttribute.value,
          newactiveProfileMappings: this.newActiveAttribute.value,
          coaDMProfileMappings: this.coadDmMapping.value,
          clearCacheMappings: this.cacheMappingProfileAttribute.value,
          validateNasAttribute: this.createGroupForm.value.validateNasAttribute,
          validateNasAttributeValue: this.createGroupForm.value.validateNasAttributeValue,
          validateIpAttribute: this.createGroupForm.value.validateIpAttribute,
          validateIpAttributeValue: this.createGroupForm.value.validateIpAttributeValue,
          permanentDisconnectProfileId: this.createGroupForm.value.permanentDisconnectProfileId,
          startStopAttributeValue: this.createGroupForm.value.startStopAttributeValue,
          inputPacketAttributeValue: this.createGroupForm.value.inputPacketAttributeValue,
          outputPacketAttributeValue: this.createGroupForm.value.outputPacketAttributeValue,
          packetType: this.createGroupForm.value.packetType,
          dynamicAttributeMappings: this.dynamicAttribute.value,
          vlanProfileMapping: this.vlanAttributeValue.value,
          standardAttributeChecked: this.createGroupForm.value.standardAttributeChecked,
          vlanCheckRequired: this.createGroupForm.value.vlanCheckRequired,
          checkConcurrency: this.createGroupForm.value.checkConcurrency,
          triggerCOADMOnMacRemove: this.createGroupForm.value.triggerCOADMOnMacRemove,
          logoutOldSessionOnNew: this.createGroupForm.value.logoutOldSessionOnNew,
          authenticationProfile: this.createGroupForm.value.authenticationProfile,
          customerMacAttribute: this.createGroupForm.value.customerMacAttribute,
          vlanAttribute: this.createGroupForm.value.vlanAttribute,
          dynamicAcctSessionAttribute: this.createGroupForm.value.dynamicAcctSessionAttribute
          //   customerUserNameAttribute: this.createGroupForm.value.customerUserNameAttribute,
          //   usernameIdentityRegex: this.createGroupForm.value.usernameIdentityRegex,
        };

        this.clientGroupService.updateClientGroup(updatedGroupData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.showCreate = false;
            this.showList = true;
            this.createGroupForm.reset();
            this.attribute = this.fb.array([]);
            this.authenticatioProfileAttribute = this.fb.array([]);
            this.cacheMappingProfileAttribute = this.fb.array([]);
            this.coaAttribute = this.fb.array([]);
            this.inActiveAttribute = this.fb.array([]);
            this.newActiveAttribute = this.fb.array([]);
            this.suspendedAttribute = this.fb.array([]);
            this.unknownAttribute = this.fb.array([]);
            this.coadDmMapping = this.fb.array([]);
            this.dynamicAttribute = this.fb.array([]);
            this.vlanAttributeValue = this.fb.array([]);
            this.showProfile = false;
            // this.onAddAttribute();
            if (!this.searchkey) {
              this.findAllClientGroup("");
            } else {
              this.searchGroupByName();
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
        const attributeValue = this.attribute.value;
        this.coaAttribute.value.forEach(element => {
          element.clientGroupId = this.selectedGroupId;
          attributeValue.push(element);
        });
        this.createGroupForm.patchValue({
          clientReplyList: attributeValue,
          unknownProfileMappings: this.unknownAttribute.value,
          suspendedProfileMappings: this.suspendedAttribute.value,
          inactiveProfileMappings: this.inActiveAttribute.value,
          newactiveProfileMappings: this.newActiveAttribute.value,
          coaDMProfileMappings: this.coadDmMapping.value,
          dynamicAttributeMappings: this.dynamicAttribute.value,
          vlanProfileMapping: this.vlanAttributeValue.value,
          clearCacheMappings: this.cacheMappingProfileAttribute.value
        });
        if (this.createGroupForm.value.mvnoName == "") {
          this.createGroupForm.value.mvnoName = null;
        }
        if (this.createGroupForm.value.standardAttributeChecked == null) {
          this.createGroupForm.patchValue({
            standardAttributeChecked: false
          });
        }
        if (this.createGroupForm.value.vlanCheckRequired == null) {
          this.createGroupForm.patchValue({
            vlanCheckRequired: false
          });
        }
        if (this.createGroupForm.value.checkConcurrency == null) {
          this.createGroupForm.patchValue({
            checkConcurrency: true
          });
        }
        if (this.createGroupForm.value.triggerCOADMOnMacRemove == null) {
          this.createGroupForm.patchValue({
            triggerCOADMOnMacRemove: true
          });
        }
        if (this.createGroupForm.value.logoutOldSessionOnNew == null) {
          this.createGroupForm.patchValue({
            logoutOldSessionOnNew: false
          });
        }

        this.clientGroupService
          .addNewClientGroup(this.createGroupForm.value, this.createGroupForm.value.mvnoName)
          .subscribe(
            (response: any) => {
              this.submitted = false;
              this.showCreate = false;
              this.showList = true;
              this.createGroupForm.reset();
              this.attribute = this.fb.array([]);
              this.authenticatioProfileAttribute = this.fb.array([]);
              this.cacheMappingProfileAttribute = this.fb.array([]);
              this.coaAttribute = this.fb.array([]);
              this.inActiveAttribute = this.fb.array([]);
              this.newActiveAttribute = this.fb.array([]);
              this.suspendedAttribute = this.fb.array([]);
              this.unknownAttribute = this.fb.array([]);
              this.coadDmMapping = this.fb.array([]);
              this.dynamicAttribute = this.fb.array([]);
              this.vlanAttributeValue = this.fb.array([]);
              this.showProfile = false;
              //   this.onAddAttribute();
              this.onAddCoaDmProfile();
              this.findAllClientGroup("");
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

  async editGroupById(groupId, index, selectedMvnoId) {
    let CoaDMData: any = [];
    let radiusClient: any = [];
    let comdomId1 = "";
    let CAOID1 = "";
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.editMode = true;

      this.selectedGroupId = groupId;
      this.editClientGroupId = groupId;

      let comDm = "";
      let comdmprofile = "";

      this.clientGroupService.getClientGroupDataById(groupId).subscribe(
        (response: any) => {
          this.showCreate = true;
          this.showList = false;
          this.editClientGroupId = response.clientGroup.clientGroupId;
          radiusClient = response.clientGroup;
          if (response.clientGroup.coaDMProfile == null && response.clientGroup.dmprofile == null) {
            comDm = "None";
            comdmprofile = "";
            this.showProfile = false;

            this.createGroupForm.patchValue({
              name: radiusClient.name,
              cgStatus: radiusClient.cgStatus,
              mvnoName: radiusClient.mvnoId,
              coadm: comDm,
              coaDMProfile: comdmprofile,
              dmprofile: "",
              validateNasAttribute: radiusClient.validateNasAttribute,
              validateNasAttributeValue: radiusClient.validateNasAttributeValue,
              validateIpAttribute: radiusClient.validateIpAttribute,
              validateIpAttributeValue: radiusClient.validateIpAttributeValue,
              permanentDisconnectProfileId: radiusClient.permanentDisconnectProfileId,
              startStopAttributeValue: radiusClient.startStopAttributeValue,
              inputPacketAttributeValue: radiusClient.inputPacketAttributeValue,
              outputPacketAttributeValue: radiusClient.outputPacketAttributeValue,
              packetType: radiusClient.packetType,
              standardAttributeChecked: radiusClient.standardAttributeChecked,
              authenticationProfile: radiusClient.authenticationProfile,
              customerMacAttribute: radiusClient.customerMacAttribute,
              vlanAttribute: radiusClient.vlanAttribute,
              vlanCheckRequired: radiusClient.vlanCheckRequired,
              checkConcurrency: radiusClient.checkConcurrency,
              triggerCOADMOnMacRemove: radiusClient.triggerCOADMOnMacRemove,
              logoutOldSessionOnNew: radiusClient.logoutOldSessionOnNew,
              //   customerUserNameAttribute: radiusClient.customerUserNameAttribute,
              usernameIdentityRegex: radiusClient.usernameIdentityRegex,
              dynamicAcctSessionAttribute: radiusClient.dynamicAcctSessionAttribute
            });
            this.createGroupForm.controls.dmprofile.disable();
            this.createGroupForm.controls.coaDMProfile.disable();
          } else {
            if (response.clientGroup.dmprofile && !response.clientGroup.coaDMProfile) {
              comdomId1 = radiusClient.dmprofile;
              this.createGroupForm.controls.dmprofile.enable();
              this.createGroupForm.controls.coaDMProfile.disable();
            } else if (
              response.clientGroup.dmprofile !== null &&
              response.clientGroup.coaDMProfile !== null
            ) {
              comDm = "Both";
              comdomId1 = radiusClient.dmprofile;
              CAOID1 = radiusClient.coaDMProfile;
              this.createGroupForm.controls.dmprofile.enable();
              this.createGroupForm.controls.coaDMProfile.enable();
            } else {
              comdomId1 = radiusClient.coaDMProfile;
              this.createGroupForm.controls.dmprofile.disable();
              this.createGroupForm.controls.coaDMProfile.enable();
            }
            this.coaService.getCoAById(comdomId1).subscribe(async (response: any) => {
              CoaDMData = response.coaDMProfile;

              comdmprofile = CoaDMData.name;
              if (comDm === "Both") {
                this.coaService.getCoAById(CAOID1).subscribe((response: any) => {
                  const dmprofileName = response.coaDMProfile.name;
                  this.getcoaDMProfiles("CoA", this.mvnoId);
                  this.getcoaDMProfiles("DM", this.mvnoId);

                  this.createGroupForm.patchValue({
                    coaDMProfile: dmprofileName
                  });
                });
                setTimeout(() => {
                  this.createGroupForm.patchValue({
                    name: radiusClient.name,
                    cgStatus: radiusClient.cgStatus,
                    mvnoName: radiusClient.mvnoId,
                    coadm: comDm,
                    dmprofile: comdmprofile,
                    validateNasAttribute: radiusClient.validateNasAttribute,
                    validateNasAttributeValue: radiusClient.validateNasAttributeValue,
                    validateIpAttribute: radiusClient.validateIpAttribute,
                    validateIpAttributeValue: radiusClient.validateIpAttributeValue,
                    permanentDisconnectProfileId: radiusClient.permanentDisconnectProfileId,
                    startStopAttributeValue: radiusClient.startStopAttributeValue,
                    inputPacketAttributeValue: radiusClient.inputPacketAttributeValue,
                    outputPacketAttributeValue: radiusClient.outputPacketAttributeValue,
                    packetType: radiusClient.packetType,
                    dynamicAcctSessionAttribute: radiusClient.dynamicAcctSessionAttribute
                  });
                }, 1000);
              } else {
                comDm = radiusClient.dmprofile != null ? "DM" : CoaDMData.type;
                await this.getcoaDMProfiles(comDm, this.mvnoId);
                setTimeout(() => {
                  this.createGroupForm.patchValue({
                    name: radiusClient.name,
                    cgStatus: radiusClient.cgStatus,
                    mvnoName: radiusClient.mvnoId,
                    coadm: comDm,
                    coaDMProfile: radiusClient.dmprofile != null ? "" : comdmprofile,
                    dmprofile: radiusClient.dmprofile != null ? comdmprofile : "",
                    validateNasAttribute: radiusClient.validateNasAttribute,
                    validateNasAttributeValue: radiusClient.validateNasAttributeValue,
                    validateIpAttribute: radiusClient.validateIpAttribute,
                    validateIpAttributeValue: radiusClient.validateIpAttributeValue,
                    permanentDisconnectProfileId:
                      this.createGroupForm.value.permanentDisconnectProfileId,
                    startStopAttributeValue: this.createGroupForm.value.startStopAttributeValue,
                    inputPacketAttributeValue: this.createGroupForm.value.inputPacketAttributeValue,
                    outputPacketAttributeValue:
                      this.createGroupForm.value.outputPacketAttributeValue,
                    packetType: this.createGroupForm.value.packetType
                  });
                }, 1000);
              }
            });
            this.showProfile = true;
          }
          this.getcoaDMProfiles("CoA", this.mvnoId);
          this.getcoaDMProfiles("DM", this.mvnoId);
          this.attribute = this.fb.array([]);
          this.authenticatioProfileAttribute = this.fb.array([]);
          this.cacheMappingProfileAttribute = this.fb.array([]);
          this.coaAttribute = this.fb.array([]);
          this.inActiveAttribute = this.fb.array([]);
          this.newActiveAttribute = this.fb.array([]);
          this.unknownAttribute = this.fb.array([]);
          this.suspendedAttribute = this.fb.array([]);
          this.coadDmMapping = this.fb.array([]);
          this.dynamicAttribute = this.fb.array([]);
          this.vlanAttributeValue = this.fb.array([]);
          if (radiusClient.clientReplyList.length > 0) {
            const clientReplyList = radiusClient.clientReplyList;
            clientReplyList.forEach(element => {
              if (element.type == "AUTH") {
                if (element.rejectAttribute) {
                  this.authenticatioProfileAttribute.push(this.fb.group(element));
                } else {
                  this.attribute.push(this.fb.group(element));
                }
              } else if ((element.type = "COA")) {
                this.coaAttribute.push(this.fb.group(element));
              }
            });
            this.editAttributeValues = radiusClient.clientReplyList;
          }
          if (radiusClient.inactiveProfileMappings.length > 0) {
            this.createGroupForm.controls.enableActiveProfileMapping.setValue("true");
            const clientReplyList = radiusClient.inactiveProfileMappings;
            clientReplyList.forEach(element => {
              this.inActiveAttribute.push(this.fb.group(element));
            });
          } else {
            this.createGroupForm.controls.enableActiveProfileMapping.setValue("false");
          }

          if (radiusClient.newactiveProfileMappings.length > 0) {
            // this.createGroupForm.controls.enableNewActiveProfileMapping.setValue("true");
            this.createGroupForm.controls.enableNewactiveProfileMapping.setValue("true");
            const clientReplyList = radiusClient.newactiveProfileMappings;
            clientReplyList.forEach(element => {
              this.newActiveAttribute.push(this.fb.group(element));
            });
          } else {
            // this.createGroupForm.controls.enableNewActiveProfileMapping.setValue("false");
            this.createGroupForm.controls.enableNewactiveProfileMapping.setValue("false");
          }

          if (radiusClient.clearCacheMappings.length > 0) {
            this.clearCache = "Enable";
            const cacheMappingListList = radiusClient.clearCacheMappings;
            cacheMappingListList.forEach(element => {
              this.cacheMappingProfileAttribute.push(this.fb.group(element));
            });
          } else {
            this.clearCache = "Disable";
          }

          if (radiusClient.suspendedProfileMappings.length > 0) {
            this.createGroupForm.controls.enableSuspendedProfileMapping.setValue("true");
            const clientReplyList = radiusClient.suspendedProfileMappings;
            clientReplyList.forEach(element => {
              this.suspendedAttribute.push(this.fb.group(element));
            });
          } else {
            this.createGroupForm.controls.enableSuspendedProfileMapping.setValue("false");
          }

          if (radiusClient.dynamicAttributeMappings.length > 0) {
            const dynamicAttributeMappings = radiusClient.dynamicAttributeMappings;
            dynamicAttributeMappings.forEach(element => {
              this.dynamicAttribute.push(this.fb.group(element));
            });
          }
          if (radiusClient.vlanProfileMapping.length > 0) {
            const vlanProfileMapping = radiusClient.vlanProfileMapping;
            vlanProfileMapping.forEach(element => {
              this.vlanAttributeValue.push(this.fb.group(element));
            });
          }
          if (radiusClient.coaDmProfileMappings.length > 0) {
            const oldcoaDMProfileMappings = radiusClient.coaDmProfileMappings;
            oldcoaDMProfileMappings.forEach(element => {
              this.coadDmMapping.push(this.fb.group(element));
            });
            const formArray: FormArray = this.coadDmMapping as FormArray;
            for (let i = 0; i < formArray.length; i++) {
              const control = formArray.at(i);
              if (control instanceof FormGroup) {
                if (control.controls.coaDmSelection.value === "CoA") {
                  control.controls.dmProfileId.disable();
                }
                if (control.controls.coaDmSelection.value === "DM") {
                  control.controls.coaProfileId.disable();
                }
                if (control.controls.coaDmSelection.value === "None") {
                  control.controls.dmProfileId.disable();
                  control.controls.coaProfileId.disable();
                }
              }
            }
          }
          if (radiusClient.unknownProfileMappings.length > 0) {
            this.createGroupForm.controls.enableUnknownProfileMapping.setValue("true");
            const clientReplyList = radiusClient.unknownProfileMappings;
            clientReplyList.forEach(element => {
              this.unknownAttribute.push(this.fb.group(element));
            });
          } else {
            this.createGroupForm.controls.enableUnknownProfileMapping.setValue("false");
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

  radiusClientDetailModal: boolean = false;
  async showRadiusClientGroupDetail(groupId, selectedMvnoId) {
    let CoaDMData: any = [];
    let radiusClient: any = {};
    let comdomId1 = "";
    let CAOID1 = "";
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      let comDm = "";
      let comdmprofile = "";
      this.clientGroupService.getClientGroupDataById(groupId).subscribe(
        (response: any) => {
          this.radiusClientDetail = response.clientGroup;
          this.radiusClientDetailModal = true;
          radiusClient = response.clientGroup;
          if (response.clientGroup.coaDMProfile == null && response.clientGroup.dmprofile == null) {
            comDm = "None";
            comdmprofile = "";
            this.radiusClientDetail["coadm"] = comDm;
            this.radiusClientDetail["coaDMProfile"] = comdmprofile;
            this.radiusClientDetail["dmprofile"] = "";
          } else {
            if (response.clientGroup.dmprofile && !response.clientGroup.coaDMProfile) {
              comdomId1 = radiusClient.dmprofile;
            } else if (
              response.clientGroup.dmprofile !== null &&
              response.clientGroup.coaDMProfile !== null
            ) {
              comDm = "Both";
              comdomId1 = radiusClient.dmprofile;
              CAOID1 = radiusClient.coaDMProfile;
            } else {
              comdomId1 = radiusClient.coaDMProfile;
            }
            this.coaService.getCoAById(comdomId1).subscribe(async (response: any) => {
              CoaDMData = response.coaDMProfile;
              comdmprofile = CoaDMData.name;
              if (comDm === "Both") {
                this.coaService.getCoAById(CAOID1).subscribe((response: any) => {
                  const dmprofileName = response.coaDMProfile.name;
                  this.getcoaDMProfiles("CoA", this.mvnoId);
                  this.getcoaDMProfiles("DM", this.mvnoId);

                  this.radiusClientDetail["coaDMProfile"] = dmprofileName;
                });
                setTimeout(() => {
                  this.radiusClientDetail["coadm"] = comDm;
                  this.radiusClientDetail["dmprofile"] = comdmprofile;
                }, 1000);
              } else {
                comDm = radiusClient.dmprofile != null ? "DM" : CoaDMData.type;
                await this.getcoaDMProfiles(comDm, this.mvnoId);
                setTimeout(() => {
                  this.radiusClientDetail["coadm"] = comDm;
                  this.radiusClientDetail["coaDMProfile"] =
                    radiusClient.dmprofile != null ? "" : comdmprofile;
                  this.radiusClientDetail["dmprofile"] =
                    radiusClient.dmprofile != null ? comdmprofile : "";
                }, 1000);
              }
            });
          }
          this.getcoaDMProfiles("CoA", this.mvnoId);
          this.getcoaDMProfiles("DM", this.mvnoId);
          this.radiusClientDetail["authenticatioProfileAttribute"] = [];
          this.radiusClientDetail["attribute"] = [];
          this.radiusClientDetail["coaAttribute"] = [];
          this.permanentDisconnectProfileName = this.allPermanentDisconnectProfiles.find(
            profile =>
              profile.coaDMProfileId == this.radiusClientDetail.permanentDisconnectProfileId
          )?.name;

          if (radiusClient.clientReplyList.length > 0) {
            const clientReplyList = radiusClient.clientReplyList;
            clientReplyList.forEach(element => {
              if (element.type == "AUTH") {
                if (element.rejectAttribute) {
                  this.radiusClientDetail["authenticatioProfileAttribute"].push(element);
                } else {
                  this.radiusClientDetail["attribute"].push(element);
                }
              } else if ((element.type = "COA")) {
                this.radiusClientDetail["coaAttribute"].push(element);
              }
            });
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

  clearSearchForm() {
    this.clearFormData();
    this.searchSubmitted = false;
    this.currentPage = 1;
    this.searchGroupByNameForm.reset();
    this.findAllClientGroup("");
    this.showProfile = false;
    this.showList = true;
    this.showCreate = false;
  }

  reloadConfirm() {
    this.confirmationService.confirm({
      message: "All AAA Cache will be Reload, Do you want to process ?",
      header: "Reload Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.reloadAllRadiusCache();
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

  reloadAllRadiusCache() {
    this.clientGroupService.reloadCache().subscribe(
      (response: any) => {
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

  showCreateForm() {
    this.clearFormData();
    this.searchSubmitted = false;
    this.showProfile = false;
    this.showList = false;
    this.showCreate = true;
    this.createGroupForm.get("checkConcurrency").setValue(true);
    this.createGroupForm.get("triggerCOADMOnMacRemove").setValue(true);
    this.createGroupForm.get("logoutOldSessionOnNew").setValue(false);
    // this.onUnknownAddAttribute();
    // this.onInactiveAddAttribute();
    this.radiusClientDetail = {};
    this.onAddAttribute();
  }

  clearFormData() {
    this.editMode = false;
    this.createGroupForm.reset();
    this.createGroupForm.patchValue({
      startStopAttributeValue: "Acct-Status-Type",
      inputPacketAttributeValue: "Acct-Input-Octets",
      outputPacketAttributeValue: "Acct-Output-Octets",
      packetType: "Byte",
      authenticationProfile: "Disable",
      customerMacAttribute: "Calling-Station-Id",
      //   customerUserNameAttribute: "User-Name",
      usernameIdentityRegex: "",
      dynamicAcctSessionAttribute: "Acct-Session-Id"
    });

    this.attribute = this.fb.array([]);
    this.attribute.reset();
    this.authenticatioProfileAttribute = this.fb.array([]);
    this.coadDmMapping = this.fb.array([]);
    this.inActiveAttribute = this.fb.array([]);
    this.newActiveAttribute = this.fb.array([]);
    this.suspendedAttribute = this.fb.array([]);
    this.unknownAttribute = this.fb.array([]);
    this.authenticatioProfileAttribute.reset();
    this.cacheMappingProfileAttribute = this.fb.array([]);
    this.cacheMappingProfileAttribute.reset();
    this.dynamicAttribute = this.fb.array([]);
    this.dynamicAttribute.reset();
    this.vlanAttributeValue = this.fb.array([]);
    this.vlanAttributeValue.reset();
    this.showProfile = false;
  }

  async changeStatusToInActive(data, selectedMvnoId, event) {
    event.preventDefault();
    this.modalToggle = true;
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.clientGroupService
        .changeClientGroupSatus(data, RadiusConstants.IN_ACTIVE, selectedMvnoId)
        .subscribe(
          (response: any) => {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            if (!this.searchkey) {
              this.findAllClientGroup("");
            } else {
              this.searchGroupByName();
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

  async changeStatusToActive(data, selectedMvnoId, event) {
    event.preventDefault();
    this.modalToggle = true;
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.clientGroupService
        .changeClientGroupSatus(data, RadiusConstants.ACTIVE, selectedMvnoId)
        .subscribe(
          (response: any) => {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            if (!this.searchkey) {
              this.findAllClientGroup("");
            } else {
              this.searchGroupByName();
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

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.findAllClientGroup("");
    } else {
      this.searchGroupByName();
    }
  }

  deleteConfirm(clientGroupId, selectedMvnoId, index) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.confirmationService.confirm({
        message: "Do you want to delete this record?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteGroupById(clientGroupId, selectedMvnoId, index);
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

  validateUserToPerformOperations(selectedMvnoId) {
    let loggedInUserMvnoId = localStorage.getItem("mvnoId");
    this.userId = localStorage.getItem("userId");
    if (this.userId != RadiusConstants.SUPERADMINID && selectedMvnoId != loggedInUserMvnoId) {
      //  this.reset();
      this.messageService.add({
        severity: "info",
        summary: "Rejected",
        detail: "You are not authorized to do this operation. Please contact to the administrator",
        icon: "far fa-check-circle"
      });
      //   this.modalToggle = false;
      return false;
    }
    return true;
  }

  createAttributeFormGroup(): FormGroup {
    return this.fb.group({
      checkitem: [""],
      attributeValue: ["", Validators.required],
      attribute: ["", Validators.required],
      clientGroupId: [""],
      attributeId: [""],
      type: ["AUTH"],
      rejectAttribute: [false]
    });
  }

  createAuthenticationProfileAttributeFormGroup(): FormGroup {
    return this.fb.group({
      checkitem: [""],
      attributeValue: ["", Validators.required],
      attribute: ["", Validators.required],
      clientGroupId: [""],
      attributeId: [""],
      type: ["AUTH"],
      rejectAttribute: [true]
    });
  }

  cacheMappingProfileAttributeFormGroup(): FormGroup {
    return this.fb.group({
      attributeValue: ["", Validators.required],
      attribute: ["", Validators.required],
      criteria: ["", Validators.required]
    });
  }

  createInactiveAttributeFormGroup(): FormGroup {
    return this.fb.group({
      checkitem: [""],
      attributeValue: ["", Validators.required],
      attribute: ["", Validators.required],
      clientGroupId: [""],
      attributeId: [""]
    });
  }
  createNewactiveAttributeFormGroup(): FormGroup {
    return this.fb.group({
      checkitem: [""],
      attributeValue: ["", Validators.required],
      attribute: ["", Validators.required],
      clientGroupId: [""],
      attributeId: [""]
    });
  }

  createUnknownAttributeFormGroup(): FormGroup {
    return this.fb.group({
      checkitem: [""],
      attributeValue: ["", Validators.required],
      attribute: ["", Validators.required],
      clientGroupId: [""],
      attributeId: [""]
    });
  }

  createSuspendedAttributeFormGroup(): FormGroup {
    return this.fb.group({
      checkitem: [""],
      attributeValue: ["", Validators.required],
      attribute: ["", Validators.required],
      clientGroupId: [""],
      attributeId: [""]
    });
  }

  createCoaDMFormGroup(): FormGroup {
    return this.fb.group({
      checkItem: [""],
      clientGroupId: [null],
      coaDmSelection: [""],
      coaProfileId: ["", Validators.required],
      dmProfileId: ["", Validators.required],
      coadmClienGroupMappingId: [null],
      priority: [""]
    });
  }

  onAddAttribute() {
    this.submitted = false;
    this.attribute.push(this.createAttributeFormGroup());
  }

  onAddAuthenticationProfileAttribute() {
    this.submitted = false;
    this.authenticatioProfileAttribute.push(this.createAuthenticationProfileAttributeFormGroup());
  }

  onAddCacheMappingAttribute() {
    this.submitted = false;
    this.cacheMappingProfileAttribute.push(this.cacheMappingProfileAttributeFormGroup());
  }

  onAddCoaDmProfile() {
    this.submitted = false;
    this.coadDmMapping.push(this.createCoaDMFormGroup());
  }

  onInactiveAddAttribute() {
    this.submitted = false;
    this.inActiveAttribute.push(this.createInactiveAttributeFormGroup());
  }

  onNewactiveAddAttribute() {
    this.submitted = false;
    this.newActiveAttribute.push(this.createNewactiveAttributeFormGroup());
  }
  onUnknownAddAttribute() {
    this.submitted = false;
    this.unknownAttribute.push(this.createUnknownAttributeFormGroup());
  }

  onSuspendedAddAttribute() {
    this.submitted = false;
    this.suspendedAttribute.push(this.createSuspendedAttributeFormGroup());
  }

  deleteConfirmAttribute(attributeIndex: number, attributeId: number, selectedMvnoId) {
    this.attribute.removeAt(attributeIndex);
  }

  deleteAuthenticationProfileAttribute(
    attributeIndex: number,
    attributeId: number,
    selectedMvnoId
  ) {
    this.authenticatioProfileAttribute.removeAt(attributeIndex);
  }

  deleteCacheProfileAttribute(attributeIndex: number) {
    this.cacheMappingProfileAttribute.removeAt(attributeIndex);
  }

  deleteConfirmAuthenticationProfileAttribute(
    attributeIndex: number,
    attributeId: number,
    selectedMvnoId
  ) {
    this.authenticatioProfileAttribute.removeAt(attributeIndex);
  }

  deleteConfirmCoaDmProfile(profileIndex: number) {
    this.coadDmMapping.removeAt(profileIndex);
  }

  deleteConfirmInActiveAttribute(attributeIndex: number, attributeId: number, selectedMvnoId) {
    this.inActiveAttribute.removeAt(attributeIndex);
  }
  deleteConfirmNewActiveAttribute(attributeIndex: number, attributeId: number, selectedMvnoId) {
    this.newActiveAttribute.removeAt(attributeIndex);
  }

  deleteConfirmUnknownAttribute(attributeIndex: number, attributeId: number, selectedMvnoId) {
    this.unknownAttribute.removeAt(attributeIndex);
  }

  deleteConfirmSuspendedAttribute(attributeIndex: number, attributeId: number, selectedMvnoId) {
    this.suspendedAttribute.removeAt(attributeIndex);
  }

  async onRemoveAttribute(attributeIndex: number, attributeId: number, selectedMvnoId) {
    this.clientGroupService.deleteClientReplyById(attributeId, selectedMvnoId).subscribe(
      (response: any) => {
        this.editGroupById(this.editClientGroupId, this.groupDataIndex, selectedMvnoId);
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

  async getAllDictionaryAttributes() {
    this.dictionaryService.findAllAttributes().subscribe(
      (response: any) => {
        this.dictionaryAttributeData = response;
      },
      (error: any) => {
        if (error.error.status == "404") {
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

  async getAllVlanColoumns() {
    this.vlanProfileService.getVlanColoumns().subscribe(
      (response: any) => {
        this.vlanColoumnData = response.map(ele => ({
          name: ele
        }));
        this.vlanColoumnData.forEach(data => {});
      },
      (error: any) => {
        if (error.error.status == "404") {
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

  hideField() {
    if (this.createGroupForm.value.coadm === "CoA") {
      this.showProfile = true;
      this.userId = localStorage.getItem("userId");
      if (this.userId == RadiusConstants.SUPERADMINID) {
        this.getcoaDMProfiles("CoA", this.createGroupForm.controls.mvnoName.value);
      } else {
        this.getcoaDMProfiles("CoA", this.mvnoId);
      }
      this.createGroupForm.get("coaDMProfile").setValidators([Validators.required]);
      this.createGroupForm.get("coaDMProfile").updateValueAndValidity();
      this.createGroupForm.get("coaDMProfile").setValue("");
      this.createGroupForm.controls.coaDMProfile.enable();
      this.createGroupForm.controls.coaDMProfile.setValue("");
      this.createGroupForm.controls.dmprofile.setValue("");
      this.createGroupForm.controls.dmprofile.disable();
      this.createGroupForm.controls.dmprofile.updateValueAndValidity();
    } else if (this.createGroupForm.value.coadm === "DM") {
      this.showProfile = true;
      this.userId = localStorage.getItem("userId");
      if (this.userId == RadiusConstants.SUPERADMINID) {
        this.getcoaDMProfiles("DM", this.createGroupForm.controls.mvnoName.value);
      } else {
        this.getcoaDMProfiles("DM", this.mvnoId);
      }
      this.createGroupForm.get("dmprofile").setValidators([Validators.required]);
      this.createGroupForm.get("dmprofile").updateValueAndValidity();
      this.createGroupForm.controls.coaDMProfile.setValue("");
      this.createGroupForm.controls.coaDMProfile.disable();
      this.createGroupForm.controls.dmprofile.enable();
      this.createGroupForm.controls.dmprofile.setValue("");
      this.createGroupForm.controls.coaDMProfile.updateValueAndValidity();
    } else if (this.createGroupForm.value.coadm === "None") {
      this.showProfile = false;
      this.createGroupForm.patchValue({
        coaDMProfile: "",
        dmprofile: ""
      });

      this.createGroupForm.controls.coaDMProfile.disable();
      this.createGroupForm.controls.dmprofile.disable();
    } else if (this.createGroupForm.value.coadm === "Both") {
      this.getcoaDMProfiles("DM", this.mvnoId);
      this.getcoaDMProfiles("CoA", this.mvnoId);
      this.showProfile = true;
      this.createGroupForm.get("coaDMProfile").setValidators([Validators.required]);
      this.createGroupForm.controls.coaDMProfile.enable();
      this.createGroupForm.controls.coaDMProfile.setValue("");
      this.createGroupForm.controls.dmprofile.setValue("");
      this.createGroupForm.controls.dmprofile.enable();
      this.createGroupForm.get("dmprofile").setValidators([Validators.required]);
    }
  }

  hideFieldwithrow(row: any) {
    if (row.controls.coaDmSelection.value === "CoA") {
      this.showProfile = true;
      this.userId = localStorage.getItem("userId");
      if (this.userId == RadiusConstants.SUPERADMINID) {
        this.getcoaDMProfiles("CoA", this.createGroupForm.controls.mvnoName.value);
      } else {
        this.getcoaDMProfiles("CoA", this.mvnoId);
      }
      row.get("coaProfileId").setValidators([Validators.required]);
      row.get("coaProfileId").updateValueAndValidity();
      row.get("coaProfileId").setValue("");
      row.get("coaProfileId").enable();
      row.get("coaProfileId").setValue("");
      row.get("dmProfileId").setValue("");
      row.get("dmProfileId").disable();
      row.get("dmProfileId").updateValueAndValidity();
    } else if (row.controls.coaDmSelection.value === "DM") {
      this.showProfile = true;
      this.userId = localStorage.getItem("userId");
      if (this.userId == RadiusConstants.SUPERADMINID) {
        this.getcoaDMProfiles("DM", this.createGroupForm.controls.mvnoName.value);
      } else {
        this.getcoaDMProfiles("DM", this.mvnoId);
      }
      row.get("dmProfileId").setValidators([Validators.required]);
      row.get("dmProfileId").updateValueAndValidity();
      row.get("coaProfileId").setValue("");
      row.get("coaProfileId").disable();
      row.get("dmProfileId").enable();
      row.get("dmProfileId").setValue("");
      row.get("coaProfileId").updateValueAndValidity();
    } else if (row.controls.coaDmSelection.value === "None") {
      this.showProfile = false;
      this.createGroupForm.patchValue({
        coaDMProfile: "",
        dmprofile: ""
      });

      row.get("coaProfileId").disable();
      row.get("dmProfileId").disable();
    } else if (row.controls.coaDmSelection.value === "Both") {
      this.getcoaDMProfiles("DM", this.mvnoId);
      this.getcoaDMProfiles("CoA", this.mvnoId);
      this.showProfile = true;
      row.get("coaProfileId").setValidators([Validators.required]);
      row.get("coaProfileId").enable();
      row.get("coaProfileId").setValue("");
      row.get("dmProfileId").setValue("");
      row.get("dmProfileId").enable();
      row.get("dmProfileId").setValidators([Validators.required]);
    } else if (row.controls.coaDmSelection.value === "SNMP") {
      this.showProfile = true;
      this.createGroupForm.patchValue({
        coaDMProfile: "",
        dmprofile: ""
      });

      row.get("coaProfileId").disable();
      row.get("dmProfileId").disable();
    }
  }

  async getcoaDMProfiles(type, mvno) {
    if (type == "CoA") {
      this.coaService.getCoAByType(type).subscribe((response: any) => {
        if (mvno == RadiusConstants.SUPER_ADMIN_MVNO) {
          this.filterCoAProfileList = response.coaDMProfileList;
        } else {
          this.filterCoAProfileList = response.coaDMProfileList.filter(
            element => element.mvnoId == mvno || element.mvnoId == 1
          );
        }
      });
    } else if (type == "DM") {
      this.coaService.getCoAByType("Both").subscribe((response: any) => {
        if (mvno == RadiusConstants.SUPER_ADMIN_MVNO) {
          this.filterDMProfileList = response.coaDMProfileList;
        } else {
          this.filterDMProfileList = response.coaDMProfileList.filter(
            element => element.mvnoId == mvno || element.mvnoId == 1
          );
        }
      });
    }
  }

  async getAllProxyServer() {
    this.AcctProfileService.getAllProxyServer().subscribe(
      (response: any) => {
        this.proxyServerData = response;
        this.getDetailsByMVNO(localStorage.getItem("mvnoId"));
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

  async getAllMappingMasters() {
    this.dbMappingMasterService.findAllActiveDBMappingMasters().subscribe(
      (response: any) => {
        this.mappingMasterData = response;
        this.getDetailsByMVNO(JSON.parse(localStorage.getItem("mvnoId")));
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

  getDetailsByMVNO(mvnoId) {
    this.filteredCoADMProfileList = [];
    this.filteredProxyServerList = [];
    const allMappingList = this.mappingMasterData.mappingList
      ? this.mappingMasterData.mappingList
      : [];
    const allProxyServerList = this.proxyServerData.proxyServerList
      ? this.proxyServerData.proxyServerList
      : [];
    this.showProfile = false;
    if (mvnoId == 1) {
      this.filteredMappingList = allMappingList;
      this.filteredProxyServerList = allProxyServerList;
    } else {
      this.filteredMappingList = allMappingList.filter(
        element => element.mvnoId == mvnoId || element.mvnoId == 1
      );
      this.filteredProxyServerList = allProxyServerList.filter(
        element => element.mvnoId == mvnoId || element.mvnoId == 1
      );
    }
  }

  enableInactiveProfileMapping(event: any) {
    if (event.value === "true") {
      this.onInactiveAddAttribute();
    } else {
      this.inActiveAttribute = this.fb.array([]);
    }
  }
  enableNewactiveProfileMapping(event: any) {
    if (event.value === "true") {
      this.onNewactiveAddAttribute();
    } else {
      this.newActiveAttribute = this.fb.array([]);
    }
  }
  enableSuspendedProfileMapping(event: any) {
    if (event.value === "true") {
      this.onSuspendedAddAttribute();
    } else {
      this.suspendedAttribute = this.fb.array([]);
    }
  }

  enableUnknownProfileMapping(event: any) {
    if (event.value === "true") {
      this.onUnknownAddAttribute();
    } else {
      this.unknownAttribute = this.fb.array([]);
    }
  }

  createCOAbuteFormGroup(): FormGroup {
    return this.fb.group({
      attributeValue: ["", Validators.required],
      attribute: ["", Validators.required],
      clientGroupId: [""],
      attributeId: [""],
      type: ["AUTH"]
    });
  }

  onAddCOAAttribute() {
    this.submitted = false;
    this.coaAttribute.push(this.createCOAAttributeFormGroup());
  }

  createCOAAttributeFormGroup(): FormGroup {
    return this.fb.group({
      checkitem: [""],
      attributeValue: ["", Validators.required],
      attribute: ["", Validators.required],
      clientGroupId: [""],
      attributeId: [""],
      type: ["COA"]
    });
  }

  deleteConfirmCoAAttribute(attributeIndex: number) {
    this.coaAttribute.removeAt(attributeIndex);
  }
  canExit() {
    if (!this.searchGroupByNameForm.dirty) return true;
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
  getAlPermanentDisconnectProfiles() {
    let url = `/coaDMProfiles?mvnoId=${this.mvnoId}`;
    this.AcctProfileService.getMethodForRadius(url).subscribe(
      (response: any) => {
        this.allPermanentDisconnectProfiles = response.coaDMProfileList;
      },
      (error: any) => {
        if (error.error.status == "404") {
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

  getCustomerAttributes() {
    let url = "/commonList/CustomerAttribute";
    this.commonBaseService.get(url).subscribe(
      (response: any) => {
        this.customerAttributes = response.dataList;
      },
      error => {}
    );
  }

  addDynamicAttributes() {
    this.dynamicAttribute.push(
      this.fb.group({
        customerAttribute: [this.dynamicAttributesForm.value.customerAttribute],
        radiusAttribute: [this.dynamicAttributesForm.value.radiusAttribute],
        isAbsenceAccepted: [
          this.dynamicAttributesForm.value.isAbsenceAccepted
            ? this.dynamicAttributesForm.value.isAbsenceAccepted
            : false
        ]
      })
    );
    this.dynamicAttributesForm.reset();
  }

  deleteDynamicAttributes(index) {
    this.dynamicAttribute.removeAt(index);
  }

  addVlanAttributes() {
    this.vlanAttributeValue.push(
      this.fb.group({
        attribute: [this.vlanProfileForm.value.attribute],
        coloumn: [this.vlanProfileForm.value.coloumn]
      })
    );
    this.vlanProfileForm.reset();
  }

  deleteVlanAttributes(index) {
    this.vlanAttributeValue.removeAt(index);
  }

  priorityValidation(event) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }

  authenticationProfileChnage(event: any) {
    if (event.value == "Enable") {
      this.onAddAuthenticationProfileAttribute();
    } else {
      this.authenticatioProfileAttribute = this.fb.array([]);
      this.authenticatioProfileAttribute.reset();
    }
  }

  clearCacheMappingsChnage(event: any) {
    if (event.value == "Enable") {
      this.onAddCacheMappingAttribute();
    } else {
      this.cacheMappingProfileAttribute = this.fb.array([]);
      this.cacheMappingProfileAttribute.reset();
    }
  }

  snmpCheckChange(event: any) {}

  pageChangedDynamicAttList(pageNumber) {
    this.dynamicAttributeList = pageNumber;
  }

  pageChangedVlanProfileList(pageNumber) {
    this.currentPageVlanProfileList = pageNumber;
  }

  pageChangedAuthenticateAttrList(pageNumber) {
    this.currentPageAuthenticateAttrList = pageNumber;
  }

  pageChangedAuthenticateAttrProfileList(pageNumber) {
    this.currentPageAuthenticateAttrProfileList = pageNumber;
  }

  pageChangedCoaDmList(pageNumber) {
    this.currentPageCoaDmList = pageNumber;
  }

  pageChangedCoaDmProfileList(pageNumber) {
    this.currentPageCoaDmProfileList = pageNumber;
  }

  pageChangedinActiveProfileDetailList(pageNumber) {
    this.currentPageInActiveProfileAddList = pageNumber;
  }

  pageChangednewActiveProfileDetailList(pageNumber) {
    this.currentPageNewActiveProfileAddList = pageNumber;
  }

  pageChangedSuspendedProfileList(pageNumber) {
    this.currentPageSuspendedProfileList = pageNumber;
  }

  pageChangedUnknownDetailList(pageNumber) {
    this.currentPageUnknownList = pageNumber;
  }

  closeDialogId() {
    this.radiusClientDetailModal = false;
    this.permanentDisconnectProfileName = "";
  }

  getCoaProfileData(coaProfileId) {
    let data = this.filterCoAProfileList.find(x => x.coaDMProfileId === coaProfileId);
    return data?.name == null || data?.name == "" ? "-" : data?.name;
  }

  getDmProfileData(dmProfileId) {
    let data = this.filterDMProfileList.find(x => x.coaDMProfileId === dmProfileId);
    return data?.name == null || data?.name == "" ? "-" : data?.name;
  }
}
