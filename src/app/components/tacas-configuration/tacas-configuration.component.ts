import { Component, OnInit } from "@angular/core";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { NgxSpinnerService } from "ngx-spinner";
import { TacacsDeviceGroupService } from "src/app/service/tacacs-device-group.service";
import { LoginService } from "src/app/service/login.service";
import { TACACS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-tacas-configuration",
  templateUrl: "./tacas-configuration.component.html",
  styleUrls: ["./tacas-configuration.component.css"]
})
export class TacasConfigurationComponent implements OnInit {
  title = "Tacacs";
  search: any;
  customerFormGroup: FormGroup;
  showItemPerPage: any;
  listeningPortStatus: string;
  currentPageCustomer = 1;
  customerList: any;
  customertotalRecords: any;
  customeritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  settingData: any;
  DeamonFormGroup: FormGroup;
  editing = false;
  status: string;
  startAccess: boolean = false;
  stopAccess: boolean = false;
  editAccess: boolean = false;

  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    loginService: LoginService,
    private TacacsConfigurationService: TacacsDeviceGroupService
  ) {
    this.startAccess = loginService.hasPermission(TACACS.TACACS_CONFIG_START);
    this.stopAccess = loginService.hasPermission(TACACS.TACACS_CONFIG_STOP);
    this.editAccess = loginService.hasPermission(TACACS.TACACS_CONFIG_EDIT);
    this.listeningPortStatus = "Active";
  }

  ngOnInit(): void {
    this.customerFormGroup = this.fb.group({
      id: [""],
      key: [""],
      label: ["", Validators.required],
      value: ["", Validators.required]
    });
    this.getCustomerListData("");
  }

  canExit() {
    if (!this.customerFormGroup.dirty) return true;
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
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageCustomer > 1) {
      this.currentPageCustomer = 1;
    }

    this.getCustomerListData(this.showItemPerPage);
  }

  pageChangedCasList(pageNumber) {
    this.currentPageCustomer = pageNumber;
    this.getCustomerListData("");
  }
  getCustomerListData(list) {
    const url = "/global-setting/get-global-settings";
    let size;
    let pageList = this.currentPageCustomer - 1;
    if (list) {
      size = list;
      this.customeritemsPerPage = list;
    } else {
      size = this.customeritemsPerPage;
    }

    let plandata = {
      page: pageList,
      pageSize: size
    };

    this.TacacsConfigurationService.getMethod(url, { params: plandata }).subscribe(
      (response: any) => {
        this.customerList = response.data.globalSetting.content;
        this.customertotalRecords = response.data.globalSetting.totalElements;
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
  onUpdate() {
    const url = "/global-setting/update-global-settings";
    this.edit();
    this.TacacsConfigurationService.updateMethod(url, this.customerList).subscribe(
      (res: any) => {
        this.getCustomerListData("");

        this.customerFormGroup.reset();
        this.messageService.add({
          severity: "success",
          summary: "success",
          detail: res.message,
          icon: "far fa-check-circle"
        });
      },
      error => {
        if (error.error.message) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.message,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Service is Down",
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  edit() {
    if (this.editing == true) {
      this.editing = false;
    } else this.editing = true;
  }

  onStartListeningPort() {
    const url = "/tacacs-daemon/start";
    this.listeningPortStatus = "Loading...";
    this.TacacsConfigurationService.postMethodDeamon(url, {}).subscribe(
      response => {
        this.listeningPortStatus = response ? "Active" : undefined;
        this.messageService.add({
          severity: "success",
          summary: "Tacacs server start Successfully",
          icon: "far fa-check-circle"
        });
      },
      error => {
        this.listeningPortStatus = "Error While Starting the Server";
      }
    );
  }

  onStopListeningPort() {
    const url = "/tacacs-daemon/stop";
    this.listeningPortStatus = "Loading...";
    this.TacacsConfigurationService.postMethodDeamon(url, {}).subscribe(
      response => {
        this.listeningPortStatus = response ? "Inactive" : undefined;
        this.messageService.add({
          severity: "success",
          summary: "Tacacs server stop Successfully",
          icon: "far fa-check-circle"
        });
      },
      error => {
        this.listeningPortStatus = "Error While Stopping the Server";
      }
    );
  }
}
