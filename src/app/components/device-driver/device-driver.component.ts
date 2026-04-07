import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { IDBMappingMaster } from "src/app/components/model/db-mapping-master";
import { DictionaryService } from "src/app/service/dictionary.service";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";
import { DeviceDriverService } from "src/app/service/device-driver.service";
import { DeviceDriver } from "../model/device-driver";

@Component({
  selector: "app-device-driver",
  templateUrl: "./device-driver.component.html",
  styleUrls: ["./device-driver.component.css"]
})
export class DeviceDriverComponent implements OnInit {
  changeStatusData: any = [];
  deviceDriverForm: FormGroup;
  searchForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  editDeviceDriverId: number;
  deviceDriverData: any = [];
  status = [{ label: "Active" }, { label: "Inactive" }];
  //Used and required for pagination
  totalRecords: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  createDeviceDriverData: DeviceDriver;
  editDeviceDriverData: DeviceDriver;
  mappingMasterData: IDBMappingMaster;
  editFormValues: any;
  editAttributeValues: any;
  update: boolean = true;
  editMode: boolean = false;
  dictionaryAttributeData: any = [];
  mappingMasterId: number;
  mvnoData: any;
  loggedInUser: any;
  mvnoId: any;
  filtereDictionaryAttributeList: Array<any> = [];
  accessData: any = JSON.parse(localStorage.getItem("accessData"));

  @ViewChild("dbMappingName") usernameRef: ElementRef;

  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  createAccess: any;
  editAccess: any;
  deleteAccess: any;
  userId: string;
  superAdminId: string;

  constructor(
    private deviceDriverService: DeviceDriverService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DRIVER_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DRIVER_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DRIVER_EDIT);
    this.findAllDeviceDrivers("");
  }

  ngOnInit(): void {
    this.deviceDriverForm = this.fb.group({
      name: ["", Validators.required],
      address: ["", Validators.required],
      userName: ["", Validators.required],
      password: ["", Validators.required],
      userDn: ["", Validators.required],
      passwordAttribute: ["", Validators.required],
      userNameAttribute: ["", Validators.required]
    });
    this.searchForm = this.fb.group({
      name: [null]
    });

    this.mvnoData = JSON.parse(localStorage.getItem("mvnoData"));
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.mvnoId = localStorage.getItem("mvnoId");
    this.userId = localStorage.getItem("userId");
    this.superAdminId = RadiusConstants.SUPERADMINID;
  }

  async searchByName() {
    if (!this.searchkey || this.searchkey !== this.searchForm.value.name) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchForm.value.name;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }
    this.searchSubmitted = true;

    if (this.searchForm.value.name != null || this.searchForm.value.type != null) {
      // this.currentPage = 1;

      let name = this.searchForm.value.name.trim() ? this.searchForm.value.name.trim() : "";
      this.deviceDriverData = [];
      let requestData = {
        name: name
      };
      this.deviceDriverService.getDeviceDriverByName(requestData).subscribe(
        (response: any) => {
          if (response.deviceList.length > 0) {
            this.deviceDriverData = response.deviceList;
            //  this.totalRecords = response.dbMapingMasterList.totalRecords;
          } else {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: "No records found",
              icon: "far fa-times-circle"
            });
          }
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
  clearSearchForm() {
    this.editMode = false;
    this.searchSubmitted = false;
    this.searchForm.reset();
    this.currentPage = 1;
    this.deviceDriverForm.reset();
    this.findAllDeviceDrivers("");
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllDeviceDrivers(this.showItemPerPage);
    } else {
      this.searchByName();
    }
  }

  async findAllDeviceDrivers(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.deviceDriverData = [];
    this.deviceDriverService.findAllDeviceDrivers(page, size).subscribe(
      (response: any) => {
        this.deviceDriverData = response.deviceList;
        //this.totalRecords = response.dbMapingMasterList.totalRecords;
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

  async editDeviceDriverById(dbMappingMasterId, index) {
    this.editMode = true;

    this.editDeviceDriverId = dbMappingMasterId;
    this.deviceDriverService.findDeviceDriverById(dbMappingMasterId).subscribe(
      (response: any) => {
        this.editDeviceDriverData = response.deviceDriver;
        this.deviceDriverForm.patchValue(this.editDeviceDriverData);
        this.editFormValues = this.deviceDriverForm.value;
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
    // this.spinner.show()
  }

  async updateDeviceDriver() {
    if (this.editDeviceDriverData) {
      this.editDeviceDriverData.name = this.deviceDriverForm.value.name;
      this.editDeviceDriverData.address = this.deviceDriverForm.value.address;
      this.editDeviceDriverData.userName = this.deviceDriverForm.value.userName;
      this.editDeviceDriverData.password = this.deviceDriverForm.value.password;
      this.editDeviceDriverData.userDn = this.deviceDriverForm.value.userDn;
      this.editDeviceDriverData.userNameAttribute = this.deviceDriverForm.value.userNameAttribute;
      this.editDeviceDriverData.passwordAttribute = this.deviceDriverForm.value.passwordAttribute;
    }
    this.deviceDriverService.updateDeviceDriver(this.editDeviceDriverData).subscribe(
      (response: any) => {
        this.editMode = false;
        this.submitted = false;
        if (!this.searchkey) {
          this.findAllDeviceDrivers("");
        } else {
          this.searchByName();
        }
        this.deviceDriverForm.reset();
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

  async addDeviceDriver() {
    this.submitted = true;
    if (this.deviceDriverForm.valid) {
      if (this.editMode) {
        this.updateDeviceDriver();
        this.editMode = false;
        this.submitted = false;
        this.deviceDriverForm.reset();
      } else {
        this.createDeviceDriverData = this.deviceDriverForm.value;
        this.deviceDriverService.addNewDeviceDriver(this.createDeviceDriverData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.findAllDeviceDrivers("");
            this.deviceDriverForm.reset();
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

  deleteConfirm(dbMapingMasterId, index) {
    // if (this.validateUserToPerformOperations(selectedMvnoId)) {
    this.confirmationService.confirm({
      message: "Do you want to delete this Device Driver?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteDeviceDriverById(dbMapingMasterId, index);
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
      }
    });
    // }
  }
  async deleteDeviceDriverById(dbMapingMasterId, index) {
    this.deviceDriverService.deleteDeviceDriverById(dbMapingMasterId).subscribe(
      (response: any) => {
        if (this.currentPage != 1 && index == 0 && this.deviceDriverData.length == 1) {
          this.currentPage = this.currentPage - 1;
        }
        if (!this.searchkey) {
          this.findAllDeviceDrivers("");
        } else {
          this.searchByName();
        }
        this.deviceDriverForm.reset();
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

  pageChanged(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.findAllDeviceDrivers("");
    } else {
      this.searchByName();
    }
  }

  validateUserToPerformOperations(selectedMvnoId) {
    let loggedInUserMvnoId = localStorage.getItem("mvnoId");
    let userId = localStorage.getItem("userId");
    if (userId != RadiusConstants.SUPERADMINID && selectedMvnoId != loggedInUserMvnoId) {
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

  canExit() {
    if (!this.deviceDriverForm.dirty) return true;
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

  testDeviceDriverConnection() {
    this.submitted = true;
    if (this.deviceDriverForm.valid) {
      this.createDeviceDriverData = this.deviceDriverForm.value;
      this.deviceDriverService.testADConnection(this.createDeviceDriverData).subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.msg,
              icon: "far fa-check-circle"
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }
}
