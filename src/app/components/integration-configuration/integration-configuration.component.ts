import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { LoginService } from "src/app/service/login.service";
import { Observable, Observer } from "rxjs";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { INTEGRATION_SYSTEMS, SETTINGS } from "src/app/constants/aclConstants";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { IntegrationConfigurationService } from "src/app/service/integration-configuration.service";

declare var $: any;
@Component({
  selector: "app-integration-configuration",
  templateUrl: "./integration-configuration.component.html",
  styleUrls: ["./integration-configuration.component.scss"],
})
export class IntegrationConfigurationComponent implements OnInit {
  integrationConfigFormGroup: FormGroup;
  submitted = false;
  isDropdownClick = false;
  AclClassConstants: any;
  AclConstants: any;
  editMode: boolean = false;
  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];
  detailView: boolean = false;
  editAccess: boolean = false;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  paymentgatewayList: any[] = [];
  labelMap: any = {};
  parameterForMap: any = {};

  integrationConfigurationList: any[] = [];
  integrationConfigItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  integrationConfigCurrentPage = 1;
  integrationConfigTotalRecords: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public loginService: LoginService,
    public commondropdownService: CommondropdownService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public integrationConfigService: IntegrationConfigurationService
  ) {
    this.createAccess = loginService.hasPermission(INTEGRATION_SYSTEMS.INTEGRATION_CONFIG_CREATE);
    this.deleteAccess = loginService.hasPermission(INTEGRATION_SYSTEMS.INTEGRATION_CONFIG_DELETE);
    this.editAccess = loginService.hasPermission(INTEGRATION_SYSTEMS.INTEGRATION_CONFIG_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.integrationConfigFormGroup = this.fb.group({
      name: ["", Validators.required],
      baseurl: ["", Validators.required],
      port: ["", Validators.required],
      username: ["", this.noSpaceValidator],
      password: ["", this.noSpaceValidator],
      id: [""],
    });
    this.getAllIntegrationConfiguration();
  }

  getAllIntegrationConfiguration() {
    var pageRequest = {
      page: this.integrationConfigCurrentPage,
      pageSize: this.integrationConfigItemsPerPage,
    };

    this.integrationConfigService.getAllIntegrationConfiguration(pageRequest).subscribe(
      (response: any) => {
        if (response.configlist) {
          this.integrationConfigurationList = response.configlist.content;
        }
        this.integrationConfigTotalRecords = response.pageDetails.totalRecords;
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

  addUpdateIntegrationConfig() {
    this.submitted = true;
    if (this.integrationConfigFormGroup.valid) {
      if (this.editMode) {
        this.integrationConfigService
          .updateIntegrationConfiguration(this.integrationConfigFormGroup.value)
          .subscribe(
            (response: any) => {
              this.submitted = false;
              this.editMode = false;
              this.resetConfigForm();
              this.getAllIntegrationConfiguration();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.responseMessage,
                icon: "far fa-check-circle",
              });
            },
            (error: any) => {
              if (error.status == 400) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: error.error.ERROR,
                  icon: "far fa-times-circle",
                });
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
      } else {
        this.integrationConfigService
          .addIntegrationConfiguration(this.integrationConfigFormGroup.value)
          .subscribe(
            (response: any) => {
              this.submitted = false;
              this.resetConfigForm();
              this.getAllIntegrationConfiguration();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle",
              });

              this.isDropdownClick = false;
            },
            (error: any) => {
              if (error.status == 400) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: error.error.ERROR,
                  icon: "far fa-times-circle",
                });
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: error.error.ERROR,
                  icon: "far fa-times-circle",
                });
              }
              this.isDropdownClick = false;
            }
          );
      }
    }
  }

  resetConfigForm() {
    this.integrationConfigFormGroup.reset();
  }

  editConfigById(configId) {
    this.editMode = true;
    this.integrationConfigService.getIntegrationConfigurationById(configId).subscribe(
      (response: any) => {
        this.integrationConfigFormGroup.patchValue(response.data);
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

  canExit() {
    if (!this.integrationConfigFormGroup.dirty) return true;
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

  deleteIntegrationConfirmation(configId) {
    if (configId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this integration configuration ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteIntegrationConfig(configId);
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

  deleteIntegrationConfig(configId) {
    this.integrationConfigService.deleteIntegrationConfiguration(configId).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.responseMessage,
          icon: "far fa-check-circle",
        });
        this.getAllIntegrationConfiguration();
        this.resetConfigForm();
        this.editMode = false;
        this.isDropdownClick = false;
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

  pageChanged(pageNumber) {
    this.integrationConfigCurrentPage = pageNumber;
    this.getAllIntegrationConfiguration();
  }

  TotalItemPerPage(event: any) {
    this.integrationConfigItemsPerPage = Number(event.value);
    this.getAllIntegrationConfiguration();
  }
  resetForm() {
    this.integrationConfigFormGroup.reset();
    this.resetConfigForm();
    this.editMode = false;
    this.isDropdownClick = false;
  }

  keypressId(event: any) {
    const pattern = /^[0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  noSpaceValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value && control.value.includes(" ")) {
      return { noSpace: true };
    }
    return null;
  }
}
