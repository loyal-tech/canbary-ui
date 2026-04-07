import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { DBMappingMasterService } from "src/app/service/db-mapping-master.service";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { IDBMappingMaster } from "src/app/components/model/db-mapping-master";
import { DictionaryService } from "src/app/service/dictionary.service";
import { RadiusUtility } from "src/app/RadiusUtils/RadiusUtility";
import { element } from "protractor";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-db-mapping-master",
  templateUrl: "./db-mapping-master.component.html",
  styleUrls: ["./db-mapping-master.component.css"]
})
export class DBMappingMasterComponent implements OnInit {
  changeStatusData: any = [];
  mappingMasterForm: FormGroup;
  searchForm: FormGroup;
  submitted = false;
  searchSubmitted = false;
  editDBMappingMasterId: number;
  attribute: FormArray;
  dbMappingMasterData: any = [];
  status = [{ label: "Active" }, { label: "Inactive" }];
  //Used and required for pagination
  totalRecords: number;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;

  createDBMappingMasterData: IDBMappingMaster;
  editDBMappingMasterData: IDBMappingMaster;
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
  modalToggle: boolean = true;
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
  superAdminId = RadiusConstants.SUPERADMINID;

  constructor(
    private dbMappingMasterService: DBMappingMasterService,
    private dictionaryService: DictionaryService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private radiusUtility: RadiusUtility,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DB_MAPPING_CREATE);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DB_MAPPING_DELETE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_DB_MAPPING_EDIT);
    this.findAllDBMappingMasters("");
  }

  ngOnInit(): void {
    this.mappingMasterForm = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required],
      mvnoName: [""]
    });
    this.attribute = this.fb.array([]);
    // this.onAddAttribute();
    this.searchForm = this.fb.group({
      name: [null]
    });
    this.getAllDictionaryAttributes();

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
      this.dbMappingMasterData = [];
      this.dbMappingMasterService.getDBMasterMappingByName(name).subscribe(
        (response: any) => {
          this.dbMappingMasterData = response.dbMapingMasterList;
          //  this.totalRecords = response.dbMapingMasterList.totalRecords;
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
    this.mappingMasterForm.reset();
    this.attribute = this.fb.array([]);
    this.onAddAttribute();
    this.findAllDBMappingMasters("");
  }
  createDBMapping() {
    this.editMode = false;
    this.submitted = false;
    this.mappingMasterForm.reset();
    this.attribute = this.fb.array([]);
    this.onAddAttribute();
    this.usernameRef.nativeElement.focus();
  }
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.findAllDBMappingMasters(this.showItemPerPage);
    } else {
      this.searchByName();
    }
  }

  async findAllDBMappingMasters(list) {
    let size;
    this.searchkey = "";
    let page = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    this.dbMappingMasterData = [];
    this.dbMappingMasterService.findAllDBMappingMasters(page, size).subscribe(
      (response: any) => {
        this.dbMappingMasterData = response.dbMapingMasterList;
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

  async editDBMappingMasterById(dbMappingMasterId, selectedMvnoId, index) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.editMode = true;

      this.editDBMappingMasterId = dbMappingMasterId;
      // this.mappingMasterForm.patchValue({
      //   name: this.dbMappingMasterData[index].name,
      //   status: this.dbMappingMasterData[index].status,
      //   mvnoName: this.dbMappingMasterData[index].mvnoId,
      // })
      // this.editFormValues = this.mappingMasterForm.value
      // this.editDBMappingMasterData = this.dbMappingMasterData[index]
      // this.spinner.hide()
      this.dbMappingMasterService.findDbMappingMastersById(dbMappingMasterId).subscribe(
        (response: any) => {
          this.editDBMappingMasterData = response.dbMapingMaster;
          this.mappingMasterForm.patchValue({
            name: this.editDBMappingMasterData.name,
            status: this.editDBMappingMasterData.status,
            mvnoName: this.editDBMappingMasterData.mvnoId
          });
          this.editFormValues = this.mappingMasterForm.value;
          //
          this.attribute = this.fb.array([]);
          this.dbMappingMasterService.findDBMappingByDBMappingMasterId(dbMappingMasterId).subscribe(
            (response: any) => {
              let attributeList = response.DbMappingList;
              attributeList.forEach(element => {
                let isExist = this.filtereDictionaryAttributeList.some(
                  attr => attr.name == element.radiusName
                );
                this.attribute.push(this.createAttributesArray(element, !isExist));
              });
              this.editAttributeValues = response.DbMappingList;
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
      //
    }
  }
  dbMapingMaster = {
    mappingMasterId: 0,
    name: "",
    status: ""
  };
  async updateDbMappingMaster() {
    if (this.editDBMappingMasterData) this.editDBMappingMasterData = this.mappingMasterForm.value;
    this.editDBMappingMasterData.mappingMasterId = this.editDBMappingMasterId;
    this.dbMappingMasterService.updateDbMappingMaster(this.editDBMappingMasterData).subscribe(
      (response: any) => {
        this.editMode = false;
        this.submitted = false;
        if (!this.searchkey) {
          this.findAllDBMappingMasters("");
        } else {
          this.searchByName();
        }
        this.mappingMasterForm.reset();
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
  async updateDBMapping() {
    // if (this.validateUserToPerformOperations(this.attribute.value[0].mvnoId)) {

    this.attribute.value.forEach(element => {
      element.mappingMasterId = this.editDBMappingMasterId;
    });
    this.dbMappingMasterService
      .updateDBMapping(
        this.attribute.value,
        this.editDBMappingMasterId,
        this.mappingMasterForm.value.mvnoName
      )
      .subscribe(
        (response: any) => {
          this.editMode = false;
          this.submitted = false;
          this.mappingMasterForm.reset();
          this.attribute = this.fb.array([]);
          //   this.onAddAttribute();
          this.getDefaultAttributes();
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
    // }
  }

  async addNewDbMappingMaster() {
    this.submitted = true;
    if (this.mappingMasterForm.valid && this.attribute.valid) {
      if (this.editMode) {
        if (
          this.mappingMasterForm.value == this.editFormValues &&
          JSON.stringify(this.attribute.value) === JSON.stringify(this.editAttributeValues)
        ) {
          this.editMode = false;
          this.submitted = false;
          this.mappingMasterForm.reset();
          this.attribute = this.fb.array([]);
          //   this.onAddAttribute();
          this.getDefaultAttributes();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Profile data is same",
            icon: "far fa-check-circle"
          });
        } else if (
          this.mappingMasterForm.value != this.editFormValues &&
          JSON.stringify(this.attribute.value) === JSON.stringify(this.editAttributeValues)
        ) {
          this.updateDbMappingMaster();
        } else if (
          this.mappingMasterForm.value == this.editFormValues &&
          JSON.stringify(this.attribute.value) !== JSON.stringify(this.editAttributeValues)
        ) {
          this.updateDBMapping();
        } else {
          this.update = false;
          this.updateDbMappingMaster();
          this.updateDBMapping();
          this.editMode = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "DB Mapping Master and Mapping Attributes has been updated successfully.",
            icon: "far fa-check-circle"
          });
        }
      } else {
        this.createDBMappingMasterData = this.mappingMasterForm.value;
        this.createDBMappingMasterData.dbMappingDtoList = this.attribute.value;
        this.dbMappingMasterService.addNewDbMappingMaster(this.createDBMappingMasterData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.findAllDBMappingMasters("");
            this.mappingMasterForm.reset();
            this.attribute = this.fb.array([]);
            // this.onAddAttribute();
            this.getDefaultAttributes();
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
  deleteConfirm(dbMapingMasterId, selectedMvnoId, index) {
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.confirmationService.confirm({
        message: "Do you want to delete this DB Mapping Master?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteDBMappingMasterById(dbMapingMasterId, selectedMvnoId, index);
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
  async deleteDBMappingMasterById(dbMapingMasterId, selectedMvnoId, index) {
    this.dbMappingMasterService
      .deleteDbMappingMasterById(dbMapingMasterId, selectedMvnoId)
      .subscribe(
        (response: any) => {
          if (this.currentPage != 1 && index == 0 && this.dbMappingMasterData.length == 1) {
            this.currentPage = this.currentPage - 1;
          }
          if (!this.searchkey) {
            this.findAllDBMappingMasters("");
          } else {
            this.searchByName();
          }
          this.mappingMasterForm.reset();
          this.attribute = this.fb.array([]);
          this.onAddAttribute();
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
  deleteConfirmAttribute(attributeIndex: number, mappingId: number, selectedMvnoId) {
    this.attribute.removeAt(attributeIndex);
  }

  createAttributeFormGroup(): FormGroup {
    return this.fb.group({
      dbColumnName: ["", Validators.required],
      radiusName: ["", Validators.required],
      mappingMasterId: [""],
      mappingId: [""]
    });
  }

  async getAllDictionaryAttributes() {
    this.dictionaryService.findAllAttributes().subscribe(
      (response: any) => {
        this.dictionaryAttributeData = response;
        this.getDetailsByMvno(JSON.parse(localStorage.getItem("mvnoId")));
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
      this.findAllDBMappingMasters("");
    } else {
      this.searchByName();
    }
  }

  async changeStatusToActive(data, selectedMvnoId, event) {
    event.preventDefault();
    this.modalToggle = true;
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.dbMappingMasterService
        .changeDBMappingMasterStatus(data, RadiusConstants.ACTIVE, selectedMvnoId)
        .subscribe(
          (response: any) => {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            if (!this.searchkey) {
              this.findAllDBMappingMasters("");
            } else {
              this.searchByName();
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

  async changeStatusToInActive(mappingMasterId, selectedMvnoId, event) {
    event.preventDefault();
    this.modalToggle = true;
    if (this.validateUserToPerformOperations(selectedMvnoId)) {
      this.dbMappingMasterService
        .changeDBMappingMasterStatus(mappingMasterId, RadiusConstants.IN_ACTIVE, selectedMvnoId)
        .subscribe(
          (response: any) => {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            if (!this.searchkey) {
              this.findAllDBMappingMasters("");
            } else {
              this.searchByName();
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

  mappingMasterDetails = {
    name: "",
    status: ""
  };

  showMappingMasterDetail(mappingMasterId, mvnoId) {
    this.modalToggle = true;
    // if (this.validateUserToPerformOperations(mvnoId)) {

    this.dbMappingMasterService.findDbMappingMastersById(mappingMasterId).subscribe(
      (response: any) => {
        this.dbMappingMasterData = response;
        this.mappingMasterDetails = this.dbMappingMasterData.dbMapingMaster;
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
    // }
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

  getDetailsByMvno(event) {
    let mvnoId = event;
    let alldictionaryAttributeList = this.dictionaryAttributeData.dictionaryAttributeList
      ? this.dictionaryAttributeData.dictionaryAttributeList
      : [];
    this.filtereDictionaryAttributeList = alldictionaryAttributeList;
    this.getDefaultAttributes();
  }
  canExit() {
    if (!this.mappingMasterForm.dirty) return true;
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

  getDefaultAttributes() {
    let dbMappingMasterId = 1;
    this.dbMappingMasterService.findDBMappingByDBMappingMasterId(dbMappingMasterId).subscribe(
      (response: any) => {
        let attributeList = response.DbMappingList;
        attributeList.forEach(element => {
          let isExist = this.filtereDictionaryAttributeList.some(
            attr => attr.name == element.radiusName
          );
          this.attribute.push(this.createAttributesArray(element, !isExist));
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

  createAttributesArray(element, isDesibled) {
    return this.fb.group({
      createdOn: [element.createdOn],
      dbColumnName: [element.dbColumnName],
      lastModifiedOn: [element.lastModifiedOn],
      mappingId: [element.mappingId],
      mappingMasterId: [element.mappingMasterId],
      mvnoId: [element.mvnoId],
      radiusName: [element.radiusName],
      isDesibled: [isDesibled]
    });
  }
}
