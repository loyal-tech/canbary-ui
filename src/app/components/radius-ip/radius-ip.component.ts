import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { IpManagementService } from "src/app/service/ip-management.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Regex } from "src/app/constants/regex";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { NETWORKS } from "src/app/constants/aclConstants";
import { RadiusIpService } from "src/app/service/radius-ip.service";
import { RADIUS_CONSTANTS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-radius-ip",
  templateUrl: "./radius-ip.component.html",
  styleUrls: ["./radius-ip.component.css"]
})
export class RadiusIpManagementComponent implements OnInit {
  ipForm: FormGroup;
  searchForm: FormGroup;
  listView: boolean = true;
  createView: boolean = false;
  detailView: boolean = false;
  submitted: boolean = false;
  isIpEdit: boolean = false;
  charecter150 = "^.{0,150}$";
  createIpData: any;
  ipListData: any;
  currentPageIpListdata = 1;
  ipListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  ipListdatatotalRecords: number;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  viewIpData: any = {
    status: ""
  };

  UsageCategory = [
    { label: "RADIUS", value: "RADIUS" },
    { label: "INVENTORY", value: "INVENTORY" }
  ];

  IpPool = [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ];
  defaultPoolFlagValue = [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ];
  statusOptions = RadiusConstants.status;
  searchSubmitted: boolean = false;
  searchkey: string;
  ipData: any[];
  AclClassConstants;
  AclConstants;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  public loginService: LoginService;

  ipPoolDataList: any;
  ippoollist: any;
  selectedPoolId: any;
  clientData: any[];
  clientDataList: any[];
  ipDataList: any[];
  ipAddress: string;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ipManagementService: IpManagementService,
    private radiusipManagementService: RadiusIpService,

    private commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_IP_MANAGEMENT_CREATE);
    this.editAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_IP_MANAGEMENT_EDIT);
    this.deleteAccess = loginService.hasPermission(RADIUS_CONSTANTS.RADIUS_IP_MANAGEMENT_DELETE);
    this.loginService = loginService;
    this.isIpEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.ipForm = this.fb.group({
      broadcastIp: [""],
      remark: ["", [Validators.required, Validators.pattern(this.charecter150)]],
      firstHost: [""],
      ipRange: ["", Validators.required],
      lastHost: [""],
      netMask: [""],
      networkIp: [""],
      poolName: ["", Validators.required],
      usageCategory: ["", Validators.required],
      status: ["", Validators.required],
      totalHost: [""],
      poolId: [""]
    });
    this.searchForm = this.fb.group({
      ipAddress: ["", Validators.required]
    });
    this.getIpDataList(this.ipListdataitemsPerPage);
  }

  createIpView() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.submitted = false;
    this.isIpEdit = false;
    this.ipForm.reset();
  }

  listIpView() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.currentPageIpListdata = 1;
    this.getIpDataList(this.ipListdataitemsPerPage);
  }

  getIpDataList(list: number) {
    let size: number;
    let page = this.currentPageIpListdata;

    if (list) {
      size = list;
      this.ipListdataitemsPerPage = list;
    } else {
      size = this.ipListdataitemsPerPage;
    }

    const mvnoId = localStorage.getItem("mvnoId");
    const url = `/ippool/search?mvnoId=${mvnoId}&page=${page}&size=${size}`;

    this.radiusipManagementService.getMethod(url, this.ipData).subscribe(
      (response: any) => {
        this.ipListData = response.ippoollist.data;
        this.ipListdatatotalRecords = response.ippoollist.totalRecords;
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

  getIpDataListForSearch(id, list) {
    let size;
    this.searchkey = "";
    let page = this.currentPageIpListdata;
    if (list) {
      size = list;
      this.ipListdataitemsPerPage = list;
    } else {
      size = this.ipListdataitemsPerPage;
    }
    const mvnoId = localStorage.getItem("mvnoId");
    const url = `/ippool/allocation/search?mvnoId=${mvnoId}&page=${page}&size=${size}&poolId=${id}`;
    this.radiusipManagementService.getMethod(url, this.ipData).subscribe(
      (response: any) => {
        this.ipPoolDataList = response.ippoollist.data;
        this.ipListdatatotalRecords = response.ippoollist.totalRecords;
        this.selectedPoolId = response.poolId;
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
  pageChanged(pageNumber) {
    const id = this.viewIpData.poolId;
    this.currentPageIpListdata = pageNumber;
    this.getIpDataListForSearch(id, this.showItemPerPage);

    if (!this.searchkey) {
    } else {
      this.searchIPByIpAddress();
    }
  }

  TotalItemPerPageIp(event) {
    const id = this.viewIpData.poolId;
    this.showItemPerPage = Number(event.value);
    if (this.currentPageIpListdata > 1) {
      this.currentPageIpListdata = 1;
    }
    if (this.searchkey == null || !this.searchkey) {
      this.getIpDataListForSearch(id, this.showItemPerPage);
    } else {
      this.searchIPByIpAddress();
    }
  }
  clearSearchForm() {
    const id = this.viewIpData.poolId;
    this.searchSubmitted = false;
    this.ipForm.reset();
    this.currentPageIpListdata = 1;
    this.getIpDataListForSearch(id, "");
    this.searchkey = null;
  }
  async IpAllDetails(id) {
    this.ipListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    await this.getIpbyId(id);
    this.currentPageIpListdata = 1;
    this.getIpDataListForSearch(id, "");
    this.detailView = true;
    this.listView = false;
    this.createView = false;
  }

  async editIp(id) {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.ipForm.reset();
    this.isIpEdit = true;
    await this.getIpbyId(id);
  }

  async getIpbyId(id) {
    const url = `/ippool/findIpPoolById?ipPoolId=${id}&mvnoId=${localStorage.getItem("mvnoId")}`;
    await this.radiusipManagementService.findIpPoolById(url).subscribe(
      (response: any) => {
        this.viewIpData = response.ippool;
        this.ipForm.patchValue(this.viewIpData);
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

  deleteConfirmonIp(id) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this IPPoolConfiguration?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.getIpbyId(id);
          this.deleteIp(id);
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

  deleteIp(id: string) {
    const url = `/ippool/delete?mvnoId=${localStorage.getItem("mvnoId")}`;
    this.viewIpData.poolId = id;

    this.radiusipManagementService.postMethod(url, this.viewIpData).subscribe(
      (response: any) => {
        if (response.status === 400) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.commondropdownService.clearCacheCMS("/ippool/all");
          this.getIpDataList(this.ipListdataitemsPerPage);
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageIpListdata > 1) {
      this.currentPageIpListdata = 1;
    }
    this.getIpDataList(this.showItemPerPage);
  }

  pageChangedIpList(pageNumber) {
    this.currentPageIpListdata = pageNumber;
    this.getIpDataList(this.ipListdataitemsPerPage);
  }

  addEditIp(id: number) {
    this.submitted = true;
    if (this.ipForm.valid) {
      this.createIpData = this.ipForm.getRawValue();
      this.createIpData.poolId = id;

      const url = id
        ? "/ippool/updateIPPool?mvnoId=" + localStorage.getItem("mvnoId")
        : "/ippool/saveIPPool?mvnoId=" + localStorage.getItem("mvnoId");

      if (!id) {
        this.createIpData.isDelete = true;
      } else {
        this.createIpData.isDelete = true;
      }

      this.radiusipManagementService.postMethod(url, this.createIpData).subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.ipForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });

            this.submitted = false;
            this.listView = true;
            this.createView = false;
            this.isIpEdit = false;

            this.commondropdownService.clearCacheCMS("/ippool/all");
            this.getIpDataList(this.ipListdataitemsPerPage);
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
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  canExit() {
    if (!this.ipForm.dirty) return true;
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

  async searchIPByIpAddress() {
    this.searchSubmitted = true;

    if (this.searchForm.value.ipAddress == null) {
      this.searchForm.value.ipAddress = "";
    }

    if (this.searchForm.valid) {
      if (!this.searchkey || this.searchkey !== this.searchForm.value.ipAddress.trim()) {
        this.currentPageIpListdata = 1;
      }

      if (this.showItemPerPage) {
        this.ipListdataitemsPerPage = this.showItemPerPage;
      }

      const serachIpAddress = this.searchForm.value.ipAddress.trim()
        ? this.searchForm.value.ipAddress.trim()
        : "";

      this.searchkey = serachIpAddress;
      this.ipPoolDataList = [];

      this.radiusipManagementService
        .searchByIp(
          this.viewIpData.poolId,
          serachIpAddress,
          this.ipListdataitemsPerPage,
          this.currentPageIpListdata
        )
        .subscribe(
          (response: any) => {
            this.ipPoolDataList.push(response.ippoollist);
          },
          (error: any) => {
            if (error.error.status == 404) {
              this.ipListdatatotalRecords = 0;
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.ipListdatatotalRecords = 0;
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
}
