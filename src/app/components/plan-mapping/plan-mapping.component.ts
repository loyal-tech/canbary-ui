import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { CustspecialPlanMappingService } from "src/app/service/custspecial-plan-mapping.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { PlanManagementService } from "src/app/service/plan-management.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Observable, Observer, BehaviorSubject } from "rxjs";
import { MultiplecustomerSelectComponent } from "../multiplecustomer-select/multiplecustomer-select.component";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { SearchPaymentService } from "src/app/service/search-payment.service";
import { isEqual } from "lodash";
import { LeadManagementService } from "src/app/service/lead-management-service";
import { DatePipe } from "@angular/common";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { PRODUCTS } from "src/app/constants/aclConstants";
import { WhiteeSpaceValidator } from "../shared/custom-validators";
declare var $: any;

@Component({
  selector: "app-plan-mapping",
  templateUrl: "./plan-mapping.component.html",
  styleUrls: ["./plan-mapping.component.css"]
})
export class PlanMappingComponent implements OnInit {
  @ViewChild(MultiplecustomerSelectComponent)
  multipleCUSTDataModal: MultiplecustomerSelectComponent;

  custdata = new BehaviorSubject({
    custdata: []
  });
  planMappingGroupForm: FormGroup;
  submitted: boolean = false;
  plansubmitted: boolean = false;
  custsubmitted: boolean = false;
  leadsubmitted: boolean = false;
  approveCustomerModal: boolean = false;
  planMappingData: any = [];
  selectLeadModal: boolean = false;
  viewPlanMappingData: any = [];
  currentPagePlanMappingListdata = 1;
  planMappingListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  planMappingListdatatotalRecords: any;
  isPlanMappingEdit: boolean = false;
  ifModelIsShow: boolean = false;
  paymappingItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  payMappinftotalRecords: String;
  currentPagePayMapping = 1;

  paymappingItemPerPagec = RadiusConstants.ITEMS_PER_PAGE;
  payMappinftotalRecordsc: String;
  currentPagePayMappingc = 1;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  totalAreaListLength = 0;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  searchkey: string;
  searchkeyLead: string;
  searchkeyLead2: string;
  searchData: any;
  searchDeatil: any;
  getStaffUsers: any;
  approvrd: boolean;

  leadStatusOptions = ["Inquiry", "Converted", "Rejected", "Re-Inquiry"];
  status = [{ label: "Active" }, { label: "Inactive" }];

  planMapping: FormArray;
  customerMapping: FormArray;
  leadMapping: FormArray;

  serviceData: any = [];
  specialPlan: any = [];
  normalPlan: any = [];
  // customerData: any = [];

  specialPlanDD: any = [];
  specialPlanDD1: any = [];
  specialPlanLead: any = [];

  normalPlanDD: any = [];
  customerDD: any = [];
  leadDD: any = [];

  serviceValue: any;
  normalPlanId: any = [];
  specialPlanId: number;

  custServiceValue: any;
  custId: any = [];
  custSpecialPlanId: number;

  leadServiceValue: any;
  leadId: any = [];
  leadID: any;
  leadSpecialPlanId: number;

  specialCustMapping = {
    id: 0,
    customerId: 0,
    specialPlanId: 0
  };

  specialLeadMapping = {
    id: 0,
    leadId: 0,
    specialPlanId: 0
  };

  createView: boolean = false;
  mappingDeatilsShow: boolean = true;
  searchView: boolean = true;

  searchSpecialPlanMappingName: any;

  planCategoryForm: FormGroup;
  PlanGroupfromgroup: FormGroup;
  PlanCustfromgroup: FormGroup;
  planLeadGroupfromgroup: FormGroup;
  planGroupFromArray: FormArray;
  custGroupFromArray: FormArray;
  leadGroupFromArray: FormArray;

  planGroupSubmitted: boolean = false;
  ifIndividualPlan = false;
  ifPlanGroup = false;
  planGroupitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  planGrouptotalRecords: number;
  currentPageplanGroup = 1;
  planGrouplength = 0;
  selServiceId: any;
  planDetailsCategory = [
    { label: "Individual", value: "individual" },
    { label: "Plan Group", value: "groupPlan" }
  ];
  specialPlanGroupId: any;
  specialPlanLeadGroupId: any;
  customeListData: any = [];
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  assignDocForm: FormGroup;

  currentPageParentCustomerListdata = 1;
  parentCustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentCustomerListdatatotalRecords: any;

  currentPageLeadListdata = 1;
  parentLeadListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  parentLeadListdatatotalRecords: any;

  selectedParentCust: any = [];
  selectedLead: any = [];
  selectedParentCustId: any;
  selectedLeadId: any;
  parentCustList: any = [];
  selectedLeadList: any = [];
  newFirst = 0;
  searchParentCustOption = "";
  searchParentCustValue = "";
  searchLeadOption = "";
  searchLeadValue = "";
  searchDeatilLead: any;
  parentFieldEnable = false;
  leadFieldEnable = false;
  customerList = [];
  leadList = [];
  customerid: any = "";
  leadIds: any = "";
  currentPage = 1;
  itemsPerPage: number = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: number;
  searchOptionSelect = this.commondropdownService.customerSearchOption;
  searchOptionSelectLead = [
    { label: "Username", value: "name" },
    { label: "Mobile", value: "mobile" },
    { label: "Created By", value: "createdBy" },
    { label: "Last Modified On", value: "lastUpdateOn" },
    { label: "Lead Status", value: "status" }
  ];

  ifApproveSPMStatus = false;
  approveRejectSPMRemark = "";
  apprRejectSPMData: any = [];
  assignStaffListDataSPM = [];
  assignedStaffSPM: any;
  staffIDSPMSPM: number;
  mvnoIdSPM: number;
  mvnoid: number;
  noRecordMsg: any;
  selectStaff: any;
  assignPlanForm: FormGroup;
  remark: string;
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  isPlanDetilsDialog: boolean = false;
  customerMappingPlanType: any;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private planManagementService: PlanManagementService,
    public commondropdownService: CommondropdownService,
    public mappingService: CustspecialPlanMappingService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private searchPaymentService: SearchPaymentService,
    private leadManagementService: LeadManagementService,
    loginService: LoginService,
    public datePipe: DatePipe
  ) {
    this.createAccess = loginService.hasPermission(PRODUCTS.SPECIAL_PLAN_MAPPING_CREATE);
    this.deleteAccess = loginService.hasPermission(PRODUCTS.SPECIAL_PLAN_MAPPING_DELETE);
    this.editAccess = loginService.hasPermission(PRODUCTS.SPECIAL_PLAN_MAPPING_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;
    // this.isPlanMappingEdit = !this.createAccess && this.editAccess ? true : false;
    this.commondropdownService.getplanservice();
    this.getMappingDataList("");
    this.getSpecialPlan();
    this.getNormalPlan();
    // this.getCustomerList();
    this.getParentCustomerData();
    this.getLeadList();
    // this.getCustomerListData();
  }

  ngOnInit(): void {
    this.mvnoid = Number(localStorage.getItem("mvnoId"));
    let staffIDSPM = localStorage.getItem("userId");
    this.staffIDSPMSPM = Number(staffIDSPM);
    this.mvnoIdSPM = Number(localStorage.getItem("mvnoIdSPM"));
    this.planMapping = this.fb.array([]);
    this.customerMapping = this.fb.array([]);
    this.leadMapping = this.fb.array([]);
    this.assignDocForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.planMappingGroupForm = this.fb.group({
      name: ["", [Validators.required, WhiteeSpaceValidator.cannotContainSpace]],
      status: ["", Validators.required],
      planMapping: [this.fb.array([])],
      custMapping: [this.fb.array([])],
      planGroupMapping: [this.fb.array([])],
      leadCustMapping: [this.fb.array([])]
    });

    this.planGroupFromArray = this.fb.array([]);
    this.custGroupFromArray = this.fb.array([]);
    this.leadGroupFromArray = this.fb.array([]);
    this.PlanGroupfromgroup = this.fb.group({
      normalPlanGroupId: ["", Validators.required],
      specialPlanGroupId: ["", Validators.required]
    });
    this.PlanCustfromgroup = this.fb.group({
      customerId: ["", Validators.required],
      specialCustPlanGroupId: ["", Validators.required]
    });
    this.planLeadGroupfromgroup = this.fb.group({
      leadCustId: ["", Validators.required],
      specialPlanLeadGroupId: ["", Validators.required]
    });
    this.planCategoryForm = this.fb.group({
      planCategory: ["", Validators.required]
    });

    this.commondropdownService.findAllplanGroups();
    this.commondropdownService.findAllSepicalplanGroups();
    this.commondropdownService.findAllNormalplanGroups();
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
      sortOrder: 0,
      sortBy: "id"
    };
    this.assignPlanForm = this.fb.group({
      remark: [""]
    });
  }

  clearSearchSpecialPlanMapping() {
    this.searchSpecialPlanMappingName = "";
    this.getMappingDataList("");
  }

  closeModalForApproveCustomer() {
    this.approveCustomerModal = false;
  }
  searchSpecialPlanMapping() {
    this.planMappingData = [];
    if (!this.searchkey || this.searchkey !== this.searchSpecialPlanMappingName) {
      this.currentPagePlanMappingListdata = 1;
    }
    this.searchkey = this.searchSpecialPlanMappingName;
    if (this.showItemPerPage == 0) {
      this.planMappingListdataitemsPerPage = this.pageITEM;
    } else {
      this.planMappingListdataitemsPerPage = this.showItemPerPage;
    }
    let name = this.searchSpecialPlanMappingName ? this.searchSpecialPlanMappingName.trim() : "";
    if (name == "") {
    }
    const url = `/custspecialplanmappingrel/byname?customPageSize=${this.planMappingListdataitemsPerPage}&name=${name}&pageNumber=${this.currentPagePlanMappingListdata}&sortOrder=1`;

    this.mappingService.postMethod(url, name).subscribe(
      (response: any) => {
        this.planMappingData = response.customerSpecialPlanRelMappingList;
        if (this.showItemPerPage > this.planMappingListdataitemsPerPage) {
          this.planMappingListdatatotalRecords = this.planMappingData.length % this.showItemPerPage;
        } else {
          this.planMappingListdatatotalRecords =
            this.planMappingData.length % this.planMappingListdataitemsPerPage;
        }

        if (this.planMappingData.length == 0) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Records Found!",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.planMappingListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.planMappingData = [];
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
  // dataList: any = [];
  // getCustomerList() {
  //   const url = "/customers/getActiveCustomersList";

  //   this.planManagementService.getMethod(url).subscribe(
  //     (response: any) => {
  //       this.dataList = response.dataList;
  //       this.customerData = response.dataList;
  //
  //     },
  //     (error: any) => {
  //       console.log(error, "error");
  //
  //     }
  //   );
  // }
  getSpecialPlan() {
    const specialPlanurl =
      "/postpaidplan/all?type=SPECIAL&mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(specialPlanurl).subscribe(
      (response: any) => {
        let data = response.postpaidplanList;
        this.specialPlan = data.filter(element => element.planGroup != "Registration");
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

  getNormalPlan() {
    const normalPlanurl = "/postpaidplan/all?type=NORMAL&mvnoId=" + localStorage.getItem("mvnoId");
    this.planManagementService.getMethod(normalPlanurl).subscribe(
      (response: any) => {
        this.normalPlan = response.postpaidplanList;
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

  createMapping() {
    this.searchView = false;
    this.createView = true;
    this.mappingDeatilsShow = false;

    this.submitted = false;
    this.isPlanMappingEdit = false;

    this.ifIndividualPlan = false;
    this.ifPlanGroup = false;

    this.planMappingGroupForm.reset();
    this.planMapping = this.fb.array([]);
    this.customerMapping = this.fb.array([]);
    this.leadMapping = this.fb.array([]);
    this.planGroupFromArray = this.fb.array([]);
    this.custGroupFromArray = this.fb.array([]);
    this.leadGroupFromArray = this.fb.array([]);
    this.planGroupFromArray.controls = [];
    this.leadGroupFromArray.controls = [];
    this.planCategoryForm.reset();
  }

  listMapping() {
    this.searchView = true;
    this.createView = false;
    this.mappingDeatilsShow = true;
  }

  serviceBasePlanDATA(e) {
    this.selServiceId = e.value;
    this.specialPlanDD = this.specialPlan.filter(element => element.serviceId === e.value);
  }
  serviceBasePlanDATA1(e) {
    this.specialPlanDD1 = this.specialPlan.filter(element => element.serviceId === e.value);
  }
  serviceBasePlanLead(e) {
    this.specialPlanLead = this.specialPlan.filter(element => element.serviceId === e.value);
  }
  specialPlanBasePlanDATA(e) {
    let planType;
    this.normalPlanDD = [];
    this.specialPlanDD.forEach(element => {
      if (element.id == e.value) planType = element.plantype;
    });
    this.specialPlanDD.forEach(element => {
      if (element.id == e.value) {
        element.serviceAreaNameList.forEach(s => {
          if (s.id) {
            let url = `/plans/serviceArea?serviceAreaId=${s.id}&planmode=NORMAL&mvnoId=${localStorage.getItem("mvnoId")}`;
            this.mappingService.getMethod(url).subscribe((response: any) => {
              this.normalPlanDD = [
                ...this.normalPlanDD,
                ...response.postpaidplanList.filter(
                  e =>
                    e.status == "Active" &&
                    e.plantype == planType &&
                    e.serviceId == this.selServiceId
                )
              ];
              var uniqueNames = [];
              for (const item of this.normalPlanDD) {
                const found = uniqueNames.some(value => isEqual(value, item));
                if (!found) {
                  uniqueNames.push(item);
                }
              }
              this.normalPlanDD = uniqueNames;
            });
          } else {
            let url = `/plans/serviceArea?serviceAreaId=${s}&planmode=NORMAL`;
            this.mappingService.getMethod(url).subscribe((response: any) => {
              this.normalPlanDD = [
                ...this.normalPlanDD,
                ...response.postpaidplanList.filter(
                  e => e.status == "Active" && e.plantype == planType
                )
              ];
              var uniqueNames = [];
              for (const item of this.normalPlanDD) {
                const found = uniqueNames.some(value => isEqual(value, item));
                if (!found) {
                  uniqueNames.push(item);
                }
              }
              this.normalPlanDD = uniqueNames;
            });
          }
        });
      }
    });
  }
  specialPlanBasecustDATA(e) {
    this.customerMappingPlanType;
    this.specialPlanDD1.forEach(element => {
      if (element.id == e.value) {
        this.customerMappingPlanType = element.plantype;
      }
    });
    // this.specialPlanDD1.forEach(element => {
    //   if (element.id == e.value) {
    //     this.customerDD = [];
    //     element.serviceAreaNameList.forEach(s => {
    //       if (s.id) {
    //         let data = {
    //           filterBy: s.id,
    //           page: 1,
    //           pageSize: 5,
    //           sortBy: s.id,
    //           sortOrder: 0,
    //         };
    //         let url = `/customers/serviceArea/${s.id}`;
    //         //
    //         this.mappingService.postMethod(url, data).subscribe((response: any) => {
    //           this.customerDD = [
    //             ...this.customerDD,
    //             ...response.customerList.filter(
    //               e => e.status == "Active" && e.custtype == planType
    //             ),
    //           ];
    //           setTimeout(() => {}, 300);
    //         });
    //       } else {
    //         let url = `/customers/serviceArea/${s}`;
    //         this.mappingService.getMethod(url).subscribe((response: any) => {
    //           this.customerDD = [
    //             ...this.customerDD,
    //             ...response.customerList.filter(
    //               e => e.status == "Active" && e.custtype == planType
    //             ),
    //           ];
    //           setTimeout(() => {}, 300);
    //         });
    //       }
    //     });
    //   }
    // });
  }

  createplanGroupFormGroup(): FormGroup {
    return this.fb.group({
      normalPlanGroupId: [this.PlanGroupfromgroup.value.normalPlanGroupId],
      specialPlanGroupId: [this.PlanGroupfromgroup.value.specialPlanGroupId]
    });
  }

  onAddplanGroupField() {
    this.planGroupSubmitted = true;
    if (this.PlanGroupfromgroup.valid) {
      this.planGroupFromArray.push(this.createplanGroupFormGroup());
      this.PlanGroupfromgroup.reset();
      this.planGroupSubmitted = false;
    } else {
    }
  }

  onAddPlanAttribute() {
    this.plansubmitted = true;
    if (this.normalPlanId && this.normalPlanId.length > 0 && this.specialPlanId) {
      this.normalPlanId.forEach(element => {
        this.planMapping.push(this.createPlanAttributeFormGroup(element));
      });

      this.normalPlanId = null;
      this.specialPlanId = null;
      this.serviceValue = null;
      this.plansubmitted = false;
    }
  }

  createPlanAttributeFormGroup(id: number): FormGroup {
    return this.fb.group({
      normalPlanId: [id],
      specialPlanId: [this.specialPlanId]
    });
  }

  onAddCustomerAttribute() {
    this.custsubmitted = true;
    if (this.custSpecialPlanId && this.customerid) {
      this.customerMapping.push(this.createCustomerAttributeFormGroup(this.customerid));

      this.customerid = null;
      this.custSpecialPlanId = null;
      this.custServiceValue = null;
      this.custsubmitted = false;
    }
  }

  onAddLeadAttribute() {
    this.leadsubmitted = true;

    var lead = [];
    if (this.selectedLead instanceof Array) {
      lead = this.selectedLead;
    } else {
      lead.push(this.selectedLead);
    }

    if (this.leadSpecialPlanId && lead.length > 0) {
      this.leadMapping.push(this.createLeadAttributeFormGroup(lead[0].id));
      this.leadServiceValue = null;
      this.leadSpecialPlanId = null;
      this.leadId = [];
      this.selectedLead = [];
      this.leadsubmitted = false;
    }
  }

  createCustomerAttributeFormGroup(id): FormGroup {
    return this.fb.group({
      customerId: [id],
      specialPlanId: [this.custSpecialPlanId]
    });
  }

  createLeadAttributeFormGroup(id): FormGroup {
    return this.fb.group({
      leadCustId: [id],
      specialPlanId: [this.leadSpecialPlanId]
    });
  }

  deletePlanConfirmAttribute(attributeIndex: number) {
    this.planMapping.removeAt(attributeIndex);
  }

  deleteCustomerConfirmAttribute(attributeIndex: number) {
    this.customerMapping.removeAt(attributeIndex);
  }

  deleteLeadConfirmAttribute(attributeIndex: number) {
    this.leadMapping.removeAt(attributeIndex);
  }

  getMappingDataList(size) {
    let page_list;
    if (size) {
      page_list = size;
      this.planMappingListdataitemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.planMappingListdataitemsPerPage = this.pageITEM;
      } else {
        this.planMappingListdataitemsPerPage = this.showItemPerPage;
      }
    }

    const url = `/custspecialplanrelmapping/pagination?customPageSize=${this.planMappingListdataitemsPerPage}&pageNumber=${this.currentPagePlanMappingListdata}&sortOrder=1`;
    this.mappingService.postMethod(url, "").subscribe(
      (response: any) => {
        this.planMappingData = response.customerSpecialPlanMappingList;
        this.planMappingListdatatotalRecords = response.pageDetails.totalRecords;
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

  addEdit(id) {
    this.submitted = true;
    if (this.ifPlanGroup) {
      this.planMappingGroupForm.patchValue({
        custMapping: this.custGroupFromArray.value,
        planGroupMapping: this.planGroupFromArray.value,
        planMapping: [],
        leadCustMapping: this.leadGroupFromArray.value
      });
    } else {
      this.planMappingGroupForm.patchValue({
        planMapping: this.planMapping.value,
        planGroupMapping: [],
        custMapping: this.customerMapping.value,
        leadCustMapping: this.leadMapping.value
      });
    }
    if (
      this.planMappingGroupForm.value.planMapping.length === 0 &&
      this.planMappingGroupForm.value.planGroupMapping.length === 0 &&
      this.planMappingGroupForm.value.custMapping.length === 0 &&
      this.planMappingGroupForm.value.leadCustMapping.length === 0
    ) {
      this.messageService.add({
        severity: "error",
        summary: "Required ",
        detail: "Atleast one mapping should be added",
        icon: "far fa-times-circle"
      });
      return;
    }

    if (this.planMappingGroupForm.valid) {
      if (id) {
        const url = "/custspecialplanmapping";
        let d = {
          id: id
        };
        let data = Object.assign(this.planMappingGroupForm.value, d);
        this.mappingService.updateMethod(url, data).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.submitted = false;
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.searchView = true;
              this.createView = false;
              this.mappingDeatilsShow = true;
              this.planMappingGroupForm.reset();
              this.planMapping = this.fb.array([]);
              this.leadMapping = this.fb.array([]);
              this.customerMapping = this.fb.array([]);
              this.planGroupFromArray = this.fb.array([]);
              this.custGroupFromArray = this.fb.array([]);
              this.leadGroupFromArray = this.fb.array([]);
              this.leadId = [];
              this.selectedLead = [];
              this.selectedLeadList = [];
              this.selectedParentCust = [];
              this.parentCustList = [];
              this.customerid = [];
              this.specialPlanGroupId = null;
              this.custGroupId = null;
              this.isPlanMappingEdit = false;
              this.ifIndividualPlan = false;
              this.ifPlanGroup = false;

              this.planCategoryForm.reset();
              this.planGroupFromArray.controls = [];
              this.getMappingDataList("");
            }
          },
          (error: any) => {
            if (error.error.status == 417) {
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
        const url = "/custspecialplanmapping";

        this.mappingService.postMethod(url, this.planMappingGroupForm.value).subscribe(
          (response: any) => {
            this.submitted = false;
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.searchView = true;
            this.createView = false;
            this.mappingDeatilsShow = true;
            this.ifIndividualPlan = false;
            this.ifPlanGroup = false;
            this.planMappingGroupForm.reset();
            this.planMapping = this.fb.array([]);
            this.leadMapping = this.fb.array([]);
            this.customerMapping = this.fb.array([]);
            this.planGroupFromArray = this.fb.array([]);
            this.custGroupFromArray = this.fb.array([]);
            this.leadGroupFromArray = this.fb.array([]);
            this.leadId = [];
            this.selectedLead = [];
            this.selectedLeadList = [];
            this.selectedParentCust = [];
            this.parentCustList = [];
            this.customerid = [];
            this.specialPlanGroupId = null;
            this.custGroupId = null;
            this.planGroupFromArray.controls = [];
            this.getMappingDataList("");
            this.planCategoryForm.reset();
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

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagePlanMappingListdata > 1) {
      this.currentPagePlanMappingListdata = 1;
    }
    if (!this.searchkey) {
      this.getMappingDataList(this.showItemPerPage);
    }
  }

  canExit() {
    if (!this.planMappingGroupForm.dirty) return true;
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
  deleteConfirmon(id) {
    if (id) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Mapping?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.delete(id);
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

  delete(id) {
    const url = `/custspecialplanrelmapping/${id}`;
    this.mappingService.deleteMethod(url).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        this.getMappingDataList("");
      },
      (error: any) => {
        if (error.error.status == 417) {
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

  editmapping(id) {
    this.searchView = false;
    this.createView = true;
    this.mappingDeatilsShow = false;
    this.planMapping = this.fb.array([]);
    this.leadMapping = this.fb.array([]);
    this.customerMapping = this.fb.array([]);
    this.planGroupFromArray = this.fb.array([]);
    this.custGroupFromArray = this.fb.array([]);
    this.planCategoryForm.reset();
    this.planGrouplength = 0;
    if (this.planGroupFromArray.controls) {
      this.planGroupFromArray.controls = [];
    }
    const url = "/custspecialplanrelmapping/" + id;
    this.mappingService.getMethod(url).subscribe(
      (response: any) => {
        this.isPlanMappingEdit = true;
        this.viewPlanMappingData = response.mapping;

        this.planMappingGroupForm.patchValue(this.viewPlanMappingData);
        let planMap = this.viewPlanMappingData.planMapping;
        let custMap = this.viewPlanMappingData.custMapping;
        let leadMap = this.viewPlanMappingData.leadCustMapping;

        if (this.viewPlanMappingData.planGroupMapping) {
          this.ifIndividualPlan = false;
          this.ifPlanGroup = true;

          this.planCategoryForm.patchValue({
            planCategory: "groupPlan"
          });
          this.viewPlanMappingData.planGroupMapping.forEach(element => {
            this.planGroupFromArray.push(
              this.fb.group({
                normalPlanGroupId: [element.normalPlanGroupId],
                specialPlanGroupId: [element.specialPlanGroupId]
              })
            );
          });
          if (custMap) {
            custMap.forEach(e => {
              this.custGroupFromArray.push(
                this.fb.group({
                  customerId: [e.customerId],
                  specialPlanGroupId: [e.specialPlanGroupId]
                })
              );
            });
          }
          if (leadMap) {
            leadMap.forEach(e => {
              this.leadGroupFromArray.push(
                this.fb.group({
                  leadCustId: [e.leadCustId],
                  specialPlanGroupId: [e.specialPlanGroupId]
                })
              );
            });
          }
        } else {
          this.ifIndividualPlan = true;
          this.ifPlanGroup = false;

          this.planCategoryForm.patchValue({
            planCategory: "individual"
          });

          if (planMap) {
            planMap.forEach(e => {
              this.planMapping.push(
                this.fb.group({
                  normalPlanId: [e.normalPlanId],
                  specialPlanId: [e.specialPlanId]
                })
              );
            });
          }
        }

        if (custMap?.length > 0) {
          custMap.forEach(e => {
            this.parentCustList.push({
              id: Number(e.customerId),
              name: e.customerName
            });
            this.customerMapping.push(
              this.fb.group({
                customerId: [e.customerId],
                specialPlanId: [e.specialPlanId]
              })
            );
          });
        }

        if (leadMap.length > 0) {
          leadMap.forEach(e => {
            // this.selectedLead = this.leadList.find(lead => lead.id === e.leadCustId);
            this.selectedLeadList.push({
              id: Number(e.leadCustId),
              name: e.leadCustName
            });
            this.leadMapping.push(
              this.fb.group({
                leadCustId: [e.leadCustId],
                specialPlanId: [e.specialPlanId]
              })
            );
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

  pageChangedPlanMappingList(pageNumber) {
    this.currentPagePlanMappingListdata = pageNumber;
    this.getMappingDataList("");
  }

  pageChangedpayMapping(pageNumber) {
    this.currentPagePayMapping = pageNumber;
  }
  pageChangedpayMappingc(pageNumber) {
    this.currentPagePayMappingc = pageNumber;
  }

  planSelectType(event) {
    let planaddDetailType = event.value;

    if (planaddDetailType == "individual") {
      this.ifIndividualPlan = true;
      this.ifPlanGroup = false;
      this.planMapping = this.fb.array([]);
    } else if (planaddDetailType == "groupPlan") {
      this.ifIndividualPlan = false;
      this.ifPlanGroup = true;
      this.planMappingGroupForm.patchValue({
        planGroupId: ""
      });
    } else {
      this.ifIndividualPlan = false;
      this.ifPlanGroup = false;
    }
  }

  deleteConfirmonplanField(index: number) {
    if (index || index == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this charge?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemovePlANGroup(index);
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
  customerGroupDD = [];
  custGroupId: any;
  leadGroupId: any;
  custGroupSubmitted: boolean = false;
  leadGroupSubmitted: boolean = false;
  deleteCustomerGroupConfirmAttribute(i) {
    this.custGroupFromArray.removeAt(i);
  }

  deleteLeadGroupConfirmAttribute(i) {
    this.leadGroupFromArray.removeAt(i);
  }

  createCustomerGroupAttributeFormGroup(): FormGroup {
    return this.fb.group({
      customerId: [this.PlanCustfromgroup.value.customerId],
      specialCustPlanGroupId: [this.PlanCustfromgroup.value.specialCustPlanGroupId]
    });
  }
  createLeadGroupAttributeFormGroup(): FormGroup {
    return this.fb.group({
      leadCustId: [this.planLeadGroupfromgroup.value.leadCustId],
      specialPlanGroupId: [this.planLeadGroupfromgroup.value.specialPlanLeadGroupId]
    });
  }
  onAddCustomerGroupAttribute() {
    this.custGroupSubmitted = true;
    if (this.PlanCustfromgroup.valid) {
      this.custGroupFromArray.push(this.createCustomerGroupAttributeFormGroup());
      this.PlanCustfromgroup.reset();
      this.custGroupSubmitted = false;
    } else {
    }

    setTimeout(() => {
      this.customerid = null;
      this.specialPlanGroupId = null;
      this.custsubmitted = false;
    }, 1000);
  }

  onAddLeadGroupAttribute() {
    this.leadGroupSubmitted = true;
    if (this.planLeadGroupfromgroup.valid) {
      this.leadGroupFromArray.push(this.createLeadGroupAttributeFormGroup());
      this.planLeadGroupfromgroup.reset();
      this.leadGroupSubmitted = false;
    } else {
    }

    setTimeout(() => {
      this.leadId = [];
      this.specialPlanLeadGroupId = null;
      this.leadGroupSubmitted = false;
    }, 1000);
  }

  spacialPlanGroupChange() {
    let service_ID: any;
    let planType: any;

    this.commondropdownService.SpecialPlanGroupDetails.forEach(element => {
      if (element.planGroupId == this.specialPlanGroupId) {
        if (element.servicearea.id) {
          service_ID = element.servicearea.id;
        } else {
          service_ID = element.servicearea;
        }

        planType = element.plantype;
      }
    });

    let url = `/customers/serviceArea/${service_ID}`;
    //this.spinner.show();
    this.mappingService.getMethod(url).subscribe((response: any) => {
      this.customerGroupDD = response.customerList.filter(
        e => e.status == "Active" && e.custtype == planType
      );
    });
  }
  async onRemovePlANGroup(index: number) {
    this.planGroupFromArray.removeAt(index);
  }
  pageplanGroupCharge(page) {
    this.currentPageplanGroup = page;
  }

  opencustomerSelectModal(id, custdata) {
    this.PaymentamountService.show(id);
    this.custdata.next({
      custdata
    });
  }

  SelectcustomerData(e) {
    if (this.ifIndividualPlan) {
      this.custId = e;
    } else if (this.ifPlanGroup) {
      this.custGroupId = e;
    }
  }

  // currentPageCustomerListdata = 1;
  // CustomerListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  // CustomerListdatatotalRecords: number;
  // newFirst: any;

  // getCustomerListData() {
  //
  //   let currentPage;
  //   currentPage = this.currentPageCustomerListdata;
  //   const data = {
  //     page: currentPage,
  //     pageSize: this.CustomerListdataitemsPerPage,
  //   };
  //   const url = "/customers/list";
  //   this.customerManagementService.postMethod(url, data).subscribe(
  //     (response: any) => {
  //       this.customeListData = response.customerList;
  //       this.CustomerListdatatotalRecords = response.pageDetails.totalRecords;
  //       this.newFirst = 1;
  //
  //       console.log("customerList", this.customeListData);
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

  // customer dropdown

  getParentCustomerData() {
    //this.spinner.show();
    let currentPage;
    currentPage = this.currentPageParentCustomerListdata;
    const data = {
      page: currentPage,
      pageSize: this.parentCustomerListdataitemsPerPage
    };
    // let type = this.customerMappingPlanType
    //   ? this.customerMappingPlanType
    //   : RadiusConstants.CUSTOMER_TYPE.PREPAID + "?orgcusttype=false";
    // const url = `/customers/list/${type}`;
    const url = "/parentCustomers/list/Both?mvnoId=" + localStorage.getItem("mvnoId");
    this.searchPaymentService.postMethod(url, data).subscribe(
      (response: any) => {
        this.customerList = response.parentCustomerList;
        this.parentCustomerListdatatotalRecords = response.pageDetails.totalRecords;
        this.newFirst = 1;
        //this.spinner.hide();
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

  getLeadList() {
    // this.myFinalCheck = false;
    this.searchkey = "";

    const data = {
      page: this.currentPageLeadListdata,
      pageSize: this.parentLeadListdataitemsPerPage,
      sortBy: "id",
      sortOder: 0
    };
    const url = "/getAllLead";

    this.customerManagementService.postMethod(url, data).subscribe(
      async (response: any) => {
        // await response?.leadMasterList?.content.forEach((leadItem: any) =>
        //   Number(leadItem.createdBy)
        // );

        this.leadList = await response?.dataList;

        this.parentLeadListdatatotalRecords = await response?.totalRecords;

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
  selectParentCustomer: boolean = false;

  async modalOpenParentCustomer() {
    this.selectParentCustomer = true;
    await this.getParentCustomerData();
    this.newFirst = 1;
    this.selectedParentCust = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  async modalOpenLeadCustomer() {
    this.selectLeadModal = true;
    // $("#selectLead").modal("show");
    await this.getLeadList();
    this.newFirst = 1;
    this.selectedLead = [];
    //  console.log("this.newFirst2", this.newFirst)
  }

  closeModalLead() {
    this.selectLeadModal = false;
  }

  // async modalOpenParentCustomerForGroupPlan() {
  //   $("#selectParentCustomer").modal("show");
  //   await this.getParentCustomerData();
  //   this.newFirst = 1;
  //   this.selectedParentCust = [];
  //   //  console.log("this.newFirst2", this.newFirst)
  // }

  modalCloseParentCustomer() {
    this.selectParentCustomer = false;
    this.currentPageParentCustomerListdata = 1;
    this.newFirst = 0;
    this.searchParentCustValue = "";
    this.searchParentCustOption = "";
    this.parentFieldEnable = false;
    this.customerList = [];
    // console.log("this.newFirst1", this.newFirst)
  }

  modalCloseLeadCustomer() {
    this.selectLeadModal = false;
    this.currentPageLeadListdata = 1;
    this.newFirst = 0;
    this.searchLeadValue = "";
    this.searchLeadOption = "";
    this.leadFieldEnable = false;
    this.leadList = [];
    // console.log("this.newFirst1", this.newFirst)
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

  paginateLead(event) {
    this.currentPageLeadListdata = event.page + 1;
    // this.first = event.first;
    if (this.searchLeadValue) {
      this.searchLead();
    } else {
      this.getLeadList();
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

    const url = "/customers/search/Prepaid?mvnoId=" + localStorage.getItem("mvnoId");
    // console.log("this.searchData", this.searchData)
    this.searchPaymentService.postMethod(url, searchParentData).subscribe(
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

  selLeadSearchOption(event) {
    // console.log("value", event.value);
    if (event.value) {
      this.leadFieldEnable = true;
    } else {
      this.leadFieldEnable = false;
    }
  }

  async saveSelCustomer(isPlanGroup: any) {
    // if(!isPlanGroup){
    this.parentCustList.push({
      id: Number(this.selectedParentCust.id),
      name: this.selectedParentCust.name
    });

    this.customerid = Number(this.selectedParentCust.id);
    this.PlanCustfromgroup.patchValue({ customerId: this.selectedParentCust.id });
    // } else {
    // this.customerList.push({
    //   id: Number(this.selectedParentCust.id),
    //   name: this.selectedParentCust.name,
    // });
    this.custGroupId = [];
    this.custGroupId.push(Number(this.selectedParentCust.id));
    // }
    this.modalCloseParentCustomer();
  }

  async saveLeadCustomer(isPlanGroup: any) {
    // if(!isPlanGroup){
    this.selectedLeadList.push({
      id: Number(this.selectedLead.id),
      name: this.selectedLead.firstname + " " + this.selectedLead.lastname
    });
    this.leadId = Number(this.selectedLead.id);
    this.leadID = Number(this.selectedLead);
    //this.leadIds = Number(this.selectedLead.id);
    this.planLeadGroupfromgroup.patchValue({ leadCustId: this.selectedLead.id });

    // } else {
    // this.customerList.push({
    //   id: Number(this.selectedParentCust.id),
    //   name: this.selectedParentCust.name,
    // });
    this.leadGroupId = [];
    this.leadGroupId.push(Number(this.selectedLead.id));
    // }
    this.modalCloseLeadCustomer();
  }

  approvestatusSPMModalOpen(data) {
    this.ifApproveSPMStatus = true;
    this.apprRejectSPMData = data;
    this.approveRejectSPMRemark = "";
    this.ApproveRejectModal = true;
  }

  closeModalApproveReject() {
    this.ApproveRejectModal = false;
  }
  ApproveRejectModal: boolean = false;
  rejectstatusSPMModalOpen(data) {
    this.ifApproveSPMStatus = false;
    this.apprRejectSPMData = data;
    this.approveRejectSPMRemark = "";
    this.ApproveRejectModal = true;
  }

  assignCustomerDocumentForApproval: boolean = false;
  statusApporevedRejectedSPM() {
    const url1 = "/custspecialplanrelmapping/" + this.apprRejectSPMData.id;
    this.mappingService.getMethod(url1).subscribe((response: any) => {
      this.ApproveRejectModal = false;
      this.viewPlanMappingData = response.mapping;
    });
    setTimeout(() => {
      let mappingData;
      if (this.viewPlanMappingData.planGroupMapping) {
        this.viewPlanMappingData.planGroupMapping.map(e => {
          e.nextStaff = this.apprRejectSPMData.nextStaff;
        });
        mappingData = {
          id: this.apprRejectSPMData.id,
          name: this.apprRejectSPMData.name,
          mvnoIdSPM: this.mvnoIdSPM,
          planGroupMapping: this.viewPlanMappingData.planGroupMapping,
          status: this.apprRejectSPMData.status,
          flag: this.ifApproveSPMStatus ? "approved" : "rejected",
          remarks: this.approveRejectSPMRemark,
          nextStaff: this.apprRejectSPMData.nextStaff,
          nextTeamHierarchyMapping: this.apprRejectSPMData.nextTeamHierarchyMapping
        };
      } else {
        // this.viewPlanMappingData.planMapping.map(e => {
        //   e.nextStaff = this.apprRejectSPMData.nextStaff;
        // });
        mappingData = {
          id: this.apprRejectSPMData.id,
          name: this.apprRejectSPMData.name,
          mvnoIdSPM: this.mvnoIdSPM,
          planMapping: this.viewPlanMappingData.planMapping,
          status: this.apprRejectSPMData.status,
          flag: this.ifApproveSPMStatus ? "approved" : "rejected",
          remarks: this.approveRejectSPMRemark,
          nextStaff: this.apprRejectSPMData.nextStaff,
          nextTeamHierarchyMapping: this.apprRejectSPMData.nextTeamHierarchyMapping
        };
      }
      const url = `/approveSpecialPlan`;
      this.searchPaymentService.updateMethod(url, mappingData).subscribe(
        (response: any) => {
          if (response.result.dataList != null && response.result.dataList.length > 0) {
            this.assignStaffListDataSPM = response.result.dataList;
            $("#ApproveRejectModal").modal("hide");
            this.assignCustomerDocumentForApproval = true;
          } else {
            $("#ApproveRejectModal").modal("hide");
            if (this.ifApproveSPMStatus) {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Approved Successfully.",
                icon: "far fa-times-circle"
              });
            } else {
              this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: "Rejected Successfully.",
                icon: "far fa-times-circle"
              });
            }
            this.getMappingDataList("");
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
    }, 1000);
  }
  assignToStaffSPMapping() {
    let url = "";
    if (this.assignedStaffSPM) {
      url = `/teamHierarchy/assignFromStaffList?entityId=${this.apprRejectSPMData.id}&eventName=SPECIAL_PLAN_MAPPING&nextAssignStaff=${this.assignedStaffSPM}&isApproveRequest=${this.ifApproveSPMStatus}`;
    } else {
      url = `/teamHierarchy/assignEveryStaff?entityId=${
        this.apprRejectSPMData.id
      }&eventName=${"SPECIAL_PLAN_MAPPING"}&isApproveRequest=${this.ifApproveSPMStatus}`;
    }
    this.searchPaymentService.getMethod(url).subscribe(
      response => {
        this.assignCustomerDocumentForApproval = false;
        if (this.ifApproveSPMStatus) {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Approved Successfully.",
            icon: "far fa-times-circle"
          });
        } else {
          this.messageService.add({
            severity: "success",
            summary: "Success",
            detail: "Rejected Successfully.",
            icon: "far fa-times-circle"
          });
        }
        this.getMappingDataList("");
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

  closeModalApproval() {
    this.assignCustomerDocumentForApproval = false;
  }
  pickModalOpen(data) {
    let url = "/workflow/pickupworkflow?eventName=SPECIAL_PLAN_MAPPING&entityId=" + data.id;
    this.searchPaymentService.getMethod(url).subscribe(
      (response: any) => {
        this.getMappingDataList("");

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

  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  openPaymentWorkFlow(id, auditcustid) {
    this.ifModelIsShow = true;
    this.PaymentamountService.show(id);
    this.auditcustid.next({
      auditcustid: auditcustid,
      checkHierachy: "SPECIAL_PLAN_MAPPING",
      planId: ""
    });
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
  }

  selSearchOption(event) {
    this.searchDeatilLead = "";
    this.searchLeadValue = event;
    if (event) {
      this.leadFieldEnable = true;
    } else {
      this.leadFieldEnable = false;
    }
  }

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

  clearSearchLead() {
    this.searchDeatil = "";
    this.searchLeadValue = "";
    this.searchLeadOption = "name";
    this.leadFieldEnable = false;
    this.currentPageLeadListdata = 1;
    this.getLeadList();
  }

  searchLead() {
    if (this.searchLeadOption === "lastUpdateOn") {
      this.searchDeatilLead = this.datePipe.transform(this.searchDeatilLead, "yyyy-MM-dd");
    }

    // if (!this.searchDeatilLead) {
    //   this.getLeadList();
    //   this.clearSearchLead();
    //
    // } else {
    if (
      !this.searchkeyLead ||
      this.searchkeyLead !== this.searchDeatilLead ||
      !this.searchkeyLead2 ||
      this.searchkeyLead2 !== this.searchLeadValue.trim()
    ) {
      this.currentPageLeadListdata = 1;
    }
    this.searchkeyLead = this.searchDeatilLead;
    this.searchkeyLead2 = this.searchLeadValue.trim();
    // if (this.showItemPerPage !== 1) {
    //   this.parentLeadListdataitemsPerPage = this.showItemPerPage;
    // }
    this.searchData.filters[0].filterValue = this.searchDeatil;
    this.searchData.filters[0].filterColumn = this.searchLeadOption.trim();
    this.searchData.page = this.currentPageLeadListdata;
    this.searchData.pageSize = this.parentLeadListdataitemsPerPage;

    const url = "/getAllLead";
    this.customerManagementService.postMethod(url, this.searchData).subscribe(
      async (response: any) => {
        if (response.status === 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
            icon: "far fa-times-circle"
          });
          this.leadList = [];
        } else {
          await response.dataList.forEach(item =>
            item.leadStatus === "Converted" ? (item.assigneeName = null) : ""
          );

          this.leadList = await response?.dataList;

          this.parentLeadListdatatotalRecords = await response?.totalRecords;

          // if (this.showItemPerPage > this.leadListdataitemsPerPage) {
          //   this.leadListDatalength = this.leadListData?.length % this.showItemPerPage;
          // } else {
          //   this.leadListDatalength = this.leadListData?.length % this.leadListdataitemsPerPage;
          // }
        }
      },
      (error: any) => {
        this.parentLeadListdatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
          this.leadList = [];
        } else {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.error.ERROR,
            icon: "far fa-times-circle"
          });
          this.leadList = [];
        }
      }
    );

    // }
  }

  reassignWorkflow() {
    let url: any;
    this.remark = this.assignPlanForm.value.remark;
    if (this.apprRejectSPMData != null) {
      url = `/teamHierarchy/reassignWorkflow?entityId=${this.apprRejectSPMData.id}&eventName=SPECIAL_PLAN_MAPPING&assignToStaffId=${this.selectStaff}&remark=${this.remark}`;

      this.customerManagementService.getMethod(url).subscribe(
        (response: any) => {
          this.approveCustomerModal = false;
          this.getMappingDataList("");

          if (response.responseCode == 417) {
            this.messageService.add({
              severity: "info",
              summary: "Info",
              detail: response.responseMessage,
              icon: "far fa-times-circle"
            });
          } else {
            this.getMappingDataList("");
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

  StaffReasignList(id) {
    let url = `/teamHierarchy/reassignWorkflowGetStaffList?entityId=${id}&eventName=SPECIAL_PLAN_MAPPING`;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 417) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        }
        if (response.dataList != null) {
          this.assignStaffListDataSPM = response.dataList;
          this.approvrd = true;
          this.approveCustomerModal = true;
        } else {
          this.approveCustomerModal = false;
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

  closePlanDetailsDialog() {
    this.isPlanDetilsDialog = false;
    this.viewPlanMappingData = [];
  }

  closeAssignsDialog() {
    this.approveCustomerModal = false;
    this.viewPlanMappingData = [];
  }
  planDetail(planId) {
    this.getplanDetailById(planId);
  }

  getplanDetailById(planId) {
    this.viewPlanMappingData = [];
    this.isPlanDetilsDialog = true;
    const url = "/custspecialplanrelmapping/" + planId;
    this.mappingService.getMethod(url).subscribe(
      (response: any) => {
        this.viewPlanMappingData = response.mapping;
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

  onSpecialPlanChange(event: any) {
    const selectedSpecialPlanId = event.value;
    // Fetch normal plans based on the selected special plan
    this.commondropdownService.findAllNormalplanGroupsBySpecialPlan(selectedSpecialPlanId);
  }
}
