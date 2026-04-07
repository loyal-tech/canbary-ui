import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { DatePipe } from "@angular/common";
declare var $: any;

@Component({
  selector: "app-customer-caf-followup",
  templateUrl: "./customer-caf-followup.component.html",
  styleUrls: ["./customer-caf-followup.component.css"]
})
export class CustomerCafFollowupComponent implements OnInit {
  customerId = 0;
  custType: string = "";
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerNotesList: any = [];
  totalRecords: number;
  customerDetailData: any;
  staffData: any = [];
  staffDetailModal: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  followupPopupOpen: boolean = false;
  generateNameOfFollowUp: any;
  followupScheduleForm: FormGroup;
  remarkFollowUpAccess: boolean = false;
  cafFollowupPage = 1;
  cafFollowupItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  cafFollowupList: any = [];
  followupListTotalRecordsForUserAndTeam: any;
  showItemPerPage = 1;
  cafFollowupDatalength = 0;
  followUpId: any;
  generateNameOfReFollowUp: any;
  reFollowupFormsubmitted: boolean = false;
  closeFollowUpAccess: boolean = false;
  closeFollowupFormsubmitted: boolean = false;
  reFollowupScheduleForm: FormGroup;
  followUpDetailsObj: any;
  remarkFollowupFormsubmitted: boolean = false;
  tableWrapperRemarks: string;
  scrollIdRemarks: string;
  followUpRemarkList: any;
  callFollowUpAccess: boolean = false;
  ifCafFollowupSubmited: boolean = false;
  followupData: any;
  staffid: any;
  mvnoid: number;
  remarkFollowupForm: FormGroup;
  scheduleFollowUpAccess: boolean = false;
  rescheduleFollowupRemarks = [
    "Confirm Later",
    "Do Not Call",
    "Expensive Package",
    "Call rejected by Client"
  ];
  // ifCafFollowUp = true;
  rescheduleFollowUpAccess: boolean = false;
  closeFollowupForm: FormGroup;
  dateTime = new Date();
  scheduleFollowup = false;
  reScheduleFollowup = false;
  closeFollowup = false;
  remarkScheduleFollowup = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private fb: FormBuilder,
    private loginService: LoginService,
    public datePipe: DatePipe
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;

    this.closeFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_CLOSE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_FOLLOW_UP_CLOSE
    );
    this.remarkFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_CLOSE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_FOLLOW_UP_CLOSE
    );
    this.callFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_CALL
        : POST_CUST_CONSTANTS.POST_CUST_CAF_CALL
    );
    this.scheduleFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_SCHEDULE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_SCHEDULE
    );
    this.rescheduleFollowUpAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_FOLLOW_UP_RESCHEDULE
        : POST_CUST_CONSTANTS.POST_CUST_CAF_RESCHEDULE
    );
  }

  ngOnInit() {
    this.getCustomersDetail(this.customerId);
    this.followupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: ["", Validators.required],
      isMissed: [false],
      customersId: []
    });
    this.reFollowupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: [""],
      isMissed: [false],
      customersId: [],
      remarksTemp: ["", Validators.required]
    });
    this.remarkFollowupForm = this.fb.group({
      cafFollowUpId: [""],
      remark: ["", Validators.required]
    });
    this.closeFollowupForm = this.fb.group({
      followUpId: [""],
      remarks: ["", Validators.required]
    });
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.staffid = Number(localStorage.getItem("userId"));
  }
  customerDetailOpen() {
    this.router.navigate([
      "/home/customer-caf-new/details/" + this.custType + "/x/" + this.customerId
    ]);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerDetailData = response.customers;
      this.getCafFollowupList("");
    });
  }

  scheduleFollowupPopupOpen() {
    this.followupPopupOpen = true;
    this.generatedNameOfTheFollowUp(this.customerId);
    this.scheduleFollowup = true;
  }

  generatedNameOfTheFollowUp(customersId) {
    const url = "/cafFollowUp/generateNameOfTheCafFollowUp/" + customersId;

    this.customerManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.generateNameOfFollowUp = await response.data;
        this.generateNameOfFollowUp
          ? this.followupScheduleForm.controls["followUpName"].setValue(this.generateNameOfFollowUp)
          : "";
      },
      async (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong with 'followup name.' Generation",
          icon: "far fa-times-circle"
        });
      }
    );
  }
  getCafFollowupList(list) {
    let size;
    let page = this.cafFollowupPage;
    if (list) {
      size = list;
      this.cafFollowupItemsPerPage = list;
    } else {
      size = this.cafFollowupItemsPerPage;
    }
    let mvnoId =
      localStorage.getItem("mvnoId") == "1"
        ? this.customerDetailData.mvnoId
        : Number(localStorage.getItem("mvnoId"));
    const url =
      "/cafFollowUp/findAll?customerId=" +
      this.customerId +
      "&page=" +
      page +
      "&pageSize=" +
      size +
      "&mvnoId=" +
      mvnoId;

    this.customerManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.cafFollowupList = await response?.dataList;

        this.followupListTotalRecordsForUserAndTeam = await response?.totalRecords;

        if (this.showItemPerPage > this.cafFollowupItemsPerPage) {
          this.cafFollowupDatalength = this.cafFollowupList?.length % this.showItemPerPage;
        } else {
          this.cafFollowupDatalength = this.cafFollowupList?.length % this.cafFollowupItemsPerPage;
        }
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

  checkFollowUpDatetimeOutDate(obj) {
    if (obj != null && obj != undefined) {
      if (obj.status && obj.status === "Pending") {
        if (obj.followUpDatetime && new Date(obj.followUpDatetime) < new Date()) {
          return true;
        }
      }
    } else {
      return false;
    }
  }
  rescheduleFollowUp(followUpDetails) {
    this.followUpId = followUpDetails.id;
    this.generatedNameOfTheReFollowUp(this.customerId);
    this.reFollowupFormsubmitted = false;
    this.reScheduleFollowup = true;
  }
  generatedNameOfTheReFollowUp(customersId) {
    const url = "/cafFollowUp/generateNameOfTheCafFollowUp/" + customersId;

    this.customerManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.generateNameOfReFollowUp = await response.data;
        this.generateNameOfReFollowUp
          ? this.reFollowupScheduleForm.controls["followUpName"].setValue(
              this.generateNameOfReFollowUp
            )
          : "";
      },
      async (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong with 'followup name.' Generation",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  closeFollowUp(followUpDetails) {
    this.closeFollowupFormsubmitted = false;
    this.followUpId = followUpDetails.id;
    this.closeFollowup = true;
  }

  remarkFollowUp(followUpDetails) {
    this.followUpDetailsObj = followUpDetails;
    this.remarkFollowupFormsubmitted = false;
    this.followUpId = followUpDetails.id;
    this.getfollowUpRemarkList(this.followUpId);
    this.remarkScheduleFollowup = true;
  }

  getfollowUpRemarkList(id) {
    this.tableWrapperRemarks = "";
    this.scrollIdRemarks = "";

    const url = "/cafFollowUp/findAll/cafFollowUpRemark/" + id;
    this.customerManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.followUpRemarkList = await response.dataList;
        if (this.followUpRemarkList && this.followUpRemarkList?.length > 3) {
          this.tableWrapperRemarks = "table-wrapper";
          this.scrollIdRemarks = "table-scroll-remark";
        }
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

  makeACall() {
    this.messageService.add({
      severity: "info",
      summary: "Call configure",
      detail: "Sorry! Please configure call client first..",
      icon: ""
    });
  }

  pageChangedCafFollowup(pageNumber): void {
    this.cafFollowupPage = pageNumber;
    this.getCafFollowupList("");
  }

  totalCafFollowupItems(event): void {
    this.showItemPerPage = Number(event.value);
    if (this.cafFollowupPage > 1) {
      this.cafFollowupPage = 1;
    }
    this.getCafFollowupList(this.showItemPerPage);
  }

  saveCafFollowup() {
    this.ifCafFollowupSubmited = true;
    if (this.followupScheduleForm.valid) {
      let mvnoId =
        localStorage.getItem("mvnoId") == "1"
          ? this.customerDetailData.mvnoId
          : Number(localStorage.getItem("mvnoId"));
      const url = "/cafFollowUp/save?mvnoId=" + mvnoId;
      this.followupData = this.followupScheduleForm.value;
      this.followupData.customersId = this.customerId;
      this.followupData.staffUserId = this.staffid;
      this.followupData.mvnoId = this.mvnoid;
      this.followupData.isMissed = false;
      this.followupData.isSend = false;
      this.followupData.status = "Pending";
      const myFormattedDate = this.datePipe.transform(
        this.followupData.followUpDatetime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.followupData.followUpDatetime = myFormattedDate;
      this.customerManagementService.postMethod(url, this.followupData).subscribe(
        (response: any) => {
          this.ifCafFollowupSubmited = false;
          this.followupScheduleForm.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.scheduleFollowup = false;
          this.getCafFollowupList("");
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
      this.ifCafFollowupSubmited = false;
    }
  }

  closeFolloupPopup() {
    this.followupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: ["", Validators.required],
      //status: ["", Validators.required],
      isMissed: [false],
      leadMasterId: [""]
    });
    this.scheduleFollowup = false;
  }

  saveReFollowup() {
    this.followupData = {};
    this.reFollowupFormsubmitted = true;
    if (this.reFollowupScheduleForm.valid) {
      this.followupData = this.reFollowupScheduleForm.value;
      this.followupData.customersId = this.customerId;
      this.followupData.staffUserId = this.staffid;
      this.followupData.mvnoId = this.mvnoid;
      this.followupData.isSend = false;
      this.followupData.status = "Pending";
      const myFormattedDate = this.datePipe.transform(
        this.followupData.followUpDatetime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.followupData.followUpDatetime = myFormattedDate;
      const url =
        "/cafFollowUp/reSchedulefollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.followupData.remarksTemp;
      this.customerManagementService.postMethod(url, this.followupData).subscribe(
        (response: any) => {
          this.reFollowupFormsubmitted = false;
          this.reFollowupScheduleForm.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.reScheduleFollowup = false;
          this.reFollowupFormsubmitted = false;
          this.getCafFollowupList("");
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
      this.reFollowupFormsubmitted = false;
    }
  }

  closeReFolloupPopup() {
    this.reFollowupFormsubmitted = false;
    this.reScheduleFollowup = false;
    this.reFollowupScheduleForm.reset();
  }

  saveCloseFollowUp() {
    this.closeFollowupFormsubmitted = true;
    if (this.closeFollowupForm.valid) {
      const url =
        "/cafFollowUp/closefollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.closeFollowupForm.get("remarks").value;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.closeFollowup = false;
          this.closeFollowupForm.reset();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.getCafFollowupList("");
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
      this.closeFollowupFormsubmitted = false;
    }
  }
  closeActionFolloupPopup() {
    this.closeFollowup = false;
  }

  saveRemarkFollowUp() {
    this.remarkFollowupFormsubmitted = true;
    this.remarkFollowupForm.get("cafFollowUpId").setValue(this.followUpId);
    if (this.remarkFollowupForm.valid) {
      var data = this.remarkFollowupForm.value;
      data.cafFollowUpId = this.followUpId;
      data.mvnoId = this.mvnoid;

      const url = "/cafFollowUp/cafFollowUp/remark";
      this.customerManagementService.postMethod(url, data).subscribe(
        async (response: any) => {
          this.remarkScheduleFollowup = false;
          this.remarkFollowupForm.reset();
          await this.getCafFollowupList("");

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
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
      this.remarkFollowupFormsubmitted = false;
    }
  }
  closeRemarkPopup() {
    this.remarkFollowupForm.reset();
    this.remarkFollowupFormsubmitted = false;
    this.remarkScheduleFollowup = false;
  }
}
