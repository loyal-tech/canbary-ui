import { Component, OnInit, ViewChild } from "@angular/core";
import { SmsConfigService } from "src/app/service/sms-config.service";
import { FormBuilder, Validators, FormGroup, NgForm, FormArray } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { NOTIFICATIONS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-sms-config",
  templateUrl: "./sms-config.component.html",
  styleUrls: ["./sms-config.component.css"]
})
export class SmsConfigComponent implements OnInit {
  public loginService: LoginService;
  AclClassConstants;
  AclConstants;
  editGroupData = {
    smsConfigId: "",
    smsUrl: "",
    configStatus: ""
  };
  editAttributeValues: any;
  attribute: FormArray;
  changeStatusData: any = [];
  groupData: any = [];
  editForm: FormGroup;
  smsConfigId: number;
  submitted = false;
  //Used and required for pagination
  totalRecords: String;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  //Used to store error data and error message
  errorData: any = [];
  errorMsg = "";
  configStatus: boolean;
  editMode: boolean = false;
  editFormValues: any;
  update: boolean = true;
  isSmsConfigEdit = true;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  createAccess: boolean = false;
  editAccess: boolean = false;
  constructor(
    private messageService: MessageService,
    private smsConfigService: SmsConfigService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(NOTIFICATIONS.SMS_CONFIG_CREATE);
    this.editAccess = loginService.hasPermission(NOTIFICATIONS.SMS_CONFIG_EDIT);
  }

  isActive: boolean = true; // or false, depending on your logic
  activeValue: any = true; // Replace with your actual active value
  inactiveValue: any = false;
  loginmvnoid: any = JSON.parse(localStorage.getItem("mvnoId")); // Replace with your actual inactive value
  dropdownOptions: any[] = [
    { label: "Active", value: true },
    { label: "Inactive", value: false }
    // Add other options as needed
  ];
  ngOnInit(): void {
    this.editForm = this.fb.group({
      smsUrl: ["", Validators.required],
      configStatus: ["", Validators.required]
    });
    this.attribute = this.fb.array([]);
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
    this.smsConfigService.findAll(this.currentStaffBuid).subscribe(
      (response: any) => {
        this.groupData = response;

        this.totalRecords = this.groupData.smsConfigList.length;
        // if (this.groupData.smsConfigList !== null && this.groupData.smsConfigList.length > 1) {
        //   console.log("enter in groupdata find all sms config");
        //   this.editMode = true;
        // }
        const filteredLength = this.groupData.smsConfigList.filter(
          item => item.mvnoId === this.loginmvnoid
        ).length;
        if (filteredLength >= 2) {
          this.editMode = true;
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

  async editSmsConfig() {
    this.submitted = true;
    if (this.editMode) {
      if (this.editForm.valid) {
        if (
          this.editForm.value == this.editFormValues &&
          JSON.stringify(this.attribute.value) === JSON.stringify(this.editAttributeValues)
        ) {
          this.editMode = true;
          this.submitted = false;
          this.isSmsConfigEdit = true;

          this.editForm.reset();
          this.attribute = this.fb.array([]);
          this.attribute.controls = [];
          // this.onAddAttribute();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Profile data is same",
            icon: "far fa-check-circle"
          });
        } else if (
          this.editForm.value != this.editFormValues &&
          JSON.stringify(this.attribute.value) === JSON.stringify(this.editAttributeValues)
        ) {
          this.updateSmsConfig();
        } else if (
          this.editForm.value == this.editFormValues &&
          JSON.stringify(this.attribute.value) !== JSON.stringify(this.editAttributeValues)
        ) {
          this.updateSmsConfigMapping(this.selectedSmsConfigId);
        } else {
          this.update = false;
          this.updateSmsConfig();
          this.updateSmsConfigMapping(this.selectedSmsConfigId);
          this.editMode = true;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "CoA/DM profile and attribute has been updated successfully.",
            icon: "far fa-check-circle"
          });
        }
      }
    } else {
      if (this.editForm.valid) {
        if (
          this.editForm.value == this.editFormValues &&
          JSON.stringify(this.attribute.value) === JSON.stringify(this.editAttributeValues)
        ) {
          this.editMode = false;
          this.submitted = false;
          this.editForm.reset();
          this.attribute = this.fb.array([]);
          this.attribute.controls = [];
          // this.onAddAttribute();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Profile data is same",
            icon: "far fa-check-circle"
          });
        } else if (
          this.editForm.value != this.editFormValues &&
          JSON.stringify(this.attribute.value) === JSON.stringify(this.editAttributeValues)
        ) {
          this.addSmsConfig();
        } else if (
          this.editForm.value == this.editFormValues &&
          JSON.stringify(this.attribute.value) !== JSON.stringify(this.editAttributeValues)
        ) {
          this.addSmsConfigMapping(this.selectedSmsConfigId);
        } else {
          this.update = false;
          this.addSmsConfig();
          this.editMode = true;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "SMS config add successfully.",
            icon: "far fa-check-circle"
          });
        }
      }
    }
  }

  async updateSmsConfigMapping(selectedSmsConfigId) {
    this.smsConfigService
      .updateSmsConfigMapping(this.attribute.value, selectedSmsConfigId)
      .subscribe(
        (response: any) => {
          this.editMode = false;
          this.submitted = false;
          this.editForm.reset();
          this.attribute = this.fb.array([]);
          this.attribute.controls = [];
          // this.onAddAttribute();
          if (this.update) {
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
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
  }
  async updateSmsConfig() {
    // if (this.editCoaDMData) this.editCoaDMData = this.editForm.value;
    // this.editCoaDMData.coaDMProfileId = this.editCoAId;
    const updatedGroupData = {
      smsConfigId: this.editGroupData.smsConfigId,
      smsUrl: this.editForm.value.smsUrl,
      configStatus: this.editForm.value.configStatus
    };
    this.smsConfigService.updateSmsConfig(updatedGroupData).subscribe(
      (response: any) => {
        this.editMode = false;
        this.submitted = false;
        this.findAll("");
        this.editForm.reset();
        if (this.update) {
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
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  async addSmsConfig() {
    // if (this.editCoaDMData) this.editCoaDMData = this.editForm.value;
    // this.editCoaDMData.coaDMProfileId = this.editCoAId;
    const updatedGroupData = {
      smsUrl: this.editForm.value.smsUrl,
      configStatus: this.editForm.value.configStatus
    };
    this.smsConfigService.addSmsConfig(updatedGroupData, this.currentStaffBuid).subscribe(
      (response: any) => {
        this.selectedSmsConfigId = response.smsConfig.smsConfigId;
        this.submitted = false;
        this.addSmsConfigMapping(this.selectedSmsConfigId);
        this.findAll("");
        this.editForm.reset();
        this.editMode = true;
        location.reload();
        if (this.update) {
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
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  async addSmsConfigMapping(selectedSmsConfigId) {
    this.smsConfigService.addSmsConfigMapping(this.attribute.value, selectedSmsConfigId).subscribe(
      (response: any) => {
        this.editMode = false;
        this.submitted = false;
        this.editForm.reset();
        this.attribute = this.fb.array([]);
        this.attribute.controls = [];
        // this.onAddAttribute();
        if (this.update) {
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
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  // async editSmsConfig() {
  //   this.submitted = true;
  //   if (this.editForm.valid) {
  //
  //     const updatedGroupData = {
  //       smsConfigId: this.editGroupData.smsConfigId,
  //       smsUrl: this.editGroupData.smsUrl,
  //     };
  //     this.smsConfigService.updateSmsConfig(updatedGroupData).subscribe(
  //       (response: any) => {
  //         this.submitted = false;
  //         this.editForm.reset();
  //         this.findAll('');
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Successfully',
  //           detail: 'Updated Successfuly',
  //           icon: 'far fa-check-circle',
  //         });
  //         this.editMode = false;
  //
  //       },
  //       (error: any) => {
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: error.error.errorMessage,
  //           detail: error.error.errorMessage,
  //           icon: 'far fa-times-circle',
  //         });
  //
  //       }
  //     );
  //   }
  // }
  selectedSmsConfigId: any = "";

  async editConfigById(smsConfigId, index) {
    this.dropdownOptions;
    this.editMode = true;
    this.isSmsConfigEdit = false;
    this.selectedSmsConfigId = smsConfigId;
    index = this.radiusUtility.getIndexOfSelectedRecord(index, this.currentPage, this.itemsPerPage);
    this.editForm.patchValue({
      smsUrl: this.groupData.smsConfigList[index].smsUrl,
      configStatus: this.groupData.smsConfigList[index].configStatus
    });

    this.editGroupData = {
      smsConfigId: this.groupData.smsConfigList[index].smsConfigId,
      smsUrl: this.groupData.smsConfigList[index].smsUrl,
      configStatus: this.groupData.smsConfigList[index].configStatus
    };

    this.attribute = this.fb.array([]);

    this.smsConfigService.getSmsConfigMappings(smsConfigId).subscribe(
      (response: any) => {
        let attributeList = response.smsConfigMappingList;
        attributeList.forEach(element => {
          this.attribute.push(this.fb.group(element));
        });

        this.editAttributeValues = response.smsConfigMappingList;
        this.editFormValues = this.editForm.value;
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

  async clearSearchForm() {
    this.currentPage = 1;
    this.findAll("");
  }
  deleteConfirmAttribute(attributeIndex: number, smsConfigMappingId: number) {
    if (smsConfigMappingId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this SMS Configuration Parameter?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveAttribute(attributeIndex, smsConfigMappingId);
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    } else {
      this.attribute.removeAt(attributeIndex);
    }
  }
  async onRemoveAttribute(attributeIndex: number, smsConfigMappingId: number) {
    this.smsConfigService.deleteSmsConfigByAttributeId(smsConfigMappingId).subscribe(
      (response: any) => {
        this.attribute = this.fb.array([]);
        // this.editConfigById(this.selectedSmsConfigId, attributeIndex);
        this.smsConfigService
          .getSmsConfigMappings(this.selectedSmsConfigId)
          .subscribe((response: any) => {
            let attributeList = response.smsConfigMappingList;
            attributeList.forEach(element => {
              this.attribute.push(this.fb.group(element));
            });

            this.editAttributeValues = response.smsConfigMappingList;
            this.editFormValues = this.editForm.value;
          });
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
  onAddAttribute() {
    this.attribute.push(this.createAttributeFormGroup());
  }
  createAttributeFormGroup(): FormGroup {
    return this.fb.group({
      parameter: [""],
      value: [""],
      smsConfigId: [""],
      smsConfigMappingId: [""]
    });
  }
  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
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
}
