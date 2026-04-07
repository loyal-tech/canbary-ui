import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { StateManagementService } from "src/app/service/state-management.service";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { MASTERS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-business-vertical",
  templateUrl: "./business-vertical.component.html",
  styleUrls: ["./business-vertical.component.css"],
})
export class BusinessVerticalComponent implements OnInit {
  busVerticalForm: FormGroup;
  // countryFormArray: FormArray;
  submitted: boolean = false;
  busVerticalListData: any = [];
  viewbusVerticalListData: any = [];
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: any;
  isEditData: boolean = false;
  searchData: any;
  searchName: any = "";
  AclClassConstants;
  AclConstants;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey: string;
  statusOptions = RadiusConstants.status;
  public loginService: LoginService;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private stateManagementService: StateManagementService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(MASTERS.BUSINESS_VERTICALS_CREATE);
    this.deleteAccess = loginService.hasPermission(MASTERS.BUSINESS_VERTICALS_DELETE);
    this.editAccess = loginService.hasPermission(MASTERS.BUSINESS_VERTICALS_DELETE);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.busVerticalForm = this.fb.group({
      vname: ["", Validators.required],
      status: ["", Validators.required],
      region_id: [""],
      id: [""],
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
    };

    this.getbusVerticalList("");
    this.commondropdownService.getRegionData();
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getbusVerticalList(this.showItemPerPage);
    } else {
      this.searchbusVertical();
    }
  }

  getbusVerticalList(list) {
    let size;
    this.searchkey = "";
    let List = this.currentPage;
    if (list) {
      size = list;
      this.itemsPerPage = list;
    } else {
      size = this.itemsPerPage;
    }
    const url = "/businessverticals";
    let plandata = {
      page: List,
      pageSize: size,
    };
    this.stateManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.busVerticalListData = response.dataList;
        this.totalRecords = response.totalRecords;

        // console.log("this.busVerticalListData", this.busVerticalListData);
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

  addEditBVertical(id) {
    this.submitted = true;
    if (this.busVerticalForm.valid) {
      if (id) {
        setTimeout(() => {
          const url = "/businessverticals/update";

          if (this.busVerticalForm.value.region_id.length == 0) {
            this.busVerticalForm.value.region_id = null;
          }
          let busVerticalListData = this.busVerticalForm.value;

          this.stateManagementService.postMethod(url, busVerticalListData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.isEditData = false;
              this.busVerticalForm.reset();
              this.busVerticalForm.controls.region_id.setValue("");
              this.stateManagementService.clearCache("/businessverticals/all");
              if (!this.searchkey) {
                this.getbusVerticalList("");
              } else {
                this.searchbusVertical();
              }
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });
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
        }, 3000);
      } else {
        setTimeout(() => {
          const url = "/businessverticals/save";

          if (this.busVerticalForm.value.region_id.length == 0) {
            this.busVerticalForm.value.region_id = null;
          }
          let busVerticalListData = this.busVerticalForm.value;

          this.stateManagementService.postMethod(url, busVerticalListData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.busVerticalForm.reset();
              this.commondropdownService.clearCache("/businessverticals/all");
              if (!this.searchkey) {
                this.getbusVerticalList("");
              } else {
                this.searchbusVertical();
              }
              if (response.responseCode !== 200) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
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
              this.busVerticalForm.controls.region_id.setValue("");
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
        }, 3000);
      }
    }
  }

  editBVertical(id) {
    if (id) {
      const url = "/businessverticals/" + id;
      this.stateManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isEditData = true;
          this.viewbusVerticalListData = response.data;
          this.busVerticalForm.patchValue(this.viewbusVerticalListData);
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

  searchbusVertical() {
    if (!this.searchkey || this.searchkey !== this.searchName) {
      this.currentPage = 1;
    }
    this.searchkey = this.searchName;
    if (this.showItemPerPage) {
      this.itemsPerPage = this.showItemPerPage;
    }

    this.searchData.filter[0].filterValue = this.searchName.trim();

    const url =
      "/businessverticals/search?page=" +
      this.currentPage +
      "&pageSize=" +
      this.itemsPerPage +
      "&sortBy=id&sortOrder=0";
    // console.log("this.searchData", this.searchData)
    this.stateManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });

          this.busVerticalListData = response.dataList;
          this.totalRecords = response.totalRecords;
        } else {
          this.busVerticalListData = response.dataList;
          this.totalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.totalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle",
          });
          this.busVerticalListData = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle",
          });
        }
      }
    );
  }

  clearData() {
    this.searchName = "";
    this.getbusVerticalList("");
    this.busVerticalForm.reset();
    this.submitted = false;
    this.isEditData = false;
    this.busVerticalForm.controls.region_id.setValue("");
  }

  deleteConfirmon(rdata: any) {
    if (rdata) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Business Vertical?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteBusVertical(rdata);
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

  deleteBusVertical(rdata) {
    let data = rdata;

    const url = "/businessverticals/delete";
    this.stateManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (
          response.responseCode == 405 ||
          response.responseCode == 406 ||
          response.responseCode == 417
        ) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        } else {
          if (this.currentPage != 1 && this.busVerticalListData.length == 1) {
            this.currentPage = this.currentPage - 1;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
          if (!this.searchkey) {
            this.getbusVerticalList("");
          } else {
            this.searchbusVertical();
          }
          this.searchName = "";
          this.busVerticalForm.reset();
          this.submitted = false;
          this.isEditData = false;
          this.busVerticalForm.controls.region_id.setValue("");
        }
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

  pageChangedList(pageNumber) {
    this.currentPage = pageNumber;
    if (!this.searchkey) {
      this.getbusVerticalList("");
    } else {
      this.searchbusVertical();
    }
  }
}
