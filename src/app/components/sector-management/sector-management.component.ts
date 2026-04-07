import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { CountryManagementService } from "src/app/service/country-management.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { COUNTRY } from "src/app/RadiusUtils/RadiusConstants";
import { IDeactivateGuard } from "src/app/service/deactivate.service";
import { Observable, Observer } from "rxjs";
import { resolve } from "dns";
//import { ObserversModule } from "@angular/cdk/observers";
import { SectorManagement } from "../model/SectorManagement";
import { SectorManagementService } from "src/app/service/sector-management.service";
import { DTVS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-sector-management",
  templateUrl: "./sector-management.component.html",
  styleUrls: ["./sector-management.component.css"]
})
export class SectorManagementComponent implements OnInit, IDeactivateGuard {
  title = "Sector";
  sectorFormGroup: FormGroup;
  submitted: boolean = false;
  sectorData: SectorManagement;
  sectorListData: any;
  isSectorEdit: boolean = false;
  viewSectorListData: any;
  currentPageSectorSlab = 1;
  sectoritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  sectortotalRecords: any;
  searchSectorName: any = "";
  searchData: any;
  AclClassConstants;
  AclConstants;

  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  createSectorAccess = false;
  editSectorAccess = false;
  deleteSectorAccess = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;

  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private countryManagementService: CountryManagementService,
    private sectorManagementService: SectorManagementService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.createAccess = loginService.hasPermission(DTVS.SECTOR_CREATE);
    this.deleteAccess = loginService.hasPermission(DTVS.SECTOR_DELETE);
    this.editAccess = loginService.hasPermission(DTVS.SECTOR_EDIT);

    // this.isSectorEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.sectorFormGroup = this.fb.group({
      sname: ["", Validators.required],
      status: ["", Validators.required],
      id: [""],
      mvnoId: [""]
    });

    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: "",
      pageSize: ""
    };
    this.getSectorListData("");
  }

  canExit() {
    if (!this.sectorFormGroup.dirty) return true;
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

  addEditSector(id) {
    this.submitted = true;
    if (this.sectorFormGroup.valid) {
      if (id) {
        const url = "/sectormaster/update?mvnoId=" + localStorage.getItem("mvnoId");
        this.sectorData = this.sectorFormGroup.value;
        this.sectorData.id = id;
        this.sectorData.isDelete = false;
        this.sectorManagementService.updateMethod(url, this.sectorData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.isSectorEdit = false;
            this.sectorFormGroup.reset();
            this.sectorFormGroup.controls.status.setValue("");
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.submitted = false;
            if (this.searchkey) {
              this.searchSector();
            } else {
              this.getSectorListData("");
            }
          },

          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
      } else {
        const url = "/sectormaster/save?mvnoId=" + localStorage.getItem("mvnoId");
        this.sectorData = this.sectorFormGroup.value;
        this.sectorData.delete = false;
        this.sectorData.isDelete = false;
        this.sectorManagementService.postMethod(url, this.sectorData).subscribe((response: any) => {
          this.submitted = false;
          this.sectorFormGroup.reset();
          this.sectorFormGroup.controls.status.setValue("");
          if (this.searchkey) {
            this.searchSector();
          } else {
            this.getSectorListData("");
          }

          if (response.responseCode !== 200) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
          }
        });
      }
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageSectorSlab > 1) {
      this.currentPageSectorSlab = 1;
    }
    if (!this.searchkey) {
      this.getSectorListData(this.showItemPerPage);
    } else {
      this.searchSector();
    }
  }

  getSectorListData(list) {
    const url = "/sectormaster?mvnoId=" + localStorage.getItem("mvnoId");
    let size;
    this.searchkey = "";
    let pageList = this.currentPageSectorSlab;
    if (list) {
      size = list;
      this.sectoritemsPerPage = list;
    } else {
      size = this.sectoritemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size
    };
    this.sectorManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.sectorListData = response.dataList;
        this.sectortotalRecords = response.totalRecords;
        // console.log( "sectortotalRecords",this.sectortotalRecords);

        this.searchkey = "";
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  editSector(sectorId) {
    if (sectorId) {
      const url = "/sectormaster/" + sectorId + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.sectorManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isSectorEdit = true;
          this.viewSectorListData = response.data;
          // console.log(" this.viewCountryListData", this.viewCountryListData);
          this.sectorFormGroup.patchValue(this.viewSectorListData);
        },
        (error: any) => {
          // console.log(error, "error")
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  searchSector() {
    if (!this.searchkey || this.searchkey !== this.searchSectorName) {
      this.currentPageSectorSlab = 1;
    }
    this.searchkey = this.searchSectorName;
    if (this.showItemPerPage) {
      this.sectoritemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchSectorName.trim();
    this.searchData.page = this.currentPageSectorSlab;
    this.searchData.pageSize = this.sectoritemsPerPage;
    const url =
      "/sectormaster/search?page=" +
      this.currentPageSectorSlab +
      "&pageSize=" +
      this.sectoritemsPerPage +
      "&sortBy=id&sortOrder=0&mvnoId=" +
      localStorage.getItem("mvnoId");
    this.sectorManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.sectorListData = response.dataList;
      },
      (error: any) => {
        this.sectortotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.sectorListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  clearSearchSector() {
    this.searchSectorName = "";
    this.searchkey = "";
    this.getSectorListData("");
    this.submitted = false;
    this.isSectorEdit = false;
    this.sectorFormGroup.reset();
    this.sectorFormGroup.controls.status.setValue("");
  }

  deleteConfirmonSector(id: number) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.title + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteSector(id);
          location.reload();
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
  deleteSector(data) {
    const url = "/sectormaster/delete";
    this.sectorManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (this.currentPageSectorSlab != 1 && this.sectorListData.length == 1) {
          this.currentPageSectorSlab = this.currentPageSectorSlab - 1;
        }
        this.clearSearchSector();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        if (this.searchkey) {
          this.searchSector();
        } else {
          this.getSectorListData("");
        }
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedCasList(pageNumber) {
    this.currentPageSectorSlab = pageNumber;
    if (this.searchkey) {
      this.searchSector();
    } else {
      this.getSectorListData("");
    }
  }
}
