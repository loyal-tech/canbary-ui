import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { DeviceService } from "src/app/service/device.service";
import { LoginService } from "src/app/service/login.service";
import { IdeviceOnEdit } from "../model/IdeviceOnEdit";
import { Idevice } from "../model/wifi-device";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { RadiusClientService } from "src/app/service/radius-client.service";

@Component({
  selector: "app-device-management",
  templateUrl: "./device-management.component.html",
  styleUrls: ["./device-management.component.css"]
})
export class DeviceManagementComponent implements OnInit {
  searchDeviceForm: FormGroup;
  deviceForm: FormGroup;
  mvnoData: any;
  loggedInUser: any;
  mvnoId: any;
  filteredCoADMList: any;
  accessData: any = JSON.parse(localStorage.getItem("accessData"));
  deviceDetail: any = [];
  isHttpType: boolean = false;
  searchDeviceName = "";
  createDeviceFlag = false;
  DeviceGridFlag = true;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  createAccess: any;
  editAccess: any;
  deleteAccess: any;
  changeStatusAccess: any;
  modalToggle: boolean = true;
  clientList: any[] = [];
  clientListMaster: any[] = [];
  userId: string;
  superAdminId: string = RadiusConstants.SUPERADMINID;
  constructor(
    private messageService: MessageService,
    private radiusUtility: RadiusUtility,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private deviceService: DeviceService,
    loginService: LoginService,
    private radiusClientService: RadiusClientService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DEVICE_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DEVICE_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DEVICE_EDIT);
    this.changeStatusAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DEVICE_STATUS);
    this.findAll("");
    this.findCoaProfiles();
    this.getRadiusClientList();
  }

  ngOnInit(): void {
    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    this.searchDeviceForm = this.fb.group({
      name: [""]
    });
    this.deviceForm = this.fb.group({
      deviceProfileName: ["", Validators.required],
      status: ["", Validators.required],
      checkItem: [""],
      description: [""],
      priority: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      type: ["", Validators.required],
      clientIds: [[]],
      loginurl: [""],
      logouturl: [""],
      coaProfileName: [""],
      mvnoName: this.mvnoId
    });
    this.createDeviceFlag = false;
    this.DeviceGridFlag = true;
  }

  //Used and required for pagination
  totalRecords: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  searchSubmitted = false;
  deviceData: any = [];
  coaProfileData: any = [];
  editMode: boolean = false;

  deviceDataOnEdit: Idevice;
  editDeviceInfo: IdeviceOnEdit;
  status = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" }
  ];
  deviceType = [{ label: "HTTP" }, { label: "COA" }, { label: "SNMP" }];
  submitted = false;
  editDeviceId: number;

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (
      this.searchDeviceForm.controls.name.value != null &&
      this.searchDeviceForm.controls.name.value != ""
    ) {
      this.searchDevice();
    } else {
      this.findAll("");
    }

    this.createDeviceFlag = false;
    this.DeviceGridFlag = true;
  }

  createDeviceManagement() {
    this.createDeviceFlag = true;
    this.DeviceGridFlag = false;
    this.editMode = false;
    this.reset();
    this.searchDeviceName = "";
  }

  DeviceListData() {
    this.createDeviceFlag = false;
    this.DeviceGridFlag = true;
    this.editMode = false;
    this.currentPage = 1;
    this.reset();
    this.findAll("");
    this.searchDeviceName = "";
  }

  reset() {
    this.editMode = false;
    this.deviceForm.reset();
  }

  clearSearchForm() {
    this.clearFormData();
    this.searchSubmitted = false;
    this.currentPage = 1;
    this.searchDeviceForm.reset();
    this.reset();
    this.findAll("");
    this.searchDeviceName = "";
    this.clientList = [...this.clientListMaster];
  }

  clearFormData() {
    this.submitted = false;
    this.editMode = false;
    this.deviceForm.reset();
  }
  async findAll(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }

    this.deviceService.getAll(page, size, "").subscribe(
      (response: any) => {
        this.deviceData = response.deviceList;
        this.totalRecords = this.deviceData.length;
      },
      (error: any) => {
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAll(this.showItemPerPage);
    } else {
      this.searchDevice();
    }
  }

  async searchDevice() {
    this.searchSubmitted = true;
    this.createDeviceFlag = false;
    this.DeviceGridFlag = true;
    this.reset();
    if (this.searchDeviceForm.valid) {
      this.deviceData = [];
      this.searchkey = "keysearch";
      if (this.showItemPerPage) {
        this.itemsPerPage = this.showItemPerPage;
      }
      let name = this.searchDeviceName.trim() ? this.searchDeviceName.trim() : "";
      this.deviceService.getByName(name).subscribe(
        (response: any) => {
          this.deviceData = response.deviceList;
          this.totalRecords = this.deviceData.length;
        },
        (error: any) => {
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

  async changeStatus(deviceProfileName, status, selectedMvnoId, event) {
    event.preventDefault();
    this.modalToggle = true;
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.reset();

      if (status == "Active") {
        status = "Inactive";
      } else {
        status = "Active";
      }
      this.deviceService.changeStatus(deviceProfileName, status, selectedMvnoId).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          if (!this.searchkey) {
            this.findAll("");
          } else {
            this.searchDevice();
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
    } else {
      if (!this.searchkey) {
        this.findAll("");
      } else {
        this.searchDevice();
      }
    }
  }

  async editDeviceData(deviceId, index, selectedMvnoId) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.clientList = [];
      this.clientList = [...this.clientListMaster];
      let coaDmProfileName = null;
      this.getFilteredCOADMProfile(selectedMvnoId);
      this.editMode = true;
      this.createDeviceFlag = true;
      this.DeviceGridFlag = false;

      this.editDeviceId = deviceId;
      this.editDeviceInfo = this.deviceData[index];
      // index = this.radiusUtility.getIndexOfSelectedRecord(
      //   index,
      //   this.currentPage,
      //   this.itemsPerPage
      // );
      if (this.editDeviceInfo.type == "COA") {
        for (let coaProfile of this.coaProfileData.coaProfileList) {
          if (this.editDeviceInfo.coaDmProfileId == coaProfile.coaDMProfileId) {
            coaDmProfileName = coaProfile.name;
          }
        }
      }

      let clientIdList = this.editDeviceInfo.clientList.map(cliet => cliet.clientId);
      this.editDeviceInfo.clientList.forEach(data => {
        this.clientList.push(data);
      });

      this.deviceForm.patchValue({
        deviceProfileName: this.editDeviceInfo.deviceProfileName,
        status: this.editDeviceInfo.status,
        checkItem: this.editDeviceInfo.checkItem,
        description: this.editDeviceInfo.description,
        loginurl: this.editDeviceInfo.loginurl,
        logouturl: this.editDeviceInfo.logouturl,
        priority: this.editDeviceInfo.priority,
        type: this.editDeviceInfo.type,
        coaProfileName: coaDmProfileName,
        clientIds: clientIdList
        // mvnoName: this.editDeviceInfo.mvnoId,
      });

      // this.deviceService.getById(deviceId).subscribe(
      //   (response: any) => {
      //     this.editDeviceInfo = response.device;
      //     if (this.editDeviceInfo.type == 'HTTP') {
      //       this.httpTrue = true;
      //       this.CoaTrue = false;
      //     } else {
      //       this.httpTrue = false;
      //       this.CoaTrue = true;
      //       for (let coaProfile of this.coaProfileData.coaProfileList) {
      //         console.log(coaProfile); // 1, "string", false
      //         if (
      //           this.editDeviceInfo.coaDmProfileId == coaProfile.coaDMProfileId
      //         ) {
      //           coaDmProfileName = coaProfile.name;
      //         }
      //       }
      //     }
      //     this.deviceForm.patchValue({
      //       deviceProfileName: this.editDeviceInfo.deviceProfileName,
      //       status: this.editDeviceInfo.status,
      //       checkItem: this.editDeviceInfo.checkItem,
      //       description: this.editDeviceInfo.description,
      //       loginurl: this.editDeviceInfo.loginurl,
      //       logouturl: this.editDeviceInfo.logouturl,
      //       priority: this.editDeviceInfo.priority,
      //       type: this.editDeviceInfo.type,
      //       coaProfileName: coaDmProfileName,
      //       mvnoName: this.editDeviceInfo.mvnoId
      //     });
      //
      //   },
      //   (error) => {
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: error.error.errorMessage,
      //       icon: 'far fa-times-circle',
      //     });
      //
      //   }
      // );
    }
  }

  deleteConfirm(deviceProfileName, selectedMvnoId) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.reset();
      this.confirmationService.confirm({
        message: "Do you want to delete this device?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteDevice(deviceProfileName, selectedMvnoId);
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

  async deleteDevice(deviceProfileName, selectedMvnoId) {
    this.deviceService.deleteByName(deviceProfileName, selectedMvnoId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && this.deviceData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.findAll("");
        } else {
          this.searchDevice();
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

  async addDeviceProfile() {
    this.submitted = true;
    if (this.deviceForm.valid) {
      if (this.editMode) {
        this.deviceDataOnEdit = this.deviceForm.value;
        this.deviceDataOnEdit.deviceId = this.editDeviceId;
        this.deviceService.update(this.deviceDataOnEdit).subscribe(
          (response: any) => {
            this.editMode = false;
            this.submitted = false;
            this.createDeviceFlag = false;
            this.DeviceGridFlag = true;
            this.getRadiusClientList();
            if (!this.searchkey) {
              this.findAll("");
            } else {
              this.searchDevice();
            }
            this.deviceForm.reset();
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
        this.deviceService.add(this.deviceForm.value).subscribe(
          (response: any) => {
            this.submitted = false;
            this.createDeviceFlag = false;
            this.DeviceGridFlag = true;
            this.findAll("");
            this.deviceForm.reset();
            this.getRadiusClientList();
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

  hideShowFields(type) {
    if (type == "HTTP") {
      this.deviceForm = this.fb.group({
        deviceProfileName: [this.deviceForm.value.deviceProfileName, Validators.required],
        status: [this.deviceForm.value.status, Validators.required],
        checkItem: [this.deviceForm.value.checkItem],
        description: [this.deviceForm.value.description],
        priority: [this.deviceForm.value.priority, Validators.required],
        type: [this.deviceForm.value.type, Validators.required],
        loginurl: [this.deviceForm.value.loginurl, Validators.required],
        logouturl: [this.deviceForm.value.logouturl, Validators.required],
        coaProfileName: [""],
        mvnoName: [this.deviceForm.value.mvnoName],
        clientIds: [this.deviceForm.value.clientIds]
      });
    } else if (type == "COA") {
      this.getFilteredCOADMProfile(this.deviceForm.value.mvnoName);
      this.deviceForm = this.fb.group({
        deviceProfileName: [this.deviceForm.value.deviceProfileName, Validators.required],
        status: [this.deviceForm.value.status, Validators.required],
        checkItem: [this.deviceForm.value.checkItem],
        description: [this.deviceForm.value.description],
        priority: [this.deviceForm.value.priority, Validators.required],
        type: [this.deviceForm.value.type, Validators.required],
        loginurl: [""],
        logouturl: [""],
        coaProfileName: [this.deviceForm.value.coaProfileName, Validators.required],
        mvnoName: [this.deviceForm.value.mvnoName],
        clientIds: [this.deviceForm.value.clientIds]
      });
    } else {
      this.deviceForm = this.fb.group({
        deviceProfileName: [this.deviceForm.value.deviceProfileName, Validators.required],
        status: [this.deviceForm.value.status, Validators.required],
        checkItem: [this.deviceForm.value.checkItem],
        description: [this.deviceForm.value.description],
        priority: [this.deviceForm.value.priority, Validators.required],
        type: [this.deviceForm.value.type, Validators.required],
        loginurl: [""],
        logouturl: [""],
        coaProfileName: [""],
        mvnoName: [this.deviceForm.value.mvnoName],
        clientIds: [this.deviceForm.value.clientIds]
      });
    }
  }

  async getDeviceDetail(deviceId) {
    this.deviceService.getById(deviceId).subscribe(
      (response: any) => {
        this.deviceDetail = response.device;
        if (this.deviceDetail.type == "HTTP") {
          this.isHttpType = true;
        } else {
          this.isHttpType = false;
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

  async findCoaProfiles() {
    this.deviceService.getCoaProfiles().subscribe(
      (response: any) => {
        this.coaProfileData = response;
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
      return false;
    }
    return true;
  }
  getFilteredCOADMProfile(mvnoId) {
    let checkMvno = mvnoId;
    this.filteredCoADMList = [];
    let allCoaProfileList = this.coaProfileData.coaProfileList
      ? this.coaProfileData.coaProfileList
      : [];
    if (checkMvno == 1) {
      this.filteredCoADMList = allCoaProfileList;
    } else {
      this.filteredCoADMList = allCoaProfileList.filter(
        element => element.mvnoId == checkMvno || element.mvnoId == 1
      );
    }
  }

  canExit() {
    if (!this.deviceForm.dirty) return true;
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

  getRadiusClientList() {
    this.radiusClientService.findAllClientList().subscribe(
      (response: any) => {
        this.clientList = [];
        this.clientListMaster = [];
        this.clientList = response.clientList;
        this.clientListMaster = [...response.clientList];
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
