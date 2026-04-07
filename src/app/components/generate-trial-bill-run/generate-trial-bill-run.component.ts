import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { GenerateTrialBillRunService } from "src/app/service/generate-trial-bill-run.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { DatePipe } from "@angular/common";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";

@Component({
  selector: "app-generate-trial-bill-run",
  templateUrl: "./generate-trial-bill-run.component.html",
  styleUrls: ["./generate-trial-bill-run.component.css"]
})
export class GenerateTrialBillRunComponent implements OnInit {
  public loginService: LoginService;
  AclClassConstants;
  AclConstants;

  searchGenerateTrialBillRunFormGroup: FormGroup;
  submitted: boolean = false;
  billRunData: any;
  isGenerateBillSearch: boolean = false;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private generateTrialBillRunService: GenerateTrialBillRunService,
    private datePipe: DatePipe,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
  }

  ngOnInit(): void {
    this.searchGenerateTrialBillRunFormGroup = this.fb.group({
      trialBillGenerateDate: ["", Validators.required]
    });
  }

  async searchTrialBillRun() {
    this.submitted = true;
    if (this.searchGenerateTrialBillRunFormGroup.valid) {
      const Date = this.datePipe.transform(
        this.searchGenerateTrialBillRunFormGroup.controls.trialBillGenerateDate.value,
        "yyyyMMdd"
      );
      const url = "/trialbillingprocess/generatebill/" + Date;
      this.generateTrialBillRunService.searchMethod(url).subscribe(
        (response: any) => {
          // this.billRunData = response.responseObject;
          this.isGenerateBillSearch = true;

          this.clearTrialBillRun();
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
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

  async clearTrialBillRun() {
    this.submitted = false;
    this.isGenerateBillSearch = false;
    this.searchGenerateTrialBillRunFormGroup.controls.trialBillGenerateDate.setValue("");
  }
}
