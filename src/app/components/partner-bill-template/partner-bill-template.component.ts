import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { GenerateBillRunService } from "src/app/service/generate-bill-run.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-partner-bill-template",
  templateUrl: "./partner-bill-template.component.html",
  styleUrls: ["./partner-bill-template.component.css"]
})
export class PartnerBilltemplateComponent implements OnInit {
  searchGenerateBillRunFormGroup: FormGroup;
  submitted: boolean = false;
  billRunData: any;
  isGenerateBillSearch: boolean = false;
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  maxDate: Date = new Date();
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private generateBillRunService: GenerateBillRunService,
    private datePipe: DatePipe,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.searchGenerateBillRunFormGroup = this.fb.group({
      billGenerateDate: ["", Validators.required]
    });
  }

  async searchBillRun() {
    this.submitted = true;
    if (this.searchGenerateBillRunFormGroup.valid) {
      let day = this.datePipe.transform(
        this.searchGenerateBillRunFormGroup.controls.billGenerateDate.value,
        "dd"
      );
      let month = this.datePipe.transform(
        this.searchGenerateBillRunFormGroup.controls.billGenerateDate.value,
        "MM"
      );
      let year = this.datePipe.transform(
        this.searchGenerateBillRunFormGroup.controls.billGenerateDate.value,
        "yyyy"
      );
      const url = `/partnerInvoiceGenerate/${day}/${month}/${year}`;
      this.generateBillRunService.searchMethod(url).subscribe(
        (response: any) => {
          if (response.status == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.message,
              icon: "far fa-times-circle"
            });
          } else {
            this.isGenerateBillSearch = true;

            this.clearBillRun();
            this.messageService.add({
              severity: "success",
              summary: "Success",
              detail: response.message,
              icon: "far fa-times-circle"
            });
          }
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.message,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  async clearBillRun() {
    this.submitted = false;
    this.isGenerateBillSearch = false;
    this.searchGenerateBillRunFormGroup.controls.billGenerateDate.setValue("");
  }
}
