import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { TacacsDeviceGroupService } from "src/app/service/tacacs-device-group.service";
import { LoginService } from "src/app/service/login.service";
import { TACACS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-access-control-list",
  templateUrl: "./access-control-list.component.html",
  styleUrls: ["./access-control-list.component.css"],
})
export class AccessControlListComponent implements OnInit {
  title = "Tacacs";
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
  detailView: boolean = false;
  TacacsDeviceList: any[] = [];
  updatedData: any;
  TacacsCommandSetList: any[] = [];
  listView = true;
  editing = false;
  statusOptions = RadiusConstants.status;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  isApproved: boolean = false;
  auditLoggingOpt = [
    { label: "true", value: true },
    { label: "false", value: false },
  ];
  privilegeLevelOptions = Array.from({ length: 16 }, (_, i) => ({ label: String(i), value: i }));
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
    this.createAccess = loginService.hasPermission(TACACS.TACACS_ACCESS_LEVEL_GROUP_CREATE);
    this.deleteAccess = loginService.hasPermission(TACACS.TACACS_ACCESS_LEVEL_GROUP_DELETE);
    this.editAccess = loginService.hasPermission(TACACS.TACACS_ACCESS_LEVEL_GROUP_EDIT);
    this.tacacsGetCommandSets();
    this.tacacsGetDeviceGroups();
  }

  ngOnInit(): void {
    this.deviceFormGroup = this.fb.group({
      accessLevelGroupDesc: ["", Validators.required],
      accessLevelGroupId: ["", Validators.required],
      accessLevelGroupName: ["", Validators.required],
      auditLogging: ["", Validators.required],
      privilegeLevel: ["", [Validators.required, this.integerRangeValidator]],
      id: [""],
      tacacsDeviceGroups: this.fb.array([this.createTacacsDeviceGroup()]),
      validFrom: [new Date(), Validators.required],
      validUntil: [new Date(), Validators.required],
    });

    this.getDeviceListData("");
  }

  ALGList: any = [];
  IcCodeOpenModel(id) {
    const url = "/tacacs-access-level-group/get-access-level-group/" + id;
    this.TacasDeviceGroupService.getCustomer(url).subscribe((response: any) => {
      this.listView = false;
      this.createView = false;
      this.detailView = true;
      this.ALGList = response.data.accessLevelGroup;
    });
  }

  createTacacsDeviceGroup(): FormGroup {
    return this.fb.group({
      tacacsDeviceGroupName: ["", Validators.required],
      tacacsDeviceGroupDescription: ["", Validators.required],
      tacacsCommandSetDto: this.fb.group({
        commandType: ["", Validators.required],
        commandSetName: ["", Validators.required],
        description: ["", Validators.required],
        tacacsCommands: this.fb.array([this.createTacacsCommand()]),
        anyCommandPermit: [true],
      }),
    });
  }

  createTacacsCommand(): FormGroup {
    this.isApproved = false;
    return this.fb.group({
      command: ["", Validators.required],
      commandArgs: ["", Validators.required],
      grant: ["", Validators.required],
    });
  }

  integerRangeValidator(control) {
    const value = control.value;
    if (value !== null && (isNaN(value) || value < 0 || value > 15 || !Number.isInteger(value))) {
      return { integerRange: true };
    }
    return null;
  }

  editDeviceGroup(index: number) {
    const deviceGroupsArray = this.deviceFormGroup.get("tacacsDeviceGroups") as FormArray;

    deviceGroupsArray.controls.forEach((control, i) => {
      if (i === index) {
        control.enable();
      } else {
        control.disable();
      }
    });
  }

  removeDeviceGroup(index: number) {
    const deviceGroupsArray = this.deviceFormGroup.get("tacacsDeviceGroups") as FormArray;
    deviceGroupsArray.removeAt(index);
  }

  addDeviceGroup() {
    const deviceGroupsArray = this.deviceFormGroup.get("tacacsDeviceGroups") as FormArray;
    deviceGroupsArray.push(this.createTacacsDeviceGroup());
  }

  approveCommand(index: number) {
    const tacacsDeviceGroupsArray = this.deviceFormGroup.get("tacacsDeviceGroups") as FormArray;
    const groupNameValues = tacacsDeviceGroupsArray.controls.map(
      group => group.get("tacacsDeviceGroupName").value
    );
    const isDuplicate = groupNameValues.some(
      (groupName, index) => groupNameValues.indexOf(groupName) !== index
    );
    if (isDuplicate) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Duplicate tacacsDeviceGroupName found. Please enter a unique value",
        icon: "far fa-times-circle",
      });
      return;
    }
    const emptyFields = tacacsDeviceGroupsArray.controls.some(group => {
      const tacacsCommandSetDtoGroup = group.get("tacacsCommandSetDto") as FormGroup;
      const commandSetName = tacacsCommandSetDtoGroup.get("commandSetName").value;

      if (!commandSetName) {
        return true;
      }
    });
    if (emptyFields) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Some fields are empty. Please fill in all required values.",
        icon: "far fa-times-circle",
      });
      return;
    }
    this.isApproved = true;
  }

  tacacsDeviceGroup(event) {
    const selectedDeviceGroup = event.value;
    const deviceGroup = this.TacacsDeviceList.find(
      group => group.tacacsDeviceGroupName === selectedDeviceGroup
    );
    if (deviceGroup) {
      const tacacsDeviceGroupsArray = this.deviceFormGroup.get("tacacsDeviceGroups") as FormArray;

      const isGroupNameExists = tacacsDeviceGroupsArray.controls.some(group => {
        const groupNameControl = group.get("tacacsDeviceGroupName");
        return groupNameControl.value === deviceGroup.tacacsDeviceGroupName;
      });

      if (!isGroupNameExists) {
        tacacsDeviceGroupsArray.controls.forEach(group => {
          group.patchValue({
            tacacsDeviceGroupName: deviceGroup.tacacsDeviceGroupName,
            tacacsDeviceGroupDescription: deviceGroup.tacacsDeviceGroupDescription,
          });
        });
      }
    }
  }

  tacacsCommandSet(event) {
    const selectedDeviceGroup = event.value;
    const deviceGroup = this.TacacsCommandSetList.find(
      group => group.commandSetName === selectedDeviceGroup
    );
    if (deviceGroup) {
      const tacacsDeviceGroupsArray = this.deviceFormGroup.get("tacacsDeviceGroups") as FormArray;
      tacacsDeviceGroupsArray.controls.forEach(group => {
        const tacacsCommandSetDtoGroup = group.get("tacacsCommandSetDto") as FormGroup;
        if (tacacsCommandSetDtoGroup) {
          tacacsCommandSetDtoGroup.patchValue({
            commandSetName: deviceGroup.commandSetName,
            commandType: deviceGroup.commandType,
            description: deviceGroup.description,
            tacacsCommands: deviceGroup.tacacsCommands.map(command => ({
              command: command.command,
              commandArgs: command.commandArgs,
              grant: command.grant,
            })),
            anyCommandPermit: deviceGroup.anyCommandPermit,
          });
        }
      });
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

  tacacsGetCommandSets() {
    const url = "/command-set/get-command-sets";
    let plandata = {
      page: 0,
      pageSize: 100,
    };

    this.TacasDeviceGroupService.getMethod(url, { params: plandata }).subscribe((res: any) => {
      this.TacacsCommandSetList = res.data.commandSets.content;
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
  addEditCommandSet(id: any) {
    this.submitted = true;
    if (!this.isApproved) {
      this.messageService.add({
        severity: "info",
        summary: "Attention",
        detail: 'Please click the "Approve" button to proceed.',
        icon: "fas fa-info-circle",
      });
      return;
    }
    if (id) {
      const url = "/tacacs-access-level-group/update-access-level-group/" + id;

      this.updatedData = this.deviceFormGroup.value;
      this.TacasDeviceGroupService.updateMethod(url, this.updatedData).subscribe(
        (response: any) => {
          this.getDeviceListData("");
          this.deviceFormGroup.reset();
          this.editMode = false;
          this.createView = false;
          this.detailView = false;
          this.listView = true;
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
      const url = "/tacacs-access-level-group/add-access-level-group";
      this.tacacsData = this.deviceFormGroup.value;
      this.TacasDeviceGroupService.postMethod(url, this.tacacsData).subscribe(
        (response: any) => {
          this.getDeviceListData("");
          this.editMode = false;
          this.listView = true;
          this.createView = false;
          this.detailView = false;
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

  getDeviceListData(list) {
    const url = "/tacacs-access-level-group/get-access-level-groups";
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

    this.TacasDeviceGroupService.getMethod(url, { params: plandata }).subscribe((response: any) => {
      this.deviceList = response.data.accessLevelGroup.content;
      this.devicetotalRecords = response.data.accessLevelGroup.totalElements;
    });
  }

  editDevice(Device) {
    this.editMode = true;
    this.createView = true;
    this.detailView = false;
    this.listView = false;
    const privilegeLevelValue = Device.privilegeLevel.toString();
    this.deviceFormGroup.controls.privilegeLevel.setValue(privilegeLevelValue);
    this.deviceFormGroup.patchValue({
      accessLevelGroupId: Device.accessLevelGroupId,
      accessLevelGroupName: Device.accessLevelGroupName,
      accessLevelGroupDesc: Device.accessLevelGroupDesc,
      auditLogging: Device.auditLogging,
      validFrom: new Date(Device.validFrom),
      validUntil: new Date(Device.validUntil),
      id: Device.id,
    });
    this.deviceFormGroup.updateValueAndValidity();

    const deviceGroupsArray = this.deviceFormGroup.get("tacacsDeviceGroups") as FormArray;
    while (deviceGroupsArray.length > 0) {
      deviceGroupsArray.removeAt(0);
    }
    Device.tacacsDeviceGroups.forEach(group => {
      const deviceGroup = this.createTacacsDeviceGroup();

      deviceGroup.patchValue({
        tacacsDeviceGroupName: group.tacacsDeviceGroupName,
        tacacsDeviceGroupDescription: group.tacacsDeviceGroupDescription,
      });
      deviceGroup.get("tacacsCommandSetDto").patchValue({
        commandSetName: group.commandSetName,
      });
      deviceGroupsArray.push(deviceGroup);
    });
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
    const url = "/tacacs-access-level-group/delete-access-level-group/" + data.id;
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
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.message,
          icon: "far fa-times-circle",
        });
      }
    );
  }
  clearFormArray() {
    const deviceGroupsArray = this.deviceFormGroup.get("tacacsDeviceGroups") as FormArray;
    deviceGroupsArray.clear();
    deviceGroupsArray.push(this.createTacacsDeviceGroup());
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

  createACL() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.editMode = false;
    this.submitted = false;
    this.clearFormArray();
    this.deviceFormGroup.reset();
  }

  clearSearch() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.editMode = false;
  }

  ProductCategoryList() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
  }
}
