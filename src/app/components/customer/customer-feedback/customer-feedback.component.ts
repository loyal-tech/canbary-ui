import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";

@Component({
  selector: "app-customer-feedback",
  templateUrl: "./customer-feedback.component.html",
  styleUrls: ["./customer-feedback.component.css"]
})
export class CustomerFeedbackComponent implements OnInit {
  ifcustCaf: boolean = false;
  customerId: any;
  custCurrentPlanList: any;
  serviceStartPuase: boolean = false;
  custData: any;
  badgeTypeForStatus: any;
  displayStatus: any;
  ifselecResonType: any;
  displayDeleteReason: boolean = false;
  deactiveDataList: any;
  selectDeactivateReason: string = "";
  serviceStropRemarks: string = "";
  servicePerticularData: any;
  serviceStopBulkFlag: boolean = false;
  serviceStopId = [];
  planForConnection: any;
  showPlanConnectionNo: boolean;
  feedbackListData: any;
  viewFeedbackModel: boolean = false;
  feedbackViewData: any;

  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private route: ActivatedRoute,
    public customerService: CustomermanagementService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
  }

  ngOnInit() {
    this.getFeedbackList();
  }

  getFeedbackList() {
    const url = "/customerfeedback/getFeedBackDetails?custid=" + this.customerId;
    this.customerService.getMethod(url).subscribe(
      (response: any) => {
        this.feedbackListData = response.feedBackDetails;
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
  }

  getStars(rating: number, max: number): number[] {
    return Array.from({ length: max }, (_, i) => i);
  }

  getFeedbackColorClass(rating: number | null): string {
    if (rating === 5) return "feedback-excellent";
    if (rating === 4) return "feedback-good";
    if (rating === 3) return "feedback-neutral";
    if (rating === 2) return "feedback-poor";
    if (rating === 1) return "feedback-bad";
    return "feedback-none";
  }

  showknowledgetDocData(data) {
    this.feedbackViewData = data;
    this.viewFeedbackModel = true;
  }

  closeModal() {
    this.viewFeedbackModel = false;
  }
}
