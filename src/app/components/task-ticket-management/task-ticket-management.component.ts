import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { BehaviorSubject, interval, Observable, Observer, Subscription, timer } from "rxjs";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { TicketManagementService } from "src/app/service/ticket-management.service";
import { CustomerDetailsComponent } from "../common/customer-details/customer-details.component";
import { saveAs as importedSaveAs } from "file-saver";
import { LoginService } from "src/app/service/login.service";
import * as XLSX from "xlsx";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from "moment";
import { CustomerService } from "src/app/service/customer.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { TASK_SYSTEMS, TICKETING_SYSTEMS } from "src/app/constants/aclConstants";
import { StaffService } from "src/app/service/staff.service";
import { TaskManagementService } from "src/app/service/task-management.service";
import { TeamsService } from "../teams/teams.service";

@Component({
  selector: "app-task-ticket-management",
  templateUrl: "./task-ticket-management.component.html",
  styleUrls: ["./task-ticket-management.component.scss"]
})
export class TaskTicketManagementComponent implements OnInit {
  @ViewChild(CustomerDetailsComponent)
  AclClassConstants;
  AclConstants;

  fileNameCDR = "ETR.xlsx";
  public loginService: LoginService;
  customerDetailModal: CustomerDetailsComponent;
  ticketGroupForm: FormGroup;
  assignStaffTicketForm: FormGroup;
  reassignStaffTicketForm: FormGroup;
  ratingTicketForm: FormGroup;
  followupForm: FormGroup;
  ratingSubmmitted = false;
  reassignTicketModal: boolean = false;
  submitted = false;
  caseForData: any;
  caseTypeData: any;
  caseReasonData: any[];
  caseOriginData: any;
  priorityData: any;
  hourArray: any = [];
  createTicketData: any = {
    caseForPartner: "",
    caseFor: "",
    caseOrigin: "",
    // ------------
    call_status: null,
    caseReason: null,
    // caseReasonCategory: null,
    // caseReasonSubCategory: null,
    deacivate_reason: null,
    department: "Sales",
    is_closed: null,
    mvnoId: 2,
    rootCauseReasonId: 0,
    source: null,
    subSource: null,
    ticketAssignStaffMappings: [],
    caseDocDetails: [],
    isFromCalender: false,
    startDate: null,
    endDate: null
    // ticketServicemappingList: [{ serviceid: "", ticketid: "" }]
  };
  activeIndex: number = 0;
  customerData: any;
  ticketData: any[] = [];
  currentPageTicketConfig = 1;
  currentPage = 1;
  ticketConfigitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  linkTicketItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  ticketConfigtotalRecords: number;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  selectedFilePreview: File[] = [];
  selectedFileUploadPreview: File[] = [];
  viewTicketData: any = {};
  deletedata: any = {
    CaseId: "",
    caseForPartner: "",
    caseOrigin: "",
    caseReasonId: "",
    caseTitle: "",
    caseType: "",
    customersId: "",
    nextFollowupDate: "",
    nextFollowupTime: "",
    oltName: "",
    portName: "",
    priority: "",
    serviceAreaName: "",
    email: "",
    mobile: "",
    slotName: "",
    userName: "",
    caseStatus: "",
    currentAssigneeId: ""
  };
  isTicketEdit = false;
  showData: boolean = false;
  statusData: any;
  createTicket = false;
  detailTicket = false;
  searchCustomerId: any = "";
  customerDetailData: any;
  currentDate: any = new Date();
  currentDt: string;
  minTime: Date;
  custId = new BehaviorSubject({
    custId: ""
  });
  allStaffData: any;
  assignStaffData: any;
  assignStaffParentId: any;
  staffsubmmitted = false;
  updateTicketData = {
    ticketId: "",
    status: "",
    caseType: "",
    assignee: "",
    priority: "",
    attachment: "",
    filename: "",
    // finalResolutionId: "",
    remarkType: "",
    remark: "",
    groupReasonId: "",
    caseCategoryId: "",
    // ticketReasonCategoryId: "",
    caseTitle: "",
    rootCauseReasonId: "",
    source: "",
    subSource: "",
    // customerAdditionalMobileNumber: "",
    // customerAdditionalEmail: "",
    helperName: "",
    nextFollowupDate: "",
    nextFollowupTime: "",
    serialNumber: "",
    mvnoId: 2,
    tatMappingId: null,
    teamHierarchyMappingId: null,
    case_order: 0,
    caseSlaTime: 0,
    caseSlaUnit: "",
    teamId: 0,
    finalTaskCompletionRemark: null,
    createby: "",
    updateby: "",
    isFromCalender: false,
    startDate: null,
    endDate: null,
    currentAssigneeId: null,
    incidentStartDate: "",
    incidentEndDate: ""
  };
  assignticketId: any;
  staffData: any = {
    fullName: "",
    email: "",
    phone: "",
    username: "",
    roleName: [],
    servicearea: {
      name: ""
    }
  };
  ticketDeatailData: any = {
    caseTitle: "",
    customerName: "",
    userName: "",
    serviceAreaName: "",
    oltName: "",
    slotName: "",
    portName: "",
    caseType: "",
    caseReasonId: "",
    priority: "",
    nextFollowupDate: "",
    nextFollowupTime: "",
    caseStatus: ""
  };
  parentTicketDetails: any = {};
  childTicketDetails: any = [];
  serviceAreaId: any;
  staffList: any = [];
  nameOfService: any;
  teamListData: any[] = [];
  currentLoginUserId: any;
  ratingTicketId: any;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  totalDataListLength = 0;
  caseUpdateDetails: any;
  viewRating = false;
  searchTicketDetail: any = "";
  searchData: any;
  followupSubmmitted = false;
  createTicketFollowupData: any;
  folloupTicketId: any = "";
  folloupCustId: any = "";
  folloupTicketassignStaffId: any = "";
  followUpTicketListData: any = [];
  conversationListData: any = [];
  ticketRemarkListData: any = [];
  statusOptions = RadiusConstants.status;
  ticketReasonCategoryData: any;
  ticketReasonSubCategoryData: any;
  uploadDocumentRoot: boolean = false;

  // groupReasonData: any;
  // resolutionReasonData: any;
  chnageStatusForm: FormGroup;
  feedbackForm: FormGroup;
  changeStausSubmitted = false;
  ticketAssignToOption = [
    { label: "Team", value: "TEAM" },
    { label: "Staff", value: "STAFF" }
  ];
  salesSupportData = [
    { label: "Phone Suppport ", value: "Phone Suppport " },
    { label: "Field Visit", value: "Field Visit" }
  ];
  referalInfoData = [
    { label: "Yes ", value: "Yes" },
    { label: "No", value: "No" },
    { label: "Neutral", value: "Neutral" }
  ];
  teamListDataFiltered: any[] = [];
  assignableStaffList: any[] = [];
  // rootCauseReasonData: any[] = [];
  // ticketSourceTypeData: any;
  // feedbackDetails: any = [];
  searchticketReasonCategoryId: any;
  searchservicearea_id: any;
  searchcaseStatus: any;
  // departmentTypeData: any;
  selectedFile: any;
  serviceAreaList: any = [];
  bulkData: any = [];
  // filteredReasonCategoryList = [];
  ticketDataForLink = [];
  showLinktickets: boolean = false;
  linkedTicketId: number;
  uploadDataTicketId: number;
  ticketIdToLink: number;
  detailView: boolean = false;
  isCall: boolean = false;
  isticket: boolean = false;
  uploadDocForm: FormGroup;
  ticketReasonCategoryDataDropdown = [];
  reject = false;
  dateTime = new Date();
  overall_rating = 0;
  isSingleTktChecked = false;
  chakedTktData: any = [];
  AssignToMeTicketDetails: any = [];
  isTicketCheckedAssigntome: boolean = false;
  staffDetailModal: boolean = false;
  ratingTicketModal: boolean = false;
  followUpModal: boolean = false;
  assignTicketModal: boolean = false;
  showChangeProblemDomain: boolean = false;
  caseUpdateDetailsModel: boolean = false;
  changeStatusModal: boolean = false;
  feedbackFormModal: boolean = false;
  ticketApproveRejectModal: boolean = false;
  rejectCustomerCAFModal: boolean = false;
  assignCustomerCAFModal: boolean = false;
  idChangePriority: boolean = false;
  ticketPickModal: boolean = false;
  selectLinkTicket: boolean = false;
  uploadDocumentId: boolean = false;
  ticketETRModal: boolean = false;
  ticketStaffTeamdetails: boolean = false;
  showTatDetails: boolean = false;
  documentPreview: boolean = false;
  scheduleFollowup: boolean = false;
  // reScheduleFollowup: boolean = false;
  // closeFollowup: boolean = false;
  remarkScheduleFollowup: boolean = false;
  tatDetailsShow: boolean = false;
  tatDetailsMessageShow: boolean = false;
  tatDetailsShowModel: boolean = false;
  counterDetailModel: boolean = false;
  serviceAreaDetail: boolean = false;
  parentDetailsShowModel: boolean = false;
  childDetailsShowModel: boolean = false;
  UnpickTicketDetails: any = [];
  AssignToTeamDetails: any = [];
  reasonForCallDisconnect: any = [];
  isCallDisconnected: boolean = false;
  paymentModeData: any = [];
  staffBehaviourData: any = [];
  infoOfPaymentModeData: any = [];
  BehaviourData: any = [];
  SatisfiedData: any = [];
  problemTypeData: any = [];
  BehaviourReasonData: any = [];
  isProblemType: boolean = false;
  isEnable: boolean = false;
  feedbackSubmitted: boolean = false;
  caseFeedbackRel: any = [];
  reasondata: any;
  reasonStringdata: any;
  infodata: any;
  infoStringdata: any;
  paymentTypedata: any;
  paymentTypeStringdata: any;
  updatefeedbackDetails: any = [];
  resolutionReasonData: any;

  //   assignStaffParentId: any;
  // test() {
  //   const mainarray = [];
  //   const firstobject = [{ id: 1 }, { id: 2 }];
  //   const secondobject = [{ id: 3 }, { id: 4 }];
  //   for (var i = 0; i < firstobject.length; i++) {
  //     mainarray.push(firstobject[i]);
  //   }
  //   for (var i = 0; i < secondobject.length; i++) {
  //     mainarray.push(secondobject[i]);
  //   }
  //   console.log("mainarray", mainarray);
  rejectCAF = [];
  selectStaffReject: any;
  // get f() {
  //   // return this.ticketGroupForm['controls'];
  //   return this.ticketGroupForm.get('nextFollowupTime')['controls']
  // }
  approved = false;
  approveCAF = [];
  selectStaff: any;
  approveId: any;
  workflowAuditData1: any = [];
  currentPageMasterSlab1 = 1;
  SLAremainTime: any;
  // getCaseReason() {
  //
  //   const url = "/caseReason/all";
  //   this.taskManagementService.getMethod(url).subscribe(
  //     (response: any) => {
  //       this.caseReasonData = response.dataList;
  //       // console.log("this.caseReasonData", this.caseReasonData);
  //
  //     },
  //     (error: any) => {
  //       console.log(error, "error");
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
  MasteritemsPerPage1 = RadiusConstants.ITEMS_PER_PAGE;
  MastertotalRecords1: number;
  MasteritemsPerPageForDoc = RadiusConstants.ITEMS_PER_PAGE;
  currentPageMasterForDoc: number;
  MastertotalRecordsForDoc: number;
  workflowID: any;
  priorityTicketData = [];
  selectPriorityValue = "";
  selcetTicketData: any = [];
  pickRemark: any;
  pickId: any;
  viewTicketId: number;
  obs$ = interval(1000);
  obs2$ = interval(1940);
  viewTicket: boolean = true;
  ticketRemainTimeSubscription: Subscription;
  ticketSLATimeSubscription: Subscription;
  assignTicketStatus: any = "";
  createStatusList: any = [];
  ChangestatusList: any = [];
  showStatus: boolean = true;
  showServices: boolean = true;
  ifApproveTicket = false;
  approveRejectRemark = "";
  ticketApprRejectData: any = [];
  ticketETRForm: FormGroup;
  TATDetails: any = [];
  TatDetails: any = [];
  ticketETRData: any = [];
  customerETRDetailData: any = [];
  messageModeETR = [
    { label: "Dynamic", value: true },
    { label: "Static", value: false }
  ];
  submittedETR = false;
  ticketETRDetailData: any = [];
  ticketTATDetailData: any = [];
  // customerServiceData: any;
  searchOption: "";
  searchGroupForm: FormGroup;
  searchSubmitted = false;
  previewUrl: any;
  helperdata: any;
  followupData: any;
  customersId: any;
  followupScheduleForm: FormGroup;
  followupPopupOpen: boolean;
  followupMinimumDate = new Date();
  selectedRemarkType: any;
  closeFollowupForm: FormGroup;
  closeFollowupFormsubmitted: boolean = false;
  remarkFollowupForm: FormGroup;
  remarkFollowupFormsubmitted: boolean = false;
  reFollowupScheduleForm: FormGroup;
  reFollowupFormsubmitted: boolean = false;
  requiredFollowupInfo: any;
  ifCafFollowupSubmited = false;
  mvnoid: any;
  staffid: any;
  followUpCaseNumber: any;
  viewTrcData: any;
  viewTATMessage: any;
  rating: any = 0;
  currentPageViewTATListdata = 1;
  viewTATListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  viewTATListDatatotalRecords: any;
  // serialNumbers: any;
  displaySelectCustomer: boolean = false;
  displayTATDetails: boolean = false;
  remarkTypeOption = [];
  conversationModal: boolean = false;
  createAccess: boolean = false;
  editAccess: boolean = false;
  followUpAccess: boolean = false;
  slaCounterAccess: boolean = false;
  etrAccess: boolean = false;
  remarksAccess: boolean = false;
  conversationAccess: boolean = false;
  attachementAccess: boolean = false;
  assignAccess: boolean = false;
  linkTicketAccess: boolean = false;
  changeStatusAccess: boolean = false;
  bulkReassignAccess: boolean = false;
  changePBDomainAccess: boolean = false;
  attachementDownloadAccess: boolean = false;
  etrExcelDownloadAccess: boolean = false;
  changePriorityAccess: boolean = false;
  uploadDocAccess: boolean = false;
  dialogId: boolean = false;
  staffDataList: any = [];
  parentTRCData: any;
  childTRCData: any;
  caseCategoryId: any;
  caseSubCategoryId: any;
  HelperList: string[] = [];
  helperDetailsShowModel: boolean;
  linkTicketData: any = [];
  savedCustomerDetails: any;
  displaySavedCustomerDialog: boolean = false;
  uploadRootForm: FormGroup = this.createUploadRootForm();
  rootCauseReasonData: any[] = [];

  //   assignStaffParentId: any;
  // test() {
  //   const mainarray = [];
  //   const firstobject = [{ id: 1 }, { id: 2 }];
  //   const secondobject = [{ id: 3 }, { id: 4 }];
  //   for (var i = 0; i < firstobject.length; i++) {
  //     mainarray.push(firstobject[i]);
  //   }
  //   for (var i = 0; i < secondobject.length; i++) {
  //     mainarray.push(secondobject[i]);
  //   }
  //   console.log("mainarray", mainarray);

  // getCaseReason() {
  //
  //   const url = "/caseReason/all";
  //   this.taskManagementService.getMethod(url).subscribe(
  //     (response: any) => {
  //       this.caseReasonData = response.dataList;
  //       // console.log("this.caseReasonData", this.caseReasonData);
  //
  //     },
  //     (error: any) => {
  //       console.log(error, "error");
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

  uploadResolveDocForm: FormGroup[] = [];
  selectedResolveFileUploadPreview: any[] = [];
  tabs = [
    "FAT Optical Power Picture",
    "FAT Inside Picture",
    "FAT Outside Picture",
    "ONU Optical Power Picture",
    "Optical Power Range",
    "Installation Picture",
    "Speedtest Picture"
  ];
  ticketFileDocData: any;
  opticalRangeData: any[] = [
    { label: "-15", value: "-15" },
    { label: "-16", value: "-16" },
    { label: "-17", value: "-17" },
    { label: "-18", value: "-18" },
    { label: "-19", value: "-19" },
    { label: "-20", value: "-20" },
    { label: "-21", value: "-21" },
    { label: "-22", value: "-22" },
    { label: "-23", value: "-23" }
  ];
  activeTabIndex: number = 0;
  ticketIdData: any;
  uploadResolvedocumentId: boolean = false;
  downloadResolveDocumentId: boolean = false;
  activeTabViewIndex: number = 0;
  resolvePreviewUrl: any;
  resolvedocumentPreview: boolean;
  resolveMultiFiles: any;
  resolvesubmitted: boolean = false;
  uploadformData: any;
  showIncidentEndDateCalendar: boolean = false;
  isTicketUpdate: boolean = false;
  activeProductList: any;
  allTaskCounts: any;
  showDashboardTabs: boolean = false;
  dashboardCases: any;
  currentPageCaseStatus = 1;
  casestatusitemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  caseStatusListData: any;
  caseStatusTotalRecords: any;
  activeDashboardTabIndex: any;
  staffListParentList: any;
  selectedStaffId: any;
  showAssignedToTeam: boolean = false;
  inventoryDocType: any;
  tabsMandatory: any[];

  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private taskManagementService: TaskManagementService,
    public commondropdownService: CommondropdownService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private route: ActivatedRoute,
    loginService: LoginService,
    private sanitizer: DomSanitizer,
    public datepipe: DatePipe,
    public customerService: CustomerService,
    private staffService: StaffService,
    private teamsService: TeamsService,
    private ticketManagementService: TicketManagementService
  ) {
    this.loginService = loginService;
    this.createAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_DOMAIN_CREATE);
    this.editAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_DOMAIN_EDIT);
    // this.followUpAccess = loginService.hasPermission(TICKETING_SYSTEMS.TICKET_FOLLOW_UP);
    // this.slaCounterAccess = loginService.hasPermission(TICKETING_SYSTEMS.TICKET_SLA_COUNTER);
    this.etrAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_DOMAIN_ETR);
    this.remarksAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_DOMAIN_REMARKS);
    this.conversationAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_DOMAIN_CONERSATION);
    this.attachementAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_ATTACHMENT);
    this.assignAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_ASSIGN);
    this.linkTicketAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_LINK_TICKET);
    this.changeStatusAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_DOMAIN_CHANGE_STATUS);
    this.bulkReassignAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_DOMAIN_BULK_REASSIGN);
    this.uploadDocAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_UPLOAD_DOC);
    this.changePriorityAccess = loginService.hasPermission(
      TASK_SYSTEMS.TASK_DOMAIN_CHANGE_PRIORITY
    );
    this.changePBDomainAccess = loginService.hasPermission(
      TASK_SYSTEMS.TASK_DOMAIN_CHANGE_CATEGORY
    );
    this.attachementDownloadAccess = loginService.hasPermission(
      TASK_SYSTEMS.TASK_ATTACHMENT_DOWNLOAD
    );
    this.etrExcelDownloadAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_ETR_EXCEL_DOWNLOAD);
    // this.isTicketEdit = !this.createAccess && this.editAccess ? true : false;
  }
  searchOptionSelect1: any = [];
  ngOnInit(): void {
    this.getTicketReasonCategoryDataList();
    this.commondropdownService
      .getMethodFromCommon(`/commonList/generic/inventoryDocType`)
      .subscribe((response: any) => {
        this.inventoryDocType = response.dataList;
        // Create mapping: tab name -> mandatory flag
        this.tabs = this.inventoryDocType.map(item => item.text);
        this.tabsMandatory = this.inventoryDocType.map(item => item.hasMandatory);
      });
    // this.getDepartmentType();
    let data = history.state.data;
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    this.staffid = Number(localStorage.getItem("userId"));
    this.searchOptionSelect1 = this.commondropdownService.customerSearchOption;
    this.commondropdownService
      .getMethodWithCache(`/commonList/generic/TICKET_SEARCH_OPTION`)
      .subscribe((response: any) => {
        this.searchOptionSelect = response.dataList;
      });
    let currentLoginUserId = localStorage.getItem("userId");
    this.currentLoginUserId = Number(currentLoginUserId);
    this.ticketGroupForm = this.fb.group({
      caseStatus: ["", Validators.required],
      caseTitle: ["", Validators.required],
      caseType: ["", Validators.required],
      // ticketReasonCategoryId: ["", Validators.required],
      caseCategoryId: ["", Validators.required],
      caseSubCategoryId: ["", Validators.required],
      groupReasonId: [""],
      priority: ["", Validators.required],
      nextFollowupDate: ["", Validators.required],
      nextFollowupTime: [""],
      currentAssigneeId: [""],
      // customerAdditionalEmail: ["", Validators.email],
      // customerAdditionalMobileNumber: [""],
      // email: ["", Validators.required],
      // mobile: ["", Validators.required],
      // customersId: [data ? data.id : "", Validators.required],
      teamId: ["", Validators.required],
      // department: ["", Validators.required],
      file: [""],
      finalResolutionId: ["", Validators.required],
      firstRemark: ["", Validators.required],
      helperName: [""],
      // rootCauseReasonId: [""],
      // serviceAreaName: ["", Validators.required],
      // source: [""],
      // subSource: [""],
      // userName: ["", Validators.required],
      // ticketServicemappingList: ["", Validators.required],
      serialNumber: [""],
      staffId: [""],
      caseId: [""],
      isReassignTask: [""],
      incidentStartDate: [""],
      incidentEndDate: [""]
    });
    this.followupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: ["", Validators.required],
      isMissed: [false],
      caseId: []
    });
    this.closeFollowupForm = this.fb.group({
      followUpId: [""],
      remarks: ["", Validators.required]
    });
    this.remarkFollowupForm = this.fb.group({
      cafFollowUpId: [""],
      remark: ["", Validators.required]
    });
    this.reFollowupScheduleForm = this.fb.group({
      id: [""],
      followUpName: ["", Validators.required],
      followUpDatetime: ["", Validators.required],
      remarks: [""],
      isMissed: [false],
      caseId: [],
      remarksTemp: ["", Validators.required]
    });
    this.assignStaffTicketForm = this.fb.group({
      teamId: ["", Validators.required],
      staffId: [""],
      remark: ["", Validators.required]
    });
    this.reassignStaffTicketForm = this.fb.group({
      remark: ["", Validators.required],
      teamId: ["", Validators.required],
      staffId: [""]
    });
    this.ratingTicketForm = this.fb.group({
      customerFeedback: ["", Validators.required],
      rating: [, Validators.required]
    });

    this.followupForm = this.fb.group({
      remarkType: ["", Validators.required],
      remark: ["", Validators.required]
    });
    this.chnageStatusForm = this.fb.group({
      ticketId: [""],
      oldStatus: [""],
      newStatus: ["", Validators.required],
      remark: [""],
      customerId: [""],
      finalResolutionId: [""],
      // rootCauseReasonId: [""],
      helperName: [""],
      nextFollowupDate: [""],
      nextFollowupTime: [""],
      // serviceAreaValue: [""],
      call_status: [""],
      is_closed: [""],
      reason: [""],
      incidentEndDate: ["", Validators.required],
      resolutionFiles: [[]],
      latitude: [""],
      longitude: [""],
      uploadremark: [""]
    });
    this.feedbackForm = this.fb.group({
      support_type: [""],
      staff_behavior: [""],
      payment_mode: [""],
      infoOfPaymentMode: [""],
      current_bandwidth_feedback: [""],
      current_price_feedback: [""],
      referal_information: [""],
      technicial_support_feedback: [""],
      problem_type: [""],
      service_experience: [""],
      behaviour_professionalism: [""],
      reason: [""],
      overall_rating: [""],
      general_remarks: [""]
    });
    this.ticketETRForm = this.fb.group({
      isTemplateDynamic: ["", Validators.required],
      notificationDate: ["", Validators.required],
      notificationTime: ["", Validators.required],
      remark: [""],
      sms: [""],
      email: [""]
    });
    this.searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: "",
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "any"
        }
      ]
      //  page: '',
      // pageSize: '',
    };
    // this.getAssignToMeTicketDetails("");
    // this.getUnpickTicketDetails("");
    // this.getAssignToTeamTicketDetails("");
    this.getCaseStatus();
    // this.getTicketSourceType();
    // this.getStaffbyServiceArea();
    // this.ticketGroupForm.controls.userName.disable();
    // this.ticketGroupForm.controls.serviceAreaName.disable();
    // this.ticketGroupForm.controls.email.disable();
    // this.ticketGroupForm.controls.mobile.disable();
    this.currentDate = this.datepipe.transform(this.currentDate, "yyyy-MM-dd");
    // const serviceArea = localStorage.getItem("serviceArea");
    // const serviceAreaArray = JSON.parse(serviceArea);
    // if (serviceAreaArray.length !== 0) {
    //     this.commondropdownService.filterserviceAreaList();
    // } else {
    //     this.commondropdownService.getserviceAreaList();
    // }
    this.hourSequence();
    // this.getCaseFor();
    this.getCaseType();
    // this.getCaseReason();
    // this.getCaseOrigin();
    // this.getPriority();
    // this.getCustomer();
    this.getTicket("");
    this.getTicketPriority();
    this.getCaseReasonCategory();
    // this.getTeamData();
    this.getTeamList();

    const caseId: string = this.route.snapshot.queryParamMap.get("caseId");
    if (caseId !== null && caseId !== undefined && caseId !== "") {
      this.openTicketDetail(caseId);
    }
    const getRole = localStorage.getItem("userRoles");

    if (getRole && getRole == "1") {
      this.viewRating = true;
    }
    this.uploadDocForm = this.fb.group({
      file: ["", Validators.required]
    });
    this.searchGroupForm = this.fb.group({
      searchOption: ["", Validators.required],
      searchValue: ["", Validators.required]
    });
    this.commondropdownService.getCustomerStatus();
    // this.commondropdownService.getPostpaidplanData();
    if (data) {
      this.createTicketFun();

      this.selectedParentCust = data;
      this.saveSelCustomer(false);
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    this.currentDt = `${year}-${month}-${day}`;
    this.minTime = new Date();
    this.tabs.forEach(() => {
      this.uploadResolveDocForm.push(this.createForm());
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      sectionName: [""],
      latitude: [""],
      longitude: [""],
      opticalRange: [null],
      file: [null, Validators.required]
    });
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageTicketConfig > 1) {
      this.currentPageTicketConfig = 1;
    }
    if (!this.searchkey) {
      this.getTicket(this.showItemPerPage);
    } else {
      this.searchTicket();
    }
  }

  getTicket(size) {
    this.showData = false;
    let page_list;
    this.searchkey = "";
    if (size) {
      page_list = size;
      this.ticketConfigitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.ticketConfigitemsPerPage = this.pageITEM;
      } else {
        this.ticketConfigitemsPerPage = this.showItemPerPage;
      }
    }

    const ticketPagination = {
      page: this.currentPageTicketConfig,
      pageSize: this.ticketConfigitemsPerPage
    };
    const url = "/case";
    this.taskManagementService.postMethod(url, ticketPagination).subscribe(
      (response: any) => {
        // const serviceArea = localStorage.getItem('serviceArea')
        // if (serviceArea != 'null') {
        //   let ticketData = response.dataList.filter(
        //     (ticket) => ticket.serviceAreaId == Number(serviceArea),
        //   )
        //   this.ticketData = ticketData
        // } else {
        this.ticketData = response.dataList;
        this.ticketConfigtotalRecords = response.totalRecords;
        this.tiketTimer();
        // this.SLATimer();
        // }
        this.ticketConfigtotalRecords = response.totalRecords;
        if (this.showItemPerPage > this.ticketConfigitemsPerPage) {
          this.totalDataListLength = this.ticketData.length % this.showItemPerPage;
        } else {
          this.totalDataListLength = this.ticketData.length % this.ticketConfigitemsPerPage;
        }
        this.isTicketChecked = false;
        this.allIsChecked = false;
        this.isSingleTicketChecked = false;
        this.isSingleTktChecked = false;
        this.chakedTicketData = [];
        // console.log("this.ticketData", this.ticketData);
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

  responseTimetSet() {
    const date = new Date();
    this.TATDetails = this.parentTRCData.find(
      element => element.categoryId == this.ticketGroupForm.controls.caseCategoryId.value
    ).caseCategoryTatMappingList;
    const ticket = this.TATDetails.find(
      element => element.caseCategoryId == this.ticketGroupForm.controls.caseCategoryId.value
    )?.ticketTatMatrix;
    const timeUnit = ticket ? ticket.runit : "DAY";
    const time = ticket ? ticket.rtime : 1;
    if (timeUnit == "DAY") {
      date.setDate(date.getDate() + time);
    } else if (timeUnit == "HOUR") {
      date.setHours(date.getHours() + time);
    } else {
      date.setMinutes(date.getMinutes() + time);
    }
    this.createTicketData.nextFollowupDate = this.datepipe.transform(date, "yyyy-MM-dd");
    this.createTicketData.nextFollowupTime = this.datepipe.transform(date, "HH:mm:ss");
  }

  addEditTicket(ticketId): void {
    this.isTicketUpdate = !!ticketId;
    this.submitted = true;

    if (this.isTicketUpdate) {
      this.ticketGroupForm.get("incidentStartDate")?.clearValidators();
    } else {
      this.ticketGroupForm.get("incidentStartDate")?.setValidators(Validators.required);
    }
    this.ticketGroupForm.get("incidentStartDate")?.updateValueAndValidity();

    if (this.ticketGroupForm.valid) {
      if (ticketId) {
        this.createTicketData = this.ticketGroupForm.value;
        this.createTicketData.serialNumber = this.ticketGroupForm.value.serialNumber
          ? this.ticketGroupForm.value.serialNumber.toString()
          : "";

        if (
          this.ticketGroupForm.controls.caseTitle.value == "" ||
          this.ticketGroupForm.controls.caseTitle.value == null
        ) {
          this.ticketReasonCategoryData.filter(() => {});
        } else {
          this.updateTicketData.caseTitle = this.createTicketData.caseTitle;
        }

        this.updateTicketData.ticketId = ticketId;
        this.updateTicketData.status = this.createTicketData.caseStatus;
        this.updateTicketData.caseType = this.createTicketData.caseType;
        this.updateTicketData.assignee = this.createTicketData.currentAssigneeId;
        this.updateTicketData.currentAssigneeId = this.createTicketData.currentAssigneeId;
        this.updateTicketData.priority = this.createTicketData.priority;
        this.updateTicketData.groupReasonId = this.createTicketData.groupReasonId;
        this.updateTicketData.caseCategoryId = this.createTicketData.caseCategoryId;
        this.updateTicketData.remark = this.createTicketData.firstRemark;
        this.updateTicketData.serialNumber = this.createTicketData.serialNumber;
        this.updateTicketData.rootCauseReasonId = this.createTicketData.rootCauseReasonId;
        this.updateTicketData.source = this.createTicketData.source;
        this.updateTicketData.subSource = this.createTicketData.subSource;
        this.updateTicketData.helperName = this.createTicketData.helperName;
        this.updateTicketData.createby = this.createTicketData.createby;
        this.updateTicketData.updateby = this.createTicketData.updateby;
        this.updateTicketData.nextFollowupDate = this.createTicketData.nextFollowupDate;
        this.updateTicketData.isFromCalender = false;
        this.updateTicketData.startDate = "";
        this.updateTicketData.endDate = "";
        this.updateTicketData.nextFollowupTime = this.formatTime(
          this.createTicketData.nextFollowupTime
        );
        this.updateTicketData.incidentStartDate = this.createTicketData.incidentStartDate
          ? this.datepipe.transform(
              new Date(this.createTicketData.incidentStartDate),
              "yyyy-MM-dd HH:mm:ss"
            )
          : null;

        this.updateTicketData.incidentEndDate = this.createTicketData.incidentEndDate
          ? this.datepipe.transform(
              new Date(this.createTicketData.incidentEndDate),
              "yyyy-MM-dd HH:mm:ss"
            )
          : null;
        const formData = new FormData();
        let fileArray: FileList;
        if (this.createTicketData.file) {
          fileArray = this.ticketGroupForm.controls.file.value;
          Array.from(fileArray).forEach(file => {
            formData.append("file", file);
          });
        }

        formData.append("caseUpdate", JSON.stringify(this.updateTicketData));

        const url = "/case/updateDetails";
        this.taskManagementService.assignMethod(url, formData).subscribe(
          (response: any) => {
            this.isTicketUpdate = false;
            if (
              response.responseCode === 406 ||
              response.responseCode === 417 ||
              response.responseCode === 401
            ) {
              this.messageService.add({
                severity: response.responseCode === 417 ? "error" : "info",
                summary: response.responseCode === 417 ? "Error" : "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.ticketGroupForm.reset();
              if (!this.searchkey) {
                this.getTicket("");
              } else {
                this.searchTicket();
              }
              this.isTicketEdit = false;
              this.searchTicketFun();

              this.ticketGroupForm.get("nextFollowupDate").clearValidators();
              this.ticketGroupForm.get("nextFollowupDate").updateValueAndValidity();
              this.ticketGroupForm.get("nextFollowupTime").clearValidators();
              this.ticketGroupForm.get("nextFollowupTime").updateValueAndValidity();

              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
              this.ticketGroupForm.patchValue({ caseStatus: "Open" });
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
        this.selectedFilePreview = [];
        const formData = new FormData();

        const rawStart = this.ticketGroupForm.value.incidentStartDate;
        const rawEnd = this.ticketGroupForm.value.incidentEndDate;

        const incidentStartDate = rawStart
          ? this.datepipe.transform(new Date(rawStart), "yyyy-MM-dd HH:mm:ss")
          : null;

        const incidentEndDate = rawEnd
          ? this.datepipe.transform(new Date(rawEnd), "yyyy-MM-dd HH:mm:ss")
          : null;

        this.createTicketData = {
          ...this.createTicketData,
          ...this.ticketGroupForm.getRawValue(),
          teamId: this.ticketGroupForm.value.teamId || null,
          currentAssigneeId: this.ticketGroupForm.value.currentAssigneeId || null,
          incidentStartDate,
          incidentEndDate
        };

        this.createTicketData.serialNumber = this.ticketGroupForm.value.serialNumber
          ? this.ticketGroupForm.value.serialNumber.toString()
          : "";
        this.createTicketData.mvnoId = this.mvnoid;

        if (
          this.ticketGroupForm.controls.caseTitle.value == "" ||
          this.ticketGroupForm.controls.caseTitle.value == null
        ) {
          this.ticketReasonCategoryData.filter(() => {});
        }

        if (this.createTicketData.caseStatus === "Open") {
          this.responseTimetSet();
        }

        this.createTicketData.caseForPartner = "Customer";
        this.createTicketData.caseFor = "Customer";
        this.createTicketData.caseOrigin = "Phone";
        this.createTicketData.isFromCalender = false;
        this.createTicketData.startDate = "";
        this.createTicketData.endDate = "";

        if (this.createTicketData.caseStatus === "Follow Up") {
          const follwTime = this.datepipe.transform(
            this.createTicketData.nextFollowupTime,
            "HH:mm:ss"
          );
          this.createTicketData.nextFollowupTime = follwTime;
        }

        this.createTicketData.firstRemark = this.ticketGroupForm.controls.firstRemark.value;
        let fileArray: FileList;
        if (this.createTicketData.file) {
          //fileArray = this.createTicketData.file;
          fileArray = this.ticketGroupForm.controls.file.value;
          Array.from(fileArray).forEach(file => {
            formData.append("file", file);
          });
        }
        // this.createTicketData.file = "";
        let newFormData = Object.assign({}, this.createTicketData);
        formData.append("entityDTO", JSON.stringify(newFormData));
        const url = "/case/save";
        this.taskManagementService.postMethod(url, formData).subscribe(
          (response: any) => {
            if (response.responseCode === 406) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else if (response.responseCode === 417) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else if (response.responseCode === 401) {
              this.messageService.add({
                severity: "info",
                summary: "Info",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.ticketGroupForm.reset();
              if (!this.searchkey) {
                this.getTicket("");
                this.getAssignToMeTicketDetails("");
                this.getAssignToTeamTicketDetails("");
                this.getUnpickTicketDetails("");
              } else {
                this.searchTicket();
              }
              this.searchTicketFun();
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.ticketGroupForm.get("nextFollowupDate").clearValidators();
              this.ticketGroupForm.get("nextFollowupDate").updateValueAndValidity();
              this.ticketGroupForm.get("nextFollowupTime").clearValidators();
              this.ticketGroupForm.get("nextFollowupTime").updateValueAndValidity();
              this.submitted = false;
              this.ticketGroupForm.controls.caseStatus.setValue("Open");
              // this.customerServiceData = [];
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
  }

  formatTime(fromTime) {
    if (typeof fromTime != "string") {
      let hour = new Date(fromTime).getHours();
      let min = new Date(fromTime).getMinutes();
      if (hour < 10) {
        if (min < 10) {
          fromTime = `0${hour}:0${min}`;
        } else {
          fromTime = `0${hour}:${min}`;
        }
      } else {
        if (min < 10) {
          fromTime = `${hour}:0${min}`;
        } else {
          fromTime = `${hour}:${min}`;
        }
      }
      return fromTime;
    } else {
      return fromTime;
    }
  }

  getCaseFor() {
    const url = "/commonList/caseFor";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.caseForData = response.dataList;
        // console.log("this.caseForData", this.caseForData);
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

  getCaseStatus() {
    this.createStatusList = [];
    this.ChangestatusList = [];

    const url = "/commonList/taskStatus";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.statusData = response.dataList;
        this.createStatusList = this.statusData;
        // this.ChangestatusList = this.statusData;
        if (this.chnageStatusForm.value.oldStatus === "Open") {
          const validStatusesForOpen = ["In Progress"];
          const filteredStatusOList = this.statusData.filter(element =>
            validStatusesForOpen.includes(element.value)
          );
          this.ChangestatusList.push(...filteredStatusOList);
        } else if (this.chnageStatusForm.value.oldStatus === "In Progress") {
          const validStatusesForInProgress = [
            "Resolved",
            "Rejected",
            "Done",
            "On-Hold",
            "On Hold",
            "Cancelled"
          ];
          const filteredStatusIPList = this.statusData.filter(element =>
            validStatusesForInProgress.includes(element.value)
          );
          this.ChangestatusList.push(...filteredStatusIPList);
        } else if (
          this.chnageStatusForm.value.oldStatus === "Re-Open" ||
          this.chnageStatusForm.value.oldStatus === "Re Open"
        ) {
          const validStatusesForReOpen = ["In Progress"];
          const filteredStatusROList = this.statusData.filter(element =>
            validStatusesForReOpen.includes(element.value)
          );
          this.ChangestatusList.push(...filteredStatusROList);
        } else if (this.chnageStatusForm.value.oldStatus === "Resolved") {
          const validStatusesForResolved = ["Re-Open", "Re Open", "Done"];
          const filteredStatusRESList = this.statusData.filter(element =>
            validStatusesForResolved.includes(element.value)
          );
          this.ChangestatusList.push(...filteredStatusRESList);
        } else if (this.chnageStatusForm.value.oldStatus === "Rejected") {
          const validStatusesForRejected = ["Re-Open", "Re Open", "Cancelled"];
          const filteredStatusREList = this.statusData.filter(element =>
            validStatusesForRejected.includes(element.value)
          );
          this.ChangestatusList.push(...filteredStatusREList);
        } else if (
          this.chnageStatusForm.value.oldStatus === "On Hold" ||
          this.chnageStatusForm.value.oldStatus === "On-Hold"
        ) {
          const validStatusesForOnHold = ["In Progress", "Cancelled"];
          const filteredStatusOHList = this.statusData.filter(element =>
            validStatusesForOnHold.includes(element.value)
          );
          this.ChangestatusList.push(...filteredStatusOHList);
        } else if (this.chnageStatusForm.value.oldStatus === "Cancelled") {
          const validStatusesForCancelled = ["Discarded"];
          const filteredStatusDisList = this.statusData.filter(element =>
            validStatusesForCancelled.includes(element.value)
          );
          this.ChangestatusList.push(...filteredStatusDisList);
        } else {
          this.ChangestatusList = this.statusData;
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

  // getCaseStatusForChange() {
  //     // this.createStatusList = [];
  //     this.ChangestatusList = [];

  //     const url = "/commonList/taskStatus";
  //     this.commondropdownService.getMethodWithCache(url).subscribe(
  //         (response: any) => {
  //             this.statusData = response.dataList;
  //             this.ChangestatusList = response.dataList;
  //             // this.statusData.forEach(element => {
  //             //     if (
  //             //         currentAssigneeId == null &&
  //             //         this.chnageStatusForm.value.oldStatus === "Resolved" &&
  //             //         element.value === "Closed"
  //             //     ) {
  //             //         this.ChangestatusList.push(element);
  //             //     } else if (currentAssigneeId != null && element.value !== "Raise and Close") {
  //             //         this.ChangestatusList.push(element);
  //             //     }
  //             // });
  //         },
  //         (error: any) => {
  //             console.log(error, "error");
  //             this.messageService.add({
  //                 severity: "error",
  //                 summary: "Error",
  //                 detail: error.error.ERROR,
  //                 icon: "far fa-times-circle"
  //             });
  //         }
  //     );
  // }

  getCustomer() {
    const url = "/getActivecustomers/list?mvnoId =" + localStorage.getItem("mvnoId");
    const custerlist = {
      page: 1,
      pageSize: 10000
    };
    this.customerService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
        // console.log('this.customerData', this.customerData);
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

  getCaseType() {
    const url = "/commonList/caseType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.caseTypeData = response.dataList;
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

  getCaseReasonCategory() {
    const url = "/CaseCategory/all";
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.ticketReasonCategoryDataDropdown = response.dataList;
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

  getCaseOrigin() {
    const url = "/commonList/origin";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.caseOriginData = response.dataList;
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

  // getFollowUoDateAndTime(event) {
  //   // const reasonId = event.value;
  //   const date = new Date();
  //   let caseReason;
  //   const index = this.caseReasonData.findIndex(
  //     (element) => element.reasonId == event.value
  //   );
  //   if (index >= 0) {
  //     caseReason = this.caseReasonData[index];
  //   }
  //   if (
  //     caseReason.tatConsideration ==
  //     RadiusConstants.TAT_CONSIDERATION_TICKET.CREATION
  //   ) {
  //     if (caseReason.timeUnit == "DAY") {
  //       date.setDate(date.getDate() + caseReason.time);
  //     } else if (caseReason.timeUnit == "HOUR") {
  //       date.setHours(date.getHours() + caseReason.time);
  //     } else {
  //       date.setMinutes(date.getMinutes() + caseReason.time);
  //     }
  //   }

  //   // const url = "/caseReason/" + priority;
  //   // this.taskManagementService.getMethod().subscribe
  //   // const date = new Date();
  //   // if (priority == "High") {
  //   //   date.setDate(date.getDate() + 1);
  //   // } else if (priority == "Medium") {
  //   //   date.setDate(date.getDate() + 2);
  //   // } else if (priority == "Low") {
  //   //   date.setDate(date.getDate() + 3);
  //   // }

  //   const follwDate = this.datepipe.transform(date, "yyyy-MM-dd");
  //   const follwTime = this.datepipe.transform(date, "hh:mm:ss");
  //   // this.ticketGroupForm.controls.nextFollowupDate.setValue(follwDate);
  //   // this.ticketGroupForm.controls.nextFollowupTime.setValue(follwTime);
  // }

  getPriority() {
    const url = "/commonList/priority";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.priorityData = response.dataList;
        // console.log("this.priorityData", this.priorityData);
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
  closeProblemDomain() {
    this.ticketServiceList = null;
    this.reasonGroup = null;
    this.problemDomain = null;
    this.subProblemDomain = null;
    this.pickRemark = null;
    this.showChangeProblemDomain = false;
  }

  // getservicesByCustomer(id) {
  //     const url = "/ticketReasonCategory/getAllServiceForSubscribers?customerId=" + id;
  //     this.customerService.getMethod(url).subscribe(
  //         (response: any) => {
  //             this.customerServiceData = response.dataList;
  //             // this.filteredReasonCategoryList = this.ticketReasonCategoryData;
  //         },
  //         (error: any) => {
  //             this.messageService.add({
  //                 severity: "error",
  //                 summary: "Error",
  //                 detail: error.error.ERROR,
  //                 icon: "far fa-times-circle"
  //             });
  //         }
  //     );
  // }

  // getSubCategoryByparentCat(id) {
  //     const url = "/ticketReasonSubCategory/getSubCategoryReasons?parentCategoryId=" + id;
  //     this.taskManagementService.getMethod(url).subscribe(
  //         (response: any) => {
  //             this.ticketReasonSubCategoryData = response.dataList;
  //             this.ticketReasonSubCategoryData.forEach(element => {
  //                 this.TATDetails = [...this.TATDetails, ...element.ticketSubCategoryTatMappingList];
  //             });
  //         },
  //         (error: any) => {
  //             this.messageService.add({
  //                 severity: "error",
  //                 summary: "Error",
  //                 detail: error.error.ERROR,
  //                 icon: "far fa-times-circle"
  //             });
  //         }
  //     );
  // }

  // getGroupReasonBySubCat(id): void {
  //     const selSubCatData = this.ticketReasonSubCategoryData.filter(subCat => subCat.id === id);
  //     this.groupReasonData = selSubCatData[0].ticketSubCategoryGroupReasonMappingList;
  // }

  getTicketById(ticketId) {
    const url = "/case/" + ticketId;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.viewTicketData = response.data;
        this.ticketDeatailData = response.data;
        // this.feedbackDetails = this.ticketDeatailData.caseFeedbackRel;
        //this.rating =  this.feedbackDetails.overall_rating;
        // this.nameOfService = this.ticketDeatailData.serviceAreaName;
        // this.serviceAreaId = this.ticketDeatailData.serviceAreaId;
        if (this.ticketDeatailData.currentAssigneeId) {
          this.getTicketCurrentAssigneeData(this.ticketDeatailData.currentAssigneeId);
        }

        // this.getStaffbyServiceArea();
        // if (this.viewTicketData.ticketReasonCategoryId) {
        //     this.getSubCategoryByparentCat(this.viewTicketData.ticketReasonCategoryId);
        // }
        let time = /\d+:\d+/gi.exec(this.viewTicketData?.nextFollowupTime)?.shift();
        this.viewTicketData.nextFollowupTime = time;
        // console.log("this.viewTicketData", this.viewTicketData);
        this.deletedata = this.viewTicketData;
        this.HelperList = this.viewTicketData?.helperName?.split(",").map(x => x.trim());
        this.getLinkTicket();
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

  async editTicket(ticketId): Promise<void> {
    this.showStatus = true;
    this.showServices = true;
    // this.isTicketUpdate = true;
    if (ticketId) {
      this.getTicketById(ticketId);
      if (this.viewTicketData.caseStatus !== "Closed") {
        this.createTicketFun();
        this.showStatus = true;
        this.showServices = true;
        this.isTicketEdit = true;
        this.isTicketUpdate = true;

        setTimeout(async () => {
          // if (this.viewTicketData.customersId) {

          if (this.viewTicketData && this.isTicketEdit) {
            if (this.viewTicketData.teamId) {
              this.getStaffData(this.viewTicketData.teamId);
            }
            if (this.viewTicketData.caseCategoryId) {
              this.getTicketSubReasonCategoryDataList(this.viewTicketData.caseCategoryId);
            }
          }
          if (this.viewTicketData.incidentStartDate) {
            this.viewTicketData.incidentStartDate = new Date(this.viewTicketData.incidentStartDate);
          }
          if (this.viewTicketData.incidentEndDate) {
            this.viewTicketData.incidentEndDate = new Date(this.viewTicketData.incidentEndDate);
          }
          this.ticketGroupForm.patchValue(this.viewTicketData);
          // this.getCustomersDetail(this.viewTicketData.customersId);
          // this.getservicesByCustomer(this.viewTicketData.customersId);
          // }
          setTimeout(async () => {
            this.ticketGroupForm.patchValue({
              caseStatus: this.viewTicketData.caseStatus
            });
            // if (this.viewTicketData.ticketReasonCategoryId)
            //     this.ticketGroupForm.patchValue(this.viewTicketData);
            const selectedStatusOption = this.createStatusList.find(
              option => option.value === this.viewTicketData.caseStatus
            );
            if (selectedStatusOption) {
              this.ticketGroupForm.controls.caseStatus.setValue(selectedStatusOption.value);
            }
            // this.getSubCategoryByparentCat(this.viewTicketData.ticketReasonCategoryId);
            // if (this.viewTicketData.ticketServicemappingList) {
            //     let serviceId = [];
            //     this.viewTicketData.ticketServicemappingList.forEach((e: any) => {
            //         serviceId.push(e.serviceid);
            //     });
            //     this.ticketGroupForm.patchValue({
            //         ticketServicemappingList: serviceId
            //     });
            //     this.getTicketReasonCategory(serviceId);
            // }
          }, 500);
          setTimeout(async () => {
            // if (this.viewTicketData.reasonSubCategoryId) {
            //     await this.getGroupReasonBySubCat(this.viewTicketData.reasonSubCategoryId);
            // }
          }, 1000);

          // const list = { text: "In-Progress", value: "In-Progress" };
          // this.createStatusList.push(list);
          this.ticketGroupForm.patchValue(this.viewTicketData);
          this.ticketGroupForm.patchValue({
            // customersId: this.viewTicketData.customersId,
            caseStatus: this.viewTicketData.caseStatus
          });
          // this.ticketGroupForm.controls.caseStatus.setValue(
          //     this.viewTicketData.caseStatus
          // );
          this.getResolutionReasons(this.viewTicketData.caseStatus);
          this.ticketGroupForm.controls.finalResolutionId.setValue(
            this.viewTicketData.finalResolutionId
          );
        }, 500);
      } else {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Can not edit close tickets.",
          icon: "far fa-times-circle"
        });
        return;
      }
    }
  }

  searchTicket(): void {
    if (
      this.searchGroupForm.controls.searchOption.value == "TAT_BREATCH" ||
      this.searchGroupForm.controls.searchOption.value == "RESPONSE_TIME_BREACH"
    ) {
      this.searchGroupForm.get("searchValue").clearValidators();
      this.searchGroupForm.get("searchValue").updateValueAndValidity();
    }
    this.searchSubmitted = true;
    if (this.searchGroupForm.valid) {
      let data: any = [];
      if (!this.searchkey || this.searchkey !== this.searchTicketDetail) {
        this.currentPageTicketConfig = 1;
      }
      this.searchkey = this.searchTicketDetail;
      if (this.showItemPerPage) {
        this.pageITEM = this.showItemPerPage;
      }
      // if (this.searchservicearea_id) {
      //   let data1 = {
      //     filterValue: this.searchservicearea_id,
      //     filterColumn: "servicearea_id",
      //     // filterOperator: "equalto",
      //     // filterCondition: "any",
      //   };
      //   data.push(data1);
      // }
      // if (this.searchticketReasonCategoryId) {
      //   let data2 = {
      //     filterValue: this.searchticketReasonCategoryId,
      //     filterColumn: "ticketReasonCategoryId",
      //     // filterOperator: "equalto",
      //     // filterCondition: "any",
      //   };
      //   data.push(data2);
      // }
      // if (this.searchCustomerId) {
      //   let data2 = {
      //     filterValue: this.searchCustomerId,
      //     filterColumn: "customerId",
      //   };
      //   data.push(data2);
      // }
      // if (this.searchcaseStatus) {
      //   let data3 = {
      //     filterValue: this.searchcaseStatus,
      //     filterColumn: "caseStatus",
      //   };
      //   data.push(data3);
      // }
      // let data3 = {
      //   //     filterValue: this.searchcaseStatus,
      //   //     filterColumn: "caseStatus",
      //   //   };
      data.push({
        filterValue: this.searchGroupForm.controls.searchValue.value,
        filterColumn: this.searchGroupForm.controls.searchOption.value
      });
      this.searchData = {
        filters: data,
        page: this.currentPageTicketConfig,
        pageSize: this.pageITEM,
        sortBy: "createdate",
        sortOrder: 0
      };

      const url = "/case/case/search";
      this.taskManagementService.postMethod(url, this.searchData).subscribe(
        (response: any) => {
          if (response.responseCode == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
            this.ticketData = [];
            this.ticketConfigtotalRecords = 0;
          } else {
            this.ticketData = response.dataList;
            this.ticketConfigtotalRecords = response.totalRecords;
          }
          this.searchSubmitted = false;
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

  // getTicketStatus(event) {
  //   const selTicketStatus = event.value;
  //   if (selTicketStatus == "Open") {
  //     this.assignStaffTicketForm.controls.assignee.enable();
  //   } else {
  //     this.assignStaffTicketForm.controls.assignee.disable();
  //   }
  // }

  clearSearchTicket(): void {
    this.searchTicketDetail = "";
    this.getTicket("");
    this.getAssignToMeTicketDetails("");
    this.getAssignToTeamTicketDetails("");
    this.getUnpickTicketDetails("");
    this.searchcaseStatus = "";
    this.searchservicearea_id = "";
    this.searchticketReasonCategoryId = "";
    this.searchGroupForm.reset();
  }

  deleteConfirmonTicket(ticketId: number): void {
    this.getTicketById(ticketId);
    if (ticketId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Ticket?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteTicket(ticketId);
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

  deleteTicket(ticketId): void {
    const url = "/case/delete";
    // this.deletedata.pincodeId = pincodeId;
    // console.log("this.createQosPolicyData", this.deletedata);
    this.taskManagementService.postMethod(url, this.deletedata).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentPageTicketConfig != 1 && this.totalDataListLength == 1) {
            this.currentPageTicketConfig = this.currentPageTicketConfig - 1;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          if (!this.searchkey) {
            this.getTicket("");
          } else {
            this.searchTicket();
          }
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.responseMessage,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  // assignStaffTicket() {
  //   this.staffsubmmitted = true;
  //   if (this.assignStaffTicketForm.valid) {
  //
  //     const date = new Date();
  //     this.assignTicketData = this.assignStaffTicketForm.value;
  //     if (this.assignticketStatus == "Unassigned") {
  //       this.assignTicketData.status = "Assigned";
  //     }
  //     this.assignTicketData.remarkType = "Update";
  //     // this.assignTicketData.status = this.assignticketStatus;
  //     this.assignTicketData.ticketId = this.assignticketId;
  //     // const ticket = this.ticketData.find(
  //     //   (element) => element.caseId == this.assignticketId
  //     // );
  //     // const timeUnit = ticket.caseReasonTimeUnit;
  //     // const time = ticket.caseReasonTime;
  //     // const tatConsideration = ticket.tatConsideration;
  //     // if (tatConsideration) {
  //     //   if (timeUnit == 'DAY') {
  //     //     date.setDate(date.getDate() + time);
  //     //   } else if (timeUnit == 'HOUR') {
  //     //     date.setHours(date.getHours() + time);
  //     //   } else {
  //     //     date.setMinutes(date.getMinutes() + time);
  //     //   }
  //     //   this.assignTicketData.nextFollowupDate = this.datepipe.transform(
  //     //     date,
  //     //     'yyyy-MM-dd'
  //     //   );
  //     //   this.assignTicketData.nextFollowupTime = this.datepipe.transform(
  //     //     date,
  //     //     'hh:mm:ss'
  //     //   );
  //     // }

  //     // const url = "/caseReason/" + priority;
  //     // this.taskManagementService.getMethod().subscribe
  //     // const date = new Date();
  //     // if (priority == "High") {
  //     //   date.setDate(date.getDate() + 1);
  //     // } else if (priority == "Medium") {
  //     //   date.setDate(date.getDate() + 2);
  //     // } else if (priority == "Low") {
  //     //   date.setDate(date.getDate() + 3);
  //     // }

  //     // const follwDate =
  //     // const follwTime =

  //     const formData = new FormData();
  //     formData.append("caseUpdate", JSON.stringify(this.assignTicketData));
  //     // console.log("this.assignTicketData", formData);
  //     // return;
  //     const url = "/case/updateDetails";
  //     this.taskManagementService.assignMethod(url, formData).subscribe(
  //       (response: any) => {
  //         if (response.responseCode == 406) {
  //           this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: response.responseMessage,
  //             icon: "far fa-times-circle",
  //           });
  //
  //         } else {
  //           this.assignStaffTicketForm.reset();
  //           $("#assignTicketModal").modal("hide");
  //           if (!this.searchkey) {
  //             this.getTicket("");
  //           } else {
  //             this.searchTicket();
  //           }
  //           this.messageService.add({
  //             severity: "success",
  //             summary: "Successfully",
  //             detail: response.responseMessage,
  //             icon: "far fa-check-circle",
  //           });
  //           this.staffsubmmitted = false;
  //
  //         }
  //       },
  //       (error: any) => {
  //         console.log(error, "error");
  //         this.messageService.add({
  //           severity: "error",
  //           summary: "Error",
  //           detail: error,
  //           icon: "far fa-times-circle",
  //         });
  //
  //       }
  //     );
  //   }
  // }

  createTicketFun(): void {
    this.showStatus = false;
    this.showServices = false;
    this.viewTicket = false;
    this.createTicket = true;
    this.submitted = false;
    this.isTicketEdit = false;
    this.isTicketUpdate = false;
    this.ticketGroupForm.reset();
    // this.customerServiceData = [];
    this.selectedFilePreview = [];
    // this.ticketGroupForm.controls.caseStatus.setValue("Open");
    // this.ticketGroupForm.controls.caseStatus.disable();
    // this.ticketGroupForm.controls.customersId.enable();
    // this.ticketGroupForm.controls.rootCauseReasonId.disable();
    this.detailTicket = false;
    this.getResolutionReasons("Open");

    this.ticketGroupForm.patchValue({
      priority: "Low"
    });

    this.searchcaseStatus = "";
    this.searchservicearea_id = "";
    this.searchticketReasonCategoryId = "";
  }

  searchTicketFun(): void {
    this.showStatus = true;
    this.showServices = true;
    this.viewTicket = true;
    this.createTicket = false;
    this.detailTicket = false;
    this.searchSubmitted = false;
    this.isTicketEdit = false;
    this.selectedFilePreview = [];
    this.searchcaseStatus = "";
    this.searchservicearea_id = "";
    this.searchticketReasonCategoryId = "";
    this.currentPageTicketConfig = 1;
    this.ticketConfigitemsPerPage = 5;
    this.showItemPerPage = 5;
    this.getTicket("");
    this.getAllStaffByParentStaff("");
  }

  openModal(custId) {
    this.dialogId = true;
    this.custId.next({
      custId: custId
    });
  }

  closeSelectStaff() {
    this.dialogId = false;
  }

  selCustomer(event): void {
    // this.ticketGroupForm.controls.department.setValue("");
    // this.getCustomersDetail(event.value);
    // this.getservicesByCustomer(event.value);
  }

  // selReasonCategory(event) {
  //     this.getSubCategoryByparentCat(event.value);
  // }

  // selReasonSubCategory(event) {
  //     this.getGroupReasonBySubCat(event.value);
  // }

  // selectDeparment(event) {
  //     if (this.ticketReasonCategoryData) {
  //         let array: [] = this.ticketReasonCategoryData;
  //         this.filteredReasonCategoryList = [];
  //         array.filter((e: any) => {
  //             if (e == null || e.department === event.value) {
  //                 this.filteredReasonCategoryList.push(e);
  //             }
  //         });
  //     }
  // }

  // getCustomersDetail(custId) {
  //     const url = "/customers/" + custId;
  //     this.customerService.getMethod(url).subscribe(
  //         (response: any) => {
  //             this.customerDetailData = response.customers;
  //             // console.log("this.customerDetailData", this.customerDetailData);
  //             this.parentCustList = [
  //                 {
  //                     id: Number(custId),
  //                     name: this.customerDetailData.username
  //                 }
  //             ];
  //             this.ticketGroupForm.controls.serviceAreaName.setValue(
  //                 this.customerDetailData.serviceareaName
  //             );
  //             this.ticketGroupForm.controls.userName.setValue(this.customerDetailData.username);
  //             // console.log("this.customerLedgerDetailData", this.customerDetailData);
  //         },
  //         (error: any) => {
  //             console.log(error, "error");
  //             this.messageService.add({
  //                 severity: "error",
  //                 summary: "Error",
  //                 detail: error.error.ERROR,
  //                 icon: "far fa-times-circle"
  //             });
  //         }
  //     );
  // }

  getTeamData() {
    this.teamsService.getAllParentTeam().subscribe(
      (response: any) => {
        this.teamListData = response.dataList;
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

  onSelectTeam(event) {
    if (event.value !== null && event.value !== undefined) {
      this.getStaffData(event.value);
      this.ticketGroupForm.controls.caseStatus.setValue("Open");
      this.ticketGroupForm.controls.caseStatus.disable();
    } else {
      this.ticketGroupForm.controls.caseStatus.setValue(null);
      this.ticketGroupForm.controls.caseStatus.enable();
    }
    // this.ticketGroupForm.controls.teamId.setValue(event.value[0]);
  }

  getStaffData(id: any) {
    const url = "/staffuser/getByTeamId?teamId=" + id;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.staffDataList = response.dataList;
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

  onSelectStaff(event) {
    //     console.log(event.value);
    //     // let data = this.staffDataList.find(x => x.id == event.value[0]);
    //     // this.ticketGroupForm.controls.staffId.setValue(event.value[0]);
    //     // this.ticketGroupForm.controls.userName.setValue(data.username);
    //     // this.ticketGroupForm.controls.mobile.setValue(data.phone);
    //     // this.ticketGroupForm.controls.email.setValue(data.email);
    if (event.value !== null && event.value !== undefined) {
      this.ticketGroupForm.controls.caseStatus.setValue("In Progress");
      this.ticketGroupForm.controls.caseStatus.disable();
    } else {
      this.ticketGroupForm.controls.caseStatus.setValue(null);
      this.ticketGroupForm.controls.caseStatus.enable();
    }
  }

  getStaffDetail(custId) {
    const url = "/customers/" + custId;
    this.customerService.getMethod(url).subscribe(
      (response: any) => {
        this.customerDetailData = response.customers;
        // console.log("this.customerDetailData", this.customerDetailData);
        this.parentCustList = [
          {
            id: Number(custId)
            // name: this.customerDetailData.username
          }
        ];
        // this.ticketGroupForm.controls.serviceAreaName.setValue(
        //     this.customerDetailData.serviceareaName
        // );
        // this.ticketGroupForm.controls.userName.setValue(this.customerDetailData.username);
        // console.log("this.customerLedgerDetailData", this.customerDetailData);
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

  openStaffDetailModal(staffId) {
    this.staffDetailModal = true;

    const url = "/staffuser/" + staffId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.staffData = response.Staff;
        //console.log("this.staffData", this.staffData);
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

  closeStaffDetailModal() {
    this.staffDetailModal = false;
  }

  assignTicket(ticketId, ticketStatus) {
    this.assignStaffTicketForm.reset();
    this.staffsubmmitted = false;
    this.assignticketId = ticketId;
    this.assignTicketStatus = ticketStatus;
    this.assignTicketModal = true;
    if (ticketStatus != "Closed") {
      // this.getTeamData();
      this.getTeamList();
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "Can not assign close tickets.",
        icon: "far fa-times-circle"
      });
      return;
    }
  }

  ratingTicketModalOpen(id) {
    this.ratingTicketModal = true;
    this.ratingTicketId = id;
    this.ratingTicketForm.reset();
  }

  ratingTicket() {
    this.ratingSubmmitted = true;
    const data = {
      rating: this.ratingTicketForm.controls.rating.value,
      customerFeedback: this.ratingTicketForm.controls.customerFeedback.value,
      caseId: this.ratingTicketId
    };
    if (data.rating != null) {
      if (this.ratingTicketForm.valid) {
        const url = "/case/rating";
        this.taskManagementService.postMethod(url, data).subscribe(
          (response: any) => {
            this.ratingSubmmitted = false;
            this.ratingTicketModal = false;
            this.getTicket("");

            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
          },
          (error: any) => {
            // console.log(error, 'error');
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: error.error.ERROR,
              icon: "far fa-times-circle"
            });
          }
        );
      }
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Rating is required",
        icon: "far fa-times-circle",
        sticky: true
      });
    }
  }

  followupTicketModalOpen(ticketId, custId, staffId) {
    // this.followUpModal = true;
    this.followupForm.reset();
    this.folloupTicketId = ticketId;
    this.folloupCustId = custId;
    this.folloupTicketassignStaffId = staffId;
    this.followupPopupOpen = true;
    this.generatedNameOfTheFollowUp(this.folloupTicketId);

    // this.scheduleFollowupPopupOpen();
  }

  followupTicket() {
    this.followupSubmmitted = true;
    if (this.followupForm.valid) {
      const data = {
        remarkType: this.followupForm.controls.remarkType.value,
        isFromCustomer: false,
        remark: this.followupForm.controls.remark.value,
        custId: this.folloupCustId,
        caseId: this.folloupTicketId,
        remarkDate: this.datepipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss"),
        staffId: this.folloupTicketassignStaffId
      };
      // console.log(' this.createTicketFollowupData', data);
      const url = "/ticketFollowupDetails/save";
      this.taskManagementService.postMethod(url, data).subscribe(
        (response: any) => {
          this.followupSubmmitted = false;
          this.followUpModal = false;
          this.getFollowUpDetailById(this.folloupTicketId);
          this.openTicketDetail(this.viewTicketData.caseId);
          this.getFollowUpDetailById(this.folloupTicketId);

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          // console.log(error, 'error');
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

  getTeamList() {
    const url = "/teams/getAllTeamsWithoutPagination";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.teamListData = response.dataList;
        // console.log(this.teamListData);
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

  getStaff(ticketId: number | string) {
    const url = "/case/reassingTask?id=" + ticketId;
    const tasksAssignDTO = {
      caseId: ticketId,
      staffId: null,
      teamId: null,
      isReassignTask: true
    };
    this.taskManagementService.postMethod(url, tasksAssignDTO).subscribe(
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
          this.assignTicketModal = true;
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

  checkChangeProblemDomain(ticket) {
    // this.ticketReasonSubCategoryData = "";
    this.parentTRCData = "";
    this.childTRCData = "";
    this.ticketDataForDomain = ticket;
    this.assignTicketStatus = ticket.caseStatus;
    this.showChangeProblemDomain = true;
    this.getTicketReasonCategoryDataList();
    // const url = `/case/reassignTicket?caseId=${ticket.caseId}`;
    // this.taskManagementService.getMethod(url).subscribe(
    //     (response: any) => {
    //         if (response.data == "TRUE") {
    //             // this.getservicesByCustomer(ticket.customersId);
    //             this.showChangeProblemDomain = true;
    //         } else {
    //             this.messageService.add({
    //                 severity: "info",
    //                 summary: "Alert",
    //                 detail: "Not eligible to change problem domain...",
    //                 icon: "far fa-times-circle"
    //             });
    //         }
    //     },
    //     (error: any) => {
    //         this.messageService.add({
    //             severity: "error",
    //             summary: "Error",
    //             detail: error.error.errorMessage,
    //             icon: "far fa-times-circle"
    //         });
    //     }
    // );
  }

  problemDomain: any;
  subProblemDomain: any;
  ticketServiceList: any;
  reasonGroup: any;
  ticketDataForDomain: any;

  changeProblemDomain() {
    // this.ticketReasonSubCategoryData = "";
    this.parentTRCData = "";
    this.childTRCData = "";
    const updateDetails: any = {};
    updateDetails.ticketId = this.ticketDataForDomain.caseId;
    updateDetails.status = this.ticketDataForDomain.caseStatus;
    updateDetails.remark = this.pickRemark;
    updateDetails.remarkType = "Change Problem Domain";
    // updateDetails.ticketReasonCategoryId = this.problemDomain;
    updateDetails.caseCategoryId = this.caseCategoryId;
    updateDetails.caseSubCategoryId = this.caseSubCategoryId;
    updateDetails.groupReasonId = null;
    const formData = new FormData();
    formData.append("caseUpdate", JSON.stringify(updateDetails));
    const url = "/case/updateDetails";
    this.taskManagementService.assignMethod(url, formData).subscribe(
      (response: any) => {
        if (response.responseCode === 406) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (!this.searchkey) {
            this.getTicket("");
          } else {
            this.searchTicket();
          }

          this.openTicketDetail(this.viewTicketData.caseId);
          // this.searchTicketFun();
          this.showChangeProblemDomain = false;
          this.pickRemark = null;
          this.problemDomain = null;
          this.ticketDataForDomain = null;
          this.subProblemDomain = null;
          this.reasonGroup = null;
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

  hourSequence() {
    for (let i = 0; i < 24; i++) {
      this.hourArray.push(i + 1);
    }
  }

  openTicketDetail(ticketId): void {
    this.viewTicket = false;
    this.createTicket = false;
    this.detailTicket = true;
    this.viewTicketId = ticketId;
    this.getTicketById(ticketId);
    this.getFollowUpDetailById(ticketId);
    // this.getCafFollowupList("");
    this.ticketETRListShow(ticketId);
    this.getTicketTatListShow(ticketId);
    this.getworkflowAuditDetails("", ticketId, "CASE");
    this.showTATDetailsData();
  }

  getFollowUpDetailById(ticketId): void {
    const url = "/ticketFollowupDetails/getAllByCaseId/" + ticketId;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.followUpTicketListData = response.dataList;
        this.ticketRemarkListData = response.dataList.filter(
          data => data.remarkType === "Internal Remark"
        );
        this.conversationListData = response.dataList.filter(
          data => data.remarkType === "External Remark"
        );
      },
      (error: any) => {
        // console.log(error, 'error');
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  minuteSequence(n: number): Array<number> {
    return Array(n);
  }

  pageChangedTicketConfig(pageNumber): void {
    this.currentPageTicketConfig = pageNumber;
    if (!this.searchkey) {
      this.getTicket("");
    } else {
      this.searchTicket();
    }
  }

  pageChangedLinkTicket(pageNumber): void {
    this.currentPageTicketConfig = pageNumber;
    // if (!this.searchkey) {
    this.getLinkableTickets(this.ticketDeatailData);
    // } else {
    //   this.searchTicket();
    // }
  }
  totalItemPerPageLinkTicket(event) {
    // this.showItemPerPage = Number(event.value);
    this.linkTicketItemsPerPage = Number(event.value);
    if (this.currentPageTicketConfig > 1) {
      this.currentPageTicketConfig = 1;
    }
    this.getLinkableTickets(this.ticketDeatailData);
  }

  viewProgressDetails(caseUpdate): void {
    this.caseUpdateDetails = caseUpdate.updateDetails;
    this.caseUpdateDetailsModel = true;
  }

  closeCaseUpdatePopup(): void {
    this.caseUpdateDetailsModel = false;
  }

  getResolutionReasons(event) {
    const subCatId = this.ticketGroupForm.controls.caseCategoryId.value;
    var value = event.value;
    this.ticketGroupForm.patchValue({ finalResolutionId: "", rootCauseReasonId: "" });
    if (value === "Resolved") {
      if (this.viewTicketData.currentAssigneeId == this.currentLoginUserId) {
        this.ticketGroupForm.controls.finalResolutionId.enable();
        this.ticketGroupForm.controls.finalResolutionId.clearValidators();
        this.ticketGroupForm.controls.finalResolutionId.updateValueAndValidity();
        const url = "/resolutionReasons/searchBySubCategory/" + subCatId;

        this.taskManagementService.getMethod(url).subscribe(
          (response: any) => {
            this.resolutionReasonData = response.dataList;
            // console.log("this.resolutionReasonData", this.resolutionReasonData);
          }
          // (error: any) => {
          //     console.log(error, "error");
          //     this.messageService.add({
          //         severity: "error",
          //         summary: "Error",
          //         detail: error.error.ERROR,
          //         icon: "far fa-times-circle"
          //     });
          // }
        );
      } else {
        this.ticketGroupForm.controls.caseStatus.setValue("");

        this.messageService.add({
          severity: "info",
          summary: "Information",
          detail: "You are not allowed to mark this ticket as resolved.",
          icon: "far fa-times-circle"
        });
      }
    }
    if (value === "Raise and Close") {
      this.ticketGroupForm.controls.finalResolutionId.enable();
      this.ticketGroupForm.controls.finalResolutionId.setValidators(Validators.required);
      this.ticketGroupForm.controls.finalResolutionId.updateValueAndValidity();
      const url = "/resolutionReasons/searchBySubCategory/" + subCatId;
      this.taskManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.resolutionReasonData = response.dataList;
        },
        () => {}
      );
    } else if (value != "Resolved") {
      this.ticketGroupForm.controls.finalResolutionId.disable();
      this.ticketGroupForm.controls.finalResolutionId.clearValidators();
      this.ticketGroupForm.controls.finalResolutionId.updateValueAndValidity();
    }

    if (value === "Follow Up") {
      this.ticketGroupForm.controls.nextFollowupDate.setValidators(Validators.required);
      this.ticketGroupForm.controls.nextFollowupDate.updateValueAndValidity();
      this.ticketGroupForm.controls.nextFollowupTime.setValidators(Validators.required);
      this.ticketGroupForm.controls.nextFollowupTime.updateValueAndValidity();
    } else {
      this.ticketGroupForm.controls.nextFollowupDate.clearValidators();
      this.ticketGroupForm.controls.nextFollowupDate.updateValueAndValidity();
      this.ticketGroupForm.controls.nextFollowupTime.clearValidators();
      this.ticketGroupForm.controls.nextFollowupTime.updateValueAndValidity();
    }
  }

  changeStatusSingleMultiple = "";

  changeStatusModalOpen(data, tickT): void {
    if (tickT == "pTicket") {
      this.changeStatusSingleMultiple = tickT;
      if (data.caseStatus === "Closed") {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "Can not change status as ticket is closed .",
          icon: "far fa-times-circle"
        });
        return;
      } else {
        this.chnageStatusForm = this.fb.group({
          ticketId: [data.caseId],
          oldStatus: [data.caseStatus],
          newStatus: ["", Validators.required],
          remark: [""],
          customerId: [data.customersId],
          // finalResolutionId: [""],
          // rootCauseReasonId: [""],
          helperName: [""],
          nextFollowupDate: [""],
          nextFollowupTime: [""],
          serviceAreaValue: [""],
          call_status: [""],
          is_closed: [""],
          deacivate_reason: [""]
        });
        this.changeStatusModal = true;
      }
      //   this.getCaseStatusForChange();
    } else if (tickT == "mTicket") {
      this.isCall = false;
      this.changeStatusSingleMultiple = tickT;
      this.confirmChangeStatus();
    }
    this.getCaseStatus();
  }
  helperStringData: any;
  changeStatusTicket(): void {
    this.changeStausSubmitted = true;
    if (this.chnageStatusForm.valid) {
      const formData = new FormData();
      this.createTicketData = this.chnageStatusForm.value;
      this.helperdata = this.createTicketData.helperName;
      if (this.helperdata != null && this.helperdata != undefined && this.helperdata != "") {
        this.helperStringData = this.helperdata.map(element => `${element}`).join(",");
      } else {
        this.helperStringData = "";
      }
      const updateDetails: any = {};
      updateDetails.ticketId = this.createTicketData.ticketId;
      updateDetails.status = this.createTicketData.newStatus;
      updateDetails.remark = this.createTicketData.remark;
      updateDetails.remarkType = "Change status";
      const formattedEndDate = this.createTicketData.incidentEndDate
        ? this.datepipe.transform(
            new Date(this.createTicketData.incidentEndDate),
            "yyyy-MM-dd HH:mm:ss"
          )
        : null;

      updateDetails.incidentEndDate = formattedEndDate;

      (updateDetails.helperName = this.helperStringData),
        (updateDetails.nextFollowupDate = this.createTicketData.nextFollowupDate),
        (updateDetails.nextFollowupTime = this.formatTime(this.createTicketData.nextFollowupTime));

      if (this.createTicketData.newStatus === "Resolved") {
        updateDetails.finalResolutionId = this.createTicketData.finalResolutionId;
        // updateDetails.rootCauseReasonId = this.createTicketData.rootCauseReasonId;

        const resolutionDto = {
          resolutionId: this.createTicketData.finalResolutionId,
          caseId: this.createTicketData.ticketId,
          remarks: this.uploadRootForm.get("uploadremark")?.value || "",
          latitude: this.uploadRootForm.get("latitude")?.value,
          longitude: this.uploadRootForm.get("longitude")?.value
        };

        formData.append("resoultionFileMappingDTO", JSON.stringify(resolutionDto));

        const files: File[] = this.uploadRootForm.get("resolutionFiles")?.value || [];
        for (let i = 0; i < files.length; i++) {
          formData.append("resolutionFiles", files[i]);
        }

        if (this.uploadformData?.length > 0) {
          this.uploadformData.forEach((section, i) => {
            formData.append(`sections[${i}].name`, section.name);
            formData.append(`sections[${i}].latitude`, section.latitude);
            formData.append(`sections[${i}].longitude`, section.longitude);
            formData.append(`sections[${i}].opticalRange`, section.opticalRange);
            section.files.forEach((file: File) => {
              formData.append(`sections[${i}].files`, file);
            });
          });
        }
      }
      if (this.createTicketData.newStatus === "Closed") {
        if (this.updatefeedbackDetails.length == 0) {
          updateDetails.call_status = this.createTicketData.call_status;
          updateDetails.is_closed = this.createTicketData.is_closed;
          updateDetails.caseFeedbackRel = null;
          updateDetails.deacivate_reason = this.createTicketData.deacivate_reason;
        } else {
          updateDetails.call_status = this.createTicketData.call_status;
          updateDetails.is_closed = this.createTicketData.is_closed;
          updateDetails.caseFeedbackRel = [this.updatefeedbackDetails];
          updateDetails.deacivate_reason = this.createTicketData.deacivate_reason;
        }
      }
      //console.log("------------------", updateDetails);

      formData.append("caseUpdate", JSON.stringify(updateDetails));
      // console.log("this.assignTicketData", formData);
      // return;
      const url = "/case/updateDetails";
      this.taskManagementService.assignMethod(url, formData).subscribe(
        (response: any) => {
          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Information",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else if (response.responseCode == 404) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else if (response.responseCode === 406) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            if (!this.searchkey) {
              this.getTicket("");
            } else {
              this.searchTicket();
            }

            this.openTicketDetail(this.viewTicketData.caseId);
            // this.searchTicketFun();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.uploadformData = [];
            this.chnageStatusForm.reset();
            this.uploadRootForm.reset();
            this.selectedFileUploadPreview = [];
            const fileInput = document.getElementById("txtSelectDocument") as HTMLInputElement;
            if (fileInput) {
              fileInput.value = "";
            }
            this.changeStausSubmitted = false;
            this.changeStatusModal = false;
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

  closeChangeStatus(): void {
    this.isCallDisconnected = false;
    this.changeStatusModal = false;
    this.isCall = false;
    this.isticket = false;
    this.isProblemType = false;
    this.isEnable = false;
    //this.chnageStatusForm.reset();
    this.feedbackForm.reset();
    this.uploadRootForm?.reset();
    this.selectedFileUploadPreview = [];
    this.uploadformData = [];

    const fileInput = document.getElementById("txtSelectDocument") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  closeFeedbackFormModal() {
    this.feedbackFormModal = false;
  }

  getResolutionReasonsChangeStatus(value: string): void {
    this.getAllStaff();
    this.changeStatusSelection(value);
    this.showIncidentEndDateCalendar = value === "Done";
    if (value === "Done") {
      if (!this.chnageStatusForm.get("incidentEndDate")) {
        this.chnageStatusForm.addControl(
          "incidentEndDate",
          new FormControl("", Validators.required)
        );
      }
    } else {
      if (this.chnageStatusForm.get("incidentEndDate")) {
        this.chnageStatusForm.removeControl("incidentEndDate");
      }
    }
    if (value === "Resolved") {
      this.uploadResolveDocument();
      // this.chnageStatusForm.controls.finalResolutionId.enable();
      const url = `/resolutionReasons/searchBySubCategory/${this.viewTicketData.caseCategoryId}`;
      this.taskManagementService.getMethod(url).subscribe(
        () => {
          // this.resolutionReasonData = response.dataList;
          // console.log("this.resolutionReasonData", this.resolutionReasonData);
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
      //   this.chnageStatusForm.controls.finalResolutionId.disable();
      //   this.chnageStatusForm.controls.rootCauseReasonId.disable();
      // this.chnageStatusForm.controls.finalResolutionId.setValue("");
      // this.chnageStatusForm.controls.rootCauseReasonId.setValue("");
    }

    if (value === "Follow Up") {
      this.chnageStatusForm.controls.nextFollowupDate.setValidators(Validators.required);
      this.chnageStatusForm.controls.nextFollowupDate.updateValueAndValidity();
      this.chnageStatusForm.controls.nextFollowupTime.setValidators(Validators.required);
      this.chnageStatusForm.controls.nextFollowupTime.updateValueAndValidity();
    } else {
      this.chnageStatusForm.controls.nextFollowupDate.clearValidators();
      this.chnageStatusForm.controls.nextFollowupDate.updateValueAndValidity();
      this.chnageStatusForm.controls.nextFollowupTime.clearValidators();
      this.chnageStatusForm.controls.nextFollowupTime.updateValueAndValidity();
    }
    if (value === "Closed") {
      this.isCall = true;
      this.isticket = true;
      const url = "/resolutionReasons/searchBySubCategory/" + this.viewTicketData.caseCategoryId;
      this.taskManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.resolutionReasonData = response.dataList;
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
      //   console.log("Resolved 1");
      //    this.getResolutionRootCause(value);
    } else {
      this.isCall = false;
      this.isticket = false;
      this.isCallDisconnected = false;
      this.chnageStatusForm.get("is_closed").clearValidators();
      this.chnageStatusForm.get("is_closed").updateValueAndValidity();
    }
  }

  getResolutionReasonsChangeStatusbulk(value: string): void {
    this.getAllStaff();
    this.caseFeedbackRel = null;
    this.feedbackForm.reset();
    this.isCall = false;
    this.isticket = false;
    this.isCallDisconnected = false;
    this.changeStatusSelection(value);
    if (value === "Resolved") {
      this.chnageStatusForm.controls.finalResolutionId.enable();
      this.chnageStatusForm.get("finalResolutionId").clearValidators();
      this.chnageStatusForm.get("finalResolutionId").updateValueAndValidity();
      this.chnageStatusForm.get("rootCauseReasonId").clearValidators();
      this.chnageStatusForm.get("rootCauseReasonId").updateValueAndValidity();

      const url = `/resolutionReasons/all`;
      this.taskManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.resolutionReasonData = response.dataList;
          // console.log("this.resolutionReasonData", this.resolutionReasonData);
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
      //   this.chnageStatusForm.controls.finalResolutionId.disable();
      //   this.chnageStatusForm.controls.rootCauseReasonId.disable();
      this.chnageStatusForm.controls.finalResolutionId.setValue("");
      // this.chnageStatusForm.controls.rootCauseReasonId.setValue("");
    }

    if (value === "Follow Up") {
      this.chnageStatusForm.controls.nextFollowupDate.setValidators(Validators.required);
      this.chnageStatusForm.controls.nextFollowupDate.updateValueAndValidity();
      this.chnageStatusForm.controls.nextFollowupTime.setValidators(Validators.required);
      this.chnageStatusForm.controls.nextFollowupTime.updateValueAndValidity();
    } else {
      this.chnageStatusForm.controls.nextFollowupDate.clearValidators();
      this.chnageStatusForm.controls.nextFollowupDate.updateValueAndValidity();
      this.chnageStatusForm.controls.nextFollowupTime.clearValidators();
      this.chnageStatusForm.controls.nextFollowupTime.updateValueAndValidity();
    }
  }

  // getAssignTo(value: string): void {
  //
  //     const ticket = this.ticketData.find(element => element.caseId === this.assignticketId);
  //     // this.assignToTeam = false;
  //     this.assignToStaff = true;
  //     this.assignStaffTicketForm.controls.staffId.enable();
  //     // this.assignStaffTicketForm.controls.teamId.disable();
  //     this.taskManagementService
  //         .getMethod('/ticketReasonCategory/' + ticket.ticketReasonCategoryId)
  //         .subscribe(
  //             (response: any) => {
  //                 const ticketReasonCategoryTATMappingList: any[] =
  //                     response.data.ticketReasonCategoryTATMappingList;
  //                 ticketReasonCategoryTATMappingList.forEach(element => {
  //                     if (element.mappingId === ticket.tatMappingId) {
  //                         const teamId = element.teamId;
  //                         this.taskManagementService
  //                             .getMethod('/teams/getStaffUsersFromTeamId/' + teamId)
  //                             .subscribe(
  //                                 (res: any) => {
  //                                     this.assignableStaffList = res.dataList;
  //                                     this.assignableStaffList = this.assignableStaffList.filter(
  //                                         e => e.id !== this.currentLoginUserId && ticket.currentAssigneeId !== e.id
  //                                     );
  //                                 },
  //                                 (error: any) => {
  //                                     // console.log(error, "error");
  //                                     this.messageService.add({
  //                                         severity: 'error',
  //                                         summary: 'Error',
  //                                         detail: error.error.ERROR,
  //                                         icon: 'far fa-times-circle',
  //                                     });
  //
  //                                 }
  //                             );
  //                     }
  //                 });
  //
  //             },
  //             (error: any) => {
  //                 // console.log(error, "error");
  //                 this.messageService.add({
  //                     severity: 'error',
  //                     summary: 'Error',
  //                     detail: error.error.ERROR,
  //                     icon: 'far fa-times-circle',
  //                 });
  //
  //             }
  //         );
  //
  // }

  assignTicketSubmit(): void {
    this.staffsubmmitted = true;
    if (this.assignStaffTicketForm.valid) {
      const updateDetails: any = {};
      updateDetails.ticketId = this.assignticketId;
      updateDetails.status = this.assignTicketStatus;
      updateDetails.remark = this.assignStaffTicketForm.controls.remark.value;
      updateDetails.remarkType = "Change Assignee";
      updateDetails.teamId = this.assignStaffTicketForm.controls.teamId.value;
      updateDetails.assignee = this.assignStaffTicketForm.controls.staffId.value;
      const formData = new FormData();
      formData.append("caseUpdate", JSON.stringify(updateDetails));
      const url = "/case/updateDetails";
      this.taskManagementService.assignMethod(url, formData).subscribe(
        (response: any) => {
          if (response.responseCode === 406) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            if (!this.searchkey) {
              this.getTicket("");
            } else {
              this.searchTicket();
            }

            this.openTicketDetail(this.viewTicketData.caseId);
            // this.searchTicketFun();
            this.assignTicketModal = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.changeStausSubmitted = false;
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

  hideAssignTickt() {
    this.assignTicketModal = false;
  }

  approveTicket(data) {
    this.approveRejectRemark = "";
    this.ifApproveTicket = true;
    this.ticketApprRejectData = data;
    this.ticketApproveRejectModal = true;
  }

  rejectTicket(data) {
    this.approveRejectRemark = "";
    this.ifApproveTicket = false;
    this.ticketApprRejectData = data;
    this.ticketApproveRejectModal = true;
  }

  closeTicketApproveRejectModal() {
    this.ticketApproveRejectModal = false;
  }

  statusRejected() {
    this.approveId = this.ticketApprRejectData.caseId;
    this.reject = false;
    this.selectStaffReject = null;
    this.rejectCAF = [];
    const url =
      "/case/approveTicket?caseId=" +
      this.approveId +
      "&isApproveRequest=false&remarks=" +
      this.approveRejectRemark;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        // this.recepit = response.data;

        this.ticketApproveRejectModal = false;
        if (response.dataList) {
          this.reject = true;
          this.rejectCAF = response.dataList;
          this.rejectCustomerCAFModal = true;
        } else {
          if (!this.searchkey) {
            this.getTicket("");
          } else {
            this.searchTicket();
          }
          this.openTicketDetail(this.viewTicketData.caseId);
        }

        this.ifApproveTicket = false;
        this.ticketApprRejectData = [];
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

  closeRejectCustomerCAFModal() {
    this.rejectCustomerCAFModal = false;
  }

  assignToStaffTicket(flag) {
    let url: any;
    if (flag == true) {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${"CASE"}&nextAssignStaff=${this.selectStaff}&isApproveRequest=${flag}`;
    } else {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.approveId}&eventName=${"CASE"}&nextAssignStaff=${this.selectStaffReject}&isApproveRequest=${flag}`;
    }

    this.taskManagementService.getMethod(url).subscribe(
      response => {
        this.assignCustomerCAFModal = false;
        this.rejectCustomerCAFModal = false;
        if (!this.searchkey) {
          this.getTicket("");
        } else {
          this.searchTicket();
        }
        this.openTicketDetail(this.viewTicketData.caseId);
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

  statusApporeved() {
    this.approveId = this.ticketApprRejectData.caseId;
    this.approved = false;
    this.approveCAF = [];
    this.selectStaff = null;
    const url =
      "/case/approveTicket?caseId=" +
      this.approveId +
      "&isApproveRequest=true&remarks=" +
      this.approveRejectRemark;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == "200") {
          // this.recepit = response.data;
          this.ticketApproveRejectModal = false;
          if (response.dataList) {
            this.approved = true;
            this.approveCAF = response.dataList;
            this.assignCustomerCAFModal = true;
          } else {
            if (!this.searchkey) {
              this.getTicket("");
            } else {
              this.searchTicket();
            }
            this.openTicketDetail(this.viewTicketData.caseId);
          }
          this.ifApproveTicket = false;
          this.ticketApprRejectData = [];
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Information",
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

    let url = "/workflowaudit/list?entityId=" + this.viewTicketId + "&eventName=" + name;

    this.taskManagementService.postMethod(url, data).subscribe(
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
    this.getworkflowAuditDetails("", this.viewTicketId, "CASE");
  }

  getTicketPriority() {
    const url = "/commonList/ticket_priority";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.priorityTicketData = response.dataList;
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

  opechangePriorityMadel(data) {
    this.selectPriorityValue = "";
    this.selcetTicketData = data;
    this.idChangePriority = true;
  }
  SavechangePriority() {
    let ticketdata: any = {};
    ticketdata.ticketId = this.selcetTicketData.caseId;
    ticketdata.status = this.selcetTicketData.caseStatus;
    ticketdata.caseType = this.selcetTicketData.caseType;
    ticketdata.assignee = this.selcetTicketData.currentAssigneeId;
    ticketdata.priority = this.selectPriorityValue;
    ticketdata.attachment = "";
    ticketdata.filename = "";
    ticketdata.remarkType = "";
    ticketdata.groupReasonId = this.selcetTicketData.groupReasonId;
    ticketdata.caseCategoryId = this.selcetTicketData.caseCategoryId;
    // ticketdata.ticketReasonCategoryId = this.selcetTicketData.ticketReasonCategoryId;
    ticketdata.caseTitle = this.selcetTicketData.caseTitle;
    // ticketdata.caseStatus = this.selcetTicketData.caseStatus;
    // ticketdata.source = this.selcetTicketData.source;
    // ticketdata.subSource = this.selcetTicketData.subSource;
    // ticketdata.customerAdditionalMobileNumber =
    //     this.selcetTicketData.customerAdditionalMobileNumber;
    // ticketdata.customerAdditionalEmail = this.selcetTicketData.customerAdditionalEmail;
    ticketdata.helperName = this.selcetTicketData.helperName;
    ticketdata.nextFollowupDate = this.selcetTicketData.nextFollowupDate;
    ticketdata.nextFollowupTime = this.selcetTicketData.nextFollowupTime;
    // ticketdata.finalResolutionId = '';
    // ticketdata.remark = '';
    const formData = new FormData();
    formData.append("caseUpdate", JSON.stringify(ticketdata));
    const url = "/case/updateDetails";
    this.taskManagementService.assignMethod(url, formData).subscribe(
      (response: any) => {
        if (response.responseCode === 406) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.selectPriorityValue = "";
          this.idChangePriority = false;
          if (!this.searchkey) {
            this.getTicket("");
          } else {
            this.searchTicket();
          }

          this.openTicketDetail(this.viewTicketData.caseId);
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

  closeChangePriority() {
    this.idChangePriority = false;
  }

  assignToAllStaffTicket() {
    let remark = "assign to everyone from list.";
    const url = `/case/assignEveryStaffFromList?caseId=${this.approveId}&remark=${remark}&isApproveRequest=${this.approved}`;
    this.taskManagementService.getMethod(url).subscribe(
      () => {
        this.assignCustomerCAFModal = false;
        this.rejectCustomerCAFModal = false;
        if (!this.searchkey) {
          this.getTicket("");
        } else {
          this.searchTicket();
        }

        this.openTicketDetail(this.viewTicketData.caseId);
        // this.assignCustomerCAFModal = true;
        // this.rejectCustomerCAFModal = false;
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

  // getTicketSourceType() {
  //     const url = "/commonList/ticketSourceType";
  //     this.commondropdownService.getMethodWithCache(url).subscribe(
  //         (response: any) => {
  //             this.ticketSourceTypeData = response.dataList;

  //             this.searchkey = "";
  //         },
  //         (error: any) => {
  //             this.messageService.add({
  //                 severity: "error",
  //                 summary: "Error",
  //                 detail: error.error.ERROR,
  //                 icon: "far fa-times-circle"
  //             });
  //         }
  //     );
  // }

  closeTicketPickModal() {
    this.ticketPickModal = false;
  }
  pickModalOpen(data) {
    this.pickId = data.caseId;
    this.pickRemark = "";
    //console.log(data);
    if (data.ticketAssignStaffMappings.length > 0) {
      let show: boolean = false;
      data.ticketAssignStaffMappings.forEach(element => {
        if (element.staffId == this.currentLoginUserId) {
          show = true;
          this.ticketPickModal = true;
        }
      });
      if (!show) {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "You are not eligible to pick this ticket..",
          icon: "far fa-times-circle"
        });
      }
    } else {
      this.messageService.add({
        severity: "info",
        summary: "Info",
        detail: "You are not eligible to pick this ticket..",
        icon: "far fa-times-circle"
      });
    }
  }

  pickstaff() {
    const url = `/case/assignPickedTicket?caseId=${this.pickId}&remark=${this.pickRemark}&staffId=${this.currentLoginUserId}`;
    this.taskManagementService.getMethod(url).subscribe(
      () => {
        const currentTab = this.allTaskCounts[this.activeDashboardTabIndex];
        const status = currentTab ? currentTab.key : null;
        this.getAllTaskCounts();
        if (status) {
          this.getCasesByStatus(status, this.casestatusitemPerPage);
        }
        if (!this.searchkey) {
          this.getTicket("");
          this.getAssignToMeTicketDetails("");
          this.getAssignToTeamTicketDetails("");
          this.getUnpickTicketDetails("");
        } else {
          this.searchTicket();
        }
        this.ticketPickModal = false;
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "Ticket picked successfully",
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR || "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  // getDepartmentType() {
  //     const url = "/commonList/departmentType";
  //     this.commondropdownService.getMethodWithCache(url).subscribe(
  //         (response: any) => {
  //             this.departmentTypeData = response.dataList;

  //             this.searchkey = "";
  //         },
  //         (error: any) => {
  //             this.messageService.add({
  //                 severity: "error",
  //                 summary: "Error",
  //                 detail: error.error.ERROR,
  //                 icon: "far fa-times-circle"
  //             });
  //         }
  //     );
  // }

  openLinkTicketDialog(ticket) {
    this.showLinktickets = true;
    this.getLinkableTickets(ticket);
  }

  getLinkableTickets(ticket) {
    this.ticketIdToLink = ticket.caseId;

    let data: any = [];
    // if (!this.searchkey || this.searchkey !== this.searchTicketDetail) {
    //   this.currentPageTicketConfig = 1;
    // }
    this.searchkey = this.searchTicketDetail;
    if (this.linkTicketItemsPerPage) {
      this.pageITEM = this.linkTicketItemsPerPage;
    }
    if (ticket.customersId) {
      let data2 = {
        filterValue: ticket.customersId,
        filterColumn: "customerId"
      };
      data.push(data2);
    }
    // // if (ticket.ticketReasonCategoryId) {
    //     let data2 = {
    //         filterValue: ticket.ticketReasonCategoryId,
    //         filterColumn: "ticketReasonCategoryId"
    //     };
    //     data.push(data2);
    // }
    let data3 = {
      filterValue: this.ticketIdToLink,
      filterColumn: "ticketIdToLink"
    };
    data.push(data3);
    this.searchData = {
      filters: data,
      page: this.currentPageTicketConfig,
      pageSize: this.pageITEM,
      sortBy: "createdate",
      sortOrder: 0
    };
    // this.showLinktickets = true;
    const url = "/case/case/search";
    this.ticketManagementService.postMethod(url, this.searchData).subscribe(
      (response: any) => {
        if (response.responseCode == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
          this.ticketData = [];
        } else {
          this.showLinktickets = true;
          let filteredCases = response.dataList.filter(
            caseItem => caseItem.caseStatus !== "Closed"
          );
          this.ticketDataForLink = filteredCases;
          this.ticketConfigtotalRecords = this.ticketDataForLink.length;
          this.linkedTicketId = null;
          this.selectLinkTicket = true;
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

  modalCloseTicket() {
    this.selectLinkTicket = false;
    this.chakedTktData = [];
  }
  data: any = [];
  linkTicket() {
    this.data = this.chakedTktData;
    //console.log("Link Ticket", this.data);
    const url = `/case/linkBulkTicket?taskId=${this.viewTicketData.caseId}`;
    this.taskManagementService.postMethod(url, this.data).subscribe(
      () => {
        // this.showLinktickets = false;
        // this.linkedTicketId = null;
        this.chakedTktData = [];
        this.openTicketDetail(this.viewTicketData.caseId);
        this.selectLinkTicket = false;
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: "Linked this ticket successfully..",
          icon: "far fa-times-circle"
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

  getLinkTicket() {
    const url = `/externalTicketLink/allExternalLinkedTickets?taskId=${this.viewTicketData.caseId}`;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response && response.dataList) {
          this.linkTicketData = response.dataList;
        } else {
          this.linkTicketData = [];
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

  showSavedCustomerDetails(customerId) {
    if (customerId) {
      const url = "/customers/" + customerId;
      this.customerService.getMethod(url).subscribe(
        (response: any) => {
          if (response.status == 200) {
            this.customerDetailData = response.customers;
            this.savedCustomerDetails = {
              id: Number(this.customerDetailData.id),
              username: this.customerDetailData.username,
              name: this.customerDetailData.custname,
              mobile: this.customerDetailData.mobile,
              customerAddress:
                this.customerDetailData.addressList.length > 0
                  ? this.customerDetailData.addressList[0].fullAddress
                  : "N/A",
              selectedCustAddressType:
                this.customerDetailData.addressList.length > 0
                  ? this.customerDetailData.addressList[0].addressType
                  : "N/A",
              planName:
                this.customerDetailData.planMappingList.length > 0
                  ? this.customerDetailData.planMappingList[0].planName
                  : "N/A"
            };
            this.displaySavedCustomerDialog = true;
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
    }
  }

  closeCustomerDetailsModel() {
    this.displaySavedCustomerDialog = false;
  }

  // onFileChange(event) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files;
  //     this.ticketGroupForm.patchValue({
  //       file: file,
  //     });
  //     // this.custmerDoc.filename = "";
  //   }
  // }

  // onFileChangeUpload(event) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files;
  //     this.uploadDocForm.patchValue({
  //       file: file,
  //     });
  //     // this.custmerDoc.filename = "";
  //   }
  // }

  onFileChange(event: any) {
    this.selectedFilePreview = [];
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.selectedFilePreview.push(files.item(i));
      }
      if (
        this.selectedFile.type != "image/png" &&
        this.selectedFile.type != "image/jpg" &&
        this.selectedFile.type != "image/jpeg" &&
        this.selectedFile.type != "application/pdf"
      ) {
        this.ticketGroupForm.controls.file.reset();
        alert("File type must be png, jpg, jpeg or pdf");
      } else {
        const file = event.target.files;
        this.ticketGroupForm.patchValue({
          file: file
        });
      }
    }
  }

  deletSelectedFile(event: any) {
    var temp: File[] = this.selectedFilePreview?.filter((item: File) => item?.name != event);
    this.selectedFilePreview = temp;
    this.ticketGroupForm.patchValue({
      file: temp
    });
  }

  onFileChangeUpload(event: any) {
    this.selectedFileUploadPreview = [];
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      const files: FileList = event.target.files;
      for (let i = 0; i < files.length; i++) {
        this.selectedFileUploadPreview.push(files.item(i));
      }
      if (
        this.selectedFile.type != "image/png" &&
        this.selectedFile.type != "image/jpg" &&
        this.selectedFile.type != "image/jpeg" &&
        this.selectedFile.type != "application/pdf"
      ) {
        this.uploadDocForm.controls.file.reset();
        alert("File type must be png, jpg, jpeg or pdf");
      } else {
        const file = event.target.files;
        this.uploadDocForm.patchValue({
          file: file
        });
      }
    }
  }

  deletUploadedFile(event: any) {
    var temp: File[] = this.selectedFileUploadPreview?.filter((item: File) => item?.name != event);
    this.selectedFileUploadPreview = temp;
    this.uploadDocForm.patchValue({
      file: temp
    });
  }

  uploadDocument(ticket) {
    this.uploadDataTicketId = ticket.caseId;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
    this.uploadDocumentId = true;
  }

  closeUploadDocumentId() {
    this.uploadDocumentId = false;
    this.uploadDocForm.patchValue({
      file: ""
    });
    this.selectedFileUploadPreview = [];
  }

  uploadDocuments() {
    this.submitted = true;
    if (this.uploadDocForm.valid) {
      const formData = new FormData();
      let fileArray: FileList;
      if (this.uploadDocForm.controls.file) {
        if (
          this.selectedFile.type != "image/png" &&
          this.selectedFile.type != "image/jpg" &&
          this.selectedFile.type != "image/jpeg" &&
          this.selectedFile.type != "application/pdf"
        ) {
          this.ticketGroupForm.controls.file.reset();
          alert("File type must be png, jpg, jpeg or pdf");
        } else {
          fileArray = this.uploadDocForm.controls.file.value;
          Array.from(fileArray).forEach(file => {
            formData.append("file", file);
          });
        }
      }
      const url = `/case/updateDocumentDetails?caseId=${this.uploadDataTicketId}`;
      this.taskManagementService.postMethod(url, formData).subscribe(
        (response: any) => {
          if (response.responseCode === 406) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else if (response.responseCode === 417) {
            this.messageService.add({
              severity: "error",
              summary: "Error",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.openTicketDetail(this.uploadDataTicketId);
            this.submitted = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.uploadDocumentId = false;
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

  downloadDoc(filename, docId, ticketId) {
    const url = `/case/document/download/${ticketId}/${docId}`;
    this.taskManagementService.downloadFile(url).subscribe(blob => {
      importedSaveAs(blob, filename);
    });
  }

  changeStatusSelection(status) {
    this.isCall = false;
    if (this.changeStatusSingleMultiple == "pTicket") {
      let oldStatus = this.chnageStatusForm.controls.oldStatus.value;
      if (oldStatus != "Resolved") {
        if (status == "Closed") {
          this.chnageStatusForm.controls.newStatus.setValue("");

          this.messageService.add({
            severity: "info",
            summary: "Information",
            detail: "Ticket can be marked closed only after the resolved status.",
            icon: "far fa-times-circle"
          });
        }
      }
    } else {
    }
  }

  chakedTicketData = [];
  isTicketChecked: boolean = false;
  allIsChecked: boolean = false;
  isSingleTicketChecked = false;

  allSelectTicket(event) {
    if (event.checked == true) {
      this.chakedTicketData = [];
      let checkedData = this.ticketData;
      for (let i = 0; i < checkedData.length; i++) {
        this.chakedTicketData.push({
          caseId: this.ticketData[i].caseId
        });
      }
      this.chakedTicketData.forEach(value => {
        checkedData.forEach(element => {
          if (element.caseId == value.caseId) {
            element.isSingleTicketChecked = true;
          }
        });
      });

      this.isTicketChecked = true;
      this.isTicketCheckedAssigntome = true;
      // console.log(this.chakedTicketData);
    }
    if (event.checked == false) {
      let checkedData = this.ticketData;
      this.chakedTicketData.forEach(value => {
        checkedData.forEach(element => {
          if (element.caseId == value.caseId) {
            element.isSingleTicketChecked = false;
          }
        });
      });
      this.chakedTicketData = [];
      // console.log(this.chakedTicketData);
      this.isTicketChecked = false;
      this.isTicketCheckedAssigntome = false;
      this.allIsChecked = false;
    }
  }

  addTicketChecked(id, event) {
    if (event.checked) {
      this.ticketData.forEach(value => {
        if (value.caseId == id) {
          this.chakedTicketData.push({
            caseId: value.caseId,
            caseStatus: value.caseStatus
          });
        }
      });

      if (this.ticketData.length === this.chakedTicketData.length) {
        this.isTicketCheckedAssigntome = true;
        this.isTicketChecked = true;
        this.allIsChecked = true;
      }
    } else {
      let checkedData = this.ticketData;
      checkedData.forEach(element => {
        if (element.caseId == id) {
          element.isSingleTicketChecked = false;
        }
      });
      this.chakedTicketData.forEach((value, index) => {
        if (value.caseId == id) {
          this.chakedTicketData.splice(index, 1);
        }
      });

      if (
        this.chakedTicketData.length == 0 ||
        this.chakedTicketData.length !== this.ticketData.length
      ) {
        this.isTicketChecked = false;
        this.isTicketCheckedAssigntome = false;
      }
    }
  }

  changeStatusDataObj: any = [];
  changeCaseStatus = "";
  changeCaseRemark = "";

  confirmChangeStatus() {
    this.changeCaseStatus = "";
    this.changeCaseRemark = "";
    this.chnageStatusForm.reset();
    this.confirmationService.confirm({
      message: "Do you want to Change Status?",
      header: "Change Status",
      icon: "pi pi-info-circle",
      accept: () => {
        this.changeStatusModal = true;
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

  changeSelectStatus() {
    let data = [];

    this.chakedTicketData.forEach(element => {
      data.push({
        ticketId: element.caseId,
        status: this.chnageStatusForm.value.newStatus,
        remark: this.chnageStatusForm.value.remark,
        remarkType: "Change status",
        finalResolutionId: this.chnageStatusForm.value.finalResolutionId,
        // rootCauseReasonId: this.chnageStatusForm.value.rootCauseReasonId,
        helperName: this.chnageStatusForm.value.helperName?.toString(),
        nextFollowupDate: this.chnageStatusForm.value.nextFollowupDate,
        nextFollowupTime: this.formatTime(this.chnageStatusForm.value.nextFollowupTime),
        call_status: this.chnageStatusForm.value.call_status,
        is_closed: this.chnageStatusForm.value.is_closed,
        deacivate_reason: this.chnageStatusForm.value.deacivate_reason,
        caseFeedbackRel: [this.caseFeedbackRel]
      });
    });
    // const url = `/case/bulkUpdateDetails?Status=${this.changeCaseStatus}&remark=${this.changeCaseRemark}`;
    const url = `/case/bulkUpdateDetails`;
    this.taskManagementService.updateMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });

          this.changeStatusModal = false;
        }
        this.changeStatusModal = false;
        this.changeStatusDataObj = [];
        this.changeCaseStatus = "";
        this.changeCaseRemark = "";
        if (!this.searchkey) {
          this.getTicket("");
          this.getAssignToMeTicketDetails("");
        } else {
          this.searchTicket();
        }
        this.searchTicketFun();
        this.changeStausSubmitted = false;
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

  tiketTimer() {
    this.ticketRemainTimeSubscription = this.obs$.subscribe(() => {
      this.ticketData.forEach(element => {
        if (element.caseStatus != "Raise and Close") {
          if (
            element.currentAssigneeId == null ||
            (element.currentAssigneeId !== null &&
              element.caseStatus != "Closed" &&
              element.caseStatus != "rejected" &&
              element.caseStatus != "Raise and Close" &&
              element.caseStatus != "Pending")
          ) {
            const newYearsDate: any = new Date(
              element.nextFollowupDate + " " + element.nextFollowupTime
            );
            const currentDate: any = new Date();
            if (newYearsDate > currentDate) {
              const totalSeconds = (newYearsDate - currentDate) / 1000;
              const minutes = Math.floor(totalSeconds / 60) % 60;
              const hours = Math.floor(totalSeconds / 3600) % 24;
              const days = Math.floor(totalSeconds / 3600 / 24);
              const seconds = Math.floor(totalSeconds) % 60;
              const remainTime =
                ("0" + days).slice(-2) +
                ":" +
                ("0" + hours).slice(-2) +
                ":" +
                ("0" + minutes).slice(-2) +
                ":" +
                ("0" + seconds).slice(-2);

              element.remainTime = remainTime;
            } else {
              element.remainTime = "00:00:00:00";
            }
          }
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.ticketRemainTimeSubscription) {
      this.ticketRemainTimeSubscription.unsubscribe();
    }
  }

  canExit() {
    if (!this.ticketGroupForm.dirty) {
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

  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;
  selectedParentCust: any = [];
  selectedParentCustId: any;
  parentCustList: any;
  newFirst = 0;
  searchParentCustOption = "";
  searchParentCustValue = "";
  parentFieldEnable = false;
  customerList = [];
  searchOptionSelect = [];
  searchDeatil = "";

  // customer dropdown

  getParentCustomerData() {
    let currentPage;
    currentPage = this.currentPageParentCustomerListdata;
    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    const url = "/getActivecustomers/list?mvnoId =" + localStorage.getItem("mvnoId");
    this.customerService.postMethod(url, data).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
        this.newFirst = 1;
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

  async modalOpenParentCustomer() {
    this.displaySelectCustomer = true;
    await this.getParentCustomerData();
    this.newFirst = 1;
    this.selectedParentCust = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  modalCloseParentCustomer() {
    this.displaySelectCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 1;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.customerList = [];

    // console.log("this.newFirst1", this.newFirst)
  }

  async saveSelCustomer(isOpenModal) {
    this.parentCustList = [
      {
        id: Number(this.selectedParentCust.id)
        // name: this.selectedParentCust.username
        // mobile: this.selectedParentCust.mobile,
        // email: this.selectedParentCust.email
      }
    ];
    this.ticketGroupForm.patchValue({
      customersId: Number(this.selectedParentCust?.id)
      // mobile: this.selectedParentCust.mobile,
      // email: this.selectedParentCust.email
    });

    let custdata = {
      value: this.selectedParentCust?.id
    };
    this.selCustomer(custdata);
    if (isOpenModal) this.modalCloseParentCustomer();
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

  clearSearchParentCustomer() {
    this.currentPageParentCustomerListdata = 1;
    this.getParentCustomerData();
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
  }

  searchParentCustomer() {
    // this.currentPageParentCustomerListdata = 1;
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

    const url = "/customers/search/Both?mvnoId=" + localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.customerService.postMethod(url, searchParentData).subscribe(
      (response: any) => {
        this.customerList = response.customerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
      },
      (error: any) => {
        this.parentCustomerListdatatotalRecords = 0;
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

  selParentSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.parentFieldEnable = true;
    } else {
      this.parentFieldEnable = false;
    }
  }

  // ......................

  // ETR

  selETRmessageMode(event) {
    let mode = event.value;
    if (mode == false) {
      this.ticketETRForm.get("remark").clearValidators();
      this.ticketETRForm.get("remark").updateValueAndValidity();
      this.ticketETRForm.patchValue({
        remark: ""
      });
    } else {
      this.ticketETRForm.get("remark").setValidators(Validators.required);
      this.ticketETRForm.get("remark").updateValueAndValidity();
    }
  }

  openETRModal(data) {
    this.ticketETRForm.reset();
    this.ticketETRData = data;
    this.ticketETRModal = true;
  }

  closeETRModel() {
    this.submittedETR = false;
    this.ticketETRForm.reset();
  }

  closeeETRModel() {
    this.ticketETRModal = false;
  }

  ETRSaveData() {
    let customerBill = "";
    let custEmail = "";
    this.submittedETR = true;
    if (this.ticketETRForm.valid) {
      // const url = "/customers/" + this.ticketETRData.customersId;
      // this.customerService.getMethod(url).subscribe((response: any) => {
      //     if (response.customers.planMappingList.length > 0) {
      //         customerBill = response.customers.planMappingList[0].billTo;
      //         // custEmail = response.customers.email;
      //     }

      this.ticketETRForm.value.notificationTime = this.formatTime(
        this.ticketETRForm.value.notificationTime
      );

      let data = {
        taskOwnerStaffId: this.ticketETRData.createdById,
        // customerEmailId: custEmail,
        // customerMobileNo: this.ticketETRData.mobile,
        mvnoId: this.ticketETRData.mvnoId,
        notificationDate: this.ticketETRForm.value.notificationDate
          ? this.ticketETRForm.value.notificationDate
          : "",
        notificationTime: this.ticketETRForm.value.notificationTime
          ? this.ticketETRForm.value.notificationTime
          : "",
        remark: this.ticketETRForm.value.remark ? this.ticketETRForm.value.remark : " ",
        selectedNotificationType: {
          sms: this.ticketETRForm.value.sms ? this.ticketETRForm.value.sms : false,
          email: this.ticketETRForm.value.email ? this.ticketETRForm.value.email : false
        },
        staffId: this.ticketETRData.currentAssigneeId,
        templateContent: "",
        ticketId: this.ticketETRData.caseId,
        ticketNumber: this.ticketETRData.caseNumber,
        isTemplateDynamic: this.ticketETRForm.value.isTemplateDynamic,
        status: this.ticketETRData.caseStatus,
        sender: "Organization" //customerBill,
      };

      const url = "/case/sendETRtoCustomer";
      this.taskManagementService.postMethod(url, data).subscribe(
        (response: any) => {
          this.closeETRModel();
          this.ticketETRModal = false;
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
        },
        (error: any) => {
          this.parentCustomerListdatatotalRecords = 0;
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
      // });
    }
  }

  openTeamDetailModel(data) {
    // this.ticketETRForm.reset();
    this.ticketETRData = data;
    let staffId;
    if (data.actionByStaffId != null) {
      staffId = data.actionByStaffId;
    } else if (data.staffId != null) {
      staffId = data.staffId;
    }
    this.ticketStaffTeamdetails = true;
    const url = `/ticketFollowupDetails/getAllTeamNameByStaffId/${staffId}`;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        //
        this.customerETRDetailData = response;
        this.detailView = true;
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

  closeTicketStaffTeamdetails() {
    this.ticketStaffTeamdetails = false;
  }

  ticketETRListShow(caseId) {
    let data = {};
    const url = "/case/getTicketETRReport/" + caseId;
    this.taskManagementService.postMethod(url, data).subscribe((response: any) => {
      this.ticketETRDetailData = response.dataList;
    });
  }

  getTicketTatListShow(caseId) {
    const url = "/case/getTatAuditDetails?caseId=" + caseId;
    this.taskManagementService.getMethod(url).subscribe((response: any) => {
      this.ticketTATDetailData = response.dataList;
    });
  }

  ticketETRXMLDownload() {
    if (this.ticketETRDetailData.length > 0) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.ticketETRDetailData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, this.fileNameCDR);
    }
  }

  showTATDetails(data) {
    this.displayTATDetails = true;
    this.ticketReasonSubCategoryData.forEach(element => {
      if (element.id == data) {
        this.TATDetails = element.ticketSubCategoryTatMappingList;
      }
    });
  }

  closeDisplayTATDetails() {
    this.displayTATDetails = false;
  }

  getAllTicketReasonCategory(serviceLists: any) {
    serviceLists = this.ticketServiceList;
    if (serviceLists != null) {
      const url = "/ticketReasonCategory/getReasonCategoryByActiveServices";
      this.taskManagementService.postMethod(url, serviceLists).subscribe(
        (response: any) => {
          this.ticketReasonCategoryData = response.dataList;
          // this.filteredReasonCategoryList = this.ticketReasonCategoryData;
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

  // getTicketReasonCategory(serviceLists: any) {
  //     serviceLists = this.ticketGroupForm.controls.ticketServicemappingList.value;
  //     if (serviceLists != null) {
  //         const url = "/ticketReasonCategory/getReasonCategoryByActiveServices";
  //         this.taskManagementService.postMethod(url, serviceLists).subscribe(
  //             (response: any) => {
  //                 this.ticketReasonCategoryData = response.dataList;
  //                 this.filteredReasonCategoryList = this.ticketReasonCategoryData;
  //             },
  //             (error: any) => {
  //                 this.messageService.add({
  //                     severity: "error",
  //                     summary: "Error",
  //                     detail: error.error.ERROR,
  //                     icon: "far fa-times-circle"
  //                 });
  //             }
  //         );
  //     }
  // }

  showticketDocData(data: any) {
    const url = `/case/document/download/${data.ticketId}/${data.docId}`;
    const fileType = data?.filename.split(".");
    this.taskManagementService.downloadFile(url).subscribe(data => {
      let type = "application/octet-stream"; // default type
      const uint = new Uint8Array(data);
      const magic = uint.subarray(0, 4);
      if (magic.every(b => b === 0xff)) {
        type = "image/jpeg";
      } else if (magic[0] === 0x89 && magic[1] === 0x50 && magic[2] === 0x4e && magic[3] === 0x47) {
        type = "image/png";
      } else if (magic[0] === 0x47 && magic[1] === 0x49 && magic[2] === 0x46 && magic[3] === 0x38) {
        type = "image/gif";
      } else if (magic[0] === 0xd0 && magic[1] === 0xcf && magic[2] === 0x11 && magic[3] === 0xe0) {
        type = "application/vnd.ms-excel";
      } else if (magic[0] === 0x25 && magic[1] === 0x50 && magic[2] === 0x44 && magic[3] === 0x46) {
        type = "application/pdf";
      } else if (magic[0] === 0xd0 && magic[1] === 0xcf && magic[2] === 0x11 && magic[3] === 0xe0) {
        type = "application/msword";
      }

      if (fileType[fileType?.length - 1] == "pdf") {
        const blob = new Blob([data], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
      } else {
        const blob = new Blob([data], { type });
        const blobUrl = URL.createObjectURL(blob);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.documentPreview = true;
      }
    });
  }

  closeDocumentPreview() {
    this.documentPreview = false;
  }

  saveCafFollowup() {
    this.ifCafFollowupSubmited = true;
    if (this.followupScheduleForm.valid) {
      const url = "/ticketFollowUp/save";
      this.followupData = this.followupScheduleForm.value;
      this.followupData.caseId = this.folloupTicketId;
      this.followupData.staffUserId = this.staffid;
      this.followupData.mvnoId = this.mvnoid;
      this.followupData.isSend = false;
      this.followupData.status = "Pending";
      const myFormattedDate = this.datepipe.transform(
        this.followupData.followUpDatetime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.followupData.followUpDatetime = myFormattedDate;
      this.taskManagementService.postMethod(url, this.followupData).subscribe(
        (response: any) => {
          this.ifCafFollowupSubmited = false;
          this.followupScheduleForm.reset();
          this.openTicketDetail(this.viewTicketData.caseId);
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          this.followupPopupOpen = false;
          this.scheduleFollowup = false;
          // this.getCafFollowupList('');
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
    this.scheduleFollowup = false;
    this.followupPopupOpen = false;
  }

  // rescheduleFollowUp(followUpDetails) {
  //     this.followUpId = followUpDetails.id;
  //     this.followUpCaseNumber = followUpDetails.caseNumber;
  //     this.generatedNameOfTheReFollowUp(followUpDetails.caseId);
  //     this.reFollowupFormsubmitted = false;
  //     this.reScheduleFollowup = true;
  // }

  saveReFollowup() {
    this.followupData = {};
    this.reFollowupFormsubmitted = true;
    if (this.reFollowupScheduleForm.valid) {
      this.followupData = this.reFollowupScheduleForm.value;
      this.followupData.caseId = this.viewTicketId;
      this.followupData.caseNumber = this.followUpCaseNumber;
      this.followupData.staffUserId = this.staffid;
      this.followupData.mvnoId = this.mvnoid;
      this.followupData.isSend = false;
      this.followupData.status = "Pending";
      const myFormattedDate = this.datepipe.transform(
        this.followupData.followUpDatetime,
        "yyyy-MM-dd HH:mm:ss"
      );
      this.followupData.followUpDatetime = myFormattedDate;
      const url =
        "/ticketFollowUp/reScheduleTicketfollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.followupData.remarksTemp;
      this.taskManagementService.postMethod(url, this.followupData).subscribe(
        (response: any) => {
          this.reFollowupFormsubmitted = false;
          this.reFollowupScheduleForm.reset();
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          // this.reScheduleFollowup = false;
          this.reFollowupFormsubmitted = false;
          // this.getCafFollowupList("");
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
    // this.reScheduleFollowup = false;
    this.reFollowupScheduleForm.reset();
  }

  rescheduleFollowupRemarks = [
    "Confirm Later",
    "Do Not Call",
    "Expensive Package",
    "Call rejected by Client"
  ];
  // cafFollowupList: any = [];
  cafFollowupDatalength = 0;
  // cafFollowupPage = 1;
  // cafFollowupItemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  // followupListTotalRecordsForUserAndTeam: any;
  followupListForUserAndTeam: any;

  // getCafFollowupList(list) {
  // let size;
  // let page = this.cafFollowupPage;
  // if (list) {
  //     size = list;
  //     this.cafFollowupItemsPerPage = list;
  // } else {
  //     size = this.cafFollowupItemsPerPage;
  // }

  // const url =
  //     "/ticketFollowUp/findAll?caseId=" + this.viewTicketId + "&page=" + page + "&pageSize=" + size;

  // this.taskManagementService.getMethod(url).subscribe(
  //     async (response: any) => {
  //         console.log("My Caf FollowUp List Response => ", response?.dataList);

  // this.cafFollowupList = await response?.dataList;

  // this.followupListTotalRecordsForUserAndTeam = await response?.totalRecords;

  // if (this.showItemPerPage > this.cafFollowupItemsPerPage) {
  // this.cafFollowupDatalength = this.cafFollowupList?.length % this.showItemPerPage;
  // } else {
  // this.cafFollowupDatalength = this.cafFollowupList?.length % this.cafFollowupItemsPerPage;
  // }
  //     },
  //     (error: any) => {
  //         this.messageService.add({
  //             severity: "error",
  //             summary: "Error",
  //             detail: error.error.ERROR,
  //             icon: "far fa-times-circle"
  //         });
  //     }
  // );
  // }

  // pageChangedCafFollowup(pageNumber): void {
  //     this.cafFollowupPage = pageNumber;
  //     this.getCafFollowupList("");
  // }

  // totalCafFollowupItems(event): void {
  //     this.showItemPerPage = Number(event.value);
  //     if (this.cafFollowupPage > 1) {
  //         this.cafFollowupPage = 1;
  //     }
  //     this.getCafFollowupList(this.showItemPerPage);
  // }

  generateNameOfFollowUp: any;

  generatedNameOfTheFollowUp(ticketId) {
    const url = "/ticketFollowUp/generateNameOfTheTicketFollowUp/" + ticketId;

    this.taskManagementService.getMethod(url).subscribe(
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

  generateNameOfReFollowUp: any;

  generatedNameOfTheReFollowUp(customersId) {
    const url = "/ticketFollowUp/generateNameOfTheTicketFollowUp/" + customersId;

    this.taskManagementService.getMethod(url).subscribe(
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

  // checkFollowUpDatetimeOutDate(obj) {
  //     if (obj != null && obj != undefined) {
  //         if (obj.status && obj.status === "Pending") {
  //             if (obj.followUpDatetime && new Date(obj.followUpDatetime) < new Date()) {
  //                 return true;
  //             }
  //         }
  //     } else {
  //         return false;
  //     }
  // }

  followUpId: any;

  // closeFollowUp(followUpDetails) {
  //     this.closeFollowupFormsubmitted = false;
  //     this.followUpId = followUpDetails.id;
  //     this.closeFollowup = true;
  // }

  closeActionFolloupPopup() {
    // this.closeFollowup = false;
  }

  saveCloseFollowUp() {
    this.closeFollowupFormsubmitted = true;
    if (this.closeFollowupForm.valid) {
      const url =
        "/ticketFollowUp/closefollowup?followUpId=" +
        this.followUpId +
        "&remarks=" +
        this.closeFollowupForm.get("remarks").value;
      this.taskManagementService.getMethod(url).subscribe(
        async (response: any) => {
          // this.closeFollowup = false;
          this.closeFollowupForm.reset();

          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.message,
            icon: "far fa-check-circle"
          });
          await this.openTicketDetail(this.viewTicketData.caseId);
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

  followUpDetailsObj: any;

  // remarkFollowUp(followUpDetails) {
  //     this.followUpDetailsObj = followUpDetails;
  //     this.remarkFollowupFormsubmitted = false;
  //     this.followUpId = followUpDetails.id;
  //     this.getfollowUpRemarkList(this.followUpId);
  //     this.remarkScheduleFollowup = true;
  // }

  closeRemarkPopup() {
    this.remarkFollowupForm.reset();
    this.remarkFollowupFormsubmitted = false;
    this.remarkScheduleFollowup = false;
    this.tatDetailsShow = false;
    this.tatDetailsMessageShow = false;
  }

  saveRemarkFollowUp() {
    this.remarkFollowupFormsubmitted = true;
    this.remarkFollowupForm.get("cafFollowUpId").setValue(this.followUpId);
    if (this.remarkFollowupForm.valid) {
      var data = this.remarkFollowupForm.value;
      data.ticketFollowUpId = this.followUpId;
      data.mvnoId = this.mvnoid;

      const url = "/ticketFollowUp/ticketFollowUp/remark";
      this.taskManagementService.postMethod(url, data).subscribe(
        async (response: any) => {
          this.remarkScheduleFollowup = false;
          this.remarkFollowupForm.reset();
          // await this.getCafFollowupList('');
          await this.openTicketDetail(this.viewTicketData.caseId);

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

    const url = "/ticketFollowUp/findAll/ticketFollowUpRemark/" + id;
    this.taskManagementService.getMethod(url).subscribe(
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

  // makeACall() {
  //     this.messageService.add({
  //         severity: "info",
  //         summary: "Call configure",
  //         detail: "Sorry! Please configure call client first..",
  //         icon: ""
  //     });
  // }

  scheduleFollowupPopupOpen() {
    this.followupPopupOpen = true;
    this.generatedNameOfTheFollowUp(this.folloupTicketId);
    this.scheduleFollowup = true;
  }

  openRawDataModal(finalData: any) {
    this.viewTrcData = finalData.ticketTatMatrix;
    // this.getRawData(finalData, "");
    this.tatDetailsShow = true;
  }

  openTATMessageDataModal(Data: any) {
    this.viewTATMessage = Data.tatMessage;
    // this.getRawData(finalData, "");
    this.tatDetailsMessageShow = true;
  }

  pageChangedViewTAT(pageNumber) {
    this.currentPageViewTATListdata = pageNumber;
  }

  caseInfo: any = [];

  showTATDetailsData() {
    let url = "/case/getTatDetials?caseId=" + this.viewTicketId;
    this.taskManagementService.getMethod(url).subscribe((response: any) => {
      this.caseInfo = response.data;
      //console.log("caseInfo", this.caseInfo);
    });
  }

  TATcaseData: any = [];

  openTATModel() {
    this.TATcaseData = this.caseInfo;
    this.tatDetailsShowModel = true;
  }

  closeTATModel() {
    this.tatDetailsShowModel = false;
  }

  openHelperModel() {
    this.helperDetailsShowModel = true;
  }

  closeHelperModel() {
    this.helperDetailsShowModel = false;
  }

  // getStaffbyServiceArea() {
  //     let url = "/case/getAllStaffUserByServiceArea/" + this.serviceAreaId;
  //     this.taskManagementService.getMethod(url).subscribe((response: any) => {
  //         this.staffList = response.dataList;
  //         //console.log("caseInfo",  this.staffList)
  //     });
  // }

  SLAData: any = [];
  caseCounterInfo: any = [];

  SlaCounterModelOpen(ticketdata) {
    //this.getCustomersDetail(ticketdata.caseId);
    // this.getTicketById(ticketdata.caseId);
    // let url = "/case/getTatDetials?caseId=" + ticketdata.caseId;
    // this.taskManagementService.getMethod(url).subscribe((response: any) => {
    //   console.log("response ", response);
    //
    //   this.caseCounterInfo = response.data;
    // this.SLAData = this.caseCounterInfo;
    this.SLATimer(ticketdata);
    this.counterDetailModel = true;
    // });
  }

  finaltotalSeconds: any;
  slaTime: any;
  newDate: any;
  slaInSeconds: any;
  SLATimer(ticketdata) {
    this.SLAData = ticketdata.caseSlaTime;
    this.slaTime = moment(ticketdata.createdate, "DD-MM-YYYY hh:mm A").toDate();
    this.newDate = new Date();

    if (ticketdata.caseSlaUnit === "Min") {
      this.slaTime.setMinutes(this.slaTime.getMinutes() + this.SLAData);
    } else if (ticketdata.caseSlaUnit === "Hour") {
      this.slaTime.setHours(this.slaTime.getHours() + this.SLAData);
    } else if (ticketdata.caseSlaUnit === "Day") {
      this.slaTime.setDate(this.slaTime.getDate() + this.SLAData);
    }

    // else if (this.ticketDeatailData.priority == "High") {
    //   if (this.SLAData.sunitp1 == "Min") {
    //     this.slaTime.setMinutes(this.slaTime.getMinutes() + this.SLAData.slaTimep1);
    //   } else if (this.SLAData.sunitp1 == "Hour") {
    //     this.slaTime.setHours(this.slaTime.getHours() + this.SLAData.slaTimep1);
    //   } else if (this.SLAData.sunitp1 == "Day") {
    //     this.slaTime.setDate(this.slaTime.getDay() + this.SLAData.slaTimep1);
    //   }
    // } else {
    //   if (this.SLAData.sunitp2 == "Min") {
    //     this.slaTime.setMinutes(this.slaTime.getMinutes() + this.SLAData.slaTimep2);
    //   } else if (this.SLAData.sunitp2 == "Hour") {
    //     this.slaTime.setHours(this.slaTime.getHours() + this.SLAData.slaTimep2);
    //   } else if (this.SLAData.sunitp2 == "Day") {
    //     this.slaTime.setDate(this.slaTime.getDay() + this.SLAData.slaTimep2);
    //   }
    // }
    this.slaInSeconds = Math.floor((this.slaTime - this.newDate) / 1000);
    this.timerStamp(this.slaInSeconds);
    this.ticketRemainTimeSubscription = timer(0, 1000).subscribe(() => {
      this.getTimeDiffrence(this.slaInSeconds);
    });
  }

  timerStamp(totalSeconds) {
    if (this.newDate < this.slaTime) {
      // const totalSeconds = (this.slaTime - this.newDate) / 1000;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / 3600) % 24;
      const days = Math.floor(totalSeconds / 3600 / 24);
      const seconds = Math.floor(totalSeconds) % 60;
      this.SLAremainTime =
        ("0" + days).slice(-2) +
        ":" +
        ("0" + hours).slice(-2) +
        ":" +
        ("0" + minutes).slice(-2) +
        ":" +
        ("0" + seconds).slice(-2);
    } else {
      this.SLAremainTime = "00:00:00:00";
    }
  }

  getTimeDiffrence(totalSeconds) {
    // if (totalSeconds > 0) {
    //   this.slaInSeconds = totalSeconds - 1;
    //   this.timerStamp(this.slaInSeconds);
    // } else {
    //   this.slaInSeconds = 0;
    //   this.timerStamp(this.slaInSeconds);
    // }
    const newSlaInSeconds = Math.floor((this.slaTime - Date.now()) / 1000);

    if (newSlaInSeconds > 0) {
      this.slaInSeconds = newSlaInSeconds;
    } else {
      this.slaInSeconds = 0;
      this.ticketRemainTimeSubscription.unsubscribe();
    }

    this.timerStamp(this.slaInSeconds);
  }
  unsbuscribe() {
    this.ticketRemainTimeSubscription.unsubscribe();
  }

  closeCounterDetailModel() {
    this.counterDetailModel = false;
  }

  closeServiceAreaDetail() {
    this.serviceAreaDetail = false;
  }

  onClickServiceArea() {
    this.serviceAreaList = this.staffData.serviceAreasNameList;
    this.serviceAreaDetail = true;
  }

  changeBulkModalOpen(tickT) {
    if (tickT == "pTicket") {
      this.changeStatusSingleMultiple = tickT;
    } else {
      this.changeStatusModal = true;
    }
  }

  getbulkChange() {
    let data1 = [];
    this.chakedTicketData.forEach(element => {
      data1.push({
        caseId: element.caseId
      });
    });
    const url = `/case/reassignTicketInBulk`;
    this.taskManagementService.postMethod(url, data1).subscribe((response: any) => {
      this.bulkData = response.dataList;
      this.reassignTicketModal = true;

      if (response.responseCode == 406) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: response.responseMessage,
          icon: "far fa-times-circle"
        });
      }
    });
    this.reassignStaffTicketForm.reset();
    this.staffsubmmitted = false;
    this.reassignTicketModal = true;
  }

  reassignTicketSubmit() {
    this.staffsubmmitted = true;
    if (this.reassignStaffTicketForm.valid) {
      let data1 = [];
      this.chakedTicketData.forEach(element => {
        data1.push({
          ticketId: element.caseId,
          remarkType: this.reassignStaffTicketForm.controls.remark.value,
          assignee: this.reassignStaffTicketForm.controls.staffId.value,
          teamId: this.reassignStaffTicketForm.controls.teamId.value,
          status: element.caseStatus
        });
      });

      const url = `/case/bulkUpdateDetails`;
      this.taskManagementService.updateMethod(url, data1).subscribe(
        (response: any) => {
          this.bulkData = response.dataList;
          if (response.responseCode == 406) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else if (response.responseCode == 200) {
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
          }
          this.getTicket("");
          this.reassignTicketModal = false;
          this.reassignStaffTicketForm.reset();
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
  closeReassign() {
    this.reassignStaffTicketForm.reset();
    this.reassignTicketModal = false;
  }

  addTicketCheckedData(id, event) {
    if (event.checked) {
      this.ticketDataForLink.forEach(value => {
        if (value.caseId == id) {
          this.chakedTktData.push(value.caseId);
        }
      });

      if (this.ticketDataForLink.length === this.chakedTktData.length) {
        this.isTicketChecked = true;
        this.isTicketCheckedAssigntome = true;
        this.allIsChecked = true;
      }
      //console.log("------", this.chakedTktData);
    } else {
      let checkedData = this.ticketDataForLink;
      checkedData.forEach(element => {
        if (element.caseId == id) {
          element.isSingleTktChecked = false;
        }
      });
      this.chakedTktData.forEach((value, index) => {
        if (value == id) {
          this.chakedTktData.splice(index, 1);
          // console.log(this.chakedTicketData);
        }
      });

      if (this.chakedTktData.length == 0) {
        this.isTicketChecked = false;
        this.isTicketCheckedAssigntome = false;
      }
    }
  }
  openParentTicketModel(ticketId) {
    // this.TATcaseData = this.caseInfo;
    this.parentDetailsShowModel = true;

    const url = "/case/" + ticketId;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.parentTicketDetails = response.data;
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

  closeParentTicketModel() {
    this.parentDetailsShowModel = false;
    this.childDetailsShowModel = false;
  }

  openChildTicketModel(ticketId) {
    //console.log("ticketId ", ticketId);
    // this.TATcaseData = this.caseInfo;
    this.childDetailsShowModel = true;

    const url = "/case/getChildTickets?caseId=" + ticketId;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        //console.log("response 123", response);
        this.childTicketDetails = response.dataList;
      },
      (error: any) => {
        //console.log(error, "error 123");
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  closeChildTicketModel() {
    this.childDetailsShowModel = false;
  }
  ticketRemarkModalOpen(ticket, ticketId, custId, staffId) {
    this.remarkTypeOption = [];
    let data1 = { label: "Internal Remark", value: "Internal Remark" };
    let data2 = { label: "External Remark", value: "External Remark" };
    this.remarkTypeOption.push(data1);
    // if (ticket.caseOrigin === "Email") {
    //     this.remarkTypeOption.push(data2);
    // }

    this.followUpModal = true;
    this.followupForm.reset();
    this.folloupTicketId = ticketId;
    this.folloupCustId = custId;
    this.folloupTicketassignStaffId = staffId;
    // this.followupPopupOpen = true;
    // this.generatedNameOfTheFollowUp(this.folloupTicketId);

    // this.scheduleFollowupPopupOpen();
  }

  pageChanged(pageNumber): void {
    this.currentPageTicketConfig = pageNumber;
    if (!this.searchkey) {
      this.getAssignToMeTicketDetails("");
    } else {
      this.searchTicket();
    }
  }

  ItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAssignToMeTicketDetails(this.showItemPerPage);
    } else {
      this.searchTicket();
    }
  }

  getAssignToMeTicketDetails(size) {
    let page_list;
    this.searchkey = "";
    if (size) {
      page_list = size;
      this.ticketConfigitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.ticketConfigitemsPerPage = this.pageITEM;
      } else {
        this.ticketConfigitemsPerPage = this.showItemPerPage;
      }
    }

    const ticketPagination = {
      page: this.currentPageTicketConfig,
      pageSize: this.ticketConfigitemsPerPage
    };
    const url = "/case/filter?filter=Assigned_to_me";
    this.taskManagementService.postMethod(url, ticketPagination).subscribe(
      (response: any) => {
        this.AssignToMeTicketDetails = response.dataList;
        this.ticketConfigtotalRecords = response.totalRecords;
        this.tiketTimerAssignToMe();
        this.isTicketChecked = false;
        this.isTicketCheckedAssigntome = false;
        this.chakedTicketData = [];
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

  allSelectTicketAssignToMe(event) {
    if (event.checked == true) {
      this.chakedTicketData = [];
      let checkedData = this.AssignToMeTicketDetails;
      for (let i = 0; i < checkedData.length; i++) {
        this.chakedTicketData.push({
          caseId: this.AssignToMeTicketDetails[i].caseId,
          caseStatus: this.AssignToMeTicketDetails[i].caseStatus
        });
      }
      this.chakedTicketData.forEach(value => {
        checkedData.forEach(element => {
          if (element.caseId == value.caseId) {
            element.isSingleTicketChecked = true;
          }
        });
      });
      this.isTicketCheckedAssigntome = true;
    }
    if (event.checked == false) {
      let checkedData = this.AssignToMeTicketDetails;
      this.chakedTicketData.forEach(value => {
        checkedData.forEach(element => {
          if (element.caseId == value.caseId) {
            element.isSingleTicketChecked = false;
          }
        });
      });
      this.chakedTicketData = [];
      this.isTicketCheckedAssigntome = false;
      this.allIsChecked = false;
    }
  }

  addTicketCheckedAssignToMe(id, event) {
    if (event.checked) {
      this.AssignToMeTicketDetails.forEach(value => {
        if (value.caseId == id) {
          this.chakedTicketData.push({
            caseId: value.caseId,
            caseStatus: value.caseStatus
          });
        }
      });

      if (this.AssignToMeTicketDetails.length === this.chakedTicketData.length) {
        this.isTicketCheckedAssigntome = true;
        this.allIsChecked = true;
      }
    } else {
      let checkedData = this.AssignToMeTicketDetails;
      checkedData.forEach(element => {
        if (element.caseId == id) {
          element.isSingleTicketChecked = false;
        }
      });
      this.chakedTicketData.forEach((value, index) => {
        if (value.caseId == id) {
          this.chakedTicketData.splice(index, 1);
        }
      });

      if (
        this.chakedTicketData.length == 0 ||
        this.chakedTicketData.length !== this.AssignToMeTicketDetails.length
      ) {
        this.isTicketCheckedAssigntome = false;
      }
    }
  }

  tiketTimerAssignToMe() {
    this.ticketRemainTimeSubscription = this.obs$.subscribe(() => {
      this.AssignToMeTicketDetails.forEach(element => {
        if (element.caseStatus != "Raise and Close") {
          if (
            element.currentAssigneeId == null ||
            (element.currentAssigneeId !== null &&
              element.caseStatus != "Closed" &&
              element.caseStatus != "rejected" &&
              element.caseStatus != "Raise and Close" &&
              element.caseStatus != "Pending")
          ) {
            const newYearsDate: any = new Date(
              element.nextFollowupDate + " " + element.nextFollowupTime
            );
            const currentDate: any = new Date();
            if (newYearsDate > currentDate) {
              const totalSeconds = (newYearsDate - currentDate) / 1000;
              const minutes = Math.floor(totalSeconds / 60) % 60;
              const hours = Math.floor(totalSeconds / 3600) % 24;
              const days = Math.floor(totalSeconds / 3600 / 24);
              const seconds = Math.floor(totalSeconds) % 60;
              const remainTime =
                ("0" + days).slice(-2) +
                ":" +
                ("0" + hours).slice(-2) +
                ":" +
                ("0" + minutes).slice(-2) +
                ":" +
                ("0" + seconds).slice(-2);

              element.remainTime = remainTime;
            } else {
              element.remainTime = "00:00:00:00";
            }
          }
        }
      });
    });
  }

  pageChangedUnpicked(pageNumber): void {
    this.currentPageTicketConfig = pageNumber;
    if (!this.searchkey) {
      this.getUnpickTicketDetails("");
    } else {
      this.searchTicket();
    }
  }

  ItemPerPageUnpicked(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getUnpickTicketDetails(this.showItemPerPage);
    } else {
      this.searchTicket();
    }
  }

  getUnpickTicketDetails(size) {
    let page_list;
    this.searchkey = "";
    if (size) {
      page_list = size;
      this.ticketConfigitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.ticketConfigitemsPerPage = this.pageITEM;
      } else {
        this.ticketConfigitemsPerPage = this.showItemPerPage;
      }
    }

    const ticketPagination = {
      page: this.currentPageTicketConfig,
      pageSize: this.ticketConfigitemsPerPage
    };
    this.ticketConfigtotalRecords = 0;
    const url = "/case/filter?filter=Unpicked";
    this.taskManagementService.postMethod(url, ticketPagination).subscribe(
      (response: any) => {
        this.UnpickTicketDetails = response.dataList;
        this.ticketConfigtotalRecords = response.totalRecords;
        this.tiketTimerUnpicked();
        this.isTicketChecked = false;
        this.chakedTicketData = [];
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

  allSelectUnpickTicket(event) {
    if (event.checked == true) {
      this.chakedTicketData = [];
      let checkedData = this.UnpickTicketDetails;
      for (let i = 0; i < checkedData.length; i++) {
        this.chakedTicketData.push({
          caseId: this.UnpickTicketDetails[i].caseId,
          caseStatus: this.UnpickTicketDetails[i].caseStatus
        });
      }
      this.chakedTicketData.forEach(value => {
        checkedData.forEach(element => {
          if (element.caseId == value.caseId) {
            element.isSingleTicketChecked = true;
          }
        });
      });
      this.isTicketChecked = true;
    }
    if (event.checked == false) {
      let checkedData = this.UnpickTicketDetails;
      this.chakedTicketData.forEach(value => {
        checkedData.forEach(element => {
          if (element.caseId == value.caseId) {
            element.isSingleTicketChecked = false;
          }
        });
      });
      this.chakedTicketData = [];
      this.isTicketChecked = false;
      this.allIsChecked = false;
    }
  }

  addUnpickTicketChecked(id, event) {
    if (event.checked) {
      this.UnpickTicketDetails.forEach(value => {
        if (value.caseId == id) {
          this.chakedTicketData.push({
            caseId: value.caseId,
            caseStatus: value.caseStatus
          });
        }
      });

      if (this.UnpickTicketDetails.length === this.chakedTicketData.length) {
        this.isTicketChecked = true;
        this.allIsChecked = true;
      }
    } else {
      let checkedData = this.UnpickTicketDetails;
      checkedData.forEach(element => {
        if (element.caseId == id) {
          element.isSingleTicketChecked = false;
        }
      });
      this.chakedTicketData.forEach((value, index) => {
        if (value.caseId == id) {
          this.chakedTicketData.splice(index, 1);
        }
      });

      if (
        this.chakedTicketData.length == 0 ||
        this.chakedTicketData.length !== this.UnpickTicketDetails.length
      ) {
        this.isTicketChecked = false;
      }
    }
  }

  tiketTimerUnpicked() {
    this.ticketRemainTimeSubscription = this.obs$.subscribe(() => {
      this.UnpickTicketDetails.forEach(element => {
        if (element.caseStatus != "Raise and Close") {
          if (
            element.currentAssigneeId == null ||
            (element.currentAssigneeId !== null &&
              element.caseStatus != "Closed" &&
              element.caseStatus != "rejected" &&
              element.caseStatus != "Raise and Close" &&
              element.caseStatus != "Pending")
          ) {
            const newYearsDate: any = new Date(
              element.nextFollowupDate + " " + element.nextFollowupTime
            );
            const currentDate: any = new Date();
            if (newYearsDate > currentDate) {
              const totalSeconds = (newYearsDate - currentDate) / 1000;
              const minutes = Math.floor(totalSeconds / 60) % 60;
              const hours = Math.floor(totalSeconds / 3600) % 24;
              const days = Math.floor(totalSeconds / 3600 / 24);
              const seconds = Math.floor(totalSeconds) % 60;
              const remainTime =
                ("0" + days).slice(-2) +
                ":" +
                ("0" + hours).slice(-2) +
                ":" +
                ("0" + minutes).slice(-2) +
                ":" +
                ("0" + seconds).slice(-2);

              element.remainTime = remainTime;
            } else {
              element.remainTime = "00:00:00:00";
            }
          }
        }
      });
    });
  }

  changeStatus(event) {
    if (event.value === "Follow Up") {
      this.ticketGroupForm.controls.nextFollowupDate.setValidators(Validators.required);
      this.ticketGroupForm.controls.nextFollowupDate.updateValueAndValidity();
      this.ticketGroupForm.controls.nextFollowupTime.setValidators(Validators.required);
      this.ticketGroupForm.controls.nextFollowupTime.updateValueAndValidity();
    } else {
      this.ticketGroupForm.controls.nextFollowupDate.clearValidators();
      this.ticketGroupForm.controls.nextFollowupDate.updateValueAndValidity();
      this.ticketGroupForm.controls.nextFollowupTime.clearValidators();
      this.ticketGroupForm.controls.nextFollowupTime.updateValueAndValidity();
    }
    this.getResolutionReasons(event.value);
  }

  pageChangedAssignToTeam(pageNumber): void {
    this.currentPageTicketConfig = pageNumber;
    if (!this.searchkey) {
      this.getAssignToTeamTicketDetails("");
    } else {
      this.searchTicket();
    }
  }

  ItemPerPageAssignToTeam(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAssignToTeamTicketDetails(this.showItemPerPage);
    } else {
      this.searchTicket();
    }
  }

  getAssignToTeamTicketDetails(size) {
    let page_list;
    this.searchkey = "";
    if (size) {
      page_list = size;
      this.ticketConfigitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.ticketConfigitemsPerPage = this.pageITEM;
      } else {
        this.ticketConfigitemsPerPage = this.showItemPerPage;
      }
    }

    this.ticketConfigtotalRecords = 0;
    const ticketPagination = {
      page: 1,
      pageSize: this.ticketConfigitemsPerPage
    };
    const url = "/case/filter?filter=Assigned_to_my_team";
    this.taskManagementService.postMethod(url, ticketPagination).subscribe(
      (response: any) => {
        this.AssignToTeamDetails = response.dataList;
        this.ticketConfigtotalRecords = response.totalRecords;
        this.tiketTimerAssignToTeam();
        this.isTicketChecked = false;
        this.chakedTicketData = [];
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
  tiketTimerAssignToTeam() {
    this.ticketRemainTimeSubscription = this.obs$.subscribe(() => {
      this.AssignToTeamDetails.forEach(element => {
        if (element.caseStatus != "Raise and Close") {
          if (
            element.currentAssigneeId == null ||
            (element.currentAssigneeId !== null &&
              element.caseStatus != "Closed" &&
              element.caseStatus != "rejected" &&
              element.caseStatus != "Raise and Close" &&
              element.caseStatus != "Pending")
          ) {
            const newYearsDate: any = new Date(
              element.nextFollowupDate + " " + element.nextFollowupTime
            );
            const currentDate: any = new Date();
            if (newYearsDate > currentDate) {
              const totalSeconds = (newYearsDate - currentDate) / 1000;
              const minutes = Math.floor(totalSeconds / 60) % 60;
              const hours = Math.floor(totalSeconds / 3600) % 24;
              const days = Math.floor(totalSeconds / 3600 / 24);
              const seconds = Math.floor(totalSeconds) % 60;
              const remainTime =
                ("0" + days).slice(-2) +
                ":" +
                ("0" + hours).slice(-2) +
                ":" +
                ("0" + minutes).slice(-2) +
                ":" +
                ("0" + seconds).slice(-2);

              element.remainTime = remainTime;
            } else {
              element.remainTime = "00:00:00:00";
            }
          }
        }
      });
    });
  }
  onCallDisconnected(event) {
    if (event == "false") {
      this.isCallDisconnected = true;
      this.isticket = true;
      const url = "/case/findAll/ContactFailed";
      this.taskManagementService.getMethod(url).subscribe(
        (response: any) => {
          if (response.ContactFailed && response.ContactFailed?.length > 0) {
            this.reasonForCallDisconnect = response.ContactFailed[0].split(",");
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
      this.chnageStatusForm.controls.deacivate_reason.reset();
      this.chnageStatusForm.controls.is_closed.reset();
      this.isCallDisconnected = false;
      //this.isCall = false;
      this.isticket = false;
      this.feedbackFormModal = true;
      this.getStaffBehaviourFeedback();
      this.getPaymentMode("");
      this.getProblemType();
    }
  }

  saveFeedback(ticketId) {
    if (this.feedbackForm.valid) {
      this.feedbackSubmitted = true;
      this.caseFeedbackRel = this.feedbackForm.value;
      this.reasondata = this.caseFeedbackRel.reason;
      if (this.reasondata != null && this.reasondata != undefined && this.reasondata != "") {
        this.reasonStringdata = this.reasondata.map(element => `${element}`).join(",");
        //console.log("this.reasonStringdata",this.reasonStringdata);
      } else {
        this.reasonStringdata;
      }

      this.infodata = this.caseFeedbackRel.infoOfPaymentMode;
      if (this.infodata != null && this.infodata != undefined && this.infodata != "") {
        this.infoStringdata = this.infodata.map(element => `${element}`).join(",");
        //console.log("this.infoStringdata",this.infoStringdata);
      } else {
        this.infoStringdata = "";
      }
      this.paymentTypedata = this.caseFeedbackRel.problem_type;
      if (
        this.paymentTypedata != null &&
        this.paymentTypedata != undefined &&
        this.paymentTypedata != ""
      ) {
        this.paymentTypeStringdata = this.paymentTypedata.map(element => `${element}`).join(",");
      } else {
        this.paymentTypeStringdata = "";
      }
      this.updatefeedbackDetails = {};
      this.updatefeedbackDetails.support_type = this.caseFeedbackRel.support_type;
      this.updatefeedbackDetails.staff_behavior = this.caseFeedbackRel.staff_behavior;
      this.updatefeedbackDetails.payment_mode = this.caseFeedbackRel.payment_mode;
      this.updatefeedbackDetails.infoOfPaymentMode = this.infoStringdata;
      this.updatefeedbackDetails.current_bandwidth_feedback =
        this.caseFeedbackRel.current_bandwidth_feedback;
      this.updatefeedbackDetails.current_price_feedback =
        this.caseFeedbackRel.current_price_feedback;
      this.updatefeedbackDetails.referal_information = this.caseFeedbackRel.referal_information;
      this.updatefeedbackDetails.technicial_support_feedback =
        this.caseFeedbackRel.technicial_support_feedback;
      this.updatefeedbackDetails.problem_type = this.paymentTypeStringdata;
      this.updatefeedbackDetails.service_experience = this.caseFeedbackRel.service_experience;
      this.updatefeedbackDetails.behaviour_professionalism =
        this.caseFeedbackRel.behaviour_professionalism;
      this.updatefeedbackDetails.reason = this.reasonStringdata;
      this.updatefeedbackDetails.overall_rating = this.caseFeedbackRel.overall_rating;
      this.updatefeedbackDetails.general_remarks = this.caseFeedbackRel.general_remarks;
      this.updatefeedbackDetails.ticketid = ticketId;
      this.feedbackForm.reset();
      this.feedbackFormModal = false;
    }
  }
  getPaymentMode(event) {
    const url = "/case/findAll/PaymentMode";
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.paymentModeData = response.PaymentModeList[0].split(",");
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
    // console.log("event------",event)
    if (event == "Organization App") {
      this.infoOfPaymentModeData = [{ label: "Organization App", value: "Organization App" }];
    } else if (event == "Online Payment") {
      this.infoOfPaymentModeData = [{ label: "Online Payment", value: "Online Payment" }];
    } else {
      this.infoOfPaymentModeData = [
        { label: "Organization App", value: "Organization App" },
        { label: "Online Payment", value: "Online Payment" }
      ];
    }
  }
  getStaffBehaviourFeedback() {
    const url = "/case/findAll/Feedback";
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.staffBehaviourData = response.UnsatisfiedList[0].split(",");
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
  getProblemType() {
    const url = "/case/findAll/ProblemType";
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.problemTypeData = response.ProblemTypeList[0].split(",");
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
  getbehaviourPro(event) {
    this.feedbackForm.controls.reason.reset();
    const url = "/case/findAll/Feedback";
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.BehaviourData = response.UnsatisfiedList[0].split(",");
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
    if (event == "Satisfied") {
      this.isEnable = true;
      const url = "/case/findAll/Satisfied";
      this.taskManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.BehaviourReasonData = response.SatisfiedList[0].split(",");
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
    } else if (event == "Not Satisfied") {
      this.BehaviourReasonData = [];
      this.isEnable = true;
      const url = "/case/findAll/Unsatisfied";
      this.taskManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.BehaviourReasonData = response.UnsatisfiedList[0].split(",");
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
      this.isEnable = false;
    }
  }
  getServiceExperience(event) {
    this.feedbackForm.controls.problem_type.reset();
    if (event == "Not Satisfied") {
      this.isProblemType = true;
    } else {
      this.isProblemType = false;
    }
  }

  // onSelectService(serviceLists: any) {
  //     let serviceIdList = this.ticketGroupForm.controls.ticketServicemappingList.value;
  //     if (serviceIdList != null) {
  //         this.getTicketReasonCategory(serviceIdList);
  //         console.log("getSerialNumbers ::: ");

  //         this.getSerialNumbers(serviceIdList);
  //     }
  // }
  // getSerialNumbers(serviceIdsList) {
  //     let serviceIdList = this.ticketGroupForm.controls.ticketServicemappingList.value;
  //     const url =
  //         "/subscriber/getSerialNumber?custId=" +
  //         this.ticketGroupForm.controls.customersId.value +
  //         "&serviceIds=" +
  //         serviceIdList;
  //     console.log("Called getSerialNumbers ::: ", url);
  //     this.customerManagementService.getMethod(url).subscribe(
  //         (response: any) => {
  //             this.serialNumbers = response.dataList.filter(serial => serial.serialNumber != null);
  //         },
  //         (error: any) => {
  //             this.messageService.add({
  //                 severity: "error",
  //                 summary: "Error",
  //                 detail: error.error.ERROR,
  //                 icon: "far fa-times-circle"
  //             });
  //         }
  //     );
  // }

  ticketConversationModalOpen(ticketId) {
    this.getFollowUpDetailById(ticketId);
    this.conversationModal = true;
  }

  closeFollowupTicket() {
    this.followupSubmmitted = false;
    this.followupForm.reset();
    this.followupForm.clearValidators();
    this.followupForm.updateValueAndValidity();
    this.followUpModal = false;
  }

  closeConversation() {
    this.conversationModal = false;
  }

  getAllStaff() {
    this.staffList = [];

    this.staffService.getAllStaffListWithoutPagination().subscribe((response: any) => {
      this.staffList = response.dataList;
    });
  }

  getTicketCurrentAssigneeData(staffId) {
    const url = "/staffuser/" + staffId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.assignStaffData = response.Staff;
        this.assignStaffParentId = this.assignStaffData.parentStaffId;
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

  clearMenu() {
    // this.ticketReasonSubCategoryData = "";
    this.parentTRCData = "";
    this.childTRCData = "";
  }

  closeAssignStaffModel() {
    this.assignCustomerCAFModal = false;
  }

  handleChange(event: any) {
    if (event.index == 0) {
      this.currentPageTicketConfig = 1;
      this.getTicket(5);
    }
    // } else if (event.index == 1) {
    //     this.currentPageTicketConfig = 1;
    //     this.getAssignToMeTicketDetails(5);
    // }
    else if (event.index == 1) {
      this.currentPageTicketConfig = 1;
      this.showDashboardTabs = true;
      this.getAllTaskCounts();
      this.onDashboardTabChange({ index: 0 });
    } else if (event.index == 2) {
      this.currentPageTicketConfig = 1;
      this.getUnpickTicketDetails(5);
    } else if (event.index == 3) {
      this.currentPageTicketConfig = 1;
      this.getAssignToTeamTicketDetails(5);
    } else {
      this.currentPageTicketConfig = 1;
      this.getAllStaffByParentStaff(5);
    }
  }

  getTicketReasonCategoryDataList() {
    const url = "/CaseCategory/getAllActiveReasonCatgory";
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.parentTRCData = response.dataList;
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

  getTicketSubReasonCategoryDataList(caseCategoryId) {
    const url =
      "/CaseSubCategory/getAllSubCaseCategoryListByCategoryId?caseCategoryId=" + caseCategoryId;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.childTRCData = response.dataList;
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
  getTATDetails(caseCategoryId) {
    const url = "/CaseCategory/getTatByCaseCategory?caseCategoryId=" + caseCategoryId;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.data && response.data.length > 0) {
          this.TatDetails = response.data[0];
          this.showTatDetails = true;
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

  onParentChange(event: any) {
    if (event.value !== null && event.value !== undefined) {
      this.getTicketSubReasonCategoryDataList(event.value);
    }
  }

  // onChildChange(event: any) {
  //     var childIds = event.value;
  //     // this.getTicketSubReasonCategoryDataList(event.value);
  // }
  closeTAT() {
    this.showTatDetails = false;
  }

  uploadResolveDocument() {
    this.activeTabIndex = 0;
    this.uploadResolveDocForm.forEach((formGroup, tabIndex) => {
      formGroup.patchValue({
        sectionName: this.tabs[tabIndex]
      });
    });
    this.selectedResolveFileUploadPreview = [];
    this.uploadResolvedocumentId = true;
  }

  downloadResolveDocument(ticketDeatailData) {
    this.ticketIdData = ticketDeatailData.caseId;
    let url = "/case/documentList/" + this.ticketIdData;
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.ticketFileDocData = response.dataList;
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          this.downloadResolveDocumentId = true;
          this.activeTabViewIndex = 0;
        } else if (response.responseCode == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
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
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  closeDownloadResolveDocumentId() {
    this.downloadResolveDocumentId = false;
    this.activeTabViewIndex = 0;
  }

  downloadResolveDoc(fileName, section, sectionName) {
    let ticketId = section.ticketId;
    let uniqueName = section.uniqueName;
    this.taskManagementService.downloadResolveFile(ticketId, uniqueName, sectionName).subscribe(
      blob => {
        if (blob.status == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: "Download Successfully",
            icon: "far fa-check-circle"
          });
          importedSaveAs(blob.body, fileName);
        } else if (blob.status == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "File Not Found",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!",
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

  deleteResolveDoc(fileName, section, sectionName) {
    let ticketId = section.ticketId;
    let uniqueName = section.uniqueName;
    let urldoc =
      "/case/document/delete/" +
      ticketId +
      "/" +
      fileName +
      "/" +
      uniqueName +
      "/" +
      sectionName +
      "/";
    this.taskManagementService.deleteMethod(urldoc).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          this.closeDownloadResolveDocumentId();
        } else if (response.responseCode == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
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
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  showticketResolveDocData(fileName, section, sectionName) {
    // console.log("data ", data?.filename.split(".")[data?.filename.split(".")?.length - 1]);
    // const url = `/case/document/download/${data.ticketId}/${data.docId}`;
    const fileType = fileName.split(".");
    let ticketId = section.ticketId;
    let uniqueName = section.uniqueName;
    this.taskManagementService.downloadResolveFile(ticketId, uniqueName, sectionName).subscribe(
      data => {
        if (data.status == 200) {
          let type = "application/octet-stream"; // Default type
          const uint = new Uint8Array(data.body);
          const magic = uint.subarray(0, 4); // Check the magic bytes to identify the file type

          if (magic.every(b => b === 0xff)) {
            type = "image/jpeg";
          } else if (
            magic[0] === 0x89 &&
            magic[1] === 0x50 &&
            magic[2] === 0x4e &&
            magic[3] === 0x47
          ) {
            type = "image/png";
          } else if (
            magic[0] === 0x47 &&
            magic[1] === 0x49 &&
            magic[2] === 0x46 &&
            magic[3] === 0x38
          ) {
            type = "image/gif";
          } else if (
            magic[0] === 0xd0 &&
            magic[1] === 0xcf &&
            magic[2] === 0x11 &&
            magic[3] === 0xe0
          ) {
            type = "application/vnd.ms-excel";
          } else if (
            magic[0] === 0x25 &&
            magic[1] === 0x50 &&
            magic[2] === 0x44 &&
            magic[3] === 0x46
          ) {
            type = "application/pdf";
          } else if (
            magic[0] === 0xd0 &&
            magic[1] === 0xcf &&
            magic[2] === 0x11 &&
            magic[3] === 0xe0
          ) {
            type = "application/msword";
          }

          if (fileType[fileType?.length - 1] === "pdf") {
            // If it's a PDF file, create a blob and open it in a new tab
            const blob = new Blob([data.body], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, "_blank"); // Open PDF in a new tab
          } else if (fileType[fileType?.length - 1] === "png") {
            // If it's a PNG image, create a blob URL and display it in an <img> tag
            const blob = new Blob([data.body], { type: "image/png" });
            const blobUrl = URL.createObjectURL(blob);
            this.resolvePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl); // Trust the blob URL
            this.resolvedocumentPreview = true; // Set flag to show the image preview
          } else {
            // For other types (e.g., JPEG, GIF), display as image preview
            const blob = new Blob([data.body], { type });
            const blobUrl = URL.createObjectURL(blob);
            this.resolvePreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl); // Trust the blob URL
            this.resolvedocumentPreview = true; // Set flag to show the image preview
          }
        } else if (data.status == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "File Not Found",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Something went wrong!",
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

  closeDocumentResolvePreview() {
    this.resolvedocumentPreview = false;
  }

  createResolveFileList(files: File[]): FileList {
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    return dataTransfer.files;
  }

  onFileResolveChangeUpload(event: any, tabIndex: number): void {
    this.selectedResolveFileUploadPreview[tabIndex] = [];
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const files: FileList = inputElement.files;

      // Validate all files
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (
          file &&
          (file.type === "image/png" ||
            file.type === "image/jpg" ||
            file.type === "image/jpeg" ||
            file.type === "application/pdf")
        ) {
          this.selectedResolveFileUploadPreview[tabIndex].push(file);
        } else {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: `Invalid file type: ${file?.name}. Must be png, jpg, jpeg, or pdf.`,
            icon: "far fa-check-circle"
          });
        }
      }

      if (this.selectedResolveFileUploadPreview[tabIndex].length > 0) {
        this.resolveMultiFiles = this.createResolveFileList(
          this.selectedResolveFileUploadPreview[tabIndex]
        );
        this.selectedFile = this.selectedResolveFileUploadPreview[tabIndex][0];
        this.uploadResolveDocForm[tabIndex].patchValue({
          file: this.resolveMultiFiles[0]
        });
      } else {
        this.uploadResolveDocForm[tabIndex].controls.file.reset();
        inputElement.value = "";
      }
    }
  }

  deleteResolveUploadedFile(fileName: string, tabIndex: number): void {
    const temp: File[] = this.selectedResolveFileUploadPreview[tabIndex]?.filter(
      (item: File) => item?.name !== fileName
    );
    this.selectedResolveFileUploadPreview[tabIndex] = temp;
    this.uploadResolveDocForm[tabIndex].patchValue({
      file: temp
    });
  }

  closeUploadResolveDocumentId(): void {
    this.uploadResolvedocumentId = false;
    this.createForm().reset();
    this.resolvesubmitted = false;
    this.uploadResolveDocForm.forEach(formGroup => {
      formGroup.reset();
    });
    this.selectedResolveFileUploadPreview = [];
  }

  uploadResolveAllDocuments(): void {
    this.resolvesubmitted = true;
    let allSectionsData: any[] = [];
    let allFiles: File[] = [];
    let invalidMandatoryTabs: string[] = [];
    this.uploadResolveDocForm.forEach((formGroup, tabIndex) => {
      formGroup.patchValue({
        sectionName: this.tabs[tabIndex]
      });
      const isOpticalPowerRange = this.tabs[tabIndex] === "Optical Power Range";
      const sectionData = this.collectResolveSectionData(formGroup, tabIndex);
      const hasFiles = sectionData && sectionData.files.length > 0;
      const isMandatory = this.tabsMandatory[tabIndex];
      let isValid = true;
      if (isMandatory) {
        isValid =
          formGroup.valid ||
          (isOpticalPowerRange && (hasFiles || formGroup.get("opticalRange")?.value != null));
      }
      if (isValid) {
        if (sectionData) {
          allSectionsData.push(sectionData.section);
          if (sectionData.files.length > 0) {
            allFiles = [...allFiles, ...sectionData.files];
          }
        }
      } else if (isMandatory) {
        invalidMandatoryTabs.push(this.tabs[tabIndex]);
      }
      // else {
      //     this.messageService.add({
      //         severity: "error",
      //         summary: "Form Invalid",
      //         detail: isOpticalPowerRange
      //             ? "Please upload a file or enter a valid Optical Power Range value."
      //             : `Please fill out all required fields in ${this.tabs[tabIndex]}`,
      //         icon: "far fa-times-circle"
      //     });
      // }
    });
    if (invalidMandatoryTabs.length > 0) {
      this.messageService.add({
        severity: "info",
        summary: "info",
        detail: `Fields are mandatory in these tabs: ${invalidMandatoryTabs.join(", ")}`,
        icon: "far fa-times-circle"
      });
      return;
    }
    if (allSectionsData.length > 0) {
      this.uploadResolveDocuments(allSectionsData, allFiles);
    }
    // else {
    //     this.messageService.add({
    //         severity: "error",
    //         summary: "No Valid Sections",
    //         detail: "Please fill out at least one section before submitting.",
    //         icon: "far fa-times-circle"
    //     });
    // }
  }

  collectResolveSectionData(
    formGroup: FormGroup,
    tabIndex: number
  ): { section: any; files: File[] } | null {
    const section = {
      name: formGroup.value.sectionName,
      latitude: formGroup.value.latitude,
      longitude: formGroup.value.longitude,
      opticalRange: formGroup.value.opticalRange,
      files: [] as File[]
    };

    if (this.selectedResolveFileUploadPreview[tabIndex]) {
      this.selectedResolveFileUploadPreview[tabIndex].forEach((file: File) => {
        section.files.push(file);
      });
    }

    return { section, files: section.files };
  }

  uploadResolveDocuments(sectionsData: any[], allFiles: File[]): void {
    this.uploadformData = sectionsData;
    // formData.append('customerInventoryId', this.ticketIdData.toString());

    // sectionsData.forEach((section, i) => {
    //     this.uploadformData.append(`sections[${i}].name`, section.name);
    //     this.uploadformData.append(`sections[${i}].latitude`, section.latitude);
    //     this.uploadformData.append(`sections[${i}].longitude`, section.longitude);
    //     this.uploadformData.append(`sections[${i}].opticalRange`, section.opticalRange);
    //     section.files.forEach((file: File) => {
    //         this.uploadformData.append(`sections[${i}].files`, file);
    //     });
    // });

    // console.log(this.uploadformData, 'Form Data being sent');

    const url = `/inwards/inventory/document/upload/`;
    // this.customerInventoryManagementService.postMethod(url, formData).subscribe(
    //     (response: any) => {
    //         if (response.responseCode === 406 || response.responseCode === 417) {
    //             this.messageService.add({
    //                 severity: 'error',
    //                 summary: 'Error',
    //                 detail: response.responseMessage,
    //                 icon: 'far fa-times-circle'
    //             });
    //         } else {
    this.closeUploadResolveDocumentId();
    //             this.submitted = false;
    //             this.messageService.add({
    //                 severity: 'success',
    //                 summary: 'Successfully',
    //                 detail: response.message,
    //                 icon: 'far fa-check-circle'
    //             });
    this.uploadResolvedocumentId = false;
    //         }
    //     },
    //     (error: any) => {
    //         console.error(error, 'error');
    //         this.messageService.add({
    //             severity: 'error',
    //             summary: 'Error',
    //             detail: error.error.ERROR,
    //             icon: 'far fa-times-circle'
    //         });
    //     }
    // );
  }

  deleteResolveConfirm(file, section, sectionName) {
    this.confirmationService.confirm({
      message: "Do you want to delete this file?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.deleteResolveDoc(file, section, sectionName);
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

  hasFilesForTab(tab: string): boolean {
    return this.ticketFileDocData?.some(section => section?.sectionName === tab) ?? false;
  }

  mylocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        if (position) {
          // this.iflocationFill = true;
          this.uploadResolveDocForm.forEach((formGroup, tabIndex) => {
            if (this.activeTabIndex === tabIndex) {
              formGroup.patchValue({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            }
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

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
  }

  getAllTaskCounts() {
    const url = "/case/allTaskCounts";
    this.taskManagementService.getMethod(url).subscribe(
      (response: any) => {
        const data = response.data;
        this.allTaskCounts = Object.keys(data).map(key => ({
          key: key,
          label: this.formatLabel(key),
          value: data[key]
        }));
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

  formatLabel(key: string): string {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());
  }

  onDashboardTabChange(event: any) {
    const selectedIndex = event.index;
    this.activeDashboardTabIndex = selectedIndex;
    const selectedTab = this.allTaskCounts[selectedIndex];
    if (selectedTab && selectedTab.key) {
      const status = selectedTab.key;
      this.getCasesByStatus(status);
    }
  }

  getCasesByStatus(status: string, size?: number) {
    const url = `/case/allCasesByStatusAndStaff?status=${status}`;
    let pageSize = size || this.casestatusitemPerPage;
    if (size) {
      this.casestatusitemPerPage = size;
    }

    const requestPayload = {
      page: this.currentPageCaseStatus,
      pageSize: pageSize
    };

    this.taskManagementService.postMethod(url, requestPayload).subscribe(
      (response: any) => {
        if (response.responseCode === 0) {
          this.caseStatusListData = [];
          this.caseStatusTotalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "pi pi-info-circle"
          });
        } else {
          this.caseStatusListData = response.dataList;
          this.caseStatusTotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.ERROR || "Something went wrong",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedCaseStatusConfig(pageNumber: number): void {
    this.currentPageCaseStatus = pageNumber;
    const status = this.allTaskCounts[this.activeDashboardTabIndex]?.key;
    if (status) {
      this.getCasesByStatus(status);
    }
  }

  TotalCaseStatusItemPerPage(event: any): void {
    this.casestatusitemPerPage = Number(event.value);
    if (this.currentPageCaseStatus > 1) {
      this.currentPageCaseStatus = 1;
    }
    const status = this.allTaskCounts[this.activeDashboardTabIndex]?.key;
    if (status) {
      this.getCasesByStatus(status);
    }
  }

  getAllStaffByParentStaff(size) {
    this.showAssignedToTeam = false;
    let page_list;
    this.searchkey = "";
    if (size) {
      page_list = size;
      this.ticketConfigitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.ticketConfigitemsPerPage = this.pageITEM;
      } else {
        this.ticketConfigitemsPerPage = this.showItemPerPage;
      }
    }
    this.ticketConfigtotalRecords = 0;
    const ticketPagination = {
      page: 1,
      pageSize: this.ticketConfigitemsPerPage
    };
    const url = "/getAllStaffByParentStaff";
    this.adoptCommonBaseService.postMethod(url, ticketPagination).subscribe(
      (response: any) => {
        this.staffListParentList = response.dataList;
        this.ticketConfigtotalRecords = response.totalRecords;
        // console.log(this.AssignToTeamDetails);
        // this.tiketTimerAssignToTeam();
        // this.isTicketChecked = false;
        // this.chakedTicketData = [];
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

  pageChangedMystaff(pageNumber): void {
    this.currentPageTicketConfig = pageNumber;
    if (!this.searchkey) {
      this.getAllStaffByParentStaff("");
    } else {
      this.searchTicket();
    }
  }

  ItemPerPageStaff(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.getAllStaffByParentStaff(this.showItemPerPage);
    } else {
      this.searchTicket();
    }
  }

  openStaffById(size, staffId) {
    this.selectedStaffId = staffId;
    this.showAssignedToTeam = true;
    let page_list;
    this.searchkey = "";
    if (size) {
      page_list = size;
      this.ticketConfigitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.ticketConfigitemsPerPage = this.pageITEM;
      } else {
        this.ticketConfigitemsPerPage = this.showItemPerPage;
      }
    }
    this.ticketConfigtotalRecords = 0;
    const ticketPagination = {
      page: 1,
      pageSize: this.ticketConfigitemsPerPage
    };
    const url = "/case/allByStaff?staffId=" + Number(staffId);
    this.taskManagementService.postMethod(url, ticketPagination).subscribe(
      (response: any) => {
        if (response && response.dataList && response.dataList.length > 0) {
          this.staffListParentList = response.dataList;
          this.ticketConfigtotalRecords = response.totalRecords;
          this.tiketTimerAssignToTeam();
          this.isTicketChecked = false;
          this.chakedTicketData = [];
        } else {
          this.staffListParentList = [];
          this.ticketConfigtotalRecords = 0;

          // Show info toast
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage || "No Assigned tasks found",
            icon: "far fa-info-circle"
          });
        }

        this.tiketTimerAssignToTeam();
        this.isTicketChecked = false;
        this.chakedTicketData = [];
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

  pageChangedAssignToStaff(pageNumber): void {
    this.currentPageTicketConfig = pageNumber;
    if (!this.searchkey) {
      this.openStaffById("", "");
    } else {
      this.searchTicket();
    }
  }

  ItemPerPageAssignToStaff(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    if (!this.searchkey) {
      this.openStaffById("", this.showItemPerPage);
    } else {
      this.searchTicket();
    }
  }

  onBackToChildStaff() {
    this.showAssignedToTeam = false;
    this.getAllStaffByParentStaff(this.ticketConfigitemsPerPage);
  }
  getResolutionRootCause(value: string): void {
    this.rootCauseReasonData = [];
    // this.ticketGroupForm.controls.rootCauseReasonId.enable();
    // this.chnageStatusForm.controls.rootCauseReasonId.enable();
    this.resolutionReasonData.forEach(e => {
      if (e.id === value) {
        e.rootCauseResolutionMappingList.forEach(f => this.rootCauseReasonData.push(f));
        // this.rootCauseReasonData.push(e.rootCauseResolutionMappingList);
      }
    });
    this.uploadDocumentRoot = true;
  }

  closeUploadDocumentRoot() {
    this.uploadDocumentRoot = false;
  }

  onFileChangeUploadRoot(event: any): void {
    const validFiles: File[] = [];
    const files: FileList = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (
        file &&
        (file.type === "image/png" ||
          file.type === "image/jpg" ||
          file.type === "image/jpeg" ||
          file.type === "application/pdf")
      ) {
        validFiles.push(file);
      } else {
        this.messageService.add({
          severity: "error",
          summary: "Invalid File",
          detail: "Only PNG, JPG, JPEG, or PDF allowed"
        });
      }
    }

    this.selectedFileUploadPreview = validFiles;

    this.uploadRootForm.patchValue({
      resolutionFiles: validFiles
    });
  }

  mylocationRoot(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.uploadRootForm.patchValue({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Geolocation is not supported by this browser."
      });
    }
  }

  deletUploadedFileRoot(fileName: string): void {
    const remainingFiles = this.selectedFileUploadPreview.filter(
      (file: File) => file.name !== fileName
    );
    this.selectedFileUploadPreview = remainingFiles;
    this.uploadRootForm.patchValue({
      resolutionFiles: remainingFiles
    });
  }

  createUploadRootForm(): FormGroup {
    return this.fb.group({
      resolutionFiles: [[]],
      latitude: [""],
      longitude: [""],
      uploadremark: [""],
      addRemarkChecked: [false]
    });
  }
}
