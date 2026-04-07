import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import { DunningrulesService } from "src/app/service/dunningrules.service";
import { Regex } from "src/app/constants/regex";
import { DunningManagement } from "src/app/components/model/dunning-managements";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import * as _ from "lodash";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Observable, Observer } from "rxjs";
import { error } from "console";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { DUNNINGS } from "src/app/constants/aclConstants";
@Component({
  selector: "app-dunning-rules",
  templateUrl: "./dunning-rules.component.html",
  styleUrls: ["./dunning-rules.component.css"]
})
export class DunningRulesComponent implements OnInit {
  dunningGroupForm: FormGroup;
  dunningCategoryList: any;
  submitted: boolean = false;
  isBranchAvailable = false;
  taxListData: any;
  createdunningData: DunningManagement;
  currentPagedunningListdata = 1;
  dunningListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  dunningListdatatotalRecords: number;
  dunningListData: any = [];
  viewdunningListData: any = [];
  searchDunningRule: any = "";
  searchData: any;
  isdunningEdit: boolean = false;
  dunningtype = "";
  dunningcategory = "";
  searchdunningUrl: any;

  serviceData: any;
  qosPolicyData: any;
  quotaData: any;
  quotaTypeData: any;
  chargeCategoryList: any;
  isPlanEdit: boolean = false;
  viewPlanListData: any;

  chargeFromArray: FormArray;
  chargeitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  chargetotalRecords: number;
  currentPageCharge = 1;
  selectvalue = "";
  CreditclassData = [{ value: "Gold" }, { value: "Silver" }, { value: "Platinum" }];

  temp = [];
  dunningListData1: any;
  dunningListDataselector: any;
  dunningRulelength = 0;

  dunningRulefromgroup: FormGroup;
  dunningSubmitted: boolean = false;

  dunningRuleItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  dunningRuletotalRecords: number;
  currentPagedunningRuleList = 1;
  createView: boolean = false;
  listView: boolean = true;

  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 1;
  searchkey: any = [];
  totalDataListLength = 0;

  dunningRoleAction = [
    { label: "Email", value: "Email" },
    { label: "SMS", value: "SMS" },
    { label: "DeActivation", value: "DeActivation" }
  ];
  customerTypes = [
    { label: "Postpaid", value: "Postpaid" },
    { label: "Prepaid", value: "Prepaid" }
  ];
  dunningApplyTypes = [
    { label: "Partner", value: "Partner" },
    { label: "Customer", value: "Customer" }
  ];

  selectSMSvalue = [
    { label: "Yes", value: "Y" },
    { label: "No", value: "N" }
  ];
  selectemail = [
    { label: "Yes", value: "Y" },
    { label: "No", value: "N" }
  ];

  statusOptions = RadiusConstants.status;

  detailView: boolean = false;
  DunningruleActionlistData: any = [];
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  dunningTypeList: any;
  isCustSubTypeCon: boolean = false;

  branchData = [];
  partnerListByServiceArea = [];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  isDunningForMvno: boolean = false;
  loggedInUserMvnoId: any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private dunningManagementService: DunningrulesService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    loginService: LoginService,
    public commondropdownService: CommondropdownService
  ) {
    this.createAccess = loginService.hasPermission(DUNNINGS.DUNNING_RULES_CREATE);
    this.deleteAccess = loginService.hasPermission(DUNNINGS.DUNNING_RULES_DELETE);
    this.editAccess = loginService.hasPermission(DUNNINGS.DUNNING_RULES_EDIT);
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.loggedInUserMvnoId = localStorage.getItem("mvnoId");

    if (this.loggedInUserMvnoId == 1) {
      this.dunningApplyTypes.push({ label: "Mvno", value: "Mvno" });
    }

    // this.isdunningEdit = !createAccess && editAccess ? true : false;
  }

  ngOnInit(): void {
    this.dunningGroupForm = this.fb.group({
      ccemail: ["", Validators.email],
      mobile: [""],
      creditclass: ["", Validators.required],
      delete: [""],
      id: [""],
      name: ["", Validators.required],
      status: ["", Validators.required],
      customerType: [""],
      dunningRuleActionPojoList: (this.chargeFromArray = this.fb.array([])),
      dunningType: ["", Validators.required],
      dunningFor: ["", Validators.required],
      dunningSubType: [""],
      dunningSector: [""],
      dunningSubSector: [""],
      customerPayType: ["", Validators.required],
      serviceAreaIds: ["", Validators.required],
      partnerIds: [""],
      branchIds: [""],
      isGeneratepaymentLink: [false]
    });
    this.dunningGroupForm.controls.dunningSubType.disable();
    this.dunningGroupForm.controls.dunningSubSector.disable();
    this.dunningRulefromgroup = this.fb.group({
      action: ["", Validators.required],
      days: ["", [Validators.required, Validators.pattern(Regex.numericWithNegative)]]
    });
    this.getdunningList("");
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
    window.scroll(0, 0);
    this.getDunningType();
    this.commondropdownService.getCustomerType();
    this.commondropdownService.getSectorType();
    const serviceArea = localStorage.getItem("serviceArea");
    let serviceAreaArray = JSON.parse(serviceArea);
    if (serviceAreaArray.length !== 0) {
      this.commondropdownService.filterserviceAreaList();
      // this.commondropdownService.filterPartnerAll();
    } else {
      this.commondropdownService.getserviceAreaList();
      // this.commondropdownService.getpartnerAll();
    }
    this.loggedInUserMvnoId = localStorage.getItem("mvnoId");
  }

  createDunning() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.dunningGroupForm.controls.dunningSubType.disable();
    this.dunningGroupForm.controls.dunningSubSector.disable();
    this.submitted = false;
    this.isdunningEdit = false;
    this.viewdunningListData = [];
    this.chargeFromArray.controls = [];
    this.customerFormReset();
  }

  selServiceArea(serAreaId) {
    if (serAreaId != null && serAreaId.length > 0) {
      this.getBranchByServiceAreaID(serAreaId);
      this.getPartnerAllByServiceArea(serAreaId);
    } else {
      this.branchData = [];
      this.partnerListByServiceArea = [];
      this.dunningGroupForm.controls.branchIds.reset();
      this.dunningGroupForm.controls.partnerIds.reset();
    }
  }
  getBranchByServiceAreaID(ids) {
    let data = [];

    // data.push(ids);
    let url =
      "/branchManagement/getAllBranchesByServiceAreaId?mvnoId=" + localStorage.getItem("mvnoId");
    this.adoptCommonBaseService.post(url, ids).subscribe(
      (response: any) => {
        this.branchData = response.dataList;
        if (this.isBranchAvailable && this.branchData != null && this.branchData.length > 0) {
          // this.isBranchAvailable = true;
          this.dunningGroupForm.controls.branchIds.setValidators(Validators.required);
        } else {
          // this.isBranchAvailable = false;
          this.dunningGroupForm.controls.branchIds.clearValidators();
          // this.getPartnerAllByServiceArea(ids);
        }
        this.dunningGroupForm.controls.branchIds.updateValueAndValidity();
      },
      error => {}
    );
  }

  getPartnerAllByServiceArea(serviceAreaId) {
    const url =
      "/getPartnerByServiceAreaIds/" + serviceAreaId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.commondropdownService.getMethod(url).subscribe(
      (response: any) => {
        this.partnerListByServiceArea = response.partnerList.filter(item => item.id != 1);
        if (
          !this.isBranchAvailable &&
          this.partnerListByServiceArea != null &&
          this.partnerListByServiceArea.length > 0
        ) {
          this.dunningGroupForm.controls.partnerIds.setValidators(Validators.required);
        } else {
          this.dunningGroupForm.controls.partnerIds.clearValidators();
        }
        this.dunningGroupForm.controls.partnerIds.updateValueAndValidity();
      },
      (error: any) => {}
    );
  }

  listDunning() {
    this.createView = false;
    this.listView = true;
    this.detailView = false;
  }

  dunningDeatils() {
    this.listView = false;
    this.createView = false;
    this.detailView = false;
  }

  selectActionChange(_event: any) {
    // this.commonservice.addLoader();

    this.selectvalue = _event.value;
  }
  createChargeFormGroup(): FormGroup {
    return this.fb.group({
      action: [this.dunningRulefromgroup.value.action],
      days: [this.dunningRulefromgroup.value.days],
      dunningRuleId: [""],
      id: [""]
    });
  }

  onAddChargeField() {
    this.dunningSubmitted = true;
    if (this.dunningRulefromgroup.valid) {
      this.chargeFromArray.push(this.createChargeFormGroup());
      this.dunningRulefromgroup.reset();
      this.dunningSubmitted = false;
    } else {
    }
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPagedunningListdata > 1) {
      this.currentPagedunningListdata = 1;
    }
    if (!this.searchkey) {
      this.getdunningList(this.showItemPerPage);
    } else {
      this.searchdunning();
    }
  }

  getdunningList(list) {
    let size;
    this.searchkey = "";
    let page_list = this.currentPagedunningListdata;
    if (list) {
      size = list;
      this.dunningListdataitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 1) {
      //   this.dunningListdataitemsPerPage = this.pageITEM
      // } else {
      //   this.dunningListdataitemsPerPage = this.showItemPerPage
      // }
      size = this.dunningListdataitemsPerPage;
    }
    this.dunningListData = [];
    let data = {
      page: page_list,
      pageSize: size
    };
    this.dunningManagementService.getDunningRuleList(data).subscribe(
      (response: any) => {
        this.dunningListData = response.dunningRuleList.content;
        this.dunningListDataselector = response.dunningRuleList.content;
        // console.log("dunningListData", this.dunningListData);
        this.dunningListdatatotalRecords = response.pageDetails.totalRecords;
        // if (this.showItemPerPage > this.dunningListdataitemsPerPage) {
        //   this.totalDataListLength =
        //     this.dunningListData.length % this.showItemPerPage
        // } else {
        //   this.totalDataListLength =
        //     this.dunningListData.length % this.dunningListdataitemsPerPage
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

  addEditdunning(dunningId) {
    this.submitted = true;

    if (this.dunningGroupForm.valid) {
      if (dunningId) {
        const url = "/dunningrule/" + dunningId;
        this.createdunningData = this.dunningGroupForm.value;
        this.createdunningData.delete = false;
        this.createdunningData.mvnoId = Number(localStorage.getItem("mvnoId"));
        this.dunningManagementService.updateMethod(url, this.createdunningData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.isDunningForMvno = false;
            this.customerFormReset();
            this.dunningGroupForm.controls.dunningSubType.disable();
            this.dunningGroupForm.controls.dunningSubSector.disable();
            this.branchData = [];
            this.partnerListByServiceArea = [];
            this.isdunningEdit = false;
            this.listView = true;
            this.viewdunningListData = [];
            this.chargeFromArray.controls = [];
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });
            this.createView = false;
            this.detailView = false;
            if (!this.searchkey) {
              this.getdunningList("");
            } else {
              this.searchdunning();
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
        const url = "/dunningrule";
        this.createdunningData = this.dunningGroupForm.value;
        this.createdunningData.delete = false;

        this.dunningManagementService.postMethod(url, this.createdunningData).subscribe(
          (response: any) => {
            this.submitted = false;
            this.chargeFromArray.controls = [];
            this.customerFormReset();
            this.isDunningForMvno = false;
            this.dunningGroupForm.controls.dunningSubType.disable();
            this.dunningGroupForm.controls.dunningSubSector.disable();
            this.messageService.add({
              severity: "success",
              summary: "Successfully",
              detail: response.message,
              icon: "far fa-check-circle"
            });

            this.listView = true;
            this.createView = false;
            this.detailView = false;
            if (!this.searchkey) {
              this.getdunningList("");
            } else {
              this.searchdunning();
            }
          },
          (error: any) => {
            if(error.status === 400 || error.error.status === 406){
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
      }
    }
  }

  editdunning(id: any) {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.dunningRulelength = 0;
    if (this.chargeFromArray.controls) {
      this.chargeFromArray.controls = [];
    }
    const url = "/dunningrule/" + id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.viewdunningListData = [];
    this.dunningManagementService.getMethod(url).subscribe(
      async (response: any) => {
        this.isdunningEdit = true;

        // this.dunningListData = response.dunningrulelist;
        var event = {
          value: response.dunningRuleListById.dunningFor
        };
        this.getDunningTypeFor(event);
        await this.getBranchByServiceAreaID(response.dunningRuleListById.serviceAreaIds);
        // await this.getPartnerAllByServiceArea(response.dunningRuleListById.serviceAreaIds);
        this.viewdunningListData = response.dunningRuleListById;
        this.dunningGroupForm.patchValue(this.viewdunningListData);
        while (this.dunningRulelength < this.viewdunningListData.dunningRuleActionPojoList.length) {
          // while () {

          this.dunningRulefromgroup.patchValue(
            this.viewdunningListData.dunningRuleActionPojoList[this.dunningRulelength]
          );
          this.onAddChargeField();
          this.chargeFromArray.patchValue(this.viewdunningListData.dunningRuleActionPojoList);
          // }
          this.dunningRulelength++;
        }

        if (this.viewdunningListData.customerType != null) {
          const data = {
            value: this.viewdunningListData.customerType
          };
          this.dunningGroupForm.controls.dunningSubType.enable();
          this.getCustSubType(data);
        } else {
          this.dunningGroupForm.controls.dunningSubType.disable();
        }

        if (this.viewdunningListData.dunningSector != null) {
          this.dunningGroupForm.controls.dunningSubSector.enable();
        } else {
          this.dunningGroupForm.controls.dunningSubSector.disable();
        }

        if (this.viewdunningListData?.dunningType) {
          let obj = {
            value: this.viewdunningListData?.dunningType
          };
          this.getDunningEvent(obj);
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

  deleteConfirmondunning(dunningId: number) {
    if (dunningId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this dunning?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deletedunning(dunningId);
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

  deletedunning(dunningId) {
    const url = "/dunningrule/" + dunningId + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.dunningManagementService.deleteMethod(url).subscribe(
      (response: any) => {
        if (this.currentPagedunningListdata != 1 && this.totalDataListLength == 1) {
          this.currentPagedunningListdata = this.currentPagedunningListdata - 1;
        }
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message,
          icon: "far fa-check-circle"
        });
        if (!this.searchkey) {
          this.getdunningList("");
        } else {
          this.searchdunning();
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

  pageChangeddunningList(pageNumber) {
    this.currentPagedunningListdata = pageNumber;
    if (!this.searchkey) {
      this.getdunningList("");
    } else {
      this.searchdunning();
    }
  }

  pageChangedCharge(pageNumber) {
    this.currentPageCharge = pageNumber;
  }

  deleteConfirmonChargeField(chargeFieldIndex: number, chargeFieldId: number) {
    if (chargeFieldIndex || chargeFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this action?",
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

  async onRemoveCharge(chargeFieldIndex: number, chargeFieldId: number) {
    this.chargeFromArray.removeAt(chargeFieldIndex);
  }

  // searchdunning() {
  //   if (!this.searchkey || this.searchkey !== this.temp) {
  //     this.currentPagedunningListdata = 1
  //   }

  //   if (this.showItemPerPage == 1) {
  //     this.dunningListdataitemsPerPage = this.pageITEM
  //   } else {
  //     this.dunningListdataitemsPerPage = this.showItemPerPage
  //   }

  //   const url = '/dunningrule'
  //   this.dunningManagementService.getMethod(url).subscribe((response: any) => {
  //     this.dunningListData1 = response.dunningrulelist
  //   })

  //   this.dunningGroupForm = this.dunningListData1
  //   this.temp = this.dunningListData1
  //   let valueobj = {}

  //   if (this.dunningcategory) {
  //     valueobj['name'] = this.dunningcategory
  //   }
  //   if (this.dunningtype) {
  //     valueobj['creditclass'] = this.dunningtype
  //   }

  //   let filterdata = _.filter(this.dunningGroupForm, valueobj)
  //   this.dunningListData = filterdata
  //   this.temp = filterdata

  //   this.searchkey = this.temp
  //   if (this.showItemPerPage > this.dunningListdataitemsPerPage) {
  //     this.totalDataListLength =
  //       this.dunningListData.length % this.showItemPerPage
  //   } else {
  //     this.totalDataListLength =
  //       this.dunningListData.length % this.dunningListdataitemsPerPage
  //   }
  // }

  searchdunning() {
    if (!this.searchkey || this.searchkey != this.searchDunningRule) {
      this.currentPagedunningListdata = 1;
    }
    this.searchkey = this.searchDunningRule;
    if (this.showItemPerPage) {
      this.dunningListdataitemsPerPage;
    }
    this.searchData.filters[0].filterValue = this.searchDunningRule;
    this.searchData.page = this.currentPagedunningListdata;
    this.searchData.pageSize = this.dunningListdataitemsPerPage;

    this.dunningListData = [];
    this.dunningManagementService.searchDunningRule(this.searchData).subscribe(
      (response: any) => {
        this.dunningListData = response.dunningRuleList.content;
        this.dunningListdatatotalRecords = response.pageDetails.totalRecords;
      },
      error => {
        this.dunningListdatatotalRecords = 0;
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
            detail: error.error.errorMessage,
            icon: "far fa-times-circle"
          });
        }
      }
    );
  }

  clearSearchDunning() {
    this.getdunningList("");
    // this.dunningcategory = ''
    // this.dunningtype = ''
    this.searchDunningRule = "";
  }

  dunningRuleDetails(data) {
    this.detailView = true;
    this.listView = false;
    this.createView = false;
    const url = "/dunningrule/" + data.id + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.DunningruleActionlistData = [];
    this.dunningManagementService.getMethod(url).subscribe(async (response: any) => {
      this.DunningruleActionlistData = response.dunningRuleListById;
      await this.getBranchByServiceAreaID(response.dunningRuleListById.serviceAreaIds);
      await this.getPartnerAllByServiceArea(response.dunningRuleListById.serviceAreaIds);
    });
  }
  pageChangedDunningRuleList(pageNumber) {
    this.currentPagedunningRuleList = pageNumber;
  }

  customerFormReset() {
    this.dunningGroupForm.reset();
    this.dunningGroupForm.controls.ccemail.setValue("");
    this.dunningGroupForm.controls.mobile.setValue("");
    this.dunningRulefromgroup.reset();
    this.dunningRulefromgroup.controls.action.setValue("");
    this.dunningRulefromgroup.controls.days.setValue("");
  }

  getDunningType() {
    const url = "/commonList/dunningType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.dunningTypeList = response.dataList;
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

  getCustSubType(event) {
    this.dunningGroupForm.controls.dunningSubType.enable();
    let value = event.value;
    if (event.value == "Barter") {
      this.isCustSubTypeCon = false;
    } else {
      this.isCustSubTypeCon = true;
      this.commondropdownService.getCustomerSubType(value);
    }
  }

  getSectSubType(event) {
    const value = event.value;
    if (value) {
      this.dunningGroupForm.controls.dunningSubSector.enable();
    } else {
      this.dunningGroupForm.controls.dunningSubSector.disable();
    }
  }
  canExit() {
    if (!this.dunningGroupForm.dirty && !this.dunningRulefromgroup.dirty) return true;
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
  dunningTypeListByDropdown: any = [];
  getDunningTypeFor(event) {
    const url = "/commonList/dunningType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.dunningTypeList = response.dataList;
        if (event.value === "Customer") {
          this.isDunningForMvno = false;
          this.dunningTypeListByDropdown = [];
          this.dunningTypeListByDropdown = this.dunningTypeList.filter(
            m =>
              m.value !== "PartnerDocument" &&
              m.value !== "MvnoDocument" &&
              m.value !== "MvnoPayment" &&
              m.value !== "MVNOAdvanceNotification"
          );
          this.isBranchAvailable = true;
          this.dunningGroupForm.controls.branchIds.setValidators(Validators.required);
          this.dunningGroupForm.controls.partnerIds.clearValidators();
          this.dunningGroupForm.controls.branchIds.updateValueAndValidity();

          this.dunningGroupForm.controls.serviceAreaIds.setValidators(Validators.required);
          this.dunningGroupForm.controls.serviceAreaIds.updateValueAndValidity();
          this.dunningGroupForm.controls.customerPayType.setValidators(Validators.required);
          this.dunningGroupForm.controls.customerPayType.updateValueAndValidity();
          this.dunningGroupForm.controls.creditclass.setValidators(Validators.required);
          this.dunningGroupForm.controls.creditclass.updateValueAndValidity();
        }
        if (event.value === "Partner") {
          this.isDunningForMvno = false;
          this.dunningTypeListByDropdown = [];
          this.dunningTypeListByDropdown = this.dunningTypeList.filter(
            m => m.value === "PartnerDocument"
          );
          this.isBranchAvailable = false;
          this.dunningGroupForm.controls.partnerIds.setValidators(Validators.required);
          this.dunningGroupForm.controls.branchIds.clearValidators();
          this.dunningGroupForm.controls.branchIds.updateValueAndValidity();

          this.dunningGroupForm.controls.serviceAreaIds.setValidators(Validators.required);
          this.dunningGroupForm.controls.serviceAreaIds.updateValueAndValidity();
          this.dunningGroupForm.controls.customerPayType.setValidators(Validators.required);
          this.dunningGroupForm.controls.customerPayType.updateValueAndValidity();
          this.dunningGroupForm.controls.creditclass.setValidators(Validators.required);
          this.dunningGroupForm.controls.creditclass.updateValueAndValidity();
        }
        if (event.value === "Mvno") {
          this.isDunningForMvno = true;
          this.isBranchAvailable = false;
          this.dunningTypeListByDropdown = [];

          this.dunningTypeListByDropdown = this.dunningTypeList.filter(
            m =>
              m.value === "MvnoDocument" ||
              m.value === "MvnoPayment" ||
              m.value === "MVNOAdvanceNotification"
          );
          this.dunningGroupForm.controls.partnerIds.clearValidators();
          this.dunningGroupForm.controls.partnerIds.updateValueAndValidity();
          this.dunningGroupForm.controls.branchIds.clearValidators();
          this.dunningGroupForm.controls.branchIds.updateValueAndValidity();
          this.dunningGroupForm.controls.serviceAreaIds.clearValidators();
          this.dunningGroupForm.controls.serviceAreaIds.updateValueAndValidity();
          this.dunningGroupForm.controls.customerPayType.clearValidators();
          this.dunningGroupForm.controls.customerPayType.updateValueAndValidity();
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
  dunningEventList: any = [];
  getDunningEvent(event) {
    if (event.value == "AdvanceNotification") {
      this.dunningEventList = [];
      this.dunningRoleAction = this.dunningRoleAction;
      this.dunningEventList = this.dunningRoleAction.filter(m => m.label != "DeActivation");
    } else if (event.value == "MVNOAdvanceNotification") {
      this.dunningEventList = [];
      this.dunningRoleAction = this.dunningRoleAction;
      this.dunningEventList = this.dunningRoleAction.filter(m => m.label != "DeActivation");
    } else {
      this.dunningEventList = this.dunningRoleAction;
    }
  }
}
