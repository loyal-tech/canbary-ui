import { error } from "console";
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
//simport { SectorManagement } from "../model/SectorManagement";
import { VendorManagment } from "../model/vendorManagment";
import { VendorManagementService } from "src/app/service/vendor-management.service";
import { INVENTORYS } from "src/app/constants/aclConstants";
@Component({
  selector: "app-vendor-management",
  templateUrl: "./vendor-management.component.html",
  styleUrls: ["./vendor-management.component.css"],
})
export class VendorManagementComponent implements OnInit {
  title = "Manufacturer";
  title1 = "Manufacturer";
  vendorFormGroup: FormGroup;
  submitted: boolean = false;
  vendorData: VendorManagment;
  vendorListData: any;
  isVendorEdit: boolean = false;
  viewVendorListData: any;
  currentPageVendorSlab = 1;
  vendoritemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  vendortotalRecords: any;
  searchVendorName: any = "";
  searchData: any;
  AclClassConstants;
  AclConstants;
  editAccess: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any = 5;
  searchkey: string;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private vendorManagementService: VendorManagementService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(INVENTORYS.MANUFACTURER_CREATE);
    this.deleteAccess = loginService.hasPermission(INVENTORYS.MANUFACTURER_DELETE);
    this.editAccess = loginService.hasPermission(INVENTORYS.MANUFACTURER_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isVendorEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.vendorFormGroup = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required],
      id: [""],
      mvnoId: [""],
    });

    this.searchData = {
      filter: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and",
        },
      ],
      //   page: "",
      //   pageSize: "",
    };
    this.getVendorListData("");
  }

  canExit() {
    if (!this.vendorFormGroup.dirty) return true;
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
          },
        });
        return false;
      });
    }
  }

  /** Create and Edit Vendor */
  addEditVendor(id) {
    this.submitted = true;
    if (this.vendorFormGroup.valid) {
      if (id) {
        const url = "/vendor/update";
        this.vendorData = this.vendorFormGroup.value;
        this.vendorData.id = id;
        this.vendorData.isDelete = false;
        this.vendorManagementService.postMethod(url, this.vendorData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.isVendorEdit = false;
            this.vendorFormGroup.reset();
            this.vendorFormGroup.controls.status.setValue("");
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "info",
                summary: "info",
                detail: response.responseMessage,
                icon: "far fa-times-circle",
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
            }
            this.submitted = false;
            if (this.searchkey) {
              this.searchVendor();
            } else {
              this.getVendorListData("");
            }
          },

          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle",
            });
          }
        );
      } else {
        const url = "/vendor/save";
        this.vendorData = this.vendorFormGroup.value;
        // this.vendorData.delete = false;
        this.vendorData.isDelete = false;
        this.vendorManagementService.postMethod(url, this.vendorData).subscribe((response: any) => {
          this.submitted = false;
          this.vendorFormGroup.reset();
          this.vendorFormGroup.controls.status.setValue("");
          if (this.searchkey) {
            this.searchVendor();
          } else {
            this.getVendorListData("");
          }

          if (response.responseCode == 406) {
            this.messageService.add({
              severity: "info",
              summary: "info",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          } else if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle",
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle",
            });
          }
        });
      }
    }
  }

  /** Total Item Per Page */
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageVendorSlab > 1) {
      this.currentPageVendorSlab = 1;
    }
    if (!this.searchkey) {
      this.getVendorListData(this.showItemPerPage);
    } else {
      this.searchVendor();
    }
  }

  /** Get All Vendor with Pagination */
  getVendorListData(list) {
    const url = "/vendor/getAllVendor";
    let size;
    this.searchkey = "";
    let pageList = this.currentPageVendorSlab;
    if (list) {
      size = list;
      this.vendoritemsPerPage = list;
    } else {
      size = this.vendoritemsPerPage;
    }
    let plandata = {
      page: pageList,
      pageSize: size,
    };
    this.vendorManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.vendorListData = response.dataList;
        this.vendortotalRecords = response.totalRecords;
        // console.log( "sectortotalRecords",this.sectortotalRecords);

        this.searchkey = "";
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  /** Get Vendor by Id */
  editVendor(sectorId) {
    if (sectorId) {
      this.isVendorEdit = true;
      const url = "/vendor/getById?id=" + sectorId;
      this.vendorManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.viewVendorListData = response.data;
          this.vendorFormGroup.patchValue(this.viewVendorListData);
        },
        (error: any) => {
          // console.log(error, "error")
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  /** Serch Vendor */
  searchVendor() {
    if (!this.searchkey || this.searchkey !== this.searchVendorName) {
      this.currentPageVendorSlab = 1;
    }
    this.searchkey = this.searchVendorName;
    if (this.showItemPerPage) {
      this.vendoritemsPerPage = this.showItemPerPage;
    }
    this.searchData.filter[0].filterValue = this.searchVendorName.trim();
    const page = {
      page: this.currentPageVendorSlab,
      pageSize: this.vendoritemsPerPage,
    };
    this.vendorManagementService.searchvendor(page, this.searchData).subscribe(
      (response: any) => {
        this.vendorListData = response.dataList;

        if (response.responseCode == 200) {
          this.vendorListData = response.dataList;
          this.vendortotalRecords = response.totalRecords;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
          this.vendorListData = [];
          this.vendortotalRecords = 0;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  /** Clear */
  clearSearchVendor() {
    this.searchVendorName = "";
    this.searchkey = "";
    this.getVendorListData("");
    this.submitted = false;
    this.isVendorEdit = false;
    this.vendorFormGroup.reset();
    this.vendorFormGroup.controls.status.setValue("");
  }

  /** Delete Conformation */
  deleteConfirmonSector(id: number) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + this.title + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteSector(id);
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected",
          });
        },
      });
    }
  }
  /** Delete Vendor */
  deleteSector(data) {
    const url = "/vendor/delete/" + data.id;
    this.vendorManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
        }
        this.getVendorListData("");
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.msg,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  /** Page Change */
  pageChangedCasList(pageNumber) {
    this.currentPageVendorSlab = pageNumber;
    if (this.searchkey) {
      this.searchVendor();
    } else {
      this.getVendorListData("");
    }
  }
}
