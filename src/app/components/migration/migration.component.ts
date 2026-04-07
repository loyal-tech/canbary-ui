import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { IntegrationAuditService } from "src/app/service/integration-audit.service";
import { IntegrationConfigurationService } from "src/app/service/integration-configuration.service";
import { MessageService } from "primeng/api";
import * as FileSaver from "file-saver";
import { MigrationService } from "src/app/service/migration.service";

@Component({
  selector: "app-migration",
  templateUrl: "./migration.component.html",
  styleUrls: ["./migration.component.css"]
})
export class MigrationComonent implements OnInit {
  createMigration: FormGroup;
  updateMigration: FormGroup;
  selectedFile: any;
  submitted: boolean = false;
  createScreen: boolean = true;
  updateScreen: boolean = false;
  editMode: boolean = false;
  formSubmit: boolean = false;
  fileName: any;
  isFIleNameDialog: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private customerManagementService: CustomermanagementService,
    public integrationAuditService: IntegrationAuditService,
    public integrationConfiservice: IntegrationConfigurationService,
    private messageService: MessageService,
    private migrationService: MigrationService
  ) {
    this.createMigration = this.formBuilder.group({
      file: [""],
      migrationType: [""]
    });
    this.updateMigration = this.formBuilder.group({
      file: [""],
      migrationType: [""]
    });
  }

  migrationTypeList = [
    { label: "Customer", value: "Customer" },
    { label: "Plan", value: "Plan" },
    { label: "Service Area", value: "Service Area" }
  ];

  updateTypeList = [{ label: "Plan Update", value: "Plan Update" }];

  ngOnInit(): void {}

  onFileChangeUpload(event) {
    let fileArray: FileList;
    this.createMigration.controls.file;
    fileArray = this.createMigration.controls.file.value;
    if (fileArray.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.createMigration.controls.file) {
        if (!this.isValidXLSFile(this.selectedFile)) {
          this.createMigration.controls.file.reset();
          alert("Please upload valid .XLSX file");
        } else {
          this.formSubmit = true;
        }
      }
    } else {
      alert("Please upload .XLSX file");
    }
  }
  uploadDocument() {
    this.submitted = true;
    if (this.createMigration.valid) {
      const formData = new FormData();
      if (this.createMigration.controls.file) {
        if (!this.isValidXLSFile(this.selectedFile)) {
          this.createMigration.controls.file.reset();
          alert("Please upload a valid .xls file");
        } else {
          formData.append("file", this.selectedFile);
        }
      }
      if (this.createMigration.controls.migrationType.value === "Plan") {
        const url = `/migration/uploadPlanXl`;
        this.integrationAuditService.postMethod(url, formData).subscribe(
          (response: any) => {},
          error => {}
        );
      }
      if (this.createMigration.controls.migrationType.value === "Customer") {
        const url = `/migration/uploadCusromerXl`;
        this.integrationAuditService.postMethod(url, formData).subscribe(
          (response: any) => {},
          error => {}
        );
      }
      if (this.createMigration.controls.migrationType.value === "Service Area") {
        const url = `/bulkDownload/upload`;
        this.integrationAuditService
          .postMethodforCommon(url, formData, { responseType: "text" })
          .subscribe(
            (response: any) => {
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Uploaded Successfully",
                icon: "far fa-check-circle"
              });

              this.createMigration.reset();
              this.formSubmit = false;
            },
            (error: any) => {
              console.error("Error:", error);
              if ((error.status = 417)) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: error.error || "Unknown error occurred",
                  icon: "far fa-times-circle"
                });
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: error.error || "Unknown error occurred",
                  icon: "far fa-times-circle"
                });
              }
              this.formSubmit = false;
              this.createMigration.reset();
            }
          );
      }
    }
  }
  isValidXLSFile(file: any) {
    return file.name.endsWith(".xlsx");
  }

  openUpdateTab() {
    this.updateScreen = true;
    this.createScreen = false;
    this.formSubmit = false;
    this.createMigration.reset();
  }
  openCreateTab() {
    this.createScreen = true;
    this.updateScreen = false;
    this.formSubmit = false;
    this.createMigration.reset();
  }

  downloadSampleFile() {
    if (this.createMigration.controls.migrationType.value === "Service Area") {
      const url = `/bulkDownload/download`;
      this.customerManagementService.getDownloadServiceArea(url).subscribe(
        (response: any) => {
          const file = new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          FileSaver.saveAs(file, "ServiceAreaReport");
          this.isFIleNameDialog = false;
        },
        error => {
          console.error(error);
        }
      );
    } else {
      let url = `/download/${this.fileName}`;
      this.customerManagementService.getDownloadMethod(url).subscribe(
        (response: any) => {
          const file = new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          });
          FileSaver.saveAs(file, "Sheet");
        },
        () => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!!!!",
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  downloadClick() {
    this.isFIleNameDialog = true;
  }

  closeFileNameDialog() {
    this.isFIleNameDialog = false;
  }

  migrationTypeChange(event: any) {
    this.fileName = "";
    this.fileName = event.value + ".xlsx";
  }

  onUpdateFileChangeUpload(event) {
    let fileArray: FileList;
    this.updateMigration.controls.file;
    fileArray = this.updateMigration.controls.file.value;
    if (fileArray.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.updateMigration.controls.file) {
        if (!this.isValidXLSFile(this.selectedFile)) {
          this.updateMigration.controls.file.reset();
          alert("Please upload valid .XLSX file");
        } else {
          this.formSubmit = true;
        }
      }
    } else {
      alert("Please upload .XLSX file");
    }
  }

  updateMigrationTypeChange(event: any) {
    this.fileName = "";
    this.fileName = event.value + ".xlsx";
  }

  downloadClickForUpdate() {
    this.migrationService.downloadBulkPlanUpdateSheet().subscribe(
      (response: any) => {
        const file = new Blob([response], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });
        FileSaver.saveAs(file, "updatePlanReport");
      },
      error => {
        console.error(error);
      }
    );
  }

  uploadDocumentForUpdate() {
    this.submitted = true;
    if (this.updateMigration.valid) {
      const formData = new FormData();
      if (this.updateMigration.controls.file) {
        if (!this.isValidXLSFile(this.selectedFile)) {
          this.updateMigration.controls.file.reset();
          alert("Please upload a valid .xls file");
        } else {
          formData.append("file", this.selectedFile);
        }
      }
      this.migrationService.uploadBulkPlanUpdateSheetCMS(formData).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.updateMigration.reset();
          this.formSubmit = false;
        },
        (error: any) => {
          console.error("Error:", error);
          if ((error.status = 417)) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error || "Unknown error occurred",
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error || "Unknown error occurred",
              icon: "far fa-times-circle"
            });
          }
          this.formSubmit = false;
          this.updateMigration.reset();
        }
      );
    }
  }
}
