import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { KpiManagementService } from "src/app/service/kpi-management.service";

@Component({
  selector: "app-my-achievement",
  templateUrl: "./my-achievement.component.html",
  styleUrls: ["./my-achievement.component.css"],
})
export class MyAchievementComponent implements OnInit {
  myAchievementData: any = [];
  viewKPIDetailData: any;
  totalVal: any = 0;
  totalAmountPer: any = 0;
  totalAchievedAmount: any = 0;
  constructor(
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private kpiManagementService: KpiManagementService
  ) {}

  ngOnInit(): void {
    this.getAchievementData();
  }

  getAchievementData() {
    const url =
      "/targetmaster/findAllTargetKpiMappingByStaffId?staffId=" + localStorage.getItem("userId");
    this.kpiManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.myAchievementData = response.dataList;
          if (this.myAchievementData.length > 0) {
            this.getKPIDetailById(this.myAchievementData[0].kpiMasterId);
            this.totalAmountFun();
            this.totalAmountPerFun();
            this.totalAcheivementFun();
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        }
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

  getKPIDetailById(kpiId) {
    const url = "/kpimaster/" + kpiId;
    this.kpiManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.viewKPIDetailData = response.data;
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle",
          });
        }
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

  totalAmountFun() {
    this.totalVal = 0;
    for (let i = 0; i < 5; i++) {
      if (!isNaN(Number(this.myAchievementData[i].amount)))
        this.totalVal = this.totalVal + Number(this.myAchievementData[i].amount);
    }
    // this.totalVal = this.totalVal + Number(this.KPIMappingFormArray.controls[i].value.amount);
  }

  totalAmountPerFun() {
    this.totalAmountPer = 0;
    for (let i = 0; i < 5; i++) {
      if (!isNaN(Number(this.myAchievementData[i].percentage)))
        this.totalAmountPer = this.totalAmountPer + Number(this.myAchievementData[i].percentage);
    }
  }

  totalAcheivementFun() {
    this.totalAchievedAmount = 0;
    for (let i = 0; i < 5; i++) {
      if (!isNaN(Number(this.myAchievementData[i].achievedAmount)))
        this.totalAchievedAmount =
          this.totalAchievedAmount + Number(this.myAchievementData[i].achievedAmount);
    }
  }
}
