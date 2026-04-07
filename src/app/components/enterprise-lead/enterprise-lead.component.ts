import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { InvoiceDetalisModelComponent } from "../invoice-detalis-model/invoice-detalis-model.component";
import { InvoicePaymentDetailsModalComponent } from "../invoice-payment-details-modal/invoice-payment-details-modal.component";
import { countries } from "../model/country";
import { PaymentAmountModelComponent } from "../payment-amount-model/payment-amount-model.component";
import { WorkflowAuditDetailsModalComponent } from "../workflow-audit-details-modal/workflow-audit-details-modal.component";
import { DatePipe, formatDate } from "@angular/common";
import {
  COUNTRY,
  CITY,
  STATE,
  PINCODE,
  AREA,
  STREET,
  HOUSENO
} from "src/app/RadiusUtils/RadiusConstants";
import { CustomerManagements } from "../model/customer";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { LoginService } from "src/app/service/login.service";
import { BehaviorSubject, Observable, Observer } from "rxjs";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { ConfirmationService, MessageService, TreeNode } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { StaffService } from "src/app/service/staff.service";
import { CustomerDocumentService } from "../customer-documents/customer-document.service";
import { CustomerInventoryMappingService } from "src/app/service/customer-inventory-mapping.service";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { OutwardService } from "src/app/service/outward.service";
import { ProuctManagementService } from "src/app/service/prouct-management.service";
import { InvoiceDetailsService } from "src/app/service/invoice-details.service";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { Regex } from "src/app/constants/regex";
import { LeadSourceMasterService } from "src/app/service/lead-source-master-service";
import { LeadManagementService } from "src/app/service/lead-management-service";
import { Lead } from "src/app/components/model/lead";
import { Notes } from "src/app/components/model/Notes";
import { LeadFollowupService } from "src/app/service/lead-followup";
import { RejectedReasonService } from "src/app/service/rejected-reason.service";
import { PartnerService } from "src/app/service/partner.service";
import { BranchManagementService } from "../branch-management/branch-management.service";
import { CustomerToLead } from "../model/customerToLead";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { set, values } from "lodash";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { SALES_CRMS } from "src/app/constants/aclConstants";
import { SystemconfigService } from "src/app/service/systemconfig.service";

declare var $: any;

@Component({
  selector: "app-enterprise-lead",
  templateUrl: "./enterprise-lead.component.html",
  styleUrls: ["./enterprise-lead.component.css"]
})
export class EnterpriseLeadComponent implements OnInit {
  isPlanDetailHide: boolean = false;
  followupData: any;
  followupId: any;
  isfollowupIdEdit: boolean = false;
  followUpList: any = [];
  tempLeadId: any;

  countryTitle = COUNTRY;
  cityTitle = CITY;
  stateTitle = STATE;
  pincodeTitle = PINCODE;
  areaTitle = AREA;
  street = STREET;
  houseNo = HOUSENO;

  @ViewChild("closebutton") closebutton;

  @ViewChild(InvoiceDetalisModelComponent)
  InvoiceDetailModal: InvoiceDetalisModelComponent;

  @ViewChild(InvoicePaymentDetailsModalComponent)
  invoicePaymentDetailModal: InvoicePaymentDetailsModalComponent;

  @ViewChild(PaymentAmountModelComponent)
  PaymentDetailModal: PaymentAmountModelComponent;

  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;

  //Parameters for headers to pass...

  buid: any;
  mvnoid: any;
  staffid: any;

  leadIdRecord: number;
  isLeadDetailSubMenu: boolean = false;

  addNotesForm: FormGroup;
  addNotesData: Notes;
  notesSubmitted: boolean = false;
  isSpecificLeadOpen: boolean = false;

  bankDataList: any;
  custLedgerForm: FormGroup;
  fields: any;
  countries: any = countries;
  customerGroupForm: FormGroup;
  assignCustomerCAFForm: FormGroup;
  rejectCustomerCAFForm: FormGroup;
  customerCategoryList: any;
  submitted: boolean = false;
  assignCustomerCAFsubmitted: boolean = false;
  rejectCustomerCAFsubmitted: boolean = false;
  assignCustomerCAFId: any;
  taxListData: any;
  createLeadData: Lead;
  customerPojo: any;
  currentPageLeadListdata = 1;
  leadListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  leadListdatatotalRecords: any;
  leadNotesDataTotalRecords: any;
  leadListData: any = [];
  viewLeadListData: any = [];
  isLeadEdit: boolean = false;
  customertype = "";
  customercategory = "";
  searchcustomerUrl: any;

  chargeCategoryList: any;
  isPlanEdit: boolean = false;
  viewPlanListData: any;

  payMappingListFromArray: FormArray;
  addressListFromArray: FormArray;
  paymentDetailsFromArray: FormArray;
  overChargeListFromArray: FormArray;
  custMacMapppingListFromArray: FormArray;
  selectvalue = "";

  paymappingItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  payMappinftotalRecords: any;
  currentPagePayMapping = 1;

  overChargeListItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  overChargeListtotalRecords: any;
  currentPageoverChargeList = 1;

  custMacMapppingListtemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custMacMapppingListtotalRecords: any;
  currentPagecustMacMapppingList = 1;

  custChargeDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custChargeDeatiltotalRecords: any;
  currentPagecustChargeDeatilList = 1;

  custPlanDeatilItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custPlanDeatiltotalRecords: any;
  currentPagecustPlanDeatilList = 1;

  custMacAddItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custMacAddtotalRecords: any;
  currentPagecustMacAddList = 1;

  custLedgerItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  custLedgertotalRecords: any;
  currentPagecustLedgerList = 1;

  customerPaymentdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerPaymentdatatotalRecords: any;
  currentPagecustomerPaymentdata = 1;

  customerFuturePlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerFuturePlanListdatatotalRecords: any;
  currentPagecustomerFuturePlanListdata = 1;

  customerExpiryPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerExpiryPlanListdatatotalRecords: any;
  currentPagecustomerExpiryPlanListdata = 1;

  customerCurrentPlanListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerCurrentPlanListdatatotalRecords: any;
  currentPagecustomerCurrentPlanListdata = 1;

  temp = [];
  customerListData1: any;

  totalAddress = 0;
  macAddresscountNumber = 0;

  searchCustomerName: any;
  searchCustomerType: any = "";
  searchData: any;
  customersListData: any;
  searchOption: any = "name";
  searchDeatil: any;
  fieldEnable: boolean = false;

  addresslength = 0;
  payMappinglength = 0;
  charegelength = 0;
  charge_date: NgbDateStruct | any;
  presentaddress = "";

  require: any;
  ngbBirthcal: NgbDateStruct | any;

  listView: boolean = true;
  createView: boolean = false;
  areaDetails: any;
  pincodeDeatils: any;
  areaAvailableList: any;
  selectAreaList: boolean = false;
  selectPincodeList: boolean = false;

  addressListData: any = [];
  macListData: any = [];
  PyamentpincodeDeatils: any;
  permanentpincodeDeatils: any;
  paymentareaDetails: any;
  permanentareaDetails: any;
  paymentareaAvailableList: any;
  permanentareaAvailableList: any;

  planGroupForm: FormGroup;
  chargeGroupForm: FormGroup;
  macGroupForm: FormGroup;
  plansubmitted: boolean = false;
  chargesubmitted: boolean = false;

  presentGroupForm: FormGroup;
  paymentGroupForm: FormGroup;
  permanentGroupForm: FormGroup;

  validPattern = "^[0-9]{3}$";
  selectAreaListPermanent: boolean = false;
  selectAreaListPayment: boolean = false;
  selectPincodeListPermanent: boolean = false;
  selectPincodeListPayment: boolean = false;

  ischecked: boolean = false;
  macsubmitted: boolean = false;
  chargeList: any;
  selectchargeList: boolean = false;

  planData: any = [];
  filterPlanData: any = [];
  postpaidplanData: any = [];
  listSearchView: boolean = false;
  isLeadDetailOpen: boolean = false;
  isQuotationDetailOpen: boolean = false;
  leadDetailData: any = {
    selectTitile: "",
    firstname: "",
    lastname: "",
    leadNo: "",
    contactperson: "",
    gst: "",
    pan: "",
    aadhar: "",
    passportNo: "",
    cafno: "",
    acctno: "",
    username: "",
    mobile: "",
    phone: "",
    // pcontactphno: "",
    email: "",
    serviceareaid: "",
    servicetype: "",
    custtype: "",
    latitude: "",
    longitude: "",
    didno: "",
    voicesrvtype: "",
    partnerid: "",
    salesremark: "",
    paymentDetails: {
      amount: "",
      referenceno: "",
      paymode: "",
      paymentdate: ""
    },
    addressList: [
      {
        fullAddress: "",
        pincodeId: "",
        areaId: "",
        cityId: "",
        stateId: "",
        countryId: ""
      }
    ]
  };
  paymentAddressData: any = [
    {
      fullAddress: "",
      pincodeId: "",
      areaId: "",
      cityId: "",
      stateId: "",
      countryId: ""
    }
  ];
  permanentAddressData: any = [
    {
      fullAddress: "",
      pincodeId: "",
      areaId: "",
      cityId: "",
      stateId: "",
      countryId: ""
    }
  ];
  custCurrentPlanList: any;
  custFuturePlanList: any;
  custExpiredPlanList: any;
  partnerDATA: any = [];
  presentAdressDATA: any = [];
  permentAdressDATA: any = [];
  paymentAdressDATA: any = [];
  chargeDATA = [];
  dataPlan = [];
  planserviceData: any;
  serviceAreaDATA: any;
  paymentDataamount: any;
  paymentDatareferenceno: any;
  paymentDatapaymentdate: any;
  paymentDatapaymentMode: any;
  customerApporevedData: any;
  customerRejectedData: any;
  plantypaSelectData: any;
  viewChargeData: any;
  selectchargeValueShow: boolean = false;
  dateTime = new Date();

  currentDate = new Date();
  loggedInUser: any;
  staffUserId: any = [];
  userName: "";
  UserServiceName: "";
  userServiAreaId: any;
  AclClassConstants;
  AclConstants;
  serviceAreaData: any;
  public loginService: LoginService;
  customerLedgerDetailData: any = {
    title: "",
    firstname: "",
    leadNo: "",
    lastname: "",
    contactperson: "",
    gst: "",
    pan: "",
    aadhar: "",
    cafno: "",
    acctno: "",
    username: "",
    mobile: "",
    phone: "",
    email: "",
    serviceareaid: "",
    servicetype: "",
    custtype: "",
    latitude: "",
    longitude: "",
    didno: "",
    voicesrvtype: "",
    partnerid: "",
    salesremark: "",
    plangroupid: "",
    paymentDetails: {
      amount: "",
      referenceno: "",
      paymode: "",
      paymentdate: ""
    },
    addressList: [
      {
        fullAddress: "",
        pincodeId: "",
        areaId: "",
        cityId: "",
        stateId: "",
        countryId: ""
      }
    ]
  };
  postdata: any = {
    CREATE_DATE: "",
    END_DATE: "",
    id: "",
    amount: "",
    balAmount: "",
    custId: "",
    description: "",
    refNo: "",
    transcategory: "",
    transtype: ""
  };
  customerLedgerData: any = {
    custname: "",
    plan: "",
    status: "",
    username: "",
    customerLedgerInfoPojo: {
      openingAmount: "",
      closingBalance: ""
    }
  };

  rejectedReasonList: any = [];
  rejectedReasons: any = [];
  searchLocationForm: FormGroup;
  currentPagesearchLocationList = 1;
  searchLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  searchLocationtotalRecords: String;
  currentPagenearDeviceLocationList = 1;
  nearDeviceLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  nearDeviceLocationtotalRecords: String;

  searchLocationData: any;
  nearDeviceLocationData: any;
  ifsearchLocationModal = false;
  ifNearLocationModal = false;
  iflocationFill = false;

  customerLedgerListData: any;
  isCustomerLedgerOpen: boolean = false;
  viewcustomerPaymentData: any;
  customerIdINLocationDevice: string;
  NetworkDeviceData: any;
  customerStatusDetail: any;

  customertotalRecords = 1;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 1;
  searchkey: string;
  leadListDatalength = 0;
  leadNotesDataLength = 0;

  custLedgerSubmitted: boolean = false;
  customerLedgerSearchKey: string;
  legershowItemPerPage = 1;
  CurrentPlanShowItemPerPage = 1;
  futurePlanShowItemPerPage = 1;
  expiredShowItemPerPage = 1;
  ticketShowItemPerPage = 1;
  paymentShowItemPerPage = 1;
  customerId: number;
  assignInventory: boolean;
  customerrMyInventoryView: boolean;
  assignedInventoryList = [];
  currentPageProductListdata = 1;
  productListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  productListdatatotalRecords: any;

  first = 0;

  rows = 10;

  paymentFormGroup: FormGroup;
  createPaymentData: any;
  customerData: any;
  customerIdRecord: number;

  assignInventoryModal: boolean;
  inventoryAssignForm: FormGroup;
  outwardList: any[];
  availableQty: number;
  unit: any;
  products = [];

  servicerTypeList = [];

  genderOptions = ["Male", "Female"];

  status = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
  ];
  invoiceType = [
    { label: "Group", value: "Group" },
    { label: "Independent", value: "Independent" }
  ];
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];

  rescheduleRemarks: any = [];

  @Input("customerId")
  showQtyError: boolean;
  // userId: number = localStorage.getItem('userId');
  userId: number = +localStorage.getItem("userId");
  partnerId = Number(localStorage.getItem("partnerId"));
  macList = [];
  selectedMACAddress = [];
  productHasMac: boolean;
  showQtySelectionError: boolean;
  productHasSerial: boolean;

  ifMyInvoice = false;
  isBranchAvailable = false;
  showItemPerPageInvoice = 1;

  InvoiceDATA = new BehaviorSubject({
    InvoiceDATA: ""
  });

  invoiceId = new BehaviorSubject({
    invoiceId: ""
  });
  paymentId = new BehaviorSubject({
    paymentId: ""
  });
  auditcustid = new BehaviorSubject({
    auditcustid: ""
  });
  searchInvoiceMasterFormGroup: FormGroup;
  currentPageinvoiceMasterSlab = 1;
  invoiceMasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  invoiceMastertotalRecords: String;
  searchInvoiceData: any;
  invoiceMasterListData: any = [];
  isInvoiceSearch: boolean = false;

  showPassword = false;
  _passwordType = "password";
  searchkey2: string;

  paymentMode = [{ label: "Cash" }, { label: "Cheque" }, { label: "Online" }];

  statusOptions = RadiusConstants.status;

  searchOptionSelect = [
    { label: "Customer Name", value: "name" },
    { label: "Mobile", value: "mobile" },
    { label: "Created By", value: "createdBy" },
    { label: "Last Modified On", value: "lastUpdateOn" },
    { label: "Lead Status", value: "status" },
    { label: "Circuit Name", value: "serviceNames" }
  ];

  searchParentCustSelect = this.commondropdownService.customerSearchOption;

  selectTitile = [
    { label: "Dr" },
    { label: "Mr" },
    { label: "Miss" },
    { label: "Mrs" },
    { label: "Dear" }
  ];

  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" }
  ];
  CustomerTypeValue = [
    { label: "Customer", value: "customer" },
    { label: "Organization", value: "organization" }
  ];
  leadStatusOptions = ["Inquiry", "Converted", "Rejected", "Re-Inquiry"];

  leadCategoryist = [{ label: "New Lead" }, { label: "Existing Customer" }];

  planTypeOptions = ["Normal", "Business Promotion"];

  leadVarietyOptions = ["New", "Old"];

  leadTypes = [];

  feasibilityOptions = [];
  // connectiontypeList = [];
  // linktypeList = [];
  // circuitareaList = [];
  // businessVerticalsList = [];
  // subbusinessVerticalsList = [];

  totaladjustedAmount = 0;
  celendarTypeData = [{ label: "English" }, { label: "Nepali" }];
  competitorDurationUnits = [
    { label: "Hours" },
    { label: "Days" },
    { label: "Months" },
    { label: "Years" }
  ];
  ifIndividualPlan = false;
  ifPlanGroup = false;
  planGroupName: any = "";
  planCategoryForm: FormGroup;
  invoiceList: any;
  prepaidParentCustomerList: any;
  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;
  selectedParentCust: any = [];
  selectedParentCustId: any;
  parentCustList: any;
  editLeadId: any;
  newFirst: number = 0;
  searchParentCustOption = "";
  searchParentCustValue = "";
  serviceAreaDisable: boolean = false;
  parentFieldEnable: boolean = false;
  validityUnitFormGroup: FormGroup;
  validityUnitFormArray: FormArray;
  planDataShow: any = [];
  // discount
  customerCustDiscountListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerCustDiscountListdatatotalRecords: String;
  currentPagecustomerCustDiscountListdata = 1;
  CustDiscountShowItemPerPage = 1;
  custCustDiscountList: any = [];
  dataDiscountPlan: any = [];
  oldDiscValue = "";
  newDiscValue = "";
  customerUpdateDiscount = false;
  FinalAmountList: any = [];
  planMappingList: any = [];
  planDiscount: number;
  finalOfferPrice: number;
  maxDiscountValue = 99;
  isInvoiceData = [
    { label: "YES", value: true },
    { label: "NO", value: false }
  ];
  ifWalletMenu = false;
  getWallatData = [];
  planDropdownInChageData = [];
  dataChargePlan: any = [];
  billingCycle: any = [];
  customerInventoryListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerInventoryListDataCurrentPage = 1;
  customerInventoryListDataTotalRecords: number;
  assignInventoryCustomerId: any;
  assignedInventoryListWithSerial = [];
  assignInventoryWithSDetailDataerial: boolean;
  customerInventoryDetailsListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerInventoryDetailsListDataCurrentPage = 1;
  customerInventoryDetailsListDataTotalRecords: number;
  customerInventoryMappingId: any;
  customerInventoryMappingIdForReplace: any;
  showReplacementForm: boolean;
  inventoryStatusDetails: any;
  inventoryStatusView: boolean;
  // isCustomerDetailSubMenu: boolean = false;
  staffUser: any;
  // isAdmin: boolean = false;
  viewCustomerPaymentList: boolean = false;
  customerPlanView: boolean = false;
  customerStatusView: boolean = false;

  //Create and update altenative flag...

  //Lead related fields...
  viewAllLeadDetails: any;
  ifChargeGetData = false;
  serviceareaCheck = true;
  plansArray: FormArray;
  leadSourceArr: any = [];
  leadSubSourceArr: any = [];

  //Followup and audit trail screen flags...
  openFollowUpSchedulling: boolean = false;
  openAuditTrailScreen: boolean = false;
  openLeadStatusScreen: boolean = false;
  openLeadNotesScreen: boolean = false;
  isServiceManagementOpen: boolean = false;
  //Followup schedulling related global variables...
  followupScheduleForm: FormGroup;
  followupFormsubmitted: boolean = false;
  followupPopupOpen: boolean;
  followupMinimumDate = new Date();

  closeFollowupForm: FormGroup;
  closeFollowupFormsubmitted: boolean = false;

  remarkFollowupForm: FormGroup;
  remarkFollowupFormsubmitted: boolean = false;

  reFollowupScheduleForm: FormGroup;
  reFollowupFormsubmitted: boolean = false;

  planGroupcustid = new BehaviorSubject({
    planGroupcustid: ""
  });

  //Search form group
  searchDatasetFormGroup: any;

  //Get staff details from followup controller...
  getStaffDetailList: FormGroup;
  leadId: number;
  createdBy: any;

  // close lead related variables....
  rejectLeadFormGroup: FormGroup;
  rejectedLeadFormSubmitted: boolean = false;
  // chargeType: any = [];

  //pagination variables for view lead notes functionality
  leadNotesListItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  leadNotesListDataCurrentPage = 1;

  planDataForm: FormGroup;
  DiscountValueStore: any = [];
  discountValue: any = 0;
  ifplanisSubisuSelect: boolean = false;

  viewAccess: any;
  ifcustomerDiscountField: boolean = false;
  serviceData: any;
  branchData: any;

  assignSubmmitted: boolean = false;
  assignLeadStaffForm: FormGroup;
  assignableStaffList: any[] = [];
  activeCustByUsername: any;
  billableCusList: any;
  parentCustomerDialogType: any = "";
  discountType: any = "One-time";
  discountPermission: any;
  isPlanOnDemand: boolean = false;
  partnerList: any = [];

  branchData1: any = [];
  branchId: any;
  leadcustTypeList = [
    { label: "Prepaid", value: "Prepaid" },
    { label: "Postpaid", value: "Postpaid" }
  ];
  searchExtingcustomerOption = [
    { label: "User Name", value: "username" },
    { label: "Email", value: "email" },
    { label: "PAN", value: "pan" },
    { label: "Mobile Number", value: "mobile" }
  ];
  ifReadonlyExtingInput = false;
  currentPageextingCustomerListdata = 1;
  extingCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  extingCustomerListdatatotalRecords: any;
  selectedextingCust: any = [];
  selectedextingCustId: any;
  extingCustList: any;
  newFirstexting = 0;
  searchextingCustType = "Prepaid";
  searchextingCustOption = "";
  searchextingCustValue = "";
  extingFieldEnable = false;
  ifextingSaveBtn = false;
  extingCustomerList: any = [];

  redirectCustomerId: any;
  ifcutomerToLeadRedirectService: boolean = false;
  planGroupMapingList: any = [];
  currentStaffBuList: any;
  isBuTypeOnDemand: boolean = false;
  days = [];

  parentExperience = [
    { label: "Single", value: "Single" },
    { label: "Actual", value: "Actual" }
  ];
  createAccess: boolean = false;
  closeAccess: boolean = false;
  editAccess: boolean = false;
  uploadAccess: boolean = false;
  reassignAccess: boolean = false;
  detailsAccess: boolean = false;
  auditTrailAccess: boolean = false;
  leadStatusAccess: boolean = false;
  leadNotesAccess: boolean = false;
  circuitManagementAccess: boolean = false;
  circuitManagementCreateAccess: boolean = false;
  circuitManagementEditAccess: boolean = false;
  circuitManagementStartAccess: boolean = false;
  quotationManagementAccess: boolean = false;
  generateQuotationAccess: boolean = false;
  downloadPdfAccess: boolean = false;
  showQuotationAccess: boolean = false;
  sendMailAccess: boolean = false;
  assignPOAccess: boolean = false;
  downloadPOAccess: boolean = false;
  callAccess: boolean = false;
  remarkFollowUpAccess: boolean = false;
  closeFollowUpAccess: boolean = false;
  rescheduleFollowUpAccess: boolean = false;
  scheduleFollowUpAccess: boolean = false;
  followUpAccess: boolean = false;
  downloadDocumentAccess: boolean = false;
  reopenLeadAccess: boolean = false;
  addNotesPopup: boolean = false;
  scheduleFollowup: boolean = false;
  closeFollowup: boolean = false;
  reScheduleFollowup: boolean = false;
  remarkScheduleFollowup: boolean = false;
  approveOrRejectLeadPopupModel: boolean = false;
  openRejectLeadPopup: boolean = false;
  selectPlanGroup: boolean = false;
  assignLeadModal: boolean = false;
  PlanDetailsShow: boolean = false;
  selectextingCustomer: boolean = false;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public PaymentamountService: PaymentamountService,
    public commondropdownService: CommondropdownService,
    private staffService: StaffService,
    loginService: LoginService,
    private customerDocumentService: CustomerDocumentService,
    private customerInventoryMappingService: CustomerInventoryMappingService,
    private recordPaymentService: RecordPaymentService,
    private outwardService: OutwardService,
    private productService: ProuctManagementService,
    private invoiceDetailsService: InvoiceDetailsService,
    private leadSourceMasterService: LeadSourceMasterService,
    private leadManagementService: LeadManagementService,
    private followupScheduleService: LeadFollowupService,
    private rejectedReasonService: RejectedReasonService,
    private partnerService: PartnerService,
    private branchManagementService: BranchManagementService,
    public invoicePaymentListService: InvoicePaymentListService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public datePipe: DatePipe,
    private Activatedroute: ActivatedRoute,
    private router: Router,
    private systemService: SystemconfigService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    this.createAccess = loginService.hasPermission(SALES_CRMS.CREATE_ENTERPRISE_LEAD);
    this.editAccess = loginService.hasPermission(SALES_CRMS.EDIT_ENTERPRISE_LEAD);
    this.closeAccess = loginService.hasPermission(SALES_CRMS.CLOSE_ENTERPRISE_LEAD);
    this.uploadAccess = loginService.hasPermission(SALES_CRMS.UPLOAD_ENTERPRISE_LEAD);
    this.reassignAccess = loginService.hasPermission(SALES_CRMS.REASSIGN_ENTERPRISE_LEAD);
    this.detailsAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD);
    this.auditTrailAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD_AUDIT_TRAIL);
    this.leadStatusAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD_STATUS);
    this.leadNotesAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD_NOTES);
    this.circuitManagementAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_CIRCUIT);
    this.reopenLeadAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD_REOPEN);
    this.circuitManagementCreateAccess = loginService.hasPermission(
      SALES_CRMS.ENTERPRISE_CIRCUIT_CREATE
    );
    this.circuitManagementEditAccess = loginService.hasPermission(
      SALES_CRMS.ENTERPRISE_CIRCUIT_EDIT
    );
    this.circuitManagementStartAccess = loginService.hasPermission(
      SALES_CRMS.ENTERPRISE_CIRCUIT_START
    );
    this.quotationManagementAccess = loginService.hasPermission(SALES_CRMS.QUOTATION_MGMT);
    this.generateQuotationAccess = loginService.hasPermission(SALES_CRMS.QM_GENERATE);
    this.downloadPdfAccess = loginService.hasPermission(SALES_CRMS.QM_DOWNLOAD_PDF);
    this.downloadDocumentAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_DOCS_DOWNLOAD);
    this.showQuotationAccess = loginService.hasPermission(SALES_CRMS.QM_SHOW);
    this.sendMailAccess = loginService.hasPermission(SALES_CRMS.QM_SEND_MAIL);
    this.assignPOAccess = loginService.hasPermission(SALES_CRMS.QM_ASSIGN_PO);
    this.downloadPOAccess = loginService.hasPermission(SALES_CRMS.QM_DOWNLOAD_PO);
    this.followUpAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD_FOLLOW_UP);
    this.scheduleFollowUpAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD_SCHEDULE);
    this.rescheduleFollowUpAccess = loginService.hasPermission(
      SALES_CRMS.ENTERPRISE_LEAD_RESCHEDULE
    );
    this.closeFollowUpAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD_CLOSE);
    this.remarkFollowUpAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD_REMARK);
    this.callAccess = loginService.hasPermission(SALES_CRMS.ENTERPRISE_LEAD_CALL);
    this.availableQty = 0;
    // this.inventoryAssignForm.reset();
    this.inventoryAssignForm = this.fb.group({
      id: [""],
      qty: ["", Validators.required],
      productId: ["", Validators.required],
      customerId: [this.customerId],
      staffId: [""],
      outwardId: ["", Validators.required],
      assignedDateTime: [new Date(), Validators.required],
      status: ["", Validators.required],
      mvnoId: [""]
    });
    this.macList = [];
  }

  leadApproveRejectForm: FormGroup;
  leadApproveRejectFormsubmitted: boolean = false;
  // leadApproveRejectDto: any = {
  //   buId: null,
  //   currentLoggedInStaffId: "",
  //   firstname: "",
  //   flag: "",
  //   id: "",
  //   mvnoId: "",
  //   nextLeadApprover: "",
  //   remark: "",
  //   serviceareaid: "",
  //   staffId: "",
  //   status: "",
  //   username: ""
  // }
  leadApproveRejectDto: any = {
    approveRequest: true,
    buId: null,
    currentLoggedInStaffId: 0,
    firstname: "",
    id: 0,
    mvnoId: 0,
    remark: "",
    serviceareaid: null,
    flag: "",
    nextTeamMappingId: null,
    status: "",
    teamName: "",
    username: "",
    rejectedReasonMasterId: null
  };
  currentLoginStaffData: any;
  isBuTypePredefined: boolean = false;
  selectParentCustomer: boolean = false;
  ngOnInit(): void {
    this.rejectedReasonList = [];
    this.rejectedSubReasonArr = [];
    this.activeCustomers = [];
    this.activeCustByUsername = [];
    this.myFinalCheck = false;
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.staffid = Number(localStorage.getItem("userId"));
    this.searchOption = "name";
    this.selSearchOption({ value: "name" });
    this.getCurrentStaffBUId();
    this.getStaffUsersFromLeadMaster();
    // this.getLeadList("");
    this.getEnterpriseLeadList();
    this.getLoggedinUserData();
    this.getFeasibilityList();
    // this.getConnectionTypeList();
    // this.getLinkTypeList();
    // this.getCircuitAreaTypeList();
    // this.getBusinessVerticalsTypeList();
    // this.getSubBusinessVerticalsTypeList();
    this.getServiceTypeList();
    this.getLeadTypeList();
    this.getLeadOriginTypes();
    this.getRequireServiceTypes();
    this.getLeadCustomerGenderTypes();
    this.daySequence();
    this.custLedgerForm = this.fb.group({
      startDateCustLedger: ["", Validators.required],
      endDateCustLedger: ["", Validators.required]
    });
    window.scroll(0, 0);
    this.searchLocationForm = this.fb.group({
      searchLocationname: ["", Validators.required]
    });

    this.planCategoryForm = this.fb.group({
      planCategory: [""]
    });

    this.addNotesForm = this.fb.group({
      id: [""],
      notes: ["", Validators.required]
    });

    this.followupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: ["", Validators.required],
      //status: [""],
      isMissed: [false],
      leadMasterId: []
    });

    this.rejectLeadFormGroup = this.fb.group({
      leadMasterId: [""],
      rejectReasonId: ["", Validators.required],
      rejectSubReasonId: [""],
      remark: ["", Validators.required],
      leadStatus: ["Closed"]
    });
    this.closeFollowupForm = this.fb.group({
      followUpId: [""],
      remarks: ["", Validators.required]
    });

    this.remarkFollowupForm = this.fb.group({
      leadFollowUpId: [""],
      remark: ["", Validators.required]
    });

    this.leadApproveRejectForm = this.fb.group({
      remark: ["", Validators.required],
      rejectedReasonMasterId: [""]
    });

    this.reFollowupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: [""],
      isMissed: [false],
      leadMasterId: [],
      remarksTemp: [""]
    });

    this.planDataForm = this.fb.group({
      offerPrice: [""],
      discountPrice: [0]
    });

    this.customerGroupForm = this.fb.group({
      id: [""],
      leadNo: ["", Validators.required],
      leadSourceId: ["", Validators.required],
      leadSourceName: [""],
      leadSubSourceId: [""],
      leadSubSourceName: [""],
      rejectReasonId: [""],
      rejectReasonName: [""],
      rejectSubReasonId: [""],
      rejectSubReasonName: [""],
      leadCustomerId: [""],
      leadPartnerId: [""],
      leadStaffId: [""],
      leadBranchId: [""],
      leadAgentId: [""],
      leadServiceAreaId: [""],
      leadCategory: ["", Validators.required],
      heardAboutSubisuFrom: ["", Validators.maxLength(600)],
      leadStatus: [""],
      previousVendor: [""],
      servicerType: [""],
      leadType: [""],
      existingCustomerId: [""],
      feasibility: ["", Validators.required],
      // connectiontype: [""],
      // circuitarea: [""],
      // likntype: [""],
      // closuredate: [""],
      // businessverticals: [""],
      // subbusinessverticals: [""],
      feasibilityRemark: [""],
      planType: [""],
      leadvariety: [""],
      username: [""],
      password: [""],
      firstname: ["", Validators.required],
      lastname: [""],
      email: ["", [Validators.pattern(Regex.email)]],
      title: [""],
      pan: [""],
      gst: [""],
      aadhar: [""],
      passportNo: [""],
      tinNo: [""],
      contactperson: [""],
      failcount: ["0"],
      // acctno: ['', Validators.required],
      custtype: ["Prepaid", Validators.required],
      custlabel: ["organization"],
      phone: [""],
      // pcontactphno: ["", [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.required]],
      mobile: ["", [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.required]],
      countryCode: [this.commondropdownService.commonCountryCode],
      cafno: [""],
      voicesrvtype: [""],
      didno: [""],
      calendarType: ["English"],
      partnerid: [""],
      salesremark: [""],
      servicetype: [""],
      serviceareaid: ["", Validators.required],
      status: [""],
      parentCustomerId: [""],
      parentExperience: [""],
      invoiceType: [""],
      latitude: [""],
      longitude: [""],
      discount: ["", [Validators.max(99)]],
      flatAmount: [""],
      plangroupid: [""],
      discountType: [""],
      discountExpiryDate: [""],
      billTo: ["CUSTOMER"],
      billday: [""],
      billableCustomerId: [""],
      isInvoiceToOrg: [false],
      planMappingList: (this.payMappingListFromArray = this.fb.array([])),
      addressList: (this.addressListFromArray = this.fb.array([])),
      overChargeList: (this.overChargeListFromArray = this.fb.array([])),
      custMacMapppingList: (this.custMacMapppingListFromArray = this.fb.array([])),
      paymentDetails: this.fb.group({
        amount: [""],
        paymode: [""],
        referenceno: [""],
        paymentdate: [""]
      }),
      isCustCaf: ["yes"],
      nextApproveStaffId: [""],
      nextTeamMappingId: [""],
      assigneeName: [""],
      presentCheckForPayment: [false],
      presentCheckForPermanent: [false],
      istrialplan: [false],
      leadCustomerCategory: [""],
      leadCustomerType: [""],
      leadCustomerSubType: [""],
      leadCustomerSector: [""],
      leadCustomerSubSector: [""],
      valleyType: [""],
      insideValley: [""],
      outsideValley: [""],
      competitorDuration: [""],
      durationUnits: ["Days"],
      expiry: [""],
      amount: [""],
      feedback: [""],
      gender: [""],
      branchId: [""],
      popManagementId: [""],
      dateOfBirth: [""],
      secondaryContactDetails: [""],
      secondaryPhone: [""],
      altmobile1: [""],
      altmobile2: [""],
      altmobile3: [""],
      altmobile4: [""],
      secondaryEmail: ["", [Validators.pattern(Regex.email)]],
      // scontactname: [""],
      previousAmount: [""],
      previousMonth: [""],
      leadOriginType: [""],
      requireServiceType: [""],
      landlineNumber: [""],
      customerId: [""],
      resellerid: [""],
      fax: [""],
      // salesremark: [""],
      salesrepid: [""],
      skypeid_imid: [""],
      associatedLevel: [""],
      locationlevel1: [""],
      locationlevel2: [""],
      locationlevel3: [""],
      locationlevel4: [""],
      organisation: [""],
      nation: [""],
      isLeadQuickInv: [false],
      leadIdentity: ["enterPrise"],
      designation: [""]
    });

    this.customerGroupForm.controls["invoiceType"].clearValidators();
    this.customerGroupForm.controls["invoiceType"].updateValueAndValidity();
    this.customerGroupForm.controls.invoiceType.disable();

    this.planGroupForm = this.fb.group({
      planId: ["", Validators.required],
      service: ["", Validators.required],
      validity: ["", Validators.required],
      offerprice: [""],
      newAmount: [""],
      discount: ["", [Validators.max(99)]],
      discountType: [""],
      discountExpiryDate: [""],
      istrialplan: [false],
      billableCustomerId: [""],
      quantity: ["1"]
    });
    this.planGroupForm.patchValue({
      quantity: 1
    });
    this.chargeGroupForm = this.fb.group({
      chargeid: ["", Validators.required],
      validity: ["", Validators.required],
      price: ["", Validators.required],
      actualprice: ["", Validators.required],
      charge_date: ["", Validators.required],
      type: ["", Validators.required],
      planid: ["", Validators.required],
      unitsOfValidity: ["", Validators.required],
      billingCycle: [""],
      discount: [""],
      id: [""]
    });

    this.macGroupForm = this.fb.group({
      macAddress: ["", Validators.required]
    });

    this.validityUnitFormArray = this.fb.array([]);
    this.plansArray = this.fb.array([]);
    this.validityUnitFormGroup = this.fb.group({
      validityUnit: [""]
    });
    this.presentGroupForm = this.fb.group({
      addressType: ["Present"],
      landmark: [""],
      areaId: [""],
      pincodeId: [""],
      cityId: [""],
      stateId: [""],
      countryId: [""],
      streetName: [""],
      houseNo: [""]
    });
    this.paymentGroupForm = this.fb.group({
      addressType: ["Payment"],
      landmark: [""],
      areaId: [""],
      pincodeId: [""],
      cityId: [""],
      stateId: [""],
      countryId: [""],
      streetName: [""],
      houseNo: [""]
    });
    this.permanentGroupForm = this.fb.group({
      addressType: ["Permanent"],
      landmark: [""],
      areaId: [""],
      pincodeId: [""],
      cityId: [""],
      stateId: [""],
      countryId: [""],
      streetName: [""],
      houseNo: [""]
    });

    this.assignCustomerCAFForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.rejectCustomerCAFForm = this.fb.group({
      remark: ["", Validators.required]
    });

    this.paymentFormGroup = this.fb.group({
      amount: ["", [Validators.required, Validators.pattern(Regex.decimalNumber)]],
      bank: [""],
      branch: [""],
      chequedate: ["", Validators.required],
      chequeno: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      customerid: [""],
      paymentdate: ["", Validators.required],
      paymentreferenceno: [""],
      paymode: ["", Validators.required],
      referenceno: ["", Validators.required],
      remark: ["", Validators.required],
      invoiceId: ["", Validators.required],
      bankManagement: ["", Validators.required],
      type: ["Payment"],
      paytype: [""]
    });

    this.assignLeadStaffForm = this.fb.group({
      remark: ["", Validators.required],
      staffId: ["", Validators.required]
    });

    this.paymentFormGroup.controls.branch.disable();
    this.paymentFormGroup.controls.chequedate.disable();
    this.paymentFormGroup.controls.bank.disable();
    this.paymentFormGroup.controls.bankManagement.disable();
    this.paymentFormGroup.controls.chequeno.disable();
    this.paymentFormGroup.controls.paymentreferenceno.disable();
    this.customerGroupForm.controls.leadCustomerSubSector.disable();
    this.customerGroupForm.controls.leadCustomerSubType.disable();

    this.searchInvoiceMasterFormGroup = this.fb.group({
      billfromdate: [""],
      billrunid: [""],
      billtodate: [""],
      custMobile: ["", Validators.minLength(3)],
      custname: [""],
      docnumber: [""],
      customerid: [""]
    });
    //dropdown
    this.commondropdownService.getplanservice();
    // this.commondropdownService.getAllPinCodeNumber();
    this.commondropdownService.getAllPinCodeData();
    // this.commondropdownService.getALLArea();
    this.commondropdownService.getCommonListTitleData();
    this.commondropdownService.getCommonListPaymentData();
    this.commondropdownService.getIppoolData();
    this.getPostpaidplanData();

    this.commondropdownService.getCountryList();
    this.commondropdownService.getStateList();
    this.commondropdownService.getCityList();
    this.commondropdownService.getChargeForCustomer();
    this.commondropdownService.getsystemconfigList();
    this.commondropdownService.getchargeAll();
    let currency;
    this.systemService.getConfigurationByName("CURRENCY_FOR_PAYMENT").subscribe((res: any) => {
      currency = res.data.value;
      this.commondropdownService.getChargeTypeByList("", currency);
    });
    this.commondropdownService.getCustomerStatus();
    this.commondropdownService.findAllplanGroups();
    this.commondropdownService.getBillToData();
    this.commondropdownService.getValleyTypee();
    this.commondropdownService.getInsideValley();
    this.commondropdownService.getOutsideValley();
    this.commondropdownService.getPopDataFromSalesCrms();
    this.commondropdownService.getBranchesFromSalesCRMS();
    this.commondropdownService.getAllReseller();
    this.commondropdownService.getAllActiveStaff();
    this.commondropdownService.getBUFromStaff();
    this.commondropdownService.getCustomer();
    this.getCustomerType();
    this.getCustomerSector();

    this.getAllBranchData();
    this.getPreviousVendors();
    this.getLeadSourceList();
    this.getFeasibilityList();
    this.getServiceTypeList();
    this.getLeadTypeList();

    this.getBankDetail();
    const serviceArea = JSON.parse(localStorage.getItem("serviceArea"));
    if (serviceArea.length > 0) {
      this.commondropdownService.filterserviceAreaList();
      // this.commondropdownService.filterPartnerAll();
    } else {
      this.commondropdownService.getserviceAreaList();
      // this.commondropdownService.getpartnerAll();
    }
    this.getpartnerAll();

    this.productService.getAllActiveProduct().subscribe((res: any) => {
      this.products = res.dataList;
    });

    this.inventoryAssignForm.get("qty").valueChanges.subscribe(val => {
      let total = this.availableQty - val;
      if (total < 0) {
        this.showQtyError = true;
      } else {
        this.showQtyError = false;
      }

      if (this.productHasMac == true && this.selectedMACAddress?.length > val) {
        this.showQtySelectionError = true;
      } else {
        this.showQtySelectionError = false;
      }
    });

    this.planCreationType();
    //customer get data
    this.billingSequence();
    // this.getChargeType();
    setTimeout(() => {
      this.selCustType();
    }, 3000);

    this.searchData = {
      filterBy: "",
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
      pageSize: "",
      sortOrder: ""
    };

    // this.customerStatusDetail = [
    //   {
    //     teamName: 'Opration',
    //     status: 'approved',
    //   },
    //   {
    //     teamName: 'Qa',
    //     status: 'approved',
    //   },
    //   {
    //     teamName: 'Payment',
    //     status: 'approved',
    //   },
    //   {
    //     teamName: 'Customer Care',
    //     status: 'inprogress',
    //   },
    //   {
    //     teamName: 'Parent Team',
    //     status: 'pending',
    //   },
    // ]

    if (this.Activatedroute.snapshot.queryParamMap.get("id")) {
      this.ifcutomerToLeadRedirectService = true;
      this.redirectCustomerId = this.Activatedroute.snapshot.queryParamMap.get("id");
      this.createLead();
      // this.searchinvoiceMaster(this.Activatedroute.snapshot.queryParamMap.get("id"), "");
    }
  }

  billingSequence() {
    for (let i = 0; i < 12; i++) {
      this.billingCycle.push({ label: i + 1 });
      // console.log(this.billingCycle)
    }
  }

  getpartnerAll() {
    const url = "/partner/all";
    this.partnerService.getMethodNew(url).subscribe(
      (response: any) => {
        this.partnerList = response.partnerlist.filter(item => item.id != 1);
      },
      (error: any) => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: error.error.ERROR,
        //   icon: 'far fa-times-circle',
        // })
      }
    );
  }

  getBankDetail() {
    const url = "/bankManagement/searchByStatus?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.bankDataList = response.dataList;
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

  getPostpaidplanData() {
    const url = `/postpaidplan/all?mvnoId=${localStorage.getItem("mvnoId")}`;
    this.commondropdownService.getMethod(url).subscribe((response: any) => {
      this.postpaidplanData = response.postpaidplanList;
    });
  }

  getStaff(leadId) {
    const url = `/teamHierarchy/reassignLead?leadMasterId=${leadId}`;
    this.leadManagementService.getConnection(url).subscribe(
      (response: any) => {
        this.assignableStaffList = response.dataList;
        if (response.dataList == null) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "No staff available to assign..",
            icon: "far fa-times-circle"
          });
        } else {
          this.assignLeadModal = true;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
        //
      }
    );
  }

  getLoggedinUserData() {
    let staffId = localStorage.getItem("userId");
    this.staffUserId = localStorage.getItem("userId");
    this.loggedInUser = localStorage.getItem("loggedInUser");
    this.staffService.getById(staffId).subscribe(
      (response: any) => {
        this.staffUser = response.Staff;
        this.userName = this.staffUser.username;
        //  this.customerGroupForm.value.username = this.staffUser.username;

        // console.log("username", this.staffUser.username);
        // if (["Admin"].some(role => this.staffUser.roleName.includes(role))) {
        //   this.isAdmin = true;
        // } else {
        //   // this.customerGroupForm.get('serviceAreaId').setValue(response.Staff.servicearea.id);
        //   this.isAdmin = false;
        // }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  createLead() {
    if (!this.createAccess) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Sorry you have not privilege to create opration!.",
        icon: "far fa-times-circle"
      });
      return;
    }
    this.generateLeadNo();
    this.customerGroupForm.controls["feasibilityRemark"].clearValidators();
    this.customerGroupForm.controls["feasibilityRemark"].updateValueAndValidity();
    this.myFinalCheck = false;
    this.ifReadonlyExtingInput = false;
    this.isSpecificLeadOpen = false;
    this.openAuditTrailScreen = false;
    this.openLeadStatusScreen = false;
    this.openLeadNotesScreen = false;
    this.isServiceManagementOpen = false;
    this.openFollowUpSchedulling = false;
    this.listView = false;
    this.createView = true;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isLeadDetailOpen = false;
    this.isQuotationDetailOpen = false;
    this.submitted = false;
    this.plansubmitted = false;
    this.isLeadEdit = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.iflocationFill = false;
    this.ifMyInvoice = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.customerUpdateDiscount = false;
    this.ifcustomerDiscountField = false;
    this.payMappingListFromArray.controls = [];
    this.overChargeListFromArray.controls = [];
    this.custMacMapppingListFromArray.controls = [];
    this.activeCustomers = [];
    this.activeCustByUsername = [];
    this.ifIndividualPlan = false;
    this.ifPlanGroup = false;
    this.planCategoryForm.reset();
    this.leadFormReset();
    this.planGroupForm.controls.service.enable();
    this.planGroupForm.controls.planId.enable();
    this.planGroupForm.controls.validity.enable();
    this.customerGroupForm.controls.username.enable();
    this.customerGroupForm.controls["invoiceType"].clearValidators();
    this.customerGroupForm.controls["invoiceType"].updateValueAndValidity();
    this.customerGroupForm.controls.invoiceType.disable();
    this.customerGroupForm.controls.leadCustomerSubSector.disable();
    this.customerGroupForm.controls.leadCustomerSubType.disable();
    this.serviceAreaDisable = false;
    this.viewLeadListData = [];
    this.addressListData = [];

    this.serviceareaCheck = true;
    this.selCustType();
    // if (!this.isAdmin) {
    //   this.customerGroupForm.patchValue({
    //     serviceareaid: this.staffUser?.serviceAreaId,
    //   });
    // }
    this.customerrMyInventoryView = false;
    this.FinalAmountList = [];
    this.ifplanisSubisuSelect = false;
    this.discountValue = "";
    // this.planDataForm.controls["offerPrice"].reset();
    this.planDataForm.controls["offerPrice"].disable();
    this.customerGroupForm.controls.presentCheckForPayment.setValue(false);
    this.customerGroupForm.controls.presentCheckForPermanent.setValue(false);
    this.presentCheckForPayment = false;
    this.presentCheckForPermanent = false;

    this.planGroupForm.patchValue({
      quantity: 1
    });

    this.customerGroupForm.controls.calendarType.setValue("English");
    this.customerGroupForm.patchValue({
      countryCode: this.commondropdownService.commonCountryCode,
      durationUnits: "Days",
      custtype: "Prepaid",
      leadCategory: "New Lead",
      nation: 1,
      custlabel: "organization"
    });
    if (this.ifcutomerToLeadRedirectService) {
      this.ifReadonlyExtingInput = true;
      this.customerGroupForm.patchValue({
        leadCategory: "Existing Customer",
        invoiceType: "Group",
        parentCustomerId: Number(this.redirectCustomerId),
        parentExperience: "Single",
        custlabel: "customer",
        nation: 1
      });
      this.SelExtingCustomer(this.redirectCustomerId);
    }
  }
  backLeadDeatils(e) {
    this.isQuotationDetailOpen = false;
    this.isServiceManagementOpen = false;
    this.leadDetailOpen(e);
  }
  viewLead() {
    this.router.navigate(["/home/enterprise-lead"]);
    this.ifcutomerToLeadRedirectService = false;

    this.myFinalCheck = false;
    this.isSpecificLeadOpen = false;
    this.isLeadDetailOpen = false;
    this.listView = true;
    this.isLeadEdit = false;
    this.createView = false;
    this.listSearchView = false;
    this.planCategoryForm.reset();
    this.selectchargeValueShow = false;
    this.ifMyInvoice = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.openAuditTrailScreen = false;
    this.openLeadStatusScreen = false;
    this.openFollowUpSchedulling = false;
    this.openLeadNotesScreen = false;
    this.isServiceManagementOpen = false;
    this.isQuotationDetailOpen = false;
    this.selectAreaList = false;
    this.customerUpdateDiscount = false;
    this.submitted = false;
    this.plansubmitted = false;
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector(".ng-invalid[formControlName]");
    this.scrollTo(firstElementWithError);
  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  leadFormReset() {
    this.customerGroupForm.reset();
    this.presentGroupForm.reset();
    this.paymentGroupForm.reset();
    this.permanentGroupForm.reset();
    this.chargeGroupForm.reset();
    this.planGroupForm.reset();
    this.macGroupForm.reset();
    this.validityUnitFormGroup.reset();
    this.validityUnitFormGroup.controls.validityUnit.setValue("");
    this.planGroupForm.controls.planId.setValue("");
    this.planGroupForm.controls.service.setValue("");
    this.planGroupForm.controls.validity.setValue("");
    this.customerGroupForm.controls.pan.setValue("");
    this.customerGroupForm.controls.gst.setValue("");
    this.customerGroupForm.controls.failcount.setValue("");
    this.customerGroupForm.controls.aadhar.setValue("");
    this.customerGroupForm.controls.passportNo.setValue("");
    this.customerGroupForm.controls.voicesrvtype.setValue("");
    this.customerGroupForm.controls.didno.setValue("");
    this.customerGroupForm.controls.salesremark.setValue("");
    this.customerGroupForm.controls.servicetype.setValue("");
    this.customerGroupForm.controls.partnerid.setValue(this.partnerId !== 1 ? this.partnerId : "");
    this.customerGroupForm.controls.billday.setValue("");
    this.customerGroupForm.controls.phone.setValue("");
    this.customerGroupForm.controls.mobile.setValue("");
    this.customerGroupForm.controls.billTo.setValue("CUSTOMER");
    this.customerGroupForm.controls.countryCode.setValue("");
    this.customerGroupForm.controls.calendarType.setValue("");
    this.customerGroupForm.controls.isInvoiceToOrg.setValue(false);
    this.customerGroupForm.controls.status.setValue("");
    this.customerGroupForm.controls.serviceareaid.setValue("");
    this.customerGroupForm.controls.title.setValue("");

    this.chargeGroupForm.controls.chargeid.setValue("");
    this.chargeGroupForm.controls.charge_date.setValue("");
    this.chargeGroupForm.controls.planid.setValue("");
    this.chargeGroupForm.controls.type.setValue("");

    this.presentGroupForm.controls.areaId.setValue("");
    this.presentGroupForm.controls.pincodeId.setValue("");
    this.presentGroupForm.controls.cityId.setValue("");
    this.presentGroupForm.controls.stateId.setValue("");
    this.presentGroupForm.controls.countryId.setValue("");
    this.presentGroupForm.controls.streetName.setValue("");
    this.presentGroupForm.controls.houseNo.setValue("");

    this.paymentGroupForm.controls.areaId.setValue("");
    this.paymentGroupForm.controls.pincodeId.setValue("");
    this.paymentGroupForm.controls.cityId.setValue("");
    this.paymentGroupForm.controls.stateId.setValue("");
    this.paymentGroupForm.controls.countryId.setValue("");
    this.paymentGroupForm.controls.streetName.setValue("");
    this.paymentGroupForm.controls.houseNo.setValue("");

    this.permanentGroupForm.controls.areaId.setValue("");
    this.permanentGroupForm.controls.pincodeId.setValue("");
    this.permanentGroupForm.controls.cityId.setValue("");
    this.permanentGroupForm.controls.stateId.setValue("");
    this.permanentGroupForm.controls.countryId.setValue("");
    this.permanentGroupForm.controls.streetName.setValue("");
    this.permanentGroupForm.controls.houseNo.setValue("");

    this.customerGroupForm.controls.istrialplan.setValue(false);
    this.planGroupForm.controls.istrialplan.setValue(false);

    this.customerGroupForm.controls.custlabel.setValue("organization");
    this.discountValue = "";
  }

  selCustType() {
    const custType = "Prepaid";
    let obj: any = [];
    this.filterPlanData = [];
    if (this.postpaidplanData?.length != 0) {
      obj = this.postpaidplanData.filter(key => key.plantype === custType);
    }
    this.filterPlanData = obj;
    if (this.planGroupForm.value) {
      this.planGroupForm.reset();
      this.plantypaSelectData = [];
    }
  }

  getLeadSourceList() {
    const url = "/leadSource/list";
    this.searchkey = "";
    let leaddata = [];

    this.leadSourceMasterService.getMethod(url).subscribe(async (response: any) => {
      if (response.status == 200) {
        leaddata = response.leadSourceList;
        leaddata.forEach((item: any) => {
          if (item.status === "Active") {
            this.leadSourceArr.push(item);
          }
        });
      } else {
        this.leadSourceArr = [];
        this.leadSubSourceArr = [];
      }
    });
  }

  // leadSourceViewFlag: any = [];
  myViewFlag: boolean = false;
  leadSourceTitle: any;
  customerArr: any = [];
  partnerArr: any = [];
  branchArr: any = [];
  serviceAreaArr: any = [];
  agentArr: any = [];

  selectLeadSource(leadSourceId: any) {
    this.leadSubSourceArr = [];
    this.myViewFlag = false;
    for (let i = 0; i < this.leadSourceArr?.length; i++) {
      if (this.leadSourceArr[i].id === leadSourceId) {
        this.leadSourceTitle = this.leadSourceArr[i].leadSourceName;
      }
    }
    if (this.leadSourceTitle === "Customer") {
      this.myViewFlag = false;
      this.commondropdownService.getCustomersFromSalesCRMS();

      return;
    }

    if (this.leadSourceTitle === "Partner") {
      this.myViewFlag = false;
      this.commondropdownService.getPartnersFromSalesCRMS();

      return;
    }

    if (this.leadSourceTitle === "Staff") {
      this.myViewFlag = false;
      this.commondropdownService.getStaffsFromSalesCRMS();

      return;
    }

    if (this.leadSourceTitle === "Outlet/ SA") {
      this.myViewFlag = false;
      this.commondropdownService.getServiceAreasFromSalesCRMS();

      return;
    }

    if (this.leadSourceTitle === "Branch") {
      this.myViewFlag = false;
      this.commondropdownService.getBranchesFromSalesCRMS();
      return;
    }

    if (this.leadSourceArr?.length > 0) {
      for (let i = 0; i < this.leadSourceArr?.length; i++) {
        if (!this.leadSourceArr[i].view) {
          if (this.leadSourceArr[i].leadSubSourceDtoList?.length > 0) {
            for (let j = 0; j < this.leadSourceArr[i].leadSubSourceDtoList?.length; j++) {
              if (this.leadSourceArr[i].leadSubSourceDtoList[j].leadSourceId === leadSourceId) {
                this.leadSubSourceArr.push(this.leadSourceArr[i].leadSubSourceDtoList[j]);
                this.myViewFlag = true;
              }
            }
          }
        }
      }
    }

    if (this.leadSubSourceArr?.length === 0) {
      this.myViewFlag = true;
    }
  }

  modalOpenParentCustomer(type) {
    this.selectParentCustomer = true;
    this.newFirst = 0;
    this.parentCustomerDialogType = type;
    this.getParentCustomerData();
    this.selectedParentCust = [];
  }

  removeSelParentCust(type) {
    this.selectedParentCust = [];
    if (type === "billable") {
      this.billableCusList = [];
      this.customerGroupForm.patchValue({
        billableCustomerId: null
      });
    } else {
      this.customerGroupForm.patchValue({
        parentCustomerId: ""
      });
      this.customerGroupForm.controls.invoiceType.setValue("");
      this.customerGroupForm.controls.invoiceType.disable();

      this.customerGroupForm.controls.serviceareaid.setValue("");
      this.serviceAreaDisable = false;
      this.parentCustList = [];
    }
  }

  getParentCustomerData() {
    var currentPage;
    currentPage = this.currentPageParentCustomerListdata;

    let data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    const url =
      "/parentCustomers/list/" +
      RadiusConstants.CUSTOMER_TYPE.PREPAID +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.prepaidParentCustomerList = response.parentCustomerList;
        // const list = this.prepaidParentCustomerList;
        // const filterList = list.filter(cust => cust.id !== this.editLeadId);

        // this.prepaidParentCustomerList = filterList;
        // console.log("list", filterList);

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

  async saveSelCustomer() {
    if (this.parentCustomerDialogType === "billable") {
      this.billableCusList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.customerGroupForm.patchValue({
        billableCustomerId: this.selectedParentCust.id
      });
    } else {
      this.parentCustList = [
        {
          id: this.selectedParentCust.id,
          name: this.selectedParentCust.name
        }
      ];
      this.customerGroupForm.patchValue({
        parentCustomerId: this.selectedParentCust.id
      });
      if (this.selectedParentCust.id) {
        const url = "/customers/" + this.selectedParentCust.id;
        var parentCustServiceAreaId: any;

        await this.customerManagementService.getMethod(url).subscribe((response: any) => {
          parentCustServiceAreaId = response.customers.serviceareaid;
        });
        setTimeout(() => {
          this.customerGroupForm.controls["serviceareaid"].setValue(parentCustServiceAreaId);
          if (parentCustServiceAreaId) {
            this.selServiceAreaByParent(parentCustServiceAreaId);
            this.serviceAreaDisable = false;
          }
        }, 5000);
      }
      this.customerGroupForm.controls.invoiceType.enable();
      this.customerGroupForm.controls["invoiceType"].setValidators(Validators.required);
      this.customerGroupForm.controls["invoiceType"].updateValueAndValidity();
    }

    this.modalCloseParentCustomer();
  }

  serviceAreabaseData(id) {
    this.selServiceAreaByParent(id);
    this.getBranchByServiceAreaID(id);
    this.getServiceByServiceAreaID(id);
  }
  selServiceAreaByParent(id) {
    const serviceAreaId = id;
    this.pincodeDD = [];
    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.serviceareaCheck = false;
          this.serviceAreaData = response.data;
          this.serviceAreaData.pincodes.forEach(element => {
            this.commondropdownService.allpincodeNumber.forEach(e => {
              if (e.pincodeid == element) {
                this.pincodeDD.push(e);
              }
            });
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
  }

  getAreaData(id: any, index: any) {
    const url = "/area/" + id;

    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      if (index === "present") {
        this.areaDetails = response.data;

        this.selectPincodeList = true;

        this.presentGroupForm.patchValue({
          addressType: "Present",
          areaId: Number(this.areaDetails.id),
          pincodeId: Number(this.areaDetails.pincodeId),
          cityId: Number(this.areaDetails.cityId),
          stateId: Number(this.areaDetails.stateId),
          countryId: Number(this.areaDetails.countryId)
        });
      }
      if (index === "payment") {
        this.paymentareaDetails = response.data;

        this.selectPincodeListPayment = true;

        this.paymentGroupForm.patchValue({
          addressType: "Payment",
          pincodeId: Number(this.paymentareaDetails.pincodeId),
          cityId: Number(this.paymentareaDetails.cityId),
          stateId: Number(this.paymentareaDetails.stateId),
          countryId: Number(this.paymentareaDetails.countryId)
        });
      }
      if (index === "permanent") {
        this.permanentareaDetails = response.data;

        this.selectPincodeListPermanent = true;
        this.permanentGroupForm.patchValue({
          addressType: "Permanent",
          pincodeId: Number(this.permanentareaDetails.pincodeId),
          cityId: Number(this.permanentareaDetails.cityId),
          stateId: Number(this.permanentareaDetails.stateId),
          countryId: Number(this.permanentareaDetails.countryId)
        });
      }
    });
  }

  modalCloseParentCustomer() {
    this.selectParentCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  mylocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          this.iflocationFill = true;
          this.customerGroupForm.patchValue({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Geolocation is not supported by this browser.",
        icon: "far fa-times-circle"
      });
    }
  }

  openSearchModel() {
    this.ifsearchLocationModal = true;
    this.currentPagesearchLocationList = 1;
  }

  pincodeDD: any = [];

  selServiceArea(event) {
    this.pincodeDD = [];
    const serviceAreaId = event.value;
    if (serviceAreaId) {
      const url = "/serviceArea/" + serviceAreaId;
      this.adoptCommonBaseService.get(url).subscribe(
        (response: any) => {
          this.serviceareaCheck = false;
          this.serviceAreaData = response.data;

          //this.presentGroupForm.reset();
          this.serviceAreaData.pincodes.forEach(element => {
            this.commondropdownService.allpincodeNumber.forEach(e => {
              if (e.pincodeid == element) {
                this.pincodeDD.push(e);
              }
            });
            // this.pincodeDD.push(this.commondropdownService.allpincodeNumber.filter((e)=>e.pincodeid==element))
          });

          // if (this.serviceAreaData.areaid !== null)
          //   this.getAreaData(this.serviceAreaData.areaid, "present");
        },
        (error: any) => {}
      );

      this.getServiceByServiceAreaID(serviceAreaId);
      this.getBranchByServiceAreaID(serviceAreaId);
      this.selServiceAreaByParent(serviceAreaId);
    }
  }

  getBranchByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let url =
      "/branchManagement/getAllBranchesByServiceAreaId?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.branchData = response.dataList;
      if (this.branchData != null && this.branchData.length > 0) {
        this.isBranchAvailable = true;
        this.customerGroupForm.controls.branchId.setValidators(Validators.required);
        this.customerGroupForm.controls.partnerid.clearValidators();
        this.customerGroupForm.updateValueAndValidity();
      } else {
        this.isBranchAvailable = false;
        this.customerGroupForm.controls.partnerid.setValidators(Validators.required);
        this.customerGroupForm.controls.branchId.clearValidators();
        this.customerGroupForm.updateValueAndValidity();
      }
    });
  }

  getServiceByServiceAreaID(ids) {
    let data = [];
    data.push(ids);
    let url =
      "/serviceArea/getAllServicesByServiceAreaId" +
      "?mvnoId=" +
      Number(localStorage.getItem("mvnoId"));
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.serviceData = response.dataList;
    });
  }

  AreaListDD: any = [];

  selectPINCODEChange(_event: any, index: any) {
    const url = "/area/pincode?pincodeId=" + _event.value;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.AreaListDD = response.areaList;
      },
      (error: any) => {}
    );
    // this.getpincodeData(_event.value, index);
  }

  getpincodeData(id: any, index: any) {
    const url = "/pincode/" + id;

    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      if (index === "present") {
        this.areaAvailableList = [];
        this.areaDetails = [];
        this.presentGroupForm.patchValue({
          cityId: "",
          stateId: "",
          countryId: ""
        });
        this.selectAreaList = true;
        this.selectPincodeList = false;
        this.pincodeDeatils = response.data;
        if (response.data.areaList?.length !== 0) {
          this.areaAvailableList = response.data.areaList;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Area detals are not available, please select correct pincode. "
          });
        }
      }
      if (index === "payment") {
        this.paymentareaAvailableList = [];
        this.paymentGroupForm.patchValue({
          cityId: "",
          stateId: "",
          countryId: ""
        });
        this.selectAreaListPayment = true;
        this.selectPincodeListPayment = false;
        this.PyamentpincodeDeatils = response.data;
        if (response.data.areaList?.length !== 0) {
          this.paymentareaAvailableList = response.data.areaList;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Area detals are not available, please select correct pincode. "
          });
        }
      }
      if (index === "permanent") {
        this.permanentareaAvailableList = [];
        this.permanentGroupForm.patchValue({
          cityId: "",
          stateId: "",
          countryId: ""
        });
        this.selectAreaListPermanent = true;
        this.selectPincodeListPermanent = false;
        this.permanentpincodeDeatils = response.data;
        if (response.data.areaList?.length !== 0) {
          this.permanentareaAvailableList = response.data.areaList;
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Area detals are not available, please select correct pincode. "
          });
        }
      }
    });
  }

  selectAreaChange(event: any, index: any) {
    this.getAreaData(event.value, index);
  }

  samepresentAddress(event, data) {
    if (event.target.checked == true) {
      if ("payment" == data) {
        this.getTempPincodeData(this.presentGroupForm.value.pincodeId, "payment");
        this.getAreaData(this.presentGroupForm.value.areaId, "payment");
        this.paymentGroupForm = this.fb.group({
          addressType: ["Payment"],
          landmark: [this.presentGroupForm.value.landmark],
          areaId: [this.presentGroupForm.value.areaId],
          pincodeId: [this.presentGroupForm.value.pincodeId],
          cityId: [this.presentGroupForm.value.cityId],
          stateId: [this.presentGroupForm.value.stateId],
          countryId: [this.presentGroupForm.value.countryId],
          streetName: [this.presentGroupForm.value.streetName],
          houseNo: [this.presentGroupForm.value.houseNo]
        });
        this.customerGroupForm.controls.presentCheckForPayment.setValue(true);
      }
      if ("permanet" == data) {
        this.getTempPincodeData(this.presentGroupForm.value.pincodeId, "permanent");
        this.getAreaData(this.presentGroupForm.value.areaId, "permanent");
        this.permanentGroupForm = this.fb.group({
          addressType: ["Permanent"],
          landmark: [this.presentGroupForm.value.landmark],
          areaId: [this.presentGroupForm.value.areaId],
          pincodeId: [this.presentGroupForm.value.pincodeId],
          cityId: [this.presentGroupForm.value.cityId],
          stateId: [this.presentGroupForm.value.stateId],
          countryId: [this.presentGroupForm.value.countryId],
          streetName: [this.presentGroupForm.value.streetName],
          houseNo: [this.presentGroupForm.value.houseNo]
        });
        this.customerGroupForm.controls.presentCheckForPermanent.setValue(true);
      }
    }

    if (event.target.checked == false) {
      if ("payment" == data) {
        this.paymentGroupForm.reset();
        this.customerGroupForm.controls.presentCheckForPayment.setValue(false);
      }
      if ("permanet" == data) {
        this.permanentGroupForm.reset();
        this.customerGroupForm.controls.presentCheckForPermanent.setValue(false);
      }
    }
  }

  getTempPincodeData(id: any, index: any) {
    const url = "/pincode/" + id;

    this.adoptCommonBaseService.get(url).subscribe((response: any) => {
      if (index === "present") {
        this.pincodeDeatils = response.data;
        if (response.data.areaList?.length !== 0) {
          this.areaAvailableList = response.data.areaList;
        }
      }
      if (index === "payment") {
        this.PyamentpincodeDeatils = response.data;
        if (response.data.areaList?.length !== 0) {
          this.paymentareaAvailableList = response.data.areaList;
        }
      }
      if (index === "permanent") {
        this.permanentpincodeDeatils = response.data;
        if (response.data.areaList?.length !== 0) {
          this.permanentareaAvailableList = response.data.areaList;
        }
      }
    });
  }

  filterNormalPlanGroup = [];

  planSelectType(event) {
    this.planDropdownInChageData = [];
    let planaddDetailType = event.value;

    this.ifplanisSubisuSelect = false;
    this.DiscountValueStore = [];
    this.discountValue = "";
    this.planTotalOffetPrice = 0;
    this.planDataForm.reset();
    if (planaddDetailType == "individual") {
      this.ifIndividualPlan = true;
      this.ifPlanGroup = false;
      this.customerGroupForm.patchValue({
        plangroupid: ""
      });
      // this.payMappingListFromArray.controls = [];
    } else if (planaddDetailType == "groupPlan") {
      if (this.serviceAreaData) {
        this.filterNormalPlanGroup = [];
        if (
          this.commondropdownService.PrepaidPlanGroupDetails &&
          this.commondropdownService.PrepaidPlanGroupDetails.length > 0
        ) {
          this.commondropdownService.PrepaidPlanGroupDetails.forEach(element => {
            if (element.planMode == "NORMAL") {
              this.filterNormalPlanGroup.push(element);
            }
          });
        }

        let data1;
        let data2;
        if (this.filterNormalPlanGroup && this.filterNormalPlanGroup.length > 0) {
          data1 = this.filterNormalPlanGroup.filter(
            plan => plan.servicearea.id == this.serviceAreaData.id
          );
          data2 = this.filterNormalPlanGroup.filter(plan =>
            plan.servicearea.filter(e => e == this.serviceAreaData.id)
          );
        }
        if (data1 && data1) {
          this.filterNormalPlanGroup = [...data1, ...data2];
        }
      }
      this.ifIndividualPlan = false;
      this.ifPlanGroup = true;
      this.customerGroupForm.patchValue({
        plangroupid: ""
      });
    } else {
      this.ifIndividualPlan = false;
      this.ifPlanGroup = false;
    }
  }

  planGroupSelectedSubisu: any;
  planListSubisu: any;
  newPrice: any;
  isInvoiceToOrg: any = false;

  planGroupSelectSubisu(e) {
    if (e.value) {
      let url =
        "/findPlanGroupById?planGroupId=" + e.value + "&mvnoId=" + localStorage.getItem("mvnoId");
      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          const planDetailData = response.planGroup;
          if (response.planGroup.allowdiscount == true) {
            this.ifcustomerDiscountField = true;
          } else {
            this.ifcustomerDiscountField = false;
          }
          if (planDetailData.category == "Business Promotion") {
            this.ifplanisSubisuSelect = true;
            this.customerGroupForm.patchValue({
              billTo: "ORGANIZATION",
              isInvoiceToOrg: planDetailData.invoiceToOrg
            });

            // $('#selectPlanGroup').modal('show')
            this.planGroupSelectedSubisu = e.value;
            this.getPlanListByGroupIdSubisu();
          } else if (
            this.customerGroupForm.value.billTo == "ORGANIZATION" &&
            planDetailData.category == "Normal" &&
            this.ifplanisSubisuSelect == false
          ) {
            this.ifplanisSubisuSelect = false;
            this.customerGroupForm.patchValue({
              billTo: "ORGANIZATION"
            });
            this.selectPlanGroup = true;
            this.planGroupSelectedSubisu = e.value;
            this.getPlanListByGroupIdSubisu();
          } else {
            this.ifplanisSubisuSelect = false;
            this.customerGroupForm.patchValue({
              billTo: "CUSTOMER"
            });

            let newAmount = 0;
            let totalAmount = 0;
            planDetailData.planMappingList.forEach((element, i) => {
              let n = i + 1;
              newAmount = element.plan.newOfferPrice
                ? element.plan.newOfferPrice
                : element.plan.offerprice;
              totalAmount = Number(totalAmount) + Number(newAmount);
              if (planDetailData.planMappingList.length == n) {
                this.planDataForm.patchValue({
                  offerPrice: totalAmount
                });
              }
            });
          }
        },
        (error: any) => {}
      );
    }
    this.getPlangroupByPlan(e.value);
    this.planGroupDataById(e.value);
  }

  planGroupDataById(planGroupId) {
    let url =
      "/findPlanGroupById?planGroupId=" + planGroupId + "&mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.planGroupMapingList = response.planGroup.planMappingList;
    });
  }
  getPlanListByGroupIdSubisu() {
    this.planTotalOffetPrice = 0;
    this.planListSubisu = [];
    this.plansArray.reset();
    this.plansArray = this.fb.array([]);

    const url = `/plansByPlanGroupId?planGroupId=` + this.planGroupSelectedSubisu;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.planListSubisu = response.planList;
        this.planListSubisu.forEach((element, i) => {
          let newAmount = element.newOfferPrice ? element.newOfferPrice : element.offerprice;
          this.plansArray.push(
            this.fb.group({
              planId: element.id,
              name: element.displayName,
              service: element.serviceId,
              validity: element.validity,
              discount: element.discount,
              billTo: "ORGANIZATION",
              billableCustomerId: element.billableCustomerId,
              offerPrice: element.offerprice,
              newAmount: element.newOfferPrice ? element.newOfferPrice : element.offerprice,
              chargeName: element.chargeList[0].charge.name,
              isInvoiceToOrg: this.customerGroupForm.value.isInvoiceToOrg
            })
          );
          this.planTotalOffetPrice = this.planTotalOffetPrice + Number(newAmount);
        });

        this.planDataForm.patchValue({
          offerPrice: this.planTotalOffetPrice
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

  getPlangroupByPlan(planGroupId) {
    this.planDropdownInChageData = [];
    let MappURL = "/findPlanGroupMappingByPlanGroupId?planGroupId=" + planGroupId;
    this.customerManagementService.getMethod(MappURL).subscribe((response: any) => {
      let attributeList = response.planGroupMappingList;
      attributeList.forEach(element => {
        this.planDropdownInChageData.push(element.plan);
      });

      if (this.ifPlanGroup && (this.isLeadEdit || this.specificExistingCust)) {
        let newAmount = 0;
        let totalAmount = 0;
        attributeList.forEach((element, i) => {
          let n = i + 1;
          newAmount = element.plan.newOfferPrice
            ? element.plan.newOfferPrice
            : element.plan.offerprice;
          totalAmount = Number(totalAmount) + Number(newAmount);
          if (attributeList.length == n) {
            this.planDataForm.patchValue({
              offerPrice: totalAmount
            });

            let price = Number(this.planDataForm.controls["offerPrice"].value);
            let discount = Number(this.customerGroupForm.controls["discount"].value);
            let DiscountV = (price * discount) / 100;
            let discountValueNUmber = DiscountV.toFixed(3);
            this.discountValue = Number(discountValueNUmber);
            let discountfV =
              Number(this.planDataForm.controls["offerPrice"].value) - this.discountValue;
            this.planDataForm.patchValue({
              discountPrice: discountfV
            });
            this.customerGroupForm.controls["discount"].setValue(this.discountValue);
          }
        });
      }
    });
  }

  serviceBasePlanDATA(event) {
    let planserviceData;
    let planServiceID = "";
    let servicename = event.value;
    const planserviceurl = "/planservice/all" + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(planserviceurl).subscribe((response: any) => {
      planserviceData = response.serviceList.filter(service => service.name === servicename);
      if (planserviceData?.length > 0) {
        planServiceID = planserviceData[0].id;

        this.plantypaSelectData = this.filterPlanData.filter(
          id =>
            id.serviceId === planServiceID &&
            (id.planGroup === "Registration" || id.planGroup === "Registration and Renewal")
        );
        if (this.plantypaSelectData?.length === 0) {
          this.messageService.add({
            severity: "info",
            summary: "Note ",
            detail: "Plan not available for this customer type and service "
          });
        }
      }
    });
  }

  getPlanValidity(event) {
    const planId = event.value;
    const url = "/postpaidplan/" + planId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        const planDetailData = response.postPaidPlan;
        if (response.postPaidPlan.allowdiscount == true) {
          this.ifcustomerDiscountField = true;
        }
        this.planGroupForm.patchValue({
          validity: Number(planDetailData.validity),
          offerprice: Number(planDetailData.offerprice),
          newAmount: Number(planDetailData.offerprice)
        });
        this.validityUnitFormGroup.patchValue({
          validityUnit: planDetailData.unitsOfValidity
        });

        if (planDetailData.category == "Business Promotion") {
          this.ifplanisSubisuSelect = true;
          // this.payMappingListFromArray.controls = [];
          this.customerGroupForm.patchValue({
            billTo: "ORGANIZATION",
            isInvoiceToOrg: planDetailData.invoiceToOrg
          });

          this.planGroupForm.patchValue({
            newAmount: Number(planDetailData.newOfferPrice)
          });
        } else if (
          this.customerGroupForm.value.billTo == "ORGANIZATION" &&
          planDetailData.category == "Normal" &&
          this.ifplanisSubisuSelect == false
        ) {
          // this.payMappingListFromArray.controls = [];
          this.ifplanisSubisuSelect = false;
          this.customerGroupForm.patchValue({
            billTo: "ORGANIZATION"
          });
          this.planGroupForm.patchValue({
            newAmount: Number(planDetailData.offerprice)
          });
        } else {
          this.ifplanisSubisuSelect = false;
          // this.payMappingListFromArray.controls = [];
          this.customerGroupForm.patchValue({
            billTo: "CUSTOMER"
          });
        }

        this.planGroupForm.controls.validity.disable();
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

  billtoSelectValue(e) {
    this.payMappingListFromArray.controls = [];
    this.planGroupForm.reset();
    this.customerGroupForm.patchValue({
      plangroupid: ""
    });
  }

  planTotalOffetPrice = 0;

  onplanMappingQuantityList() {
    this.plansubmitted = true;
    let quantity: any;
    let n: any;
    if (this.planGroupForm.valid) {
      if (this.planGroupForm.value.quantity == null || this.planGroupForm.value.quantity == 0) {
        this.planGroupForm.value.quantity = 1;
        quantity = this.planGroupForm.value.quantity;
        n = quantity - 1;
      } else {
        quantity = this.planGroupForm.value.quantity;
        n = quantity - 1;
      }
      for (let i = 0; i < quantity; i++) {
        this.onAddplanMappingList();
        if (n == i) {
          this.validityUnitFormGroup.reset();

          this.planGroupForm.reset();

          this.planGroupForm.controls.validity.enable();
          this.plansubmitted = false;
          this.discountType = "One-time";
          this.planGroupForm.patchValue({
            quantity: 1
          });
        }
      }
    }
  }

  onAddplanMappingList() {
    let offerP = 0;
    let disValue = 0;
    this.DiscountValueStore.push(this.discountValue);
    if (this.discountValue == 0) {
      disValue =
        Number(this.planGroupForm.value.offerprice) + Number(this.planDataForm.value.discountPrice);
    } else {
      disValue = Number(this.discountValue) + Number(this.planDataForm.value.discountPrice);
    }
    this.planDataForm.patchValue({
      discountPrice: disValue
    });

    this.planTotalOffetPrice =
      this.planTotalOffetPrice + Number(this.planGroupForm.value.offerprice);

    this.planDataForm.patchValue({
      offerPrice: this.planTotalOffetPrice
    });

    if (this.planGroupForm.value.planId) {
      this.getChargeUsePlanList(this.planGroupForm.value.planId);
    }
    this.payMappingListFromArray.push(this.planMappingListFormGroup());
    this.validityUnitFormArray.push(this.validityUnitListFormGroup());
    // this.validityUnitFormGroup.reset();

    // this.planGroupForm.reset();

    // this.planGroupForm.controls.validity.enable();
    // this.plansubmitted = false;
    // this.discountType = "One-time";
  }

  getChargeUsePlanList(id) {
    const url = "/postpaidplan/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      let data = response.postPaidPlan;
      this.planDropdownInChageData.push(data);
    });
  }

  planMappingListFormGroup(): FormGroup {
    for (const prop in this.planGroupForm.controls) {
      this.planGroupForm.value[prop] = this.planGroupForm.controls[prop].value;
    }

    return this.fb.group({
      planId: [this.planGroupForm.value.planId, Validators.required],
      service: [this.planGroupForm.value.service, Validators.required],
      validity: [this.planGroupForm.value.validity, Validators.required],
      discount: [this.planGroupForm.value.discount ? this.planGroupForm.value.discount : 0],
      billTo: [this.customerGroupForm.value.billTo],
      billableCustomerId: [this.customerGroupForm.value.billableCustomerId],
      offerPrice: [this.planGroupForm.value.offerprice],
      newAmount: [this.planGroupForm.value.newAmount],
      isInvoiceToOrg: [this.customerGroupForm.value.isInvoiceToOrg],
      istrialplan: [this.planGroupForm.value.istrialplan],
      discountType: [this.planGroupForm.value.discountType],
      discountExpiryDate: [this.planGroupForm.value.discountExpiryDate]
      // id:[]
    });
  }

  validityUnitListFormGroup(): FormGroup {
    return this.fb.group({
      validityUnit: [this.validityUnitFormGroup.value.validityUnit]
    });
  }

  deleteConfirmonChargeField(chargeFieldIndex: number, name: string) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this " + name + "?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          switch (name) {
            case "Plan":
              if (this.ifplanisSubisuSelect == true) {
                this.ifplanisSubisuSelect = false;
                this.customerGroupForm.patchValue({
                  billTo: "CUSTOMER"
                });
              }

              this.onRemovePayMapping(chargeFieldIndex);
              break;
            case "Charge":
              this.onRemoveChargelist(chargeFieldIndex);
              break;
            case "MAC":
              this.onRemoveMACaddress(chargeFieldIndex);
              break;
            // case 'uploadDocument':
            //   this.onRemoveUploadDocument(chargeFieldIndex);
            //   break;
          }
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
        }
      });

      // this.confirmationService.confirm({
      //   message: "Do you want to delete this charge?",
      //   header: "Delete Confirmation",
      //   icon: "pi pi-info-circle",
      //   accept: () => {
      //     //
      //     // console.log(name);
      //     switch (name) {
      //       case "paymapping":
      //         this.onRemovePayMapping(chargeFieldIndex);
      //         break;

      //       case "chargelist":
      //         this.onRemoveChargelist(chargeFieldIndex);
      //         break;
      //       case "MAC":
      //         this.onRemoveMACaddress(chargeFieldIndex);
      //         break;
      //     }
      //   },
      //   reject: () => {
      //     this.messageService.add({
      //       severity: "info",
      //       summary: "Rejected",
      //       detail: "You have rejected",
      //     });
      //   },
      // });
    }
  }

  async onRemovePayMapping(chargeFieldIndex: number) {
    let pOfferprice: number = 0;
    pOfferprice =
      this.planTotalOffetPrice -
      Number(this.payMappingListFromArray.value[chargeFieldIndex].offerPrice);

    this.planDataForm.patchValue({
      offerPrice: pOfferprice
    });

    if (this.payMappingListFromArray.value[chargeFieldIndex].discount) {
      let deleteOfferPrice = Number(
        this.payMappingListFromArray.value[chargeFieldIndex].offerPrice
      );
      let discount = Number(this.payMappingListFromArray.value[chargeFieldIndex].discount);
      let DiscountV = (deleteOfferPrice * discount) / 100;
      let removediscountValue = DiscountV.toFixed(3);
      let removediscountValueNUmber = Number(removediscountValue);

      let deleteDisc =
        Number(this.payMappingListFromArray.value[chargeFieldIndex].offerPrice) -
        Number(removediscountValueNUmber);

      let newDiscoun = Number(this.planDataForm.value.discountPrice) - deleteDisc;

      this.planDataForm.patchValue({
        discountPrice: Number(newDiscoun)
      });
    }

    if (pOfferprice == 0) {
      this.planTotalOffetPrice = 0;
    }

    this.payMappingListFromArray.removeAt(chargeFieldIndex);

    this.DiscountValueStore.splice(chargeFieldIndex, 1);
    if (this.payMappingListFromArray.value.length == 0) {
      this.DiscountValueStore = [];
      this.planTotalOffetPrice = 0;
      this.planDataForm.patchValue({
        discountPrice: 0,
        offerPrice: 0
      });
    }
  }

  async onRemoveChargelist(chargeFieldIndex: number) {
    this.overChargeListFromArray.removeAt(chargeFieldIndex);
  }

  async onRemoveMACaddress(chargeFieldIndex: number) {
    this.custMacMapppingListFromArray.removeAt(chargeFieldIndex);
  }

  pageChangedpayMapping(pageNumber) {
    this.currentPagePayMapping = pageNumber;
  }

  selectcharge(_event: any) {
    let chargeId = _event.value;
    let viewChargeData;
    let date;

    date = this.currentDate.toISOString();
    const format = "yyyy-MM-dd";
    const locale = "en-US";
    const myDate = date;
    const formattedDate = formatDate(myDate, format, locale);
    //
    // console.log(this.currentDate);
    const url = "/charge/" + chargeId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      viewChargeData = response.chargebyid;
      this.selectchargeValueShow = true;
      this.chargeGroupForm.patchValue({
        actualprice: Number(viewChargeData.actualprice),
        charge_date: formattedDate,
        type: "One-time"
      });
    });
  }

  selectTypecharge(e) {
    if (e.value == "Recurring") {
      this.chargeGroupForm.get("billingCycle").setValidators([Validators.required]);
      this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    } else {
      this.chargeGroupForm.value.billingCycle = 0;
      this.chargeGroupForm.get("billingCycle").clearValidators();
      this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    }
  }

  getPlanValidityForChagre(event) {
    const planId = event.value;
    // const url = "/postpaidplan/" + planId;
    // this.customerManagementService.getMethod(url).subscribe((response: any) => {
    //   const planDetailData = response.postPaidPlan;
    this.chargeGroupForm.patchValue({
      validity: Number(this.planDropdownInChageData.find(plan => plan.id == planId).validity),
      unitsOfValidity: this.planDropdownInChageData.find(plan => plan.id == planId).unitsOfValidity
    });
    let planData = this.payMappingListFromArray.value.find(element => element.planId === planId);
    if (
      planData.discountType === "Recurring" &&
      new Date(planData.discountExpiryDate) > this.dateTime &&
      planData.discount > 0
    ) {
      this.confirmationService.confirm({
        message: "Do you want to apply " + planData.discount + " % of  Discount?",
        header: "Change Discount Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.chargeGroupForm.patchValue({
            discount: planData.discount
          });
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
          this.chargeGroupForm.patchValue({
            discount: 0
          });
        }
      });
    } else if (
      planData.discountType === "Recurring" &&
      new Date(planData.discountExpiryDate) > this.dateTime &&
      planData.discount < 0
    ) {
      this.confirmationService.confirm({
        message: "Do you want to over charge customer " + planData.discount + " % ?",
        header: "Change Discount Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.chargeGroupForm.patchValue({
            discount: planData.discount
          });
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected"
          });
          this.chargeGroupForm.patchValue({
            discount: 0
          });
        }
      });
    }
    //
    // });
  }

  onAddoverChargeListField() {
    this.chargesubmitted = true;

    if (this.chargeGroupForm.valid) {
      if (this.chargeGroupForm.value.price >= this.chargeGroupForm.value.actualprice) {
        this.overChargeListFromArray.push(this.createoverChargeListFormGroup());
        this.chargeGroupForm.reset();
        this.chargesubmitted = false;
        this.selectchargeValueShow = false;
      }
    }
  }

  createoverChargeListFormGroup(): FormGroup {
    this.chargeGroupForm.get("billingCycle").clearValidators();
    this.chargeGroupForm.get("billingCycle").updateValueAndValidity();
    return this.fb.group({
      // chargeid: [''],
      type: [this.chargeGroupForm.value.type],
      chargeid: [this.chargeGroupForm.value.chargeid],
      validity: [this.chargeGroupForm.value.validity],
      price: [this.chargeGroupForm.value.price],
      actualprice: [this.chargeGroupForm.value.actualprice],
      charge_date: [this.chargeGroupForm.value.charge_date],
      planid: [this.chargeGroupForm.value.planid],
      unitsOfValidity: [this.chargeGroupForm.value.unitsOfValidity],
      billingCycle: [""],
      id: [this.chargeGroupForm.value.id],
      discount: [this.chargeGroupForm.value.discount]
    });
  }

  pageChangedOverChargeList(pageNumber) {
    this.currentPageoverChargeList = pageNumber;
  }

  onAddMACList() {
    this.macsubmitted = true;
    if (this.macGroupForm.valid) {
      this.custMacMapppingListFromArray.push(this.MACListFormGroup());
      this.macGroupForm.reset();

      this.macsubmitted = false;
    } else {
      console.log("I am not valid");
    }
  }

  MACListFormGroup(): FormGroup {
    return this.fb.group({
      macAddress: [this.macGroupForm.value.macAddress]
    });
  }

  addEditLead(id: any, custId: any) {
    this.tempLeadId = id;
    this.submitted = true;
    let i = 0;
    let j = 0;
    let K = 0;
    let a = 0;
    let b = 0;
    let c = 0;

    // if (this.payMappingListFromArray.controls?.length > 0) {
    //   this.payMappingListFromArray.controls = [];
    // }

    if (this.custMacMapppingListFromArray.controls?.length > 0) {
      this.custMacMapppingListFromArray.controls = [];
    }
    this.customerGroupForm.value.isLeadQuickInv = false;
    // this.customerGroupForm.value.partnerid=1
    if (this.customerGroupForm.valid) {
      if (id !== "") {
        if (this.presentGroupForm.value.addressType) {
          this.addressListData.push(this.presentGroupForm.value);
          // this.addressListData[0].addressType = "Present";
        }
        if (this.paymentGroupForm.value.addressType) {
          this.addressListData.push(this.paymentGroupForm.value);
          //this.addressListData[1].addressType = "Payment";
        }
        if (this.permanentGroupForm.value.addressType) {
          this.addressListData.push(this.permanentGroupForm.value);
          //this.addressListData[2].addressType = "Permanent";
        }

        if (
          this.customerGroupForm.value.countryCode == "" ||
          this.customerGroupForm.value.countryCode == null
        ) {
          this.customerGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
        }
        if (
          this.customerGroupForm.value.calendarType == "" ||
          this.customerGroupForm.value.calendarType == null
        ) {
          this.customerGroupForm.value.calendarType = "English";
        }
        // this.customerGroupForm.value.leadStatus = this.leadStatus;

        this.createLeadData = this.customerGroupForm.value;

        // if (this.createLeadData.expiry && this.createLeadData.expiry !== "") {
        //   // const format = "yyyy-MM-dd";
        //   // const locale = "en-US";
        //   // const myDate = JSON.stringify(this.createLeadData.expiry);
        //   // const formattedDate = formatDate(myDate, format, locale);

        //   // this.createLeadData.expiry = JSON.parse(formattedDate);
        //   let formatedDate = this.datePipe.transform(this.createLeadData.expiry, "yyyy-MM-dd HH:mm:ss");
        //   this.createLeadData.expiry = formatedDate;
        // } else {
        //   this.createLeadData.expiry = null;
        // }

        // if (this.createLeadData.dateOfBirth) {
        //   let myDate = this.datePipe.transform(this.createLeadData.dateOfBirth, "yyyy-MM-dd HH:mm:ss");
        //   this.createLeadData.dateOfBirth = myDate;
        // } else {
        //   this.createLeadData.dateOfBirth = null;
        // }

        let myExpiry = this.datePipe.transform(this.createLeadData.expiry, "yyyy-MM-dd");

        let myDOB = this.datePipe.transform(this.createLeadData.dateOfBirth, "yyyy-MM-dd");

        this.createLeadData.expiry = myExpiry;
        this.createLeadData.dateOfBirth = myDOB;

        this.createLeadData.competitorDuration =
          this.customerGroupForm.value.competitorDuration &&
          this.customerGroupForm.value.competitorDuration !== ""
            ? this.customerGroupForm.value.competitorDuration +
              " " +
              this.customerGroupForm.value.durationUnits
            : null;

        this.payMappingListFromArray.value
          ? (this.createLeadData.planMappingList = this.payMappingListFromArray.value)
          : "";

        this.createLeadData.planMappingList.forEach((obj: any) =>
          obj.istrialplan ? (obj.istrialplan = true) : (obj.istrialplan = false)
        );

        if (
          this.customerGroupForm.controls.partnerid.value == null ||
          this.customerGroupForm.controls.partnerid.value == ""
        ) {
          this.createLeadData.partnerid = 1;
        } else {
          this.createLeadData.partnerid =
            this.partnerId !== 1 ? this.partnerId : this.customerGroupForm.controls.partnerid.value;
        }

        this.createLeadData.addressList = this.addressListData;

        // this.createLeadData.username = this.staffUser.username;
        this.createLeadData.failcount = Number(this.createLeadData.failcount);
        // this.createLeadData.partnerid = Number(this.createLeadData.partnerid);
        if (this.createLeadData.paymentDetails) {
          this.createLeadData.paymentDetails.amount = Number(
            this.createLeadData.paymentDetails.amount
          );
        }

        while (a < this.createLeadData.addressList?.length) {
          this.createLeadData.addressList[a].areaId = Number(
            this.createLeadData.addressList[a].areaId
          );
          this.createLeadData.addressList[a].pincodeId = Number(
            this.createLeadData.addressList[a].pincodeId
          );
          this.createLeadData.addressList[a].cityId = Number(
            this.createLeadData.addressList[a].cityId
          );
          this.createLeadData.addressList[a].stateId = Number(
            this.createLeadData.addressList[a].stateId
          );
          this.createLeadData.addressList[a].countryId = Number(
            this.createLeadData.addressList[a].countryId
          );

          a++;
        }
        while (b < this.createLeadData.planMappingList?.length) {
          this.createLeadData.planMappingList[b].planId = Number(
            this.createLeadData.planMappingList[b].planId
          );
          b++;
        }

        while (c < this.createLeadData.overChargeList?.length) {
          this.createLeadData.overChargeList[c].chargeid = Number(
            this.createLeadData.overChargeList[c].chargeid
          );
          this.createLeadData.overChargeList[c].validity = Number(
            this.createLeadData.overChargeList[c].validity
          );
          this.createLeadData.overChargeList[c].price = Number(
            this.createLeadData.overChargeList[c].price
          );
          this.createLeadData.overChargeList[c].actualprice = Number(
            this.createLeadData.overChargeList[c].actualprice
          );
          c++;
        }
        // while (macIndex < this.createLeadData.custMacMapppingList?.length) {
        //   this.createLeadData.custMacMapppingList[macIndex].macAddress = this.createLeadData.custMacMapppingList[macIndex].macAddress;
        //   macIndex++
        // }

        this.createLeadData.acctno = this.viewLeadListData.acctno;
        this.createLeadData.username = this.customerGroupForm.controls.username.value;

        if (this.customerGroupForm.value.plangroupid) {
          this.createLeadData.planMappingList = this.plansArray.value;
        }

        this.createLeadData.leadSourceId = this.customerGroupForm.controls.leadSourceId.value;
        this.createLeadData.leadStatus = this.customerGroupForm.controls.leadStatus.value;

        if (this.leadSourceTitle === "Customer") {
          this.createLeadData.leadSubSourceId =
            this.createLeadData.leadBranchId =
            this.createLeadData.leadServiceAreaId =
            this.createLeadData.leadPartnerId =
            this.createLeadData.leadAgentId =
            this.createLeadData.leadStaffId =
              null;

          this.createLeadData.leadCustomerId = this.customerGroupForm.controls.leadCustomerId.value;
        } else if (this.leadSourceTitle === "Branch") {
          this.createLeadData.leadSubSourceId =
            this.createLeadData.leadCustomerId =
            this.createLeadData.leadServiceAreaId =
            this.createLeadData.leadPartnerId =
            this.createLeadData.leadAgentId =
            this.createLeadData.leadStaffId =
              null;

          this.createLeadData.leadBranchId = this.customerGroupForm.controls.leadBranchId.value;
        } else if (this.leadSourceTitle === "Staff") {
          this.createLeadData.leadSubSourceId =
            this.createLeadData.leadBranchId =
            this.createLeadData.leadServiceAreaId =
            this.createLeadData.leadPartnerId =
            this.createLeadData.leadAgentId =
            this.createLeadData.leadCustomerId =
              null;

          this.createLeadData.leadStaffId = this.customerGroupForm.controls.leadStaffId.value;
        } else if (this.leadSourceTitle === "Outlet/ SA") {
          this.createLeadData.leadSubSourceId =
            this.createLeadData.leadBranchId =
            this.createLeadData.leadServiceAreaId =
            this.createLeadData.leadPartnerId =
            this.createLeadData.leadAgentId =
            this.createLeadData.leadStaffId =
              null;

          this.createLeadData.leadServiceAreaId =
            this.customerGroupForm.controls.leadServiceAreaId.value;
        } else if (this.leadSourceTitle === "Partner") {
          this.createLeadData.leadSubSourceId =
            this.createLeadData.leadBranchId =
            this.createLeadData.leadServiceAreaId =
            this.createLeadData.leadCustomerId =
            this.createLeadData.leadAgentId =
            this.createLeadData.leadStaffId =
              null;

          this.createLeadData.leadPartnerId = this.customerGroupForm.controls.leadPartnerId.value;
        } else if (this.leadSourceTitle === "Agent") {
          this.createLeadData.leadSubSourceId =
            this.createLeadData.leadBranchId =
            this.createLeadData.leadServiceAreaId =
            this.createLeadData.leadPartnerId =
            this.createLeadData.leadCustomerId =
            this.createLeadData.leadStaffId =
              null;

          this.createLeadData.leadAgentId = this.customerGroupForm.controls.leadAgentId.value;
        } else {
          this.createLeadData.leadAgentId =
            this.createLeadData.leadCustomerId =
            this.createLeadData.leadPartnerId =
            this.createLeadData.leadStaffId =
            this.createLeadData.leadServiceAreaId =
            this.createLeadData.leadBranchId =
              null;

          this.createLeadData.leadSubSourceId =
            this.customerGroupForm.controls.leadSubSourceId.value;
        }

        if (this.customerGroupForm.controls.leadCategory.value) {
          this.createLeadData.leadCategory = this.customerGroupForm.controls.leadCategory.value;
        }

        if (this.customerGroupForm.controls.leadType.value) {
          this.createLeadData.leadType = this.customerGroupForm.controls.leadType.value;
          this.createLeadData.existingCustomerId =
            this.customerGroupForm.controls.existingCustomerId.value;
        }

        if (this.customerGroupForm.controls.heardAboutSubisuFrom.value) {
          this.createLeadData.heardAboutSubisuFrom =
            this.customerGroupForm.controls.heardAboutSubisuFrom.value;
        }

        this.createLeadData.id = this.leadId;

        this.createLeadData.existingCustomerId =
          this.customerGroupForm.controls.existingCustomerId.value;

        if (this.customerGroupForm.controls.feasibility.value) {
          this.createLeadData.feasibility = this.customerGroupForm.controls.feasibility.value;
          if (this.customerGroupForm.controls.feasibility.value === "N/A") {
            this.createLeadData.feasibilityRemark =
              this.customerGroupForm.controls.feasibilityRemark.value;
          }
        }
        if (this.myFinalCheck) {
          this.createLeadData.approveMvnoId = Number(this.mvnoid);
          this.createLeadData.approveStaffId = Number(this.staffid);
          this.createLeadData.approveCurrentLoggedInStaffId = Number(this.staffid);
          this.createLeadData.approveStatus = "Approved";
          this.createLeadData.approverNextLeadApprover = Number(this.staffid);
          this.createLeadData.approveFirstname = this.customerGroupForm.controls.firstname.value;
          this.createLeadData.approveUsername = this.customerGroupForm.controls.username.value;
          this.createLeadData.approveServiceareaid =
            this.customerGroupForm.controls.serviceareaid.value;
          this.createLeadData.leadStatus = "Converted";
          if (custId !== "") {
            this.createLeadData.customerId = custId;
            this.createLeadData.isCustomerCafeIsUpdated = true;
          }
          this.createLeadData.assigneeName = null;
        }

        this.customerGroupForm.controls.nextApproveStaffId.value
          ? (this.createLeadData.nextApproveStaffId =
              this.customerGroupForm.controls.nextApproveStaffId.value)
          : "";

        this.customerGroupForm.controls.nextTeamMappingId.value
          ? (this.createLeadData.nextTeamMappingId =
              this.customerGroupForm.controls.nextTeamMappingId.value)
          : "";

        const url = "/leadMaster/update/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
        this.leadManagementService
          .updateMethod(url, this.createLeadData, this.mvnoid, this.staffid)
          .subscribe(
            async (response: any) => {
              if (response.status === 200) {
                this.submitted = false;
                this.myFinalCheck ? (this.myFinalCheck = false) : "";

                this.payMappingListFromArray.controls = [];
                this.overChargeListFromArray.controls = [];
                this.custMacMapppingListFromArray.controls = [];
                this.addressListData = [];

                this.leadFormReset();

                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  //detail: response.message,
                  icon: "far fa-check-circle"
                });

                this.isLeadDetailOpen = false;
                this.isLeadEdit = false;
                this.listView = true;
                this.createView = false;
                this.listSearchView = false;
                this.planCategoryForm.reset();
                this.selectchargeValueShow = false;
                this.ifMyInvoice = false;
                this.ifChargeGetData = false;
                this.ifWalletMenu = false;

                this.selectAreaList = false;
                this.customerUpdateDiscount = false;
                await this.wait(500);
                if (this.searchDeatil) {
                  this.searchLead();
                  //this.getEnterpriseLeadList();
                } else {
                  //this.getLeadList("");
                  this.getEnterpriseLeadList();
                }

                this.customerGroupForm.controls["billday"].clearValidators;
                this.customerGroupForm.controls["billday"].updateValueAndValidity();

                this.customerGroupForm.controls.billday.disable();
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.error.errorMessage,
                  icon: "far fa-times-circle"
                });
              }
            },
            (error: any) => {
              // console.log(error, "error")
              this.addressListData = [];

              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            }
          );
      } else {
        // this.customerGroupForm.value.username = this.staffUser.username;
        // if (this.presentGroupForm.value.addressType) {
        if (this.presentGroupForm.value.landmark !== null) {
          this.addressListData.push(this.presentGroupForm.value);
        } else {
          this.addressListData = [];
        }
        //this.addressListData[0].addressType = "Present";
        // }
        if (this.paymentGroupForm.value.addressType) {
          this.addressListData.push(this.paymentGroupForm.value);
          //this.addressListData[1].addressType = "Payment";
        }
        if (this.permanentGroupForm.value.addressType) {
          this.addressListData.push(this.permanentGroupForm.value);
          //this.addressListData[2].addressType = "Permanent";
        }
        if (
          this.customerGroupForm.value.countryCode == "" ||
          this.customerGroupForm.value.countryCode == null
        ) {
          this.customerGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
        }
        if (
          this.customerGroupForm.value.calendarType == "" ||
          this.customerGroupForm.value.calendarType == null
        ) {
          this.customerGroupForm.value.calendarType = "English";
        }

        this.customerGroupForm.value.status = null;
        if (this.ifReadonlyExtingInput) {
          this.customerGroupForm.value.leadIdentity = "circuit";
        } else {
          this.customerGroupForm.value.leadIdentity = "enterPrise";
        }
        this.createLeadData = this.customerGroupForm.value;

        let myExpiry = this.datePipe.transform(this.createLeadData.expiry, "yyyy-MM-dd");

        let myDOB = this.datePipe.transform(this.createLeadData.dateOfBirth, "yyyy-MM-dd");

        this.createLeadData.expiry = myExpiry;
        this.createLeadData.dateOfBirth = myDOB;

        this.createLeadData.competitorDuration =
          this.customerGroupForm.value.competitorDuration &&
          this.customerGroupForm.value.competitorDuration !== ""
            ? this.customerGroupForm.value.competitorDuration +
              " " +
              this.customerGroupForm.value.durationUnits
            : null;

        this.payMappingListFromArray.value
          ? (this.createLeadData.planMappingList = this.payMappingListFromArray.value)
          : "";

        this.createLeadData.planMappingList.forEach((obj: any) =>
          obj.istrialplan ? (obj.istrialplan = true) : (obj.istrialplan = false)
        );

        if (
          this.customerGroupForm.controls.partnerid.value == null ||
          this.customerGroupForm.controls.partnerid.value == ""
        ) {
          this.createLeadData.partnerid = 1;
        } else {
          this.createLeadData.partnerid =
            this.partnerId !== 1 ? this.partnerId : this.customerGroupForm.controls.partnerid.value;
        }

        this.createLeadData.addressList = this.addressListData;

        this.createLeadData.failcount = Number(this.createLeadData.failcount);
        // this.createLeadData.partnerid = Number(this.createLeadData.partnerid);
        if (
          this.createLeadData.paymentDetails !== null &&
          this.createLeadData.paymentDetails.amount !== null
        ) {
          this.createLeadData.paymentDetails.amount = Number(
            this.createLeadData.paymentDetails.amount
          );
        } else {
          this.createLeadData.paymentDetails = null;
        }

        while (j < this.createLeadData.planMappingList?.length) {
          this.createLeadData.planMappingList[j].planId = Number(
            this.createLeadData.planMappingList[j].planId
          );
          if (this.createLeadData.planMappingList[j].discount == null) {
            this.createLeadData.planMappingList[j].discount = 0;
          }
          j++;
        }

        while (K < this.createLeadData.overChargeList?.length) {
          this.createLeadData.overChargeList[K].chargeid = Number(
            this.createLeadData.overChargeList[K].chargeid
          );
          this.createLeadData.overChargeList[K].validity = Number(
            this.createLeadData.overChargeList[K].validity
          );
          this.createLeadData.overChargeList[K].price = Number(
            this.createLeadData.overChargeList[K].price
          );
          this.createLeadData.overChargeList[K].actualprice = Number(
            this.createLeadData.overChargeList[K].actualprice
          );
          K++;
        }

        while (i < this.createLeadData.addressList?.length) {
          this.createLeadData.addressList[i].areaId = Number(
            this.createLeadData.addressList[i].areaId
          );
          this.createLeadData.addressList[i].pincodeId = Number(
            this.createLeadData.addressList[i].pincodeId
          );
          this.createLeadData.addressList[i].cityId = Number(
            this.createLeadData.addressList[i].cityId
          );
          this.createLeadData.addressList[i].stateId = Number(
            this.createLeadData.addressList[i].stateId
          );
          this.createLeadData.addressList[i].countryId = Number(
            this.createLeadData.addressList[i].countryId
          );
          i++;
        }

        this.createLeadData.isCustCaf = "yes";
        // this.createLeadData.acctno = this.viewLeadListData.acctno;
        if (this.customerGroupForm.value.plangroupid) {
          this.createLeadData.planMappingList = this.plansArray.value;
        }

        this.createLeadData.leadSourceId = this.customerGroupForm.controls.leadSourceId.value;
        this.createLeadData.leadSubSourceId = this.customerGroupForm.controls.leadSubSourceId.value;
        this.createLeadData.previousVendor = this.customerGroupForm.controls.previousVendor.value;
        this.createLeadData.servicerType = this.customerGroupForm.controls.servicerType.value;
        this.createLeadData.leadType = this.customerGroupForm.controls.leadType.value;
        this.createLeadData.existingCustomerId =
          this.customerGroupForm.controls.existingCustomerId.value;

        if (this.customerGroupForm.controls.feasibility.value) {
          this.createLeadData.feasibility = this.customerGroupForm.controls.feasibility.value;

          if (this.customerGroupForm.controls.feasibility.value === "N/A") {
            this.createLeadData.feasibilityRemark =
              this.customerGroupForm.controls.feasibilityRemark.value;
          }
        }
        if (this.customerGroupForm.value.leadCategory == "Existing Customer") {
          this.createLeadData.id = null;
          this.createLeadData.leadStatus = RadiusConstants.CUSTOMER_STATUS.NEW_ACTIVATION;
        }

        // this.followupData.isSend = false;
        // this.insertUpdateDB("SaveLead", this.createLeadData, this.mvnoid, this.staffid, null);
        const url = "/leadMaster/save";
        this.leadManagementService
          .postMethod(url, this.createLeadData, this.mvnoid, this.staffid)
          .subscribe(
            async (response: any) => {
              if (response.status === 200) {
                this.submitted = false;
                this.payMappingListFromArray.controls = [];
                this.overChargeListFromArray.controls = [];
                this.custMacMapppingListFromArray.controls = [];
                this.addressListData = [];

                if (this.ifcutomerToLeadRedirectService) {
                  this.router.navigate(["/home/enterprise-lead"]);
                  this.ifcutomerToLeadRedirectService = false;
                }
                await this.wait(500);
                //this.getLeadList("");
                this.getEnterpriseLeadList();
                this.leadFormReset();
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  //detail: response.message,
                  icon: "far fa-check-circle"
                });

                // if (
                //   !response.leadMaster.nextApproveStaffId &&
                //   !response.leadMaster.nextTeamMappingId &&
                //   response.leadMaster.leadStatus === "Inquiry"
                // ) {
                //   this.messageService.add({
                //     severity: "error",
                //     summary: "Error",
                //     detail: "Please configure workflow first, not yet assigned properly!",
                //     icon: "far fa-check-circle",
                //   });
                // }

                this.isLeadDetailOpen = false;
                this.isLeadEdit = false;
                this.listView = true;
                this.createView = false;
                this.listSearchView = false;
                this.planCategoryForm.reset();
                this.selectchargeValueShow = false;
                this.ifMyInvoice = false;
                this.ifChargeGetData = false;
                this.ifWalletMenu = false;

                this.selectAreaList = false;
                this.customerUpdateDiscount = false;
                if (this.searchkey) {
                  this.searchLead();
                  // this.getEnterpriseLeadList();
                } else {
                  //this.getLeadList("");
                  this.getEnterpriseLeadList();
                }

                this.customerGroupForm.controls.billday.disable();
                this.customerGroupForm.controls["billday"].clearValidators;
                this.customerGroupForm.controls["billday"].updateValueAndValidity();
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.error.errorMessage,
                  icon: "far fa-times-circle"
                });
              }
            },
            (error: any) => {
              // console.log(error, "error")
              this.addressListData = [];

              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.errorMessage,
                icon: "far fa-times-circle"
              });
            }
          );
      }
    } else {
      this.scrollToError();
      this.messageService.add({
        severity: "error",
        summary: "Required",
        detail: "Fields are Mandatory or Invalid. Please fill or update those field.",
        icon: "far fa-times-circle"
      });
    }
  }

  // checkDuplicateMobileCheck(mobile: any) {
  //
  //   this.submitted = true;
  //   if (this.customerGroupForm.valid) {
  //     const url = "/leadMaster/findByMobileNo?mobileNo=" + mobile;

  //     this.leadManagementService.getMethod(url).subscribe(async (response: any) => {
  //       this.submitted = false;
  //       this.leadRecordByMobile = await response.leadMasterList;

  //       if (this.leadRecordByMobile && this.leadRecordByMobile.length > 0) {
  //         this.keyword = "New Lead";
  //
  //         this.confirmationService.confirm({
  //           message: "Are you surely continue for lead generation with duplicate mobile number?",
  //           header: "Duplicate Mobile Confirmation",
  //           icon: "pi pi-info-circle",
  //           accept: () => {
  //             this.addEditLead("", "");
  //           },
  //           reject: () => {
  //             this.messageService.add({
  //               severity: "info",
  //               summary: "Rejected",
  //               detail: "You have rejected the request.",
  //             });
  //           },
  //         });
  //       } else {
  //
  //         this.addEditLead("", "");
  //       }
  //     });
  //   } else {
  //     this.scrollToError();
  //     this.messageService.add({
  //       severity: "error",
  //       summary: "Required",
  //       detail: "Fields are Mandatory or Invalid. Please fill or update those field.",
  //       icon: "far fa-times-circle",
  //     });
  //
  //   }
  // }

  keyword: any;
  leadRecordByMobile: any;
  activeCustomers: any;

  onKeymobilelength(mobile: any) {
    // let str = JSON.stringify(mobile);
    // if (str.length === 10) {
    //   const urlForExistingLead = "/leadMaster/findByMobileNo?mobileNo=" + mobile;
    //   this.leadManagementService.getMethod(urlForExistingLead).subscribe(async (response: any) => {
    //     this.submitted = false;
    //     this.leadRecordByMobile = await response.leadMasterList;
    //   });
    //   if (this.leadRecordByMobile?.length > 0) {
    //     this.confirmationService.confirm({
    //       message: "Are you surely going to create a lead with the duplicate mobile number?",
    //       header: "Duplicate Mobile Confirmation For This Lead",
    //       icon: "pi pi-info-circle",
    //       accept: () => {
    //
    //         const urlForExistingCustomer = "/customers/getActiveCustomersList/" + mobile;
    //         this.customerManagementService
    //           .getMethod(urlForExistingCustomer)
    //           .subscribe((response: any) => {
    //             this.activeCustomers = response.dataList;
    //             console.log(
    //               "this.activeCustomers on selectLeadCategory() function => ",
    //               this.activeCustomers
    //             );
    //             if (this.activeCustomers && this.activeCustomers.length > 0) {
    //               this.confirmationService.confirm({
    //                 message:
    //                   "Are you surely going to create a lead based on mobile for this existing customer?",
    //                 header: "Existing Customer Confirmation For This Lead",
    //                 icon: "pi pi-info-circle",
    //                 accept: () => {
    //                   this.keyword = "Existing Customer";
    //                   this.customerGroupForm.patchValue(this.activeCustomers[0]);
    //                   this.customerGroupForm.patchValue({
    //                     leadCategory: this.keyword,
    //                     existingCustomerId: this.activeCustomers[0].id,
    //                   });
    //                   this.selectLeadExistingCustomer(this.keyword, this.activeCustomers[0].id);
    //                   console.log(this.specificExistingCust);
    //                   console.log(
    //                     "this.specificExistingCust.status => ",
    //                     this.specificExistingCust.status
    //                   );
    //                 },
    //                 reject: () => {
    //                   this.messageService.add({
    //                     severity: "info",
    //                     summary: "Rejected",
    //                     detail: "You have rejected the request!",
    //                   });
    //                   this.keyword = "New Lead";
    //                   this.isLeadEdit = false;
    //                   this.ifPlanGroup = false;
    //                   this.leadExistingCustomerFlag = false;
    //                   this.customerGroupForm.controls.serviceareaid.reset();
    //                   this.serviceareaCheck = true;
    //                   this.customerGroupForm.controls.addressList.reset();
    //                   this.customerGroupForm.controls.billTo.enable();
    //                   this.payMappingListFromArray.controls
    //                     ? (this.payMappingListFromArray.controls = [])
    //                     : "";
    //                   this.customerGroupForm.controls.planMappingList.reset();
    //                   this.presentGroupForm.reset();
    //                   this.paymentGroupForm.reset();
    //                   this.permanentGroupForm.reset();
    //                   this.planCategoryForm.reset();
    //                   this.planDataForm.reset();
    //                   // this.customerGroupForm.reset();
    //                   this.customerGroupForm.patchValue({
    //                     leadCategory: this.keyword,
    //                   });
    //                 },
    //               });
    //             } else {
    //               this.leadExistingCustomerFlag = false;
    //               // this.customerGroupForm.controls["leadCategory"].disable();
    //               this.keyword = "New Lead";
    //               this.customerGroupForm.patchValue({
    //                 leadCategory: this.keyword,
    //               });
    //             }
    //           });
    //       },
    //       reject: () => {
    //
    //         this.messageService.add({
    //           severity: "info",
    //           summary: "Rejected",
    //           detail: "You have rejected the request!",
    //         });
    //         this.customerGroupForm.patchValue({
    //           mobile: "",
    //           leadCategory: "",
    //         });
    //         this.leadExistingCustomerFlag = false;
    //         this.customerGroupForm.controls.serviceareaid.reset();
    //         this.serviceareaCheck = true;
    //         this.customerGroupForm.controls.addressList.reset();
    //         this.customerGroupForm.controls.billTo.enable();
    //         this.payMappingListFromArray.controls
    //           ? (this.payMappingListFromArray.controls = [])
    //           : "";
    //         this.customerGroupForm.controls.planMappingList.reset();
    //         this.presentGroupForm.reset();
    //         this.paymentGroupForm.reset();
    //         this.permanentGroupForm.reset();
    //         this.planCategoryForm.reset();
    //         this.planDataForm.reset();
    //         // this.customerGroupForm.reset();
    //         this.customerGroupForm.patchValue({
    //           mobile: "",
    //           leadCategory: "",
    //         });
    //       },
    //     });
    //   } else {
    //     const urlForExistingCustomer = "/customers/getActiveCustomersList/" + mobile;
    //     this.customerManagementService
    //       .getMethod(urlForExistingCustomer)
    //       .subscribe((response: any) => {
    //         this.activeCustomers = response.dataList;
    //         console.log(
    //           "this.activeCustomers on selectLeadCategory() function => ",
    //           this.activeCustomers
    //         );
    //         if (this.activeCustomers && this.activeCustomers.length > 0) {
    //           this.confirmationService.confirm({
    //             message:
    //               "Are you surely going to create a lead based on mobile for this existing customer?",
    //             header: "Existing Customer Confirmation For This Lead",
    //             icon: "pi pi-info-circle",
    //             accept: () => {
    //
    //               this.keyword = "Existing Customer";
    //               this.customerGroupForm.patchValue({
    //                 leadCategory: this.keyword,
    //                 existingCustomerId: this.activeCustomers[0].id,
    //               });
    //               this.selectLeadExistingCustomer(this.keyword, this.activeCustomers[0].id);
    //               console.log(this.specificExistingCust);
    //               console.log(
    //                 "this.specificExistingCust.status => ",
    //                 this.specificExistingCust.status
    //               );
    //             },
    //             reject: () => {
    //
    //               this.messageService.add({
    //                 severity: "info",
    //                 summary: "Rejected",
    //                 detail: "You have rejected the request!",
    //               });
    //               this.keyword = "New Lead";
    //               this.isLeadEdit = false;
    //               this.ifPlanGroup = false;
    //               this.leadExistingCustomerFlag = false;
    //               this.customerGroupForm.controls.serviceareaid.reset();
    //               this.serviceareaCheck = true;
    //               this.customerGroupForm.controls.addressList.reset();
    //               this.customerGroupForm.controls.billTo.enable();
    //               this.payMappingListFromArray.controls
    //                 ? (this.payMappingListFromArray.controls = [])
    //                 : "";
    //               this.customerGroupForm.controls.planMappingList.reset();
    //               this.customerGroupForm.controls["plangroupid"].reset();
    //               this.presentGroupForm.reset();
    //               this.paymentGroupForm.reset();
    //               this.permanentGroupForm.reset();
    //               this.planCategoryForm.reset();
    //               this.planDataForm.reset();
    //               // this.customerGroupForm.reset();
    //               this.customerGroupForm.patchValue({
    //                 leadCategory: this.keyword,
    //               });
    //             },
    //           });
    //         } else {
    //           this.leadExistingCustomerFlag = false;
    //           // this.customerGroupForm.controls["leadCategory"].disable();
    //           this.keyword = "New Lead";
    //           this.customerGroupForm.patchValue({
    //             leadCategory: this.keyword,
    //           });
    //         }
    //       });
    //   }
    // }
  }

  leadRecordByUsername: any;
  activeCustomerslist: any;

  validateUsername(userName: any) {
    const urlForExistingLead =
      "/leadMaster/findByusername?username=" +
      userName +
      "&mvnoId=" +
      localStorage.getItem("mvnoId");

    this.leadManagementService.getMethod(urlForExistingLead).subscribe(async (response: any) => {
      this.submitted = false;
      this.leadRecordByUsername = await response.leadMasterList;
    });
    if (this.leadRecordByUsername?.length > 0) {
      // this.confirmationService.confirm({
      //   message: "Are you surely going to create a lead with the duplicate mobile number?",
      //   header: "Duplicate Mobile Confirmation For This Lead",
      //   icon: "pi pi-info-circle",
      //   accept: () => {
      //
      //     const urlForExistingCustomer = "/customers/getActiveCustomersList/username" + userName;
      //     this.customerManagementService
      //       .getMethod(urlForExistingCustomer)
      //       .subscribe((response: any) => {
      //         this.activeCustomers = response.dataList;
      //         // console.log(
      //         //   "this.activeCustomers on selectLeadCategory() function => ",
      //         //   this.activeCustomers
      //         // );
      //         if (this.activeCustomers && this.activeCustomers.length > 0) {
      //           this.confirmationService.confirm({
      //             message:
      //               "Are you surely going to create a lead based on mobile for this existing customer?",
      //             header: "Existing Customer Confirmation For This Lead",
      //             icon: "pi pi-info-circle",
      //             accept: () => {
      //               this.keyword = "Existing Customer";
      //               this.customerGroupForm.patchValue({
      //                 leadCategory: this.keyword,
      //                 existingCustomerId: this.activeCustomers[0].id,
      //               });
      //               this.selectLeadExistingCustomer(this.keyword, this.activeCustomers[0].id);
      //               // console.log(this.specificExistingCust);
      //               // console.log(
      //               //   "this.specificExistingCust.status => ",
      //               //   this.specificExistingCust.status
      //               // );
      //             },
      //             reject: () => {
      //               this.messageService.add({
      //                 severity: "info",
      //                 summary: "Rejected",
      //                 detail: "You have rejected the request!",
      //               });
      //               this.keyword = "New Lead";
      //               this.isLeadEdit = false;
      //               this.ifPlanGroup = false;
      //               this.leadExistingCustomerFlag = false;
      //               this.customerGroupForm.controls.serviceareaid.reset();
      //               this.serviceareaCheck = true;
      //               this.customerGroupForm.controls.addressList.reset();
      //               this.customerGroupForm.controls.billTo.enable();
      //               this.payMappingListFromArray.controls
      //                 ? (this.payMappingListFromArray.controls = [])
      //                 : "";
      //               this.customerGroupForm.controls.planMappingList.reset();
      //               this.presentGroupForm.reset();
      //               this.paymentGroupForm.reset();
      //               this.permanentGroupForm.reset();
      //               this.planCategoryForm.reset();
      //               this.planDataForm.reset();
      //               // this.customerGroupForm.reset();
      //               this.customerGroupForm.patchValue({
      //                 leadCategory: this.keyword,
      //               });
      //             },
      //           });
      //         } else {
      //           this.leadExistingCustomerFlag = false;
      //           // this.customerGroupForm.controls["leadCategory"].disable();
      //           this.keyword = "New Lead";
      //           this.customerGroupForm.patchValue({
      //             leadCategory: this.keyword,
      //           });
      //         }
      //       });
      //   },
      //   reject: () => {
      //
      //     this.messageService.add({
      //       severity: "info",
      //       summary: "Rejected",
      //       detail: "You have rejected the request!",
      //     });
      //     this.customerGroupForm.patchValue({
      //       mobile: "",
      //       leadCategory: "",
      //     });
      //     this.leadExistingCustomerFlag = false;
      //     this.customerGroupForm.controls.serviceareaid.reset();
      //     this.serviceareaCheck = true;
      //     this.customerGroupForm.controls.addressList.reset();
      //     this.customerGroupForm.controls.billTo.enable();
      //     this.payMappingListFromArray.controls ? (this.payMappingListFromArray.controls = []) : "";
      //     this.customerGroupForm.controls.planMappingList.reset();
      //     this.presentGroupForm.reset();
      //     this.paymentGroupForm.reset();
      //     this.permanentGroupForm.reset();
      //     this.planCategoryForm.reset();
      //     this.planDataForm.reset();
      //     // this.customerGroupForm.reset();
      //     this.customerGroupForm.patchValue({
      //       mobile: "",
      //       leadCategory: "",
      //     });
      //   },
      // });
    } else {
      const urlForExistingCustomer = "/customers/getActiveCustomersList/username" + userName;
      this.customerManagementService
        .getMethod(urlForExistingCustomer)
        .subscribe((response: any) => {
          this.activeCustomers = response.dataList;

          if (this.activeCustomers && this.activeCustomers.length > 0) {
            this.confirmationService.confirm({
              message:
                "Are you surely going to create a lead based on mobile for this existing customer?",
              header: "Existing Customer Confirmation For This Lead",
              icon: "pi pi-info-circle",
              accept: () => {
                this.keyword = "Existing Customer";
                this.customerGroupForm.patchValue({
                  leadCategory: this.keyword,
                  existingCustomerId: this.activeCustomers[0].id
                });
                this.selectLeadExistingCustomer(this.keyword, this.activeCustomers[0].id);
              },
              reject: () => {
                this.messageService.add({
                  severity: "info",
                  summary: "Rejected",
                  detail: "You have rejected the request!"
                });

                this.keyword = "New Lead";
                this.isLeadEdit = false;
                this.ifPlanGroup = false;
                this.leadExistingCustomerFlag = false;
                this.customerGroupForm.controls.serviceareaid.reset();
                this.serviceareaCheck = true;
                this.customerGroupForm.controls.addressList.reset();
                this.customerGroupForm.controls.billTo.enable();
                this.payMappingListFromArray.controls
                  ? (this.payMappingListFromArray.controls = [])
                  : "";
                this.customerGroupForm.controls.planMappingList.reset();
                this.customerGroupForm.controls["plangroupid"].reset();
                this.presentGroupForm.reset();
                this.paymentGroupForm.reset();
                this.permanentGroupForm.reset();
                this.planCategoryForm.reset();
                this.planDataForm.reset();
                // this.customerGroupForm.reset();
                this.customerGroupForm.patchValue({
                  leadCategory: this.keyword
                });
              }
            });
          } else {
            this.leadExistingCustomerFlag = false;
            // this.customerGroupForm.controls["leadCategory"].disable();

            this.keyword = "New Lead";
            this.customerGroupForm.patchValue({
              leadCategory: this.keyword
            });
          }
        });
    }
  }

  selParentSearchOption(event) {
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
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

  searchParentCustomer() {
    let searchParentData = {
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
      async (response: any) => {
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
          this.prepaidParentCustomerList = await response.parentCustomerList;
          // const list = this.prepaidParentCustomerList;
          // const filterList = list.filter(cust => cust.id !== this.editLeadId);
          // this.prepaidParentCustomerList = filterList;
          // console.log("list", filterList);
          this.parentCustomerListdatatotalRecords = await response.pageDetails.totalRecords;
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
          this.leadListData = [];
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

  myStaffs: any;

  // getLeadList(list) {
  //   this.myFinalCheck = false;
  //   let size;
  //   this.searchkey = "";
  //   let page = this.currentPageLeadListdata;
  //   if (list) {
  //     size = list;
  //     this.leadListdataitemsPerPage = list;
  //   } else {
  //     size = this.leadListdataitemsPerPage;
  //   }
  //
  //   const url = "/leadMaster/all?page=" + page + "&pageSize=" + size;

  //   this.leadManagementService.getMethod(url).subscribe(
  //     async (response: any) => {
  //       // await response?.leadMasterList?.content.forEach((leadItem: any) =>
  //       //   Number(leadItem.createdBy)
  //       // );
  //       //console.log("My Lead List Response => ", response?.leadMasterList?.content);

  //       this.leadListData = await response?.leadMasterList?.content;

  //       this.leadListdatatotalRecords = await response?.leadMasterList?.totalElements;

  //       if (this.showItemPerPage > this.leadListdataitemsPerPage) {
  //         this.leadListDatalength = this.leadListData?.length % this.showItemPerPage;
  //       } else {
  //         this.leadListDatalength = this.leadListData?.length % this.leadListdataitemsPerPage;
  //       }
  //
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //
  //     }
  //   );
  // }

  getCurrentStaffBUList() {
    const url = "/businessUnit/getBUFromStaff";
    this.leadManagementService.getMethodAPIGateway(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200 || response.responseCode == 0) {
          this.currentStaffBuList = response.dataList;
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
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

  async getCurrentStaffBUId() {
    const url =
      "/staffuser/" + localStorage.getItem("userId") + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      async (response: any) => {
        if (response.status == 200) {
          this.currentLoginStaffData = response.Staff;
          await this.getCurrentStaffBUList();
          setTimeout(() => {
            this.getEnterpriseLeadList();
          }, 1000);
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
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

  getEnterpriseLeadList() {
    const url = "/leadMaster/findByBuids";
    const data = {
      buidIdList: this.currentLoginStaffData?.businessUnitIdsList
    };
    this.leadManagementService.postleadMethod(url, data).subscribe(
      async (response: any) => {
        this.leadListData = [];
        //this.leadListData = await response?.leadMasterList
        response?.leadMasterList.forEach(item => {
          this.currentStaffBuList.filter(element => {
            if (item.buId == element.id && item.leadStatus != "Converted") {
              this.leadListData.push(item);
            }
          });
        });
        // this.leadListdatatotalRecords = await response?.leadMasterList?.totalElements;

        // if (this.showItemPerPage > this.leadListdataitemsPerPage) {
        //   this.leadListDatalength = this.leadListData?.length % this.showItemPerPage;
        // } else {
        //   this.leadListDatalength = this.leadListData?.length % this.leadListdataitemsPerPage;
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

  leadDetailOpen(leadId) {
    this.listView = false;
    //  this.listSearchView = false;
    this.isSpecificLeadOpen = true;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isLeadDetailOpen = true;
    //this.getCustomersLedger(custId);
    this.leadIdRecord = leadId;
    this.getLeadDetail(leadId);
    // this.InvoiceListByLead(leadId);
    this.isLeadDetailSubMenu = true;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.customerrMyInventoryView = false;
    this.ifMyInvoice = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.customerUpdateDiscount = false;
  }

  leadStatus: any;
  custInvoiceToOrg: any;
  customerBill: any = 0;
  myLead: any;
  existingCustName: any;
  customerPopName: any;
  branchName: any;

  getLeadDetail(leadId) {
    this.myFinalCheck = false;
    this.tempLeadId = leadId;

    this.presentAdressDATA = [];
    this.permentAdressDATA = [];
    this.paymentAdressDATA = [];
    this.partnerDATA = [];
    this.chargeDATA = [];
    let plandatalength = 0;
    this.paymentDataamount = "";
    this.paymentDatareferenceno = "";
    this.paymentDatapaymentdate = "";
    this.paymentDatapaymentMode = "";
    this.FinalAmountList = [];
    this.leadId = leadId;
    const url = "/leadMaster/findById?leadId=" + Number(leadId);
    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.leadDetailData = await response.leadMaster;
        this.leadStatus = this.leadDetailData.leadStatus;
        this.myLead = this.leadDetailData;

        if (this.leadDetailData?.existingCustomerId) {
          const url = "/customers/" + this.leadDetailData?.existingCustomerId;
          let custData = null;
          this.customerManagementService.getMethod(url).subscribe(async (res: any) => {
            custData = await res.customers;

            this.existingCustName = custData ? custData.firstname : null;
          });
        }

        if (
          this.leadDetailData.paymentDetails?.amount !== null &&
          this.leadDetailData.paymentDetails?.amount !== ""
        ) {
          this.paymentDataamount = await response.leadMaster.paymentDetails?.amount;
          this.paymentDatareferenceno = await response.leadMaster.paymentDetails?.referenceno;
          this.paymentDatapaymentdate = await response.leadMaster.paymentDetails?.paymentdate;
          this.paymentDatapaymentMode = await response.leadMaster.paymentDetails?.paymode;
        }

        const paymentaddressType = await response.leadMaster.addressList.filter(
          key => key.addressType === "Payment"
        );
        if (paymentaddressType) {
          this.paymentAddressData = paymentaddressType;
        } else {
          this.paymentAddressData = {
            fullAddress: ""
          };
        }
        const permanentaddressType = await response.leadMaster.addressList.filter(
          key => key.addressType === "Permanent"
        );
        if (permanentaddressType) {
          this.permanentAddressData = permanentaddressType;
        } else {
          this.permanentAddressData = {
            fullAddress: ""
          };
        }

        //pop Name
        // if (this.leadDetailData.popid) {
        //   let popurl = "/popmanagement/" + this.leadDetailData.popid;
        //   this.customerManagementService.getMethod(popurl).subscribe((response: any) => {
        //     this.customerPopName = response.data.name;
        //   });
        // }

        // branch name
        // if (this.leadDetailData.branchId) {
        //   const branchurl = "/branchManagement/" + this.leadDetailData.branchId;
        //   this.productService.getMethod(branchurl).subscribe((response: any) => {
        //     this.branchName = response.data.name;
        //
        //   });
        // }

        //partner Name
        if (this.leadDetailData.partnerid) {
          let partnerurl = "/partner/" + this.leadDetailData.partnerid;
          this.partnerService.getMethodNew(partnerurl).subscribe(async (response: any) => {
            this.partnerDATA = await response.partnerlist.name;
          });
        }

        //serviceArea Name
        if (this.leadDetailData.serviceareaid) {
          let serviceareaurl = "/serviceArea/" + this.leadDetailData.serviceareaid;
          this.adoptCommonBaseService.get(serviceareaurl).subscribe(async (response: any) => {
            this.serviceAreaDATA = await response.data.name;
          });
        }

        //Address
        if (this.leadDetailData.addressList?.length > 0) {
          if (this.leadDetailData.addressList[0].addressType) {
            let areaurl = "/area/" + this.leadDetailData.addressList[0].areaId;

            this.adoptCommonBaseService.get(areaurl).subscribe(async (response: any) => {
              this.presentAdressDATA = await response.data;
            });
          }
          if (this.leadDetailData.addressList?.length > 1) {
            var j = 0;
            while (j < this.leadDetailData.addressList?.length) {
              const addres1 = this.leadDetailData.addressList[j].addressType;
              if (addres1) {
                if ("Payment" == addres1) {
                  let areaurl = "/area/" + this.leadDetailData.addressList[j].areaId;
                  this.adoptCommonBaseService.get(areaurl).subscribe(async (response: any) => {
                    this.paymentAdressDATA = await response.data;
                  });
                } else {
                  let areaurl = "/area/" + this.leadDetailData.addressList[j].areaId;
                  this.adoptCommonBaseService.get(areaurl).subscribe(async (response: any) => {
                    this.permentAdressDATA = await response.data;
                  });
                }
              }
              j++;
            }
          }
        }

        if (this.leadDetailData.planMappingList?.length > 0) {
          this.customerBill = this.leadDetailData.planMappingList[0].billTo;
          this.custInvoiceToOrg = this.leadDetailData.planMappingList[0].isInvoiceToOrg;
        }

        if (this.leadDetailData.plangroupid) {
          this.ifIndividualPlan = false;
          this.ifPlanGroup = true;
          let planGroupurl =
            "/findPlanGroupById?planGroupId=" +
            this.leadDetailData.plangroupid +
            "&mvnoId=" +
            localStorage.getItem("mvnoId");

          this.customerManagementService
            .getMethod(planGroupurl)
            .subscribe(async (response: any) => {
              this.planGroupName = await response.planGroup.planGroupName;
            });
        } else {
          this.ifIndividualPlan = true;
          this.ifPlanGroup = false;
          this.planMappingList = this.leadDetailData.planMappingList;

          while (plandatalength < this.leadDetailData.planMappingList.length) {
            const planId = this.leadDetailData.planMappingList[plandatalength].planId;
            let discount;
            if (
              this.leadDetailData.planMappingList[plandatalength].discount == null ||
              this.leadDetailData.planMappingList[plandatalength].discount == ""
            ) {
              discount = 0;
            } else {
              discount = this.leadDetailData.planMappingList[plandatalength].discount;
            }

            const planurl = "/postpaidplan/" + planId + "?mvnoId=" + localStorage.getItem("mvnoId");
            this.customerManagementService.getMethod(planurl).subscribe(async (response: any) => {
              await this.dataPlan.push(response.postPaidPlan);
            });

            this.customerManagementService
              .getofferPriceWithTax(planId, discount)
              .subscribe(async (response: any) => {
                if (response.result.finalAmount) {
                  await this.FinalAmountList.push(response.result.finalAmount);
                } else {
                  await this.FinalAmountList.push(0);
                }
              });
            plandatalength++;
          }
        }

        // charger Data
        if (this.leadDetailData.indiChargeList.length > 0) {
          this.leadDetailData.indiChargeList.forEach(element => {
            if (element.planid) {
              const url =
                "/postpaidplan/" + element.planid + "?mvnoId=" + localStorage.getItem("mvnoId");
              this.customerManagementService.getMethod(url).subscribe(async (response: any) => {
                await this.dataChargePlan.push(response.postPaidPlan);
              });
            }
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

  invoicedropdownValue = [{ docnumber: "Advance", id: 0 }];

  InvoiceListByLead(id) {
    const url = "/invoiceList/byCustomer/" + id;
    this.invoiceList = [];

    this.recordPaymentService.getAllInvoiceByCustomer(url).subscribe(
      (response: any) => {
        let invoiceList = response.invoiceList;
        this.invoiceList.push(...this.invoicedropdownValue);
        this.invoiceList.push(...invoiceList);
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

  leadIdForNotes: any;

  addNotesSetFunction(leadId: any) {
    this.addNotesPopup = true;
    this.leadIdForNotes = leadId;
    // this.addNotesForm.controls.leadMasterId.value = leadId;
  }

  deleteConfirmonLeadData(leadId: any) {
    if (leadId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this lead?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteLead(leadId);
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected the request."
          });
        }
      });
    }
  }

  deleteLead(leadId: any) {
    const url = "/leadMaster/delete?leadId=" + leadId;

    this.leadManagementService.deleteMethod(url).subscribe(
      async (response: any) => {
        if ((await response.status) === 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: await response.message,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentPageLeadListdata != 1 && this.leadListData?.length == 1) {
            this.currentPageLeadListdata = this.leadListData - 1;
          }
          if (!this.searchkey) {
            // await this.getLeadList("");
            this.getEnterpriseLeadList();
          } else {
            await this.searchLead();
            //this.getEnterpriseLeadList();
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: await response.message,
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

  saveNotes(leadId: any) {
    this.notesSubmitted = true;

    if (this.addNotesForm.valid) {
      if (leadId) {
        const url = "/leadMaster/add/notes";
        this.addNotesData = {
          id: 0,
          leadMasterId: leadId,
          notes: this.addNotesForm.controls.notes.value
        };
        this.leadManagementService
          .postMethod(url, this.addNotesData, this.mvnoid, this.staffid)
          .subscribe(
            (response: any) => {
              this.notesSubmitted = false;
              if (response.status == 406) {
                this.addNotesPopup = false;
                this.addNotesForm.reset();

                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.message,
                  icon: "far fa-times-circle"
                });
              } else {
                if (!this.searchkey) {
                  //this.getLeadList("");
                  this.getEnterpriseLeadList();
                } else {
                  this.searchLead();
                  //this.getEnterpriseLeadList();
                }

                this.addNotesPopup = false;
                this.addNotesForm.reset();

                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle"
                });
              }
            },
            (error: any) => {
              this.addNotesPopup = false;
              this.addNotesForm.reset();

              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.errorMessage,
                icon: "far fa-times-circle"
              });
            }
          );
      } else {
        this.addNotesForm.reset();
        this.addNotesPopup = false;

        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Lead Id is missing!",
          icon: "far fa-times-circle"
        });
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Required column is missing!",
        icon: "far fa-times-circle"
      });
      this.addNotesPopup = true;
    }
  }

  pageChangedLeadList(pageNumber) {
    this.currentPageLeadListdata = pageNumber;
    if (this.searchkey) {
      this.searchLead();
      //this.getEnterpriseLeadList();
    } else {
      //this.getLeadList("");
      this.getEnterpriseLeadList();
    }
  }

  TotalItemPerPage(event) {
    this.currentPageLeadListdata = 1;
    this.showItemPerPage = Number(event.value);
    // if (this.currentPageLeadListdata > 1) {
    //   this.currentPageLeadListdata = 1;
    // }
    if (!this.searchkey) {
      // this.getLeadList(this.showItemPerPage);
      this.getEnterpriseLeadList();
    } else {
      this.searchLead();
    }
  }

  getRejectedReasonAndSubReason = (reasonId: any) => {
    this.rejectedReasonList = [];
    this.rejectedSubReasonArr = [];
    let rejectReasonList: any = [];
    const url = "/rejectReason/all";
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        rejectReasonList = response.rejectReasonList.content;
        rejectReasonList.forEach((item: any) =>
          item?.status === "Active" ? this.rejectedReasonList.push(item) : ""
        );

        if (this.rejectedReasonList?.length > 0) {
          this.rejectedReasonList?.forEach(source =>
            source.rejectSubReasonDtoList?.forEach(subreason =>
              subreason.rejectReasonId === reasonId ? this.rejectedSubReasonArr.push(subreason) : ""
            )
          );
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  };

  rejectedReasonId: any;
  rejectedSubReasonId: any;
  myFinalCheck: boolean = false;
  presentCheckForPayment: boolean;
  presentCheckForPermanent: boolean = false;
  defaultPlanList: any;

  daySequence() {
    for (let i = 0; i < 28; i++) {
      this.days.push({ label: i + 1 });
    }
  }

  custTypeEvent(value) {
    if (value === "Postpaid") {
      this.customerGroupForm.controls.billday.enable();
      this.customerGroupForm.controls["billday"].setValidators(Validators.required);
      this.customerGroupForm.controls["billday"].updateValueAndValidity();
    } else {
      this.customerGroupForm.controls.billday.disable();
      this.customerGroupForm.controls["billday"].clearValidators;
      this.customerGroupForm.controls["billday"].updateValueAndValidity();
    }
  }
  editLead(leadId: any, check: any) {
    this.leadExistingCustomerFlag = false;
    this.plansubmitted = false;
    this.DiscountValueStore = [];
    this.discountValue = 0;
    this.planTotalOffetPrice = 0;
    // this.planDataForm.reset();

    this.ifReadonlyExtingInput = false;
    this.rejectedReasonList = [];
    this.rejectedSubReasonArr = [];
    // this.getConnectionTypeList();
    // this.getLinkTypeList();
    // this.getCircuitAreaTypeList();
    // this.getBusinessVerticalsTypeList();
    // this.getSubBusinessVerticalsTypeList();

    this.leadId = leadId;
    this.totalAddress = 0;
    this.editLeadId = leadId;
    this.planDropdownInChageData = [];

    this.getPreviousVendors();

    this.planGroupForm.controls.planId.enable();
    if (this.payMappingListFromArray.controls) {
      this.payMappingListFromArray.controls = [];
    }
    if (this.overChargeListFromArray.controls) {
      this.overChargeListFromArray.controls = [];
    }
    if (this.custMacMapppingListFromArray.controls) {
      this.custMacMapppingListFromArray.controls = [];
    }

    this.paymentGroupForm.reset();
    this.permanentGroupForm.reset();
    this.viewLeadListData = [];

    if (leadId) {
      const url = "/leadMaster/findById?leadId=" + leadId;
      this.leadManagementService.getMethod(url).subscribe(
        async (response: any) => {
          this.viewLeadListData = await response.leadMaster;

          if (response.status === 200) {
            this.viewLeadListData = response.leadMaster;
            if (
              !this.viewLeadListData.plangroupid &&
              check &&
              this.viewLeadListData.planMappingList.length > 0
            ) {
              let data = this.viewLeadListData;
              data.id = this.leadId;
              let planUrl = "/AdoptSalesCrmsBss/leadMaster/verifyPlansWithQuotationApproval";
              this.customerManagementService.updateMethod(planUrl, data).subscribe(
                (response: any) => {
                  if (response.status === 200) {
                    this.planMappingList = response.planMappingList;
                    this.viewLeadListData.planMappingList = response.planMappingList;
                    this.EditLeadDataSetValue(leadId, check);
                  }
                },
                (error: any) => {
                  if (error.status === 400) {
                    this.messageService.add({
                      severity: "info",
                      summary: "No Convert Lead To CAF ",
                      detail:
                        ` No final approved quotation found on latest version with` +
                        " " +
                        this.viewLeadListData.firstname,
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
              this.EditLeadDataSetValue(leadId, check);
            }
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

      // if (this.leadId) {
      //   this.planMappingList = [];
      //   let postpaidData: any = [];
      //   this.leadManagementService
      //     .findCPRForLeadToCAFConvertionForEnterpriseCustomer(this.leadId)
      //     .subscribe((response: any) => {
      //       postpaidData = response.planMappingList;
      //       postpaidData.forEach(element => {
      //         let data = {
      //           billTo: element.billTo ? element.billTo : "customer",
      //           discount: element.discount,
      //           discountExpiryDate: element.discountExpiryDate,
      //           discountType: element.discountType,
      //           isInvoiceToOrg: element.isInvoiceToOrg,
      //           istrialplan: element.istrialplan,
      //           newAmount: element.newAmount,
      //           offerPrice: element.offerPrice,
      //           planId: element.planId,
      //           service: element.service,
      //           validity: element.validity,
      //           linkAcceptanceDTO: element.linkAcceptanceDTO,
      //         };
      //         if (data.linkAcceptanceDTO !== null) {
      //           this.planMappingList.push(data);
      //         }
      //       });
      //     });
      // }

      if (check) {
        this.myFinalCheck = true;
        //Need to check for entriprise customer

        if (this.customerGroupForm.value.leadCategory === "Existing Customer") {
          this.customerGroupForm.patchValue({
            custlabel: "customer"
          });
          this.ifReadonlyExtingInput = true;
        } else {
          this.ifReadonlyExtingInput = false;
        }
        if (this.customerGroupForm.value.custtype === "Postpaid") {
          this.customerGroupForm.controls["billday"].setValidators(Validators.required);
          this.customerGroupForm.controls["billday"].updateValueAndValidity();
        }

        this.customerGroupForm.controls["leadNo"].setValidators(Validators.required);
        this.customerGroupForm.controls["leadNo"].updateValueAndValidity();
        this.customerGroupForm.controls["lastname"].setValidators(Validators.required);
        this.customerGroupForm.controls["lastname"].updateValueAndValidity();
        this.customerGroupForm.controls["contactperson"].setValidators(Validators.required);
        this.customerGroupForm.controls["contactperson"].updateValueAndValidity();
        // this.customerGroupForm.controls["cafno"].setValidators(Validators.required);
        this.customerGroupForm.controls["cafno"].updateValueAndValidity();
        this.customerGroupForm.controls["username"].setValidators(Validators.required);
        this.customerGroupForm.controls["username"].updateValueAndValidity();
        this.customerGroupForm.controls["password"].setValidators(Validators.required);
        this.customerGroupForm.controls["password"].updateValueAndValidity();
        this.customerGroupForm.controls["calendarType"].setValidators(Validators.required);
        this.customerGroupForm.controls["calendarType"].updateValueAndValidity();
        this.customerGroupForm.controls["email"].setValidators(Validators.required);
        this.customerGroupForm.controls["email"].updateValueAndValidity();
        this.customerGroupForm.controls["serviceareaid"].setValidators(Validators.required);
        this.customerGroupForm.controls["serviceareaid"].updateValueAndValidity();
        this.customerGroupForm.controls["partnerid"].setValidators(Validators.required);
        this.customerGroupForm.controls["partnerid"].updateValueAndValidity();
        this.customerGroupForm.controls["title"].setValidators(Validators.required);
        this.customerGroupForm.controls["title"].updateValueAndValidity();
        this.presentGroupForm.controls["landmark"].setValidators(Validators.required);
        this.presentGroupForm.controls["landmark"].updateValueAndValidity();
        this.presentGroupForm.controls["pincodeId"].setValidators(Validators.required);
        this.presentGroupForm.controls["pincodeId"].updateValueAndValidity();
        this.presentGroupForm.controls["areaId"].setValidators(Validators.required);
        this.presentGroupForm.controls["areaId"].updateValueAndValidity();
        this.presentGroupForm.controls["cityId"].setValidators(Validators.required);
        this.presentGroupForm.controls["cityId"].updateValueAndValidity();
        this.presentGroupForm.controls["stateId"].setValidators(Validators.required);
        this.presentGroupForm.controls["stateId"].updateValueAndValidity();
        this.presentGroupForm.controls["countryId"].setValidators(Validators.required);
        this.presentGroupForm.controls["countryId"].updateValueAndValidity();
      } else {
        this.myFinalCheck = false;

        this.customerGroupForm.controls["billday"].clearValidators;
        this.customerGroupForm.controls["billday"].updateValueAndValidity();

        this.customerGroupForm.controls["leadNo"].clearValidators();
        this.customerGroupForm.controls["leadNo"].updateValueAndValidity();
        this.customerGroupForm.controls["lastname"].clearValidators();
        this.customerGroupForm.controls["lastname"].updateValueAndValidity();
        this.customerGroupForm.controls["contactperson"].clearValidators();
        this.customerGroupForm.controls["contactperson"].updateValueAndValidity();
        this.customerGroupForm.controls["cafno"].clearValidators();
        this.customerGroupForm.controls["cafno"].updateValueAndValidity();
        this.customerGroupForm.controls["username"].clearValidators();
        this.customerGroupForm.controls["username"].updateValueAndValidity();
        this.customerGroupForm.controls["password"].clearValidators();
        this.customerGroupForm.controls["password"].updateValueAndValidity();
        this.customerGroupForm.controls["calendarType"].clearValidators();
        this.customerGroupForm.controls["calendarType"].updateValueAndValidity();
        this.customerGroupForm.controls["email"].clearValidators();
        this.customerGroupForm.controls["email"].updateValueAndValidity();
        this.customerGroupForm.controls["serviceareaid"].clearValidators();
        this.customerGroupForm.controls["serviceareaid"].updateValueAndValidity();
        this.customerGroupForm.controls["partnerid"].clearValidators();
        this.customerGroupForm.controls["partnerid"].updateValueAndValidity();
        this.customerGroupForm.controls["title"].clearValidators();
        this.customerGroupForm.controls["title"].updateValueAndValidity();
        this.presentGroupForm.controls["landmark"].clearValidators();
        this.presentGroupForm.controls["landmark"].updateValueAndValidity();
        this.presentGroupForm.controls["pincodeId"].clearValidators();
        this.presentGroupForm.controls["pincodeId"].updateValueAndValidity();
        this.presentGroupForm.controls["areaId"].clearValidators();
        this.presentGroupForm.controls["areaId"].updateValueAndValidity();
        this.presentGroupForm.controls["cityId"].clearValidators();
        this.presentGroupForm.controls["cityId"].updateValueAndValidity();
        this.presentGroupForm.controls["stateId"].clearValidators();
        this.presentGroupForm.controls["stateId"].updateValueAndValidity();
        this.presentGroupForm.controls["countryId"].clearValidators();
        this.presentGroupForm.controls["countryId"].updateValueAndValidity();
      }
    }
  }

  EditLeadDataSetValue(leadId: any, check: any) {
    this.leadExistingCustomerFlag = false;
    this.plansubmitted = false;
    this.ifReadonlyExtingInput = false;
    this.isLeadEdit = true;
    this.listView = false;
    this.createView = true;
    this.isLeadDetailOpen = false;
    this.listSearchView = false;
    this.ifMyInvoice = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.customerUpdateDiscount = false;
    this.openFollowUpSchedulling = false;
    this.openAuditTrailScreen = false;
    this.openLeadStatusScreen = false;
    this.openLeadNotesScreen = false;
    this.isServiceManagementOpen = false;
    this.isQuotationDetailOpen = false;
    this.isSpecificLeadOpen = false;
    let macNumber = 0;
    let k = 0;

    // if (
    //   !this.viewLeadListData.planMappingList ||
    //   this.viewLeadListData.planMappingList.length == 0
    // ) {
    if (this.isPlanOnDemand) {
      this.defaultPlanList =
        this.leadManagementService.findCPRForLeadToCAFConvertionForEnterpriseCustomer(
          this.viewLeadListData.id
        );
      if (this.defaultPlanList && this.defaultPlanList.length > 0) {
        this.viewLeadListData.planMappingList = this.defaultPlanList;
      }
    }
    // }
    this.myLead = this.viewLeadListData;
    this.customerGroupForm.patchValue(this.viewLeadListData);
    this.getBillableCust(this.viewLeadListData.billableCustomerId);

    let competitorDuration = this.viewLeadListData?.competitorDuration?.split(" ");
    let competitorPackTime =
      competitorDuration && competitorDuration.length > 0
        ? competitorDuration[0]
          ? Number(competitorDuration[0])
          : null
        : "";
    let durationUnits =
      competitorDuration && competitorDuration.length > 0
        ? competitorDuration[1]
          ? String(competitorDuration[1])
          : this.competitorDurationUnits[1].label
        : "";

    this.customerGroupForm.patchValue({
      competitorDuration: competitorPackTime,
      durationUnits: durationUnits
    });

    !this.customerGroupForm.controls.nextTeamMappingId.value
      ? this.customerGroupForm.controls.nextTeamMappingId.setValue(
          this.viewLeadListData.nextTeamMappingId
        )
      : "";
    !this.customerGroupForm.controls.nextApproveStaffId.value
      ? this.customerGroupForm.controls.nextApproveStaffId.setValue(
          this.viewLeadListData.nextApproveStaffId
        )
      : "";

    if (this.viewLeadListData?.presentCheckForPermanent) {
      this.presentCheckForPermanent = true;
    } else {
      this.presentCheckForPermanent = false;
    }
    if (this.viewLeadListData?.presentCheckForPayment) {
      this.presentCheckForPayment = true;
    } else {
      this.presentCheckForPayment = false;
    }

    if (!this.viewLeadListData.partnerid) {
      this.viewLeadListData.partnerid = null;
      this.customerGroupForm.controls["partnerid"].setValue(null);
    }

    this.viewLeadListData?.serviceareaid
      ? (this.serviceareaCheck = false)
      : (this.serviceareaCheck = true);
    if (
      this.viewLeadListData.leadAgentId ||
      this.viewLeadListData.leadCustomerId ||
      this.viewLeadListData.leadBranchId ||
      this.viewLeadListData.leadServiceAreaId ||
      this.viewLeadListData.leadPartnerId ||
      this.viewLeadListData.leadStaffId
    ) {
      this.viewLeadListData.leadSubSourceId = null;
      this.viewLeadListData.leadSubSourceName = null;
    }

    if (this.viewLeadListData.rejectReasonId !== null) {
      this.rejectedReasonId = this.viewLeadListData.rejectReasonId;
      this.customerGroupForm.controls.rejectReasonId.setValue(this.viewLeadListData.rejectReasonId);
    } else {
      this.rejectedReasonId = null;
    }

    this.getRejectedReasonAndSubReason(this.rejectedReasonId);

    if (this.viewLeadListData.rejectSubReasonId !== null) {
      this.rejectedSubReasonId = this.viewLeadListData.rejectSubReasonId;
    } else {
      this.rejectedSubReasonId = null;
    }

    this.leadStatus = this.viewLeadListData.leadStatus;

    // this.customerGroupForm.controls.planMappingList.patchValue(
    //   this.viewLeadListData.planMappingList
    // );

    // if (this.viewLeadListData.planMappingList[0]) {
    //   this.customerGroupForm
    //     .get("billTo")
    //     .setValue(this.viewLeadListData.planMappingList[0].billTo);
    //   this.customerGroupForm.get("billTo").enable();
    // }

    this.customerGroupForm.get("isCustCaf").setValue("yes");

    if (this.viewLeadListData.branchId) {
      let branchId = {
        value: Number(this.viewLeadListData.branchId)
      };
      this.getServiceByBranch(branchId);
    }
    let serviceAreaId = {
      value: Number(this.viewLeadListData.serviceareaid)
    };
    this.selServiceArea(serviceAreaId);

    this.custTypeEvent(this.viewLeadListData.custtype);
    this.selectLeadSource(this.viewLeadListData.leadSourceId);
    this.serviceAreabaseData(this.viewLeadListData.serviceareaid);
    const checkCustTypeurl = `/isCustomerPrimeOrNot?leadCustId=${leadId}`;
    this.customerManagementService.getMethod(checkCustTypeurl).subscribe((responsePrime: any) => {
      var url = "";
      if (responsePrime.isCustomerPrime) {
        url = `/premierePlan/all?leadCustId=${leadId}&serviceAreaId=${this.viewLeadListData?.serviceareaid}&isPremiere=true`;
      } else {
        url = `/postpaidplan/all?mvnoId=${localStorage.getItem("mvnoId")}`;
      }
      this.customerManagementService.getMethod(url).subscribe((response: any) => {
        this.postpaidplanData = response.postpaidplanList;
        if (this.viewLeadListData.custtype == "Prepaid") {
          let obj = {};
          this.filterPlanData = [];
          if (this.postpaidplanData?.length != 0) {
            obj = this.postpaidplanData.filter(key => key.plantype === "Prepaid");
          }
          this.filterPlanData = obj;
          obj = {};
        } else if (this.viewLeadListData.custtype == "Postpaid") {
          let obj = {};
          this.filterPlanData = [];
          if (this.postpaidplanData?.length != 0) {
            obj = this.postpaidplanData.filter(key => key.plantype === "Postpaid");
          }
          this.filterPlanData = obj;
          obj = {};
        } else {
          let obj = {};
          this.filterPlanData = [];
          if (this.postpaidplanData?.length != 0) {
            obj = this.postpaidplanData.filter(key => key.plantype === "Prepaid");
          }
          this.filterPlanData = obj;
          obj = {};
        }
      });
    });

    if (this.viewLeadListData.creditDocuments?.length !== 0) {
      this.customerGroupForm.controls.paymentDetails.patchValue(
        this.viewLeadListData.creditDocuments[0]
      );
    }

    if (this.viewLeadListData.parentCustomerId) {
      this.parentCustList = [
        {
          id: this.viewLeadListData.parentCustomerId,
          name: this.viewLeadListData.parentCustomerName
        }
      ];
    } else {
      this.parentCustList = [];
    }

    if (this.viewLeadListData.parentCustomerId) {
      this.customerGroupForm.controls.invoiceType.enable();
      this.customerGroupForm.controls["invoiceType"].setValidators(Validators.required);
      this.customerGroupForm.controls["invoiceType"].updateValueAndValidity();
    } else {
      this.customerGroupForm.controls.invoiceType.disable();
      this.customerGroupForm.controls["invoiceType"].clearValidators();
      this.customerGroupForm.controls["invoiceType"].updateValueAndValidity();
    }

    //Address
    if (this.viewLeadListData.addressList?.length > 0) {
      if (this.viewLeadListData.addressList[0].addressType) {
        var pinevent = { value: this.viewLeadListData.addressList[0].pincodeId };
        this.selectPINCODEChange(pinevent, "present");
        this.getTempPincodeData(this.viewLeadListData.addressList[0].pincodeId, "present");
        this.getAreaData(this.viewLeadListData.addressList[0].areaId, "present");
        this.presentGroupForm.patchValue(this.viewLeadListData.addressList[0]);
        this.presentGroupForm
          .get("landmark")
          .setValue(this.viewLeadListData.addressList[0].landmark);
      }
      if (this.viewLeadListData.addressList != null) {
        this.viewLeadListData.addressList.forEach(element => {
          if ("Payment" == element.addressType) {
            this.getTempPincodeData(element.pincodeId, "payment");
            this.getAreaData(element.areaId, "payment");
            this.paymentGroupForm.patchValue(element);
            this.selectAreaListPayment = true;
            this.selectPincodeListPayment = true;
          } else if ("Permanent" == element.addressType || "permanent" == element.addressType) {
            this.getTempPincodeData(element.pincodeId, "permanent");
            this.getAreaData(element.areaId, "permanent");
            this.permanentGroupForm.patchValue(element);
            this.selectAreaListPermanent = true;
            this.selectPincodeListPermanent = true;
          }
        });
      }
    }

    if (this.viewLeadListData.plangroupid) {
      this.ifIndividualPlan = false;
      this.ifPlanGroup = true;
      this.planCategoryForm.patchValue({
        planCategory: "groupPlan"
      });
      this.getPlangroupByPlan(this.viewLeadListData.plangroupid);
      this.customerGroupForm.patchValue({
        plangroupid: this.viewLeadListData.plangroupid
      });

      if (this.viewLeadListData.planMappingList.length > 0) {
        this.customerGroupForm.controls["billTo"].setValue(
          this.viewLeadListData.planMappingList[0].billTo
        );
        this.customerGroupForm.controls["isInvoiceToOrg"].setValue(
          this.viewLeadListData.planMappingList[0].isInvoiceToOrg
        );
      }
    } else {
      this.ifIndividualPlan = true;
      this.ifPlanGroup = false;

      this.planCategoryForm.patchValue({
        planCategory: "individual"
      });

      //plan deatils
      let newAmount = 0;
      let totalAmount = 0;
      let disValue = 0;
      this.discountValue = 0;
      this.DiscountValueStore = [];
      this.viewLeadListData.planMappingList.forEach((element, i) => {
        // this.planGroupForm.patchValue(
        //   customerData.planMappingList[planlength]
        // );
        // this.onAddplanMappingList();
        if (element.planId) {
          const planAmount = "";
          let validityUnit = "";
          const url =
            "/postpaidplan/" + element.planId + "?mvnoId=" + localStorage.getItem("mvnoId");
          this.customerManagementService.getMethod(url).subscribe((response: any) => {
            this.planDropdownInChageData.push(response.postPaidPlan);
            let postpaidplanData = response.postPaidPlan;
            validityUnit = response.postPaidPlan.unitsOfValidity;
            this.payMappingListFromArray.push(
              this.fb.group({
                service: element.service,
                planId: element.planId,
                validity: element.validity,
                offerPrice: element.offerPrice ? element.offerPrice : element.newAmount,
                newAmount: element.newAmount,
                discount: element.discount,
                istrialplan: element.istrialplan ? true : false,
                billTo: element.billTo ? element.billTo : "CUSTOMER",
                isInvoiceToOrg: element.isInvoiceToOrg,
                discountType: element.discountType,
                discountExpiryDate: [
                  element.discountExpiryDate
                    ? moment(element.discountExpiryDate).utc(true).toDate()
                    : null
                ]
              })
            );
            this.validityUnitFormArray.push(
              this.fb.group({
                validityUnit
              })
            );

            let n = i + 1;
            newAmount = postpaidplanData.newOfferPrice
              ? postpaidplanData.newOfferPrice
              : postpaidplanData.offerprice;
            totalAmount = Number(totalAmount) + Number(newAmount);

            if (this.viewLeadListData.planMappingList.length == n) {
              this.planDataForm.patchValue({
                offerPrice: totalAmount
              });

              this.payMappingListFromArray.value.forEach((e, k) => {
                let discountValueNUmber: any = 0;
                let lastvalue: any = 0;
                let m = i + 1;
                let price = Number(this.payMappingListFromArray.value[k].offerPrice);
                let discount = Number(this.payMappingListFromArray.value[k].discount);
                let DiscountV = (price * discount) / 100;
                discountValueNUmber = DiscountV.toFixed(3);
                let discountValue =
                  Number(this.payMappingListFromArray.value[k].offerPrice) -
                  Number(discountValueNUmber);
                this.discountValue = Number(discountValue);

                this.DiscountValueStore.push({ value: this.discountValue });
                if (this.discountValue == 0) {
                  disValue =
                    Number(this.payMappingListFromArray.value[k].offerPrice) +
                    Number(this.planDataForm.value.discountPrice);
                } else {
                  disValue =
                    Number(this.discountValue) + Number(this.planDataForm.value.discountPrice);
                }
                if (this.viewLeadListData.planMappingList.length == m) {
                  this.planDataForm.patchValue({
                    discountPrice: disValue
                  });
                }
              });
            }
          });
        }
      });
    }

    this.viewLeadListData.overChargeList = this.viewLeadListData.indiChargeList;
    //charge
    while (k < this.viewLeadListData.indiChargeList?.length) {
      if (this.viewLeadListData.indiChargeList[k].charge_date) {
        const format = "yyyy-MM-dd";
        const locale = "en-US";
        const myDate = this.viewLeadListData.indiChargeList[k].charge_date;
        const formattedDate = formatDate(myDate, format, locale);
        this.viewLeadListData.indiChargeList[k].charge_date = formattedDate;

        let date = this.viewLeadListData.indiChargeList[k].charge_date.split("-");
        this.ngbBirthcal = {
          year: Number(date[0]),
          month: Number(date[1]),
          day: Number(date[2])
        };
        this.overChargeListFromArray.patchValue([
          {
            charge_date: this.viewLeadListData.indiChargeList[k].charge_date
          }
        ]);
      }
      this.chargeGroupForm.patchValue(this.viewLeadListData.indiChargeList[k]);
      this.onAddoverChargeListField();
      this.overChargeListFromArray.patchValue(this.viewLeadListData.indiChargeList);
      k++;
    }

    // MAc
    while (macNumber < this.viewLeadListData.custMacMapppingList?.length) {
      this.macGroupForm.patchValue(this.viewLeadListData.custMacMapppingList[macNumber]);
      this.onAddMACList();
      macNumber++;
    }

    if (this.viewLeadListData.leadCustomerType != null) {
      const data = {
        value: this.viewLeadListData.leadCustomerType
      };
      this.customerGroupForm.controls.leadCustomerSubType.enable();
      this.getcustType(data);
    } else {
      this.customerGroupForm.controls.leadCustomerSubType.disable();
    }

    if (this.viewLeadListData.leadCustomerSector != null) {
      this.customerGroupForm.controls.leadCustomerSubSector.enable();
    } else {
      this.customerGroupForm.controls.leadCustomerSubSector.disable();
    }

    this.planGroupForm.patchValue({
      quantity: 1
    });

    this.customerGroupForm.patchValue({
      serviceareaid: Number(this.viewLeadListData.serviceareaid),
      leadCategory: this.viewLeadListData.leadCategory
    });
    if (this.customerGroupForm.value.leadIdentity == "circuit") {
      this.customerGroupForm.patchValue({
        invoiceType: "Group"
      });
    }
  }
  //TODO Need to get billable customer object in customer by id api and remove below api code for quick fix did this
  getBillableCust(billableCustomerId) {
    const url = "/customers/" + billableCustomerId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        var name = response.customers.firstname + " " + response.customers.lastname;
        this.billableCusList = [
          {
            name: name,
            id: billableCustomerId
          }
        ];
        this.customerGroupForm.patchValue({ billableCustomerId: billableCustomerId });
      },
      error => {}
    );
  }

  searchLead() {
    if (this.searchOption === "lastUpdateOn") {
      this.searchDeatil = this.datePipe.transform(this.searchDeatil, "yyyy-MM-dd");
    }

    if (!this.searchDeatil) {
      //this.getLeadList("");
      this.getEnterpriseLeadList();
      this.clearSearchLead();
    } else {
      if (
        !this.searchkey ||
        this.searchkey !== this.searchDeatil ||
        !this.searchkey2 ||
        this.searchkey2 !== this.optionValue
      ) {
        this.currentPageLeadListdata = 1;
      }
      this.searchkey = this.searchDeatil;
      this.searchkey2 = this.optionValue;
      if (this.showItemPerPage !== 1) {
        this.leadListdataitemsPerPage = this.showItemPerPage;
      }
      this.searchData.filters[0].filterValue = this.searchDeatil;
      this.searchData.filters[0].filterColumn = this.optionValue;
      this.searchData.page = this.currentPageLeadListdata;
      this.searchData.pageSize = this.leadListdataitemsPerPage;
      this.searchData.buids = this.currentLoginStaffData?.businessUnitIdsList;
      const url = "/leadMaster/enterpriseSearch";
      this.leadManagementService
        .postMethod(url, this.searchData, this.mvnoid, this.staffid)
        .subscribe(
          async (response: any) => {
            if (response.status === 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.errorMessage,
                icon: "far fa-times-circle"
              });
              this.leadListData = [];
            } else {
              await response.leadMasterList.content.forEach(item =>
                item.leadStatus === "Converted" ? (item.assigneeName = null) : ""
              );

              this.leadListData = await response.leadMasterList.content;

              this.leadListdatatotalRecords = await response.leadMasterList.totalElements;

              if (this.showItemPerPage > this.leadListdataitemsPerPage) {
                this.leadListDatalength = this.leadListData?.length % this.showItemPerPage;
              } else {
                this.leadListDatalength = this.leadListData?.length % this.leadListdataitemsPerPage;
              }
            }
          },
          (error: any) => {
            this.leadListdatatotalRecords = 0;
            if (error.error.status == 404) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
              this.leadListData = [];
            } else {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
              this.leadListData = [];
            }
          }
        );
    }
  }

  clearSearchLead() {
    this.searchDeatil = "";
    this.optionValue = "";
    this.searchOption = "name";
    this.fieldEnable = false;
    this.currentPageLeadListdata = 1;
    //this.getLeadList("");
    this.getEnterpriseLeadList();
  }

  optionValue: any;

  selSearchOption(event) {
    this.searchDeatil = "";
    this.optionValue = event;
    if (event) {
      this.fieldEnable = true;
    } else {
      this.fieldEnable = false;
    }
  }

  getParentCust(event) {
    if (event.value) {
      this.customerGroupForm.controls.invoiceType.enable();
      this.customerGroupForm.controls["invoiceType"].setValidators(Validators.required);
      this.customerGroupForm.controls["invoiceType"].updateValueAndValidity();
    } else {
      this.customerGroupForm.controls.invoiceType.disable();
      this.customerGroupForm.controls["invoiceType"].clearValidators();
      this.customerGroupForm.controls["invoiceType"].updateValueAndValidity();
    }
  }

  leadMasterObj: any;

  followUpScheduleScreenOpen(leadId) {
    this.myFinalCheck = false;
    this.isSpecificLeadOpen = false;
    this.openFollowUpSchedulling = true;
    this.openAuditTrailScreen = false;
    this.openLeadStatusScreen = false;
    this.openLeadNotesScreen = false;
    this.isServiceManagementOpen = false;
    this.isQuotationDetailOpen = false;
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isLeadDetailOpen = true;
    this.submitted = false;
    this.plansubmitted = false;
    this.isLeadEdit = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.iflocationFill = false;
    this.ifMyInvoice = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
    this.getFollowupList();

    const url = "/leadMaster/findById?leadId=" + leadId;

    this.leadManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.leadMasterObj = response.leadMaster;
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

  leadAuditList: any = [];
  tableWrapperAudit: any = "";
  scrollIdAudit: any = "";

  auditTrailScreenOpen(leadId) {
    this.myFinalCheck = false;
    this.isSpecificLeadOpen = false;
    this.openAuditTrailScreen = true;
    this.openLeadStatusScreen = false;
    this.openFollowUpSchedulling = false;
    this.openLeadNotesScreen = false;
    this.isServiceManagementOpen = false;
    this.isQuotationDetailOpen = false;
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isLeadDetailOpen = true;
    this.submitted = false;
    this.plansubmitted = false;
    this.isLeadEdit = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.iflocationFill = false;
    this.ifMyInvoice = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;

    const url = "/leadMaster/findAllLeadAudit/" + leadId;
    this.tableWrapperAudit = "";
    this.scrollIdAudit = "";
    this.leadManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.leadAuditList = response.leadAuditList;
        if (this.leadAuditList && this.leadAuditList?.length > 8) {
          this.tableWrapperAudit = "table-wrapper";
          this.scrollIdAudit = "table-scroll";
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

  requiredFollowupInfo: any;

  scheduleFollowupPopupOpen() {
    this.generateNameOfTheFollowUp(this.leadId);
    this.tempLeadId = this.leadId;
    this.followupFormsubmitted = false;
    this.followupPopupOpen = true;
    this.requiredFollowupInfo = {
      mvnoId: this.mvnoid,
      staffId: this.staffid,
      leadId: this.leadId
    };
    if (this.leadMasterObj?.nextApproveStaffId) {
      if (this.staffid == this.leadMasterObj?.nextApproveStaffId) {
        this.scheduleFollowup = true;
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail:
            "Sorry! you don't have access to schedule followup as current lead is assigned to " +
            this.leadMasterObj?.assigneeName,
          icon: "far fa-times-circle"
        });
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail:
          "Lead Assignee process is running. Please wait for few seconds and refresh the lead data and try again.",
        icon: "far fa-times-circle"
      });
    }
  }

  saveFollowup() {
    this.followupFormsubmitted = true;
    if (this.followupScheduleForm.valid) {
      const url = "/followUp/save";
      this.followupData = this.followupScheduleForm.value;
      this.followupData.leadMasterId = this.tempLeadId;
      const myFormattedDate = this.datePipe.transform(
        this.followupData.followUpDatetime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.followupData.followUpDatetime = myFormattedDate;
      this.leadManagementService
        .postMethod(url, this.followupData, this.mvnoid, this.staffid)
        .subscribe(
          (response: any) => {
            this.followupFormsubmitted = false;
            this.followupScheduleForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.scheduleFollowup = false;
            this.getFollowupList();
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
      this.followupFormsubmitted = false;
    }
  }

  rescheduleFollowUp(followUpDetails) {
    this.getReScheduleFollowUpRemarksList();
    this.generateNameOfTheReFollowUp(this.leadId);
    this.tempLeadId = this.leadId;
    this.followUpId = followUpDetails.id;
    this.reFollowupFormsubmitted = false;
    this.requiredFollowupInfo = {
      mvnoId: this.mvnoid,
      staffId: this.staffid,
      leadId: this.leadId
    };
    this.dateTime = new Date();
    this.dateTime =
      this.dateTime > new Date(followUpDetails.followUpDatetime)
        ? this.dateTime
        : new Date(followUpDetails.followUpDatetime);
    this.reScheduleFollowup = true;
  }

  saveReFollowup() {
    this.followupData = {};
    this.reFollowupFormsubmitted = true;
    if (this.reFollowupScheduleForm.valid) {
      this.followupData.leadMasterId = this.tempLeadId;

      this.followupData.isSend = false;
      this.followupData = this.reFollowupScheduleForm.value;
      this.followupData.leadMasterId = this.tempLeadId;
      const myFormattedDate = this.datePipe.transform(
        this.followupData.followUpDatetime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.followupData.followUpDatetime = myFormattedDate;
      const url =
        "/followUp/reSchedulefollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.followupData.remarksTemp;
      this.leadManagementService
        .postMethod(url, this.followupData, this.mvnoid, this.staffid)
        .subscribe(
          (response: any) => {
            this.reFollowupFormsubmitted = false;
            this.isfollowupIdEdit = false;
            this.reFollowupScheduleForm.reset();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.reScheduleFollowup = false;
            this.reFollowupFormsubmitted = false;
            this.getFollowupList();
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

  followUpId: any;

  closeFollowUp(followUpDetails) {
    this.closeFollowupFormsubmitted = false;
    this.followUpId = followUpDetails.id;
    this.closeFollowup = true;
  }

  closeActionFolloupPopup() {
    this.closeFollowup = false;
  }

  saveCloseFollowUp() {
    this.closeFollowupFormsubmitted = true;
    if (this.closeFollowupForm.valid) {
      var closeData = this.closeFollowupForm.value;

      const url =
        "/followUp/closefollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.closeFollowupForm.get("remarks").value;
      this.leadManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.closeFollowup = false;
          this.closeFollowupForm.reset();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.getFollowupList();
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

  tableWrapper: any = "";
  scrollId: any = "";

  getFollowupList() {
    const url = "/followUp/all/" + this.leadId;
    this.tableWrapper = "";
    this.scrollId = "";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      async (response: any) => {
        this.isfollowupIdEdit = true;
        this.followUpList = await response.followUpList;
        if (this.followUpList && this.followUpList?.length > 8) {
          this.tableWrapper = "table-wrapper";
          this.scrollId = "table-scroll";
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

  editFollowup(followupId) {
    if (followupId) {
      const url = "/followUp/findById/" + followupId;
      this.leadManagementService.getMethod(url).subscribe(
        async (response: any) => {
          this.isfollowupIdEdit = true;
          this.followupData = await response.followUp;
          this.followupScheduleForm.patchValue(this.followupData);
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

  followUpDetailsObj: any;

  remarkFollowUp(followUpDetails) {
    this.followUpDetailsObj = followUpDetails;
    this.remarkFollowupFormsubmitted = false;
    this.followUpId = followUpDetails.id;
    this.getfollowUpRemarkList(this.followUpId);
    this.remarkScheduleFollowup = true;
  }

  closeRemarkPopup() {
    this.remarkFollowupForm.reset();
    this.remarkFollowupFormsubmitted = false;
    this.remarkScheduleFollowup = false;
  }

  // leadApproveRejectForm: FormGroup;
  // leadApproveRejectFormsubmitted: boolean = false;
  // leadApproveRejectDto
  getAllRejectedReasonsList() {
    this.rejectedReasonService.getAllRejectedReasonsList().subscribe((res: any) => {
      this.rejectedReasons = res.rejectReasonList;
    });
  }

  labelFlag: any;
  leadObj: any;

  approveOrRejectLeadPopup(lead, flag) {
    if (lead.finalApproved) {
      if (flag === "Reject") {
        setTimeout(() => {
          //  this.getLeadList("");
          this.getEnterpriseLeadList();
        }, 1000);

        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "Assigned to the next staff",
          icon: "far fa-check-circle"
        });
      } else {
        this.editLead(lead.id, lead.finalApproved);
      }
    } else {
      this.approved = false;
      this.labelFlag = flag;
      this.leadObj = lead;
      if (flag === "Approve") {
        this.leadApproveRejectDto.approveRequest = true;
        this.leadApproveRejectForm.controls.rejectedReasonMasterId.clearValidators();
        this.leadApproveRejectForm.controls.rejectedReasonMasterId.updateValueAndValidity();
      }
      if (flag === "Reject") {
        this.leadApproveRejectDto.approveRequest = false;
        this.leadApproveRejectForm.controls.rejectedReasonMasterId.setValidators(
          Validators.required
        );
        this.leadApproveRejectForm.controls.rejectedReasonMasterId.updateValueAndValidity();
      }

      if (this.staffid) {
        this.leadApproveRejectDto.currentLoggedInStaffId = Number(this.staffid);
      }
      this.leadApproveRejectDto.firstname = lead.firstname;
      this.leadApproveRejectDto.username = lead.username;
      this.leadApproveRejectDto.flag = flag;
      this.leadApproveRejectDto.status = lead.leadStatus;
      if (this.mvnoid) {
        this.leadApproveRejectDto.mvnoId = Number(this.mvnoid);
      }
      if (lead.serviceareaid) {
        this.leadApproveRejectDto.serviceareaid = Number(lead.serviceareaid);
      }
      if (lead.id) {
        this.leadApproveRejectDto.id = Number(lead.id);
      }
      if (lead.buId) {
        this.leadApproveRejectDto.buId = Number(lead.buId);
      }
      if (lead.nextTeamMappingId) {
        this.leadApproveRejectDto.nextTeamMappingId = Number(lead.nextTeamMappingId);
      }
      this.leadApproveRejectFormsubmitted = false;
      this.approveOrRejectLeadPopupModel = true;
      this.getAllRejectedReasonsList();
    }
  }

  closeApproveOrRejectLeadPopup() {
    this.leadApproveRejectForm.reset();
    this.leadApproveRejectFormsubmitted = false;
    this.approveOrRejectLeadPopupModel = false;
  }

  isFinalApproved: boolean = false;

  approveOrRejectLead(leadObject: any) {
    if (leadObject?.finalApproved) {
      this.isFinalApproved = true;
    }

    this.leadApproveRejectFormsubmitted = true;
    let url = "/teamHierarchy/approveLead";

    if (this.leadApproveRejectForm.valid) {
      this.leadApproveRejectDto.remark = this.leadApproveRejectForm.controls.remark.value;
      this.leadApproveRejectDto.rejectedReasonMasterId =
        this.leadApproveRejectForm.controls.rejectedReasonMasterId.value;

      this.customerManagementService.updateMethod(url, this.leadApproveRejectDto).subscribe(
        async (response: any) => {
          this.leadApproveRejectFormsubmitted = false;
          this.leadApproveRejectForm.reset();
          if ((await response.dataList) && (await response.dataList.length) > 0) {
            this.approveLeadList = await response.dataList;
            this.approved = true;
          } else {
            this.approveOrRejectLeadPopupModel = false;
            if (this.leadApproveRejectDto.approveRequest) {
              if (response.data === "FINAL_APPROVED") {
                this.editLead(this.leadApproveRejectDto.id, true);
              } else {
                if (response.responseMessage === "Assigned to next staff") {
                  setTimeout(() => {
                    //this.getLeadList("");
                    this.getEnterpriseLeadList();
                  }, 3000);
                  this.messageService.add({
                    severity: "success",
                    summary: "Successfully",
                    detail: response.message,
                    icon: "far fa-check-circle"
                  });
                }
              }
            } else {
              setTimeout(() => {
                //this.getLeadList("");
                this.getEnterpriseLeadList();
              }, 3000);
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: "Rejected Successfully",
                icon: "far fa-check-circle"
              });
            }
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

  saveRemarkFollowUp() {
    this.remarkFollowupFormsubmitted = true;
    this.remarkFollowupForm.get("leadFollowUpId").setValue(this.followUpId);
    if (this.remarkFollowupForm.valid) {
      var data = this.remarkFollowupForm.value;

      const url = "/followUp/save/leadFollowUpRemark";
      this.leadManagementService.postMethod(url, data, this.mvnoid, this.staffid).subscribe(
        async (response: any) => {
          this.remarkScheduleFollowup = false;
          this.remarkFollowupForm.reset();
          await this.getFollowupList();

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

  followUpRemarkList: any = [];
  tableWrapperRemarks: any = "";
  scrollIdRemarks: any = "";

  getfollowUpRemarkList(id) {
    this.tableWrapperRemarks = "";
    this.scrollIdRemarks = "";

    const url = "/followUp/findAll/followUpRemark/" + id;
    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.followUpRemarkList = await response.followUpRemarkList;
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

  findStaffUserByLeadId(leadId) {
    const url = "/followUp/findStaffUserByLeadId/" + Number(leadId);
    this.followupScheduleService.getMethod(url).subscribe(
      async (response: any) => {
        if ((await response.status) === 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.getStaffDetailList = await response.staffUserList.content;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
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
    this.requiredFollowupInfo = {};
  }

  rejectReasonId: any;

  rejectLeadPopupOpen(leadId) {
    this.rejectedReasonList = [];
    this.leadId = leadId;
    this.rejectedReasonId = null;
    this.openRejectLeadPopup = true;
    this.rejectedReasonService.getMethod("/rejectReason/all").subscribe(
      async (response: any) => {
        response.rejectReasonList.content.forEach((item: any) =>
          item?.status === "Active" ? this.rejectedReasonList.push(item) : ""
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

  rejectedSubReasonArr: any;

  selectRejectedReason(id: any) {
    this.rejectedSubReasonArr = [];
    this.rejectedReasonId = id;
    this.rejectedReasonList?.forEach(source =>
      source.rejectSubReasonDtoList?.forEach(subreason =>
        subreason.rejectReasonId === this.rejectedReasonId
          ? this.rejectedSubReasonArr.push(subreason)
          : ""
      )
    );
  }

  rejectLead(leadId: any) {
    this.rejectedLeadFormSubmitted = true;
    if (this.rejectLeadFormGroup.valid) {
      if (leadId !== "") {
        let rejectDTOObj = {
          leadMasterId: leadId,
          rejectReasonId: this.rejectLeadFormGroup.controls.rejectReasonId.value,
          rejectSubReasonId: this.rejectLeadFormGroup.controls.rejectSubReasonId.value,
          remark: this.rejectLeadFormGroup.controls.remark.value
        };

        const url = "/leadMaster/lead/close";

        this.leadManagementService
          .postMethod(url, rejectDTOObj, this.mvnoid, this.staffid)
          .subscribe(
            async (response: any) => {
              this.rejectedLeadFormSubmitted = false;
              if ((await response.status) === 200) {
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-times-circle"
                });
                //this.getLeadList("");
                this.getEnterpriseLeadList();
                this.openRejectLeadPopup = false;

                this.rejectLeadFormGroup.reset();
              } else {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.message,
                  icon: "far fa-times-circle"
                });
                // this.getLeadList("");
                this.getEnterpriseLeadList();

                this.openRejectLeadPopup = false;
                this.rejectLeadFormGroup.reset();
              }
            },
            (error: any) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: error.error.ERROR,
                icon: "far fa-times-circle"
              });
              //this.getLeadList("");
              this.getEnterpriseLeadList();
              this.openRejectLeadPopup = false;

              this.rejectLeadFormGroup.reset();
            }
          );
      } else {
        this.openRejectLeadPopup = false;
        //this.getLeadList("");
        this.getEnterpriseLeadList();

        this.rejectLeadFormGroup.reset();
      }
    } else {
      this.openRejectLeadPopup = true;
    }
  }

  //get staff users from leadmaster controller in backend

  getStaffUsers: any;
  noRecordMsg: any;

  getStaffUsersFromLeadMaster() {
    const url = "/leadMaster/findAll/StaffUser?mvnoId=" + localStorage.getItem("mvnoId");

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        if ((await response?.status) === 200 && (await response?.message) !== "No Records Found") {
          this.getStaffUsers = await response?.staffUserList;
          this.noRecordMsg = "";
        } else {
          this.noRecordMsg = await response.message;
          this.getStaffUsers = [];
        }
      },
      (error: any) => {}
    );
  }

  // getCustPlanGroupDataopen(id, planGroupcustid) {
  //   this.PaymentamountService.show(id);
  //   this.planGroupcustid.next({
  //     planGroupcustid,
  //   });
  // }

  pageChangedcustMacAddDetailList(pageNumber) {
    this.currentPagecustMacAddList = pageNumber;
  }

  pageChangesOnCreateEdit(pageNumber) {
    this.currentPagecustMacMapppingList = pageNumber;
  }

  pageChangedcustChargeDetailList(pageNumber) {
    this.currentPagecustChargeDeatilList = pageNumber;
  }

  previousVendorList: any;

  getPreviousVendors() {
    const url = "/leadMaster/findAll/previousVendor?mvnoId=" + localStorage.getItem("mvnoId");

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        if ((await response.status) === 200) {
          let responseStr = await response.previousVendorList[0];
          this.previousVendorList = responseStr.split(",");
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  //close the 'Close Lead' popup
  closeRejectLeadPopup() {
    this.openRejectLeadPopup = false;
    this.rejectLeadFormGroup.reset();
  }

  showItemPerPageAudit = 1;
  workflowAuditDataI: any = [];
  currentPageMasterSlabI = 1;
  MasteritemsPerPageI = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecordsI: String;

  pageChangedMasterListI(pageNumber) {
    this.currentPageMasterSlabI = pageNumber;
    this.getWorkflowAuditList(this.leadMasterObj?.id);
  }

  TotalItemPerPageWorkFlow(event) {
    this.showItemPerPageAudit = Number(event.value);
    if (this.currentPageMasterSlabI > 1) {
      this.currentPageMasterSlabI = 1;
    }
    this.getWorkflowAuditList(this.leadMasterObj?.id);
  }

  getWorkflowAuditList(id) {
    let page = this.currentPageMasterSlabI;
    let page_list;
    if (this.showItemPerPageAudit == 1) {
      this.MasteritemsPerPageI = 5;
    } else {
      this.MasteritemsPerPageI = this.showItemPerPageAudit;
    }

    this.workflowAuditDataI = [];
    let data = {
      page: page,
      pageSize: this.MasteritemsPerPageI
    };

    let url1 = "/workflowaudit/list?entityId=" + id + "&eventName=" + "LEAD";

    this.customerManagementService.postMethod(url1, data).subscribe(
      (response: any) => {
        this.workflowAuditDataI = response.dataList;
        this.MastertotalRecordsI = response.totalRecords;
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

  statusRemarkScroll: any = "";
  teamHierarchyList: any = [];

  viewLeadStatusPopupOpen(id) {
    this.leadId = id;
    let urlLead = "/leadMaster/findById?leadId=" + id;
    this.leadManagementService.getMethod(urlLead).subscribe(
      async (response: any) => {
        if ((await response.status) === 200) {
          this.leadMasterObj = response.leadMaster;
          this.openLeadStatusScreen = true;
          this.isSpecificLeadOpen = false;
          this.openAuditTrailScreen = false;
          this.openFollowUpSchedulling = false;
          this.openLeadNotesScreen = false;
          this.isServiceManagementOpen = false;
          this.isQuotationDetailOpen = false;
          this.listView = false;
          this.createView = false;
          this.selectAreaList = false;
          this.selectPincodeList = false;
          this.isLeadDetailOpen = true;
          this.submitted = false;
          this.plansubmitted = false;
          this.isLeadEdit = false;
          this.isCustomerLedgerOpen = false;
          this.viewCustomerPaymentList = false;
          this.customerPlanView = false;
          this.customerStatusView = false;
          this.iflocationFill = false;
          this.ifMyInvoice = false;
          this.ifChargeGetData = false;
          this.ifWalletMenu = false;

          if (!this.leadMasterObj?.buId) {
            this.messageService.add({
              severity: "info",
              summary: "buid is required",
              detail: "buid is not present for this request.",
              icon: ""
            });
            return;
          }
          this.statusRemarkScroll = "";
            let mvnoId =
            localStorage.getItem("mvnoId") == "1"
             ? this.customerGroupForm.value?.mvnoId
             : Number(localStorage.getItem("mvnoId"));
          // const url = `/teamHierarchy/getApprovalProgress?entityId=${id}&eventName=LEAD`;
          const url =
            "/teamHierarchy/getApprovalProgressForLead?buId=" +
            this.leadMasterObj?.buId +
            "&mvnoId=" +
            mvnoId +
            "&nextTeamHierarchyMappingId=" +
            this.leadMasterObj?.nextTeamMappingId;
          this.teamHierarchyList = [];
          if (this.leadMasterObj?.nextTeamMappingId) {
            this.leadManagementService.getMethodForAdoptApi(url).subscribe(
              (response: any) => {
                if (response.responseCode === 200) {
                  this.teamHierarchyList = response.dataList;
                } else {
                  this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: response.errorMessage,
                    icon: "far fa-times-circle"
                  });
                }
              },
              (error: any) => {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: error.error.errorMessage,
                  icon: "far fa-times-circle"
                });
              }
            );
          } else {
            this.messageService.add({
              severity: "info",
              summary: "Approval configure",
              detail:
                "Workflow will be started after first approval. So, please approve first and then check status.",
              icon: ""
            });
          }
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.errorMessage,
          icon: "far fa-times-circle"
        });
      }
    );
    this.getWorkflowAuditList(this.leadId);
  }

  // getActiveCustomerForSaveLead(mobile: any) {
  //   const url = "/customers/getActiveCustomersList/" + mobile;
  //   this.customerManagementService.getMethod(url).subscribe(async (response: any) => {
  //     this.activeCustomers = await response.dataList;
  //   });
  // }

  specificExistingCust: any;
  myArr: any;
  leadExistingCustomerFlag: boolean = false;

  selectLeadExistingCustomer(leadCat: any, existingCustId: any) {
    if (leadCat === "Existing Customer") {
      if (existingCustId) {
        this.leadExistingCustomerFlag = true;
        // this.myArr = _.filter(this.activeCustomers, (item: any) => {
        //   return item.id === existingCustId;
        // });
        let result =
          this.activeCustomers && this.activeCustomers.length > 0
            ? this.activeCustomers.filter(c => c.id === existingCustId)
            : this.activeCustByUsername.filter(c => c.id === existingCustId);
        this.specificExistingCust = {};
        this.specificExistingCust = result[0];

        if (this.payMappingListFromArray.controls) {
          this.payMappingListFromArray.controls = [];
        }
        if (this.overChargeListFromArray.controls) {
          this.overChargeListFromArray.controls = [];
        }
        if (this.custMacMapppingListFromArray.controls) {
          this.custMacMapppingListFromArray.controls = [];
        }

        // this.customerGroupForm.patchValue({
        //   serviceareaid: this.specificExistingCust.serviceareaid,
        // });
        this.customerGroupForm.patchValue({
          serviceareaid: this.specificExistingCust.serviceareaid,
          branchId: this.specificExistingCust.branch != null ? this.specificExistingCust.branch : ""
        });
        if (this.specificExistingCust.serviceareaid != null) {
          this.getServiceByServiceAreaID(this.specificExistingCust.serviceareaid);
          this.getBranchByServiceAreaID(this.specificExistingCust.serviceareaid);
        }
        if (this.specificExistingCust.branch != null) {
          this.customerGroupForm.patchValue({
            branchId:
              this.specificExistingCust.branch != null ? this.specificExistingCust.branch : ""
          });
        }

        this.specificExistingCust?.serviceareaid
          ? (this.serviceareaCheck = false)
          : (this.serviceareaCheck = true);

        if (this.specificExistingCust.planMappingList[0]) {
          this.customerGroupForm.patchValue({
            billTo: this.specificExistingCust.planMappingList[0].billTo
          });
        }

        this.customerGroupForm.get("isCustCaf").setValue("yes");
        // this.specificExistingCust.custtype;
        if (this.specificExistingCust.custtype == "Prepaid") {
          let obj = {};
          this.filterPlanData = [];
          if (this.postpaidplanData?.length != 0) {
            obj = this.postpaidplanData.filter(key => key.plantype === "Prepaid");
          }
          this.filterPlanData = obj;
          obj = {};
        } else if (this.specificExistingCust.custtype == "Postpaid") {
          let obj = {};
          this.filterPlanData = [];
          if (this.postpaidplanData?.length != 0) {
            obj = this.postpaidplanData.filter(key => key.plantype === "Postpaid");
          }
          this.filterPlanData = obj;
          obj = {};
        } else {
          let obj = {};
          this.filterPlanData = [];
          if (this.postpaidplanData?.length != 0) {
            obj = this.postpaidplanData.filter(key => key.plantype === "Prepaid");
          }
          this.filterPlanData = obj;
          obj = {};
        }

        //Address
        if (this.specificExistingCust.addressList?.length > 0) {
          if (this.specificExistingCust.addressList[0].addressType) {
            this.getTempPincodeData(this.specificExistingCust.addressList[0].pincodeId, "present");
            this.getAreaData(this.specificExistingCust.addressList[0].areaId, "present");
            this.presentGroupForm.patchValue(this.specificExistingCust.addressList[0]);
          }
          if (this.specificExistingCust.addressList != null) {
            this.specificExistingCust.addressList.forEach(element => {
              if ("Payment" == element.addressType) {
                this.getTempPincodeData(element.pincodeId, "payment");
                this.getAreaData(element.areaId, "payment");
                this.paymentGroupForm.patchValue(element);
                this.selectAreaListPayment = true;
                this.selectPincodeListPayment = true;
              } else if ("Permanent" == element.addressType || "permanent" == element.addressType) {
                this.getTempPincodeData(element.pincodeId, "permanent");
                this.getAreaData(element.areaId, "permanent");
                this.permanentGroupForm.patchValue(element);
                this.selectAreaListPermanent = true;
                this.selectPincodeListPermanent = true;
              }
            });
          }
        }

        if (this.specificExistingCust.plangroupid) {
          this.ifIndividualPlan = false;
          this.ifPlanGroup = true;
          this.planCategoryForm.patchValue({
            planCategory: "groupPlan"
          });
          this.getPlangroupByPlan(this.specificExistingCust.plangroupid);
          this.customerGroupForm.patchValue({
            plangroupid: this.specificExistingCust.plangroupid
          });
        } else {
          this.ifIndividualPlan = true;
          this.ifPlanGroup = false;

          this.planCategoryForm.patchValue({
            planCategory: "individual"
          });

          //plan deatils

          let newAmount = 0;
          let totalAmount = 0;
          let disValue = 0;
          this.discountValue = 0;
          this.DiscountValueStore = [];
          this.specificExistingCust.planMappingList.forEach((element, i) => {
            if (element.planId) {
              const planAmount = "";
              let validityUnit = "";
              const url =
                "/postpaidplan/" + element.planId + "?mvnoId=" + localStorage.getItem("mvnoId");
              this.customerManagementService.getMethod(url).subscribe((response: any) => {
                this.planDropdownInChageData.push(response.postPaidPlan);
                let postpaidplanData = response.postPaidPlan;
                validityUnit = response.postPaidPlan.unitsOfValidity;
                this.payMappingListFromArray.push(
                  this.fb.group({
                    service: element.service,
                    planId: element.planId,
                    validity: element.planValidityDays,
                    offerPrice: element.offerPrice,
                    newAmount: element.newAmount,
                    discount: element.discount,
                    istrialplan: element.istrialplan,
                    billTo: element.billTo,
                    isInvoiceToOrg: element.isInvoiceToOrg
                  })
                );
                this.validityUnitFormArray.push(
                  this.fb.group({
                    validityUnit
                  })
                );

                let n = i + 1;
                newAmount = postpaidplanData.newOfferPrice
                  ? postpaidplanData.newOfferPrice
                  : postpaidplanData.offerprice;
                totalAmount = Number(totalAmount) + Number(newAmount);

                if (this.specificExistingCust.planMappingList.length == n) {
                  this.planDataForm.patchValue({
                    offerPrice: totalAmount
                  });

                  this.payMappingListFromArray.value.forEach((e, k) => {
                    let discountValueNUmber: any = 0;
                    let lastvalue: any = 0;
                    let m = i + 1;
                    let price = Number(this.payMappingListFromArray.value[k].offerPrice);
                    let discount = Number(this.payMappingListFromArray.value[k].discount);
                    let DiscountV = (price * discount) / 100;
                    discountValueNUmber = DiscountV.toFixed(3);
                    let discountValue =
                      Number(this.payMappingListFromArray.value[k].offerPrice) -
                      Number(discountValueNUmber);
                    this.discountValue = Number(discountValue);

                    this.DiscountValueStore.push({ value: this.discountValue });
                    if (this.discountValue == 0) {
                      disValue =
                        Number(this.payMappingListFromArray.value[k].offerPrice) +
                        Number(this.planDataForm.value.discountPrice);
                    } else {
                      disValue =
                        Number(this.discountValue) + Number(this.planDataForm.value.discountPrice);
                    }

                    if (this.specificExistingCust.planMappingList.length == m) {
                      this.planDataForm.patchValue({
                        discountPrice: disValue
                      });
                    }
                  });
                }
              });
            }
          });
        }
      }
    }
  }

  reopenLeadConfirmation(id: any, status: any) {
    if (id && status) {
      this.confirmationService.confirm({
        message: "Do you surely want to reopen the lead?",
        header: "Lead Re-Open Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          const url = "/leadMaster/lead/reopen/" + id;
          this.leadManagementService.getMethod(url).subscribe(
            async (res: any) => {
              // console.log(await res);
              await this.wait(800);
              //  await this.getLeadList("");
              this.getEnterpriseLeadList();
              this.searchOption = "name";
              this.searchDeatil = "";

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: await res.message,
                icon: "far fa-times-circle"
              });
            },
            (error: any) => {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: "Something went wrong while reopening the lead!!" + error,
                icon: "far fa-times-circle"
              });
              // this.getLeadList("");
              this.getEnterpriseLeadList();
            }
          );
        },
        reject: () => {
          this.messageService.add({
            severity: "info",
            summary: "Rejected",
            detail: "You have rejected the request."
          });
        }
      });
    }
  }

  selectFeasibility(feasibilityValue: any) {
    if (feasibilityValue === "N/A") {
      this.customerGroupForm.controls["feasibilityRemark"].setValidators(Validators.required);
      this.customerGroupForm.controls["feasibilityRemark"].updateValueAndValidity();
    } else {
      this.customerGroupForm.controls["feasibilityRemark"].clearValidators();
      this.customerGroupForm.controls["feasibilityRemark"].updateValueAndValidity();
    }
  }

  onKey(username) {
    // if (event.key == "Tab") {
    //   const url =
    //     "/customer/customerUsernameIsAlreadyExists/" +
    //     this.customerGroupForm.controls.username.value;
    //   this.customerManagementService.getMethod(url).subscribe(async (response: any) => {
    //     if ((await response.isAlreadyExists) == true) {
    //       this.messageService.add({
    //         severity: "error",
    //         summary: "Error ",
    //         detail: "Username already exists!!",
    //         icon: "far fa-times-circle",
    //       });
    //     }
    //   });
    // }
    if (!this.activeCustomers || this.activeCustomers.length === 0) {
      const url = "/customers/getActiveCustomersList/username/" + username;
      this.customerManagementService.getMethod(url).subscribe((response: any) => {
        this.activeCustByUsername = response.dataList;

        if (this.activeCustByUsername && this.activeCustByUsername.length > 0) {
          this.confirmationService.confirm({
            message:
              "Are you surely going to create a lead based on username for this existing customer?",
            header: "Existing Customer Confirmation For This Lead",
            icon: "pi pi-info-circle",
            accept: () => {
              this.keyword = "Existing Customer";
              this.customerGroupForm.patchValue({
                leadCategory: this.keyword,
                existingCustomerId: this.activeCustByUsername[0].id
              });
              this.selectLeadExistingCustomer(this.keyword, this.activeCustByUsername[0].id);
            },
            reject: () => {
              this.messageService.add({
                severity: "info",
                summary: "Rejected",
                detail: "You have rejected the request!"
              });

              this.keyword = "New Lead";
              this.isLeadEdit = false;
              this.ifPlanGroup = false;
              this.leadExistingCustomerFlag = false;
              this.customerGroupForm.controls.serviceareaid.reset();
              this.serviceareaCheck = true;
              this.customerGroupForm.controls.addressList.reset();
              this.customerGroupForm.controls.billTo.enable();
              this.payMappingListFromArray.controls
                ? (this.payMappingListFromArray.controls = [])
                : "";
              this.customerGroupForm.controls.planMappingList.reset();
              this.presentGroupForm.reset();
              this.paymentGroupForm.reset();
              this.permanentGroupForm.reset();
              this.planCategoryForm.reset();
              this.planDataForm.reset();
              // this.customerGroupForm.reset();
              this.customerGroupForm.patchValue({
                leadCategory: this.keyword
              });
            }
          });
        } else {
          this.leadExistingCustomerFlag = false;
          // this.customerGroupForm.controls["leadCategory"].disable();

          this.keyword = "New Lead";
          this.customerGroupForm.patchValue({
            leadCategory: this.keyword
          });
        }
      });
    }
  }

  myLeadId: any;
  planMappingListLength: number = 0;
  leadToCAFConversion() {
    let url: any;
    let i,
      j,
      K = 0;

    this.submitted = true;

    this.customerGroupForm.controls["invoiceType"].clearValidators();
    this.customerGroupForm.controls["invoiceType"].updateValueAndValidity();

    if (this.customerGroupForm.valid && this.presentGroupForm.valid) {
      if (
        this.customerGroupForm.value.custlabel === "organization" ||
        this.customerGroupForm.value.planMappingList.length > 0 ||
        this.customerGroupForm.value.plangroupid ||
        this.customerGroupForm.value.custlabel === "customer"
      ) {
        this.myLeadId =
          this.myLeadId && this.myLeadId !== ""
            ? this.myLeadId
            : this.customerGroupForm.controls.id.value;

        this.customerGroupForm.controls.id.setValue("");

        if (this.presentGroupForm.value.landmark !== null) {
          this.addressListData.push(this.presentGroupForm.value);
        } else {
          this.addressListData = [];
        }
        if (this.paymentGroupForm.value.addressType) {
          this.addressListData.push(this.paymentGroupForm.value);
        }
        if (this.permanentGroupForm.value.addressType) {
          this.addressListData.push(this.permanentGroupForm.value);
        }
        if (
          this.customerGroupForm.value.countryCode == "" ||
          this.customerGroupForm.value.countryCode == null
        ) {
          this.customerGroupForm.value.countryCode = this.commondropdownService.commonCountryCode;
        }
        if (
          this.customerGroupForm.value.calendarType == "" ||
          this.customerGroupForm.value.calendarType == null
        ) {
          this.customerGroupForm.value.calendarType = "English";
        }

        this.customerPojo = this.customerGroupForm.value;

        //Need to check for entriprise customer
        if (this.isPlanOnDemand) {
          this.customerPojo.planMappingList.forEach((obj: any) =>
            obj.istrialplan ? (obj.istrialplan = true) : (obj.istrialplan = false)
          );

          for (let item of this.customerPojo.planMappingList) {
            if (item.istrialplan) {
              this.customerPojo.istrialplan = true;
              break;
            }
          }
        }

        this.customerPojo.addressList = this.addressListData;

        this.customerPojo.failcount = Number(this.customerPojo.failcount);
        this.customerPojo.partnerid = Number(this.customerPojo.partnerid);
        this.customerPojo.mobile = Number(this.customerPojo.mobile);
        this.customerPojo.paymentDetails = {
          amount:
            this.customerPojo.paymentDetails.amount && this.customerPojo.paymentDetails.amount !== 0
              ? Number(this.customerPojo.paymentDetails.amount)
              : 0,
          paymentdate: this.customerPojo.paymentDetails.paymentdate
            ? this.customerPojo.paymentDetails.paymentdate
            : null,
          paymode: this.customerPojo.paymentDetails.paymode
            ? this.customerPojo.paymentDetails.paymode
            : null,
          referenceno: this.customerPojo.paymentDetails.referenceno
            ? this.customerPojo.paymentDetails.referenceno
            : null
        };

        while (j < this.customerPojo.planMappingList.length) {
          this.customerPojo.planMappingList[j].planId = Number(
            this.customerPojo.planMappingList[j].planId
          );
          if (this.customerPojo.planMappingList[j].discount == null) {
            this.customerPojo.planMappingList[j].discount = 0;
          }
          j++;
        }

        while (K < this.customerPojo.overChargeList.length) {
          this.customerPojo.overChargeList[K].chargeid = Number(
            this.customerPojo.overChargeList[K].chargeid
          );
          this.customerPojo.overChargeList[K].validity = Number(
            this.customerPojo.overChargeList[K].validity
          );
          this.customerPojo.overChargeList[K].price = Number(
            this.customerPojo.overChargeList[K].price
          );
          this.customerPojo.overChargeList[K].actualprice = Number(
            this.customerPojo.overChargeList[K].actualprice
          );
          K++;
        }

        while (i < this.customerPojo.addressList.length) {
          this.customerPojo.addressList[i].areaId = Number(this.customerPojo.addressList[i].areaId);
          this.customerPojo.addressList[i].pincodeId = Number(
            this.customerPojo.addressList[i].pincodeId
          );
          this.customerPojo.addressList[i].cityId = Number(this.customerPojo.addressList[i].cityId);
          this.customerPojo.addressList[i].stateId = Number(
            this.customerPojo.addressList[i].stateId
          );
          this.customerPojo.addressList[i].countryId = Number(
            this.customerPojo.addressList[i].countryId
          );
          i++;
        }
        this.customerPojo.isCustCaf = "yes";

        //Need to check for entriprise customer
        if (this.isPlanOnDemand) {
          if (this.customerGroupForm.value.plangroupid) {
            this.customerPojo.planMappingList = this.plansArray.value;
          }
        }

        this.customerPojo.leadId = this.myLeadId;
        this.customerGroupForm.value.flatAmount = this.planDataForm.value.discountPrice;
        this.customerGroupForm.controls.leadNo.value
          ? (this.customerPojo.leadNo = this.customerGroupForm.controls.leadNo.value)
          : "";

        if (this.customerGroupForm.value.leadCategory == "Existing Customer") {
          this.customerPojo.id = this.customerGroupForm.value.existingCustomerId;
          // this.customerPojo.planMappingList = planMappingList;
          this.customerPojo.staus = "New Activation";
          let addServiceUrl = "/subscriber/addNewService?serviceFor=" + "Existing Lead";
          this.leadToCaf(addServiceUrl, this.customerPojo);

          // const customerAllData = this.customerPojo;
          // const customerPlanMappingList = customerAllData.planMappingList;
          // for (let i = 0; i < this.planMappingListLength; i++) {
          //   setTimeout(() => {
          //     let data: any = [];
          // let responseCustomer: any = [];
          // let urlcust = "/customers";
          // data = this.customerPojo;
          // data.planMappingList = [customerPlanMappingList[i]];
          // data.parentExperience = "Single";
          // data.invoiceType = "Group";
          // data.id = this.customerGroupForm.value.existingCustomerId;
          // data.parentCustomerId = this.customerGroupForm.value.existingCustomerId;
          // data.staus = "New Activation";
          // let addServiceUrl = "/subscriber/addNewService?serviceFor=" + "Existing Lead";
          // let length = i + 1;
          // this.customerManagementService.postMethod(addServiceUrl, data).subscribe(
          //   (response: any) => {
          //     if (response.status === 200) {
          //       if (length == this.planMappingListLength) {
          //         this.submitted = false;
          //         this.addEditLead(this.myLeadId, response.customer.id);
          //       }
          //
          //     } else {
          //
          //       this.messageService.add({
          //         severity: "error",
          //         summary: "Error",
          //         detail: response.message,
          //         icon: "far fa-times-circle",
          //       });
          //     }
          //   },
          //   (error: any) => {
          //
          //     this.messageService.add({
          //       severity: "error",
          //       summary: "Error",
          //       detail: error.error.ERROR,
          //       icon: "far fa-times-circle",
          //     });
          //   }
          // );
          // }, 12000);
          // }
        } else {
          let planMappingData: any = [];
          let planlength = Number(this.planMappingList.length) - 1;

          this.planMappingList.forEach((element, i) => {
            let data = {
              billTo: element.billTo ? element.billTo : "customer",
              discount: element.discount,
              discountExpiryDate: element.discountExpiryDate,
              discountType: element.discountType,
              isInvoiceToOrg: element.isInvoiceToOrg,
              istrialplan: element.istrialplan,
              newAmount: element.newAmount,
              offerPrice: element.offerPrice,
              planId: element.planId,
              service: element.service,
              validity: element.validity,
              linkAcceptanceDTO: element.linkAcceptanceDTO
            };
            if (data.planId !== null) {
              planMappingData.push(data);
            }
            if (planlength == i) {
              this.customerPojo.planMappingList = planMappingData;
              this.customerPojo.staus = "New Activation";
              url = "/customers";
              this.customerPojo.mvnoId = localStorage.getItem("mvnoId");
              this.leadToCaf(url, this.customerPojo);
            }
          });
        }
      } else {
        this.scrollToError();
        this.messageService.add({
          severity: "error",
          summary: "Required ",
          detail: "Minimum one Plan Details need to add",
          icon: "far fa-times-circle"
        });
      }
    } else {
      this.scrollToError();
      this.messageService.add({
        severity: "error",
        summary: "Required",
        detail: "Fields are Mandatory or Invalid. Please fill or update those field.",
        icon: "far fa-times-circle"
      });
    }
  }

  leadToCaf(url, data) {
    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.submitted = false;
          this.addEditLead(this.myLeadId, response.customer.id);
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.message,
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.addressListData = [];

        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }
  pageChangedcustPlanDetailList(pageNumber) {
    this.currentPagecustPlanDeatilList = pageNumber;
  }

  selectPlanType(planType: any) {}

  selectLeadVarietType(leadvariety: any) {}

  searchLocation() {
    if (this.searchLocationForm.valid) {
      const url =
        "/serviceArea/getPlaceId?query=" + this.searchLocationForm.value.searchLocationname.trim();
      this.adoptCommonBaseService.get(url).subscribe(
        async (response: any) => {
          this.searchLocationData = response.locations;
        },
        (error: any) => {
          if (error.error.code == 422) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.error,
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
  }

  clearLocationForm() {
    this.searchLocationForm.reset();
    this.searchLocationData = [];
  }

  pageChangedSearchLocationList(currentPage) {
    this.currentPagesearchLocationList = currentPage;
  }

  clearsearchLocationData() {
    this.searchLocationData = [];
    this.ifsearchLocationModal = false;
    this.searchLocationForm.reset();
  }

  filedLocation(placeId) {
    const url = "/serviceArea/getLatitudeAndLongitude?placeId=" + placeId;
    this.adoptCommonBaseService.get(url).subscribe(
      async (response: any) => {
        this.ifsearchLocationModal = false;
        this.customerGroupForm.patchValue({
          latitude: await response.location.latitude,
          longitude: await response.location.longitude
        });

        this.iflocationFill = true;
        this.closebutton.nativeElement.click();
        this.searchLocationData = [];
        this.searchLocationForm.reset();
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

  approved = false;
  approveLeadList = [];
  selectStaff: any;
  selectStaffReject: any;

  assignToStaff(flag) {
    let url: any;

    if (!this.selectStaff && !this.selectStaffReject) {
      url = `/teamHierarchy/assignEveryStaff?entityId=${
        this.leadApproveRejectDto.id
      }&eventName=${"LEAD"}&isApproveRequest=${flag == "Approve"}`;
    } else {
      if (flag == "Approve") {
        url = `/teamHierarchy/assignFromStaffListForLead?eventName=${"LEAD"}&nextAssignStaff=${this.selectStaff}`;
      } else {
        url = `/teamHierarchy/assignFromStaffListForLead?eventName=${"LEAD"}&nextAssignStaff=${this.selectStaffReject}`;
      }
    }

    //

    if (!this.selectStaff && !this.selectStaffReject) {
      this.customerManagementService.getMethod(url).subscribe(
        async (response: any) => {
          this.approveOrRejectLeadPopupModel = false;
          // await this.getLeadList("");
          await this.getEnterpriseLeadList();
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
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
          this.approveOrRejectLeadPopupModel = false;
          //this.getLeadList("");
          this.getEnterpriseLeadList();
        }
      );
    } else {
      // if (flag == "Approve") {

      this.leadApproveRejectDto.rejectedReasonMasterId = this.leadApproveRejectDto
        .rejectedReasonMasterId
        ? this.leadApproveRejectDto.rejectedReasonMasterId
        : null;

      this.leadApproveRejectDto.teamName = this.leadApproveRejectDto.teamName
        ? this.leadApproveRejectDto.teamName
        : null;
      this.leadApproveRejectDto.username = this.leadApproveRejectDto.username
        ? this.leadApproveRejectDto.username
        : null;
      this.customerManagementService.postMethod(url, this.leadApproveRejectDto).subscribe(
        async (response: any) => {
          this.approveOrRejectLeadPopupModel = false;
          //await this.getLeadList("");
          await this.getEnterpriseLeadList();
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
        (error: any) => {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
          this.approveOrRejectLeadPopupModel = false;
          //this.getLeadList("");
          this.getEnterpriseLeadList();
        }
      );
      // } else {
      //   console.log("Else Assign Staff ::: ", url);
      //   console.log("Else Assign leadApproveRejectDto ::: ", this.leadApproveRejectDto);
      // this.customerManagementService.postMethod(url, this.leadApproveRejectDto).subscribe(
      //   async (response: any) => {
      //     console.log(await response);
      //     $("#approveOrRejectLeadPopup").modal("hide");
      //     await this.getLeadList("");
      //     this.messageService.add({
      //       severity: "success",
      //       summary: "Successfully",
      //       detail: "Rejected successfully.",
      //       icon: "far fa-times-circle",
      //     });
      //   },
      //   (error: any) => {
      //     this.messageService.add({
      //       severity: "error",
      //       summary: "Error",
      //       detail: error.error.ERROR,
      //       icon: "far fa-times-circle",
      //     });
      //     $("#approveOrRejectLeadPopup").modal("hide");
      //     this.getLeadList("");
      //
      //   }
      // );
      // }
    }
  }

  // existingPlanMappingArray: any;
  myCategory: any = "";

  selectLeadCategory(leadCat: any, value: any) {
    // this.customerGroupForm.controls["leadCategory"].enable();
    if (leadCat === "Existing Customer") {
      this.modalOpenextingCustomer();
      this.planGroupForm.patchValue({
        quantity: 1
      });
      // if (this.customerGroupForm.controls.mobile.value) {
      //   // this.getActiveCustomerForSaveLead(this.customerGroupForm.controls.mobile.value);
      //   const url = "/customers/getActiveCustomersList/" + value;
      //   this.customerManagementService.getMethod(url).subscribe((response: any) => {
      //     this.activeCustomers = response.dataList;
      //     console.log(
      //       "this.activeCustomers on selectLeadCategory() function => ",
      //       this.activeCustomers
      //     );
      //     if (this.activeCustomers && this.activeCustomers.length > 0) {
      //       this.keyword = "Existing Customer";
      //       this.customerGroupForm.patchValue({
      //         leadCategory: this.keyword,
      //         existingCustomerId: this.activeCustomers[0].id,
      //       });

      //       this.selectLeadExistingCustomer(this.keyword, this.activeCustomers[0].id);
      //       console.log("this.activeCustomers.status => ", this.specificExistingCust.status);
      //     }
      //   });
      // } else if (!this.activeCustomers || this.activeCustomers.length === 0) {
      //   const url = "/customers/getActiveCustomersList/username/" + value;
      //   this.customerManagementService.getMethod(url).subscribe((response: any) => {
      //     this.activeCustByUsername = response.dataList;
      //     console.log(
      //       "this.activeCustByUsername on selectLeadCategory() function => ",
      //       this.activeCustByUsername
      //     );
      //     if (this.activeCustByUsername && this.activeCustByUsername.length > 0) {
      //       this.keyword = "Existing Customer";
      //       this.customerGroupForm.patchValue({
      //         leadCategory: this.keyword,
      //         existingCustomerId: this.activeCustByUsername[0].id,
      //       });

      //       this.selectLeadExistingCustomer(this.keyword, this.activeCustByUsername[0].id);
      //       console.log("this.activeCustByUsername.status => ", this.specificExistingCust.status);
      //     }
      //   });
      // } else {
      //   this.messageService.add({
      //     severity: "error",
      //     summary: "Error",
      //     detail: "Mobile/Username not found!",
      //     icon: "far fa-times-circle",
      //   });
      // }
      // this.myCategory = "";
    } else {
      this.checkExit("create");
      // this.ifPlanGroup = false;
      // this.leadExistingCustomerFlag = false;
      // this.customerGroupForm.controls.serviceareaid.reset();
      // this.serviceareaCheck = true;
      // this.customerGroupForm.controls.addressList.reset();
      // this.customerGroupForm.controls.billTo.enable();
      // this.payMappingListFromArray.controls ? (this.payMappingListFromArray.controls = []) : "";
      // this.customerGroupForm.controls.planMappingList.reset();
      // this.presentGroupForm.reset();
      // this.paymentGroupForm.reset();
      // this.permanentGroupForm.reset();
      // this.planCategoryForm.reset();
      // this.planDataForm.reset();
      // this.myCategory = "";
    }
  }

  getChargeType() {
    let url = "/commonList/generic/chargetype";
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.chargeType = response.dataList;
    });
  }

  getLeadTypeList() {
    const url = "/leadMaster/findAll/leadType?mvnoId=" + localStorage.getItem("mvnoId");
    this.leadManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.leadTypeList && response.leadTypeList?.length > 0) {
          this.leadTypes = response.leadTypeList[0].split(",");
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

  getServiceTypeList() {
    const url = "/leadMaster/findAll/servicerType?mvnoId=" + localStorage.getItem("mvnoId");
    this.leadManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.servicerTypeList && response.servicerTypeList?.length > 0) {
          this.servicerTypeList = response.servicerTypeList[0].split(",");
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

  getFeasibilityList() {
    const url = "/leadMaster/findAll/feasibility?mvnoId=" + localStorage.getItem("mvnoId");
    this.leadManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.feasibility && response.feasibility?.length > 0) {
          this.feasibilityOptions = response.feasibility[0].split(",");
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

  // getConnectionTypeList() {
  //   const url = "/commonList/connectiontype";
  //   this.leadManagementService.getConnection(url).subscribe(
  //     (response: any) => {
  //       if (response.dataList && response.dataList?.length > 0) {
  //         this.connectiontypeList = response.dataList;
  //       }
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }

  // getLinkTypeList() {
  //   const url = "/commonList/linktype";
  //   this.leadManagementService.getLinkTypes(url).subscribe(
  //     (response: any) => {
  //       if (response.dataList && response.dataList?.length > 0) {
  //         this.linktypeList = response.dataList;
  //       }
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }

  // getCircuitAreaTypeList() {
  //   const url = "/commonList/circuitarea";
  //   this.leadManagementService.getConnection(url).subscribe(
  //     (response: any) => {
  //       if (response.dataList && response.dataList?.length > 0) {
  //         this.circuitareaList = response.dataList;
  //       }
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }

  // getBusinessVerticalsTypeList() {
  //   const url = "/businessverticals/all";
  //   this.leadManagementService.getBusinessVerticals(url).subscribe(
  //     (response: any) => {
  //       if (response.dataList && response.dataList?.length > 0) {
  //         this.businessVerticalsList = response.dataList;
  //       }
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }

  // getSubBusinessVerticalsTypeList() {
  //   const url = "/subbusinessunit/all";
  //   this.leadManagementService.getSubBusinessVerticals(url).subscribe(
  //     (response: any) => {
  //       if (response.dataList && response.dataList?.length > 0) {
  //         this.subbusinessVerticalsList = response.dataList;
  //       }
  //     },
  //     (error: any) => {
  //       this.messageService.add({
  //         severity: "error",
  //         summary: "Error",
  //         detail: error.error.ERROR,
  //         icon: "far fa-times-circle",
  //       });
  //     }
  //   );
  // }

  generatedLeadNo: any;

  generateLeadNo() {
    const url = "/leadMaster/generateLeadNo?mvnoId=" + localStorage.getItem("mvnoId");

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.generatedLeadNo = await response.leadNo;

        this.generatedLeadNo
          ? this.customerGroupForm.controls["leadNo"].setValue(this.generatedLeadNo)
          : "";
      },
      async (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong with 'Lead No.' Generation",
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

  discountvaluesetPercentage(e) {
    let data = [];
    let price = Number(this.planDataForm.controls["offerPrice"].value);
    let discount = Number(this.planDataForm.controls["discountPrice"].value);
    // let DisValue = this.planDataForm.value.offerPrice - this.planDataForm.value.discountPrice;
    let discountPlan = (discount * 100) / price;
    let discountValueNUmber = discountPlan.toFixed(3);
    let value = 100 - Number(discountValueNUmber);

    if (this.ifPlanGroup) {
      if (discount == 0) {
        this.customerGroupForm.patchValue({
          discount: 0
        });
      } else {
        this.customerGroupForm.patchValue({
          discount: value.toFixed(3)
        });
      }
    } else {
      this.payMappingListFromArray.value.forEach((element, i) => {
        let n = i + 1;
        if (discount == 0) {
          element.discount = 0;
        } else {
          element.discount = value.toFixed(3);
        }

        if (this.payMappingListFromArray.value.length == n) {
          this.payMappingListFromArray.patchValue(this.payMappingListFromArray.value);
        }
      });
    }
  }

  discountPercentage(e) {
    if (this.ifPlanGroup) {
      let price = Number(this.planDataForm.value.offerPrice);
      let discount = Number(this.customerGroupForm.value.discount);
      let DiscountV = (price * discount) / 100;
      let discountValueNUmber = DiscountV.toFixed(3);
      let discountValue = Number(this.planDataForm.value.offerPrice) - Number(discountValueNUmber);
      this.discountValue = Number(discountValue);

      this.planDataForm.patchValue({
        discountPrice: this.discountValue
      });
    } else {
      let price = Number(this.planGroupForm.value.offerprice);
      let discount = Number(this.planGroupForm.value.discount);
      let DiscountV = (price * discount) / 100;
      let discountValueNUmber = DiscountV.toFixed(3);
      let discountValue = Number(this.planGroupForm.value.offerprice) - Number(discountValueNUmber);
      this.discountValue = Number(discountValue);
    }
  }

  discountChange(e, index) {
    let discountValueNUmber: any = 0;
    let lastvalue: any = 0;

    let price = Number(this.payMappingListFromArray.value[index].offerPrice);

    let discount = Number(this.payMappingListFromArray.value[index].discount);

    if (this.planDataForm.value.offerPrice > this.payMappingListFromArray.value[index].offerPrice) {
      this.planDataForm.value.discountPrice =
        Number(this.planDataForm.value.discountPrice) -
        Number(this.DiscountValueStore[index].value);
    } else {
      this.planDataForm.value.discountPrice = Number(this.planDataForm.value.discountPrice);
    }

    let DiscountV = (price * discount) / 100;

    discountValueNUmber = DiscountV.toFixed(3);

    let discountVal =
      Number(this.payMappingListFromArray.value[index].offerPrice) - Number(discountValueNUmber);

    if (this.planDataForm.value.offerPrice > this.payMappingListFromArray.value[index].offerPrice) {
      lastvalue = Number(this.planDataForm.value.discountPrice) + Number(discountVal);
      if (this.planDataForm.value.offerPrice < lastvalue) {
        lastvalue = this.planDataForm.value.offerPrice;
      }
    } else {
      lastvalue = Number(discountVal);
    }

    this.planDataForm.patchValue({
      discountPrice: lastvalue
    });

    this.DiscountValueStore[index].value = discountVal;
  }

  modalClosePlanChangeSubisu() {
    this.selectPlanGroup = false;
  }

  valueChange(e) {
    if (!this.ifPlanGroup) {
      this.plansArray.value.forEach(element => {
        element.isInvoiceToOrg = e.value;
      });
    }
  }

  valueChangetrailPlan(e) {
    if (e.checked == true) {
      this.plansArray.value.forEach(element => {
        element.istrialplan = true;
      });
    } else {
      this.plansArray.value.forEach(element => {
        element.istrialplan = false;
      });
    }
  }

  leadNotesList: any;
  tableWrapperForLeadNotes: any;
  scrollIdForLeadNotes: any;

  leadNotesScreenOpen(items: any, leadId: any) {
    this.isSpecificLeadOpen = false;
    this.openAuditTrailScreen = false;
    this.openLeadStatusScreen = false;
    this.openFollowUpSchedulling = false;
    this.openLeadNotesScreen = true;
    this.isServiceManagementOpen = false;
    this.isQuotationDetailOpen = false;
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isLeadDetailOpen = true;
    this.submitted = false;
    this.plansubmitted = false;
    this.isLeadEdit = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.iflocationFill = false;
    this.ifMyInvoice = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;

    this.myFinalCheck = false;
    let size;
    this.searchkey = "";
    let page = this.leadNotesListDataCurrentPage;
    if (items) {
      size = items;
      this.leadNotesListItemsPerPage = items;
    } else {
      size = this.leadNotesListItemsPerPage;
    }
    if (leadId) {
      const url =
        "/leadMaster/findAllLeadNoteWithPagination/" +
        leadId +
        "?page=" +
        page +
        "&pageSize=" +
        size +
        "&mvnoId=" +
        localStorage.getItem("mvnoId");
      this.leadManagementService.getMethod(url).subscribe(
        async (res: any) => {
          // res?.leadNoteList?.content?.forEach((item: any, index: any)=>
          //   this.leadNotesObj = {
          //     id:item?.id,
          //     notes: item?.notes,
          //     leadMasterId: item?.leadMasterId,
          //     index: index+1
          //   },
          //   this.leadNotesList.push(this.leadNotesObj)
          // );
          this.leadNotesList = await res?.leadNoteList?.content;

          this.leadNotesDataTotalRecords = await res?.leadNoteList?.totalElements;

          if (this.showItemPerPage > this.leadNotesListItemsPerPage) {
            this.leadNotesDataLength = this.leadNotesList?.length % this.showItemPerPage;
          } else {
            this.leadNotesDataLength = this.leadNotesList?.length % this.leadNotesListItemsPerPage;
          }
        },
        (error: any) => {
          this.leadNotesDataTotalRecords = 0;
          this.messageService.add({
            severity: "error",
            summary: "Something went wrong!",
            detail: "Page Not Found!",
            icon: ""
          });
        }
      );
    }
  }

  pageChangedLeadNotesList(pageNumber, leadId) {
    this.leadNotesListDataCurrentPage = pageNumber;

    this.leadNotesScreenOpen("", leadId);
  }

  TotalLeadNotesItemPerPage(event, leadId) {
    this.leadNotesListDataCurrentPage = 1;
    this.showItemPerPage = Number(event.value);

    this.leadNotesScreenOpen(this.showItemPerPage, leadId);
  }

  serviceManagementScreenOpen(leadId: any) {
    this.isSpecificLeadOpen = false;
    this.openAuditTrailScreen = false;
    this.openLeadStatusScreen = false;
    this.openFollowUpSchedulling = false;
    this.openLeadNotesScreen = false;
    this.isServiceManagementOpen = true;
    this.isQuotationDetailOpen = false;
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isLeadDetailOpen = true;
    this.submitted = false;
    this.plansubmitted = false;
    this.isLeadEdit = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.iflocationFill = false;
    this.ifMyInvoice = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
  }

  quotationManagementScreenOpen(leadId: any) {
    this.isSpecificLeadOpen = false;
    this.openAuditTrailScreen = false;
    this.openLeadStatusScreen = false;
    this.openFollowUpSchedulling = false;
    this.openLeadNotesScreen = false;
    this.isServiceManagementOpen = false;
    this.isQuotationDetailOpen = true;
    this.listView = false;
    this.createView = false;
    this.selectAreaList = false;
    this.selectPincodeList = false;
    this.isLeadDetailOpen = true;
    this.submitted = false;
    this.plansubmitted = false;
    this.isLeadEdit = false;
    this.isCustomerLedgerOpen = false;
    this.viewCustomerPaymentList = false;
    this.customerPlanView = false;
    this.customerStatusView = false;
    this.iflocationFill = false;
    this.ifMyInvoice = false;
    this.ifChargeGetData = false;
    this.ifWalletMenu = false;
  }

  isCustSubTypeCon: boolean = false;

  getcustType(event) {
    let value = event.value;
    this.customerGroupForm.controls.leadCustomerSubType.enable();
    let actionUrl = `/commonList/${value}`;
    if (event.value == "Barter") {
      this.isCustSubTypeCon = false;
    } else {
      this.isCustSubTypeCon = true;
      this.getCustomerTypeFlow(actionUrl);
    }
  }

  CustomertypeSubtype: any;

  getCustomerTypeFlow(url) {
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.CustomertypeSubtype = response.dataList;
    });
  }

  getSelectCustomerSector(event) {
    const value = event.value;
    if (value) {
      this.customerGroupForm.controls.leadCustomerSubSector.enable();
    } else {
      this.customerGroupForm.controls.leadCustomerSubSector.disable();
    }
  }

  Customertype: any;

  getCustomerType() {
    const url = "/commonList/Customer_Type";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.Customertype = response.dataList;
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

  getSelectCustomerType(event) {
    const selCustomerType = event.value;
    if (selCustomerType == "Paid") {
      this.customerGroupForm.controls.leadCustomerSubType.enable();
    }
  }

  CustomerSector: any;

  getCustomerSector() {
    const url = "/commonList/Customer_Sector";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.CustomerSector = response.dataList;
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

  assignWorkflow(leadId: any) {
    const url =
      "/leadMaster/assignworkflow/" + leadId + "?mvnoId=" + localStorage.getItem("mvnoId");

    this.leadManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.status === 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle"
          });
        }
        if (response.status === 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.message,
            icon: "far fa-times-circle"
          });
        }
        if (response.status === 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-times-circle"
          });

          setTimeout(() => this.getEnterpriseLeadList(), 1000);
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Page Not Found",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  canExit() {
    if (!this.customerGroupForm.dirty) {
      return true;
    }
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
    // if (this.isLeadDetailOpen || !this.customerGroupForm.dirty) {
    this.customerGroupForm.markAsPristine();
    if (type === "create") {
      this.createLead();
    } else {
      this.viewLead();
    }
    // } else {
    //   this.confirmationService.confirm({
    //     header: "Alert",
    //     message: "The filled data will be lost. Do you want to continue? (Yes/No)",
    //     icon: "pi pi-info-circle",
    //     accept: () => {
    //       this.customerGroupForm.markAsPristine();
    //       if (type === "create") {
    //         this.createLead();
    //       } else {
    //         this.viewLead();
    //       }
    //     },
    //     reject: () => {
    //       return false;
    //     },
    //   });
    // }
  }

  leadOriginTypes: any;

  getLeadOriginTypes() {
    const url = "/leadMaster/findAll/leadOriginTypes?mvnoId=" + localStorage.getItem("mvnoId");
    this.leadManagementService.getMethod(url).subscribe(
      (res: any) => {
        if (res.leadOriginTypeList && res.leadOriginTypeList[0].length > 0) {
          this.leadOriginTypes = res.leadOriginTypeList[0].split(",");
        }
      },
      (err: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong while fetching lead origin types",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  requireServiceTypes: any;

  getRequireServiceTypes() {
    const url = "/leadMaster/findAll/requireServiceTypes?mvnoId=" + localStorage.getItem("mvnoId");
    this.leadManagementService.getMethod(url).subscribe(
      (res: any) => {
        if (res.requireServiceTypeList && res.requireServiceTypeList[0].length > 0) {
          this.requireServiceTypes = res.requireServiceTypeList[0].split(",");
        }
      },
      (err: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong while fetching lead origin types",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  leadCustomerGenderTypes: any;

  getLeadCustomerGenderTypes() {
    const url =
      "/leadMaster/findAll/leadcustomergendertype?mvnoId=" + localStorage.getItem("mvnoId");
    this.leadManagementService.getMethod(url).subscribe(
      (res: any) => {
        if (res.leadCustomerGender && res.leadCustomerGender[0].length > 0) {
          this.leadCustomerGenderTypes = res.leadCustomerGender[0].split(",");
        }
      },
      (err: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Something went wrong while fetching lead customer gender types",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  generatedNameOfTheFollowUp: any;

  generateNameOfTheFollowUp(leadId) {
    const url = "/followUp/generateNameOfTheFollowUp/" + leadId;

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.generatedNameOfTheFollowUp = await response.generatedNameOfTheFollowUp;
        this.generatedNameOfTheFollowUp
          ? this.followupScheduleForm.controls["followUpName"].setValue(
              this.generatedNameOfTheFollowUp
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

  generatedNameOfTheReFollowUp: any;

  generateNameOfTheReFollowUp(leadId) {
    const url = "/followUp/generateNameOfTheFollowUp/" + leadId;

    this.leadManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.generatedNameOfTheReFollowUp = await response.generatedNameOfTheFollowUp;
        this.generatedNameOfTheReFollowUp
          ? this.reFollowupScheduleForm.controls["followUpName"].setValue(
              this.generatedNameOfTheReFollowUp
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

  getReScheduleFollowUpRemarksList() {
    const url = "/findAll/reScheduleFollowUpRemarks";
    this.followupScheduleService.getMethodCMS(url).subscribe(
      async (response: any) => {
        this.rescheduleRemarks = await response.rescheduleFollowupRemarkList[0].split(",");
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

  onClickAssignLead(leadId, leadStatus) {
    this.leadId = leadId;
    this.leadStatus = leadStatus;
    this.assignLeadStaffForm.reset();
    this.assignSubmmitted = false;
    if (leadStatus != "Closed") {
      this.getStaff(leadId);
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Can not assign close lead.",
        icon: "far fa-times-circle"
      });
    }
  }

  assignLeadStaffSubmit(): void {
    this.assignSubmmitted = true;
    if (this.assignLeadStaffForm.valid) {
      const updateDetails: any = {};
      updateDetails.leadMasterId = this.leadId;
      updateDetails.status = this.leadStatus;
      updateDetails.remark = this.assignLeadStaffForm.controls.remark.value;
      updateDetails.remarkType = "LeadChangeAssignee";
      updateDetails.assignee = this.assignLeadStaffForm.controls.staffId.value;
      const url = "/teamHierarchy/updateLeadAssignee";
      this.leadManagementService.assignMethod(url, updateDetails).subscribe(
        (response: any) => {
          if (response.responseCode === 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            if (!this.searchkey) {
              //  this.getLeadList("");
              this.getEnterpriseLeadList();
            } else {
              this.searchLead();
              //this.getEnterpriseLeadList();
            }

            // this.openTicketDetail(this.viewTicketData.caseId);
            // this.searchTicketFun();
            this.assignLeadModal = false;
            this.assignSubmmitted = false;
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
  }

  pickModalOpen(data) {
    let url = "/workflow/pickupworkflow?eventName=LEAD&entityId=" + data.id;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        //this.getLeadList("");
        this.getEnterpriseLeadList();

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

  getCustPlanGroupDataopen(id, planGroupcustid) {
    this.PaymentamountService.show(id);
    this.planGroupcustid.next({
      planGroupcustid
    });
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getPlanGroupByPlanId() {
    const url1 = "/findPlanByLeadId?LeadId=" + this.leadDetailData.id;
    this.leadManagementService.getConnection(url1).subscribe(async (response: any) => {
      this.planDataShow = response.postpaidPlanList;
      this.PlanDetailsShow = true;
    });
  }

  planCreationType() {
    const planBindingType = localStorage.getItem("planBindingType");
    if (!planBindingType) {
      this.isPlanOnDemand = false;
      return;
    }
    this.isPlanOnDemand = planBindingType === "On-Demand";
  }

  getAllBranchData() {
    const url = "/branchManagement/all";
    this.commondropdownService.getMethodWithCache(url).subscribe(async (response: any) => {
      this.branchData1 = response.dataList;
    });
  }
  // getAllBranch(data) {
  //   const url = "/branchManagement/all";
  //   this.leadManagementService.getConnection(url).subscribe(async (response: any) => {
  //     this.branchData1 = response.dataList;

  //   });
  // }
  serviceAreaList: any = [];
  getServiceByBranch(e) {
    this.branchId = e.value;
    this.serviceareaCheck = false;
    const url = "/findServiceAreaByBranchId?BranchId=" + this.branchId;
    this.leadManagementService.getConnection(url).subscribe((response: any) => {
      this.serviceAreaList = response.serviceAreaList;
      //$("#PlanDetailsShow").modal("show");
    });
  }

  // exting customer

  async modalOpenextingCustomer() {
    this.selectextingCustomer = true;
    this.newFirst = 1;
    this.selectedextingCust = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  modalCloseextingCustomer() {
    this.currentPageextingCustomerListdata = 1;
    if (!this.ifReadonlyExtingInput) {
      if (!this.selectedextingCust.id) {
        this.customerGroupForm.patchValue({ leadCategory: "New Lead", custlabel: "organization" });
      }
    }
    this.extingCustomerList = [];
    this.selectedextingCust = [];
    this.newFirst = 1;
    this.searchextingCustValue = "";
    this.searchextingCustOption = "";
    this.searchextingCustType = "";
    this.extingFieldEnable = false;
    this.selectextingCustomer = false;
    // console.log("this.newFirst1", this.newFirst)
  }
  extingPaginate(event) {
    this.currentPageextingCustomerListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchextingCustValue) {
      this.searchextingCustomer();
    }
  }

  clearSearchextingCustomer() {
    this.currentPageextingCustomerListdata = 1;
    this.searchextingCustValue = "";
    this.searchextingCustOption = "";
    this.searchextingCustType = "";
    this.extingCustomerList = [];
    this.selectedextingCust = [];
    this.extingFieldEnable = false;
  }

  selextingSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.extingFieldEnable = true;
    } else {
      this.extingFieldEnable = false;
    }
  }

  searchextingCustomer() {
    // this.currentPageextingCustomerListdata = 1;
    const searchextingData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageextingCustomerListdata,
      pageSize: this.extingCustomerListdataitemsPerPage
    };

    searchextingData.filters[0].filterValue = this.searchextingCustValue
      ? this.searchextingCustValue.trim()
      : "";
    searchextingData.filters[0].filterColumn = this.searchextingCustOption;

    const url =
      "/customers/search/" +
      this.searchextingCustType +
      "?mvnoId=" +
      localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.recordPaymentService.postMethod(url, searchextingData).subscribe(
      (response: any) => {
        this.extingCustomerList = response.customerList;
        this.extingCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.extingCustomerListdatatotalRecords = 0;
        this.extingCustomerList = [];
        if (error.error.status == 400 || error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          // this.customerListData = [];
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

  async SelExtingCustomer(id) {
    let customerData: any;

    let custId = id ? id : this.selectedextingCust.id;
    if (this.redirectCustomerId || this.selectedextingCust.id) {
      const url = "/customers/" + custId;
      this.customerManagementService.getMethod(url).subscribe((response: any) => {
        customerData = response.customers;

        setTimeout(() => {
          if (!this.ifcutomerToLeadRedirectService) {
            this.generateLeadNo();
            this.ifReadonlyExtingInput = false;
          }
          this.ifReadonlyExtingInput = true;

          if (customerData.branch) {
            let branchId = {
              value: Number(customerData.branchId)
            };
            this.getServiceByBranch(branchId);
            //
          }
          if (customerData.serviceareaid) {
            let serviceAreaId = {
              value: Number(customerData.serviceareaid)
            };
            this.selServiceArea(serviceAreaId);
          }
          this.selectLeadSource(customerData.leadSourceId);
          this.serviceAreabaseData(customerData.serviceareaid);
          if (customerData.feasibility) {
            this.selectFeasibility(customerData.feasibility);
          }

          this.custTypeEvent(customerData.custtype);
          if (customerData.planMappingList.length > 0) {
            this.customerGroupForm.get("billTo").setValue(customerData.planMappingList[0].billTo);
            this.customerGroupForm
              .get("isInvoiceToOrg")
              .setValue(customerData.planMappingList[0].isInvoiceToOrg);
          }
          this.customerGroupForm.get("isCustCaf").setValue("no");

          this.customerGroupForm.patchValue(customerData);
          // Address
          if (customerData.addressList.length > 0) {
            this.getTempPincodeData(customerData.addressList[0].pincodeId, "present");
            this.getAreaData(customerData.addressList[0].areaId, "present");
            this.presentGroupForm.patchValue(customerData.addressList[0]);

            this.selServiceAreaByParent(Number(customerData.serviceareaid));
            const data = {
              value: Number(customerData.addressList[0].pincodeId)
            };
            this.selectPINCODEChange(data, "");
            this.presentGroupForm.patchValue({
              pincodeId: Number(customerData.addressList[0].pincodeId)
            });
          }
          if (customerData.addressList != null) {
            customerData.addressList.forEach(element => {
              // console.log("element", element);
              if ("Payment" == element.addressType) {
                this.getTempPincodeData(element.pincodeId, "payment");
                this.getAreaData(element.areaId, "payment");
                this.paymentGroupForm.patchValue(element);
                this.selectAreaListPayment = true;
                this.selectPincodeListPayment = true;
              } else if ("Permanent" == element.addressType || "permanent" == element.addressType) {
                this.getTempPincodeData(element.pincodeId, "permanent");
                this.getAreaData(element.areaId, "permanent");
                this.permanentGroupForm.patchValue(element);
                this.selectAreaListPermanent = true;
                this.selectPincodeListPermanent = true;
              }
            });
          }
          let leadId: "";
          let filterIdData = this.leadSourceArr.filter(
            e => e.leadSourceName === customerData.leadSource
          );
          if (filterIdData.length > 0) {
            leadId = filterIdData[0].id;
            this.customerGroupForm.patchValue({
              leadSourceId: leadId
            });
          }

          this.customerGroupForm.patchValue({
            customerId: customerData.id ? Number(customerData.id) : "",
            existingCustomerId: customerData.id ? Number(customerData.id) : "",
            branchId: customerData.branch ? Number(customerData.branch) : "",
            id: null,
            serviceareaid: customerData.serviceareaid ? Number(customerData.serviceareaid) : "",
            custtype: customerData.custtype,
            popManagementId: customerData.popid ? Number(customerData.popid) : "",
            leadCategory: "Existing Customer"
          });

          if (this.ifcutomerToLeadRedirectService) {
            this.customerGroupForm.patchValue({
              invoiceType: "Group",
              parentCustomerId: Number(this.redirectCustomerId),
              parentExperience: "Single",
              custlabel: "customer"
            });
          }
          this.modalCloseextingCustomer();
        }, 1000);
      });
    } else {
      this.customerGroupForm.patchValue({ leadCategory: "New Lead" });
      this.ifextingSaveBtn = false;
      this.ifReadonlyExtingInput = false;
    }
  }

  parentExperienceSelect(e) {
    this.customerGroupForm.patchValue({
      invoiceType: "Group"
    });
  }

  closeNotesModal() {
    this.addNotesPopup = false;
  }

  closeAssignLead() {
    this.assignLeadModal = false;
  }

  modalClosePlanDetail() {
    this.PlanDetailsShow = false;
  }
}
