import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { PlanManagementService } from "src/app/service/plan-management.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { element } from "protractor";
import * as moment from "moment";

declare var $: any;

@Component({
  selector: "app-cust-service-management",
  templateUrl: "./cust-service-management.component.html",
  styleUrls: ["./cust-service-management.component.css"]
})
export class CustServiceManagementComponent implements OnInit {
  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;
  customerId: number = 0;
  custType: String = "";
  custData: any = {};
  today: string;
  isLeadMaster: boolean = false;
  isServiceThroughLead: number = 1;
  ifcustCaf: boolean = false;
  @Output() custPlanMappping = new EventEmitter();
  @Output() backButton = new EventEmitter();
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  custCurrentPlanList = [];
  serviceForm: FormGroup;
  planGroupForm: FormGroup;
  servicePlanFormArray: FormArray;
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" }
  ];
  isInvoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  filterPlanData: any = [];
  planByServiceArea: any = [];
  plantypaSelectData: any = [];
  servicePlanItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  servicePlantotalRecords: String;
  currentPageServicePlan = 1;
  submitted: boolean = false;
  plansubmitted: boolean = false;
  isPlanCategoryGroup: boolean = false;
  addServicePlanData: any = [];
  planGroup: any = [];
  customercurrenrCustListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customercurrenrCustListdatatotalRecords: String;
  currentPagecustomercurrenrCustListdata = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pausePlatbtnCondition = "";
  selectDeactivateReason: string = "";
  deactiveDataList: any = [];
  ifselecResonType: any;
  servicePerticularData: any = [];
  iscustomerEdit = false;
  ifcustomerDiscountField: boolean = false;
  selectedParentCust: any = [];
  billableCusList: any = [];
  newFirst = 0;
  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  prepaidParentCustomerList: any;
  parentCustomerListdatatotalRecords: any;
  parentFieldEnable = false;
  searchParentCustValue = "";
  searchParentCustOption = "";
  dateTime = new Date();
  discountType: any = "One-time";
  serviceStropRemarks: string = "";
  invoiceTypes = [
    { label: "Group", value: "Group" },
    { label: "Independent", value: "Independent" }
  ];
  nextApproverId: any;
  rejectPlanSubmitted: boolean = false;
  assignedPlanid: any;
  assignPlansubmitted: boolean = false;
  assignPlanForm: FormGroup;
  rejectPlanForm: FormGroup;
  staffUserId: any;
  loggedInUser: any;
  searchkey: string;
  searchKeyType: any;
  customerServiceMappingId: any;
  // assignPLANForm: FormGroup;
  rejectCustomerCAFForm: FormGroup;
  setplanMode = "";
  setplanGroupType = "";
  setplanCategory = "";
  serviceStartPuase: boolean = false;
  custServMappingStatus: any;
  data: any = [];
  failcount: any;
  custtype: any;
  countryCode: any;
  cafno: any;
  calendarType: any;
  partnerid: any;
  serviceareaid: any;
  status: any;
  billTo: any;
  billableCustomerId: any;
  isInvoiceToOrg: any;
  planMappingList: any = [];
  addressList: any = [];
  paymentDetails: any;
  dunningCategory: any;
  assignPlanID: any;
  approvableStaff: any = [];
  selectStaff: any;
  selectStaffReject: any;
  approvePlanData = [];
  approved = false;
  rejectPlanData = [];
  reject = false;
  serviceAreaBYserviceList = [];
  planList = [];
  //   planNameOpen: boolean = false;
  isSerialNumberShow: boolean = false;
  planForConnection;
  custCurrentPlanListLength: number;
  serialNumber: any;
  displaySelectParentCustomer: boolean = false;
  customerSelectType: any;
  displayDeleteReason: boolean = false;
  displayAuditDetails: boolean = false;
  // displayShiftLocationDetails: boolean = false;
  ifModelIsShow: boolean = false;
  displayApprovePlan: boolean = false;
  assignApporvePlanModal: boolean = false;
  createServiceAccess: boolean = false;
  serviceTerminationAccess: boolean = false;
  showPlanConnectionNo: boolean = false;
  rejectPlanModal: boolean = false;
  serviceHoldAccess: boolean = false;
  serviceStopAccess: boolean = false;
  serviceResumeDate: any;
  holdDays: any;
  isGracePeriodModel: boolean;
  gracePeriod: string;
  gracePeriodData: any;
  holdDaysOptions: any[];
  discountList: any = [];
  discountValue: any;
  ifdiscounAllow: boolean = true;
  disabledDiscExpiryDate: boolean = false;
  isExpiredDate: boolean = false;
  discountValueStore: any = [];
  addServiceModal: boolean = false;
  generateCreditDoc: boolean = true;
  disableStopButton: boolean = false;
  // Format: YYYY-MM-DD
  // isSelectStaff:boolean = false;
  constructor(
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private planManagementService: PlanManagementService,
    public PaymentamountService: PaymentamountService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private router: Router,
    private systemService: SystemconfigService,
    private route: ActivatedRoute,
    loginService: LoginService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.createServiceAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_SERVICE_CREATE
        : POST_CUST_CONSTANTS.POST_CUST_SERVICE_CREATE
    );
    this.serviceTerminationAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_SERVICE_TERMINATION
        : POST_CUST_CONSTANTS.POST_CUST_SERVICE_TERMINATION
    );
    this.serviceHoldAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_SERVICE_HOLD_RESUME
        : POST_CUST_CONSTANTS.POST_CUST_SERVICE_HOLD_RESUME
    );

    this.serviceStopAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_SERVICE_STOP
        : POST_CUST_CONSTANTS.POST_CUST_SERVICE_STOP
    );
  }

  ngOnInit(): void {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split("T")[0];
    this.systemService.getConfigurationByName("ServiceThroughLead").subscribe((res: any) => {
      this.isServiceThroughLead = res.data.value;
    });
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;

    this.getCustomersDetail(this.customerId);
    this.serviceForm = this.fb.group({
      parentCustomerId: [""],
      planCategory: [""],
      billTo: [""],
      billableCustomerId: [""],
      isInvoiceToOrg: [false],
      discount: ["", [Validators.max(99)]],
      plangroupid: [""]
      //   istrialplan: [""]
    });

    this.planGroupForm = this.fb.group({
      discount: ["", [Validators.max(99)]],
      planId: ["", Validators.required],
      service: ["", Validators.required],
      serviceId: [""],
      validity: ["", Validators.required],
      offerprice: [""],
      validityUnit: [""],
      newAmount: [""],
      //   istrialplan: [""],
      discountType: [""],
      discountExpiryDate: [""],
      invoiceType: [""],
      serialNumber: [""],
      discountTypeData: [""]
    });

    this.assignPlanForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.rejectPlanForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.servicePlanFormArray = this.fb.array([]);
    this.commondropdownService.getBillToData();
    this.commondropdownService.planCreationType();
    if (this.custData.custtype == "Prepaid") {
      this.planGroup = this.commondropdownService.PrepaidPlanGroupDetails.filter(
        planGroup => planGroup.servicearea.id == this.custData.serviceareaid
      );
    } else {
      this.planGroup = this.commondropdownService.postPlanGroupDetails.filter(
        planGroup => planGroup.servicearea.id == this.custData.serviceareaid
      );
    }
    this.planGroupForm.get("discountType")?.valueChanges.subscribe(value => {
      const discountExpiryDateControl = this.planGroupForm.get("discountExpiryDate");
      const discountContrl = this.planGroupForm.get("discount");

      if (value?.toLowerCase() === "recurring") {
        discountExpiryDateControl?.setValidators(Validators.required);
        discountContrl?.setValidators(Validators.required);
      } else {
        discountExpiryDateControl?.clearValidators();
        discountContrl?.clearValidators();
      }

      discountExpiryDateControl?.updateValueAndValidity();
      discountContrl?.updateValueAndValidity();
    });
    this.getDectivateData();
    this.getLoggedinUserData();
    // this.planGroupForm.get("discount")?.valueChanges.subscribe(() => {
    //   this.updateDiscountExpiryValidator();
    // });

    // this.planGroupForm.get("discountType")?.valueChanges.subscribe(() => {
    //   this.updateDiscountExpiryValidator();
    // });
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.custData?.mvnoId
          : localStorage.getItem("mvnoId");
      this.commondropdownService.findAllplanGroups(mvnoId);
      this.systemService
        .getConfigurationByName("ServiceThroughLead", mvnoId)
        .subscribe((res: any) => {
          this.isServiceThroughLead = res.data.value;
        });
      this.commondropdownService.getplanservice(mvnoId);
      this.commondropdownService.getPostpaidplanData(mvnoId);
      this.getServiceByServiceAreaID(this.custData.serviceareaid);
      this.getPlanbyServiceArea(this.custData.serviceareaid);
      this.getActivePlanDetails();
    });
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }
  getLoggedinUserData() {
    let staffId = localStorage.getItem("userId");
    this.staffUserId = localStorage.getItem("userId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
  }

  openAddServiceModal() {
    if (this.isServiceThroughLead == 1 && !this.isLeadMaster) {
      this.confirmationService.confirm({
        header: "Alert",
        message:
          "You need to create lead first in order to add service. Do you want to create lead? (Yes/No)",
        icon: "pi pi-info-circle",
        accept: () => {
          if (this.commondropdownService.isPlanOnDemand) {
            this.router.navigate(["/home/enterprise-lead"], {
              queryParams: { id: this.custData.id }
            });
          } else {
            this.router.navigate(["/home/lead-management"], {
              queryParams: { id: this.custData.id }
            });
          }
        },
        reject: () => {
          return false;
        }
      });
    } else {
      this.planGroupForm.reset();
      this.serviceForm.reset();
      this.servicePlanFormArray = this.fb.array([]);
      this.filterPlanData = [];
      this.discountValueStore = [];
      var planCategory = "";
      if (this.custData.plangroupid) {
        this.isPlanCategoryGroup = false;
        planCategory = "groupPlan";
        // this.serviceForm.controls.plangroupid.patchValue(this.custData.plangroupid);
        // this.serviceForm.controls.discount.patchValue(this.custData.planMappingList[0].discount);
        // this.serviceForm.controls.isInvoiceToOrg.patchValue(
        //   this.custData.planMappingList[0].isInvoiceToOrg
        // );
      } else {
        this.isPlanCategoryGroup = false;
        planCategory = "individual";
        this.serviceForm.controls.plangroupid.disable();
        this.serviceForm.controls.discount.disable();
        this.serviceForm.controls.isInvoiceToOrg.disable();
      }

      if (this.custData.planMappingList.length > 0) {
        this.serviceForm.patchValue({
          parentCustomerId: this.custData.parentCustomerId,
          planCategory: planCategory,
          billTo:
            this.custData.planMappingList.length > 0 ? this.custData.planMappingList[0].billTo : "",
          billableCustomerId:
            this.custData.planMappingList.length > 0
              ? this.custData.planMappingList[0].billableCustomerId
              : "",
          isInvoiceToOrg:
            this.custData.planMappingList.length > 0
              ? this.custData.planMappingList[0].isInvoiceToOrg
              : ""
        });
      }

      this.addServiceModal = true;
    }
  }

  getServiceByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    let url = "/serviceArea/getAllServicesByServiceAreaId" + "?mvnoId=" + Number(mvnoId);
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.serviceAreaBYserviceList = response.dataList;
    });
  }

  isDiscountDisabledByIndex(index: number): boolean {
    return (
      this.iscustomerEdit ||
      !this.ifcustomerDiscountField ||
      this.disabledDiscExpiryDate ||
      index > 0
    );
  }
  createServiceFormGroup(index): FormGroup {
    const isDisabled = this.isDiscountDisabledByIndex(index);
    return this.fb.group({
      discount: [
        {
          value: this.planGroupForm.getRawValue().discount
            ? this.planGroupForm.getRawValue().discount
            : 0,
          disabled: isDisabled
        }
      ],
      planId: [this.planGroupForm.value.planId, Validators.required],
      service: [this.planGroupForm.value.service, Validators.required],
      serviceId: [
        this.serviceAreaBYserviceList
          .filter(data => this.planGroupForm.value.service.includes(data.name))
          .map(data => data.id)[0],
        Validators.required
      ],
      validity: [this.planGroupForm.value.validity, Validators.required],
      offerprice: [this.planGroupForm.value.offerprice],
      validityUnit: [this.planGroupForm.value.validityUnit],
      //   istrialplan: [this.planGroupForm.value.istrialplan],
      discountType: [
        {
          value: this.planGroupForm.getRawValue().discountType
            ? this.planGroupForm.getRawValue().discountType
            : 0,
          disabled: isDisabled
        }
      ],
      discountTypeData: [
        {
          value: this.planGroupForm.getRawValue().discountTypeData
            ? this.planGroupForm.getRawValue().discountTypeData
            : 0,
          disabled: isDisabled
        }
      ],
      discountExpiryDate: [
        {
          value:
            this.planGroupForm.value.discountType === "One-time"
              ? moment().utc(true).toDate()
              : this.planGroupForm.getRawValue().discountExpiryDate
                ? moment(this.planGroupForm.getRawValue().discountExpiryDate).utc(true).toDate()
                : null,
          disabled: isDisabled
        }
      ],
      invoiceType: [this.planGroupForm.value.invoiceType],
      serialNumber: [this.planGroupForm.value.serialNumber]
    });
  }
  planValidity = "";
  planunitValidity = "";
  onAddPlanServiceField() {
    if (this.planGroupForm.value.discountType === "Recurring" && this.isExpiredDate == false) {
      this.messageService.add({
        severity: "info",
        summary: "Discount!",
        detail: "Please add discount for this plan.",
        icon: "far fa-times-circle"
      });
      return;
    }
    this.plansubmitted = true;
    if (this.planGroupForm.valid) {
      const index = this.servicePlanFormArray.length;
      this.servicePlanFormArray.push(this.createServiceFormGroup(index));
      this.planGroupForm.reset();
      this.plansubmitted = false;
      this.planGroupForm.controls.discountType.setValue("One-time");
      this.discountType = "One-time";
    }
  }
  previousValue: number;
  discountChange(e, index) {
    if (this.planGroupForm.value.discountType === "Recurring") {
      let date = new Date();
      let expiryDate = moment(date).utc(true).toDate();
      this.planGroupForm.get("discountExpiryDate").setValue(expiryDate);
    }
    let newValue = parseFloat(e.target.value);

    if (newValue > 99.99) {
      e.target.value = "99";
    } else if (newValue < -99.99) {
      e.target.value = "-99";
    } else {
      this.previousValue = newValue;

      let lastvalue: any = 0;

      this.customerManagementService
        .getofferPriceWithTax(
          this.servicePlanFormArray.value[index].planId,
          this.servicePlanFormArray.value[index].discount,
          this.servicePlanFormArray.value[index].planGroupId
        )
        .subscribe((response: any) => {
          if (response.result.finalAmount) {
            lastvalue = response.result.finalAmount.toFixed(3);
          } else {
            lastvalue = 0;
          }
          this.planGroupForm.patchValue({
            discountPrice: Number(
              this.planGroupForm.value.discountPrice -
                this.discountValueStore[index].value +
                lastvalue
            ).toFixed(2)
          });

          this.discountValueStore[index].value = lastvalue;
        });
    }
  }
  discountChangeEvent(event, name: "plan" | "customer", index?: number) {
    const selectedValue = event.value;
    const selectedData = this.discountList.find(item => item.name === selectedValue);
    const discountAmount = selectedData?.amount || 0;
    this.discountPercentage(discountAmount, false);
    const discountexpirydate = selectedData?.validUpto
      ? moment(selectedData?.validUpto).utc(true).toDate()
      : null;

    if (name === "plan") {
      // Update plan form
      this.planGroupForm.get("discount")?.setValue(discountAmount);
      this.planGroupForm.get("discountExpiryDate")?.setValue(discountexpirydate);
      // Also sync to table row (if index is provided)
      if (typeof index === "number") {
        const row = this.servicePlanFormArray.at(index);
        if (row) {
          row.patchValue({ discount: discountAmount });
        }
      }
    } else if (name === "customer") {
      if (typeof index === "number") {
        const row = this.servicePlanFormArray.at(index);
        if (row) {
          row.patchValue({ discount: discountAmount });
        }
      }
    }
  }

  discountPercentage(value, isManual) {
    this.previousValue = value;
    this.isExpiredDate = true;
    if (isManual == false && value) {
      this.disabledDiscExpiryDate = true;
    } else {
      this.disabledDiscExpiryDate = false;
    }

    if (this.isPlanCategoryGroup) {
    } else {
      this.customerManagementService
        .getofferPriceWithTax(this.planGroupForm.value.planId, value)
        .subscribe((response: any) => {
          if (response.result.finalAmount) {
            this.discountValue = response.result.finalAmount.toFixed(3);
          } else {
            this.discountValue = 0;
          }
        });
    }
  }

  checkIfDiscount(planId) {
    let data: any;
    if (planId !== null && planId !== undefined && planId !== "") {
      data = this.plantypaSelectData.find(plan => plan.id === planId);

      if (data.allowdiscount) {
        this.ifdiscounAllow = false;
      } else {
        this.ifdiscounAllow = true;
      }
    } else {
      this.ifdiscounAllow = false;
    }
  }
  getPlanbyServiceArea(serviceAreaId) {
    if (serviceAreaId) {
      this.filterPlanData = [];
      let mvnoId =
        localStorage.getItem("mvnoId") === "1"
          ? this.custData?.mvnoId
          : localStorage.getItem("mvnoId");
      const url =
        "/plans/serviceArea?planmode=ALL&serviceAreaId=" + serviceAreaId + "&mvnoId=" + mvnoId;
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.planByServiceArea = response.postpaidplanList;
          this.filterPlanData = this.planByServiceArea.filter(
            plan => plan.plantype == this.custData.custtype
          );
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
  }

  serviceBasePlanDATA(event) {
    let planserviceData;
    let planServiceID = "";
    let planType = "";
    const servicename = event.value;
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const planserviceurl = "/planservice/all" + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
      //
      planserviceData = response.serviceList.filter(service => service.name === servicename);
      this.isSerialNumberShow = planserviceData[0].serviceParamMappingList.some(
        item => item.serviceParamName !== null && item.serviceParamName === "Product Required"
      );
      if (planserviceData.length > 0) {
        planServiceID = planserviceData[0].id;
        planType = this.custData.custtype;
        this.plantypaSelectData = [];
        this.postpaidplanByService(planServiceID, planType);
        // const planserviceurl = "/plansByTypeServiceModeStatusAndServiceArea";
        // this.customerManagementService
        //   .getPlansByTypeServiceModeStatusAndServiceAreaWithoutService(
        //     planserviceurl,
        //     this.custData.custtype,
        //     planServiceID,
        //     this.custData.serviceareaid,
        //     this.setplanMode,
        //     "Active",
        //     this.setplanGroupType
        //   )
        //   .subscribe((response: any) => {
        //     if (response.status == 200 && response.postPaidPlan.length > 0) {
        //       this.plantypaSelectData = response.postPaidPlan;
        //     } else {
        //       this.plantypaSelectData = [];
        //       this.messageService.add({
        //         severity: "info",
        //         summary: "Note ",
        //         detail: "Plan not available for this Plan type and service ",
        //       });
        //     }
        //   });

        //     // if (this.customerGroupForm.value.custtype) {
        //     console.log("this.filterPlanData", this.filterPlanData);
        //     this.plantypaSelectData = this.filterPlanData.filter(
        //       id =>
        //         id.serviceId === planServiceID &&
        //         (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
        //     );
        //     if (this.plantypaSelectData.length === 0) {
        //       this.messageService.add({
        //         severity: "info",
        //         summary: "Note ",
        //         detail:
        //           this.custData.custtype + " Plan not available for this customer type and service ",
        //         icon: "far fa-times-circle",
        //       });
        //     }
        //     // }
        //     // else {
        //     //   this.messageService.add({
        //     //     severity: 'info',
        //     //     summary: 'Required ',
        //     //     detail: 'Customer Type Field Required',
        //     //     icon: 'far fa-times-circle',
        //     //   });
        //     // }
      }
    });
  }

  postpaidplanByService(serviceId, planType) {
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    let url = `/postpaidplanByService/${serviceId}/${planType}?mvnoId=` + mvnoId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status == 200 && response.postPaidPlan.length > 0) {
          this.plantypaSelectData = response.postPaidPlan.filter(
            key => key.plantype === this.custType
          );
        } else {
          this.plantypaSelectData = [];
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Plan not available for this Plan type and service "
          });
        }
      },
      error => {
        this.plantypaSelectData = [];
        this.messageService.add({
          severity: "info",
          summary: "Note ",
          detail: "Plan not available for this Plan type and service "
        });
      }
    );
  }
  pageChangedPlanService(pageNumber) {
    this.currentPageServicePlan = pageNumber;
  }

  deleteConfirmonChargeField(planFieldIndex: number) {
    if (planFieldIndex || planFieldIndex === 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Plan?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemovePayMapping(planFieldIndex);
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    }
  }

  async onRemovePayMapping(planFieldIndex: number) {
    this.servicePlanFormArray.removeAt(planFieldIndex);
  }

  getPlanValidity(event) {
    this.planGroupForm.get("discountTypeData")?.reset();
    const planId = event.value;
    this.checkIfDiscount(planId);
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url = "/postpaidplan/" + planId + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        const planDetailData = response.postPaidPlan;
        if (response.postPaidPlan.allowdiscount == true) {
          this.planGroupForm.patchValue({ discount: null });
          this.ifcustomerDiscountField = true;
        } else {
          this.planGroupForm.patchValue({ discount: null });
          this.ifcustomerDiscountField = false;
        }
        this.planGroupForm.patchValue({
          validity: Number(planDetailData.validity),
          offerprice: Number(planDetailData.offerprice),
          newAmount: Number(planDetailData.offerprice),
          validityUnit: planDetailData.unitsOfValidity
        });
        this.discountValue = planDetailData.offerprice;
        this.planGroupForm.controls.validity.disable();
        this.discountList = planDetailData?.discountList;
        this.planGroupForm.controls.discountType.setValue("One-time");
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

  discountKeyDown(event: KeyboardEvent) {
    if (this.planGroupForm.value.discountType === "Recurring") {
      const control = this.planGroupForm.get("discount");
      // ✅ HARD STOP if disabled
      if (control?.disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
    }

    // event.preventDefault();
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    let maxValue: number = Number(99.99);
    let minValue: number = Number(-99.99);
    if (
      event.keyCode === 8 ||
      (event.key >= "0" && event.key <= "9") ||
      event.key === "-" ||
      (event.key === "." && inputElement.value.indexOf(".") === -1) // Allow only one decimal point
    ) {
      if (event.key !== "-" && event.keyCode !== 8) {
        let value = inputElement.value + event.key;

        if (parseFloat(value) <= maxValue && parseFloat(value) >= minValue) {
          this.discountPercentage(value, true);
          return true;
        } else {
          return false;
        }
      } else if (event.keyCode === 8) {
        const updatedValue = currentValue.slice(0, -1);

        if (parseFloat(updatedValue) <= maxValue && parseFloat(updatedValue) >= minValue) {
          this.discountPercentage(updatedValue, true);
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  //   previousValue: number;
  //   discountChange(e, index) {
  //     if (this.planGroupForm.value.discountType === "Recurring") {
  //       let date = new Date();
  //       let expiryDate = moment(date).utc(true).toDate();
  //       this.planGroupForm.get("discountExpiryDate").setValue(expiryDate);
  //     }
  //     let newValue = parseFloat(e.target.value);

  //     if (newValue > 99.99) {
  //       e.target.value = "99";
  //     } else if (newValue < -99.99) {
  //       e.target.value = "-99";
  //     } else {
  //       this.previousValue = newValue;

  //       let lastvalue: any = 0;

  //       this.customerManagementService
  //         .getofferPriceWithTax(
  //           this.servicePlanFormArray.value[index].planId,
  //           this.servicePlanFormArray.value[index].discount,
  //           this.servicePlanFormArray.value[index].planGroupId
  //         )
  //         .subscribe((response: any) => {
  //           if (response.result.finalAmount) {
  //             lastvalue = response.result.finalAmount.toFixed(3);
  //           } else {
  //             lastvalue = 0;
  //           }
  //           this.planGroupForm.patchValue({
  //             discountPrice: Number(
  //               this.planGroupForm.value.discountPrice -
  //                 this.discountValueStore[index].value +
  //                 lastvalue
  //             ).toFixed(2)
  //           });

  //           this.discountValueStore[index].value = lastvalue;
  //         });
  //     }
  //   }

  addPlanService() {
    if (this.serviceForm.valid) {
      this.addServicePlanData = this.custData;
      this.addServicePlanData.planMappingList = [];
      // if (this.serviceForm.controls.planCategory.value == "groupPlan") {
      //   //this.addServicePlanData = this.serviceForm.getRawValue();
      //   this.addServicePlanData.id = this.custData.id;
      //   // this.addServicePlanData.custtype = "Prepaid";
      //   // this.addServicePlanData.serviceareaid = this.custData.serviceareaid;
      //   this.addServicePlanData.planMappingList = [];
      //   console.log("this.addServicePlanData", this.addServicePlanData);
      //   this.planServiceAdd(this.addServicePlanData);
      // } else {
      //this.addServicePlanData = this.serviceForm.getRawValue();
      this.addServicePlanData.id = this.custData.id;
      // this.addServicePlanData.custtype = "Prepaid";
      // this.addServicePlanData.serviceareaid = this.custData.serviceareaid;
      this.addServicePlanData.planMappingList = this.servicePlanFormArray.getRawValue();

      this.addServicePlanData.planMappingList.forEach(plan => {
        plan.planCategory = this.serviceForm.controls.planCategory.value;
        plan.billTo = this.serviceForm.controls.billTo.value;
        plan.billableCustomerId = this.serviceForm.controls.billableCustomerId.value;
        plan.newAmount = plan.offerprice;
        plan.isInvoiceToOrg = this.serviceForm.controls.isInvoiceToOrg.value;
      });

      if (this.addServicePlanData.planMappingList.length <= 0) {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Please add atleast one service and plan",
          icon: "far fa-times-circle"
        });
      } else {
        this.planServiceAdd(this.data);
      }
    }
    // }
  }
  planServiceAdd(data) {
    let id = this.addServicePlanData.id;
    this.failcount = this.addServicePlanData.failcount;
    this.custtype = this.addServicePlanData.custtype;
    this.countryCode = this.addServicePlanData.countryCode;
    this.cafno = this.addServicePlanData.cafno;
    this.calendarType = this.addServicePlanData.calendarType;
    this.partnerid = this.addServicePlanData.partnerid;
    this.serviceareaid = this.addServicePlanData.serviceareaid;
    this.status = this.addServicePlanData.status;
    this.billTo = this.addServicePlanData.billTo;

    this.billableCustomerId = this.addServicePlanData.billableCustomerId;
    this.isInvoiceToOrg = this.addServicePlanData.isInvoiceToOrg;
    this.planMappingList = this.addServicePlanData.planMappingList;
    this.addressList = this.addServicePlanData.addressList;
    this.paymentDetails = this.addServicePlanData.paymentDetails;
    this.dunningCategory = this.addServicePlanData.dunningCategory;
    this.data = {
      id: id,
      failcount: this.failcount,
      custtype: this.custtype,
      countryCode: this.countryCode,
      cafno: this.cafno,
      calendarType: this.calendarType,
      partnerid: this.partnerid,
      serviceareaid: this.serviceareaid,
      status: this.status,
      billTo: this.billTo,
      billableCustomerId: this.billableCustomerId,
      isInvoiceToOrg: this.isInvoiceToOrg,
      planMappingList: this.planMappingList,
      addressList: this.addressList,
      paymentDetails: this.paymentDetails,
      dunningCategory: this.dunningCategory
    };
    //console.log("data",this.data)

    let url: any = "";
    if (this.isLeadMaster) {
      url = "/AdoptSalesCrmsBss/leadMaster/addNewService";
    } else {
      url = "/subscriber/addNewService";
    }

    this.customerManagementService.postMethod(url, this.data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.serviceForm.reset();
          this.planGroupForm.reset();
          this.submitted = false;
          this.plansubmitted = false;
          this.servicePlanFormArray.controls = [];
          this.router.navigate(["/home/customer-caf/" + this.custType]);
          this.addServiceModal = false;
          this.getActivePlanDetails();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Service added successfully. You can check it in Customer CAF.",
            icon: "far fa-check-circle"
          });
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

  getActivePlanDetails() {
    let url: any;

    if (this.ifcustCaf) {
      url =
        "/subscriber/getCustServiceByCustId/" +
        this.customerId +
        "?status=NewActivation" +
        "&isNotChangePlan=true";
    } else {
      url =
        "/subscriber/getCustServiceByCustId/" +
        this.customerId +
        "?isAllRequired=true" +
        "&isNotChangePlan=true";
    }
    this.serviceStopBulkFlag = false;
    this.serviceStopId = [];
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        // if (response.responseCode == 200) {
        this.custCurrentPlanList = response.dataList;
        this.custCurrentPlanList = this.custCurrentPlanList.sort((a, b) => a.custId - b.custId);
        if (this.custCurrentPlanList == null) {
          this.custCurrentPlanList = [];
        }
        // this.custCurrentPlanList = this.custCurrentPlanList.filter(
        //   data => data.custPlanStatus == "Active" || data.custPlanStatus == "ACTIVE"
        // );

        if (this.custCurrentPlanList.length > 0) {
          this.pausePlatbtnCondition = this.custCurrentPlanList[0].custPlanStatus;
          this.servicePerticularData = this.custCurrentPlanList[0];
          this.SelectplanDataValue(this.custCurrentPlanList[0].planId);
        }
        this.custCurrentPlanList.forEach(e => {
          if (e.custPlanStatus == "ACTIVE") {
            this.serviceStartPuase = true;
          } else {
            if (e.stopServiceDate) this.serviceStartPuase = false;
            else this.serviceStartPuase = true;
          }
          //           if (e.isServiceThroughLead != null) {
          //             this.isServiceThroughLead = e.isServiceThroughLead;
          //           }
        });
        this.custCurrentPlanList = this.custCurrentPlanList.filter(
          element =>
            element.custServMappingStatus !== "ActivationPending" &&
            element.custServMappingStatus !== "NewActivation"
        );

        // } else {
        //
        //   this.messageService.add({
        //     severity: "error",
        //     summary: "Error",
        //     detail: response.responseMessage,
        //     icon: "far fa-times-circle",
        //   });
        // }
      },
      (error: any) => {
        // console.log(error, "error")
        this.custCurrentPlanList = [];
        this.planList = [];
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  SelectplanDataValue(planId) {
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url = "/postpaidplan/" + planId + "?mvnoId=" + mvnoId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      let viewPlanListData = response.postPaidPlan;
      this.setplanMode = viewPlanListData.mode;
      this.setplanGroupType = viewPlanListData.planGroup;
      this.setplanCategory = viewPlanListData.category;
      this.planValidity = viewPlanListData.validity;
      this.planunitValidity = viewPlanListData.unitsOfValidity;
    });
  }
  pageChangedcustomercurrenrCustListData(pageNumber) {
    this.currentPagecustomercurrenrCustListdata = pageNumber;
    //this.getActivePlanDetails();
  }

  TotalCurrentPlanItemPerPage(event) {
    this.customercurrenrCustListdataitemsPerPage = Number(event.value);
    if (this.currentPagecustomercurrenrCustListdata > 1) {
      this.currentPagecustomercurrenrCustListdata = 1;
    }
    // this.getActivePlanDetails();
  }

  deleteServicePlanData() {
    let planMapId = this.servicePerticularData.planmapid;
    let custId = this.servicePerticularData.custId;
    let planId = this.servicePerticularData.planId;

    let data1 = {};

    if (!this.serviceStopBulkFlag) {
      const url =
        "/subscriber/deleteService/" +
        planId +
        "?custId=" +
        custId +
        "&planMapId=" +
        planMapId +
        "&reasonId=" +
        this.selectDeactivateReason;
      this.customerManagementService.postMethod(url, data1).subscribe(
        (response: any) => {
          if (response.responseCode == 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getActivePlanDetails();
            this.displayDeleteReason = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
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
    } else {
      let data;
      let terminateService = [];
      this.serviceStopId.map(e => {
        terminateService.push({
          custPlanMappingId: e.planmapid
        });
      });
      data = {
        customerId: this.serviceStopId[0].custId,
        serviceStopBulkFlag: this.serviceStopBulkFlag,
        reason: this.selectDeactivateReason,
        terminateService: terminateService
      };
      const url = "/subscriber/terminateServiceInBulk";
      this.customerManagementService.postMethod(url, data).subscribe(
        (response: any) => {
          if (response.responseCode == 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.displayDeleteReason = false;
            this.getActivePlanDetails();
            this.serviceStopBulkFlag = false;
            this.serviceStopId = [];
            // this.custPlanMappping.emit();
          }
        },
        (error: any) => {
          if (error.status === 402) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: error.error?.ERROR,
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error?.ERROR || "Something went wrong",
              icon: "far fa-times-circle"
            });
          }
        }
      );
    }
  }

  pauseService() {
    let custId = this.servicePerticularData.custId;
    let data;

    if (!this.serviceStopBulkFlag) {
      data = {
        custId: custId,
        deactivatePlanReqModels: [
          {
            custServiceMappingId: this.servicePerticularData.customerServiceMappingId,
            remarks: this.serviceStropRemarks,
            reasonId: this.selectDeactivateReason,
            serviceResumeDate: this.serviceResumeDate,
            generateCreditDoc: this.generateCreditDoc
          }
        ],
        serviceResumeDate: this.serviceResumeDate,
        holdDays: this.holdDays
      };
    } else {
      let deactivatePlanReqModels = [];
      this.serviceStopId.map(e => {
        deactivatePlanReqModels.push({
          custServiceMappingId: e.customerServiceMappingId,
          remarks: this.serviceStropRemarks,
          reasonId: this.selectDeactivateReason
        });
      });
      data = {
        custId: custId,
        serviceStopBulkFlag: this.serviceStopBulkFlag,
        deactivatePlanReqModels: deactivatePlanReqModels,
        holdDays: this.holdDays
      };
    }
    const url = "/subscriber/holdServiceInBulk";
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.displayDeleteReason = false;
          this.serviceStopBulkFlag = false;
          this.serviceStopId = [];
          this.getActivePlanDetails();
          // this.custPlanMappping.emit();
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
  playService() {
    let data;
    let custId = this.servicePerticularData.custId;
    if (!this.serviceStopBulkFlag) {
      data = {
        custId: custId,
        deactivatePlanReqModels: [
          {
            custServiceMappingId: this.servicePerticularData.customerServiceMappingId,
            remarks: this.serviceStropRemarks
          }
        ]
      };
    } else {
      let deactivatePlanReqModels = [];
      this.serviceStopId.map(e => {
        deactivatePlanReqModels.push({
          custServiceMappingId: e.customerServiceMappingId,
          remarks: this.serviceStropRemarks
        });
      });
      data = {
        custId: this.custData.id,
        serviceStopBulkFlag: this.serviceStopBulkFlag,
        deactivatePlanReqModels: deactivatePlanReqModels
      };
    }
    const url = "/subscriber/resumeServiceInBulk";
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.displayDeleteReason = false;
          this.getActivePlanDetails();
          this.serviceStopBulkFlag = false;
          this.serviceStopId = [];
          // this.custPlanMappping.emit();
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
        this.displayDeleteReason = false;
        this.getActivePlanDetails();
        this.serviceStopBulkFlag = false;
        this.serviceStopId = [];
      }
    );
  }

  saveEditNickName(serviceMappingID, nickName) {
    let data = {};
    const url = `/subscriber/nickName?custServiceMappingId=${serviceMappingID}&name=${nickName}`;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.getActivePlanDetails();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Successfully",
            icon: "far fa-check-circle"
          });
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

  openPaushSearviceMedel(data, type) {
    const updateState = () => {
      this.ifselecResonType = type;
      this.servicePerticularData = data;
      this.selectDeactivateReason = "";
      this.serviceStropRemarks = "";
      this.displayDeleteReason = true;
      if (type === "Pause") {
        this.holdDaysOptions = this.getHoldDaysOptions();
      }
    };

    if (type === "Delete" && data.isChildExists) {
      this.confirmationService.confirm({
        message: "Child customer service also terminate, Do you want to continue ?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => updateState(),
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    } else {
      updateState();
    }
  }

  getDectivateData() {
    let url = `/commonList/generic/DEACTIVATE_REASON_EZ_BILL`;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.deactiveDataList = response.dataList;
    });
  }

  modalOpenParentCustomer() {
    this.displaySelectParentCustomer = true;
    this.customerSelectType = "Billable To";
    this.selectedParentCust = [];

    // this.newFirst = 0;
    // this.getParentCustomerData();
    // this.selectedParentCust = [];
  }

  getParentCustomerData() {
    let currentPage;
    // if (pageData) {
    //   currentPage = pageData + 1;
    // } else {
    currentPage = this.currentPageParentCustomerListdata;
    // }

    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url =
      "/parentCustomers/list/" + RadiusConstants.CUSTOMER_TYPE.PREPAID + "?mvnoId=" + mvnoId;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.prepaidParentCustomerList = response.parentCustomerList;
        const list = this.prepaidParentCustomerList;
        const filterList = list.filter(cust => cust.id !== this.custData.id);

        this.prepaidParentCustomerList = filterList;

        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
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

  selParentSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  searchParentCustomer() {
    const searchParentData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageParentCustomerListdata,
      pageSize: this.parentCustomerListdataitemsPerPage
    };

    searchParentData.filters[0].filterValue = this.searchParentCustValue;
    searchParentData.filters[0].filterColumn = this.searchParentCustOption.trim();
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url =
      "/parentCustomers/search/" + RadiusConstants.CUSTOMER_TYPE.PREPAID + "?mvnoId=" + mvnoId;
    // console.log("this.searchData", this.searchData)
    this.customerManagementService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        if (response.status == 204) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.msg,
            icon: "far fa-times-circle"
          });
          // this.customerListData = [];
          this.parentCustomerListdatatotalRecords = 0;
        } else {
          this.prepaidParentCustomerList = response.parentCustomerList;
          const list = this.prepaidParentCustomerList;
          const filterList = list.filter(cust => cust.id !== this.custData.id);
          this.prepaidParentCustomerList = filterList;
          this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
        }
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  paginate(event) {
    this.currentPageParentCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchParentCustValue) {
      this.searchParentCustomer();
    } else {
      this.getParentCustomerData();
    }
  }

  selectedCustChange(event) {
    this.displaySelectParentCustomer = false;
    this.selectedParentCust = event;

    this.billableCusList = [
      {
        id: this.selectedParentCust.id,
        name: this.selectedParentCust.name
      }
    ];
    this.serviceForm.patchValue({
      billableCustomerId: this.selectedParentCust.id
    });
    this.serviceForm.updateValueAndValidity();
  }

  closeParentCust() {
    this.displaySelectParentCustomer = false;
  }

  removeSelParentCust() {
    this.selectedParentCust = [];
    this.billableCusList = [];
    this.serviceForm.patchValue({
      billableCustomerId: null
    });
  }
  newActivationFlag: boolean = false;
  approvePlanOpen(planId, nextApproverId, serviceMappingId, status) {
    if (status === "NewActivation") this.newActivationFlag = true;
    else this.newActivationFlag = false;
    this.approved = false;
    this.selectStaff = null;
    this.approvePlanData = [];
    this.assignApporvePlanModal = true;
    this.assignPlanID = planId;
    this.nextApproverId = nextApproverId;
    this.customerServiceMappingId = serviceMappingId;
    // this.rejectPlanForm.reset();
    this.rejectPlanSubmitted = false;
  }

  pickModalOpen(data) {
    let url =
      "/workflow/pickupworkflow?eventName=CUSTOMER_SERVICE_TERMINATION&entityId=" +
      data?.customerServiceMappingId;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getActivePlanDetails();

        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
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

  rejectPlanOpen(planId, nextApproverId, mappingId, status) {
    if (status === "NewActivation") this.newActivationFlag = true;
    else this.newActivationFlag = false;
    this.reject = false;
    this.selectStaff = null;
    this.rejectPlanData = [];
    this.rejectPlanModal = true;
    this.assignPlanID = planId;
    this.nextApproverId = nextApproverId;
    this.customerServiceMappingId = mappingId;
    // this.rejectPlanForm.reset();
    this.rejectPlanSubmitted = false;
  }

  StaffReasignList(data) {
    this.customerServiceMappingId = data.customerServiceMappingId;
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.customerServiceMappingId}&eventName=CUSTOMER_SERVICE_TERMINATION`;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.assignedPlanid = data.id;
        this.approvableStaff = [];
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
        if (response.dataList != null) {
          this.approvableStaff = response.dataList;
          this.approved = true;
          this.displayApprovePlan = true;
        } else {
          this.displayApprovePlan = false;
        }
      },
      (error: any) => {
        // console.log(error, "error");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  reassignWorkflow() {
    let url: any;
    // this.remarks = this.assignPlanForm.controls.remark;
    if (this.customerServiceMappingId != null) {
      url = `/teamHierarchy/reassignWorkflow?entityId=${this.customerServiceMappingId}&eventName=CUSTOMER_SERVICE_TERMINATION&assignToStaffId=${this.selectStaff}&remark=${this.assignPlanForm.value.remark}`;

      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.displayApprovePlan = false;
          this.getActivePlanDetails();
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: "Assigned to the next staff successfully.",
              icon: "far fa-times-circle"
            });
          }
        },
        error => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please Aprove Before Reassigne",
        icon: "far fa-times-circle"
      });
    }
  }

  assignPlan() {
    this.assignPlansubmitted = true;
    this.approved = false;
    this.selectStaff = null;
    this.approvePlanData = [];
    if (this.assignPlanForm.valid) {
      let url;
      if (this.newActivationFlag)
        url = `/subscriber/approveCustomerServiceAdd?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=true&remarks=${this.assignPlanForm.controls.remark.value}`;
      else
        url = `/subscriber/approveCustomerServiceTermination?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=true&remarks=${this.assignPlanForm.controls.remark.value}`;
      let assignCAFData = {
        planId: this.assignPlanID,
        nextStaffId: "",
        flag: "approved",
        remark: this.assignPlanForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
      };

      this.planManagementService.getMethod(url).subscribe(
        (response: any) => {
          if (!this.searchkey && !this.searchKeyType) {
            // this.getPostoaidPlan("");
            this.getActivePlanDetails();
          } else {
            // this.searchPlan();
          }
          if (response.responseCode === 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });

            this.assignPlanForm.reset();
            this.assignPlansubmitted = false;
            if (response.dataList != null) {
              this.approvePlanData = response.dataList;
              this.approved = true;
            } else {
              this.assignApporvePlanModal = false;
            }
          }
          //   this.assignApporvePlanModal = false;
        },
        (error: any) => {
          // console.log(error, "error")

          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  closeRejectPlanModal() {
    this.rejectPlanModal = false;
  }

  closereassignWorkflow() {
    this.reassignWorkflow;
  }
  rejectPlan() {
    this.rejectPlanSubmitted = true;
    if (this.rejectPlanForm.valid) {
      let assignCAFData = {
        planId: this.assignPlanID,
        nextStaffId: "",
        flag: "Rejected",
        remark: this.rejectPlanForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
      };
      let url;
      if (this.newActivationFlag)
        url = `/subscriber/approveCustomerServiceAdd?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=false&remarks=${this.assignPlanForm.controls.remark.value}`;
      else
        url = `/subscriber/approveCustomerServiceTermination?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=false&remarks=${this.assignPlanForm.controls.remark.value}`;
      this.planManagementService.getMethod(url).subscribe(
        (response: any) => {
          if (!this.searchkey && !this.searchKeyType) {
            // this.getPostoaidPlan("");
            this.getActivePlanDetails();
          } else {
            // this.searchPlan();
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.rejectPlanForm.reset();
          this.rejectPlanSubmitted = false;
          if (response.dataList != null) {
            this.rejectPlanData = response.dataList;
            this.reject = true;
          } else {
            this.rejectPlanModal = false;
          }
        },
        (error: any) => {
          // console.log(error, "error")

          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }

  assignToStaff(flag) {
    let url: any;
    let event;
    if (this.newActivationFlag) event = "CUSTOMER_SERVICE_ADD";
    else event = "CUSTOMER_SERVICE_TERMINATION";
    if (flag == true) {
      if (this.selectStaff) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.customerServiceMappingId}&eventName=${event}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.customerServiceMappingId}&eventName=${event}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectStaffReject) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.customerServiceMappingId}&eventName=${event}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.customerServiceMappingId}&eventName=${event}&isApproveRequest=${flag}`;
      }
    }

    this.planManagementService.getMethod(url).subscribe(
      response => {
        this.assignApporvePlanModal = false;
        this.rejectPlanModal = false;
        // this.getPostoaidPlan("");
        this.getActivePlanDetails();

        this.assignApporvePlanModal = false;
      },
      error => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
    this.assignApporvePlanModal = false;
  }

  close() {
    this.assignApporvePlanModal = false;
  }

  openAddWorkFlow(id, auditcustid) {
    // this.displayShiftLocationDetails = true;
    this.ifModelIsShow = true;
    this.showPlanConnectionNo = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "CUSTOMER_SERVICE_ADD",
      planId: ""
    });
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
    // this.displayShiftLocationDetails = false;
  }

  openEditWorkFlow(id, auditcustid) {
    // this.displayShiftLocationDetails = true;
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "CUSTOMER_SERVICE_TERMINATION",
      planId: ""
    });
  }
  auditData: any = [];
  auditItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageAuditList = 1;
  audittotalRecords: String;

  openAudit(auditcustid) {
    this.displayAuditDetails = true;

    let currentPage;
    // if (pageData) {
    //   currentPage = pageData + 1;
    // } else {
    currentPage = this.currentPageAuditList;
    // }

    const data = {
      page: currentPage,
      pageSize: this.auditItemPerPage
    };
    const url = "/subscriber/servicestatusAudit/" + auditcustid;
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.auditData = response.data.content;
        this.audittotalRecords = response.data.totalElements;
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

  pageChangedauditList(pageNumber) {
    this.currentPageAuditList = pageNumber;
  }

  auditCloseModal() {
    this.displayAuditDetails = false;
    this.auditData = [];
  }
  serviceStopBulkFlag: boolean = false;

  closedisplayApprovePlan() {
    this.displayApprovePlan = false;
  }

  serviceStopId = [];

  isServiceResumeValid() {
    if (this.serviceStopBulkFlag) {
      return this.serviceStopId.some(x => x.custPlanStatus === "Hold");
    }
  }

  seviceStopBulk(data, e) {
    if (e.checked) {
      this.serviceStopBulkFlag = true;
      this.serviceStopId.push(data);
      if (this.serviceStopId.length > 0) {
        if (
          this.serviceStopId[0].custPlanStatus.toLowerCase() !== data.custPlanStatus.toLowerCase()
        ) {
          this.messageService.add({
            severity: "warn",
            summary: "Diffrent Service Selected",
            detail: "Please select service with same status!"
          });
          this.serviceStopBulkFlag = false;
        }
      }
    } else {
      let requiredIndex;
      this.serviceStopId.forEach((element, i) => {
        if (element.custPlanMapppingId == data.custPlanMapppingId) requiredIndex = i;
      });
      if (requiredIndex >= 0) this.serviceStopId.splice(requiredIndex);
      if (this.serviceStopId.length > 0) {
        let check = [];
        this.serviceStopId.forEach(element => {
          if (this.serviceStopId[0].custPlanStatus != element.custPlanStatus) check.push(element);
        });
        if (check.length == 0) this.serviceStopBulkFlag = true;
      }
      if (this.serviceStopId.length <= 0) this.serviceStopBulkFlag = false;
    }
    let customerPlans = this.serviceStopId?.map(data => {
      const status = data?.custPlanStatus?.toLowerCase().replace(/\s+/g, "") || "";
      const statusWorkflow = data?.custServMappingStatus?.toLowerCase() || "";

      let displayStatus = "";

      if (statusWorkflow === "new activation" || statusWorkflow === "rejected") {
        displayStatus = statusWorkflow;
      } else {
        displayStatus = status;
      }

      return { ...data, displayStatus };
    });
    this.disableStopButton = customerPlans.some(x => x.displayStatus?.toLowerCase() === "stop");
  }
  serviceStop() {
    this.confirmationService.confirm({
      message: "If Child customer is there child service also Stop, Do you want to continue ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        let deactivatePlanReqModels = [];
        let data: any;
        if (this.serviceStopBulkFlag) {
          this.serviceStopId.map(e => {
            deactivatePlanReqModels.push({
              custServiceMappingId: e.customerServiceMappingId,
              remarks: this.serviceStropRemarks,
              reasonId: this.selectDeactivateReason
            });
          });
          data = {
            custId: this.serviceStopId[0].custId,
            serviceStopBulkFlag: this.serviceStopBulkFlag,
            deactivatePlanReqModels: deactivatePlanReqModels
          };
        } else {
          deactivatePlanReqModels.push({
            custServiceMappingId: this.servicePerticularData.customerServiceMappingId,
            remarks: this.serviceStropRemarks,
            reasonId: this.selectDeactivateReason
          });
          data = {
            custId: this.servicePerticularData.custId,
            serviceStopBulkFlag: this.serviceStopBulkFlag,
            deactivatePlanReqModels: deactivatePlanReqModels
          };
        }

        const url = "/subscriber/stopServiceInBulk";
        this.customerManagementService.postMethod(url, data).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.displayDeleteReason = false;
              this.getActivePlanDetails();
              this.serviceStopBulkFlag = false;
              this.serviceStopId = [];
              // this.custPlanMappping.emit();
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
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "Rejected",
          detail: "You have rejected"
        });
        this.serviceStopBulkFlag = false;
        this.serviceStopId = [];
        this.selectDeactivateReason = "";
        this.serviceStropRemarks = "";
        this.displayDeleteReason = true;
      }
    });
  }
  chekcPlanGroup(plan, planList) {
    if (this.custData.plangroupid !== null) {
      let groupPlanList = planList.filter(item => item.plangroupid == plan.plangroupid);
      return groupPlanList[0] === plan;
    }
    return true;
  }

  getSerialNumber(plan) {
    return plan.customerInventorySerialnumberDtos.filter(item => item.primary).length > 0
      ? plan.customerInventorySerialnumberDtos.filter(item => item.primary)[0].serialNumber
      : "";
  }

  closeServicePlanData() {
    this.displayDeleteReason = false;
    this.ifselecResonType = "";
    this.selectDeactivateReason = "";
    this.serviceStropRemarks = "";
    this.servicePerticularData = null;
    this.holdDays = "";
  }

  openPlanConnectionModal(plan) {
    this.planForConnection = plan;
    this.showPlanConnectionNo = true;
  }

  closeDialog() {
    this.planForConnection = null;
    // this.planNameOpen = false;
    this.showPlanConnectionNo = false;
  }

  currentDate = new Date();
  serviceTerminationCheck(serviceEndDate, custPlanStatus) {
    if ((custPlanStatus == "Stop" || custPlanStatus == "STOP") && serviceEndDate) {
      serviceEndDate = new Date(serviceEndDate);
      if (serviceEndDate.getTime() < this.currentDate.getTime()) return false;
    }
    return true;
  }
  badgeTypeForStatus: any;
  displayStatus: any;
  checkStatus(planStatus, workflowStatus) {
    const status = planStatus?.toLowerCase().replace(/\s+/g, "") || "";
    const statusWorkflow = workflowStatus?.toLowerCase() || "";

    if (statusWorkflow === "new activation") {
      this.badgeTypeForStatus = "green";
      this.displayStatus = workflowStatus.toUpperCase();
    } else if (statusWorkflow === "rejected") {
      this.badgeTypeForStatus = "red";
      this.displayStatus = workflowStatus.toUpperCase();
    } else {
      this.displayStatus = planStatus.toUpperCase();

      switch (status) {
        case "active":
        case "ingrace":
          this.badgeTypeForStatus = "green";
          break;
        case "terminate":
        case "stop":
        case "inactive":
        case "expired":
          this.badgeTypeForStatus = "red";
          break;
        case "hold":
        case "disable":
        case "inprogress":
          this.badgeTypeForStatus = "grey";
          break;
        default:
          break;
      }
    }

    return true;
  }

  openReactivateModel(data, type) {
    if (type === "Start") {
      this.confirmationService.confirm({
        message: "Do You want To Change Service Status from Disable to Active",
        header: "Active Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.reactivateService(data);
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });
    }
  }

  reactivateService(serviceId) {
    const url = "/subscriber/activateServiceFromHold?serviceId=" + serviceId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.getActivePlanDetails();
        this.messageService.add({
          severity: "success",
          summary: "Service Activated Successfully",
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
  }

  keypress(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && event.keyCode != 9 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  openGracePeriod(service) {
    this.isGracePeriodModel = true;
    this.gracePeriod = "";
    this.gracePeriodData = service;
  }

  closeGracePeriod() {
    this.isGracePeriodModel = false;
    this.gracePeriodData = "";
    this.gracePeriod = "";
  }

  saveGracePeriod() {
    if (this.gracePeriod) {
      this.spinner.show();
      let gracedata = {
        custId: this.customerId,
        graceDays: Number(this.gracePeriod)
      };
      const url = "/extendGraceDays";
      this.customerManagementService.postMethod(url, gracedata).subscribe(
        (response: any) => {
          this.spinner.hide();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.msg,
            icon: "far fa-check-circle"
          });
          this.closeGracePeriod();
          this.gracePeriodData = [];
          this.getActivePlanDetails();
        },
        (error: any) => {
          this.spinner.hide();
          this.closeGracePeriod();
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
        }
      );
    }
  }
  validateHoldDays(event: any) {
    const value = parseInt(event.target.value, 10);
    if (value < 1) {
      event.target.value = 1;
      this.holdDays = 1;
    } else if (value > 31) {
      event.target.value = 31;
      this.holdDays = 31;
    }
  }

  getHoldDaysOptions() {
    const options = [];
    const maxAttempts = this.servicePerticularData?.remainingPauseDays || 0;

    for (let i = 1; i <= maxAttempts; i++) {
      options.push({
        label: `${i}`,
        value: i
      });
    }

    return options;
  }

  closeServiceModal() {
    this.addServiceModal = false;
  }
}
