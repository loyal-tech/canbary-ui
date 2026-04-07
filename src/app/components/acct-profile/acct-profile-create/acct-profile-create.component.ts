import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LoginService } from "src/app/service/login.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { DeviceDriverService } from "src/app/service/device-driver.service";
import { AcctProfileService } from "src/app/service/radius-profile.service";
import { DBMappingMasterService } from "src/app/service/db-mapping-master.service";
import { Iprofile } from "../../model/acct-profile";
import { CoaService } from "src/app/service/coa.service";
import { DictionaryService } from "src/app/service/dictionary.service";

declare var $: any;

@Component({
  selector: "app-acct-profile-create",
  templateUrl: "./acct-profile-create.component.html",
  styleUrls: ["./acct-profile-create.component.scss"]
})
export class AcctProfileCreateComponent implements OnInit {
  editProfileId: any;
  acctProfileForm: FormGroup;
  loggedInUser: any;
  filteredCoADMProfileList: Array<any> = [];
  filteredProxyServerList: Array<any> = [];
  mappingMasterData: any = [];
  proxyServerData: any = [];
  showProfile: boolean = false;
  filteredMappingList: Array<any> = [];
  mvnoData: any;
  type = [];
  authenticationMode: any[] = [];
  authenticationType: any[] = [];
  authenticationSubType: any[] = [];
  status = [{ label: "Active" }, { label: "Inactive" }];
  status1 = [{ label: "Enable" }, { label: "Disable" }];
  deviceDriverList: Array<any> = [];
  totalRecords: number;
  submitted = false;
  editMode: boolean = false;
  editProfileData: Iprofile;
  editProfileMappings: any[] = [];
  mvnoId: any;
  selectedMvnoId: any;
  trustStoreDoc: any = {};
  keystoreDoc: any = {};
  keystorePassword: any = {};
  trustStorePassword: any = {};
  editProfileData1: any;
  selectedTruststoreFilePreview: any[] = [];
  selectedKeystoreFilePreview: any[] = [];
  dictionaryAttributeData: any = [];
  showPassword = false;
  passwordCheckStatusList = [
    { label: "True", value: "true" },
    { label: "False", value: "false" }
  ];
  liveSessionOnInterimList = [
    { label: "True", value: "true" },
    { label: "False", value: "false" }
  ];
  userId: string;
  superAdminId: any = RadiusConstants.SUPERADMINID;

  constructor(
    private fb: FormBuilder,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    public datepipe: DatePipe,
    public loginService: LoginService,
    public invoicePaymentListService: InvoicePaymentListService,
    private route: ActivatedRoute,
    private router: Router,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public statusCheckService: StatusCheckService,
    private deviceDriverService: DeviceDriverService,
    private messageService: MessageService,
    private acctProfileService: AcctProfileService,
    private dbMappingMasterService: DBMappingMasterService,
    private coaService: CoaService,
    private dictionaryService: DictionaryService
  ) {
    this.editProfileId = this.route.snapshot.paramMap.get("profileIdId")!;
    this.selectedMvnoId = this.route.snapshot.paramMap.get("mvnoId")!;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/RADIUS_REQUEST_TYPE")
      .subscribe((response: any) => {
        this.type = response.dataList;
      });
  }

  async ngOnInit() {
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.mvnoId = localStorage.getItem("mvnoId");
    this.userId = localStorage.getItem("userId");
    this.superAdminId = RadiusConstants.SUPERADMINID;
    if (this.userId == RadiusConstants.SUPERADMINID) {
      this.acctProfileForm = this.fb.group({
        name: ["", Validators.required],
        status: ["", Validators.required],
        authenticationMode: [""],
        customerUserNameAttribute: ["User-Name", Validators.required],
        usernameIdentityRegex: [""],
        authenticationType: ["", Validators.required],
        checkItem: [""],
        accountCdrStatus: ["", Validators.required],
        sessionStatus: ["", Validators.required],
        priority: [""],
        requestType: ["", Validators.required],
        authAudit: ["", Validators.required],
        proxyServerName: [""],
        // coadm: [""],
        // coaDMProfile: [""],
        mappingMaster: ["", Validators.required],
        mvnoName: [""],
        autoProvisionMac: ["Disable", Validators.required],
        deviceDriverName: [""],
        authenticationSubType: [""],
        trustStoreDoc: [""],
        keystoreDoc: [""],
        keystorePassword: [""],
        trustStorePassword: [""],
        passwordCheckRequired: ["", Validators.required],
        terminateSessionOnDuplicateMac: ["", Validators.required],
        addLiveSessionOnInterim: ["false", Validators.required],
        disconnectSessionOnInterim: ["", Validators.required]
      });
    } else {
      this.acctProfileForm = this.fb.group({
        name: ["", Validators.required],
        status: ["", Validators.required],
        authenticationMode: [""],
        customerUserNameAttribute: ["User-Name", Validators.required],
        usernameIdentityRegex: [""],
        authenticationType: ["", Validators.required],
        checkItem: [""],
        accountCdrStatus: ["", Validators.required],
        sessionStatus: ["", Validators.required],
        priority: [""],
        requestType: ["", Validators.required],
        authAudit: ["", Validators.required],
        proxyServerName: [""],
        mappingMaster: ["", Validators.required],
        mvnoName: [""],
        autoProvisionMac: ["Disable", Validators.required],
        deviceDriverName: [""],
        authenticationSubType: [""],
        trustStoreDoc: [""],
        keystoreDoc: [""],
        keystorePassword: [""],
        trustStorePassword: [""],
        passwordCheckRequired: ["", Validators.required],
        terminateSessionOnDuplicateMac: ["", Validators.required],
        addLiveSessionOnInterim: ["false", Validators.required],
        disconnectSessionOnInterim: ["", Validators.required]
      });
    }

    this.getAuthenticationMode();
    this.getAuthenticationType();
    this.getAllMappingMasters();
    this.getAllProxyServer();
    this.getAllDeviceDriverList();
    this.getAllDictionaryAttributes();
    if (this.editProfileId != null) {
      this.editMode = true;
      this.editAcctProfileById(this.editProfileId, this.selectedMvnoId);
    }
  }

  getDetailsByMVNO(mvnoId) {
    this.filteredCoADMProfileList = [];
    this.filteredProxyServerList = [];
    let allMappingList = this.mappingMasterData.mappingList
      ? this.mappingMasterData.mappingList
      : [];
    let allProxyServerList = this.proxyServerData.proxyServerList
      ? this.proxyServerData.proxyServerList
      : [];
    this.showProfile = false;
    if (mvnoId == 1) {
      this.filteredMappingList = allMappingList;
      this.filteredProxyServerList = allProxyServerList.filter(
        element => element.status !== "Inactive"
      );
    } else {
      this.filteredMappingList = allMappingList.filter(
        element => element.mvnoId == mvnoId || element.mvnoId == 1
      );
      this.filteredProxyServerList = allProxyServerList.filter(
        element =>
          (element.mvnoId == mvnoId || element.mvnoId == 1) && element.status !== "Inactive"
      );
    }
  }

  onChangeofRequestType(requestType) {
    if (requestType === "Authentication") {
      this.acctProfileForm.patchValue({
        autoProvisionMac: ["Disable", Validators.required]
      });
      this.acctProfileForm.controls.accountCdrStatus.setValue("");
      this.acctProfileForm.controls.sessionStatus.setValue("");
      this.acctProfileForm.controls.mappingMaster.setValue("");
      this.acctProfileForm.controls.authAudit.setValue("");
      this.acctProfileForm.get("authAudit").setValidators([Validators.required]);
      this.acctProfileForm.get("authAudit").updateValueAndValidity();
      this.acctProfileForm.controls.accountCdrStatus.disable();
      this.acctProfileForm.controls.sessionStatus.disable();
      this.acctProfileForm.controls.mappingMaster.disable();
      this.acctProfileForm.controls.authAudit.enable();
      this.acctProfileForm.controls.autoProvisionMac.enable();
      this.acctProfileForm.controls.autoProvisionMac.setValue("Disable");
    } else if (requestType === "Accounting") {
      this.acctProfileForm.controls.accountCdrStatus.setValue("");
      this.acctProfileForm.controls.sessionStatus.setValue("");
      this.acctProfileForm.controls.mappingMaster.setValue("");
      this.acctProfileForm.controls.authAudit.setValue("");
      this.acctProfileForm.controls.autoProvisionMac.setValue("");
      this.acctProfileForm.get("accountCdrStatus").setValidators([Validators.required]);
      this.acctProfileForm.get("accountCdrStatus").updateValueAndValidity();
      this.acctProfileForm.get("sessionStatus").setValidators([Validators.required]);
      this.acctProfileForm.get("sessionStatus").updateValueAndValidity();
      this.acctProfileForm.get("mappingMaster").setValidators([Validators.required]);
      this.acctProfileForm.get("mappingMaster").updateValueAndValidity();
      this.acctProfileForm.controls.accountCdrStatus.enable();
      this.acctProfileForm.controls.sessionStatus.enable();
      this.acctProfileForm.controls.mappingMaster.enable();
      this.acctProfileForm.controls.authAudit.disable();
      this.acctProfileForm.controls.autoProvisionMac.disable();
    } else {
      this.acctProfileForm.controls.accountCdrStatus.setValue("");
      this.acctProfileForm.controls.sessionStatus.setValue("");
      this.acctProfileForm.controls.mappingMaster.setValue("");
      this.acctProfileForm.controls.authAudit.setValue("");
      this.acctProfileForm.controls.autoProvisionMac.setValue("");
      this.acctProfileForm.controls.accountCdrStatus.disable();
      this.acctProfileForm.controls.sessionStatus.disable();
      this.acctProfileForm.controls.mappingMaster.disable();
      this.acctProfileForm.controls.authAudit.disable();
      this.acctProfileForm.controls.autoProvisionMac.disable();
    }
  }

  onFileChange(event: Event, type: string) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      if (type === "keystoreDoc") {
        this.keystoreDoc = inputElement.files[0];
        this.acctProfileForm.patchValue({
          keystoreDoc: this.keystoreDoc.name
        });
        for (let i = 0; i < inputElement.files.length; i++) {
          this.selectedKeystoreFilePreview.push(inputElement.files.item(i));
        }
      } else if (type === "trustStoreDoc") {
        this.trustStoreDoc = inputElement.files[0];
        this.acctProfileForm.patchValue({
          trustStoreDoc: this.trustStoreDoc.name
        });
        for (let i = 0; i < inputElement.files.length; i++) {
          this.selectedTruststoreFilePreview.push(inputElement.files.item(i));
        }
      }
    }
  }

  getAllDeviceDriverList() {
    this.deviceDriverService.findAllDeviceDrivers("", "").subscribe(
      (response: any) => {
        if (response.deviceList.length > 0) {
          //   this.deviceDriverList = response.radiusProfileList;
          this.deviceDriverList = response.deviceList.map((data: any) => ({
            value: data.name,
            label: data.name
          }));
        }
        var defaultData = {
          value: "Adopt BSS",
          label: "Adopt BSS"
        };
        this.deviceDriverList.push(defaultData);
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

  getAuthenticationMode() {
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/radius_profile_mode")
      .subscribe((response: any) => {
        this.authenticationMode = response.dataList;
      });
  }
  getAuthenticationType() {
    this.commondropdownService
      .getMethodWithCache("/commonList/generic/authentication_type")
      .subscribe((response: any) => {
        this.authenticationType = response.dataList;
      });
  }

  onAuthenticationTypeChange(selectedType: string) {
    if (selectedType == "EAP-TLS" || selectedType == "EAP-TTLS") {
      this.setValidatorForControl("trustStoreDoc");
      this.setValidatorForControl("keystoreDoc");
      this.setValidatorForControl("keystorePassword");
      this.setValidatorForControl("trustStorePassword");
      this.clearValidatorForControl("authenticationMode");
      this.acctProfileForm.controls.authenticationMode.disable();
    } else {
      this.clearValidatorForControl("trustStoreDoc");
      this.clearValidatorForControl("keystoreDoc");
      this.clearValidatorForControl("keystorePassword");
      this.clearValidatorForControl("trustStorePassword");
      this.setValidatorForControl("authenticationMode");
      this.acctProfileForm.controls.authenticationMode.enable();
    }
    this.acctProfileForm.patchValue({
      trustStoreDoc: "",
      keystoreDoc: "",
      keystorePassword: "",
      trustStorePassword: "",
      authenticationSubType: "",
      authenticationMode: ""
    });
    this.selectedKeystoreFilePreview = [];
    this.selectedTruststoreFilePreview = [];
    this.commondropdownService.getMethodWithCache(`/commonList/generic/${selectedType}`).subscribe(
      (response: any) => {
        this.authenticationSubType = response.dataList;
      },
      (error: any) => {
        console.error("Error fetching secondary options", error);
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

  async getAllProxyServer() {
    this.acctProfileService.getProxyServer().subscribe(
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

  async addAcctProfile() {
    this.submitted = true;
    if (this.acctProfileForm.valid) {
      const formData = new FormData();
      let fileArray: FileList;
      if (this.trustStoreDoc) {
        formData.append("trustStoreDoc", this.trustStoreDoc);
      }
      if (this.keystoreDoc) {
        formData.append("keystoreDoc", this.keystoreDoc);
      }
      if (this.editMode) {
        let profileMapping = this.editProfileData.profileMappings;
        var req = this.acctProfileForm.value;
        // this.editProfileData = this.acctProfileForm.value;
        req.profileMappings = profileMapping;
        // this.editProfileData.radiusProfileId = this.editProfileId;
        req.passwordCheckRequired = req.passwordCheckRequired == "false" ? false : true;
        req.terminateSessionOnDuplicateMac =
          req.terminateSessionOnDuplicateMac == "false" ? false : true;
        req.addLiveSessionOnInterim = req.addLiveSessionOnInterim == "false" ? false : true;
        req.disconnectSessionOnInterim = req.disconnectSessionOnInterim == "false" ? false : true;
        formData.append("entityDTO", JSON.stringify(req));

        this.acctProfileService.updateAcctProfile(formData).subscribe(
          (response: any) => {
            this.editMode = false;
            this.submitted = false;
            this.acctProfileForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.router.navigate(["/home/radiusProfile/list/"]);
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
        var request = this.acctProfileForm.value;
        request.passwordCheckRequired = request.passwordCheckRequired == "false" ? false : true;
        request.terminateSessionOnDuplicateMac =
          request?.terminateSessionOnDuplicateMac == "false" ? false : true;
        request.addLiveSessionOnInterim = request.addLiveSessionOnInterim == "false" ? false : true;
        request.disconnectSessionOnInterim =
          request?.disconnectSessionOnInterim == "false" ? false : true;

        formData.append("entityDTO", JSON.stringify(request));
        this.acctProfileService.addNewAcctProfile(formData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.acctProfileForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.router.navigate(["/home/radiusProfile/list/"]);
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
    this.showProfile = false;
  }

  async editAcctProfileById(radiusProfileId, selectedMvnoId) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.editMode = true;

      this.acctProfileService.getProfileById(radiusProfileId).subscribe(
        (response: any) => {
          this.editProfileData = response.radiusProfile;
          const mappedProfileMappings = this.editProfileData.profileMappings.map(mapping =>
            this.fb.group({
              id: [mapping.id],
              profileId: [mapping.profileId],
              password: [mapping.password],
              filePath: [mapping.filePath],
              fileType: [mapping.fileType]
            })
          );

          //   this.editProfileMappings = response.radiusProfile.profileMappings
          this.getcoaDMProfiles(this.editProfileData.coadm, selectedMvnoId);
          if (this.editProfileData.authenticationType) {
            this.onAuthenticationTypeChange(this.editProfileData.authenticationType);
          }

          let proxyServerName;
          let coaDMProfileName;
          let mappingMasterName;
          if (response.radiusProfile.proxyServer != null) {
            proxyServerName = response.radiusProfile.proxyServer.name;
          }
          if (response.radiusProfile.coaDMProfile != null) {
            coaDMProfileName = response.radiusProfile.coaDMProfile.name;
          }
          if (response.radiusProfile.mappingMaster != null) {
            mappingMasterName = response.radiusProfile.mappingMaster.name;
          }
          this.editProfileId = this.editProfileData.radiusProfileId;
          this.onChangeofRequestType(this.editProfileData.requestType);
          if (
            this.editProfileData.profileMappings &&
            this.editProfileData.profileMappings.length > 0
          ) {
            this.editProfileData.profileMappings.forEach(mapping => {
              if (mapping.fileType === "jks") {
                let name = this.editProfileData.name + "\\";
                const parts = mapping.filePath.split(name);
                this.selectedTruststoreFilePreview.push({
                  name: parts[parts.length - 1],
                  type: mapping.fileType
                });
                this.acctProfileForm.patchValue({
                  trustStorePassword: mapping.password,
                  trustStoreDoc: mapping.filePath
                });
              } else if (mapping.fileType === "p12") {
                let name = this.editProfileData.name + "\\";
                const parts = mapping.filePath.split(name);
                this.selectedKeystoreFilePreview.push({
                  name: parts[parts.length - 1],
                  type: mapping.fileType
                });
                this.acctProfileForm.patchValue({
                  keystorePassword: mapping.password,
                  keystoreDoc: mapping.filePath
                });
              }
            });
          }

          this.acctProfileForm.patchValue({
            name: this.editProfileData.name,
            status: this.editProfileData.status,
            checkItem: this.editProfileData.checkItem,
            accountCdrStatus: this.editProfileData.accountCdrStatus,
            sessionStatus: this.editProfileData.sessionStatus,
            mappingMaster: mappingMasterName,
            priority: this.editProfileData.priority,
            requestType: this.editProfileData.requestType,
            authAudit: this.editProfileData.authAudit,
            proxyServerName: proxyServerName,
            authenticationMode: this.editProfileData.authenticationMode,
            customerUserNameAttribute: this.editProfileData.customerUserNameAttribute,
            usernameIdentityRegex: this.editProfileData.usernameIdentityRegex,
            // coadm: this.editProfileData.coadm,
            // coaDMProfile: coaDMProfileName,
            mvnoName: this.editProfileData.mvnoId,
            autoProvisionMac: this.editProfileData.autoProvisionMac,
            deviceDriverName: this.editProfileData.deviceDriverName,
            authenticationType: this.editProfileData.authenticationType,
            authenticationSubType: this.editProfileData.authenticationSubType,
            passwordCheckRequired: this.editProfileData.passwordCheckRequired.toString(),
            terminateSessionOnDuplicateMac:
              this.editProfileData.terminateSessionOnDuplicateMac.toString(),
            addLiveSessionOnInterim: this.editProfileData?.addLiveSessionOnInterim?.toString(),
            disconnectSessionOnInterim: this.editProfileData.disconnectSessionOnInterim.toString()
          });

          this.hideField();
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

  hideField() {
    if (this.acctProfileForm.value.coadm == "CoA") {
      this.showProfile = true;

      this.userId = localStorage.getItem("userId");
      if (this.userId == RadiusConstants.SUPERADMINID) {
        this.getcoaDMProfiles("CoA", this.acctProfileForm.controls.mvnoName.value);
      } else {
        this.getcoaDMProfiles("CoA", this.mvnoId);
      }
    } else if (this.acctProfileForm.value.coadm == "DM") {
      this.showProfile = true;
      this.userId = localStorage.getItem("userId");
      if (this.userId == RadiusConstants.SUPERADMINID) {
        this.getcoaDMProfiles("DM", this.acctProfileForm.controls.mvnoName.value);
      } else {
        this.getcoaDMProfiles("DM", this.mvnoId);
      }
    } else if (this.acctProfileForm.value.coadm == "None") {
      this.showProfile = false;
    }

    if (this.acctProfileForm.value.coadm == "CoA" || this.acctProfileForm.value.coadm == "DM") {
    }
  }

  getcoaDMProfiles(type, mvno) {
    if (type) {
      this.coaService.getCoAByType(type).subscribe(
        (response: any) => {
          if (mvno == RadiusConstants.SUPER_ADMIN_MVNO) {
            this.filteredCoADMProfileList = response.coaDMProfileList;
          } else {
            this.filteredCoADMProfileList = response.coaDMProfileList.filter(
              element => element.mvnoId == mvno || element.mvnoId == 1
            );
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
    } else {
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

  deletTruststoreFile(event: any) {
    var temp: File[] = this.selectedTruststoreFilePreview?.filter(
      (item: File) => item?.name != event
    );
    this.selectedTruststoreFilePreview = temp;
    this.acctProfileForm.patchValue({
      trustStoreDoc: null,
      trustStorePassword: ""
    });
  }

  deletKeystoreFile(event: any) {
    var temp: File[] = this.selectedKeystoreFilePreview?.filter(
      (item: File) => item?.name != event
    );
    this.selectedKeystoreFilePreview = temp;
    this.acctProfileForm.patchValue({
      keystoreDoc: "",
      keystorePassword: ""
    });
  }

  truststoreFileClick() {}

  keystoreFileClick() {}

  setValidatorForControl(control) {
    this.acctProfileForm.get(control).setValidators([Validators.required]);
    this.acctProfileForm.get(control).updateValueAndValidity();
  }

  clearValidatorForControl(control) {
    this.acctProfileForm.get(control).clearValidators();
    this.acctProfileForm.get(control).updateValueAndValidity();
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
}
