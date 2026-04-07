import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { TacacsDeviceGroupService } from "src/app/service/tacacs-device-group.service";
import { LoginService } from "src/app/service/login.service";
import { TACACS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-tacacs-device",
  templateUrl: "./tacacs-device.component.html",
  styleUrls: ["./tacacs-device.component.css"],
})
export class TacacsDeviceComponent implements OnInit {
  title = "Tacacs";
  search: any;
  deviceFormGroup: FormGroup;
  showItemPerPage: any;
  deviceitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  submitted: boolean = false;
  deviceList: any;
  tacacsData: any;
  currentPageDevice = 1;
  devicetotalRecords: any;
  editMode: boolean;
  createView = false;
  TacacsDeviceList: any[] = [];
  listView = true;
  ipType = [{ label: "IPv4" }, { label: "IPv6" }];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;

  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private TacasDeviceGroupService: TacacsDeviceGroupService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(TACACS.TACACS_DEVICE_CREATE);
    this.deleteAccess = loginService.hasPermission(TACACS.TACACS_DEVICE_DELETE);
    this.editAccess = loginService.hasPermission(TACACS.TACACS_DEVICE_EDIT);
  }

  ngOnInit(): void {
    this.deviceFormGroup = this.fb.group({
      deviceName: ["", Validators.required],
      deviceAddress: ["", Validators.required],
      deviceIpType: ["", Validators.required],
      tacacsSharedKey: ["", Validators.required],
      timeOut: ["", Validators.required],
      tacacsDeviceGroup: this.fb.group({
        tacacsDeviceGroupName: ["", Validators.required],
        tacacsDeviceGroupDescription: [""],
        id: [""],
      }),
      submittedDate: ["", Validators.required],
      lastModifiedDate: ["", Validators.required],
      id: [""],
    });

    this.getDeviceListData("");
    this.tacacsGetDeviceGroups();
  }
  tacacsDeviceGroupName(event) {
    const selectedValue = event.value;
    const tacacsDeviceGroup = this.deviceFormGroup.get("tacacsDeviceGroup");

    if (tacacsDeviceGroup) {
      tacacsDeviceGroup.get("tacacsDeviceGroupName").setValue(selectedValue);
    }
  }

  tacacsGetDeviceGroups() {
    const url = "/tacacs-device-groups/get-devices-groups";
    let plandata = {
      page: 0,
      pageSize: 100,
    };
    this.TacasDeviceGroupService.getMethod(url, { params: plandata }).subscribe((res: any) => {
      this.TacacsDeviceList = res.data.deviceGroup.content;
    });
  }

  canExit() {
    if (!this.deviceFormGroup.dirty) return true;
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

  addEditDevice(id) {
    this.submitted = true;
    if (id) {
      const url = "/tacacs-devices/update-device/" + id;
      this.tacacsData = this.deviceFormGroup.value;
      this.TacasDeviceGroupService.updateMethod(url, this.tacacsData).subscribe(
        (response: any) => {
          this.getDeviceListData("");
          this.editMode = false;
          this.createView = false;
          this.listView = true;
          this.deviceFormGroup.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.message,
            icon: "far fa-times-circle",
          });
        }
      );
    } else {
      this.editMode = false;
      const url = "/tacacs-devices/add-device";

      this.tacacsData = this.deviceFormGroup.value;
      this.TacasDeviceGroupService.postMethod(url, this.tacacsData).subscribe(
        (response: any) => {
          this.getDeviceListData("");
          this.editMode = false;
          this.createView = false;
          this.listView = true;
          this.deviceFormGroup.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle",
          });
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.message,
            icon: "far fa-times-circle",
          });
        }
      );
    }
  }

  getIpType(event) {
    this.deviceFormGroup.controls["deviceIpType"].setValue(event.value);
  }

  getDeviceListData(list) {
    const url = "/tacacs-devices/get-devices";
    let size;
    let pageList = this.currentPageDevice - 1;
    if (list) {
      size = list;
      this.deviceitemsPerPage = list;
    } else {
      size = this.deviceitemsPerPage;
    }

    let plandata = {
      page: pageList,
      pageSize: size,
    };

    this.TacasDeviceGroupService.getMethod(url, { params: plandata }).subscribe(
      (response: any) => {
        this.deviceList = response.data.devices.content;

        this.devicetotalRecords = response.data.devices.totalElements;
      },
      (error: any) => {
        // console.log(error, "error")
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.message,
          icon: "far fa-times-circle",
        });
      }
    );
  }
  editDevice(Device) {
    this.editMode = true;
    this.createView = true;
    this.listView = false;

    this.deviceFormGroup.patchValue({
      deviceName: Device.deviceName,
      deviceAddress: Device.deviceAddress,
      deviceIpType: Device.deviceIpType,
      tacacsSharedKey: Device.tacacsSharedKey,
      timeOut: Device.timeOut,
      id: Device.id,
    });

    const tacacsDeviceGroup = this.deviceFormGroup.get("tacacsDeviceGroup");
    if (tacacsDeviceGroup) {
      tacacsDeviceGroup.patchValue({
        tacacsDeviceGroupName: Device.tacacsDeviceGroup.tacacsDeviceGroupName,
        tacacsDeviceGroupDescription: Device.tacacsDeviceGroup.tacacsDeviceGroupDescription,
        id: Device.tacacsDeviceGroup.id,
      });
    }
  }

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
  deleteSector(data) {
    const url = "/tacacs-devices/delete-device/" + data.id;
    this.TacasDeviceGroupService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageDevice != 1 && this.deviceList.length == 1) {
          this.currentPageDevice = this.currentPageDevice - 1;
        }
        this.getDeviceListData("");

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
          detail: error.error.message,
          icon: "far fa-times-circle",
        });
      }
    );
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageDevice > 1) {
      this.currentPageDevice = 1;
    }

    this.getDeviceListData(this.showItemPerPage);
  }

  pageChangedCasList(pageNumber) {
    this.currentPageDevice = pageNumber;
    this.getDeviceListData("");
  }

  createDevice() {
    this.listView = false;
    this.createView = true;
    this.editMode = false;
    this.submitted = false;
    this.deviceFormGroup.reset();
  }

  clearSearch() {
    this.listView = true;
    this.createView = false;
    this.editMode = false;
  }
}
