import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { Regex } from "src/app/constants/regex";
import { TicketReasonSubCategoryService } from "src/app/service/ticket-reason-sub-category.service";
import { TicketReasonSubCategory } from "src/app/components/model/ticket-reason-sub-category";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Observable, Observer } from "rxjs";
import { TICKETING_SYSTEMS } from "src/app/constants/aclConstants";
@Component({
  selector: "app-ticket-reason-sub-category",
  templateUrl: "./ticket-reason-sub-category.component.html",
  styleUrls: ["./ticket-reason-sub-category.component.css"]
})
export class TicketReasonSubCategoryComponent implements OnInit {
  ticketReasonSubCatFormGroup: FormGroup;
  ticketReasonMapingForm: FormGroup;
  ticketReasonMaping: FormArray;
  submitted = false;
  ticketReasonMapingSubmitted = false;
  parentTRCData: any;
  statusOptions = RadiusConstants.status;
  currentPageReasonMapping = 1;
  reasonMappingitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  reasonMappingtotalRecords: number;
  isTicketReasonSubCategoryEdit = false;
  createTicketReasonSubCategoryData: TicketReasonSubCategory = {
    subCategoryName: "",
    ticketSubCategoryGroupReasonMappingList: [],
    ticketSubCategoryTatMappingList: [],
    ticketSubCategoryReasonCategoryMappingList: [],
    status: "",
    id: "",
    isDefaultSubProblemDomain: false,
    mvnoId: "",
   accessibility:""

  };
  currentPageTicketReasonSubCategoryListdata = 1;
  ticketReasonSubCategoryListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  ticketReasonSubCategoryListDatatotalRecords: any;
  ticketReasonSubCategoryListData: any;
  showItemPerPage: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  searchkey: string;
  editTicketReasonSubCategoryData: TicketReasonSubCategory;
  viewTrscData: any = [];
  currentPageViewReasonListdata = 1;
  viewReasonListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  viewReasonListDatatotalRecords: any;
  searchTrscName: any = "";
  searchParentTrcName: any = "";
  searchData: any;
  searchAllData: any;

  listTicket = true;
  createTicket = false;
  TATForTicketData: any = [];
  teamConditionArray: FormArray;
  teamConditionData: any = [];
  coditionArray: any = [];
  teamcondition: any = "";
  conditionDataEnableDisble = [];
  teamQueryFieldListINDEX: string;
  teamMappingTeamID: any = "";
  teamValue: any = "";
  errormsgCondition: string;
  teamSubmitted: boolean = false;
  tatForTicketID = "";
  TatMappingArray: FormArray;

  ItemPerPageteamCondition = RadiusConstants.ITEMS_PER_PAGE;
  currentPageteamCondition = 1;
  totalRecordsteamCondition: number;
  totalRecordsTeams = 0;
  ItemPerPageTeams = RadiusConstants.ITEMS_PER_PAGE;
  currentPageTeams: any = 1;

  operatorList = [
    { label: "Equal to", value: "==" },
    { label: "Less than or equal to", value: "<=" },
    { label: "Greater than or equal to", value: ">=" },
    { label: "Less than ", value: "<" },
    { label: "Greater than", value: ">" },
    { label: "Not equal to", value: "!=" }
  ];
  AndOrDropdown = [
    { label: "AND", value: "and" },
    { label: "OR", value: "or" }
  ];
  currentPageViewTATListdata = 1;
  viewTATListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  viewTATListDatatotalRecords: any;

  orderid = 1;
  AclClassConstants;
  AclConstants;
  ticketCatogryData = [];
  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  ticketReasonSubCatdialoge: boolean = false;
  ticketReasonSubCatModal: boolean = false;
  coditionArrayShow = [];
  pageItem;
  mvnoId: string;
  searchOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Parent Category', value: 'parentCategoryName' }
  ];

  selectedSearchOption: string = 'name'; 
    caseTypeData: any;
    accessibilityData : any;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ticketReasonSubCategoryService: TicketReasonSubCategoryService,
    public commondropdownService: CommondropdownService,
    public loginService: LoginService
  ) {
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(TICKETING_SYSTEMS.SUB_PB_DOMAIN_CREATE);
    this.deleteAccess = loginService.hasPermission(TICKETING_SYSTEMS.SUB_PB_DOMAIN_DELETE);
    this.editAccess = loginService.hasPermission(TICKETING_SYSTEMS.SUB_PB_DOMAIN_EDIT);

    // this.isTicketReasonSubCategoryEdit = !createAccess && editAccess ? true : false;
  }

  ngOnInit(): void {
    this.ticketReasonSubCatFormGroup = this.fb.group({
      subCategoryName: ["", Validators.required],
      status: ["", Validators.required],
      parentCategory: ["", Validators.required],
      isDefaultSubProblemDomain: [false],
      accessibility:["", Validators.required],


    });
    this.ticketReasonMapingForm = this.fb.group({
      reason: ["", Validators.required],
      ticketReasonSubCategoryId: [""]
    });
    this.ticketReasonMaping = this.fb.array([]);
    this.getTicketReasonCategoryDataList();
    this.getTicketReasonSubCategoryDataList("");
    this.getFildDropdownValue();
    this.getTATForTicketList();
    this.getCaseType();
    this.viewTrscData = {
      status: "",
      ticketSubCategoryGroupReasonMappingList: [],
      ticketSubCategoryTatMappingList: [],
      parentCategory: {
        categoryName: ""
      },
      subCategoryName: ""
    };
   
    this.searchData = {
      filters: [
        {
          filterValue: "",
          filterColumn: "name"
        }
      ],
      page: "",
      pageSize: "",
      sortBy: "createdate",
      sortOrder: 0
    };

    this.teamConditionArray = this.fb.array([]);
    this.TatMappingArray = this.fb.array([]);
    this.searchAllData = {
      filters: [
        {
          filterValue: "",
          filterColumn: "name"
        },
        {
          filterValue: "",
          filterColumn: "parentCategoryName"
        }
      ],
      page: "",
      pageSize: "",
      sortBy: "createdate",
      sortOrder: 0
    };
    this.mvnoId = localStorage.getItem("mvnoId");

    this.accessibilityData = [
      { label: "Admin", value: "Admin" },
      { label: "CWSC", value: "CWSC" },
      { label: "Both", value: "Both" },
    ];

  }

  createTicketFun(): void {
    this.listTicket = false;
    this.createTicket = true;
    this.submitted = false;
    this.isTicketReasonSubCategoryEdit = false;
    this.ticketReasonSubCatFormGroup.reset();
    this.submitted = false;
    this.ticketReasonMaping.controls = [];
    this.orderid = 0;
    this.teamConditionArray.reset();
    this.ticketReasonSubCatFormGroup.reset();
    this.teamConditionArray = this.fb.array([]);
    this.TatMappingArray = this.fb.array([]);
    this.ticketReasonMaping = this.fb.array([]);
    this.tatForTicketID = "";
    this.teamcondition = "";
    this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").enable();
  }

  searchTicketFun(): void {
    this.listTicket = true;
    this.createTicket = false;
    this.isTicketReasonSubCategoryEdit = false;
    this.ticketReasonSubCatFormGroup.reset();
    this.ticketReasonMaping.controls = [];
    this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").enable();
    this.pageItem = this.ticketReasonSubCategoryListdataitemsPerPage;
    this.getTicketReasonSubCategoryDataList("");
  }

  getTicketReasonSubCategoryDataList(list) {
    let size;
    this.searchkey = "";
    const page = this.currentPageTicketReasonSubCategoryListdata;
    if (list) {
      size = list;
      this.currentPageTicketReasonSubCategoryListdata = list;
    } else {
      size = this.ticketReasonSubCategoryListdataitemsPerPage;
    }

    const pagedata = {
      page,
      pageSize: size
    };
    const url = "/ticketReasonSubCategory";
    this.ticketReasonSubCategoryService.postMethod(url, pagedata).subscribe(
      (response: any) => {
        this.ticketReasonSubCategoryListData = response.dataList;
        this.ticketReasonSubCategoryListDatatotalRecords = response.totalRecords;
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

  getTicketReasonCategoryDataList() {
    const url = "/ticketReasonCategory/getAllActiveReasonCatgory";
    this.ticketReasonSubCategoryService.getMethod(url).subscribe(
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

  ticketReasonMappingFormGroup(): FormGroup {
    return this.fb.group({
      reason: [this.ticketReasonMapingForm.value.reason, [Validators.required]],
      ticketReasonSubCategoryId: [""]
    });
  }

  onAddReasonMappingField() {
    this.ticketReasonMapingSubmitted = true;
    if (this.ticketReasonMapingForm.valid) {
      this.ticketReasonMaping.push(this.ticketReasonMappingFormGroup());
      this.ticketReasonMapingForm.reset();
      this.ticketReasonMapingSubmitted = false;
    }
  }

addEditTicketReasonSubCat(id: string | number) {
  let TatMappingList: any = [];
  let quaryArray: any = [];
  let ticketCatogary: any = [];
  let catogaryData: any = [];
  this.submitted = true;

  if (this.ticketReasonSubCatFormGroup.value.isDefaultSubProblemDomain == null) {
    this.ticketReasonSubCatFormGroup.controls.isDefaultSubProblemDomain.setValue(false);
  }

  if (this.ticketReasonSubCatFormGroup.valid) {
    if (this.TatMappingArray.value.length > 0) {
      if (id) {
        const url = "/ticketReasonSubCategory/update";

        this.TatMappingArray.value.forEach(element => {
          quaryArray = element.tatQueryFieldMappingList?.length
            ? element.tatQueryFieldMappingList
            : [];

          TatMappingList.push({
            id: element.id,
            orderid: element.orderid,
            tatQueryFieldMappingList: quaryArray,
            ticketTatMatrix: { id: element.tatForTicketID },
            ticketReasonSubCategoryId: id
          });
        });

        this.createTicketReasonSubCategoryData.id = id;
        this.createTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList =
          this.ticketReasonMaping.value;

        catogaryData = this.ticketReasonSubCatFormGroup.value.parentCategory;
        if (catogaryData?.length) {
          catogaryData.forEach(element => {
            ticketCatogary.push({
              ticketReasonCategoryId: element,
              ticketReasonSubCategoryId: id
            });
          });
          this.createTicketReasonSubCategoryData.ticketSubCategoryReasonCategoryMappingList =
            ticketCatogary;
        }

        this.createTicketReasonSubCategoryData.ticketSubCategoryTatMappingList = TatMappingList;
        this.createTicketReasonSubCategoryData.status =
          this.ticketReasonSubCatFormGroup.value.status;
          this.createTicketReasonSubCategoryData.subCategoryName =
          this.ticketReasonSubCatFormGroup.value.subCategoryName;
          this.createTicketReasonSubCategoryData.isDefaultSubProblemDomain =
          this.ticketReasonSubCatFormGroup.value.isDefaultSubProblemDomain;
          this.createTicketReasonSubCategoryData.accessibility = 
          this.ticketReasonSubCatFormGroup.value.accessibility;


        this.ticketReasonSubCategoryService
          .postMethod(url, this.createTicketReasonSubCategoryData)
          .subscribe(
            (response: any) => {
              if ([500].includes(response.responseCode)) {
                this.messageService.add({
                  severity: "error",
                  summary: "Error",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });
              } 
              else if(response.responseCode === 417 || response.responseCode === 406){
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
                  detail: response.responseMessage,
                  icon: "far fa-times-circle"
                });
              }else {
                this.messageService.add({
                  severity: "success",
                  summary: "Successfully",
                  detail: response.message,
                  icon: "far fa-check-circle"
                });
                this.clearTicketReasonSubCategory();
                this.isTicketReasonSubCategoryEdit = false;
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
        const url = "/ticketReasonSubCategory/save";
        this.createTicketReasonSubCategoryData.id = "";

        this.TatMappingArray.value.forEach(element => {
          quaryArray = element.tatQueryFieldMappingList?.length
            ? element.tatQueryFieldMappingList
            : [];

          TatMappingList.push({
            id: '',
            orderid: element.orderid,
            tatQueryFieldMappingList: quaryArray,
            ticketTatMatrix: { id: element.tatForTicketID }
          });
        });

        this.createTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList =
          this.ticketReasonMaping.value;

        catogaryData = this.ticketReasonSubCatFormGroup.value.parentCategory;
        if (catogaryData?.length) {
          catogaryData.forEach(element => {
            ticketCatogary.push({
              ticketReasonCategoryId: element,
              ticketReasonSubCategoryId: ''
            });
          });
          this.createTicketReasonSubCategoryData.ticketSubCategoryReasonCategoryMappingList =
            ticketCatogary;
        }

        this.createTicketReasonSubCategoryData.ticketSubCategoryTatMappingList = TatMappingList;
        this.createTicketReasonSubCategoryData.status =
          this.ticketReasonSubCatFormGroup.value.status;
        this.createTicketReasonSubCategoryData.subCategoryName =
          this.ticketReasonSubCatFormGroup.value.subCategoryName;
        this.createTicketReasonSubCategoryData.isDefaultSubProblemDomain =
          this.ticketReasonSubCatFormGroup.value.isDefaultSubProblemDomain;
            this.createTicketReasonSubCategoryData.accessibility = 
          this.ticketReasonSubCatFormGroup.value.accessibility;
        this.mvnoId = localStorage.getItem("mvnoId");
        this.createTicketReasonSubCategoryData.mvnoId = Number(this.mvnoId);

        this.ticketReasonSubCategoryService
          .postMethod(url, this.createTicketReasonSubCategoryData)
          .subscribe(
            (response: any) => {
              if (response.responseCode == 406) {
                this.messageService.add({
                  severity: "info",
                  summary: "Info",
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
                this.clearTicketReasonSubCategory();
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

    } else {
      this.messageService.add({
        severity: "info",
        summary: "Required",
        detail: "Please add TAT Mapping",
        icon: "far fa-times-circle"
      });
    }
  }
}



  getTATForTicketList() {
    const url = "/tickettatmatrix/searchByStatus";
    this.ticketReasonSubCategoryService.getMethod(url).subscribe(
      (response: any) => {
        this.TATForTicketData = response.dataList;
      },
      (error: any) => {}
    );
  }

  clearTicketReasonSubCategory() {
    this.submitted = false;
    this.getTicketReasonSubCategoryDataList("");
    this.listTicket = true;
    this.createTicket = false;
    this.teamConditionArray.reset();
    this.ticketReasonSubCatFormGroup.reset();
    this.teamConditionArray = this.fb.array([]);
    this.TatMappingArray = this.fb.array([]);
    this.ticketReasonMaping = this.fb.array([]);
    this.tatForTicketID = "";
    this.teamcondition = "";
  }

  pageChangedReasonMappingData(pageNumber) {
    this.currentPageReasonMapping = pageNumber;
  }

  deleteConfirmonReasonMappingField(reasonMappingFieldIndex: number, reasonMappingFieldId: number) {
    if (reasonMappingFieldIndex || reasonMappingFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Reason?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveReasonMapping(reasonMappingFieldIndex, reasonMappingFieldId);
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

  async onRemoveReasonMapping(reasonMappingFieldIndex: number, reasonMappingFieldId: number) {
    this.ticketReasonMaping.removeAt(reasonMappingFieldIndex);
  }

  TotalItemPerPage(event) {
    this.ticketReasonSubCategoryListdataitemsPerPage = Number(event.value);
    if (this.currentPageTicketReasonSubCategoryListdata > 1) {
      this.currentPageTicketReasonSubCategoryListdata = 1;
    }
    this.getTicketReasonSubCategoryDataList(this.showItemPerPage);
  }

  pageChangedTrscList(pageNumber) {
    this.currentPageTicketReasonSubCategoryListdata = pageNumber;
    this.getTicketReasonSubCategoryDataList("");
  }

  editTicketReasonSubCategory(id) {
    this.tatForTicketID = "";
    this.teamcondition = "";

    this.ticketReasonSubCatFormGroup.reset();
    this.ticketReasonMapingForm.reset();
    this.isTicketReasonSubCategoryEdit = true;

    this.listTicket = false;
    this.createTicket = true;

    this.ticketReasonMaping = this.fb.array([]);
    this.teamConditionArray = this.fb.array([]);
    this.TatMappingArray = this.fb.array([]);
    this.orderid = 0;
    this.ticketCatogryData = [];
    let catogaryData = [];

    const url = "/ticketReasonSubCategory/" + id;
    this.ticketReasonSubCategoryService.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.editTicketReasonSubCategoryData = response.data;
          this.ticketReasonSubCatFormGroup.patchValue({
            subCategoryName: this.editTicketReasonSubCategoryData.subCategoryName,
            status: this.editTicketReasonSubCategoryData.status,
            // parentCategory: this.editTicketReasonSubCategoryData.parentCategory.id,
            isDefaultSubProblemDomain:
              this.editTicketReasonSubCategoryData.isDefaultSubProblemDomain,
               accessibility:
              this.editTicketReasonSubCategoryData.accessibility
          });

          this.ticketReasonMaping = this.fb.array([]);
          this.editTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList.forEach(
            element => {
              this.ticketReasonMaping.push(this.fb.group(element));
            }
          );
          this.ticketReasonMaping.patchValue(
            this.editTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList
          );
          catogaryData =
            this.editTicketReasonSubCategoryData.ticketSubCategoryReasonCategoryMappingList;
          if (catogaryData.length > 0) {
            catogaryData.forEach((element, i) => {
              let n = i + 1;
              this.ticketCatogryData.push(element.ticketReasonCategoryId);
              if (n == catogaryData.length) {
                this.ticketReasonSubCatFormGroup.patchValue({
                  parentCategory: this.ticketCatogryData
                });
              }
            });
          }

          let data = [];
          response.data.ticketSubCategoryTatMappingList.forEach((element, i) => {
            let queryData = [];
            this.orderid = i + 1;
            let teamcondition = "";
            if (element.tatQueryFieldMappingList.length > 0) {
              let queryDataLength = element.tatQueryFieldMappingList.length - 1;
              queryData = element.tatQueryFieldMappingList;

              queryData.forEach((element, index) => {
                if (index > 0) {
                  this.conditionDataEnableDisble.push(true);
                }
                if (queryDataLength != index) {
                  teamcondition =
                    teamcondition +
                    " " +
                    element.queryField +
                    " " +
                    element.queryOperator +
                    " " +
                    element.queryValue +
                    " " +
                    element.queryCondition;
                } else {
                  teamcondition =
                    teamcondition +
                    " " +
                    element.queryField +
                    " " +
                    element.queryOperator +
                    element.queryValue;
                }
              });
            }

            this.TatMappingArray.push(
              this.fb.group({
                id: [element.id],
                orderid: [element.orderid],
                teamcondition: [teamcondition],
                tatForTicketID: [element.ticketTatMatrix.id],
                tatQueryFieldMappingList: [element.tatQueryFieldMappingList],
                ticketReasonSubCategoryId: [id]
              })
            );
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


 searchTrsc() {
  if (!this.searchkey || this.searchkey !== this.searchData) {
    this.currentPageTicketReasonSubCategoryListdata = 1;
  }
  this.searchkey = this.searchData;

  if (this.showItemPerPage) {
    this.ticketReasonSubCategoryListdataitemsPerPage = this.showItemPerPage;
  }

  this.searchData = {
    filters: [
      {
        filterDataType: "",
        filterValue: "",
        filterColumn: "name",
        filterOperator: "equalto",
        filterCondition: "and"
      }
    ],
    page: this.currentPageTicketReasonSubCategoryListdata || 1,
    pageSize: this.ticketReasonSubCategoryListdataitemsPerPage || 20,
    status: "Active",
    sortBy: "id"
  };

  if (this.selectedSearchOption === 'name' && this.searchTrscName?.trim()) {
    this.searchData.filters[0].filterColumn = "name";
    this.searchData.filters[0].filterValue = this.searchTrscName.trim();
  } else if (this.selectedSearchOption === 'parentCategoryName' && this.searchParentTrcName) {
    this.searchData.filters[0].filterColumn = "parentCategoryName";
    this.searchData.filters[0].filterValue = this.searchParentTrcName; 
  } else {
    this.searchData.filters[0].filterValue = "";
  }

  const url = "/ticketReasonSubCategory/searchAll";

  this.ticketReasonSubCategoryService.postMethod(url, this.searchData).subscribe(
    (response: any) => {
      if (response?.dataList?.length > 0) {
        this.ticketReasonSubCategoryListData = response.dataList;
        this.ticketReasonSubCategoryListDatatotalRecords = response.totalRecords;
      } else {
        this.ticketReasonSubCategoryListData = [];
        this.ticketReasonSubCategoryListDatatotalRecords = 0;
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: "No Record Found",
          icon: "far fa-times-circle"
        });
      }
    },
    (error: any) => {
      this.ticketReasonSubCategoryListDatatotalRecords = 0;
      if (error.error.status == 404) {
        this.messageService.add({
          severity: "info",
          summary: "Info",
          detail: error.error.msg,
          icon: "far fa-times-circle"
        });
        this.ticketReasonSubCategoryListData = [];
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


 clearSearchTrsc() {
  this.searchTrscName = "";
  this.searchParentTrcName = "";
  this.selectedSearchOption = ""; 
  this.currentPageTicketReasonSubCategoryListdata = 1;
  this.getTicketReasonSubCategoryDataList("");
  this.listTicket = true;
  this.createTicket = false;
}


  deleteConfirmonTicketReasonSubCat(TrscData) {
    if (TrscData) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Ticket Sub Problem Domain?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteTrsc(TrscData);
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

  deleteTrsc(data) {
    const url = "/ticketReasonSubCategory/delete";
    this.ticketReasonSubCategoryService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response.responseCode == 406 || response.responseCode == 417) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else if (response.responseCode == 304) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (
            this.currentPageTicketReasonSubCategoryListdata != 1 &&
            this.ticketReasonSubCategoryListData.length == 1
          ) {
            this.currentPageTicketReasonSubCategoryListdata =
              this.ticketReasonSubCategoryListData - 1;
          }
          if (!this.searchkey) {
            this.getTicketReasonSubCategoryDataList("");
          } else {
            this.searchTrsc();
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

  trscAllDetails(data) {
    this.ticketReasonSubCatdialoge = true;
    let data1 = [];
    this.coditionArrayShow = [];
    this.viewTrscData = data;

    let teamcondition = "";
    data1 = this.viewTrscData.ticketSubCategoryTatMappingList;
    data1.forEach(element => {
      let queryData = [];
      let teamcondition = "";
      if (element.tatQueryFieldMappingList.length > 0) {
        let queryDataLength = element.tatQueryFieldMappingList.length - 1;
        queryData = element.tatQueryFieldMappingList;
        queryData.forEach((element, index) => {
          if (index > 0) {
            this.conditionDataEnableDisble.push(true);
          }
          if (queryDataLength != index) {
            teamcondition =
              teamcondition +
              " " +
              element.queryField +
              " " +
              element.queryOperator +
              " " +
              element.queryValue +
              " " +
              element.queryCondition;
          } else {
            teamcondition =
              teamcondition +
              " " +
              element.queryField +
              " " +
              element.queryOperator +
              element.queryValue;
          }
        });
      }

      this.coditionArrayShow.push(teamcondition);
    });
  }

  changeTATPageData(pageNumber) {
    this.currentPageViewTATListdata = pageNumber;
  }

  pageChangedViewReasonData(pageNumber) {
    this.currentPageViewReasonListdata = pageNumber;
  }
  FildDropdownData = [];
  getFildDropdownValue() {
    this.FildDropdownData = [];
    let url = `/commonList/generic/CASE_CONDITION`;
    this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
      this.FildDropdownData = response.dataList;
    });
  }

  createteamConditionForm(): FormGroup {
    return this.fb.group({
      field: ["", Validators.required],
      operator: ["", Validators.required],
      value: ["", Validators.required],
      condition: [""]
    });
  }

  onAddAttribute() {
    this.teamSubmitted = true;
    this.teamConditionData = [];
    if (this.tatForTicketID) {
      this.orderid = this.orderid + 1;
      this.TatMappingArray.push(
        this.createAttributeFormGroup(
          this.orderid,
          this.teamcondition,
          this.tatForTicketID,
          this.coditionArray
        )
      );
    }
  }

  createAttributeFormGroup(orderid, condition, tatForTicketID, coditionArray): FormGroup {
    this.teamcondition = "";
    this.tatForTicketID = "";
    this.teamSubmitted = false;
    this.coditionArray = [];

    return this.fb.group({
      orderid: [orderid],
      teamcondition: [condition],
      tatForTicketID: [tatForTicketID],
      tatQueryFieldMappingList: [coditionArray]
    });
  }

  deleteConfirmAttribute(i, data) {
    let teamConData = this.TatMappingArray.value;
    // let teamTotalData = teamConData.length;
    // teamConData.forEach((element, i) => {
    //   if (element == data) {
    //     this.TatMappingArray.removeAt(i);
    //     if (i % 5 == 0 && teamTotalData == i + 1) {
    //       this.currentPageTeams = this.currentPageTeams - 1;
    //     }
    //   }
    // });

    this.TatMappingArray.removeAt(i);
    this.orderid = this.orderid - 1;
    this.TatMappingArray.value.forEach((element, i) => {
      let n = i + 1;
      element.orderid = n;
      if (this.TatMappingArray.value.length == n) {
        this.TatMappingArray.patchValue(this.TatMappingArray.value);
      }
    });
  }

  deleteTeamCondition(index, data) {
    let teamConData = this.teamConditionArray.value;
    let teamTotalData = teamConData.length;

    teamConData.forEach((element, i) => {
      if (element == data) {
        this.teamConditionArray.removeAt(i);
        if (i % 5 == 0 && teamTotalData == i + 1) {
          this.currentPageteamCondition = this.currentPageteamCondition - 1;
        }
      }
    });
  }

  pageChangedTeamMappingList(page) {
    this.currentPageteamCondition = page;
  }

  saveConditionData() {
    this.teamcondition = "";
    this.coditionArray = [];
    let quaryFieldCondition = "";
    let quaryConditionArray = [];
    let detailsFormValue = this.teamConditionArray.value;
    this.teamConditionData = detailsFormValue;

    let detailsLength = detailsFormValue.length - 1;
    detailsFormValue.forEach((element, index) => {
      this.coditionArray.push({
        id: element.id ? element.id : null,
        queryField: element.field,
        queryOperator: element.operator,
        queryValue: element.value,
        queryCondition: element.condition,
        tatMappingId: this.teamMappingTeamID ? this.teamMappingTeamID : this.teamValue
      });

      if (detailsLength != index) {
        this.teamcondition =
          this.teamcondition +
          " " +
          element.field +
          " " +
          element.operator +
          " " +
          element.value +
          " " +
          element.condition;
      } else {
        this.teamcondition =
          this.teamcondition + " " + element.field + " " + element.operator + element.value;
      }
    });
    quaryConditionArray = this.coditionArray;
    quaryFieldCondition = this.teamcondition;

    if (this.teamQueryFieldListINDEX !== "") {
      this.TatMappingArray.value[this.teamQueryFieldListINDEX].tatQueryFieldMappingList =
        quaryConditionArray;
      this.TatMappingArray.value[this.teamQueryFieldListINDEX].teamcondition = quaryFieldCondition;
      // hierarchyMappingList = this.TatMappingArray.value

      // hierarchyMappingList.forEach((element , i) => {
      //   if(this.teamQueryFieldListINDEX == i){
      // this.TatMappingArray.push(
      this.TatMappingArray.patchValue(this.TatMappingArray.value);
      this.closeConditionModel();
      this.teamcondition = "";
      this.coditionArray = [];
      this.teamMappingTeamID = "";
      // );
      //   }
      // })
    }

    if (this.teamcondition || quaryFieldCondition) {
      this.closeConditionModel();
      this.conditionDataEnableDisble.push(true);
    }
  }

  openConditionModel() {
    this.ticketReasonSubCatModal = true;
    this.teamQueryFieldListINDEX = "";
    if (this.teamcondition) {
      this.coditionArray.forEach((element, index) => {
        this.teamConditionArray.push(
          this.fb.group({
            id: element.id,
            field: element.queryField,
            operator: element.queryOperator,
            value: element.queryValue,
            condition: element.queryCondition
          })
        );
        if (index > 0) {
          this.conditionDataEnableDisble.push(true);
        }
      });
    } else {
      this.onConditionAddAttribute();
    }
  }

  closeConditionModel() {
    this.teamConditionArray.reset();
    this.teamConditionArray = this.fb.array([]);
    this.ticketReasonSubCatModal = false;
  }

  onkeyCondition(e) {
    if (e.value != "") {
      this.errormsgCondition = "";
    }
  }

  onConditionAddAttribute() {
    if (this.teamConditionArray.value.length >= 1) {
      let index = this.teamConditionArray.value.length - 1;
      if (this.teamConditionArray.value[index].condition == "" && this.teamConditionArray.valid) {
        this.errormsgCondition = "Please add condition first";
        this.conditionDataEnableDisble.push(true);
        this.teamConditionArray.push(this.createteamConditionForm());
      } else if (!this.teamConditionArray.valid) {
        this.errormsgCondition = "";
      } else {
        this.errormsgCondition = "";
        this.conditionDataEnableDisble.push(true);
        this.teamConditionArray.push(this.createteamConditionForm());
      }
    } else {
      this.teamConditionArray.push(this.createteamConditionForm());
    }
  }

  defultAddTeamCondition(index, teamId) {
    this.teamConditionArray.reset();
    this.teamConditionArray = this.fb.array([]);
    let hierarchyMappingList = [];
    this.conditionDataEnableDisble = [];
    this.teamMappingTeamID = teamId;
    this.teamQueryFieldListINDEX = index;
    if (this.TatMappingArray.length > 0) {
      hierarchyMappingList = this.TatMappingArray.value[index].tatQueryFieldMappingList;
    }
    if (hierarchyMappingList.length > 0) {
      hierarchyMappingList.forEach((element, index) => {
        if (index > 0) {
          this.conditionDataEnableDisble.push(true);
        }
        this.teamConditionArray.push(
          this.fb.group({
            id: element.id,
            field: element.queryField,
            operator: element.queryOperator,
            value: element.queryValue,
            condition: element.queryCondition
          })
        );
      });
    }
  }
  canExit() {
    if (
      !this.ticketReasonSubCatFormGroup.dirty &&
      !this.ticketReasonMapingForm.dirty &&
      !this.ticketReasonMaping.dirty
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

  onParentChange(event: any) {
    var parentIds = event.value;

    const url = "/ticketReasonSubCategory/isReasonSubCategoryDefault";

    if (parentIds.length > 0) {
      this.ticketReasonSubCategoryService.postMethod(url, parentIds).subscribe(
        (response: any) => {
          if (response.data) {
            let isProblemDomain = response.data ? response.data : false;
            if (this.isTicketReasonSubCategoryEdit) {
              if (JSON.stringify(parentIds) === JSON.stringify(this.ticketCatogryData)) {
                this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").enable();
                this.subProbleDomainPatchValue(isProblemDomain);
              } else {
                this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").disable();
                this.subProbleDomainPatchValue(false);
              }
            } else {
              this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").disable();
              this.subProbleDomainPatchValue(false);
            }
          } else {
            this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").enable();
            this.subProbleDomainPatchValue(false);
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

  subProbleDomainPatchValue(isdefault: boolean) {
    this.ticketReasonSubCatFormGroup.patchValue({
      isDefaultSubProblemDomain: isdefault
    });
  }

  closeSubProblemDomainDetailsModel() {
    this.ticketReasonSubCatdialoge = false;
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

}
