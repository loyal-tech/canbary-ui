import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";

declare var $: any;

@Component({
  selector: "app-cust-change-status",
  templateUrl: "./cust-change-status.component.html",
  styleUrls: ["./cust-change-status.component.css"]
})
export class CustChangeStatusComponent implements OnInit {
  @Input() custId;
  @Input() custStatus;
  @Input() moduleType;
  @Output() closeChangeStatusEvent = new EventEmitter();
  updatedStatus: any;
  remark: any;
  changeStatusModal: boolean = false;
  customerStatusValue: any;
  constructor(
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const url = "/commonList/generic/custStatus";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.customerStatusValue = response.dataList.filter(
          status => status.value !== "Closed" && status.value !== "Rejected"
        );
      },
      (error: any) => {}
    );
    this.changeStatusModal = true;
  }

  async changeStatus(updatedStatus, remark) {
    const data = {
      id: this.custId,
      rf: "bss",
      status: updatedStatus,
      remark: remark
    };

    if (this.moduleType == "radius") {
      const url = "/updateStatus/" + this.custId + "?remark=" + remark + "&status=" + updatedStatus;
      this.customerManagementService.updateRadiusMethod(url, data).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: response.message,
            detail: response.customer,
            icon: "far fa-check-circle"
          });
          // this.getcustomerList("");
          this.updatedStatus = "";
          this.closeChangeStatus(true);
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
    } else if (this.moduleType == "netConf") {
      const url =
        "/customer/updateStatus/" + this.custId + "?remark=" + remark + "&status=" + updatedStatus;
      this.customerManagementService.updateNetConf(url, data).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: response.message,
            detail: response.customer,
            icon: "far fa-check-circle"
          });
          // this.getcustomerList("");
          this.updatedStatus = "";
          this.closeChangeStatus(true);
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
    } else {
      const url = "/changeStatus/" + this.custId + "?remark=" + remark + "&status=" + updatedStatus;
      this.customerManagementService.updateMethod(url, data).subscribe(
        (response: any) => {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.customer,
            icon: "far fa-check-circle"
          });
          // this.getcustomerList("");
          this.updatedStatus = "";
          this.closeChangeStatus(true);
        },
     (error: any) => {
        if (error.status === 500) {
            this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error?.ERROR,
            icon: "far fa-times-circle",
            });
        } 
        else {
            this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error?.ERROR ,
            icon: "far fa-times-circle",
            });
        }
        }

      );
    }
  }

  closeChangeStatus(isStatusChanged) {
    this.updatedStatus = "";
    this.remark = "";
    this.closeChangeStatusEvent.emit(isStatusChanged);
    this.changeStatusModal = false;
  }
}
