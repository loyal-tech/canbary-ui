import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { Observable, Observer } from "rxjs";
import { TASK_SYSTEMS, TICKETING_SYSTEMS } from "src/app/constants/aclConstants";
import { TaskSubCategoryService } from "src/app/service/task-sub-category.service";
@Component({
  selector: "app-task-ticket-sub-category",
  templateUrl: "./task-ticket-sub-category.component.html",
  styleUrls: ["./task-ticket-sub-category.component.css"]
})
export class TaskTicketSubCategoryComponent implements OnInit {
  ticketReasonSubCatFormGroup: FormGroup;
  // ticketReasonMapingForm: FormGroup;
  // ticketReasonMaping: FormArray;
  submitted = false;
  // ticketReasonMapingSubmitted = false;
  parentTRCData: any;
  statusOptions = RadiusConstants.status;
  // currentPageReasonMapping = 1;
  // reasonMappingitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  // reasonMappingtotalRecords: number;
  isTicketReasonSubCategoryEdit = false;
  mvnoId: any;
  createTicketReasonSubCategoryData: any = {
    subCategoryName: "",
    // ticketSubCategoryGroupReasonMappingList: [],
    // ticketSubCategoryTatMappingList: [],
    caseSubCategoryCategoryMappingList: [],
    status: "",
    subCategoryId: "",
    discription: "",
    mvnoId: "",
    buId: "",
    isDeleted: false
    // isDefaultSubProblemDomain: false
  };
  currentPageTicketReasonSubCategoryListdata = 1;
  ticketReasonSubCategoryListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  ticketReasonSubCategoryListDatatotalRecords: any = 0;
  ticketReasonSubCategoryListData: any;
  showItemPerPage: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  searchkey: string;
  editTicketReasonSubCategoryData: any;
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
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private taskSubCategory: TaskSubCategoryService,
    public commondropdownService: CommondropdownService,
    public loginService: LoginService
  ) {
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_SUB_CATEGORY_DOMAIN_CREATE);
    this.deleteAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_SUB_CATEGORY_DOMAIN_DELETE);
    this.editAccess = loginService.hasPermission(TASK_SYSTEMS.TASK_SUB_CATEGORY_DOMAIN_EDIT);
    this.mvnoId = localStorage.getItem("mvnoId");
    // this.isTicketReasonSubCategoryEdit = !createAccess && editAccess ? true : false;
  }

  ngOnInit(): void {
    this.ticketReasonSubCatFormGroup = this.fb.group({
      subCategoryName: ["", Validators.required],
      status: ["", Validators.required],
      parentCategory: ["", Validators.required],
      discription: [""],
      buId: [null]
      //   isDefaultSubProblemDomain: [false]
    });
    // this.ticketReasonMapingForm = this.fb.group({
    //     reason: ["", Validators.required],
    //     caseSubCategoryId: [""]
    // });
    // this.ticketReasonMaping = this.fb.array([]);
    this.getTicketReasonCategoryDataList();
    this.getTicketReasonSubCategoryDataList("");
    // this.getFildDropdownValue();
    // this.getTATForTicketList();
    this.viewTrscData = {
      status: "",
      // ticketSubCategoryGroupReasonMappingList: [],
      // ticketSubCategoryTatMappingList: [],
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
  }

  createTicketFun(): void {
    this.listTicket = false;
    this.createTicket = true;
    this.submitted = false;
    this.isTicketReasonSubCategoryEdit = false;
    this.ticketReasonSubCatFormGroup.reset();
    this.submitted = false;
    // this.ticketReasonMaping.controls = [];
    this.orderid = 0;
    this.teamConditionArray.reset();
    this.ticketReasonSubCatFormGroup.reset();
    this.teamConditionArray = this.fb.array([]);
    this.TatMappingArray = this.fb.array([]);
    // this.ticketReasonMaping = this.fb.array([]);
    this.tatForTicketID = "";
    this.teamcondition = "";
    // this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").enable();
  }

  searchTicketFun(): void {
    this.listTicket = true;
    this.createTicket = false;
    this.isTicketReasonSubCategoryEdit = false;
    this.ticketReasonSubCatFormGroup.reset();
    // this.ticketReasonMaping.controls = [];
    // this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").enable();
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
      page: page,
      pageSize: size,
      sortBy: "createdate",
      sortOrder: 0
    };
    const url = "/CaseSubCategory/getAll";
    this.taskSubCategory.postMethod(url, pagedata).subscribe(
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
    const url = "/CaseCategory/getAllActiveReasonCatgory";
    this.taskSubCategory.getMethod(url).subscribe(
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

  // ticketReasonMappingFormGroup(): FormGroup {
  //     return this.fb.group({
  //         reason: [this.ticketReasonMapingForm.value.reason, [Validators.required]],
  //         caseSubCategoryId: [""]
  //     });
  // }

  // onAddReasonMappingField() {
  //     this.ticketReasonMapingSubmitted = true;
  //     if (this.ticketReasonMapingForm.valid) {
  //         this.ticketReasonMaping.push(this.ticketReasonMappingFormGroup());
  //         this.ticketReasonMapingForm.reset();
  //         this.ticketReasonMapingSubmitted = false;
  //     }
  // }

  addEditTicketReasonSubCat(id) {
    let TatMappingList: any = [];
    let quaryArray: any = [];
    let ticketCatogary: any = [];
    let catogaryData = [];
    this.submitted = true;

    // if (this.ticketReasonSubCatFormGroup.value.isDefaultSubProblemDomain == null) {
    //     this.ticketReasonSubCatFormGroup.controls.isDefaultSubProblemDomain.setValue(false);
    // }
    if (this.ticketReasonSubCatFormGroup.valid) {
      // if (this.TatMappingArray.value.length > 0) {
      if (id) {
        const url = "/CaseSubCategory/update";

        // if (this.TatMappingArray.value.length > 0) {
        //     this.TatMappingArray.value.forEach((element, i) => {
        //         if (element.tatQueryFieldMappingList.length > 0) {
        //             quaryArray = element.tatQueryFieldMappingList;
        //         } else {
        //             quaryArray = [];
        //         }
        //         TatMappingList.push({
        //             id: element.id,
        //             orderid: element.orderid,
        //             tatQueryFieldMappingList: quaryArray,
        //             ticketTatMatrix: {
        //                 id: element.tatForTicketID
        //             },
        //             caseSubCategoryId: id
        //         });
        //     });
        // }
        //this.createTicketReasonSubCategoryData = this.ticketReasonSubCatFormGroup.value;
        this.createTicketReasonSubCategoryData.subCategoryId = id;
        // this.createTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList =
        //     this.ticketReasonMaping.value;
        catogaryData = this.ticketReasonSubCatFormGroup.value.parentCategory;
        if (catogaryData.length > 0) {
          catogaryData.forEach((element, i) => {
            let n = i + 1;
            ticketCatogary.push({
              caseCategoryId: element,
              caseSubCategoryId: this.createTicketReasonSubCategoryData.subCategoryId
            });
            if (n == catogaryData.length) {
              this.createTicketReasonSubCategoryData.caseSubCategoryCategoryMappingList =
                ticketCatogary;
            }
          });
        }
        // this.createTicketReasonSubCategoryData.ticketSubCategoryTatMappingList = TatMappingList;
        this.createTicketReasonSubCategoryData.status =
          this.ticketReasonSubCatFormGroup.value.status;

        this.createTicketReasonSubCategoryData.subCategoryName =
          this.ticketReasonSubCatFormGroup.value.subCategoryName;

        this.createTicketReasonSubCategoryData.discription =
          this.ticketReasonSubCatFormGroup.value.discription;
        this.createTicketReasonSubCategoryData.mvnoId = this.mvnoId;
        this.createTicketReasonSubCategoryData.buId = this.ticketReasonSubCatFormGroup.value.buId;

        // this.createTicketReasonSubCategoryData.isDefaultSubProblemDomain =
        //     this.ticketReasonSubCatFormGroup.value.isDefaultSubProblemDomain;

        // this.createTicketReasonSubCategoryData.parentCategory = parentCatId;
        // if (
        //   this.createTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList.length < 1
        // ) {
        //   this.messageService.add({
        //     severity: "error",
        //     summary: "Error",
        //     detail: "Please add Reason details",
        //     icon: "far fa-times-circle",
        //   });
        //
        // } else {
        this.taskSubCategory.postMethod(url, this.createTicketReasonSubCategoryData).subscribe(
          (response: any) => {
            if (
              response.responseCode == 406 ||
             
              response.responseCode == 500
            ) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } 
            else if (response.responseCode = 417){
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
        // }
      } else {
        const url = "/CaseSubCategory/save";

        // if (this.TatMappingArray.value.length > 0) {
        //     this.TatMappingArray.value.forEach((element, i) => {
        //         if (element.tatQueryFieldMappingList.length > 0) {
        //             quaryArray = element.tatQueryFieldMappingList;
        //         } else {
        //             quaryArray = [];
        //         }
        //         TatMappingList.push({
        //             id: "",
        //             orderid: element.orderid,
        //             tatQueryFieldMappingList: quaryArray,
        //             ticketTatMatrix: {
        //                 id: element.tatForTicketID
        //             }
        //         });
        //     });
        // }
        // this.createTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList =
        //     this.ticketReasonMaping.value;
        catogaryData = this.ticketReasonSubCatFormGroup.value.parentCategory;
        if (catogaryData.length > 0) {
          catogaryData.forEach((element, i) => {
            let n = i + 1;
            ticketCatogary.push({
              caseCategoryId: element,
              caseSubCategoryId: this.createTicketReasonSubCategoryData.subCategoryId
            });
            if (n == catogaryData.length) {
              this.createTicketReasonSubCategoryData.caseSubCategoryCategoryMappingList =
                ticketCatogary;
            }
          });
        }

        // this.createTicketReasonSubCategoryData.ticketSubCategoryTatMappingList = TatMappingList;
        this.createTicketReasonSubCategoryData.status =
          this.ticketReasonSubCatFormGroup.value.status;

        this.createTicketReasonSubCategoryData.subCategoryName =
          this.ticketReasonSubCatFormGroup.value.subCategoryName;

        this.createTicketReasonSubCategoryData.discription =
          this.ticketReasonSubCatFormGroup.value.discription;
        this.createTicketReasonSubCategoryData.mvnoId = this.mvnoId;
        this.createTicketReasonSubCategoryData.buId = this.ticketReasonSubCatFormGroup.value.buId;

        // // console.log(" this.createTicketReasonCategoryData", this.createTicketReasonSubCategoryData);
        // if (
        //   this.createTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList.length < 1
        // ) {
        //   this.messageService.add({
        //     severity: "error",
        //     summary: "Error",
        //     detail: "Please add Reason details",
        //     icon: "far fa-times-circle",
        //   });
        //
        // } else {
        // this.createTicketReasonSubCategoryData.isDefaultSubProblemDomain =
        //     this.ticketReasonSubCatFormGroup.value.isDefaultSubProblemDomain;
        this.taskSubCategory.postMethod(url, this.createTicketReasonSubCategoryData).subscribe(
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
        // }
      }
      // } else {
      //     this.messageService.add({
      //         severity: "info",
      //         summary: "Required ",
      //         detail: "Please add TAT Mapping",
      //         icon: "far fa-times-circle"
      //     });
      // }
    }
  }

  // getTATForTicketList() {
  //     const url = "/tickettatmatrix/searchByStatus";
  //     this.taskSubCategory.getMethod(url).subscribe(
  //         (response: any) => {
  //             this.TATForTicketData = response.dataList;
  //         },
  //         (error: any) => { }
  //     );
  // }

  clearTicketReasonSubCategory() {
    this.submitted = false;
    this.getTicketReasonSubCategoryDataList("");
    this.listTicket = true;
    this.createTicket = false;
    this.teamConditionArray.reset();
    this.ticketReasonSubCatFormGroup.reset();
    this.teamConditionArray = this.fb.array([]);
    this.TatMappingArray = this.fb.array([]);
    // this.ticketReasonMaping = this.fb.array([]);
    this.tatForTicketID = "";
    this.teamcondition = "";
    this.createTicketReasonSubCategoryData.subCategoryId = "";
  }

  // pageChangedReasonMappingData(pageNumber) {
  //     this.currentPageReasonMapping = pageNumber;
  // }

  // deleteConfirmonReasonMappingField(reasonMappingFieldIndex: number, reasonMappingFieldId: number) {
  //     if (reasonMappingFieldIndex || reasonMappingFieldIndex == 0) {
  //         this.confirmationService.confirm({
  //             message: "Do you want to delete this Reason?",
  //             header: "Delete Confirmation",
  //             icon: "pi pi-info-circle",
  //             accept: () => {
  //                 this.onRemoveReasonMapping(reasonMappingFieldIndex, reasonMappingFieldId);
  //             },
  //             reject: () => {
  //                 this.messageService.add({
  //                     severity: "info",
  //                     summary: "Rejected",
  //                     detail: "You have rejected"
  //                 });
  //             }
  //         });
  //     }
  // }

  // async onRemoveReasonMapping(reasonMappingFieldIndex: number, reasonMappingFieldId: number) {
  //     this.ticketReasonMaping.removeAt(reasonMappingFieldIndex);
  // }

  TotalItemPerPage(event) {
    this.ticketReasonSubCategoryListdataitemsPerPage = Number(event.value);
    if (this.currentPageTicketReasonSubCategoryListdata > 1) {
      this.currentPageTicketReasonSubCategoryListdata = 1;
    }
    if (!this.searchkey) {
      this.getTicketReasonSubCategoryDataList(this.showItemPerPage);
    } else {
      this.searchTrsc();
    }
  }

  pageChangedTrscList(pageNumber) {
    this.currentPageTicketReasonSubCategoryListdata = pageNumber;
    if (this.searchkey) {
      this.searchTrsc();
    } else {
      this.getTicketReasonSubCategoryDataList("");
    }
  }

  editTicketReasonSubCategory(id) {
    this.tatForTicketID = "";
    this.teamcondition = "";

    this.ticketReasonSubCatFormGroup.reset();
    // this.ticketReasonMapingForm.reset();
    this.isTicketReasonSubCategoryEdit = true;

    this.listTicket = false;
    this.createTicket = true;

    // this.ticketReasonMaping = this.fb.array([]);
    this.teamConditionArray = this.fb.array([]);
    this.TatMappingArray = this.fb.array([]);
    this.orderid = 0;
    this.ticketCatogryData = [];
    let catogaryData = [];

    const url = "/CaseSubCategory/" + id;
    this.taskSubCategory.getMethod(url).subscribe(
      (response: any) => {
        if (response.responseCode == 200) {
          this.editTicketReasonSubCategoryData = response.data;
          this.ticketReasonSubCatFormGroup.patchValue({
            subCategoryName: this.editTicketReasonSubCategoryData.subCategoryName,
            status: this.editTicketReasonSubCategoryData.status,
            discription: this.editTicketReasonSubCategoryData.discription
            // parentCategory: this.editTicketReasonSubCategoryData.parentCategory.id,
            // isDefaultSubProblemDomain:
            //   this.editTicketReasonSubCategoryData.isDefaultSubProblemDomain
          });

          // this.ticketReasonMaping = this.fb.array([]);
          // this.editTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList.forEach(
          //     element => {
          //         this.ticketReasonMaping.push(this.fb.group(element));
          //     }
          // );
          // this.ticketReasonMaping.patchValue(
          //     this.editTicketReasonSubCategoryData.ticketSubCategoryGroupReasonMappingList
          // );
          catogaryData = this.editTicketReasonSubCategoryData.caseSubCategoryCategoryMappingList;
          if (catogaryData.length > 0) {
            catogaryData.forEach((element, i) => {
              let n = i + 1;
              this.ticketCatogryData.push(element.caseCategoryId);
              if (n == catogaryData.length) {
                this.ticketReasonSubCatFormGroup.patchValue({
                  parentCategory: this.ticketCatogryData
                });
              }
            });
          }

          // let data = [];
          // response.data.ticketSubCategoryTatMappingList.forEach((element, i) => {
          //     let queryData = [];
          //     this.orderid = i + 1;
          //     let teamcondition = "";
          //     if (element.tatQueryFieldMappingList.length > 0) {
          //         let queryDataLength = element.tatQueryFieldMappingList.length - 1;
          //         queryData = element.tatQueryFieldMappingList;

          //         queryData.forEach((element, index) => {
          //             if (index > 0) {
          //                 this.conditionDataEnableDisble.push(true);
          //             }
          //             if (queryDataLength != index) {
          //                 teamcondition =
          //                     teamcondition +
          //                     " " +
          //                     element.queryField +
          //                     " " +
          //                     element.queryOperator +
          //                     " " +
          //                     element.queryValue +
          //                     " " +
          //                     element.queryCondition;
          //             } else {
          //                 teamcondition =
          //                     teamcondition +
          //                     " " +
          //                     element.queryField +
          //                     " " +
          //                     element.queryOperator +
          //                     element.queryValue;
          //             }
          //         });
          //     }

          //     this.TatMappingArray.push(
          //         this.fb.group({
          //             id: [element.id],
          //             orderid: [element.orderid],
          //             teamcondition: [teamcondition],
          //             tatForTicketID: [element.ticketTatMatrix.id],
          //             tatQueryFieldMappingList: [element.tatQueryFieldMappingList],
          //             caseSubCategoryId: [id]
          //         })
          //     );
          // });
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
    let data: any = {
      filters: [
        {
          filterValue: "",
          filterColumn: "name"
        }
      ],
      page: "",
      pageSize: ""
    };
    if (this.searchTrscName && !this.searchParentTrcName) {
      this.searchData.filters[0].filterColumn = "name";
      this.searchData.filters[0].filterValue = this.searchTrscName.trim();
      this.searchData.page = this.currentPageTicketReasonSubCategoryListdata;
      this.searchData.pageSize = this.ticketReasonSubCategoryListdataitemsPerPage;
      data = this.searchData;
    } else if (!this.searchTrscName && this.searchParentTrcName) {
      this.searchData.filters[0].filterColumn = "parentCategoryName";
      this.searchData.filters[0].filterValue = this.searchParentTrcName.categoryName;
      this.searchData.page = this.currentPageTicketReasonSubCategoryListdata;
      this.searchData.pageSize = this.ticketReasonSubCategoryListdataitemsPerPage;
      data = this.searchData;
    } else if (this.searchTrscName && this.searchParentTrcName) {
      this.searchAllData.filters[0].filterValue = this.searchTrscName.trim();
      this.searchAllData.filters[1].filterValue = this.searchParentTrcName.categoryName;
      this.searchAllData.page = this.currentPageTicketReasonSubCategoryListdata;
      this.searchAllData.pageSize = this.ticketReasonSubCategoryListdataitemsPerPage;
      data = this.searchAllData;
    }

    // console.log("this.searchData", this.searchData)
    const url = "/CaseSubCategory/searchAll";
    this.taskSubCategory.postMethod(url, data).subscribe(
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
    this.getTicketReasonSubCategoryDataList("");
    this.listTicket = true;
    this.createTicket = false;
  }

  deleteConfirmonTicketReasonSubCat(TrscData) {
    if (TrscData) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Ticket Sub Category?",
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
    const url = "/CaseSubCategory/delete";
    this.taskSubCategory.postMethod(url, data).subscribe(
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

    // let teamcondition = "";
    // data1 = this.viewTrscData.ticketSubCategoryTatMappingList;
    // data1.forEach(element => {
    //     let queryData = [];
    //     let teamcondition = "";
    //     if (element.tatQueryFieldMappingList.length > 0) {
    //         let queryDataLength = element.tatQueryFieldMappingList.length - 1;
    //         queryData = element.tatQueryFieldMappingList;
    //         queryData.forEach((element, index) => {
    //             if (index > 0) {
    //                 this.conditionDataEnableDisble.push(true);
    //             }
    //             if (queryDataLength != index) {
    //                 teamcondition =
    //                     teamcondition +
    //                     " " +
    //                     element.queryField +
    //                     " " +
    //                     element.queryOperator +
    //                     " " +
    //                     element.queryValue +
    //                     " " +
    //                     element.queryCondition;
    //             } else {
    //                 teamcondition =
    //                     teamcondition +
    //                     " " +
    //                     element.queryField +
    //                     " " +
    //                     element.queryOperator +
    //                     element.queryValue;
    //             }
    //         });
    //     }

    //     this.coditionArrayShow.push(teamcondition);
    // });
  }

  changeTATPageData(pageNumber) {
    this.currentPageViewTATListdata = pageNumber;
  }

  pageChangedViewReasonData(pageNumber) {
    this.currentPageViewReasonListdata = pageNumber;
  }
  FildDropdownData = [];
  // getFildDropdownValue() {
  //     this.FildDropdownData = [];
  //     let url = `/commonList/generic/CASE_CONDITION`;
  //     this.commondropdownService.getMethodWithCache(url).subscribe((response: any) => {
  //         this.FildDropdownData = response.dataList;
  //     });
  // }

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
      !this.ticketReasonSubCatFormGroup.dirty
      // && !this.ticketReasonMapingForm.dirty &&
      // !this.ticketReasonMaping.dirty
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
    // const url = "/CaseCategory/isReasonSubCategoryDefault";

    // if (parentIds.length > 0) {
    //     this.taskSubCategory.postMethod(url, parentIds).subscribe(
    //         (response: any) => {
    //             if (response.data) {
    //                 let isProblemDomain = response.data ? response.data : false;
    //                 if (this.isTicketReasonSubCategoryEdit) {
    //                     if (JSON.stringify(parentIds) === JSON.stringify(this.ticketCatogryData)) {
    // this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").enable();
    //     this.subProbleDomainPatchValue(isProblemDomain);
    // } else {
    // this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").disable();
    //         this.subProbleDomainPatchValue(false);
    //     }
    // } else {
    // this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").disable();
    //         this.subProbleDomainPatchValue(false);
    //     }
    // } else {
    // this.ticketReasonSubCatFormGroup.get("isDefaultSubProblemDomain").enable();
    //                 this.subProbleDomainPatchValue(false);
    //             }
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
  }

  subProbleDomainPatchValue(isdefault: boolean) {
    // this.ticketReasonSubCatFormGroup.patchValue({
    //     isDefaultSubProblemDomain: isdefault
    // });
  }

  closeSubProblemDomainDetailsModel() {
    this.ticketReasonSubCatdialoge = false;
  }
}
