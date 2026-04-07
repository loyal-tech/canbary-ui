import { DatePipe } from "@angular/common";

import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { countries } from "src/app/components/model/country";
import { ActivatedRoute, Router } from "@angular/router";
import { Regex } from "src/app/constants/regex";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { LeadManagementService } from "src/app/service/lead-management-service";

import { BehaviorSubject } from "rxjs";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { error } from "console";
declare var $: any;

@Component({
  selector: "app-add-service",
  templateUrl: "./add-service.component.html",
  styleUrls: ["./add-service.component.css"]
})
export class AddServiceComponent implements OnInit {
  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;
  customerId: number = 0;
  custType: String = "";
  custData: any = {};
  name: string = "Service";
  isLeadMaster: boolean = false;
  ifcustCaf: boolean = false;
  ifModelIsShow: boolean = false;
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  serviceForm: FormGroup;
  planGroupForm: FormGroup;
  servicePlanFormArray: FormArray;
  countries: any = countries;
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" }
  ];
  isInvoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];
  circuitStatus = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" }
  ];
  connectionTypeData = [
    { label: "Primary Line (PL)", value: "PL" },
    { label: "Secondary Line (SL)", value: "SL" },
    { label: "Tertiary Link (TL)", value: "TL" }
  ];

  typeOfLinkData = [
    { label: "Fiber (F)", value: "F" },
    { label: "Wireless (W)", value: "W" },
    { label: "GPON", value: "GPON" },
    { label: "FTTH", value: "FTTH" }
  ];
  locationDetailsData = [
    { label: "Router", value: "Router" },
    { label: "LT", value: "LT" },
    { label: "Switch", value: "Switch" },
    { label: "OLT", value: "OLT" },
    { label: "AP", value: "AP" },
    { label: "CPE", value: "CPE" },
    { label: "ONU", value: "ONU" },
    { label: "DB", value: "DB" },
    { label: "MDB", value: "MDB" },
    { label: "VLAN", value: "VLAN" }
  ];
  filterPlanData: any = [];
  planByServiceArea: any;
  plantypaSelectData: any;
  servicePlanItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  servicePlantotalRecords: String;
  currentPageServicePlan = 1;
  submitted: boolean = false;
  plansubmitted: boolean = false;
  isPlanCategoryGroup: boolean = false;
  addServicePlanData: any;
  planGroup: any = [];
  customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerCurrentPlanListdatatotalRecords: String;
  currentPagecustomerCurrentPlanListdata = 1;
  custCurrentPlanList: any = [];
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pausePlatbtnCondition = "";
  selectDeactivateReason: string = "";
  deactiveDataList: any;
  ifselecResonType: any;
  servicePerticularData: any;
  iscustomerEdit = false;
  ifcustomerDiscountField: boolean = false;
  selectedParentCust: any = [];
  billableCusList: any;
  newFirst = 0;
  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  prepaidParentCustomerList: any;
  parentCustomerListdatatotalRecords: any;
  parentFieldEnable = false;
  searchParentCustValue = "";
  searchParentCustOption = "";

  serviceStropRemarks: string = "";

  generalInfoForm: FormGroup;
  leaseCktForm: FormGroup;
  chargeForm: FormGroup;
  billingForm: FormGroup;
  servicePlanName: any;
  serviceparamsubmitted: boolean = false;

  serviceParticularData: any = [];
  serviceCircuitData: any = [];
  generalFormDto: any = [];
  generalStep: boolean = true;
  isServiceShow: boolean = false;
  generateCircuitName: any = "";
  serviceEditDetailData: any;
  servicelinkAcceptanceData: any;
  circuitPlanData: any;
  isServiceEdit: boolean = false;
  planServiceId: any;

  custCircuitChargeItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custCircuitChargetotalRecords: String;
  currentPageCircuitChargeDeatilList = 1;

  custCircuitProductItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custCircuitProducttotalRecords: String;
  currentPageCircuitProductDeatilList = 1;

  leadCustomerType: any;
  ifLeadQuickInput = false;
  quickplanID: any;
  mvnoid: any;
  staffid: any;
  newLeadId: any;
  serviceAreaListDisplay: any = [];
  displaySelectParentCustomer: boolean = false;
  constructor(
    private fb: FormBuilder,
    private commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    public PaymentamountService: PaymentamountService,
    private leadManagementService: LeadManagementService
  ) {}

  ngOnInit(): void {
    // start
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.getCustomersDetail(this.customerId);
  }

  isEnterpriseCust: boolean = false;

  // start

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;

    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custData = response.customers;
        this.initData();
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
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  initData() {
    this.serviceForm = this.fb.group({
      planCategory: [""],
      billTo: [""],
      billableCustomerId: [""],
      isInvoiceToOrg: [false],
      discount: ["", [Validators.max(99)]],
      plangroupid: [""],
      istrialplan: [""]
    });

    this.billingForm = this.fb.group({
      poName: [""],
      fullName: [""],
      city: [""],
      address1: [""],
      state: [""],
      country: [""],
      zipCode: [""]
    });

    this.chargeForm = this.fb.group({
      traiRate: [""],
      otcCharges: [""],
      serviceCharges: [""],
      addItem: [""],
      staticOrPooledIP: [""]
    });
    this.generalInfoForm = this.fb.group({
      circuitName: ["", Validators.required],
      cafNumber: ["", [Validators.pattern(Regex.numeric)]],
      customerName: ["", Validators.required],
      typeOfLink: ["", Validators.required],
      connectionType: ["", Validators.required],
      // branch: ["", Validators.required],
      //linkInstallationDate: ["", Validators.required],
      //purchaseOrderDate: ["", Validators.required],
      //expiryDate: [""],
      circuitStatus: ["Inactive"],
      uploadCaf: [""],
      acctNumber: [""],
      serviceType: ["", Validators.required],
      //linkAcceptanceDate: [""],
      circleName: [""],
      partner: ["1"],
      serviceAreaType: ["", Validators.required],
      location: ["", Validators.required],
      distance: ["", Validators.pattern(Regex.numeric)],
      // uploadQos: ["", Validators.required],
      linkRouterLocation: [""],
      linkRouterIp: [""],
      vlanId: [""],
      linkRouterName: [""],
      // bandwidth: [""],
      // downloadQos: [""],
      linkPortType: [""],
      linkPortOnRouter: [""],
      // bandWidthType: [""],
      circuitBillingId: [""],
      pop: [""],
      organisation: [""],
      associatedLevel: [""],
      locationLevel1: [""],
      locationLevel2: [""],
      locationLevel3: [""],
      locationLevel4: [""],
      baseStationId1: [""],
      baseStationId2: [""],
      originationCircle: [""],
      terminationCircle: [""],
      originationAddress: [""],
      terminationAddress: [""],
      originationAddress2: [""],
      terminationAddress2: [""],
      note: ["", [Validators.maxLength(250)]],
      contactPerson: ["", Validators.required],
      contactPerson1: [""],
      mobileNo: [
        "",
        [Validators.required, Validators.pattern(Regex.numeric), Validators.maxLength(15)]
      ],
      countryCode: ["+93", Validators.required],
      mobileNo1: ["", [Validators.pattern(Regex.numeric), Validators.maxLength(15)]],
      landlineNo: ["", [Validators.pattern(Regex.numeric), Validators.maxLength(15)]],
      landlineNo1: ["", [Validators.pattern(Regex.numeric), Validators.maxLength(15)]],
      email: ["", [Validators.required, Validators.email]],
      email1: ["", Validators.email],
      remark: ["", [Validators.maxLength(250)]],
      valleyType: [""],
      insideValley: [""]
    });

    //this.generalInfoForm.controls.circuitName.disable();
    this.commondropdownService.getsystemconfigList();

    this.planGroupForm = this.fb.group({
      // discount: ["", [Validators.max(99)]],
      // planId: ["", Validators.required],
      // planId: [""],
      // service: ["", Validators.required],
      // validity: ["", Validators.required],
      // offerprice: [""],
      // validityUnit: [""],
      newAmount: [""],
      // istrialplan: [""],
      leaseCktForm: this.fb.group({
        generalInfoForm: this.generalInfoForm,
        chargeForm: this.chargeForm,
        billingForm: this.billingForm
      })
    });

    this.generalInfoForm.controls.partner.disable();
    this.generalInfoForm.controls.uploadCaf.disable();
    this.servicePlanFormArray = this.fb.array([]);
    this.commondropdownService.getBillToData();
    this.commondropdownService.getplanservice();
    this.commondropdownService.getPartner();
    this.commondropdownService.getServiceAreaType();
    this.commondropdownService.getPop();
    this.commondropdownService.planCreationType();
    this.commondropdownService.getserviceAreaList();
    this.commondropdownService.getValleyTypee();
    this.commondropdownService.getInsideValley();
    this.commondropdownService.getOutsideValley();
    this.getPlanbyServiceArea(this.custData.serviceareaid);
    if (this.isLeadMaster) {
      this.getLeadServiceList();
    } else {
      this.getActivePlanDetails();
    }

    if (this.custData.custtype == "Prepaid") {
      this.planGroup = this.commondropdownService.PrepaidPlanGroupDetails.filter(
        planGroup => planGroup.servicearea.id == this.custData.serviceareaid
      );
    } else {
      this.planGroup = this.commondropdownService.postPlanGroupDetails.filter(
        planGroup => planGroup.servicearea.id == this.custData.serviceareaid
      );
    }

    this.getDectivateData();
    // end

    // this.leaseCktForm=this.fb.group({
    //   generalInfoForm:this.generalInfoForm,
    //   chargeForm:this.chargeForm,
    //   billingForm:this.billingForm

    // })

    this.assignPlanForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.rejectPlanForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.getLoggedinUserData();
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.staffid = Number(localStorage.getItem("userId"));
  }

  openAddServiceModal() {
    if (!this.isLeadMaster) {
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

      // if (this.commondropdownService.isPlanOnDemand) {
      //   $("#addServiceModal").modal("show");
      // } else {

      // this.confirmationService.confirm({
      //   header: "Alert",
      //   message:
      //     "You need to create lead first in order to add service. Do you want to create lead? (Yes/No)",
      //   icon: "pi pi-info-circle",
      //   accept: () => {
      //     this.router.navigate(["/home/lead-management"], {
      //       queryParams: { id: this.custData.id },
      //     });
      //   },
      //   reject: () => {
      //     return false;
      //   },
      // });

      // }
    } else {
      this.leadCustomerType = this.custData.custtype;
      this.ifLeadQuickInput = this.custData.isLeadQuickInv;

      if (this.ifLeadQuickInput == true) {
        let service =
          this.custData.planMappingList.length > 0 ? this.custData.planMappingList[0].service : "";
        this.quickplanID =
          this.custData.planMappingList.length > 0 ? this.custData.planMappingList[0].planId : "";
        this.generalInfoForm.patchValue({
          mobileNo: this.custData.mobile,
          countryCode: this.custData.countryCode,
          email: this.custData.email,
          serviceType: service
        });
      } else {
        this.generalInfoForm.patchValue({
          organisation: this.custData.organisation
        });
      }

      $("#addServiceModal").modal("show");
    }
  }

  totalActualPrice: any;
  createServiceFormGroup(): FormGroup {
    if (this.planDto.chargeList.length > 0) {
      let totalActualPrice = 0;
      this.planDto.chargeList.forEach(element => {
        totalActualPrice = totalActualPrice + element.actualprice;
      });
      this.totalActualPrice = totalActualPrice;
    }

    return this.fb.group({
      discount: [0, [Validators.max(99)]],
      planId: [null, Validators.required],
      service: [this.servicename, Validators.required],
      validity: [this.planDto.validity, Validators.required],
      offerprice: [this.totalActualPrice],
      validityUnit: [this.planDto.unitsOfValidity],
      istrialplan: [false],
      planname: [""]
      // leaseCktForm: [this.planGroupForm.value.leaseCktForm],
    });
  }
  planValidity = "";
  planunitValidity = "";
  linkAcceptanceDTO: any = {};
  linkAcceptanceDTO1: any = {};
  finalArray: any = [];
  isDTOReady: boolean = false;

  addAllFieldData() {
    this.serviceparamsubmitted = true;
    if (this.generalInfoForm.valid && this.planDto.length > 0) {
      this.generalFormDto = this.generalInfoForm.getRawValue();
      this.servicePlanFormArray.push(this.createServiceFormGroup());
      this.generalInfoForm.reset();
      this.generalInfoForm.controls.circuitStatus.setValue("Inactive");
      this.generalInfoForm.controls.countryCode.setValue("+93");
      this.serviceparamsubmitted = false;
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill the Details",
        icon: "far fa-times-circle"
      });
    }
  }

  generateCircuitNameFun() {
    let customerName = "";
    let branch = "";
    let serviceAreaType = "";
    let serviceType = "";
    let connectionType = "";
    let typeOfLink = "";
    let flag: Boolean = false;

    if (
      this.generalInfoForm.controls.customerName.value != null &&
      this.generalInfoForm.controls.customerName.value != ""
    ) {
      customerName = this.generalInfoForm.controls.customerName.value
        .split(/\s/)
        .reduce((response, word) => (response += word.slice(0, 1)), "");
      flag = true;
    }

    // if (
    //   this.generalInfoForm.controls.branch.value != null &&
    //   this.generalInfoForm.controls.branch.value != ""
    // ) {
    //   branch = this.generalInfoForm.controls.branch.value
    //     .split(/\s/)
    //     .reduce((response, word) => (response += word.slice(0, 1)), "");
    //   flag = true;
    // }

    if (
      this.generalInfoForm.controls.serviceAreaType.value != null &&
      this.generalInfoForm.controls.serviceAreaType.value != ""
    ) {
      if (flag) {
        serviceAreaType =
          "_" +
          this.generalInfoForm.controls.serviceAreaType.value
            .split(/\s/)
            .reduce((response, word) => (response += word.slice(0, 1)), "");
      } else {
        serviceAreaType = this.generalInfoForm.controls.serviceAreaType.value
          .split(/\s/)
          .reduce((response, word) => (response += word.slice(0, 1)), "");
      }
      flag = true;
    }

    if (
      this.generalInfoForm.controls.serviceType.value != null &&
      this.generalInfoForm.controls.serviceType.value != ""
    ) {
      if (flag) {
        serviceType =
          "_" + this.generalInfoForm.controls.serviceType.value.toUpperCase().replace(/\s+/g, "");
      } else {
        serviceType = this.generalInfoForm.controls.serviceType.value
          .toUpperCase()
          .replace(/\s+/g, "");
      }
      flag = true;
    }

    if (
      this.generalInfoForm.controls.connectionType.value != null &&
      this.generalInfoForm.controls.connectionType.value != ""
    ) {
      if (flag) {
        connectionType = "_" + this.generalInfoForm.controls.connectionType.value;
      } else {
        connectionType = this.generalInfoForm.controls.connectionType.value;
      }
      flag = true;
    }

    if (
      this.generalInfoForm.controls.typeOfLink.value != null &&
      this.generalInfoForm.controls.typeOfLink.value != ""
    ) {
      if (flag) {
        typeOfLink =
          "_" +
          this.generalInfoForm.controls.typeOfLink.value
            .split(/\s/)
            .reduce((response, word) => (response += word.slice(0, 1)), "");
      } else {
        typeOfLink = this.generalInfoForm.controls.typeOfLink.value
          .split(/\s/)
          .reduce((response, word) => (response += word.slice(0, 1)), "");
      }
    }

    this.generateCircuitName =
      customerName +
      "" +
      branch +
      "" +
      serviceAreaType +
      "" +
      serviceType +
      "" +
      connectionType +
      "" +
      typeOfLink;
    this.generalInfoForm.controls.circuitName.setValue(this.generateCircuitName);
  }

  movePlanDetail() {
    this.serviceparamsubmitted = true;
    if (this.generalInfoForm.valid) {
      this.generalStep = false;
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Link Acceptance or Contact details are required.",
        icon: "far fa-times-circle"
      });
    }
  }

  onAddPlanServiceField() {
    if (this.planDto) {
      this.isDTOReady = true;

      this.servicePlanFormArray.push(this.createServiceFormGroup());
      this.linkAcceptanceDTO = {
        ...this.generalInfoForm.getRawValue()
      };

      this.servicePlanFormArray.value.map((res: any) => {
        res.linkAcceptanceDTO = this.linkAcceptanceDTO;
        return res;
      });
      this.generalInfoForm.reset();
      this.generalInfoForm.controls.circuitStatus.setValue("Inactive");
      this.generalInfoForm.controls.countryCode.setValue("+93");
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill the Details",
        icon: "far fa-times-circle"
      });
    }
  }

  // onAddPlanServiceField() {
  //   this.serviceparamsubmitted = true;
  //   this.plansubmitted = true;
  //   if (this.planDto && this.chargeDto && this.planGroupForm.valid) {
  //     this.isDTOReady = true;
  //     // if (this.planGroupForm.valid) {
  //     // this.servicePlanName = this.planGroupForm.controls.service.value;
  //     this.servicePlanFormArray.push(this.createServiceFormGroup());
  //     // console.log('leasecktForm',this.leaseCktForm.value)
  //     this.linkAcceptanceDTO = {
  //       ...this.generalInfoForm.value,
  //       ...this.billingForm.value,
  //       ...this.chargeForm.value,
  //     };
  //     console.log("linkAcceptanceDTO", this.linkAcceptanceDTO);
  //     console.log("generalInfoForm", this.generalInfoForm.value);
  //     console.log("billingform", this.billingForm.value);
  //     console.log("planGroupForm", this.planGroupForm);
  //     this.servicePlanFormArray.value.map((res: any) => {
  //       res.linkAcceptanceDTO = this.linkAcceptanceDTO;
  //       return res;
  //     });
  //     // console.log('finalArray',this.finalArray)
  //     this.planGroupForm.reset();
  //     this.plansubmitted = false;
  //   } else {
  //     this.messageService.add({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Please fill the Details",
  //       icon: "far fa-times-circle",
  //     });
  //   }

  //   console.log("servicePlanFormArray", this.servicePlanFormArray.value[0]);
  // }

  getPlanbyServiceArea(serviceAreaId) {
    if (serviceAreaId) {
      this.filterPlanData = [];
      let mvnoId = this.custData?.mvnoId
        ? this.custData?.mvnoId
        : Number(localStorage.getItem("mvnoId"));
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

  // serviceBasePlanDATA(event) {
  //   let planserviceData;
  //   let planServiceID = "";
  //   const servicename = event.value;
  //   const planserviceurl = "/planservice/all";
  //   this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
  //     //
  //     planserviceData = response.serviceList.filter(service => service.name === servicename);
  //     if (planserviceData.length > 0) {
  //       planServiceID = planserviceData[0].id;

  //       this.plantypaSelectData = [];
  //       const planserviceurl = "/plansByTypeServiceModeStatusAndServiceArea";
  //       if (this.setplanMode == "") this.setplanMode = "NORMAL";
  //       else this.setplanMode = this.setplanMode;
  //       this.customerManagementService
  //         .getPlansByTypeServiceModeStatusAndServiceArea(
  //           planserviceurl,
  //           this.custData.custtype,
  //           planServiceID,
  //           this.custData.serviceareaid,
  //           this.setplanMode,
  //           "Active",
  //           this.setplanGroupType,
  //           this.planValidity,
  //           this.planunitValidity
  //         )
  //         .subscribe((response: any) => {
  //           if (response.status == 200 && response.postPaidPlan.length > 0) {
  //             this.plantypaSelectData = response.postPaidPlan;
  //           } else {
  //             this.plantypaSelectData = [];
  //             this.messageService.add({
  //               severity: "info",
  //               summary: "Note ",
  //               detail: "Plan not available for this Plan type and service ",
  //             });
  //           }
  //         });

  //       //     // if (this.customerGroupForm.value.custtype) {
  //       //     console.log("this.filterPlanData", this.filterPlanData);
  //       //     this.plantypaSelectData = this.filterPlanData.filter(
  //       //       id =>
  //       //         id.serviceId === planServiceID &&
  //       //         (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
  //       //     );
  //       //     if (this.plantypaSelectData.length === 0) {
  //       //       this.messageService.add({
  //       //         severity: "info",
  //       //         summary: "Note ",
  //       //         detail:
  //       //           this.custData.custtype + " Plan not available for this customer type and service ",
  //       //         icon: "far fa-times-circle",
  //       //       });
  //       //     }
  //       //     // }
  //       //     // else {
  //       //     //   this.messageService.add({
  //       //     //     severity: 'info',
  //       //     //     summary: 'Required ',
  //       //     //     detail: 'Customer Type Field Required',
  //       //     //     icon: 'far fa-times-circle',
  //       //     //   });
  //       //     // }
  //     }
  //
  //   });
  // }
  servicename: string;
  serviceBasePlanDATA(serviceId) {
    let planserviceData;
    let planServiceID = "";
    const planserviceurl = "/planservice/all" + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
      response.serviceList.filter((el: any) => {
        if (el.displayId == serviceId) {
          this.servicename = el.displayName;
        }
      });

      this.addPlanService();
    });
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
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
    const planId = event.value;
    const url = "/postpaidplan/" + planId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        const planDetailData = response.postPaidPlan;
        this.planGroupForm.patchValue({
          validity: Number(planDetailData.validity),
          offerprice: Number(planDetailData.offerprice),
          newAmount: Number(planDetailData.offerprice),
          validityUnit: planDetailData.unitsOfValidity
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

  addPlanService() {
    if (this.isDTOReady && this.planDto) {
      this.addServicePlanData = this.custData;
      this.addServicePlanData.planMappingList = [];
      //  let charge = {};
      for (var j = 0; j < this.planDto.chargeList.length; j++) {
        this.planDto.chargeList[j]["billingCycle"] = 1;
        this.planDto.chargeList[j]["chargeprice"] = this.planDto.chargeList[j].actualprice;
        if (this.isServiceEdit) {
          this.planDto.chargeList[j]["charge"] = {
            id: this.planDto.chargeList[j]?.charge?.id
          };
        } else {
          this.planDto.chargeList[j]["charge"] = {};
        }
        this.planDto.chargeList[j].charge.actualprice = this.planDto.chargeList[j].actualprice;
        this.planDto.chargeList[j].charge.chargecategory =
          this.planDto.chargeList[j].chargecategory;
        this.planDto.chargeList[j].charge.chargetype = this.planDto.chargeList[j].chargetype;
        this.planDto.chargeList[j].charge.desc = this.planDto.chargeList[j].desc;
        this.planDto.chargeList[j].charge.ledgerId = this.planDto.chargeList[j].ledgerId;
        this.planDto.chargeList[j].charge.name = this.planDto.chargeList[j].name;
        this.planDto.chargeList[j].charge.royalty_payable =
          this.planDto.chargeList[j].royalty_payable;
        this.planDto.chargeList[j].charge.saccode = this.planDto.chargeList[j].saccode;
        this.planDto.chargeList[j].charge.serviceNameList =
          this.planDto.chargeList[j].serviceNameList;
        this.planDto.chargeList[j].charge.billingCycle = this.planDto.chargeList[j].billingCycle;
        this.planDto.chargeList[j].charge.status = this.planDto.chargeList[j].status;
        this.planDto.chargeList[j].charge.taxid = this.planDto.chargeList[j].taxid;
        this.planDto.chargeList[j].charge.serviceid = [];

        this.planDto.chargeList[j].charge.serviceid.push(this.planDto.serviceId);
      }
      // this.planDto.chargeList[0]['billingCycle']=1
      // this.planDto.chargeList[0]['chargeprice']=this.chargeDto?.actualprice
      // this.planDto.chargelist[0]['charge']=this.chargeDto
      // this.planDto.chargeList[0] = {
      //   billingCycle: 1,
      //   chargeprice: this.chargeDto?.actualprice,
      //   charge: this.chargeDto,
      // };
      this.planDto["offerprice"] = this.totalActualPrice;
      this.servicePlanFormArray.value[0].postpaidPlanPojo = this.planDto;

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
      this.addServicePlanData.planMappingList = this.servicePlanFormArray.value;

      this.addServicePlanData.planMappingList.forEach((plan: any) => {
        plan.billTo = this.serviceForm.controls.billTo.value;
        plan.billableCustomerId = this.serviceForm.controls.billableCustomerId.value;
        plan.newAmount = plan.offerprice;
        plan.isInvoiceToOrg = this.serviceForm.controls.isInvoiceToOrg.value;
        return plan;
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
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please fill the Details",
        icon: "far fa-times-circle"
      });
    }
    // }
  }
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

    // this.linkAcceptanceDTO1 = {
    //   ...this.generalInfoForm.value,
    //   ...this.billingForm.value,
    //   ...this.chargeForm.value,
    // };

    this.linkAcceptanceDTO;
    // console.log("generalInfoForm", this.generalInfoForm.value);
    // console.log("billingform", this.billingForm.value);
    // console.log("planGroupForm", this.planGroupForm);
    if (this.custData.businessType == "Enterprise") {
      this.enterpriseAddNewService(this.data);
    } else {
      let url: any = "";
      if (this.isLeadMaster) {
        if (this.isServiceEdit) {
          url =
            "/AdoptSalesCrmsBss/leadMaster/updateLeadService?leadMasterServiceId=" +
            this.serviceEditDetailData.planMappingList[0].linkAcceptanceDTO.id;
          this.updatePlanLead(url, this.planDto);
        } else {
          url = "/AdoptSalesCrmsBss/leadMaster/addNewService";
          if (this.ifLeadQuickInput) {
            this.addPlanQuickLead(url, this.planDto);
          } else {
            this.addPlanLead(url, this.planDto);
          }
          // this.createChildLead();
        }
      } else {
        const url = "/subscriber/addNewService";
        this.addFinalPlanservice(url, this.data, this.linkAcceptanceDTO.serviceName);
      }
    }
  }

  // createChildLead() {
  //   let leadData: any = [];
  //   leadData = this.custData;
  //   leadData.parentExperience = "Single";
  //   leadData.invoiceType = "Group";
  //   leadData.parentCustomerId = this.custData.id;
  //   leadData.firstname = this.linkAcceptanceDTO.circuitName;
  //   leadData.username = this.linkAcceptanceDTO.circuitName;
  //   leadData.id = "";

  //   const leadurl = "/leadMaster/save";
  //   this.leadManagementService.postMethod(leadurl, leadData, this.mvnoid, this.staffid).subscribe(
  //     async (response: any) => {
  //       this.newLeadId = Number(response.leadMaster.id);

  //       let url = "/AdoptSalesCrmsBss/leadMaster/addNewService";
  //       if (this.ifLeadQuickInput) {
  //         this.addPlanQuickLead(url, this.planDto);
  //       } else {
  //         this.addPlanLead(url, this.planDto);
  //       }
  //     },
  //     error => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.errorMessage,
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }

  addPlanLead(url, planData) {
    const urlPlan = "/postpaidplan";
    this.customerManagementService.postMethod(urlPlan, planData).subscribe(
      (response: any) => {
        if (response.status == 200) {
          let serviceName = this.generalInfoForm.value.serviceType;
          this.commondropdownService.planserviceData.filter(item => {
            if (item.id == response.postpaidplan.serviceId) {
              serviceName = item.name;
              this.data.planMappingList[0].linkAcceptanceDTO.serviceName = serviceName;
            }
          });
          this.data.planMappingList[0].planId = response.postpaidplan.id;
          this.data.planMappingList[0]["linkAcceptanceDTO"] = this.linkAcceptanceDTO;
          this.data.planMappingList[0]["postpaidPlanPojo"] = response.postpaidplan;
          this.data.planMappingList[0].planName = response.postpaidplan.name;

          this.data.planMappingList[0].linkAcceptanceDTO.startDate =
            response.postpaidplan.startDate;
          this.data.planMappingList[0].linkAcceptanceDTO.endDate = response.postpaidplan.endDate;
          this.data.planMappingList[0].linkAcceptanceDTO.status = response.postpaidplan.status;
          setTimeout(() => {
            this.data.status = "New Activation";
            this.addFinalPlanservice(url, this.data, serviceName);
          }, 500);
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
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

  addPlanQuickLead(url, planData) {
    const urlPlan =
      "/postpaidplan/" + this.quickplanID + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(urlPlan).subscribe(
      (response: any) => {
        if (response.status == 200) {
          let serviceName = this.generalInfoForm.value.serviceType;
          this.commondropdownService.planserviceData.filter(item => {
            if (item.id == response.postPaidPlan.serviceId) {
              serviceName = item.name;
              this.data.planMappingList[0].linkAcceptanceDTO.serviceName = serviceName;
            }
          });
          this.data.planMappingList[0].planId = response.postPaidPlan.id;

          this.data.planMappingList[0]["linkAcceptanceDTO"] = this.linkAcceptanceDTO;
          this.data.planMappingList[0]["postpaidPlanPojo"] = response.postPaidPlan;
          this.data.planMappingList[0].planName = response.postPaidPlan.name;
          this.data.planMappingList[0].linkAcceptanceDTO.startDate =
            response.postPaidPlan.startDate;
          this.data.planMappingList[0].linkAcceptanceDTO.endDate = response.postPaidPlan.endDate;
          this.data.planMappingList[0].linkAcceptanceDTO.status = response.postPaidPlan.status;
          setTimeout(() => {
            this.data.status = "New Activation";
            this.addFinalPlanservice(url, this.data, serviceName);
          }, 500);
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
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

  updatePlanLead(url, planData) {
    const urlPlan =
      "/postpaidplan/" +
      this.serviceEditDetailData.planMappingList[0].planId +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
    this.customerManagementService.updateMethod(urlPlan, planData).subscribe(
      (response: any) => {
        if (response.status == 200) {
          let serviceName = "";
          this.commondropdownService.planserviceData.filter(item => {
            if (item.id == response.postpaidplan.serviceId) {
              serviceName = item.name;
            }
          });
          this.data.planMappingList[0].planId = response.postpaidplan.id;

          this.data.planMappingList[0]["linkAcceptanceDTO"] = this.linkAcceptanceDTO;
          this.data.planMappingList[0]["postpaidPlanPojo"] = response.postpaidplan;
          this.data.planMappingList[0].planName = response.postpaidplan.name;
          this.data.planMappingList[0].linkAcceptanceDTO.serviceName = serviceName;
          this.data.planMappingList[0].linkAcceptanceDTO.startDate =
            response.postpaidplan.startDate;
          this.data.planMappingList[0].linkAcceptanceDTO.endDate = response.postpaidplan.endDate;
          this.data.planMappingList[0].linkAcceptanceDTO.status = response.postpaidplan.status;
          this.data.planMappingList[0].postpaidPlanPojo.id = response.postpaidplan.id;
          // console.log("this.data", this.data);
          this.data.planMappingList.splice(1);
          setTimeout(() => {
            this.updateFinalPlanservice(url, this.data, serviceName);
          }, 500);
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
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

  addFinalPlanservice(url, data, serviceName) {
    if (data.planMappingList.length > 0) {
      data.service = serviceName;
      data.planMappingList[0].service = serviceName;
      data.planMappingList[0].postpaidPlanPojo.serviceName = serviceName;
    }
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
          this.serviceForm.reset();
          this.planGroupForm.reset();
          this.submitted = false;
          this.plansubmitted = false;
          this.servicePlanFormArray.controls = [];
          this.closeServiceModal();

          if (this.isLeadMaster) {
            this.getLeadServiceList();
          } else {
            this.getActivePlanDetails();
          }

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
  }

  updateFinalPlanservice(url, data, serviceName) {
    if (data.planMappingList.length > 0) {
      data.service = serviceName;
      data.planMappingList[0].service = serviceName;
      data.planMappingList[0].postpaidPlanPojo.serviceName = serviceName;
    }
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
          this.serviceForm.reset();
          this.planGroupForm.reset();
          this.submitted = false;
          this.plansubmitted = false;
          this.servicePlanFormArray.controls = [];
          this.closeServiceModal();

          if (this.isLeadMaster) {
            this.getLeadServiceList();
          } else {
            this.getActivePlanDetails();
          }

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
  }

  enterpriseAddNewService(data) {
    data.planMappingList[0]["discountType"] = null;
    data.planMappingList[0]["discountExpiryDate"] = null;
    data.planMappingList[0]["planCategory"] = "individual";
    data.planMappingList[0]["linkAcceptanceDTO"] = this.linkAcceptanceDTO;

    let addressUrl = "/fieldMapping/getPresentAddressByCustomerId?customerId=" + this.custData.id;
    let addressList = [];
    this.customerManagementService.getMethod(addressUrl).subscribe(
      (response: any) => {
        addressList.push(response.data);
        this.data["addressList"] = addressList;
        let url: any = "";
        if (this.isLeadMaster) {
          url = "/AdoptSalesCrmsBss/leadMaster/addNewService";
        } else {
          url = "/subscriber/addNewService";
        }
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
              this.serviceForm.reset();
              this.planGroupForm.reset();
              this.submitted = false;
              this.plansubmitted = false;
              this.servicePlanFormArray.controls = [];
              $("#addServiceModal").modal("hide");

              if (this.isLeadMaster) {
                this.getLeadServiceList();
              } else {
                this.getActivePlanDetails();
              }

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
  planDto: any;
  chargeDto: any;
  setplanMode = "";
  setplanGroupType = "";
  setplanCategory = "";
  serviceStartPuase: boolean = false;
  servicesList = [];
  planName: string = "";

  getPlanDTO(data: any) {
    let length = data.length;
    this.planDto = [];
    data.service = this.generalInfoForm.value.serviceType;
    this.planDto = data;
    this.planName = data.name;
    this.onAddPlanServiceField();
    this.serviceBasePlanDATA(this.planDto.serviceId);
  }

  getChargeDTO(data: any) {
    this.chargeDto = data;
  }
  getActivePlanDetails() {
    let url: any;

    if (this.ifcustCaf) {
      url =
        "/subscriber/getPlanByCustService/" +
        this.custData.id +
        "?status=NewActivation" +
        "&isNotChangePlan=true";
    } else {
      url = "/subscriber/getPlanByCustService/" + this.custData.id + "?isNotChangePlan=true";
    }
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200 || response.responseCode == 0) {
          this.custCurrentPlanList = response.dataList;
          // this.custCurrentPlanList = this.custCurrentPlanList.filter(
          //   data => data.custPlanStatus == "Active" || data.custPlanStatus == "ACTIVE"
          // );

          if (this.custCurrentPlanList.length > 0) {
            this.pausePlatbtnCondition = this.custCurrentPlanList[0].custPlanStatus;
            this.SelectplanDataValue(this.custCurrentPlanList[0].planId);
          }
          this.custCurrentPlanList.forEach(e => {
            if (e.custPlanStatus == "ACTIVE") {
              this.serviceStartPuase = true;
            } else {
              if (e.stopServiceDate) this.serviceStartPuase = false;
              else this.serviceStartPuase = true;
            }
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
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

  getLeadServiceList() {
    const url =
      "/AdoptSalesCrmsBss/leadMaster/findCircuitDetailsByLeadId?leadId=" + this.custData.id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.custCurrentPlanList = [];
          this.custCurrentPlanList = response.leadServiceMappingList;
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
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

  SelectplanDataValue(planId) {
    const url = "/postpaidplan/" + planId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      let viewPlanListData = response.postPaidPlan;
      this.setplanMode = viewPlanListData.mode;
      this.setplanGroupType = viewPlanListData.planGroup;
      this.setplanCategory = viewPlanListData.category;
      this.planValidity = viewPlanListData.validity;
      this.planunitValidity = viewPlanListData.unitsOfValidity;
    });
  }
  pageChangedcustomerCurrentPlanListData(pageNumber) {
    this.currentPagecustomerCurrentPlanListdata = pageNumber;
    //this.getActivePlanDetails();
  }

  TotalCurrentPlanItemPerPage(event) {
    this.customerCurrentPlanListdataitemsPerPage = Number(event.value);
    if (this.currentPagecustomerCurrentPlanListdata > 1) {
      this.currentPagecustomerCurrentPlanListdata = 1;
    }
    // this.getActivePlanDetails();
  }

  deleteServicePlanData() {
    let planMapId = this.servicePerticularData.planmapid;
    let custId = this.servicePerticularData.custId;
    let planId = this.servicePerticularData.planId;

    let data1 = {};

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
          $("#StopServiceModal").modal("show");
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
  }

  pauseService() {
    this.confirmationService.confirm({
      header: "Alert",
      message: "All the services will be paused. Do you want to continue? (Yes/No)",
      icon: "pi pi-info-circle",
      accept: () => {
        this.custCurrentPlanList.forEach(element => {
          if (element.custPlanStatus != "STOP") {
            let data = {
              cprId: element.planmapid,
              reasonId: this.selectDeactivateReason,
              remarks: this.serviceStropRemarks
            };
            const url = "/subscriber/resumeService";
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
                  $("#StopServiceModal").modal("hide");
                  // this.custPlanMappping.emit();
                }
                setTimeout(() => {
                  this.getActivePlanDetails();

                  this.messageService.add({
                    severity: "success",
                    summary: "Successfully",
                    detail: "Stoped Successfully",
                    icon: "far fa-check-circle"
                  });
                }, 500);
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
        });
      },
      reject: () => {
        $("#StopServiceModal").modal("hide");
        // this.custPlanMappping.emit();
      }
    });
  }
  playService() {
    this.custCurrentPlanList.forEach(
      element => {
        if (element.custPlanStatus == "STOP" && element.stopServiceDate) {
          let data = {
            cprId: element.planmapid,
            remarks: this.serviceStropRemarks
            // reasonId: this.selectDeactivateReason,
          };
          const url = "/subscriber/resumeService";
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
                $("#StopServiceModal").modal("hide");
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
    setTimeout(() => {
      this.getActivePlanDetails();

      this.messageService.add({
        severity: "success",
        summary: "Successfully",
        detail: "Started Successfully",
        icon: "far fa-check-circle"
      });
    }, 500);
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
    this.ifselecResonType = type;
    this.servicePerticularData = data;
    this.selectDeactivateReason = "";
    this.serviceStropRemarks = "";
    $("#StopServiceModal").modal("show");
  }

  // openStartSearviceMedel(data, type) {
  //   this.ifselecResonType = type;
  //   this.servicePerticularData = data;
  //   this.selectDeactivateReason = "";
  //   this.serviceStropRemarks ="";
  //   if (type === "Pause") {
  //     $("#StopServiceModal").modal("show");
  //   } else {
  //     this.playService();
  //   }
  // }

  getDectivateData() {
    let url = `/commonList/generic/DEACTIVATE_REASON_EZ_BILL`;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.deactiveDataList = response.dataList;
    });
  }

  modalOpenParentCustomer() {
    this.displaySelectParentCustomer = true;
    this.newFirst = 0;
    this.getParentCustomerData();
    this.selectedParentCust = [];
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

    const url =
      "/parentCustomers/search/" +
      RadiusConstants.CUSTOMER_TYPE.PREPAID +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
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

  async saveSelCustomer() {
    this.billableCusList = [
      {
        id: this.selectedParentCust.id,
        name: this.selectedParentCust.name
      }
    ];
    this.serviceForm.patchValue({
      billableCustomerId: this.selectedParentCust.id
    });

    this.modalCloseParentCustomer();
  }

  modalCloseParentCustomer() {
    this.displaySelectParentCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  removeSelParentCust() {
    this.selectedParentCust = [];
    this.billableCusList = [];
    this.serviceForm.patchValue({
      billableCustomerId: null
    });
  }
  // end

  canExit() {
    return true;
  }
  particularALLDatashow(particularData) {
    this.serviceParticularData = particularData;
    let url = `/subscriber/getCircuitDetailsByCustServiceMapId/${particularData.custPlanMapppingId}`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.serviceCircuitData = response.data.data;
        $("#showServiceDetailsID").modal("show");
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
  closeParticularALLDeatils() {
    $("#showServiceDetailsID").modal("hide");
  }

  closeViewCircuitModal() {
    $("#viewServiceModal").modal("hide");
  }

  closeServiceModal() {
    $("#addServiceModal").modal("hide");
    this.generalInfoForm.reset();
    this.generalInfoForm.controls.circuitStatus.setValue("Inactive");
    this.generalInfoForm.controls.countryCode.setValue("+93");
    this.serviceparamsubmitted = false;
    this.isDTOReady = false;
    this.generalStep = true;
    this.servicePlanFormArray.controls = [];
    this.servicePlanFormArray = this.fb.array([]);
    this.generateCircuitName = "";
    this.isServiceEdit = false;
  }

  editService(id) {
    this.getCircuitDetail(id);
    this.leadCustomerType = this.custData.custtype;
    this.ifLeadQuickInput = this.custData.isLeadQuickInv;

    if (this.ifLeadQuickInput == true) {
      let service =
        this.custData.planMappingList.length > 0 ? this.custData.planMappingList[0].service : "";
      this.quickplanID =
        this.custData.planMappingList.length > 0 ? this.custData.planMappingList[0].planId : "";
      this.generalInfoForm.patchValue({
        mobileNo: this.custData.mobile,
        countryCode: this.custData.countryCode,
        email: this.custData.email,
        serviceType: service
      });
    }
    $("#addServiceModal").modal("show");
  }
  viewCircuitDetail(id) {
    this.getCircuitDetail(id);
    $("#viewServiceModal").modal("show");
  }

  getCircuitDetail(id) {
    let url = "/AdoptSalesCrmsBss/leadMaster/findLeadServiceMappingById?leadServiceMappingId=" + id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status == 200) {
          this.isServiceEdit = true;
          this.serviceEditDetailData = response.leadMaster;
          this.servicelinkAcceptanceData =
            this.serviceEditDetailData.planMappingList[0].linkAcceptanceDTO;
          this.circuitPlanData = this.serviceEditDetailData.planMappingList[0].postpaidPlanPojo;
          this.serviceAreaListDisplay = [];
          this.serviceEditDetailData.planMappingList[0].postpaidPlanPojo.serviceAreaIds.forEach(
            element => {
              this.commondropdownService.serviceAreaList.forEach(item => {
                if (element == item.id) {
                  this.serviceAreaListDisplay.push(item.name);
                }
              });
            }
          );
          this.generalInfoForm.patchValue(
            this.serviceEditDetailData.planMappingList[0].linkAcceptanceDTO
          );
          this.generalInfoForm.controls.serviceType.patchValue(
            this.serviceEditDetailData.planMappingList[0].linkAcceptanceDTO.serviceName
          );
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
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

  planserviceID(e) {
    this.planServiceId = e.value;
    this.generateCircuitNameFun();
  }

  pageChangedCircuitChargeDetailList(pageNumber) {
    this.currentPageCircuitChargeDeatilList = pageNumber;
  }

  pageChangedCircuitProductDetailList(pageNumber) {
    this.currentPageCircuitProductDeatilList = pageNumber;
  }

  newActivationFlag: boolean = false;
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
  showPlanConnectionNo = false;
  planForConnection;
  custCurrentPlanListLength: number;
  customerServiceMappingId: any;

  // assignPLANForm: FormGroup;
  rejectCustomerCAFForm: FormGroup;

  approvePlanOpen(planId, nextApproverId, serviceMappingId, status) {
    if (status === "NewActivation") this.newActivationFlag = true;
    else this.newActivationFlag = false;
    this.approved = false;
    this.selectStaff = null;
    this.approvePlanData = [];
    $("#assignApporvePlanModal").modal("show");
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
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.getPostoaidPlan("");
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

  rejectPlanOpen(planId, nextApproverId, mappingId, status) {
    if (status === "NewActivation") this.newActivationFlag = true;
    else this.newActivationFlag = false;
    this.reject = false;
    this.selectStaff = null;
    this.rejectPlanData = [];
    $("#rejectPlanModal").modal("show");
    this.assignPlanID = planId;
    this.nextApproverId = nextApproverId;
    this.customerServiceMappingId = mappingId;
    // this.rejectPlanForm.reset();
    this.rejectPlanSubmitted = false;
  }

  StaffReasignList(data) {
    this.customerServiceMappingId = data.customerServiceMappingId;
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.customerServiceMappingId}&eventName=CUSTOMER_SERVICE_TERMINATION`;
    this.customerManagementService.getMethod(url).subscribe(
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
          $("#reAssignPLANModal").modal("show");
        } else {
          $("#reAssignPLANModal").modal("hide");
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
          $("#reAssignPLANModal").modal("hide");
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
      // customerServiceMappingId=11&isApproveRequest=true&remarks=11
      let assignCAFData = {
        planId: this.assignPlanID,
        nextStaffId: "",
        flag: "approved",
        remark: this.assignPlanForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
      };

      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          // $("#assignApporvePlanModal").modal("hide");
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
              $("#assignApporvePlanModal").modal("hide");
            }
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

  rejectPlan() {
    this.rejectPlanSubmitted = true;
    if (this.rejectPlanForm.valid) {
      let assignCAFData = {
        planId: this.assignPlanID,
        nextStaffId: "",
        flag: "Rejected",
        remark: this.rejectPlanForm.value.remark,
        staffId: localStorage.getItem("userId")
      };
      let url;
      if (this.newActivationFlag)
        url = `/subscriber/approveCustomerServiceAdd?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=false&remarks=${this.assignPlanForm.controls.remark.value}`;
      else
        url = `/subscriber/approveCustomerServiceTermination?customerServiceMappingId=${this.customerServiceMappingId}&isApproveRequest=false&remarks=${this.assignPlanForm.controls.remark.value}`;
      this.customerManagementService.getMethod(url).subscribe(
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
            $("#rejectPlanModal").modal("hide");
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

    this.customerManagementService.getMethod(url).subscribe(
      response => {
        $("#assignApporvePlanModal").modal("hide");
        $("#rejectPlanModal").modal("hide");
        // this.getPostoaidPlan("");
        this.getActivePlanDetails();
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
  }

  openAddWorkFlow(id, auditcustid) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "CUSTOMER_SERVICE_ADD",
      planId: ""
    });
  }

  openEditWorkFlow(id, auditcustid) {
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "CUSTOMER_SERVICE_TERMINATION",
      planId: ""
    });
  }

  currentDate = new Date();
  serviceTerminationCheck(serviceEndDate, custPlanStatus) {
    if ((custPlanStatus == "Stop" || custPlanStatus == "STOP") && serviceEndDate) {
      serviceEndDate = new Date(serviceEndDate);
      if (serviceEndDate.getTime() < this.currentDate.getTime()) return false;
    }
    return true;
  }

  auditData: any = [];
  auditItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  currentPageAuditList = 1;
  audittotalRecords: String;

  openAudit(auditcustid) {
    $("#auditDetails").modal("show");

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
    $("#auditDetails").modal("hide");
    this.auditData = [];
  }

  getLoggedinUserData() {
    let staffId = localStorage.getItem("userId");
    this.staffUserId = localStorage.getItem("userId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
  }
}
