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

@Component({
  selector: "app-ip-management",
  templateUrl: "./ip-management.component.html",
  styleUrls: ["./ip-management.component.css"]
})
export class IpManagementComponent implements OnInit {
  ipForm: FormGroup;
  listView: boolean = true;
  createView: boolean = false;
  detailView: boolean = false;
  submitted: boolean = false;
  isIpEdit: boolean = false;
  charecter150 = "^.{0,150}$";
  createIpData: any;
  ipListData: any;
  currentPageIpListdata = 1;
  ipListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  ipListdatatotalRecords: String;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  viewIpData: any = {
    status: ""
  };
  PoolType = [
    { label: "Public", value: "Public" },
    { label: "Private", value: "Private" }
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

  AclClassConstants;
  AclConstants;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  public loginService: LoginService;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ipManagementService: IpManagementService,
    private commondropdownService: CommondropdownService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(NETWORKS.IP_CREATE);
    this.deleteAccess = loginService.hasPermission(NETWORKS.IP_DELETE);
    this.editAccess = loginService.hasPermission(NETWORKS.IP_EDIT);
    this.loginService = loginService;
    this.isIpEdit = !this.createAccess && this.editAccess ? true : false;
  }

  ngOnInit(): void {
    this.ipForm = this.fb.group({
      broadcastIp: ["", Validators.required],
      defaultPoolFlag: ["", Validators.required],
      displayName: ["", Validators.required],
      remark: ["", [Validators.required, Validators.pattern(this.charecter150)]],
      firstHost: ["", Validators.required],
      ipRange: ["", Validators.required],
      isStaticIpPool: ["", Validators.required],
      lastHost: ["", Validators.required],
      netMask: ["", Validators.required],
      networkIp: ["", Validators.required],
      poolCategory: ["", Validators.required],
      poolName: ["", Validators.required],
      poolType: ["", Validators.required],
      status: ["", Validators.required],
      totalHost: ["", Validators.required]
    });

    this.getIpDataList("");
  }

  createIpView() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.submitted = false;
    this.isIpEdit = false;
    this.ipForm.controls.poolName.enable();
    this.ipForm.reset();
  }

  listIpView() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
  }

  getIpDataList(list) {
    let size;
    let page = this.currentPageIpListdata;
    if (list) {
      size = list;
      this.ipListdataitemsPerPage = list;
    } else {
      size = this.ipListdataitemsPerPage;
    }

    let ipdata = {
      page: page,
      pageSize: size
    };
    const url = "/ippool?mvnoId=" + localStorage.getItem("mvnoId");
    this.ipManagementService.postMethod(url, ipdata).subscribe(
      (response: any) => {
        this.ipListData = response.dataList;
        this.ipListdatatotalRecords = response.totalRecords;
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

  async IpAllDetails(id) {
    await this.getIpbyId(id);
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
    this.ipForm.controls.poolName.disable();
  }

  async getIpbyId(id) {
    const url = "/ippool/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    await this.ipManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.viewIpData = response.data;
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
        message: "Do you want to delete this Ip?",
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

  deleteIp(id) {
    const url = "/ippool/delete";
    this.viewIpData.poolId = id;
    this.ipManagementService.postMethod(url, this.viewIpData).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.commondropdownService.clearCacheCMS("/ippool/all");
          this.getIpDataList("");
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageIpListdata > 1) {
      this.currentPageIpListdata = 1;
    }
    this.getIpDataList(this.showItemPerPage);
  }

  pageChangedIpList(pageNumber) {
    this.currentPageIpListdata = pageNumber;
    this.getIpDataList("");
  }

  addEditIp(id) {
    this.submitted = true;
    if (this.ipForm.valid) {
      if (id) {
        this.createIpData = this.ipForm.getRawValue();
        this.createIpData.poolId = id;
        const url = "/ippool/updateIPPool";
        this.ipManagementService.postMethod(url, this.createIpData).subscribe(
          (response: any) => {
            if (response.responseCode == 200) {
              this.ipForm.reset();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              this.ipForm.reset();
              this.listView = true;
              this.createView = false;
              this.isIpEdit = false;
              this.commondropdownService.clearCacheCMS("/ippool/all");
              this.getIpDataList("");
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
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
      } else {
        this.createIpData = this.ipForm.value;
        const url = "/ippool/saveIPPool";
        this.ipManagementService.postMethod(url, this.createIpData).subscribe(
          (response: any) => {
            if (response.responseCode == 200) {
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
              this.commondropdownService.clearCacheCMS("/ippool/all");
              this.getIpDataList("");
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
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
}
