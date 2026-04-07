import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { TacacsDeviceGroupService } from "src/app/service/tacacs-device-group.service";
import { LoginService } from "src/app/service/login.service";
import { TACACS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-tacacs-commandset",
  templateUrl: "./tacacs-commandset.component.html",
  styleUrls: ["./tacacs-commandset.component.css"],
})
export class TacacsCommandsetComponent implements OnInit {
  title = "Tacacs";
  deviceFormGroup: FormGroup;
  showItemPerPage: any;
  deviceitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  submitted: boolean = false;
  commandList: any;
  currentPageDevice = 1;
  devicetotalRecords: any;
  editMode: boolean;
  createView = false;
  commandView = false;
  listView = true;
  detailView: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showFormArray: boolean = false;
  editing = false;
  updatedData: any;
  isApproved: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  ipType = [{ label: "Permit" }, { label: "Deny" }, { label: "Deny Always" }];
  public loginService: LoginService;
  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private TacasDeviceGroupService: TacacsDeviceGroupService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    loginService: LoginService
  ) {
    this.createAccess = loginService.hasPermission(TACACS.TACACS_CMD_SET_CREATE);
    this.deleteAccess = loginService.hasPermission(TACACS.TACACS_CMD_SET_DELETE);
    this.editAccess = loginService.hasPermission(TACACS.TACACS_CMD_SET_EDIT);
  }

  ngOnInit(): void {
    this.deviceFormGroup = this.fb.group({
      commandType: ["", Validators.required],
      commandSetName: ["", Validators.required],
      description: ["", Validators.required],
      anyCommandPermit: ["", Validators.required],
      id: [""],

      tacacsCommands: this.fb.array([]),
    });

    this.getCommandListData("");
  }

  get tacacsCommands(): FormArray {
    return this.deviceFormGroup.get("tacacsCommands") as FormArray;
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
  CommandList: any = [];
  IcCodeOpenModel(id) {
    const url = "/command-set/get-command-set/" + id;
    this.TacasDeviceGroupService.getCustomer(url).subscribe((response: any) => {
      this.listView = false;
      this.createView = false;
      this.detailView = true;
      this.CommandList = response.data.commandSet;
    });
  }

  getCommandListData(list) {
    const url = "/command-set/get-command-sets";
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
        this.commandList = response.data.commandSets.content;
        this.devicetotalRecords = response.data.commandSets.totalElements;
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

  addEditCommandSet(id) {
    this.submitted = true;
    if (id) {
      const url = "/command-set/update-command-set/" + id;
      const updatedData = this.deviceFormGroup.value;

      this.TacasDeviceGroupService.updateMethod(url, updatedData).subscribe(
        (response: any) => {
          this.getCommandListData("");
          this.deviceFormGroup.reset();
          this.clearCommandArray();
          this.editMode = false;
          this.createView = false;
          this.listView = true;
          this.detailView = false;
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
      const url = "/command-set/add-command-set";
      const requestData = {
        commandSetName: this.deviceFormGroup.value.commandSetName,
        commandType: this.deviceFormGroup.value.commandType,
        description: this.deviceFormGroup.value.description,
        anyCommandPermit: this.deviceFormGroup.value.anyCommandPermit,
        tacacsCommands: this.deviceFormGroup.value.tacacsCommands,
      };
      this.TacasDeviceGroupService.postMethod(url, requestData).subscribe(
        (response: any) => {
          this.getCommandListData("");
          this.deviceFormGroup.reset();
          this.clearCommandArray();
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
    }
  }

  editCommandSet(commandSet: any) {
    this.editMode = true;
    this.createView = true;
    this.listView = false;
    this.showFormArray = true;
    this.deviceFormGroup.patchValue({
      commandType: commandSet.commandType,
      commandSetName: commandSet.commandSetName,
      description: commandSet.description,
      anyCommandPermit: commandSet.anyCommandPermit,
      tacacsCommands: commandSet.tacacsCommands,
      id: commandSet.id,
    });
    this.clearCommandArray();

    const commands = commandSet.tacacsCommands;
    commands.forEach((command: any) => {
      this.addCommandToFormArray(command);
    });
  }
  clearCommandArray() {
    const tacacsCommands = this.deviceFormGroup.get("tacacsCommands") as FormArray;
    tacacsCommands.clear();
  }

  addCommandToFormArray(command: any) {
    const tacacsCommands = this.deviceFormGroup.get("tacacsCommands") as FormArray;
    tacacsCommands.push(
      this.fb.group({
        command: [command.command, Validators.required],
        commandArgs: [command.commandArgs, Validators.required],
        grant: [command.grant, Validators.required],
      })
    );
  }

  approveCommand(index: number) {
    const commandGroup = this.tacacsCommands.controls[index];
    const command = {
      command: commandGroup.get("command").value,
      commandArgs: commandGroup.get("commandArgs").value,
      grant: commandGroup.get("grant").value,
    };

    if (command.command === "" || command.grant === "") {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Some fields are empty. Please fill in all required values.",
        icon: "far fa-times-circle",
      });
      return;
    }

    const hasDuplicate = this.tacacsCommands.controls.some((control, i) => {
      if (i !== index) {
        const otherCommand = {
          command: control.get("command").value,
          commandArgs: control.get("commandArgs").value,
        };
        return (
          command.command === otherCommand.command &&
          command.commandArgs === otherCommand.commandArgs
        );
      }
      return false;
    });

    if (hasDuplicate) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Duplicate Command found. Please enter a unique value",
        icon: "far fa-times-circle",
      });
      return;
    }
    this.isApproved = true;
    this.editing = false;
  }

  addCommand() {
    const commandGroup = this.fb.group({
      command: ["", Validators.required],
      commandArgs: ["", Validators.required],
      grant: ["", Validators.required],
    });
    this.editing = true;
    this.showFormArray = true;
    this.tacacsCommands.push(commandGroup);
  }

  removeCommand(index: number) {
    this.tacacsCommands.removeAt(index);
  }

  editCommand(index: number) {
    this.editing = true;
    this.tacacsCommands.controls.forEach((control, i) => {
      if (i !== index) {
        control.disable();
      } else {
        control.enable();
      }
    });
    const commandGroup = this.tacacsCommands.controls[index];
    const command = {
      command: commandGroup.get("command").value,
      commandArgs: commandGroup.get("commandArgs").value,
      grant: commandGroup.get("grant").value,
    };
    this.deviceFormGroup.get("tacacsCommands").patchValue(command);
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
    const url = "/command-set/delete-command-set/" + data.id;
    this.TacasDeviceGroupService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPageDevice != 1 && this.commandList.length == 1) {
          this.currentPageDevice = this.currentPageDevice - 1;
        }
        this.getCommandListData("");

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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageDevice > 1) {
      this.currentPageDevice = 1;
    }

    this.getCommandListData(this.showItemPerPage);
  }

  pageChangedCasList(pageNumber) {
    this.currentPageDevice = pageNumber;
    this.getCommandListData("");
  }

  createCommandset() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.editMode = false;
    this.deviceFormGroup.reset();
    this.showFormArray = false;
    this.clearCommandArray();
  }

  clearSearch() {
    this.deviceFormGroup.reset();
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
