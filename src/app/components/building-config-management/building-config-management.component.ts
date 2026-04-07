import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { CountryManagementService } from "src/app/service/country-management.service";
import { Regex } from "src/app/constants/regex";
import { CountryManagement } from "src/app/components/model/country-management";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { BuildingConfig } from "src/app/RadiusUtils/RadiusConstants";
import { IDeactivateGuard } from "src/app/service/deactivate.service";
import { Observable, Observer } from "rxjs";
import { resolve } from "dns";
import { ObserversModule } from "@angular/cdk/observers";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { MASTERS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
import { BuildingConfigManagementService } from "src/app/service/building-config-management.service";

@Component({
  selector: "app-building-config-management",
  templateUrl: "./building-config-management.component.html",
  styleUrls: ["./building-config-management.component.css"]
})
export class BuidingConfigManagement implements OnInit, IDeactivateGuard {
  title = BuildingConfig;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  branchData: any = [];
  buildingconfFormGroup: FormGroup;
  submitted: boolean = false;
  countryData: CountryManagement;
  countryListData: any;
  isCountryEdit: boolean = false;
  viewCountryListData: any;
  currentPageCountrySlab = 1;
  countryitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  countrytotalRecords: any;
  searchCountryName: any = "";
  searchData: any;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  public loginService: LoginService;
  bankTypeData: any;
  dunningData: any;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private countryManagementService: CountryManagementService,
    private commondropdownService: CommondropdownService,
    loginService: LoginService,
    private buidingConfigManagement: BuildingConfigManagementService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(MASTERS.BUILDING_CONFIG_CREATE);
  }

  ngOnInit(): void {
    this.buildingconfFormGroup = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      mappingFrom: ["", Validators.required]
    });

    this.searchData = {
      filters: [
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
    this.getbuildingRefrenceListData();
    this.getmappingFrom();
  }

  canExit() {
    if (!this.buildingconfFormGroup.dirty) return true;
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
  addEditCountry() {
    this.submitted = true;
    if (this.buildingconfFormGroup.valid) {
      {
        const url = "/buildingRefrence/save";
        this.branchData = this.buildingconfFormGroup.value;
        this.buidingConfigManagement.postMethod(url, this.branchData).subscribe(
          (response: any) => {
            if (
              response.responseCode == 406 ||
              response.responseCode == 405 ||
              response.responseCode == 417
            ) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.submitted = false;
              //   this.buildingconfFormGroup.controls.status.setValue("");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle"
              });
            }
            this.clearSearchCountry();
            this.buildingconfFormGroup.reset();
            this.commondropdownService.clearCache("/buildingRefrence/all");
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
      }
    }
  }

  getbuildingRefrenceListData() {
    const url = "/buildingRefrence/all";
    this.searchkey = "";
    this.buidingConfigManagement.getMethod(url).subscribe(
      (response: any) => {
        this.countryListData = response.dataList || [];
        // this.searchkey = "";
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
  }

  clearSearchCountry() {
    this.searchCountryName = "";
    this.searchkey = "";
    this.getbuildingRefrenceListData();
    this.submitted = false;
    this.isCountryEdit = false;
    this.buildingconfFormGroup.reset();
    // this.buildingconfFormGroup.controls.name.setValue("");
  }

  getmappingFrom() {
    const url = "/commonList/buildingRefrence";
    this.buidingConfigManagement.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.dunningData = response.dataList;

        this.searchkey = "";
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
  }
}
