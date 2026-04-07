import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl
} from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { LoginService } from "src/app/service/login.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { PlanManagementService } from "src/app/service/plan-management.service";
import { ProductCategoryManagementService } from "src/app/service/product-category-management.service";
import { FieldmappingService } from "src/app/service/fieldmapping.service";
import { DatePipe } from "@angular/common";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { QosPolicyService } from "src/app/service/qos-policy.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { StatusCheckService } from "src/app/service/status-check-service.service";
import { WhiteeSpaceValidator } from "../shared/custom-validators";

declare var $: any;

@Component({
  selector: "app-plan-management",
  templateUrl: "./plan-management.component.html",
  styleUrls: ["./plan-management.component.css"]
})
export class PlanManagementComponent implements OnInit {
  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;

  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  rejectPlanModal: boolean = false;
  ifplanGroup_BWB = false;
  ifplanGroup_VB = false;
  chargeTaxAmountArray = [];
  casPackegeAllData: any = [];
  currentPagePlanProductMapping = 1;
  planProductMappingTotalRecords: number;
  planProductMappingItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  planGroupForm: FormGroup;
  createPlanData: any = {};
  chargeFromArray: FormArray;
  qospolicyformArray: FormArray;
  qosPolicyGatewayMappingListFormArray: FormArray;
  submitted: boolean = false;
  planGroupData: any;
  planCategoryData: any;
  planTypeData: any;
  serviceData: any;
  qosPolicyData: any;
  data: any;
  timeBasePolicyData: any;
  quotaData: any;
  quotaTypeData: any;
  currentPageCharge = 1;
  chargeitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  chargetotalRecords: String;
  currentPageqospolicye = 1;
  qospolicyitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  qospolicytotalRecords: String;
  currentPagePostPaidPlan = 1;
  postPaidPlanitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  postPaidPlantotalRecords: any;
  chargeCategoryList: any;
  taxListData: any;
  chargeListData: any;
  postPaidPlanList: any;
  isPlanEdit: boolean = false;
  ifModelIsShow: boolean = false;
  qosPolicyID: boolean = false;
  viewPlanListData: any;
  searchOption: any = "";
  planFilterStatus = [
    { label: "New Activation", value: "planstatusnewactivation" },
    { label: "Active", value: "planstatusactive" },
    { label: "Inactive", value: "planstatusinactive" },
    { label: "Rejected", value: "planstatusrejected" },
    { label: "Expired", value: "planstatusexpired" }
  ];
  searchData: any;
  viewChargeListData: any;
  charge: any = {};
  createView: boolean = false;
  planDetailData: any = {
    name: "",
    displayName: "",
    code: "",
    plantype: "",
    category: "",
    serviceId: "",
    planGroup: "",
    offerprice: "",
    startDate: "",
    endDate: "",
    validity: "",
    allowOverUsage: "",
    maxconcurrentsession: "",
    status: "",
    quotatype: "",
    desc: "",
    saccode: "",
    qospolicyid: "",
    qospolicyName: "",
    timebasepolicyId: "",
    timebasepolicyName: "",
    quotaResetInterval: "",
    usageQuotaType: "",
    radiusPolicy: "",
    param1: "",
    param2: "",
    param3: "",
    chargeList: [],
    productplanmappingList: []
    // maxHoldDurationDays: "",
    // maxHoldAttempts: ""
  };
  chargefromgroup: FormGroup;
  qospolicyformgroup: FormGroup;
  chargeSubmitted: boolean = false;
  qospolicySubmitted: boolean = false;
  planProductMappingFromArray: FormArray;
  planProductfromgroup: FormGroup;
  planProductSubmitted: boolean = false;
  prepaidListView: boolean = false;
  postpaidListView: boolean = false;
  validityHide: boolean = false;
  detailView: boolean = false;
  listView: boolean = true;
  chargeArray: any = [];
  advanceListData: any = [];
  qtyErroMsg = "";
  showQtyError: boolean;
  chargeDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  chargeDeatiltotalRecords: String;
  currentPageChargeDeatilList = 1;
  qosPolicyDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  qosPolicyDeatiltotalRecords: String;
  currentPagecustQosPolicyDeatilList = 1;
  productDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  productDeatiltotalRecords: String;
  productPageChargeDeatilList = 1;
  AclClassConstants;
  AclConstants;
  max;
  prepaidType: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  searchkey;
  searchkey2;
  searchDeatil = "";
  searchDeatilFromDate = new Date();
  searchDeatilToDate = new Date();
  endDate = new Date();
  public loginService: LoginService;
  minStartDate: any;
  minEndDate: any;
  searchUnitsOfValidity = "";
  searchOptionType = "";

  planDiscount = [
    { label: "Yes", value: true },
    { label: "No", value: false }
  ];

  qutaUnitTime = [
    { label: "Minute", value: "MIN" },
    { label: "Hour", value: "HOUR" },
    { label: "Day", value: "DAY" }
  ];
  planCategory = [
    { label: "True", value: true },
    { label: "False", value: false }
  ];
  quotaResetIntervalData = [
    { label: "Daily" },
    { label: "Weekly" },
    { label: "Monthly" },
    { label: "Total" }
  ];
  usageQuotaType = [{ label: "TOTAL" }, { label: "DOWNLOAD" }, { label: "UPLOAD" }];
  inventoryType = [{ label: "New" }, { label: "Refurbished" }];

  validityUnit = [{ label: "Hours" }, { label: "Days" }, { label: "Months" }, { label: "Years" }];
  planStatus = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  productType = [
    { label: "New", value: "New" },
    { label: "Refurbished", value: "Refurbished" }
  ];
  ownershipType = [
    { label: "Sold", value: "Sold" },
    { label: "Organization Owned", value: "Organization Owned" }
  ];
  statusOptions = RadiusConstants.status;
  billingCycle: any = [];
  viewQosPolicyListData: any = [];
  viewTimeBasePolicyListData: any = [];
  type = [{ label: "NORMAL" }, { label: "SPECIAL" }];
  pricePerTax: any = 0;
  totalPriceData = [];
  countTotalOfferPrice = 0;
  isServiceHideField: boolean = false;
  isQuotaEnabled: boolean = true;
  isQuotaTimeEnabled: boolean = true;
  planProductMappingShowFlag: boolean = false;
  assignPlanForm: FormGroup;
  rejectPlanForm: FormGroup;
  assignPlansubmitted: boolean = false;
  rejectPlanSubmitted: boolean = false;
  productChargeFlag: boolean = false;
  revisedChargeFlag: boolean = false;
  assignPlanID: any;
  nextApproverId: any;
  remarks: any;

  currentPageMasterSlab = 1;
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords: String;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  workflowAuditData: any = [];
  EventID: any;
  planStatusDetail = [];
  inventoryCat = [];
  staffID: number;
  currentStatus: any;
  planStatusField: boolean = false;

  ifPlanEditInput = false;
  ifServiceParam = false;
  chargeTypeGetDataData: any = [];
  chargeType: any = [];
  ProductsType: any = [];
  productList: any = [];
  allActiveProduct: any = [];
  isServiceArea_PlanType: boolean = true;
  serviceList: any;

  casmasterData: any;
  casPackageData: any;
  planCasMappingFromGroup: FormGroup;
  planCasMappingFromArray: FormArray;
  planCasMappingSubmitted = false;

  serviceParamFromGroup: FormGroup;
  serviceParamFromArray: FormArray;
  serviceParamSubmitted = false;

  taxDetails: any = [];

  isPlanPriceChanged = false;

  basicLeadArr: any = [];
  fieldsArr: any = [];
  planArr: any = [];
  customerGroupForm!: FormGroup;
  getProductDetailsById: any = [];
  chargeAmount: any;
  showError: boolean = false;
  priceErrorMsg = "";
  revicedAmount: any;
  productFlag: boolean = false;
  productTypeFlag: boolean = false;
  ownershipTypeFlag: boolean = false;
  cities: any = [];
  exampleGroupForm!: FormGroup;
  showDependantDropdown: boolean = false;
  dependantOptionList: any = [];
  allFieldsArr: any = [];
  form: any = {};
  optionList: any = [];
  multiOptionList: any = [];
  customerSave: any = [];
  childOptionList: any = [];
  templateSubmitted: boolean = false;
  filteredArray: any = [];
  presentAddressArr: any[] = [];
  testAddressArr: any[] = [];
  permanentAddressArr: any = [];
  paymentAddressArr: any = [];
  addressList: FormArray[] = [];
  minfrompercentage = 0;
  mintopercentage = 0;
  // RequireBasePlan = [
  //   { label: "Yes", value: true },
  //   { label: "No", value: false },
  // ];
  templateData = [];
  currency: string;
  createAccess: boolean = false;
  //   deleteAccess: boolean = false;
  editAccess: boolean = false;
  changeStatusAccess: boolean = false;
  showServiceArea = false;
  approvePlan: any[];
  searchStaffDeatil: any;
  chargeIdFromService: any;
  mvnoTitle = RadiusConstants.MVNO;
  mvnoId = Number(localStorage.getItem("mvnoId"));
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private planManagementService: PlanManagementService,
    private adoptcommonbssservice: AdoptCommonBaseService,
    private customermanagementservice: CustomermanagementService,
    public commondropdownService: CommondropdownService,
    private qosPolicyService: QosPolicyService,
    public PaymentamountService: PaymentamountService,
    private productManagementService: ProuctManagementService,
    public productCategoryManagementService: ProductCategoryManagementService,
    loginService: LoginService,
    private custService: FieldmappingService,
    private datePipe: DatePipe,
    private tempservice: FieldmappingService,
    private systemService: SystemconfigService,
    public statusCheckService: StatusCheckService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.createAccess = loginService.hasPermission(PRODUCTS.PLAN_CREATE);
    // this.deleteAccess = loginService.hasPermission(PRODUCTS.PLAN_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.PLAN_EDIT);
    this.changeStatusAccess = loginService.hasPermission(PRODUCTS.PLAN_CHANGE_STATUS);
    // this.isPlanEdit = !this.createAccess && this.editAccess ? true : false;
    // let plandata = [];
    // this.productCategoryManagementService.getAll(plandata).subscribe((res:any)=>{
    //   this.inventoryCat = res.dataList;
    // })
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      this.currency = res.data.value;
    });
  }

  ngOnInit(): void {
    let staffID = localStorage.getItem("userId");
    this.staffID = Number(staffID);

    this.planGroupForm = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      displayName: ["", Validators.required],
      code: [""],
      saccode: [""],
      plantype: ["", Validators.required],
      category: ["", Validators.required],
      serviceId: ["", Validators.required],
      serviceAreaIds: ["", Validators.required],
      planGroup: ["", Validators.required],
      offerprice: ["", Validators.required],
      newOfferPrice: [""],
      qospolicyid: ["", Validators.required],
      timebasepolicyId: [""],
      radiusprofileIds: [""],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      validity: ["", [Validators.required, Validators.pattern(Regex.numeric), Validators.min(1)]],
      unitsOfValidity: ["Days", Validators.required],
      param1: [""],
      param2: [""],
      param3: [""],
      accessibility: [""],
      quotaUnit: ["", [Validators.required]],
      allowdiscount: ["", [Validators.required]],
      quotatype: ["", [Validators.required]],
      allowOverUsage: ["", Validators.required],
      maxconcurrentsession: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      status: [""],
      product_category: [""],
      product_type: [""],
      quotaunittime: ["", [Validators.required]],
      quotatime: ["", [Validators.required]],
      quota: ["", [Validators.required]],
      quotaResetInterval: ["", [Validators.required]],
      usageQuotaType: ["", [Validators.required]],
      desc: ["", [Validators.required, Validators.pattern(Regex.characterlength255)]],
      mode: ["NORMAL", Validators.required],
      currency: ["", Validators.required],
      ProductsType: [""],
      requiredApproval: [""],
      invoiceToOrg: [""],
      // basePlan: [""],
      templateId: [""],
      chunk: [0],
      useQuota: [],
      addonToBase: [false],
      //   maxHoldDurationDays: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      //   maxHoldAttempts: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      mvnoId: [""]
    });
    const mvnoControl = this.planGroupForm.get("mvnoId");

    if (this.mvnoId === 1) {
      mvnoControl?.setValidators([Validators.required]);
      this.commondropdownService.getmvnoList();
    } else {
      mvnoControl?.clearValidators();
    }

    mvnoControl?.updateValueAndValidity();

    this.charge = {
      id: "",
      taxamount: "",
      actualprice: "",
      price: ""
    };

    this.assignPlanForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectPlanForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.planProductfromgroup = this.fb.group({
      revisedCharge: [""],
      ownershipType: ["", Validators.required],
      productCategoryId: ["", Validators.required],
      productId: ["", Validators.required],
      product_type: ["", Validators.required],
      productQuantity: [1, [Validators.required, Validators.min(1)]],
      name: [""],
      id: [""]
    });

    this.planProductMappingFromArray = this.fb.array([]);
    this.planGroupForm.controls.quotaUnit.disable();
    this.planGroupForm.controls.quota.disable();
    this.planGroupForm.controls.quotaunittime.disable();
    this.planGroupForm.controls.quotatime.disable();

    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: "",
      pageSize: ""
    };
    this.chargefromgroup = this.fb.group({
      id: ["", Validators.required],
      billingCycle: ["", Validators.required],
      actualprice: [""],
      taxamount: [""],
      chargeprice: [""],
      price: [""],
      currency: [""]
    });

    this.qospolicyformgroup = this.fb.group({
      qosid: ["", Validators.required],
      frompercentage: [101, [Validators.required, Validators.min(this.minfrompercentage)]],
      topercentage: [101, [Validators.required, Validators.min(this.mintopercentage)]]
    });

    this.planCasMappingFromGroup = this.fb.group({
      id: [""],
      casId: ["", Validators.required],
      packageId: ["", Validators.required],
      planId: [""]
    });
    this.planCasMappingFromArray = this.fb.array([]);
    this.chargeFromArray = this.fb.array([]);
    this.qospolicyformArray = this.fb.array([]);
    this.getPlanGroup();
    this.getPlanCaegory();
    this.getPlanType();
    localStorage.getItem("mvnoId") !== "1" ? this.getService() : "";
    localStorage.getItem("mvnoId") !== "1" ? this.getQosPolicy() : "";
    localStorage.getItem("mvnoId") !== "1" ? this.getTimeBasePolicy() : "";
    this.getQoutaData();
    this.getInventoryCat();
    this.getQoutaType();
    this.getTaxDataList();
    this.searchPlan("");
    this.getAccessibilityData();
    this.getChargeType();
    this.getProductsType();
    this.getTemplateData();
    this.commondropdownService.getchargeAll();
    this.commondropdownService.planCreationType();
    this.commondropdownService.getAllCurrencyData();
    // if (this.statusCheckService.isActiveInventoryService) {
    //   console.log("inventory service active :::::::::::: ----------------------");
    //   this.commondropdownService.getActiveProductCategoryList();
    //   this.commondropdownService.getAllActiveProduct();
    // }
    this.getProductData();
    this.commondropdownService.getAllActiveStaff();
    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.mvnoId != 1 ? this.commondropdownService.getserviceAreaListForCafCustomer() : "";
    } else {
      this.mvnoId != 1 ? this.commondropdownService.getserviceAreaListForCafCustomer() : "";
    }
    this.chargefromgroup.controls.billingCycle.setValue("");
    this.chargefromgroup.controls.billingCycle.enable();
    this.getAllCAS();
    // this.getFields();

    this.planProductfromgroup.get("revisedCharge").valueChanges.subscribe(val => {
      const newRevisedCharge = val;
      this.showError = false;
      this.priceErrorMsg = "";
      if (Number(newRevisedCharge) > Number(this.chargeAmount)) {
        this.showError = true;
        this.priceErrorMsg =
          "Please enter a revice charge less than or equal to the product charge.";
      }
    });
    this.planGroupForm.get("planGroup")?.valueChanges.subscribe(val => {
      if (val !== "Bandwidthbooster") {
        this.planGroupForm.get("addonToBase")?.setValue(false);
      }
    });
    const today = new Date();
    this.minStartDate = today.toISOString().split('T')[0];
    this.minEndDate = today.toISOString().split('T')[0];
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  getTemplateData() {
    let url = "/billTempleteByType/Billing?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(url).subscribe((response: any) => {
      this.templateData = response.billRunlist;
    });
  }

  getChargeType() {
    let url = "/commonList/generic/chargetype";
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.chargeType = response.dataList;
    });
  }

  closeQosPolicyID() {
    this.qosPolicyID = false;
  }

  billingSequence() {
    this.billingCycle = [];
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
    }
  }
  // discountPercentage(e) {
  //   let offerPrice = Number(this.planProductfromgroup.value.discount);
  // }

  
  closeModalRejectPlan() {
    this.rejectPlanModal = false;
  }

 
  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    this.postPaidPlanitemsPerPage = this.showItemPerPage;
    if (this.currentPagePostPaidPlan > 1) {
      this.currentPagePostPaidPlan = 1;
    }
    // if (!this.searchkey && !this.searchkey2) {
    //   this.getPostoaidPlan(this.showItemPerPage);
    // } else {
    this.searchPlan("");
    // }
  }

  getPostoaidPlan(list) {
    let size;
    this.searchkey = "";
    this.countTotalOfferPrice = 0;
    let pageList = this.currentPagePostPaidPlan;
    if (list) {
      size = list;
      this.postPaidPlanitemsPerPage = list;
    } else {
      size = this.postPaidPlanitemsPerPage;
    }

    let plandata = {
      page: pageList,
      pageSize: size
    };

    const url = "/postpaidplan/list?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.postMethod(url, plandata).subscribe(
      (response: any) => {
        this.postPaidPlanList = response.postpaidplanList;
        this.postPaidPlantotalRecords = response.pageDetails.totalRecords;

        //console.log(this.postPaidPlanList, this.staffID);
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

  getTaxDataList() {
    const url = "/taxes/all?mvnoId=" + localStorage.getItem("mvnoId");
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.taxListData = response.taxlist;
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

  createCasMappingFormGroup() {
    return this.fb.group({
      casId: [this.planCasMappingFromGroup.value.casId],
      packageId: [this.planCasMappingFromGroup.value.packageId],
      planId: [
        this.planCasMappingFromGroup.value.planId ? this.planCasMappingFromGroup.value.planId : ""
      ],
      id: [this.planCasMappingFromGroup.value.id ? this.planCasMappingFromGroup.value.id : ""]
    });
  }

  onAddCasMappingField(selectedCasId: any): void {
    if (!this.planCasMappingFromArray.value.some(value => value.casId == selectedCasId)) {
      this.planCasMappingSubmitted = true;
      if (this.planCasMappingFromGroup.valid) {
        this.planCasMappingFromArray.push(this.createCasMappingFormGroup());
        this.planCasMappingFromGroup.reset();
        this.planCasMappingSubmitted = false;
        this.casPackegeAllData = [...this.casPackegeAllData, ...this.casPackageData];
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error ",
        detail: "CAS already added.",
        icon: "far fa-times-circle"
      });
    }
  }
  createChargeFormGroup(): FormGroup {
    for (const prop in this.chargefromgroup.controls) {
      this.chargefromgroup.value[prop] = this.chargefromgroup.controls[prop].value;
    }

    if (this.chargefromgroup.value.billingCycle == null) {
      this.chargefromgroup.value.billingCycle = 1;
    }

    return this.fb.group({
      billingCycle: [this.chargefromgroup.value.billingCycle],
      id: [this.chargefromgroup.value.id],
      actualprice: [this.chargefromgroup.value.actualprice],
      taxamount: [this.chargefromgroup.value.taxamount.toFixed(2)],
      chargeprice: [
        this.chargefromgroup.value.chargeprice,
        this.planGroupForm.value.category === "Business Promotion"
          ? Validators.compose([Validators.max(this.chargefromgroup.value.chargeprice)])
          : null
      ],
      price: [this.chargefromgroup.value.price],
      currency: [this.chargefromgroup.value.currency]
    });
  }

  onAddChargeField() {
    if (this.planGroupForm.value.serviceId) {
      this.chargeSubmitted = true;
      if (this.chargefromgroup.valid) {
        this.countTotalOfferPrice = 0;
        this.totalPriceData.push(Number(this.pricePerTax));
        for (let j = 0; j < this.totalPriceData.length; j++) {
          this.countTotalOfferPrice = this.countTotalOfferPrice + Number(this.totalPriceData[j]);
        }
        this.planGroupForm.patchValue({
          offerprice: this.countTotalOfferPrice.toFixed(2),
          newOfferPrice: this.countTotalOfferPrice
        });
        this.filterChargesByCurrency(this.chargefromgroup.value);
        this.chargeFromArray.push(this.createChargeFormGroup());

        this.commondropdownService.getchargeAll();
        setTimeout(() => {
          this.chargeFromArray.controls.forEach(ctrl => {
            const val = ctrl.get("id")?.value;
            if (val) {
              ctrl.get("id")?.setValue(val);
            }
          });
        }, 0);
        this.chargefromgroup.reset();
        if (this.planGroupForm.controls.plantype.value == "Prepaid") {
          this.chargefromgroup.controls.billingCycle.setValue("1");
          this.chargefromgroup.controls.billingCycle.disable();
        }
        if (this.chargeFromArray?.length > 0) {
          this.planGroupForm.controls?.currency.setValue(this.chargeFromArray?.value[0]?.currency);
        }

        this.chargeSubmitted = false;
      } else {
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: "Service Field Required",
        icon: "far fa-times-circle"
      });
    }
  }

  createQosPolicyFormGroup(): FormGroup {
    for (const prop in this.qospolicyformgroup.controls) {
      this.qospolicyformgroup.value[prop] = this.qospolicyformgroup.controls[prop].value;
    }

    return this.fb.group({
      planid: [this.planGroupForm.value.id],
      qosid: [this.qospolicyformgroup.value.qosid],
      frompercentage: [this.qospolicyformgroup.value.frompercentage],
      topercentage: [this.qospolicyformgroup.value.topercentage]
    });
  }

  onAddQosPolicy() {
    if (this.planGroupForm.value.qospolicyid) {
      this.qospolicySubmitted = true;
      if (this.qospolicyformgroup.valid) {
        this.minfrompercentage = this.qospolicyformgroup.value.topercentage;
        this.qospolicyformArray.push(this.createQosPolicyFormGroup());
        this.qospolicyformgroup.reset();
        this.qospolicyformgroup
          .get("frompercentage")
          .setValidators([Validators.required, Validators.min(Number(this.minfrompercentage))]);
        this.qospolicyformgroup.get("frompercentage").updateValueAndValidity();
        this.qospolicySubmitted = false;
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: "Qos Policy Field Required",
        icon: "far fa-times-circle"
      });
    }
  }

  getPlanGroup() {
    const url = "/commonList/planGroup";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.planGroupData = response.dataList;
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

  getPlanCaegory() {
    const url = "/commonList/planCategory";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.planCategoryData = response.dataList;
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

  getPlanType() {
    const url = "/commonList/planType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.planTypeData = response.dataList;
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

  getService(mvnoId?: any) {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    const url = "/planservice/all?mvnoId=" + actualMvnoId;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.serviceData = response.serviceList;
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

  getQosPolicy(mvnoId?) {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    const url = "/qosPolicy/all?mvnoId=" + actualMvnoId;
    this.qosPolicyService.getMethod(url).subscribe(
      (response: any) => {
        this.qosPolicyData = response.dataList;
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

  getTimeBasePolicy(mvnoId?) {
    const actualMvnoId = mvnoId ?? localStorage.getItem("mvnoId");
    const url = "/timebasepolicy/all?mvnoId=" + actualMvnoId;
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.data = response.dataList;
        this.timeBasePolicyData = this.data.filter(element => element.status === "Active");
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

  getQoutaData() {
    const url = "/commonList/quotaTypeData";
    this.commondropdownService.getMethodWithCacheCMS(url).subscribe(
      (response: any) => {
        this.quotaData = response.dataList;
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
  getInventoryCat() {
    if (this.statusCheckService.isActiveInventoryService) {
      const url = "/productCategory/getAllActiveProductCategoriesByCB";
      this.productCategoryManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.inventoryCat = response;
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
  getQoutaType() {
    const url = "/commonList/quotaType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.quotaTypeData = response.dataList;
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

  getSelQoutaType(event) {
    const selQuotaType = event.value;
    if (selQuotaType == "Both") {
      this.planGroupForm.controls.quotaUnit.enable();
      this.planGroupForm.controls.quota.enable();
      this.planGroupForm.controls.quotaunittime.enable();
      this.planGroupForm.controls.quotatime.enable();
      this.isQuotaEnabled = true;
      this.isQuotaTimeEnabled = true;
    } else if (selQuotaType == "Time") {
      this.planGroupForm.controls.quotaUnit.disable();
      this.planGroupForm.controls.quota.disable();
      this.planGroupForm.controls.quotaunittime.enable();
      this.planGroupForm.controls.quotatime.enable();
      this.isQuotaEnabled = false;
      this.isQuotaTimeEnabled = true;
    } else if (selQuotaType == "Data") {
      this.planGroupForm.controls.quotaUnit.enable();
      this.planGroupForm.controls.quota.enable();
      this.planGroupForm.controls.quotaunittime.disable();
      this.planGroupForm.controls.quotatime.disable();
      this.isQuotaEnabled = true;
      this.isQuotaTimeEnabled = false;
    } else {
      this.planGroupForm.controls.quotaUnit.disable();
      this.planGroupForm.controls.quota.disable();
      this.planGroupForm.controls.quotaunittime.disable();
      this.planGroupForm.controls.quotatime.disable();
      this.isQuotaEnabled = false;
      this.isQuotaTimeEnabled = false;
    }
  }

  getChargeById(chargeId) {
    if (chargeId) {
      const url = "/charge/" + chargeId + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.planManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.viewChargeListData = response.chargebyid;
          this.charge.actualprice = this.viewChargeListData.actualprice;
          this.charge.price = this.viewChargeListData.price;
          this.charge.chargecategory = this.viewChargeListData.chargecategory;
          this.charge.chargetype = this.viewChargeListData.chargetype;
          this.charge.desc = this.viewChargeListData.desc;
          this.charge.discountid = this.viewChargeListData.discountid;
          this.charge.id = this.viewChargeListData.id;
          this.charge.name = this.viewChargeListData.name;
          this.charge.price = parseFloat(this.viewChargeListData.price.toString());
          this.charge.saccode = this.viewChargeListData.saccode;
          this.charge.taxName = this.viewChargeListData.taxName;
          this.charge.taxamount = parseFloat(this.viewChargeListData.taxamount.toString());
          this.charge.taxid = this.viewChargeListData.taxid;
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

  selServiceArea(e) {
    let data = [];
    if (this.planGroupForm.value.plantype && this.planGroupForm.value.serviceAreaIds) {
      this.isServiceArea_PlanType = false;
    }
    data = e.value;

    let url =
      "/serviceArea/getAllServicesByServiceAreaId?mvnoId=" + Number(localStorage.getItem("mvnoId"));
    this.customermanagementservice.postMethod(url, data).subscribe((response: any) => {
      this.serviceList = response.dataList;
    });

    // this.planGroupForm.controls.serviceId.setValue("");
    // this.chargeFromArray = this.fb.array([]);
    // this.chargefromgroup.reset();
  }
  plantypeEvntData(_event) {
    let recurringLIST = [];
    let refundableList = [];
    let nonrecurringList = [];
    this.chargeArray = [];

    if ("Prepaid" == _event.value) {
      // this.chargeArray = [];
      this.prepaidListView = true;
      this.postpaidListView = false;
      this.validityHide = false;
      this.planGroupForm.controls.validity.setValidators([Validators.required]);
      this.planGroupForm.controls.validity.updateValueAndValidity();
      //
      // const url = "/charge/ByType/Advance";s
      // this.planManagementService.getMethod(url).subscribe((response: any) => {
      //   this.chargeArray.push(...response.chargelist);

      //   const url3 = "/charge/ByType/NON_RECURRING";
      //   this.planManagementService.getMethod(url3).subscribe((response: any) => {
      //     this.chargeArray.push(...response.chargelist);
      //
      //   });
      // });

      this.chargefromgroup.controls.billingCycle.setValue("1");
      this.chargefromgroup.controls.billingCycle.disable();
      this.prepaidType = true;
    }

    if ("Postpaid" == _event.value) {
      // this.chargeArray = [];
      this.postpaidListView = true;
      this.prepaidListView = false;
      this.validityHide = true;
      this.planGroupForm.controls.validity.clearValidators();
      this.planGroupForm.controls.validity.updateValueAndValidity();

      //
      // const url1 = "/charge/ByType/RECURRING";
      // this.planManagementService.getMethod(url1).subscribe((response: any) => {
      //   recurringLIST = response.chargelist;
      //   this.chargeArray.push(...response.chargelist);
      //   const url3 = "/charge/ByType/NON_RECURRING";
      //   this.planManagementService.getMethod(url3).subscribe((response: any) => {
      //     nonrecurringList = response.chargelist;
      //     this.chargeArray.push(...response.chargelist);
      //
      //   });
      // });

      // const url2 = "/charge/ByType/REFUNDABLE";
      // this.planManagementService.getMethod(url2).subscribe((response: any) => {
      //   refundableList = response.chargelist;
      //   this.chargeArray.push(...response.chargelist);
      // });

      this.chargefromgroup.controls.billingCycle.enable();
      this.prepaidType = false;
    }

    if (this.planGroupForm.value.plantype) {
      this.isServiceArea_PlanType = false;
    }
    if (this.viewPlanListData.plantype !== _event.value) {
      this.chargeFromArray = this.fb.array([]);
      this.chargefromgroup.reset();
      this.planGroupForm.controls.offerprice.setValue("");
      this.planGroupForm.controls.newOfferPrice.setValue("");
    }
    if (this.totalCharges.length > 0) {
      this.advanceListData = [];
      this.totalCharges.forEach(element => {
        if (this.planGroupForm.value.plantype == "Prepaid") {
          if (
            element.charge.chargetype == "ADVANCE" ||
            element.charge.chargetype == "NON_RECURRING"
          ) {
            this.advanceListData.push(element.charge);
          }
        } else if (this.planGroupForm.value.plantype == "Postpaid") {
          if (
            element.charge.chargetype == "RECURRING" ||
            element.charge.chargetype == "NON_RECURRING" ||
            element.charge.chargetype == "ADVANCE"
          ) {
            this.advanceListData.push(element.charge);
          }
        }
        this.filterChargeType();
      });
    }
  }

  addEditPostPaidPlan(postPaidPlanId) {
    this.submitted = true;
    this.templateSubmitted = true;
    // this.planGroupForm.value.quota = this.planGroupForm.value.quota
    //   ? this.planGroupForm.value.quota
    //   : 1;
    // this.planGroupForm.value.quotaUnit = this.planGroupForm.value.quotaUnit
    //   ? this.planGroupForm.value.quotaUnit
    //   : "GB";
    // this.planGroupForm.value.quotatype = this.planGroupForm.value.quotatype
    //   ? this.planGroupForm.value.quotatype
    //   : "Data";

    if (this.planGroupForm.controls.planGroup.value == "Volume Booster") {
      this.planGroupForm.get("qospolicyid").clearValidators();
      this.planGroupForm.get("qospolicyid").updateValueAndValidity();
    }
    // if (
    //   this.planGroupForm.controls.maxHoldDurationDays.value == null ||
    //   this.planGroupForm.controls.maxHoldDurationDays.value == undefined
    // ) {
    //   this.planGroupForm.controls.maxHoldDurationDays.setValue(0);
    // }
    // if (
    //   this.planGroupForm.controls.maxHoldAttempts.value == null ||
    //   this.planGroupForm.controls.maxHoldAttempts.value == undefined
    // ) {
    //   this.planGroupForm.controls.maxHoldAttempts.setValue(0);
    // }
    console.log("this.planGroupForm :::: ", this.planGroupForm);
    if (this.planGroupForm.valid) {
      if (postPaidPlanId) {
        if (
          this.planGroupForm.value.unitsOfValidity == "" ||
          this.planGroupForm.value.unitsOfValidity == null
        ) {
          this.planGroupForm.value.unitsOfValidity = "Days";
        }
        if (this.planGroupForm.value.mode == "" || this.planGroupForm.value.mode == null) {
          this.planGroupForm.value.mode = "NORMAL";
        }

        this.planGroupForm.value.maxconcurrentsession =
          this.planGroupForm.value.maxconcurrentsession;
        this.createPlanData = this.planGroupForm.value;
        this.createPlanData.chargeList = this.chargeFromArray.value;
        for (let [index] of this.chargeFromArray.value.entries()) {
          if (this.chargeFromArray.value[index].id) {
            let Ids = this.chargeFromArray.value[index].id;
            this.charge = {
              id: "",
              actualprice: "",
              taxamount: "",
              price: ""
            };
            this.createPlanData.chargeList[index].charge = this.charge;
            this.createPlanData.chargeList[index].charge.id = Ids;
            this.createPlanData.chargeList[index].charge.actualprice =
              this.chargeFromArray.value[index].actualprice;
            this.createPlanData.chargeList[index].charge.taxamount =
              this.chargeFromArray.value[index].taxamount;
            this.createPlanData.chargeList[index].charge.price =
              this.chargeFromArray.value[index].price;
            delete this.createPlanData.chargeList[index].id;
            delete this.createPlanData.chargeList[index].actualprice;
            delete this.createPlanData.chargeList[index].taxamount;
            delete this.createPlanData.chargeList[index].price;
          }
        }
        this.createPlanData.nextApprover = this.viewPlanListData.nextApprover;
        this.createPlanData.nextStaff = this.viewPlanListData.nextStaff;
        delete this.createPlanData.radiusprofileIds;

        if (this.copyEditPlanData !== this.createPlanData) {
          this.createPlanData.status = "NewActivation";
        }
        this.createPlanData.productplanmappingList = [];
        this.createPlanData.productplanmappingList = this.planProductMappingFromArray.value;

        this.createPlanData.planCasMappingList = this.planCasMappingFromArray.value;
        this.createPlanData.planQosMappingEntityList = this.qospolicyformArray.value;
        this.createPlanData = { ...this.createPlanData, ...this.customerGroupForm.value };

        this.createPlanData.useQuota = this.planGroupForm.value.useQuota;
        this.createPlanData.addonToBase = this.planGroupForm.value.addonToBase;
        this.createPlanData.chunk = this.planGroupForm.value.chunk;
        this.createPlanData.validity = this.planGroupForm.value.validity;
        let mvnoId =
          localStorage.getItem("mvnoId") === "1"
            ? this.planGroupForm.value?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        const url = "/postpaidplan/" + postPaidPlanId + "?mvnoId=" + mvnoId;
        if (this.planGroupForm.value.chargeList.length > 0) {
          this.planManagementService.updateMethod(url, this.createPlanData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.templateSubmitted = false;
              this.ifServiceParam = false;
              this.planGroupForm.reset();
              this.customerGroupForm.reset();
              this.fieldsArr = [];
              //   if (!this.searchkey) {
              //     this.getPostoaidPlan("");
              //   } else {
              //   this.searchPlan("");
              //   }

              this.totalPriceData = [];
              this.chargeFromArray.controls = [];
              this.planProductMappingFromArray = this.fb.array([]);
              this.planProductMappingFromArray.controls = [];
              this.isServiceHideField = false;
              this.chargefromgroup.reset();
              this.planProductfromgroup.reset();
              this.planProductMappingFromArray = this.fb.array([]);
              this.planProductfromgroup.reset();
              this.planGroupForm.get("qospolicyid").clearValidators();
              this.planGroupForm.get("qospolicyid").updateValueAndValidity();
              this.planGroupForm.get("newOfferPrice").clearValidators();
              this.planGroupForm.get("newOfferPrice").updateValueAndValidity();
              this.productChargeFlag = false;
              this.minStartDate = "";
              this.minEndDate = "";
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });

              this.addEditListPlan();
            },
            (error: any) => {
              // if(error.error.status == 400){
              //   this.messageService.add({
              //     severity: 'info',
              //     summary: "info",
              //     detail: "Profile already added under same Profile",
              //     icon: "far fa-times-circle",
              //   });
              // }
              //
              if (error.error.status == 406 || error.error.status == 417) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: error.error.ERROR,
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
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Required ",
            detail: "Minimum one Charge Details need to add",
            icon: "far fa-times-circle"
          });
        }
      } else {
        if (this.planGroupForm.value.category !== "Business Promotion") {
          this.planGroupForm.value.newOfferPrice = 0;
        }

        if (
          this.planGroupForm.value.unitsOfValidity == "" ||
          this.planGroupForm.value.unitsOfValidity == null
        ) {
          this.planGroupForm.value.unitsOfValidity = "Days";
        }
        if (this.planGroupForm.value.mode == "" || this.planGroupForm.value.mode == null) {
          this.planGroupForm.value.mode = "NORMAL";
        }
        this.createPlanData.maxconcurrentsession = this.planGroupForm.value.maxconcurrentsession;
        this.createPlanData = this.planGroupForm.value;
        this.createPlanData.chargeList = this.chargeFromArray.value;
        this.createPlanData.code = "";
        for (let [index] of this.chargeFromArray.value.entries()) {
          if (this.chargeFromArray.value[index].id) {
            let Ids = this.chargeFromArray.value[index].id;
            this.charge = {
              id: ""
            };
            this.createPlanData.chargeList[index].charge = this.charge;
            this.createPlanData.chargeList[index].charge.id = Ids;
            this.createPlanData.chargeList[index].charge.actualprice =
              this.chargeFromArray.value[index].actualprice;
            this.createPlanData.chargeList[index].charge.taxamount =
              this.chargeFromArray.value[index].taxamount;
            this.createPlanData.chargeList[index].charge.price =
              this.chargeFromArray.value[index].price;
            delete this.createPlanData.chargeList[index].id;
            delete this.createPlanData.chargeList[index].actualprice;
            delete this.createPlanData.chargeList[index].taxamount;
            delete this.createPlanData.chargeList[index].price;
          }
        }
        this.createPlanData.status = "NewActivation";
        delete this.createPlanData.radiusprofileIds;
        this.createPlanData.productplanmappingList = [];
        this.createPlanData.productplanmappingList = this.planProductMappingFromArray.value;
        this.createPlanData.planCasMappingList = this.planCasMappingFromArray.value;
        this.createPlanData.planQosMappingEntityList = this.qospolicyformArray.value;
        let mvnoId =
          localStorage.getItem("mvnoId") === "1"
            ? this.planGroupForm.value?.mvnoId
            : Number(localStorage.getItem("mvnoId"));
        const url = "/postpaidplan";
        // this.createPlanData['serviceParam'] = this.customerGroupForm.value;
        // this.createPlanData['serviceParam2'] = '8';
        // this.onSubmit();
        this.createPlanData = { ...this.createPlanData, ...this.customerGroupForm.value };

        this.createPlanData.useQuota = this.planGroupForm.value.useQuota;
        this.createPlanData.addonToBase = this.planGroupForm.value.addonToBase;
        this.createPlanData.chunk = this.planGroupForm.value.chunk;

        if (this.planGroupForm.value.chargeList.length > 0) {
          this.createPlanData.mvnoId = mvnoId;
          this.planManagementService.postMethod(url, this.createPlanData).subscribe(
            (response: any) => {
              this.submitted = false;
              this.templateSubmitted = false;
              this.ifServiceParam = false;
              this.planGroupForm.reset();
              this.customerGroupForm.reset();
              //   if (!this.searchkey) {
              //     this.getPostoaidPlan("");
              //   } else {
              //   this.searchPlan("");
              //   }
              this.totalPriceData = [];
              this.chargeFromArray.controls = [];
              this.planProductMappingFromArray = this.fb.array([]);
              this.planProductMappingFromArray.controls = [];
              this.chargefromgroup.reset();
              this.planProductfromgroup.reset();
              this.planGroupForm.get("qospolicyid").clearValidators();
              this.planGroupForm.get("qospolicyid").updateValueAndValidity();
              this.planGroupForm.get("newOfferPrice").clearValidators();
              this.planGroupForm.get("newOfferPrice").updateValueAndValidity();
              this.minEndDate = "";
              this.minStartDate = "";
              this.isServiceHideField = false;
              this.productChargeFlag = false;
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });

              this.addEditListPlan();
            },
            (error: any) => {
            if(error.error.status === 406){
                this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
                }
             else{
                 this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
             }
            }
          );
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Required ",
            detail: "Minimum one Charge Details need to add",
            icon: "far fa-times-circle"
          });
        }
      }
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Required ",
        detail: "Please enter all required data to proceed.",
        icon: "far fa-times-circle"
      });
    }
  }

  selSearchOption(event) {
    this.searchDeatil = "";
    this.searchOptionType = "";
    this.searchData.filters[0].filterDataType = "";
  }

  searchPlan(currentPage) {
    if (
      this.searchOption !== "plantype" &&
      this.searchOption !== "planname" &&
      this.searchOption !== "planvalidity" &&
      this.searchOption !== "planstartdate" &&
      this.searchOption !== "planenddate" &&
      this.searchOption !== "plancreateddate"
    ) {
      // if (
      //   !this.searchkey ||
      //   this.searchkey !== this.searchDeatil.trim() ||
      //   !this.searchkey2 ||
      //   this.searchkey2 !== this.searchOption.trim()
      // ) {
      //   this.currentPagePostPaidPlan = 1;
      // }
      this.searchkey = this.searchDeatil.trim();
      this.searchkey2 = this.searchOption.trim();

      this.searchData.filters[0].filterValue = this.searchDeatil.trim();
      this.searchData.filters[0].filterColumn = this.searchOption.trim();
    } else if (this.searchOption === "planname" || this.searchOption === "plantype") {
      // if (
      //   !this.searchkey ||
      //   this.searchkey !== this.searchDeatil.trim() ||
      //   !this.searchkey2 ||
      //   this.searchkey2 !== this.searchOption.trim()
      // ) {
      //   this.currentPagePostPaidPlan = 1;
      // }
      this.searchkey = this.searchDeatil.trim();
      this.searchkey2 = this.searchOptionType.trim();

      this.searchData.filters[0].filterDataType = this.searchOptionType.trim();
      this.searchData.filters[0].filterValue = this.searchDeatil.trim();
      this.searchData.filters[0].filterColumn = this.searchOption;
    } else if (this.searchOption === "planvalidity") {
      // if (
      //   !this.searchkey ||
      //   this.searchkey !== this.searchDeatil.trim() ||
      //   !this.searchkey2 ||
      //   this.searchkey2 !== this.searchOption.trim()
      // ) {
      //   this.searchData.page = this.currentPagePostPaidPlan;
      //   this.searchData.pageSize = this.postPaidPlanitemsPerPage;
      // }
      this.searchkey = this.searchDeatil.trim() + " " + this.searchUnitsOfValidity.trim();
      this.searchkey2 = this.searchOption.trim();

      this.searchData.filters[0].filterValue =
        this.searchDeatil.trim() + " " + this.searchUnitsOfValidity.trim();
      this.searchData.filters[0].filterColumn = this.searchOption.trim();
    } else if (this.searchOption === "plancreateddate") {
      // if (
      //   !this.searchkey ||
      //   this.searchkey !== this.searchDeatil ||
      //   !this.searchkey2 ||
      //   this.searchkey2 !== this.searchOption
      // ) {
      //   this.currentPagePostPaidPlan = 1;
      // }
      let searchDeatilToDate = this.datePipe.transform(this.searchDeatilToDate, "yyyy-MM-dd");
      let searchDeatilFromDate = this.datePipe.transform(this.searchDeatilFromDate, "yyyy-MM-dd");
      let searchDeatil = {
        from: searchDeatilFromDate,
        to: searchDeatilToDate
      };
      this.searchkey2 = JSON.stringify(searchDeatil);
      this.searchkey2 = this.searchOption;

      this.searchData.filters[0].filterValue = JSON.stringify(searchDeatil);
      this.searchData.filters[0].filterColumn = this.searchOption;
    } else {
      // if (
      //   !this.searchkey ||
      //   this.searchkey !== this.searchDeatil ||
      //   !this.searchkey2 ||
      //   this.searchkey2 !== this.searchOption
      // ) {
      //   this.currentPagePostPaidPlan = 1;
      // }
      let searchDeatil = this.datePipe.transform(this.searchDeatil, "yyyy-MM-dd");
      this.searchkey = searchDeatil;
      this.searchkey2 = this.searchOption;

      this.searchData.filters[0].filterValue = searchDeatil;
      this.searchData.filters[0].filterColumn = this.searchOption;
    }

    if (!currentPage) {
      this.currentPagePostPaidPlan = 1;
    }

    this.searchData.page = this.currentPagePostPaidPlan;
    this.searchData.pageSize = this.postPaidPlanitemsPerPage;

    const url = "/postpaidplan/search?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        this.postPaidPlanList = response.postpaidplanList;
        this.postPaidPlantotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.postPaidPlantotalRecords = 0;
        this.postPaidPlanList = [];
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

  clearSearchPlan() {
    this.searchOption = "";
    this.searchDeatil = "";
    this.searchkey = "";
    this.searchkey2 = "";
    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: "",
      pageSize: ""
    };
    this.countTotalOfferPrice = 0;
    this.searchPlan("");
    this.submitted = false;
    this.templateSubmitted = false;
    this.ifServiceParam = false;
    this.totalPriceData = [];
  }
  planData1(id) {
    const url = "/getproductfromplan?id=" + id + "&mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(url).subscribe((response: any) => {
      let data = response;
      if (data.length > 0) {
        this.planGroupForm.patchValue({
          product_category: data[0].product_category,
          product_type: data[0].product_type
        });
      }
    });
  }

  checkPlanCustomerBinding(planId) {
    const url = "/customer/checkPlanCustomerBinding/" + planId;
    this.planManagementService.getMethod(url).subscribe((response: any) => {
      let checkPlanCustomerBinding = response.isAlreadyExists;
      if (checkPlanCustomerBinding == true) {
        this.ifPlanEditInput = true;
      } else {
        this.ifPlanEditInput = false;
      }
      //  "isAlreadyExists": false,
    });
  }
  //taxDetails = [];
  copyEditPlanData: any = [];
  isEditPlan = false;
  editPostPaidPlan(planId) {
    this.isEditPlan = true;
    // this.getFields();

    this.countTotalOfferPrice = 0;
    this.isServiceHideField = false;
    this.totalPriceData = [];
    this.advanceListData = [];
    this.ifplanGroup_BWB = false;
    this.ifplanGroup_VB = false;
    this.planProductMappingFromArray = this.fb.array([]);
    this.planCasMappingFromArray = this.fb.array([]);
    this.chargeFromArray = this.fb.array([]);
    let taxAmountAray = [];
    this.planProductfromgroup.reset();
    this.chargefromgroup.reset();
    this.planCasMappingFromGroup.reset();
    this.isServiceArea_PlanType = false;
    let taxAmount: any = [];
    this.planGroupForm.controls.status.disable();
    if (planId) {
      this.listView = false;
      this.createView = true;
      this.ifPlanEditInput = false;
      this.detailView = false;
      this.submitted = false;
      this.templateSubmitted = false;
      this.ifServiceParam = false;
      this.chargeSubmitted = false;
      this.qospolicySubmitted = false;
      this.planProductSubmitted = false;
      this.ifplanGroup_BWB = false;
      this.ifplanGroup_VB = false;

      this.billingSequence();
      this.getProductData();
      this.getService();
      const url = "/postpaidplan/" + planId + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.planManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.isPlanEdit = true;

          // this.createPlan()
          // this.planGroupForm.controls.maxconcurrentsession.disable();
          // this.planGroupForm.controls.validity.disable();
          // this.planGroupForm.controls.quota.disable();
          // this.planGroupForm.controls.quotatime.disable();
          this.viewPlanListData = response.postPaidPlan;
          if (response.postPaidPlan.casId) {
            this.getAllCASPackage(response.postPaidPlan.casId);
          }

          if (this.viewPlanListData.status == "NewActivation") {
            this.ifPlanEditInput = false;
            this.planStatusField = true;
            this.planStatus = [{ label: "New Activation", value: "NewActivation" }];
          } else {
            this.checkPlanCustomerBinding(planId);
            this.planStatus = [
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" }
            ];
            this.planStatusField = false;
            let status = this.viewPlanListData.status;
            this.viewPlanListData.status = status.toUpperCase();
          }

          this.patchDataInQosData(this.viewPlanListData);
          this.planGroupForm.patchValue(this.viewPlanListData);
          this.chargeFilterData(this.viewPlanListData.serviceId);
          if (this.viewPlanListData.serviceId) {
            let serviceID = {
              value: this.viewPlanListData.serviceId
            };
            this.selService(serviceID);
          }

          this.planData1(planId);
          if (this.viewPlanListData.quotatype == "Time") {
            this.planGroupForm.controls.quotaUnit.disable();
            this.planGroupForm.controls.quota.disable();
            this.planGroupForm.controls.quotaunittime.enable();
            this.planGroupForm.controls.quotatime.enable();
            this.isQuotaEnabled = false;
            this.isQuotaTimeEnabled = true;
            this.planGroupForm.patchValue({
              quotaunittime: this.viewPlanListData.quotaunittime,
              quotatime: this.viewPlanListData.quotatime
            });
          } else if (this.viewPlanListData.quotatype == "Data") {
            this.planGroupForm.controls.quotaUnit.enable();
            this.planGroupForm.controls.quota.enable();
            this.planGroupForm.controls.quotaunittime.disable();
            this.planGroupForm.controls.quotatime.disable();
            this.isQuotaEnabled = true;
            this.isQuotaTimeEnabled = false;
            this.planGroupForm.patchValue({
              quotaUnit: this.viewPlanListData.quotaUnit,
              quota: Number(this.viewPlanListData.quota)
            });
          } else if (this.viewPlanListData.quotatype == "Both") {
            this.planGroupForm.controls.quotaUnit.enable();
            this.planGroupForm.controls.quota.enable();
            this.planGroupForm.controls.quotaunittime.enable();
            this.planGroupForm.controls.quotatime.enable();
            this.isQuotaEnabled = true;
            this.isQuotaTimeEnabled = true;
            this.planGroupForm.patchValue({
              quotaunittime: this.viewPlanListData.quotaunittime,
              quotatime: this.viewPlanListData.quotatime,
              quotaUnit: this.viewPlanListData.quotaUnit,
              quota: this.viewPlanListData.quota
            });
          }
          this.planGroupForm.controls.validity.setValidators([Validators.required]);
          this.planGroupForm.controls.validity.updateValueAndValidity();
          if (this.viewPlanListData.plantype == "Prepaid") {
            this.chargefromgroup.controls.billingCycle.setValue("1");
            this.chargefromgroup.controls.billingCycle.disable();
            // this.planGroupForm.controls.validity.setValidators([Validators.required]);
            // this.planGroupForm.controls.validity.updateValueAndValidity();
          } else {
            this.chargefromgroup.controls.billingCycle.enable();
            // this.planGroupForm.controls.validity.clearValidators();
            // this.planGroupForm.controls.validity.updateValueAndValidity();
          }

          if (this.viewPlanListData.planGroup == "Registration") {
            this.type = [{ label: "NORMAL" }];
            this.ifplanGroup_BWB = false;
            this.ifplanGroup_VB = false;
          }
          //   else if (this.viewPlanListData.planGroup == "Volume Booster") {
          //     this.ifplanGroup_VB = true;
          //     this.ifplanGroup_BWB = false;
          //   }
          else if (this.viewPlanListData.planGroup == "Bandwidthbooster") {
            this.ifplanGroup_BWB = true;
            this.ifplanGroup_VB = false;
          } else {
            this.ifplanGroup_BWB = false;
            this.ifplanGroup_VB = false;
            this.type = [{ label: "NORMAL" }, { label: "SPECIAL" }];
          }
          if (this.viewPlanListData.planGroup == "Registration") {
            this.planProductMappingShowFlag = true;
          } else if (this.viewPlanListData.planGroup == "Registration and Renewal") {
            this.planProductMappingShowFlag = true;
          } else {
            this.planProductMappingShowFlag = false;
            this.planProductMappingFromArray = this.fb.array([]);
            this.planProductfromgroup.reset();
          }
          let servicAreaId = [];
          for (let k = 0; k < this.viewPlanListData.serviceAreaNameList.length; k++) {
            servicAreaId.push(this.viewPlanListData.serviceAreaNameList[k].id);
          }

          this.planGroupForm.patchValue({
            maxconcurrentsession: this.viewPlanListData.maxconcurrentsession,
            serviceAreaIds: servicAreaId,
            offerprice: this.viewPlanListData.offerprice,
            newOfferPrice: this.viewPlanListData.newOfferPrice,
            currency: this.viewPlanListData.currency ?? this.currency
          });
          const mvnoId = this.viewPlanListData?.mvnoId ?? Number(localStorage.getItem("mvnoId"));
          if (this.planGroupForm.value.serviceAreaIds) {
            let url = "/serviceArea/getAllServicesByServiceAreaId?mvnoId=" + mvnoId;
            this.customermanagementservice
              .postMethod(url, servicAreaId)
              .subscribe((response: any) => {
                this.serviceList = response.dataList;
              });
          }
          this.chargeFromArray = this.fb.array([]);

          this.viewPlanListData.chargeList.forEach(element => {
            // const url = "/charge/" + element.charge.id;
            // this.planManagementService.getMethod(url).subscribe((res: any) => {
            console.log("curreny :::::::: ", this.planGroupForm.controls?.currency?.value);
            this.chargeFromArray.push(
              this.fb.group({
                id: [element.charge.id],
                billingCycle: [element.billingCycle],
                taxamount: [Number(element.charge.taxamount).toFixed(2)],
                actualprice: [element.charge.price],
                price: [element.charge.price],
                chargeprice: [element.chargeprice],
                currency: [this.planGroupForm.controls?.currency?.value]
              })
            );
            // });
          });

          this.viewPlanListData.planCasMappingList.forEach(element => {
            this.planCasMappingFromArray.push(
              this.fb.group({
                id: [element.id],
                casId: [element.casId],
                packageId: [element.packageId],
                planId: [element.planId]
              })
            );
            this.casmasterData.forEach(ele1 => {
              if (ele1.id == element.casId) {
                this.casPackegeAllData = [...this.casPackegeAllData, ...ele1.casPackageMappings];
              }
            });
          });
          this.taxDetails = [];
          for (var index = 0; index < this.viewPlanListData.chargeList.length; index++) {
            let taxData: any = [];
            let slabList: any = [];
            let tireList: any = [];
            let slabPrice: any = [];
            let amount = 0;
            let totalslebPrice = 0;
            let price = this.viewPlanListData.chargeList[index].chargeprice
              ? this.viewPlanListData.chargeList[index].chargeprice
              : this.viewPlanListData.chargeList[index].charge.price;
            let url = "/taxes/" + Number(this.viewPlanListData.chargeList[index].charge.taxid);
            this.planManagementService.getMethod(url).subscribe((response: any) => {
              response.taxData.tieredList.forEach(element => {
                this.taxDetails.push(element);
              });
              this.taxAmount;
              taxData = response.taxData;
              if (taxData.taxtype == "SLAB") {
                slabList = taxData.slabList;
                if (slabList.length > 0) {
                  for (let i = 0; i < slabList.length; i++) {
                    if (price >= slabList[i].rangeUpTo) {
                      if (i == 0) {
                        amount =
                          slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                        price = price - slabList[i].rangeUpTo;
                      } else {
                        let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                        amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                        price = price - NewAmount;
                      }
                      slabPrice.push(amount);
                      if (slabList.length == i + 1) {
                        slabPrice.forEach(element => {
                          totalslebPrice = totalslebPrice + Number(element);
                        });
                        this.pricePerTax = totalslebPrice.toFixed(2);

                        this.totalPriceData.push(Number(this.pricePerTax));
                        this.countTotalOfferPrice =
                          Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                        this.planGroupForm.patchValue({
                          newOfferPrice: this.countTotalOfferPrice.toFixed(2)
                        });
                      }
                    } else {
                      amount = price + (price * slabList[i].rate) / 100;
                      slabPrice.push(amount);
                      slabPrice.forEach(element => {
                        totalslebPrice = totalslebPrice + Number(element);
                      });
                      this.pricePerTax = totalslebPrice.toFixed(2);
                      this.totalPriceData.push(Number(this.pricePerTax));
                      this.countTotalOfferPrice =
                        Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                      this.planGroupForm.patchValue({
                        newOfferPrice: this.countTotalOfferPrice.toFixed(2)
                      });

                      slabList.length = 0;
                    }
                  }
                }
              } else if (taxData.taxtype == "TIER") {
                let ifsameTire = false;
                if (taxData.tieredList.length > 0) {
                  tireList = taxData.tieredList;
                  if (tireList.length > 0) {
                    let newAmount = 0;
                    let totalAmountTire = 0;
                    let totalPricetire = 0;
                    let tireAmountList = [];

                    amount = price + (price * tireList[0].rate) / 100;
                    newAmount = (price * tireList[0].rate) / 100;
                    totalAmountTire = amount;
                    if (tireList.length == 1) {
                      this.taxAmountCal(price, tireList[0].rate);
                      taxAmountAray.push(this.taxAmount);
                      this.pricePerTax = amount.toFixed(2);

                      this.countTotalOfferPrice =
                        Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                      this.planGroupForm.patchValue({
                        newOfferPrice: this.countTotalOfferPrice.toFixed(2)
                      });
                      this.totalPriceData.push(Number(this.pricePerTax));
                      taxAmount.push(this.taxAmount);
                      // this.chargeFromArray.value.forEach((elem, indexCharge) => {
                      //   let nn = indexCharge + 1;
                      //   if (indexCharge == index - 1) {
                      //     elem.taxamount = Number(this.taxAmount);
                      //   }
                      //   if (this.chargeFromArray.value.length == nn) {
                      //     this.chargeFromArray.patchValue(this.chargeFromArray.value);
                      //   }
                      // });
                    } else {
                      // amount = newAmount
                      for (let i = 1; i < tireList.length; i++) {
                        let AcTiNo = i;
                        while (AcTiNo > 0) {
                          let TI_NO = AcTiNo - 1;
                          if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                            ifsameTire = true;
                            AcTiNo = 0;
                          } else {
                            amount = newAmount;
                            ifsameTire = false;
                          }
                          AcTiNo--;
                        }

                        if (ifsameTire) {
                          amount = amount + (amount * tireList[i].rate) / 100;

                          if (tireList.length == i + 1 || amount < 0) {
                            totalAmountTire = amount;
                            this.pricePerTax = totalAmountTire.toFixed(2);
                            tireList.length = 0;

                            this.countTotalOfferPrice =
                              Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                            this.planGroupForm.patchValue({
                              newOfferPrice: this.countTotalOfferPrice.toFixed(2)
                            });
                            let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
                            taxAmountAray.push(NewTaxAmountCount);
                            this.totalPriceData.push(Number(this.pricePerTax));

                            taxAmount.push(NewTaxAmountCount);
                            // this.chargeFromArray.value.forEach((elem, indexCharge) => {
                            //   let nn = indexCharge + 1;
                            //   if (indexCharge == index - 1) {
                            //     elem.taxamount = Number(this.pricePerTax) - Number(price);
                            //   }
                            //   if (this.chargeFromArray.value.length == nn) {
                            //     this.chargeFromArray.patchValue(this.chargeFromArray.value);
                            //   }
                            // });
                          }
                        } else {
                          amount = (amount * tireList[i].rate) / 100;
                          tireAmountList.push(amount);
                          if (tireList.length == i + 1 || amount < 0) {
                            tireAmountList.forEach(element => {
                              totalPricetire = totalPricetire + Number(element);
                            });
                            totalAmountTire = Number(totalAmountTire) + Number(totalPricetire);
                            this.pricePerTax = totalAmountTire.toFixed(2);
                            tireList.length = 0;

                            let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
                            taxAmountAray.push(NewTaxAmountCount);
                            this.countTotalOfferPrice =
                              Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                            this.planGroupForm.patchValue({
                              newOfferPrice: this.countTotalOfferPrice.toFixed(2)
                            });
                            this.totalPriceData.push(Number(this.pricePerTax));

                            taxAmount.push(NewTaxAmountCount);
                            // this.chargeFromArray.value.forEach((elem, indexCharge) => {
                            //   let nn = indexCharge + 1;
                            //   if (indexCharge == index - 1) {
                            //     elem.taxamount = Number(this.pricePerTax) - Number(amount);
                            //   }
                            //   if (this.chargeFromArray.value.length == nn) {
                            //     this.chargeFromArray.patchValue(this.chargeFromArray.value);
                            //   }
                            // });
                          }
                        }
                      }
                    }

                    taxAmount.forEach((element, i) => {
                      let nn = i + 1;
                      this.chargeFromArray.value.forEach((elem, j) => {
                        let mm = j + 1;
                        if (i == j) {
                          elem.taxamount = element.toFixed(2);
                        }
                        if (this.chargeFromArray.value.length == mm && taxAmount.length == nn) {
                          this.chargeFromArray.patchValue(this.chargeFromArray.value);
                        }
                      });
                    });
                  }
                }
              } else if (taxData.taxtype == "Compound") {
                let finalAmount = price;

                // Apply each tax tier
                taxData.tieredList.forEach(tax => {
                  finalAmount += finalAmount * (tax.rate / 100);
                });
                this.pricePerTax = finalAmount;
                this.totalPriceData.push(Number(this.pricePerTax));
                this.totalPriceData.forEach((element, j) => {
                  if (j == index - 1) {
                    this.totalPriceData[j] = this.pricePerTax;
                    let count = 0;
                    for (let j = 0; j < this.totalPriceData.length; j++) {
                      let n = this.totalPriceData[j];
                      count = Number(count) + Number(n);
                      this.countTotalOfferPrice = Number(count.toFixed(2));
                    }

                    this.chargeFromArray.value.forEach((elem, indexCharge) => {
                      let nn = indexCharge + 1;
                      if (indexCharge == index - 1) {
                        elem.taxamount = Number(this.pricePerTax) - Number(price);
                        elem.taxamount = elem.taxamount.toFixed(2);
                      }
                      if (this.chargeFromArray.value.length == nn) {
                        this.chargeFromArray.patchValue(this.chargeFromArray.value);
                      }
                    });
                    if (this.planGroupForm.value.category == "Business Promotion") {
                      this.planGroupForm.patchValue({
                        // offerprice: count.toFixed(2),
                        newOfferPrice: count.toFixed(2)
                      });
                    } else {
                      this.planGroupForm.patchValue({
                        offerprice: count.toFixed(2)
                        // newOfferPrice: count.toFixed(2),
                      });
                    }
                  }
                });
              }
            });
          }

          this.minStartDate = this.formatDate(this.viewPlanListData.startDate);
          this.minEndDate = this.formatDate(this.viewPlanListData.endDate);
          this.planGroupForm.patchValue({
            startDate: this.minStartDate,
            endDate: this.minEndDate
            });
          let copyEditPlan = this.planGroupForm.value;
          copyEditPlan.chargeList = this.chargeFromArray.value;
          this.copyEditPlanData = copyEditPlan;
          this.getProductPlanMappingDetails(planId, "editPlan");
          let obj = {
            value: this.viewPlanListData?.mvnoId
          };
          this.mvnoChange(obj);
        },
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
          // this.spinner.hide()
        }
      );
    }
  }
formatDate(date: string): string {
  // Convert any API date format to YYYY-MM-DD
  const d = new Date(date);
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}
  selPlanCategory(event) {
    if (event.value == "Business Promotion") {
      this.planGroupForm.get("newOfferPrice").setValidators([Validators.required]);
      this.planGroupForm.get("newOfferPrice").updateValueAndValidity();
      this.planGroupForm.patchValue({
        requiredApproval: true,
        invoiceToOrg: true,
        offerprice: "",
        newOfferPrice: ""
      });
    } else {
      this.planGroupForm.get("newOfferPrice").clearValidators();
      this.planGroupForm.get("newOfferPrice").updateValueAndValidity();
      this.planGroupForm.patchValue({
        requiredApproval: false,
        invoiceToOrg: false,
        offerprice: "",
        newOfferPrice: ""
      });
    }
    this.chargeFromArray = this.fb.array([]);
    this.chargefromgroup.reset();
    this.pricePerTax = 0;
    this.countTotalOfferPrice = 0;
    this.totalPriceData = [];
  }
  createPlan() {
    this.listView = false;
    this.createView = true;
    this.ifPlanEditInput = false;
    this.detailView = false;
    this.isPlanEdit = false;
    this.submitted = false;
    this.templateSubmitted = false;
    this.ifServiceParam = false;
    this.chargeSubmitted = false;
    this.qospolicySubmitted = false;
    this.planProductSubmitted = false;
    this.isServiceHideField = false;
    this.ifplanGroup_BWB = false;
    this.ifplanGroup_VB = false;
    this.isServiceArea_PlanType = true;
    this.totalPriceData = [];
    this.countTotalOfferPrice = 0;
    this.planGroupForm.reset();
    this.chargeFromArray.reset();
    this.planProductfromgroup.reset();
    this.planCasMappingFromArray = this.fb.array([]);
    this.planGroupForm.controls.maxconcurrentsession.enable();
    this.planGroupForm.controls.validity.enable();
    this.planGroupForm.controls.quotaUnit.disable();
    this.planGroupForm.controls.quota.enable();
    this.planGroupForm.controls.quotaunittime.disable();
    this.planGroupForm.controls.quotatime.enable();
    this.isQuotaEnabled = false;
    this.isQuotaTimeEnabled = false;
    this.planStatusField = false;
    this.productFlag = false;
    this.productTypeFlag = false;
    this.ownershipTypeFlag = false;
    this.productChargeFlag = false;
    this.revisedChargeFlag = false;
    this.planProductMappingShowFlag = false;
    this.billingSequence();
    this.getProductData();
    this.type = [{ label: "NORMAL" }, { label: "SPECIAL" }];
    this.planStatus = [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" }
    ];
    this.chargeFromArray.controls = [];
    this.planProductMappingFromArray = this.fb.array([]);
    if (this.searchkey) {
      this.searchkey = "";
      this.searchDeatil = "";
      this.searchOption = "";
    }
    this.viewPlanListData = [];
    this.planGroupForm.controls.plantype.setValue("");
    this.planGroupForm.controls.category.setValue("");
    this.planGroupForm.controls.serviceId.setValue("");
    this.planGroupForm.controls.planGroup.setValue("");
    this.planGroupForm.controls.allowOverUsage.setValue("");
    this.planGroupForm.controls.status.setValue("");
    this.planGroupForm.controls.quotaUnit.setValue("");
    this.planGroupForm.controls.quotatype.setValue("");
    this.planGroupForm.controls.quotaunittime.setValue("");
    this.planGroupForm.controls.qospolicyid.setValue("");
    this.planGroupForm.controls.timebasepolicyId.setValue("");
    this.planGroupForm.controls.radiusprofileIds.setValue("");
    this.chargefromgroup.controls.id.setValue("");
    this.chargefromgroup.controls.billingCycle.setValue("");
    this.planGroupForm.patchValue({
      unitsOfValidity: "Days",
      mode: "NORMAL",
      allowdiscount: true,
      requiredApproval: true,
      invoiceToOrg: true
    });
    this.qospolicyformArray = this.fb.array([]);
  }

  addEditListPlan() {
    this.isPlanEdit = false;
    this.planGroupForm.reset();
    this.chargeFromArray.reset();
    this.planProductfromgroup.reset();
    this.listView = true;
    this.ifPlanEditInput = false;
    this.createView = false;
    this.detailView = false;
    this.submitted = false;
    this.templateSubmitted = false;
    this.ifServiceParam = false;
    this.customerGroupForm.reset();
    this.chargeFromArray.controls = [];
    this.planProductMappingFromArray = this.fb.array([]);
    this.qospolicyformArray = this.fb.array([]);
    this.planProductMappingFromArray.controls = [];
    this.countTotalOfferPrice = 0;
    this.totalPriceData = [];
    if (this.searchkey) {
      this.searchPlan("");
    } else {
      this.searchPlan("");
    }
  }

  listPlan() {
    this.isPlanEdit = false;
    this.planGroupForm.reset();
    this.chargeFromArray.reset();
    this.planProductfromgroup.reset();
    this.listView = true;
    this.ifPlanEditInput = false;
    this.createView = false;
    this.detailView = false;
    this.submitted = false;
    this.templateSubmitted = false;
    this.ifServiceParam = false;
    this.customerGroupForm.reset();
    this.chargeFromArray.controls = [];
    this.planProductMappingFromArray = this.fb.array([]);
    this.qospolicyformArray = this.fb.array([]);
    this.planProductMappingFromArray.controls = [];
    this.countTotalOfferPrice = 0;
    this.totalPriceData = [];
    if (this.searchkey) {
      this.searchkey = "";
      this.searchDeatil = "";
      this.searchOption = "";
      this.searchPlan("");
    } else {
      this.searchPlan("");
    }
  }

  planDetail(planId) {
    this.listView = false;
    this.createView = false;
    this.detailView = true;
    this.ifPlanEditInput = false;
    this.workflowID = planId;
    this.auditData = planId;
    this.getworkflowAuditDetails("", planId, "PLAN");
    this.getplanDetailById(planId);
    this.GetAuditData(planId, "");
  }
  canExit() {
    if (
      !this.planGroupForm.dirty &&
      !this.assignPlanForm.dirty &&
      !this.rejectPlanForm.dirty &&
      !this.planProductfromgroup.dirty
    )
      return true;
    {
      return Observable.create((observer: Observer<boolean>) => {
        this.confirmationService.confirm({
          header: "Alert",
          message: "The filled data will be lost. Do you want to continue? (Yes/No)",
          icon: "pi pi-info-circle",
          accept: () => {
            observer.next(true);
            observer.complete();
          },
          reject: () => {
            observer.next(false);
            observer.complete();
          }
        });
        return false;
      });
    }
  }

  checkExit(type) {
    this.optionList = [];
    if (!this.planGroupForm.dirty) {
      this.planGroupForm.markAsPristine();
      if (type === "create") {
        this.createPlan();
      } else {
        this.listPlan();
      }
      this.showQtyError = false;
      this.qtyErroMsg = "";
      this.productFlag = false;
      this.productTypeFlag = false;
      this.ownershipTypeFlag = false;
      this.productChargeFlag = false;
      this.revisedChargeFlag = false;
      this.planProductMappingShowFlag = false;
    } else {
      this.confirmationService.confirm({
        header: "Alert",
        message: "The filled data will be lost. Do you want to continue? (Yes/No)",
        icon: "pi pi-info-circle",
        accept: () => {
          this.planGroupForm.markAsPristine();
          if (type === "create") {
            this.createPlan();
          } else {
            this.listPlan();
          }
          this.productFlag = false;
          this.productTypeFlag = false;
          this.ownershipTypeFlag = false;
          this.productChargeFlag = false;
          this.revisedChargeFlag = false;
          this.planProductMappingShowFlag = false;
        },
        reject: () => {
          return false;
        }
      });
    }
  }

  deleteConfirmonChargeField(chargeFieldIndex: number, chargeFieldId: number) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this charge?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveCharge(chargeFieldIndex, chargeFieldId);
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

  deleteConfirmonQosPolicy(qosPolicyFieldIndex: number) {
    if (qosPolicyFieldIndex || qosPolicyFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this QoS Policy?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveQosPolicy(qosPolicyFieldIndex);
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

  async onRemoveQosPolicy(qosPolicyFieldIndex: number) {
    this.mintopercentage = this.qospolicyformArray.value[qosPolicyFieldIndex].topercentage;
    this.qospolicyformgroup
      .get("topercentage")
      .setValidators([Validators.required, Validators.min(Number(this.mintopercentage))]);
    this.qospolicyformgroup.get("topercentage").updateValueAndValidity();

    this.minfrompercentage = this.qospolicyformArray.value[qosPolicyFieldIndex].frompercentage;
    this.qospolicyformgroup
      .get("frompercentage")
      .setValidators([Validators.required, Validators.min(Number(this.minfrompercentage))]);
    this.qospolicyformgroup.get("frompercentage").updateValueAndValidity();

    this.qospolicyformArray.removeAt(qosPolicyFieldIndex);
  }

  setToValidation() {
    this.mintopercentage = this.qospolicyformgroup.value.frompercentage;
    this.qospolicyformgroup
      .get("topercentage")
      .setValidators([Validators.required, Validators.min(Number(this.mintopercentage))]);
    this.qospolicyformgroup.get("topercentage").updateValueAndValidity();
  }

  async onRemoveCharge(chargeFieldIndex: number, chargeFieldId: number) {
    let totalPrice = 0;
    this.chargeFromArray.removeAt(chargeFieldIndex);
    if (this.chargeFromArray?.length <= 0 && this.chargeIdFromService) {
      this.chargeFilterData(this.chargeIdFromService);
    }
    totalPrice = this.planGroupForm.value.offerprice - this.totalPriceData[chargeFieldIndex];
    this.countTotalOfferPrice = totalPrice;
    this.planGroupForm.patchValue({
      offerprice: totalPrice.toFixed(2)
    });
    this.totalPriceData.splice(chargeFieldIndex, 1);
  }

  deleteConfirmonCasMappingField(index: number) {
    this.confirmationService.confirm({
      message: "Do you want to delete this CAS ?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.onRemoveCasMapping(index);
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

  async onRemoveCasMapping(index: number) {
    this.planCasMappingFromArray.removeAt(index);
  }

  deleteConfirmonPostPaidPlan(planId) {
    if (planId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Post Paid Plan?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deletePlan(planId);
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

  async deletePlan(planId) {
    const url = "/postpaidplan/" + planId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPagePostPaidPlan != 1 && this.postPaidPlanList.length == 1) {
          this.currentPagePostPaidPlan = this.currentPagePostPaidPlan - 1;
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        // if (!this.searchkey) {
        //   this.getPostoaidPlan("");
        // } else {
        this.searchPlan("");
        // }
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

  getplanDetailById(planId) {
    let datacharge: any = [];
    let dataproductplanmappingList: any = [];
    this.chargeTaxAmountArray = [];
    this.chargeTypeGetDataData = [];
    const url = "/postpaidplan/" + planId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planDetailData = response.postPaidPlan;

        if (this.planDetailData.planGroup == "Volume Booster") {
          this.ifplanGroup_VB = true;
          this.ifplanGroup_BWB = false;
        } else if (this.planDetailData.planGroup == "Bandwidthbooster") {
          this.ifplanGroup_BWB = true;
          this.ifplanGroup_VB = false;
        } else {
          this.ifplanGroup_BWB = false;
          this.ifplanGroup_VB = false;
        }

        datacharge = this.planDetailData.chargeList;

        datacharge.forEach((element, index) => {
          this.chargeType.forEach((data, j) => {
            if (element.charge.chargetype == data.value) {
              const url =
                "/charge/" + element.charge.id + "?mvnoId=" + localStorage.getItem("mvnoId");
              this.planManagementService.getMethod(url).subscribe((response: any) => {
                this.chargeTypeGetDataData.push({
                  type: data.text
                  // taxAmount: response.chargebyid.taxamount,
                });
              });
            }
          });
        });

        // if (this.planDetailData.serviceId) {
        //   let data = {
        //     value: this.planDetailData.serviceId,
        //   };
        //   this.selService(data);
        // }

        for (var index = 0; index < this.planDetailData.chargeList.length; index++) {
          let taxData: any = [];
          let slabList: any = [];
          let tireList: any = [];
          let slabPrice: any = [];
          let amount = 0;
          let totalslebPrice = 0;
          let price = this.planDetailData.chargeList[index].chargeprice
            ? this.planDetailData.chargeList[index].chargeprice
            : this.planDetailData.chargeList[index].charge.price;
          let url = "/taxes/" + Number(this.planDetailData.chargeList[index].charge.taxid);
          this.planManagementService.getMethod(url).subscribe((response: any) => {
            taxData = response.taxData;
            if (taxData.taxtype == "SLAB") {
              slabList = taxData.slabList;
              if (slabList.length > 0) {
                for (let i = 0; i < slabList.length; i++) {
                  if (price >= slabList[i].rangeUpTo) {
                    if (i == 0) {
                      amount =
                        slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                      price = price - slabList[i].rangeUpTo;
                    } else {
                      let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                      amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                      price = price - NewAmount;
                    }
                    slabPrice.push(amount);
                    if (slabList.length == i + 1) {
                      slabPrice.forEach(element => {
                        totalslebPrice = totalslebPrice + Number(element);
                      });
                      this.pricePerTax = totalslebPrice.toFixed(2);

                      this.totalPriceData.push(Number(this.pricePerTax));
                      this.countTotalOfferPrice =
                        Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                      this.planGroupForm.patchValue({
                        offerprice: this.countTotalOfferPrice.toFixed(2)
                      });
                    }
                  } else {
                    amount = price + (price * slabList[i].rate) / 100;
                    slabPrice.push(amount);
                    slabPrice.forEach(element => {
                      totalslebPrice = totalslebPrice + Number(element);
                    });
                    this.pricePerTax = totalslebPrice.toFixed(2);
                    this.totalPriceData.push(Number(this.pricePerTax));
                    this.countTotalOfferPrice =
                      Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                    this.planGroupForm.patchValue({
                      offerprice: this.countTotalOfferPrice.toFixed(2)
                    });

                    slabList.length = 0;
                  }
                }
              }
            } else if (taxData.taxtype == "TIER") {
              let ifsameTire = false;
              if (taxData.tieredList.length > 0) {
                tireList = taxData.tieredList;
                if (tireList.length > 0) {
                  let newAmount = 0;
                  let totalAmountTire = 0;
                  let totalPricetire = 0;
                  let tireAmountList = [];

                  amount = price + (price * tireList[0].rate) / 100;
                  newAmount = (price * tireList[0].rate) / 100;
                  totalAmountTire = amount;
                  if (tireList.length == 1) {
                    this.taxAmountCal(price, tireList[0].rate);
                    this.pricePerTax = amount.toFixed(2);

                    this.countTotalOfferPrice =
                      Number(this.countTotalOfferPrice) + Number(this.pricePerTax);

                    this.totalPriceData.push(Number(this.pricePerTax));
                    this.chargeTaxAmountArray.push(Number(this.taxAmount));
                  } else {
                    // amount = newAmount
                    for (let i = 1; i < tireList.length; i++) {
                      let AcTiNo = i;
                      while (AcTiNo > 0) {
                        let TI_NO = AcTiNo - 1;
                        if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                          ifsameTire = true;
                          AcTiNo = 0;
                        } else {
                          amount = newAmount;
                          ifsameTire = false;
                        }
                        AcTiNo--;
                      }

                      if (ifsameTire) {
                        amount = amount + (amount * tireList[i].rate) / 100;

                        if (tireList.length == i + 1 || amount < 0) {
                          totalAmountTire = amount;
                          this.pricePerTax = totalAmountTire.toFixed(2);
                          tireList.length = 0;

                          this.countTotalOfferPrice =
                            Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                          this.totalPriceData.push(Number(this.pricePerTax));
                          let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
                          this.chargeTaxAmountArray.push(Number(NewTaxAmountCount));
                        }
                      } else {
                        amount = (amount * tireList[i].rate) / 100;
                        tireAmountList.push(amount);
                        if (tireList.length == i + 1 || amount < 0) {
                          tireAmountList.forEach(element => {
                            totalPricetire = totalPricetire + Number(element);
                          });
                          totalAmountTire = Number(totalAmountTire) + Number(totalPricetire);
                          this.pricePerTax = totalAmountTire.toFixed(2);
                          tireList.length = 0;

                          this.countTotalOfferPrice =
                            Number(this.countTotalOfferPrice) + Number(this.pricePerTax);
                          this.totalPriceData.push(Number(this.pricePerTax));

                          let NewTaxAmountCount = Number(this.pricePerTax) - Number(price);
                          this.chargeTaxAmountArray.push(Number(NewTaxAmountCount));
                        }
                      }
                    }
                  }
                }
              }
            } else if (taxData.taxtype == "Compound") {
              let finalAmount = price;

              // Apply each tax tier
              taxData.tieredList.forEach(tax => {
                finalAmount += finalAmount * (tax.rate / 100);
              });
              this.pricePerTax = finalAmount;
              this.totalPriceData.forEach((element, j) => {
                if (j == index) {
                  this.totalPriceData[j] = this.pricePerTax;
                  let count = 0;
                  for (let j = 0; j < this.totalPriceData.length; j++) {
                    let n = this.totalPriceData[j];
                    count = Number(count) + Number(n);
                    this.countTotalOfferPrice = Number(count.toFixed(2));
                  }

                  this.chargeFromArray.value.forEach((elem, indexCharge) => {
                    let nn = indexCharge + 1;
                    if (indexCharge == index) {
                      elem.taxamount = Number(this.pricePerTax) - Number(price);
                      elem.taxamount = elem.taxamount.toFixed(2);
                    }
                    if (this.chargeFromArray.value.length == nn) {
                      this.chargeFromArray.patchValue(this.chargeFromArray.value);
                    }
                  });
                  if (this.planGroupForm.value.category == "Business Promotion") {
                    this.planGroupForm.patchValue({
                      // offerprice: count.toFixed(2),
                      newOfferPrice: count.toFixed(2)
                    });
                  } else {
                    this.planGroupForm.patchValue({
                      offerprice: count.toFixed(2)
                      // newOfferPrice: count.toFixed(2),
                    });
                  }
                }
              });
            }
          });
        }
        if (planId) {
          this.getProductPlanMappingDetails(planId, "viewPlanDetails");
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

  quotaUnitChange(event) {
    const val = event.value;
    // if (val == "MIN") {
    //   this.max = 60
    //   this.planGroupForm.controls["quotatime"].setValidators([Validators.required, Validators.pattern(Regex.numeric), Validators.max(this.max)]);
    // } else if (val == "HOUR") {
    //   this.max = 24
    //   this.planGroupForm.controls["quotatime"].setValidators([Validators.required, Validators.pattern(Regex.numeric), Validators.max(this.max)]);
    // } else if (val == "DAY") {
    //   this.max = 365
    //   this.planGroupForm.controls["quotatime"].setValidators([Validators.required, Validators.pattern(Regex.numeric), Validators.max(this.max)]);
    // }
    // this.planGroupForm.controls["quotatime"].updateValueAndValidity();
  }

  pageChangedCharge(pageNumber) {
    this.currentPageCharge = pageNumber;
  }

  pageChangedPlanList(pageNumber) {
    this.currentPagePostPaidPlan = pageNumber;

    // if (!this.searchkey && !this.searchkey2) {
    //   this.searchPlan("");
    // } else {
    this.searchPlan(this.currentPagePostPaidPlan);
    // }
  }

  pageChangedChargeDetailList(pageNumber) {
    this.currentPageChargeDeatilList = pageNumber;
  }
  pageChangedQosPolicyDetailList(pageNumber) {
    this.currentPagecustQosPolicyDeatilList = pageNumber;
  }
  pageChangedProductPlanMappingDetailList(pageNumber) {
    this.productPageChargeDeatilList = pageNumber;
  }
  viewQosPolicyListData1: any = [];
  getQosPolicyById(qosPolicyId) {
    this.qosPolicyID = true;

    const url = "/qosPolicy/" + qosPolicyId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.viewQosPolicyListData = response.data;
        this.viewQosPolicyListData1 = this.viewQosPolicyListData.qosPolicyGatewayMappingList;
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

  getTimeBasePolicyById(getTimeBasePolicyById) {
    const url =
      "/timebasepolicy/" + getTimeBasePolicyById + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.viewTimeBasePolicyListData = response.data;
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

  getofferPrice(event) {
    let chargeId = event.value;
    let price = "";

    const url = "/charge/" + chargeId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        price = response.chargebyid.price;
        this.chargefromgroup.patchValue({
          actualprice: response.chargebyid.actualprice,
          taxamount: response.chargebyid.taxamount,
          chargeprice: response.chargebyid.actualprice,
          price: response.chargebyid.price,
          currency: response.chargebyid.currency ?? this.currency
        });
        if (response.chargebyid.taxid) {
          this.getamountPerTaxCount(response.chargebyid.taxid, price);
        }
      },
      (error: any) => {
        // console.log(error, 'error')
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  changeActualPrice(price, id, index, actualprice, event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    if (Number(inputElement.value) > 0) {
      if (this.planGroupForm.value.category == "Business Promotion" && price > actualprice) {
        this.planGroupForm.patchValue({
          newOfferPrice: ""
        });
        return;
      }
      let taxData: any = [];
      let slabList: any = [];
      let tireList: any = [];
      let slabPrice: any = [];
      let amount = 0;
      let totalslebPrice = 0;
      let noTaxPrice = 0;
      const url1 = "/charge/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
      this.planManagementService.getMethod(url1).subscribe((res: any) => {
        let url = "/taxes/" + res.chargebyid.taxid;
        this.planManagementService.getMethod(url).subscribe((response: any) => {
          taxData = response.taxData;
          if (taxData.taxtype == "SLAB") {
            slabList = taxData.slabList;
            if (slabList.length > 0) {
              for (let i = 0; i < slabList.length; i++) {
                if (price >= slabList[i].rangeUpTo) {
                  if (i == 0) {
                    amount =
                      slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                    price = price - slabList[i].rangeUpTo;
                  } else {
                    let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                    amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                    price = price - NewAmount;
                  }
                  slabPrice.push(amount);

                  if (slabList.length == i + 1) {
                    slabPrice.forEach(element => {
                      totalslebPrice = totalslebPrice + Number(element);
                    });
                    this.pricePerTax = totalslebPrice.toFixed(2);
                  }
                } else {
                  amount = price + (price * slabList[i].rate) / 100;
                  slabPrice.push(amount);
                  slabPrice.forEach(element => {
                    totalslebPrice = totalslebPrice + Number(element);
                  });
                  this.pricePerTax = totalslebPrice.toFixed(2);
                  slabList.length = 0;
                }
              }
            }
          } else if (taxData.taxtype == "TIER") {
            let ifsameTire = false;
            if (taxData.tieredList.length > 0) {
              tireList = taxData.tieredList;
              if (tireList.length > 0) {
                let newAmount = 0;
                let totalAmountTire = 0;
                let totalPricetire = 0;
                let tireAmountList = [];

                amount = price + (price * tireList[0].rate) / 100;
                newAmount = (price * tireList[0].rate) / 100;
                totalAmountTire = amount;
                if (tireList.length == 1) {
                  this.taxAmountCal(price, tireList[0].rate);
                  this.pricePerTax = Number(amount).toFixed(2);
                  this.totalPriceData.forEach((element, j) => {
                    if (j == index) {
                      this.totalPriceData[j] = this.pricePerTax;
                      let count: number = 0;
                      for (let j = 0; j < this.totalPriceData.length; j++) {
                        let n = this.totalPriceData[j];
                        count = Number(count) + Number(n);
                        this.countTotalOfferPrice = Number(count.toFixed(2));
                      }
                      this.chargeFromArray.value.forEach((elem, indexCharge) => {
                        let nn = indexCharge + 1;
                        if (indexCharge == index) {
                          elem.taxamount = this.taxAmount.toFixed(2);
                        }
                        if (this.chargeFromArray.value.length == nn) {
                          this.chargeFromArray.patchValue(this.chargeFromArray.value);
                        }
                      });
                      if (this.planGroupForm.value.category == "Business Promotion") {
                        this.planGroupForm.patchValue({
                          // offerprice: count.toFixed(2),
                          newOfferPrice: count.toFixed(2)
                        });
                      } else {
                        this.planGroupForm.patchValue({
                          offerprice: count.toFixed(2)
                          // newOfferPrice: count.toFixed(2),
                        });
                      }
                    }
                  });
                } else {
                  for (let i = 1; i < tireList.length; i++) {
                    let AcTiNo = i;
                    while (AcTiNo > 0) {
                      let TI_NO = AcTiNo - 1;
                      if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                        ifsameTire = true;
                        AcTiNo = 0;
                      } else {
                        amount = newAmount;
                        ifsameTire = false;
                      }
                      AcTiNo--;
                    }

                    if (ifsameTire) {
                      amount = amount + (amount * tireList[i].rate) / 100;
                      if (tireList.length == i + 1 || amount < 0) {
                        tireAmountList.forEach(element => {
                          totalPricetire = totalPricetire + Number(element);
                        });

                        totalAmountTire = amount;
                        this.pricePerTax = totalAmountTire.toFixed(2);
                        this.totalPriceData.forEach((element, j) => {
                          if (j == index) {
                            this.totalPriceData[j] = this.pricePerTax;
                            let count = 0;
                            for (let j = 0; j < this.totalPriceData.length; j++) {
                              let n = this.totalPriceData[j];
                              count = Number(count) + Number(n);
                              this.countTotalOfferPrice = Number(count.toFixed(2));
                            }

                            this.chargeFromArray.value.forEach((elem, indexCharge) => {
                              let nn = indexCharge + 1;
                              if (indexCharge == index) {
                                elem.taxamount = (Number(this.pricePerTax) - Number(price)).toFixed(
                                  2
                                );
                              }
                              if (this.chargeFromArray.value.length == nn) {
                                this.chargeFromArray.patchValue(this.chargeFromArray.value);
                              }
                            });
                            if (this.planGroupForm.value.category == "Business Promotion") {
                              this.planGroupForm.patchValue({
                                // offerprice: count.toFixed(2),
                                newOfferPrice: count.toFixed(2)
                              });
                            } else {
                              this.planGroupForm.patchValue({
                                offerprice: count.toFixed(2)
                                // newOfferPrice: count.toFixed(2),
                              });
                            }
                          }
                        });
                        tireList.length = 0;
                      }
                    } else {
                      amount = (amount * tireList[i].rate) / 100;
                      tireAmountList.push(amount.toFixed(2));

                      if (tireList.length == i + 1 || amount < 0) {
                        tireAmountList.forEach(element => {
                          totalPricetire = totalPricetire + Number(element);
                        });

                        totalAmountTire = totalAmountTire + totalPricetire;
                        this.pricePerTax = totalAmountTire.toFixed(2);

                        this.totalPriceData.forEach((element, j) => {
                          if (j == index) {
                            this.totalPriceData[j] = this.pricePerTax;
                            let count = 0;
                            for (let j = 0; j < this.totalPriceData.length; j++) {
                              let n = this.totalPriceData[j];
                              count = Number(count) + Number(n);
                              this.countTotalOfferPrice = Number(count.toFixed(2));
                            }

                            this.chargeFromArray.value.forEach((elem, indexCharge) => {
                              let nn = indexCharge + 1;
                              if (indexCharge == index) {
                                elem.taxamount = Number(this.pricePerTax) - Number(price);
                                elem.taxamount = elem.taxamount.toFixed(2);
                              }
                              if (this.chargeFromArray.value.length == nn) {
                                this.chargeFromArray.patchValue(this.chargeFromArray.value);
                              }
                            });
                            if (this.planGroupForm.value.category == "Business Promotion") {
                              this.planGroupForm.patchValue({
                                // offerprice: count.toFixed(2),
                                newOfferPrice: count.toFixed(2)
                              });
                            } else {
                              this.planGroupForm.patchValue({
                                offerprice: count.toFixed(2)
                                // newOfferPrice: count.toFixed(2),
                              });
                            }
                          }
                        });
                        tireList.length = 0;
                      }
                    }
                  }
                }
              }
            }
          } else if (taxData.taxtype == "Compound") {
            let finalAmount = price;

            // Apply each tax tier
            taxData.tieredList.forEach(tax => {
              finalAmount += finalAmount * (tax.rate / 100);
            });
            this.pricePerTax = finalAmount;
            this.totalPriceData.forEach((element, j) => {
              if (j == index) {
                this.totalPriceData[j] = this.pricePerTax;
                let count = 0;
                for (let j = 0; j < this.totalPriceData.length; j++) {
                  let n = this.totalPriceData[j];
                  count = Number(count) + Number(n);
                  this.countTotalOfferPrice = Number(count.toFixed(2));
                }

                this.chargeFromArray.value.forEach((elem, indexCharge) => {
                  let nn = indexCharge + 1;
                  if (indexCharge == index) {
                    elem.taxamount = Number(this.pricePerTax) - Number(price);
                    elem.taxamount = elem.taxamount.toFixed(2);
                  }
                  if (this.chargeFromArray.value.length == nn) {
                    this.chargeFromArray.patchValue(this.chargeFromArray.value);
                  }
                });
                if (this.planGroupForm.value.category == "Business Promotion") {
                  this.planGroupForm.patchValue({
                    // offerprice: count.toFixed(2),
                    newOfferPrice: count.toFixed(2)
                  });
                } else {
                  this.planGroupForm.patchValue({
                    offerprice: count.toFixed(2)
                    // newOfferPrice: count.toFixed(2),
                  });
                }
              }
            });
          }
          this.isPlanPriceChanged = true;
        });
      });
      return true;
    } else {
      return;
    }
  }

  preventNegativeInput(event: KeyboardEvent) {
    if (event.key === "-") {
      event.preventDefault();
    }
  }

  getamountPerTaxCount(id, price) {
    let taxData: any = [];
    let slabList: any = [];
    let tireList: any = [];
    let slabPrice: any = [];
    let amount = 0;
    let totalslebPrice = 0;
    let noTaxPrice = 0;

    let url = "/taxes/" + id;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        taxData = response.taxData;
        if (taxData.taxtype == "SLAB") {
          slabList = taxData.slabList;
          if (slabList.length > 0) {
            for (let i = 0; i < slabList.length; i++) {
              if (price >= slabList[i].rangeUpTo) {
                if (i == 0) {
                  amount = slabList[i].rangeUpTo + (slabList[i].rangeUpTo * slabList[i].rate) / 100;
                  price = price - slabList[i].rangeUpTo;
                } else {
                  let NewAmount = slabList[i].rangeUpTo - slabList[i - 1].rangeUpTo;
                  amount = NewAmount + (NewAmount * slabList[i].rate) / 100;
                  price = price - NewAmount;
                }
                slabPrice.push(amount);

                if (slabList.length == i + 1) {
                  slabPrice.forEach(element => {
                    totalslebPrice = totalslebPrice + Number(element);
                  });
                  this.pricePerTax = totalslebPrice.toFixed(2);
                }
              } else {
                amount = price + (price * slabList[i].rate) / 100;
                slabPrice.push(amount);
                slabPrice.forEach(element => {
                  totalslebPrice = totalslebPrice + Number(element);
                });
                this.pricePerTax = totalslebPrice.toFixed(2);
                slabList.length = 0;
              }
            }
          }
        } else if (taxData.taxtype == "TIER") {
          let ifsameTire = false;
          if (taxData.tieredList.length > 0) {
            tireList = taxData.tieredList;
            if (tireList.length > 0) {
              let newAmount = 0;
              let totalAmountTire = 0;
              let totalPricetire = 0;
              let tireAmountList = [];

              amount = price + (price * tireList[0].rate) / 100;
              newAmount = (price * tireList[0].rate) / 100;
              totalAmountTire = amount;
              if (tireList.length == 1) {
                this.pricePerTax = amount.toFixed(2);
              } else {
                for (let i = 1; i < tireList.length; i++) {
                  let AcTiNo = i;
                  while (AcTiNo > 0) {
                    let TI_NO = AcTiNo - 1;
                    if (tireList[i].taxGroup == tireList[TI_NO].taxGroup) {
                      ifsameTire = true;
                      AcTiNo = 0;
                    } else {
                      amount = newAmount;
                      ifsameTire = false;
                    }
                    AcTiNo--;
                  }

                  if (ifsameTire) {
                    amount = amount + (price * tireList[i].rate) / 100;

                    if (tireList.length == i + 1 || amount < 0) {
                      tireAmountList.forEach(element => {
                        totalPricetire = totalPricetire + Number(element);
                      });

                      totalAmountTire = amount;
                      this.pricePerTax = totalAmountTire.toFixed(2);
                      tireList.length = 0;
                    }
                  } else {
                    amount = (amount * tireList[i].rate) / 100;
                    tireAmountList.push(amount.toFixed(2));

                    if (tireList.length == i + 1 || amount < 0) {
                      tireAmountList.forEach(element => {
                        totalPricetire = totalPricetire + Number(element);
                      });

                      totalAmountTire = totalAmountTire + totalPricetire;
                      this.pricePerTax = totalAmountTire.toFixed(2);
                      tireList.length = 0;
                    }
                  }
                }
              }
            }
          }
        } else if (taxData.taxtype == "Compound") {
          let finalAmount = price;

          // Apply each tax tier
          taxData.tieredList.forEach(tax => {
            finalAmount += finalAmount * (tax.rate / 100);
          });
          this.pricePerTax = finalAmount;
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

  selPlanMode(event) {
    if (event.value == "SPECIAL") {
      this.planGroupData = this.planGroupData.filter(
        data => data.value == "Renew" || data.value == "Registration and Renewal"
      );
    } else {
      this.getPlanGroup();
    }
  }

  selPlanGroup(event) {
    this.planGroupForm.controls.offerprice.setValue("");
    this.planGroupForm.controls.newOfferPrice.setValue("");
    this.countTotalOfferPrice = 0;
    this.totalPriceData = [];

    this.chargeFromArray.clear();
    // if (event.value == "Registration") {
    //   this.type = [{ label: "NORMAL" }];
    // } else {
    //    this.type = [{ label: "NORMAL" }, { label: "SPECIAL" }];
    // }
    // if (event.value === "DTV Addon") {
    //   this.planGroupForm.controls.basePlan.setValidators(Validators.required);
    //   this.planGroupForm.controls.basePlan.updateValueAndValidity();
    // } else {
    //   this.planGroupForm.controls.basePlan.clearValidators();
    //   this.planGroupForm.controls.basePlan.updateValueAndValidity();
    //   this.planGroupForm.patchValue({
    //     basePlan: "",
    //   });
    // }
    if (event.value == "Volume Booster") {
      this.ifplanGroup_VB = true;
      this.ifplanGroup_BWB = false;
      this.planGroupForm.patchValue({
        maxconcurrentsession: 1,
        allowOverUsage: false,
        quotaResetInterval: "Total",
        usageQuotaType: "TOTAL",
        mode: "NORMAL",
        saccode: "",
        validity: "",
        unitsOfValidity: "Days",
        quota: 0,
        quotatype: "Data",
        quotaUnit: "GB"
      });
    } else if (event.value == "Bandwidthbooster") {
      this.ifplanGroup_BWB = true;
      this.ifplanGroup_VB = false;
      this.planGroupForm.patchValue({
        quotaResetInterval: "Total",
        usageQuotaType: "TOTAL",
        quota: 0,
        quotatype: "Data",
        quotaUnit: "GB",
        maxconcurrentsession: 1,
        allowOverUsage: false,
        mode: "NORMAL",
        saccode: "",
        validity: "",
        unitsOfValidity: "Days"
      });
    } else {
      this.ifplanGroup_BWB = false;
      this.ifplanGroup_VB = false;
      this.planGroupForm.patchValue({
        quota: 0,
        quotaUnit: "GB",
        quotatype: "Data",
        maxconcurrentsession: 1,
        allowOverUsage: false
      });
    }
    if (event.value == "Registration and Renewal") {
      this.planProductMappingShowFlag = true;
    } else if (event.value == "Registration") {
      this.planProductMappingShowFlag = true;
    } else {
      this.planProductMappingShowFlag = false;
      this.planProductMappingFromArray = this.fb.array([]);
      this.planProductfromgroup.reset();
    }

    if (this.planGroupForm.value.plantype == "Postpaid") {
      if (
        event.value == "Bandwidthbooster" ||
        event.value == "DTV Addon" ||
        event.value == "Volume Booster"
      ) {
        this.validityHide = false;
        this.chargefromgroup.controls.billingCycle.setValue("1");
        this.chargefromgroup.controls.billingCycle.disable();
      } else {
        this.validityHide = true;
        this.chargefromgroup.controls.billingCycle.enable();
      }
    }

    if (this.totalCharges.length > 0) {
      this.advanceListData = [];
      this.totalCharges.forEach(element => {
        if (this.planGroupForm.value.plantype == "Prepaid") {
          if (
            element.charge.chargetype == "ADVANCE" ||
            element.charge.chargetype == "NON_RECURRING"
          ) {
            this.advanceListData.push(element.charge);
          }
        } else if (this.planGroupForm.value.plantype == "Postpaid") {
          if (
            element.charge.chargetype == "RECURRING" ||
            element.charge.chargetype == "NON_RECURRING" ||
            element.charge.chargetype == "ADVANCE"
          ) {
            this.advanceListData.push(element.charge);
          }
        }
        this.filterChargeType();
      });
    }
  }

  ifCasMapping = false;
  selectedServiceId;
  selService(event) {
    this.getFields();
    this.advanceListData = [];
    const url = "/planservice/" + event.value;
    this.selectedServiceId = event.value;
    this.planManagementService.getMethod(url).subscribe((response: any) => {
      let viewServiceListData = response.servicebyId;

      if (viewServiceListData.is_dtv == true) {
        this.ifCasMapping = true;
      } else {
        this.ifCasMapping = false;
      }
      const hasBandwidth = viewServiceListData.serviceParamMappingList.some(
        param => param.serviceParamName === "Bandwidth"
      );
      if (viewServiceListData.isQoSV == false) {
        this.isServiceHideField = true;

        this.planGroupForm.get("qospolicyid").clearValidators();
        this.planGroupForm.get("qospolicyid").updateValueAndValidity();

        if (!this.isPlanEdit) {
          this.planGroupForm.patchValue({
            maxconcurrentsession: 1,
            allowOverUsage: false,
            quotaResetInterval: "Total",
            usageQuotaType: "TOTAL",
            quota: 0,
            quotatype: "Data",
            quotaUnit: "GB"
          });
          let type = {
            value: "Data"
          };
          this.getSelQoutaType(type);
        }
      } else {
        this.isServiceHideField = false;

        if (this.planGroupForm.value.planGroup == "Bandwidthbooster" || hasBandwidth) {
          this.planGroupForm.controls.qospolicyid.setValidators([Validators.required]);
          // this.planGroupForm.get("qospolicyid").setValidators([Validators.required]);
          this.planGroupForm.controls.qospolicyid.updateValueAndValidity();
          // this.planGroupForm.get("qospolicyid").updateValueAndValidity();
        } else {
          // this.planGroupForm.controls.qospolicyid.clearAsyncValidators();
          this.planGroupForm.controls.qospolicyid.clearValidators();
          // this.planGroupForm.get("qospolicyid").updateValueAndValidity();
          this.planGroupForm.controls.qospolicyid.updateValueAndValidity();
        }
        // this.planGroupForm.controls.quotaUnit.disable();
        // this.planGroupForm.controls.quota.enable();
        // this.planGroupForm.controls.quotaunittime.disable();
        // this.planGroupForm.controls.quotatime.enable();
        if (this.planGroupForm.value.planGroup == "Volume Booster") {
          if (hasBandwidth) {
            this.planGroupForm.controls.qospolicyid.clearValidators();
            this.planGroupForm.controls.qospolicyid.updateValueAndValidity();
          }
          this.ifplanGroup_VB = true;
          this.ifplanGroup_BWB = false;
        } else if (this.planGroupForm.value.planGroup == "Bandwidthbooster") {
          this.ifplanGroup_VB = false;
          this.ifplanGroup_BWB = true;
        } else {
          this.ifplanGroup_VB = false;
          this.ifplanGroup_BWB = false;
        }
        if (
          this.planGroupForm.value.planGroup == "Bandwidthbooster" ||
          this.planGroupForm.value.planGroup == "Volume Booster"
        ) {
          if (!this.isPlanEdit) {
            this.planGroupForm.patchValue({
              maxconcurrentsession: 1,
              // allowOverUsage: false,
              quotaResetInterval: "Total",
              usageQuotaType: "TOTAL",
              // quota: 0,
              quotatype: "Data",
              quotaUnit: "GB"
            });

            let type = {
              value: "Data"
            };
            this.getSelQoutaType(type);
          }
        } else if (
          !this.isPlanEdit &&
          (this.planGroupForm.value.planGroup !== "Bandwidthbooster" ||
            this.planGroupForm.value.planGroup !== "Volume Booster")
        ) {
          this.planGroupForm.patchValue({
            maxconcurrentsession: 1,
            // allowOverUsage: false,
            quotaResetInterval: "",
            usageQuotaType: "TOTAL", //add "" to "TOTAL"
            quota: "",
            quotatype: "",
            quotaUnit: ""
          });
          let type = {
            value: "Data"
          };
          this.getSelQoutaType(type);
        }
      }
      // this.advanceListData = response;
    });
    if (!this.isPlanEdit) {
      this.chargeIdFromService = event.value;
      this.chargeFilterData(event.value);
    }
    if (this.viewPlanListData.serviceId !== event.value) {
      this.chargeFromArray = this.fb.array([]);
      this.chargefromgroup.reset();
      this.totalPriceData = [];
      this.planGroupForm.controls.offerprice.setValue("");
      this.planGroupForm.controls.newOfferPrice.setValue("");
    }
  }
  totalCharges: any = [];
  chargeFilterData(id) {
    this.advanceListData = [];
    let ListData: any = [];
    const url1 = "/charge2/" + id + "?service=" + id + "&mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(url1).subscribe((response: any) => {
      ListData = response.dataList;
      this.totalCharges = ListData;
      ListData.forEach(element => {
        if (this.planGroupForm.value.plantype == "Prepaid") {
          if (
            (element.charge.chargetype == "ADVANCE" ||
              element.charge.chargetype == "NON_RECURRING") &&
            element.charge.chargecategory != "TERMINATION"
          ) {
            this.advanceListData.push(element.charge);
          }
        } else if (this.planGroupForm.value.plantype == "Postpaid") {
          if (
            element.charge.chargetype == "RECURRING" ||
            element.charge.chargetype == "NON_RECURRING" ||
            element.charge.chargetype == "ADVANCE"
          ) {
            this.advanceListData.push(element.charge);
          }
        }
        this.filterChargeType();
      });
    });
  }

  filterChargesByCurrency(charge) {
    const selectedCurrency = charge?.currency;

    this.advanceListData = this.advanceListData.filter(charge => {
      const chargeCurrency = charge?.currency ?? this.currency;
      return chargeCurrency === selectedCurrency;
    });

    this.filterChargeType();
  }

  filterChargeType() {
    if (
      this.planGroupForm.value.planGroup == "Volume Booster" ||
      this.planGroupForm.value.planGroup == "DTV Addon" ||
      this.planGroupForm.value.planGroup == "Bandwidthbooster"
    ) {
      this.advanceListData = this.advanceListData.filter(
        charge => charge.chargetype === "NON_RECURRING"
      );
    }
  }

  rejectPlanOpen(planId, nextApproverId) {
    this.reject = false;
    this.selectStaff = null;
    this.rejectPlanData = [];
    this.rejectPlanModal = true;
    this.assignPlanID = planId;
    this.nextApproverId = nextApproverId;
    this.rejectPlanForm.reset();
    this.rejectPlanSubmitted = false;
  }
  assignApporvePlanModal: boolean = false;
  approvePlanOpen(planId, nextApproverId) {
    this.approved = false;
    this.selectStaff = null;
    this.approvePlanData = [];
    this.assignApporvePlanModal = true;
    this.assignPlanID = planId;
    this.nextApproverId = nextApproverId;
    this.rejectPlanForm.reset();
    this.rejectPlanSubmitted = false;
  }

  approvePlanClosed() {
    this.assignApporvePlanModal = false;
  }

  selectStaff: any;
  selectStaffReject: any;
  approvePlanData = [];
  approved = false;
  rejectPlanData = [];
  reject = false;

  assignToStaff(flag) {
    let url: any;
    if (flag == true) {
      if (this.selectStaff) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.assignPlanID}&eventName=${"PLAN"}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.assignPlanID}&eventName=${"PLAN"}&isApproveRequest=${flag}`;
      }
    } else {
      if (this.selectStaffReject) {
        url = `/teamHierarchy/assignFromStaffList?entityId=${this.assignPlanID}&eventName=${"PLAN"}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
      } else {
        url = `/teamHierarchy/assignEveryStaff?entityId=${this.assignPlanID}&eventName=${"PLAN"}&isApproveRequest=${flag}`;
      }
    }

    this.planManagementService.getMethod(url).subscribe(
      response => {
        this.assignApporvePlanModal = false;
        this.rejectPlanModal = false;
        $("#rejectPlanModal").modal("hide");
        this.searchPlan("");
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

  assignPlan() {
    this.assignPlansubmitted = true;
    this.approved = false;
    this.selectStaff = null;
    this.approvePlanData = [];
    if (this.assignPlanForm.valid) {
      let url = "/approvePlan?mvnoId=" + localStorage.getItem("mvnoId");
      let assignCAFData = {
        planId: this.assignPlanID,
        nextStaffId: "",
        flag: "approved",
        remark: this.assignPlanForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
      };

      this.planManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          //$("#assignApporvePlanModal").modal("hide");
          //   if (!this.searchkey) {
          //     this.getPostoaidPlan("");
          //   } else {
          this.searchPlan("");
          //   }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.assignPlanForm.reset();
          this.assignPlansubmitted = false;
          if (response.result.dataList != null) {
            this.approvePlanData = response.result.dataList;
            this.approvePlan = this.approvePlanData;
            this.approved = true;
          } else {
            this.assignApporvePlanModal = false;
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
        remark: this.rejectPlanForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
      };

      let url = "/approvePlan?mvnoId=" + localStorage.getItem("mvnoId");
      this.planManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          //   if (!this.searchkey) {
          //     this.getPostoaidPlan("");
          //   } else {
          this.searchPlan("");
          //   }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });

          this.rejectPlanForm.reset();
          this.rejectPlanSubmitted = false;
          if (response.result.dataList != null) {
            this.rejectPlanData = response.result.dataList;
            this.reject = true;
          } else {
            this.rejectPlanModal = false;
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

  openPaymentWorkFlow(id, auditcustid) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "PLAN",
      planId: ""
    });
  }

  changeStatusValue = "";
  statusChangePlanID = "";
  changeStatusFlag: boolean = false;
  openChangeStatusModal(id, status) {
    this.changeStatusFlag = true;
    // $("#changeStatusModal").modal("show");
    this.changeStatusValue = "";
    this.statusChangePlanID = id;
    this.currentStatus = status;
    this.endDate = new Date();
  }

  closeModalForStatusFlag() {
    this.changeStatusFlag = false;
  }
  closeModalForreAssign() {
    this.reAssignPlanModel = false;
  }
  ChangeStatus(isRequired) {
    let Data = {};

    let url =
      "/Plan/changeStatus?id=" +
      this.statusChangePlanID +
      "&status=" +
      this.changeStatusValue +
      "&mvnoId=" +
      localStorage.getItem("mvnoId");
    let apiUrl;
    if (isRequired) {
      let endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd");
      apiUrl = url + "&endDate=" + endDate;
    } else {
      apiUrl = url;
    }
    console.log(apiUrl);
    this.planManagementService.updateMethod(apiUrl, Data).subscribe(
      (response: any) => {
        this.changeStatusFlag = false;
        this.changeStatusValue = "";
        this.statusChangePlanID = "";
        this.currentStatus = "";
        // if (!this.searchkey) {
        //   this.getPostoaidPlan("");
        // } else {
        this.searchPlan("");
        // }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.msg,
          icon: "far fa-check-circle"
        });

        this.rejectPlanForm.reset();
        this.rejectPlanSubmitted = false;
      },
      (error: any) => {
        // console.log(error, "error")
        if (error.error.status == 400) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.ERROR,
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
  workflowAuditData1: any = [];
  currentPageMasterSlab1 = 1;
  MasteritemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords1: String;
  workflowID: any;
  getworkflowAuditDetails(size, id, name) {
    let page = this.currentPageMasterSlab1;
    let page_list;
    if (size) {
      page_list = size;
      this.MasteritemsPerPage1 = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.MasteritemsPerPage1 = 5;
      } else {
        this.MasteritemsPerPage1 = 5;
      }
    }

    this.workflowAuditData1 = [];

    let data = {
      page: page,
      pageSize: this.MasteritemsPerPage1
    };

    let url = "/workflowaudit/list?entityId=" + id + "&eventName=" + name;

    this.planManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.workflowAuditData1 = response.dataList;
        this.MastertotalRecords1 = response.totalRecords;
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.ERROR,
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
  pageChangedMasterList(pageNumber) {
    this.currentPageMasterSlab1 = pageNumber;
    this.getworkflowAuditDetails("", this.workflowID, "PLAN");
  }
  TotalItemPerPageWorkFlow(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageMasterSlab1 > 1) {
      this.currentPageMasterSlab1 = 1;
    }
    this.getworkflowAuditDetails(this.showItemPerPage, this.workflowID, "PLAN");
  }

  accessibilityData = [];
  getAccessibilityData() {
    let url = "/commonList/accessibility";
    this.commondropdownService.getMethodWithCacheCMS(url).subscribe(
      (response: any) => {
        this.accessibilityData = response.dataList;
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
  getProductsType() {
    if (this.statusCheckService.isActiveInventoryService) {
      const url = "/product/all";
      this.productManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.ProductsType = response.dataList;
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

  createPlanProductFormGroup(): FormGroup {
    return this.fb.group({
      revisedCharge: [this.planProductfromgroup.value.revisedCharge],
      ownershipType: [this.planProductfromgroup.value.ownershipType, Validators.required],
      productCategoryId: [this.planProductfromgroup.value.productCategoryId, Validators.required],
      productId: [this.planProductfromgroup.value.productId],
      product_type: [this.planProductfromgroup.value.product_type, Validators.required],
      productQuantity: [
        this.planProductfromgroup.value.productQuantity,
        [Validators.required, Validators.min(1)]
      ],
      id: [this.planProductfromgroup.value.id],
      name: [null]
    });
  }

  onAddProductField() {
    this.planProductSubmitted = true;
    this.showQtyError = false;
    if (this.planProductfromgroup.valid) {
      if (
        this.planProductfromgroup.controls.revisedCharge.value == null &&
        this.planProductfromgroup.controls.ownershipType.value == "Sold"
      ) {
        this.showQtyError = true;
        this.qtyErroMsg = "Do not add product with charge null and ownership type is Sold..";
      } else {
        this.showQtyError = false;
        this.planProductMappingFromArray.push(this.createPlanProductFormGroup());
        this.planProductfromgroup.reset();
        this.planProductfromgroup.controls.productQuantity.setValue(1);
        this.planProductSubmitted = false;
        this.productFlag = false;
        this.productTypeFlag = false;
        this.ownershipTypeFlag = false;
        this.revisedChargeFlag = false;
        this.productChargeFlag = false;
      }
    }
  }

  pageChangePlanProductData(number) {
    this.currentPagePlanProductMapping = number;
  }

  getProductbyCategory(event) {
    let prodCateId = event.value;
    this.getProductDetailsById = [];
    this.productChargeFlag = false;
    this.showQtyError = false;
    this.planProductfromgroup.get("productId").reset();
    const url = "/product/getAllProductsByProductCategoryId?pc_id=" + prodCateId;
    this.productManagementService.getMethod(url).subscribe(
      (response: any) => {
        // if (response.responseCode == 200) {
        this.productList = response.dataList;
        this.productFlag = true;
        this.productTypeFlag = true;
        this.ownershipTypeFlag = false;
        this.revisedChargeFlag = false;
        this.productChargeFlag = false;
        // console.log("this.productList", this.productList);
        // } else {
        //   this.messageService.add({
        //     severity: "error",
        //     summary: "Error",
        //     detail: response.responseMessage,
        //     icon: "far fa-times-circle",
        //   });
        // }
      },
      (error: any) => {
        // console.log(error, 'error')
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  getAllProduct() {
    if (this.statusCheckService.isActiveInventoryService) {
      const url = "/product/getAllActiveProduct";
      this.productManagementService.getMethod(url).subscribe(
        (response: any) => {
          // if (response.responseCode == 200) {
          this.allActiveProduct = response.dataList;
          //console.log("this.productList", this.productList);
          // } else {
          //   this.messageService.add({
          //     severity: "error",
          //     summary: "Error",
          //     detail: response.responseMessage,
          //     icon: "far fa-times-circle",
          //   });
          // }
        },
        (error: any) => {
          // console.log(error, 'error')
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

  async onRemovePlanProductMap(productFieldIndex: number, productFieldId: number) {
    this.planProductMappingFromArray.removeAt(productFieldIndex);
  }

  deleteConfirmonPlanProductField(productFieldIndex: number, productFieldId: number) {
    if (productFieldIndex || productFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Product?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemovePlanProductMap(productFieldIndex, productFieldId);
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

  checkOwnership(e) {
    this.showQtyError = false;
    if (e.value == "Organization Owned") {
      this.planProductfromgroup.controls.revisedCharge.disable();
      this.revicedAmount = null;
    } else {
      if (this.chargeAmount != null) {
        this.planProductfromgroup.controls.revisedCharge.enable();
        this.revicedAmount = this.chargeAmount;
      } else {
        this.planProductfromgroup.controls.revisedCharge.disable();
      }
      //this.planProductfromgroup.controls.revisedCharge.setValue(this.chargeAmount);
    }
    // this.planProductfromgroup.controls.revisedCharge.setValue("");
  }
  getAllCAS() {
    const url = "/casepackage/getactivecas?mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.casmasterData = response.dataList;
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
  getAllCASPackage(casID) {
    this.casPackageData = this.casmasterData.find(
      element => element.id === casID
    ).casPackageMappings;
  }

  taxAmount: any;
  taxAmountCal(price, rate) {
    this.taxAmount = (price * rate) / 100;
    return this.taxAmount.toFixed(2);
  }

  AuditData1: any = [];
  currentPageAuditSlab1 = 1;
  AudititemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
  AudittotalRecords1: String;
  auditList: any = [];
  sortOrder = 0;
  auditData: any;
  auditDataList: any = [];
  GetAuditData(planId, size) {
    let page = this.currentPageAuditSlab1;
    let page_list;
    if (size) {
      page_list = size;
      this.AudititemsPerPage1 = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.AudititemsPerPage1 = 5;
      } else {
        this.AudititemsPerPage1 = 5;
      }
    }
    this.AuditData1 = [];

    let data = {
      page: page,
      pageSize: this.AudititemsPerPage1,
      sortBy: "id",
      sortOrder: 0
    };
    const url = "/auditLog/getAuditList/" + planId;
    this.planManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.auditDataList = response.dataList;
        this.AudittotalRecords1 = response.totalRecords;
        // this.AuditData1 = this.auditDataList.filter(
        //   audit => audit.operation !== "POSTPAID PLAN VIEW" && audit.module == "PostpaidPlan"
        // );
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
  pageChangedAuditList(pageNumber) {
    this.currentPageAuditSlab1 = pageNumber;
    this.GetAuditData(this.auditData, "");
  }

  TotalItemPerPageAudit(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageAuditSlab1 > 1) {
      this.currentPageAuditSlab1 = 1;
    }
    this.GetAuditData(this.showItemPerPage, this.auditData);
  }

  pickModalOpen(data) {
    let url = "/workflow/pickupworkflow?eventName=PLAN&entityId=" + data.id;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.searchPlan("");

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
  revicedChargeValidation(event) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }
  productQtyValidation(event) {
    var num = String.fromCharCode(event.which);
    if (!/[0-9]/.test(num)) {
      event.preventDefault();
    }
  }
  getList() {
    this.fieldsArr.forEach((el1: any) => {
      // el1.fields.forEach((el2: any) => {
      this.allFieldsArr.push(el1);
      if (el1.fieldType == "select" && el1.isdependant == false) {
        this.custService.getMethod2(el1.endpoint).subscribe((res: any) => {
          // console.log("response",res)
          if (this.optionList != null) {
            const foundIndex = this.optionList.findIndex(
              ({ fieldname }) => fieldname == el1.fieldname
            );
            if (foundIndex != -1) {
              this.optionList.splice(foundIndex, 1);
            }
            this.optionList.push({
              module: el1.module,
              fieldname: el1.fieldname,
              options: res
            });
          } else {
            this.optionList.push({
              module: el1.module,
              fieldname: el1.fieldname,
              options: res
            });
          }
        });
      } else if (el1.fieldType == "multi-select" && el1.isdependant == false) {
        this.custService.getMethod2(el1.endpoint).subscribe((res: any) => {
          this.multiOptionList.push({
            moduleName: el1.moduleName,
            fieldname: el1.fieldname,
            options: res
          });
        });
      }
    });
    //
  }

  getOptions(module, field) {
    this.optionList.forEach((el: any) => {
      if (el.moduleName == module && el.fieldname == field) {
        this.allFieldsArr.filter(val => {
          if (val.fieldname == field) {
            return this.custService.getMethod2(val.endpoint).subscribe(res => {
              el.options = res;
            });
          }
        });
      }
    });
  }

  getFields() {
    if (!this.isEditPlan) {
      this.fieldsArr = [];
      this.tempservice
        .getMethod("/fieldMapping/getPlanFieldsByServiceid/" + this.planGroupForm.value.serviceId)

        .subscribe(
          (res: any) => {
            if (res.responseCode == 200 && res.dataList.length > 0) this.ifServiceParam = true;
            // else if(res.responseCode == 406 || res.responseCode == 404){
            //   this.ifServiceParam = false;
            //   this.messageService.add({
            //     severity: "error",
            //     summary: "Error",
            //     detail: res.responseMessage,
            //     icon: "far fa-times-circle",
            //   });
            //
            // }
            else this.ifServiceParam = false;
            this.fieldsArr = res.dataList;

            this.getList();

            if (this.fieldsArr.length >= 1) {
              this.fieldsArr.forEach((el2: any) => {
                if (el2.mandatoryFlag) {
                  this.form[el2.fieldname] = new FormControl("", [Validators.required]);
                } else this.form[el2.fieldname] = new FormControl("");
              });
            }
            this.customerGroupForm = this.fb.group(this.form);

            // console.log('planGroupForm',this.planGroupForm)
            // console.log("this.customerGroupForm", this.customerGroupForm);
          },
          (error: any) => {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.errorMessage,
              icon: "far fa-times-circle"
            });
          }
        );
    } else if (this.isEditPlan) {
      this.fieldsArr = [];
      this.tempservice
        .getMethod("/fieldMapping/getPlanFieldsByServiceid/" + this.viewPlanListData.serviceId)
        .subscribe((res: any) => {
          this.fieldsArr = res.dataList;
          this.getList();
          if (this.fieldsArr.length >= 1) {
            this.fieldsArr.forEach((el2: any) => {
              if (el2.mandatoryFlag) {
                this.form[el2.fieldname] = new FormControl("", [Validators.required]);
              } else this.form[el2.fieldname] = new FormControl("");
            });
            this.fieldsArr.forEach((el: any) => {
              if (this.viewPlanListData.hasOwnProperty(el.fieldname)) {
                el.defaultValue = this.viewPlanListData[el.fieldname];
              }
            });
          }
          this.customerGroupForm = this.fb.group(this.form);
        });
    }
  }

  // canExit() {
  //   return true;
  // }
  getProductDetails(event) {
    this.ownershipTypeFlag = false;
    this.revisedChargeFlag = false;
    this.productChargeFlag = false;
    this.showQtyError = false;
    this.planProductfromgroup.get("product_type").reset();
    this.getProductDetailsById = this.productList.filter(element => element.id == event.value);
  }
  getChargeAmount(event) {
    this.ownershipTypeFlag = true;
    this.revisedChargeFlag = true;
    this.productChargeFlag = true;
    this.showQtyError = false;
    this.planProductfromgroup.get("ownershipType").reset();
    if (this.getProductDetailsById.length != 0) {
      if (event.value == "New") {
        this.chargeAmount = this.getProductDetailsById.find(element => element).newProductAmount;
        this.revicedAmount = this.chargeAmount;
        if (this.chargeAmount != null) {
          this.planProductfromgroup.controls.revisedCharge.enable();
        } else {
          this.planProductfromgroup.controls.revisedCharge.disable();
        }
      }
      if (event.value == "Refurbished") {
        this.chargeAmount = this.getProductDetailsById.find(
          element => element
        ).refurburshiedProductAmount;
        this.revicedAmount = this.chargeAmount;
        if (this.chargeAmount != null) {
          this.planProductfromgroup.controls.revisedCharge.enable();
        } else {
          this.planProductfromgroup.controls.revisedCharge.disable();
        }
      }
    } else {
      this.chargeAmount = null;
      this.revicedAmount = null;
      this.planProductfromgroup.controls.revisedCharge.disable();
    }
  }

  approvableStaff: any = [];
  assignedPlanid: any;
  reAssignPlanModel: boolean = false;
  StaffReasignList(data) {
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${data.id}&eventName=PLAN`;
    this.planManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.reAssignPlanModel = true;
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
          this.reAssignPlanModel = false;
          // this.messageService.add({
          //   severity: "success",
          //   summary: "Success",
          //   detail: response.responseMessage,
          //   icon: "far fa-times-circle",
          // });
        }
        if (response.dataList != null) {
          this.approvableStaff = response.dataList;
          this.approved = true;
          this.reAssignPlanModel = true;
        } else {
          this.reAssignPlanModel = false;
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
    this.remarks = this.assignPlanForm.controls.remark;
    if (this.assignedPlanid != null) {
      url = `/teamHierarchy/reassignWorkflow?entityId=${this.assignedPlanid}&eventName=PLAN&assignToStaffId=${this.selectStaff}&remark=${this.remarks.value}`;

      this.planManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.reAssignPlanModel = false;
          this.searchPlan("");
          this.getPlanGroup();
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getPlanGroup();
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
        detail: "Please Aprove Before Reassigne:",
        icon: "far fa-times-circle"
      });
    }
  }
  getProductPlanMappingDetails(planId, details) {
    this.planProductMappingFromArray = this.fb.array([]);
    if (this.statusCheckService.isActiveInventoryService) {
      let url = `/product_plan_mapping/getProductPlanMappingDetails?planId=${planId}`;
      this.productManagementService.getMethod(url).subscribe(
        (response: any) => {
          if (details == "viewPlanDetails") {
            this.planDetailData.productplanmappingList = response.dataList;
          } else if (details == "editPlan") {
            this.viewPlanListData.productplanmappingList = response.dataList;
            this.viewPlanListData.productplanmappingList?.forEach(e => {
              this.planProductMappingFromArray.push(this.fb.group(e));
            });
            this.planProductMappingFromArray.patchValue(
              this.viewPlanListData.productplanmappingList
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
    }
  }

  useQuotaChnage(event: any) {
    if (!event.target.checked) {
      this.planGroupForm.controls.chunk.setValue("");
    }
  }

  patchDataInQosData(plandata) {
    this.qospolicyformArray = this.fb.array([]);
    if (plandata.planQosMappingEntityList.length > 0) {
      plandata.planQosMappingEntityList.forEach(qos => {
        this.qospolicyformArray.push(
          this.fb.group({
            planid: [qos.planid],
            qosid: [qos.qosid],
            frompercentage: [qos.frompercentage],
            topercentage: [qos.topercentage]
          })
        );
      });
    }
  }

  preventNegative(event: KeyboardEvent): void {
    const invalidKeys = ["-", "+", "e", "E"];
    const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (invalidKeys.includes(event.key) || isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  getProductData() {
    if (this.statusCheckService.isActiveInventoryService) {
      this.commondropdownService.getActiveProductCategoryList();
      this.commondropdownService.getAllActiveProduct();
      this.getAllProduct();
    }
  }

  searchStaffByName() {
    if (this.searchStaffDeatil) {
      this.approvePlanData = this.approvePlan.filter(
        staff =>
          staff.fullName.toLowerCase().includes(this.searchStaffDeatil.toLowerCase()) ||
          staff.username.toLowerCase().includes(this.searchStaffDeatil.toLowerCase())
      );
    } else {
      this.approvePlanData = this.approvePlan;
    }
  }

  clearSearchForm() {
    this.searchStaffDeatil = "";
    this.approvePlanData = this.approvePlan;
  }

  mvnoChange(event) {
    this.commondropdownService.getserviceAreaListForCafCustomer(event.value);
    this.getService(event.value);
    this.getQosPolicy(event.value);
    this.getTimeBasePolicy(event.value);
  }

  isSearchDisabled(): boolean {
    // if no search option selected → disable
    if (!this.searchOption || this.searchOption.trim() === "") return true;

    switch (this.searchOption) {
      case "planstatus":
      case "plancreatedby":
        return !this.searchDeatil || this.searchDeatil.toString().trim() === "";

      case "planvalidity":
        return (
          !this.searchDeatil ||
          this.searchDeatil.toString().trim() === "" ||
          !this.searchUnitsOfValidity ||
          this.searchUnitsOfValidity.trim() === ""
        );

      case "planstartdate":
      case "planenddate":
        return !this.searchDeatil;

      case "plancreateddate":
        return !this.searchDeatilFromDate || !this.searchDeatilToDate;

      case "planname":
        // ✅ your required condition here
        return (
          !this.searchOption ||
          this.searchOption.trim() === "" ||
          !this.searchDeatil ||
          this.searchDeatil.toString().trim() === "" ||
          !this.searchOptionType ||
          this.searchOptionType.trim() === ""
        );

      case "plantype":
        return !this.searchOptionType;

      default:
        return !this.searchDeatil || this.searchDeatil.toString().trim() === "";
    }
  }
  onStartDateChange(event: any) {
  const selectedStartDate = event.target.value;

  // Update minEndDate so End Date cannot be before Start Date
  this.minEndDate = selectedStartDate;

  // Optional: if End Date is earlier than selected Start Date, reset it
  const currentEndDate = this.planGroupForm.get('endDate')?.value;
  if (currentEndDate && currentEndDate < selectedStartDate) {
    this.planGroupForm.get('endDate')?.setValue(selectedStartDate);
  }
}
}
