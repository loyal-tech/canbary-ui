import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { TacacsDeviceGroupService } from "src/app/service/tacacs-device-group.service";
import { LoginService } from "src/app/service/login.service";
import { TACACS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-tacacs-device-group",
  templateUrl: "./tacacs-device-group.component.html",
  styleUrls: ["./tacacs-device-group.component.css"],
})
export class TacacsDeviceGroupComponent implements OnInit {
  title = "Tacacs";
  search: any;
  deviceFormGroup: FormGroup;
  searchkey: string;
  showItemPerPage: any;
  deviceitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  submitted: boolean = false;
  deciceGroupList: any;
  searchData: any;
  tacacsData: any;
  editMode: boolean = false;
  currentPagedevice = 1;
  devicetotalRecords: any;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private TacasDeviceGroupService: TacacsDeviceGroupService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(TACACS.TACACS_DEVICE_GROUP_CREATE);
    this.deleteAccess = loginService.hasPermission(TACACS.TACACS_DEVICE_GROUP_DELETE);
    this.editAccess = loginService.hasPermission(TACACS.TACACS_DEVICE_GROUP_EDIT);
  }
  ngOnInit(): void {
    this.deviceFormGroup = this.fb.group({
      tacacsDeviceGroupName: ["", Validators.required],
      tacacsDeviceGroupDescription: [""],
      submittedDate: [""],
      lastModifiedDate: [""],
      id: [""],
    });

    this.getDeviceGroups("");
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

  onSubmit(id) {
    this.submitted = true;
    if (id) {
      const url = "/tacacs-device-groups/update-devices-group/" + id;
      this.tacacsData = this.deviceFormGroup.value;
      this.TacasDeviceGroupService.updateMethod(url, this.tacacsData).subscribe(
        (response: any) => {
          this.getDeviceGroups("");
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
      const url = "/tacacs-device-groups/add-devices-group";
      this.tacacsData = this.deviceFormGroup.value;
      // console.log(this.tacacsData);
      this.TacasDeviceGroupService.postMethod(url, this.tacacsData).subscribe(
        (response: any) => {
          this.submitted = false;
          this.deviceFormGroup.reset();
          this.getDeviceGroups("");

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
  }

  getDeviceGroups(list) {
    const url = "/tacacs-device-groups/get-devices-groups";
    let size;
    let pageList = this.currentPagedevice - 1;
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
        this.deciceGroupList = response.data.deviceGroup.content;
        this.devicetotalRecords = response.data.deviceGroup.totalElements;
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

  editDeviceGroup(Customer) {
    this.editMode = true;
    this.deviceFormGroup.controls["tacacsDeviceGroupName"].setValue(Customer.tacacsDeviceGroupName);
    this.deviceFormGroup.controls["tacacsDeviceGroupDescription"].setValue(
      Customer.tacacsDeviceGroupDescription
    );
    this.deviceFormGroup.controls["id"].setValue(Customer.id);
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
    const url = "/tacacs-device-groups/delete-devices-group/" + data.id;
    this.TacasDeviceGroupService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPagedevice != 1 && this.deciceGroupList.length == 1) {
          this.currentPagedevice = this.currentPagedevice - 1;
        }
        this.getDeviceGroups("");

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
    if (this.currentPagedevice > 1) {
      this.currentPagedevice = 1;
    }
    this.getDeviceGroups(this.showItemPerPage);
  }

  pageChangedCasList(pageNumber) {
    this.currentPagedevice = pageNumber;
    this.getDeviceGroups("");
  }
}
