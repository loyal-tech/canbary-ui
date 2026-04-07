import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Table } from "primeng/table";
import { PrimeNGConfig } from "primeng/api";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-cust-change-plan",
  templateUrl: "./cust-change-plan.component.html",
  styleUrls: ["./cust-change-plan.component.css"]
})
export class CustChangePlanComponent implements OnInit {
  @Input() custData: any;
  @Input() currentPlanDetails: any;
  @Input() planList: any;
  @Output() backButton = new EventEmitter();
  @ViewChild("dt") table: Table;
  paymentOwnerId = null;
  selectedPlan: any[];
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" }
  ];
  planChangeForm: FormGroup;
  currentData = this.datepipe.transform(Date(), "yyyy-MM-dd");
  staffDataList = [];
  parentCustomerDialogType: any = "";
  showParentCustomerModel = false;
  customerSelectType: any = "";
  selectedParentCust: any;
  changePlansubmitted: boolean = false;
  newPlanId: any = null;
  changePlanType = null;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public datepipe: DatePipe,
    public commondropdownService: CommondropdownService,
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.currentPlanDetails.forEach(e => {
        e.newPlanName = e.planId;
      });
    }, 2000);
    this.primengConfig.ripple = true;
    this.commondropdownService.getPlanPurchaseType();
    this.planChangeForm = this.fb.group({
      // connectionNo: [null, Validators.required],
      // purchaseType: ["", Validators.required],
      // planId: ["", Validators.required],
      // planGroupId: ["", Validators.required],
      // planList: [""],
      paymentOwnerId: ["", Validators.required],
      // ChangePlanCategory: [""],
      // addonStartDate: [this.currentData],
      serviceName: [null],
      serviceNickName: [null],
      billableCustomerId: [""],
      isPaymentReceived: [false],
      externalRemark: [""],
      remarks: ["", Validators.required]
    });

    const userId = Number(localStorage.getItem("userId"));
    const userName = localStorage.getItem("loginUserName");
    const exists = this.staffSelectList.some(staff => staff.id === userId);
    if (!exists) {
      this.staffSelectList.push({
        id: userId,
        name: userName
      });
    }
    this.paymentOwnerId = userId;
    this.planChangeForm.patchValue({
      paymentOwnerId: userId
    });
  }

  changePlan() {
    this.changePlansubmitted = true;
  }

  //bill to
  modalOpenParentCustomer(type) {
    this.parentCustomerDialogType = type;
    this.showParentCustomerModel = true;
    this.customerSelectType = "Billable To";
    if (type === "parent") {
      this.customerSelectType = "Parent";
    }
    this.selectedParentCust = [];
  }

  //paymentFlagToggle
  paymentFlagToggle(e) {
    // this.planChangeForm.patchValue({ isPaymentReceived: !e.target.checked });
  }

  // Table Settings
  onActivityChange(event) {
    const value = event.target.value;
    if (value && value.trim().length) {
      const activity = parseInt(value);

      if (!isNaN(activity)) {
        this.table.filter(activity, "activity", "gte");
      }
    }
  }
  onDateSelect(value) {
    this.table.filter(this.formatDate(value), "date", "equals");
  }
  formatDate(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = "0" + month;
    }

    if (day < 10) {
      day = "0" + day;
    }

    return date.getFullYear() + "-" + month + "-" + day;
  }
  onRepresentativeChange(event) {
    this.table.filter(event.value, "representative", "in");
  }

  selectedStaff: any = [];
  selectStaffType = "";
  staffSelectList: any = [];
  showSelectStaffModel = false;
  modalOpenSelectStaff(type) {
    this.parentCustomerDialogType = type;
    this.showSelectStaffModel = true;
    this.selectedStaff = [];
    this.selectStaffType = type;
    this.selectedStaff.push({
      id: Number(localStorage.getItem("userId")),
      name: localStorage.getItem("loginUserName")
    });
  }

  selectedStaffChange(event) {
    this.showSelectStaffModel = false;
    let data = event;
    this.staffSelectList = [
      {
        id: Number(data.id),
        name: data.username
      }
    ];

    if (this.selectStaffType == "paymentCharge") {
      this.planChangeForm.patchValue({
        paymentOwnerId: data.id
      });
    }
  }

  removeSelectStaff() {
    this.staffSelectList = [];
  }

  closeSelectStaff() {
    this.showParentCustomerModel = false;
  }
}
