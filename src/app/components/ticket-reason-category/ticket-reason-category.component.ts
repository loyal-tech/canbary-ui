import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable, Observer } from "rxjs";
import { TicketReasonCategory } from "src/app/components/model/ticket-reason-category";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { TICKETING_SYSTEMS } from "src/app/constants/aclConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { Regex } from "src/app/constants/regex";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { LoginService } from "src/app/service/login.service";
import { TicketReasonCategoryService } from "src/app/service/ticket-reason-category.service";
@Component({
  selector: "app-ticket-reason-category",
  templateUrl: "./ticket-reason-category.component.html",
  styleUrls: ["./ticket-reason-category.component.css"]
})
export class TicketReasonCategoryComponent implements OnInit {
  AclClassConstants;
  AclConstants;
  public loginService: LoginService;
  ticketReasonCatFormGroup: FormGroup;
  ticketReasonCategoryTAT: FormArray;
  ticketReasonCategoryTATForm: FormGroup;
  submitted = false;
  statusOptions = RadiusConstants.status;
  serviceData: any;
  teamListData: any;
  ticketReasonCategoryTATSubmitted = false;
  currentPageTicketReasonCategoryTAT = 1;
  ticketReasonCategoryTATitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  ticketReasonCategoryTATtotalRecords: string;
  actionData: any;
  timeUnitData: any;
  createTicketReasonCategoryData: TicketReasonCategory;
  currentPageTicketReasonCategoryListdata = 1;
  ticketReasonCategoryListdataitemsPerPage = RadiusConstants.PER_PAGE_ITEMS;
  ticketReasonCategoryListDatatotalRecords: any;
  ticketReasonCategoryListData: any;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage: any;
  isTicketReasonCategoryEdit = false;
  editTicketReasonCategoryData: TicketReasonCategory;
  searchkey: string;
  searchTrcName: any = "";
  searchService: any = "";
  searchData: any;
  searchAllData: any;
  listView = true;
  createView = false;
  detailView = false;
  viewTrcData: any;
  currentPageViewTATListdata = 1;
  viewTATListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  viewTATListDatatotalRecords: any;
  levelData = [];
  departmentTypeData: any;

  createAccess: boolean = false;
  deleteAccess: boolean = false;
  editAccess: boolean = false;
  pageItem = RadiusConstants.PER_PAGE_ITEMS;
  mvnoId: any;
 accessibilityData: any;
    caseTypeData: any;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ticketReasonCategoryService: TicketReasonCategoryService,
    loginService: LoginService,
    private commondropdownService: CommondropdownService,
    private customermanagementService: CustomermanagementService
  ) {
    this.loginService = loginService;
    this.AclClassConstants = AclClassConstants;
    this.AclConstants = AclConstants;

    this.createAccess = loginService.hasPermission(TICKETING_SYSTEMS.PROBLEM_DOMAIN_CREATE);
    this.deleteAccess = loginService.hasPermission(TICKETING_SYSTEMS.PROBLEM_DOMAIN_DELETE);
    this.editAccess = loginService.hasPermission(TICKETING_SYSTEMS.PROBLEM_DOMAIN_EDIT);

    // this.isTicketReasonCategoryEdit = !createAccess && editAccess ? true : false;
  }

  ngOnInit(): void {
    this.ticketReasonCatFormGroup = this.fb.group({
      categoryName: ["", Validators.required],
      status: ["", Validators.required],
      service: ["", Validators.required],
      department: ["", Validators.required],
      slaTimeP1: ["", Validators.required],
      slaTimeP2: ["", Validators.required],
      slaTimeP3: ["", Validators.required],
      slaUnitP1: ["", Validators.required],
      slaUnitP2: ["", Validators.required],
      slaUnitP3: ["", Validators.required],
      isDefaultProblemDomain: [false],
      types:[[], Validators.required]

    });
    this.ticketReasonCategoryTATForm = this.fb.group({
      orderNumber: ["", Validators.required],
      teamId: [""],
      time: ["", [Validators.pattern(Regex.numeric), Validators.required]],
      timeUnit: ["", [Validators.required]],
      action: ["", [Validators.required]],
      mediumTime: ["", [Validators.required]],
      escalatedTime: ["", [Validators.pattern(Regex.numeric), Validators.required]],
      level: ["", [Validators.required]]
    });
    this.ticketReasonCategoryTAT = this.fb.array([]);
    this.actionData = [
      { label: "Notification", value: "Notification" },
      { label: "Reassign", value: "Reassign" },
      { label: "Both", value: "Both" }
    ];
    this.timeUnitData = [
      { label: "Day", value: "Day" },
      { label: "Hour", value: "Hour" },
      { label: "Min", value: "Min" }
    ];
     this.accessibilityData = [
      { label: "Internal", value: "Internal" },
      { label: "CWSC", value: "CWSC" },
      { label: "Both", value: "Both" },
    ];
    this.getService();
    this.getTeamList();
    this.ticketReasonCategoryTAT = this.fb.array([]);
    this.getTicketReasonCategoryDataList("");
    this.levelAllData();
    this.getDepartmentType();
    this.getCaseType();
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
    this.searchAllData = {
      filters: [
        {
          filterValue: "",
          filterColumn: "name"
        },
        {
          filterValue: "",
          filterColumn: "service"
        }
      ],
      page: "",
      pageSize: "",
      sortBy: "createdate",
      sortOrder: 0
    };
    this.mvnoId = localStorage.getItem("mvnoId");
  }

  levelAllData() {
    for (let i = 1; i < 100; i++) {
      this.levelData.push({ label: `Level ${i}` });
    }
  }

  getTicketReasonCategoryDataList(list) {
    let size;
    this.searchkey = "";

    const page = this.currentPageTicketReasonCategoryListdata;
    if (list) {
      size = list;
      this.ticketReasonCategoryListdataitemsPerPage = list;
    } else {
      size = this.ticketReasonCategoryListdataitemsPerPage;
    }

    const pagedata = {
      page,
      pageSize: size
    };
    const url = "/ticketReasonCategory";
    this.ticketReasonCategoryService.postMethod(url, pagedata).subscribe(
      (response: any) => {
        this.ticketReasonCategoryListData = response.dataList;
        this.ticketReasonCategoryListDatatotalRecords = response.totalRecords;
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

  searchViewTrc() {
    this.listView = true;
    this.createView = false;
    this.detailView = false;
    this.pageItem = this.ticketReasonCategoryListdataitemsPerPage;
    this.getTicketReasonCategoryDataList("");
    this.searchTrcName = "";
    this.searchService = "";
    this.ticketReasonCatFormGroup.get("isDefaultProblemDomain").enable();
  }

  createTrc() {
    this.listView = false;
    this.createView = true;
    this.detailView = false;
    this.submitted = false;
    this.isTicketReasonCategoryEdit = false;
    this.ticketReasonCatFormGroup.reset();
    this.ticketReasonCategoryTATForm.reset();
    this.ticketReasonCategoryTAT.controls = [];
    this.ticketReasonCategoryTATForm.patchValue({
      orderNumber: 1,
      level: "Level 1"
    });
  }

  TotalItemPerPage(event) {
    this.ticketReasonCategoryListdataitemsPerPage = Number(event.value);
    this.currentPageTicketReasonCategoryListdata = 1;
    if (this.ticketReasonCategoryListData > 1) {
      this.currentPageTicketReasonCategoryListdata = 1;
    }
    this.getTicketReasonCategoryDataList(this.showItemPerPage);
  }

  pageChangedTrcList(pageNumber) {
    this.currentPageTicketReasonCategoryListdata = pageNumber;
    this.getTicketReasonCategoryDataList("");
  }

  deleteConfirmonTATField(TATFieldIndex: number, TATFieldId: number) {
    if (TATFieldIndex || TATFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this TAT?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveTAT(TATFieldIndex, TATFieldId);
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

  async onRemoveTAT(TATFieldIndex: number, TATFieldId: number) {
    this.ticketReasonCategoryTAT.removeAt(TATFieldIndex);
  }

addEditTicketReasonCat(id) {
    this.submitted = true;
    let ticketCetogaryData: any = [];
    this.ticketReasonCatFormGroup.patchValue({
      slaTimeP1: 1,
      slaTimeP2: 1,
      slaTimeP3: 1,
      slaUnitP1: "Day",
      slaUnitP2: "Day",
      slaUnitP3: "Day"
    });
    if (this.ticketReasonCatFormGroup.value.isDefaultProblemDomain == null) {
      this.ticketReasonCatFormGroup.controls.isDefaultProblemDomain.setValue(false);
    }
    const selectedTypes = this.ticketReasonCatFormGroup.get('types')?.value || [];
    this.ticketReasonCatFormGroup.patchValue({
    types: selectedTypes.map(t => ({
        id: '',
        type: t
    }))
    });


    if (this.ticketReasonCatFormGroup.valid) {
      if (id) {
        const url = "/ticketReasonCategory/update";
        const selectedServices = this.ticketReasonCatFormGroup.value.service;
        const serviceArray = selectedServices.map((serviceId: number) => ({ id: serviceId }));
        this.createTicketReasonCategoryData = this.ticketReasonCatFormGroup.value;
        this.createTicketReasonCategoryData.id = id;
        this.createTicketReasonCategoryData.ticketReasonCategoryTATMappingList =
          this.ticketReasonCategoryTAT.value;
        this.createTicketReasonCategoryData.mvnoId = this.mvnoId;
        this.createTicketReasonCategoryData.service = serviceArray;
        if (this.createTicketReasonCategoryData.ticketReasonCategoryTATMappingList.length < 1) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please add TAT details",
            icon: "far fa-times-circle"
          });
        } else {
          this.ticketReasonCategoryService
            .postMethod(url, this.createTicketReasonCategoryData)
            .subscribe(
              (response: any) => {
                if (response.responseCode == 406 || response.responseCode == 417) {
                  // || response.responseCode == 500
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
                  this.clearTicketReasonCategory();
                  this.isTicketReasonCategoryEdit = false;
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
        ticketCetogaryData = [
          {
            orderNumber: 1,
            teamId: null,
            time: 1,
            timeUnit: "Day",
            action: "Notification",
            mappingId: "",
            escalatedTime: 1,
            mediumTime: 1,
            level: "Level 1"
          }
        ];
        const url = "/ticketReasonCategory/save";
        const selectedServices = this.ticketReasonCatFormGroup.value.service;
        const serviceArray = selectedServices.map((serviceId: number) => ({ id: serviceId }));
        this.createTicketReasonCategoryData = this.ticketReasonCatFormGroup.value;
        this.createTicketReasonCategoryData.mvnoId = this.mvnoId;
        // this.createTicketReasonCategoryData.ticketReasonCategoryTATMappingList = this.ticketReasonCategoryTAT.value;
        this.createTicketReasonCategoryData.ticketReasonCategoryTATMappingList = ticketCetogaryData;
        this.createTicketReasonCategoryData.service = serviceArray;
        if (this.createTicketReasonCategoryData.ticketReasonCategoryTATMappingList.length < 1) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: "Please add TAT details",
            icon: "far fa-times-circle"
          });
        } else {
          this.ticketReasonCategoryService
            .postMethod(url, this.createTicketReasonCategoryData)
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
                  this.clearTicketReasonCategory();
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
  }



  clearTicketReasonCategory() {
    this.ticketReasonCatFormGroup.reset();
    this.submitted = false;
    this.ticketReasonCategoryTAT.controls = [];
    this.listView = true;
    this.createView = false;
    this.getTicketReasonCategoryDataList("");
  }

  getService() {
    const url = "/planservice/all" + "?mvnoId=" + localStorage.getItem("mvnoId");
    this.customermanagementService.getMethod(url).subscribe(
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

  getTeamList() {
    const url = "/teams/getAllTeamsWithoutPagination";
    this.commondropdownService.getMethodWithCache(url).subscribe(
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

  ticketReasonCategoryTATFormGroup(): FormGroup {
    // console.log("this.ticketReasonCategoryTATForm.value.orderNumber", this.ticketReasonCategoryTATForm.value.orderNumber);
    return this.fb.group({
      orderNumber: [this.ticketReasonCategoryTATForm.value.orderNumber, [Validators.required]],
      teamId: [this.ticketReasonCategoryTATForm.value.teamId, [Validators.required]],
      time: [
        this.ticketReasonCategoryTATForm.value.time,
        [Validators.pattern(Regex.numeric), Validators.required]
      ],
      timeUnit: [this.ticketReasonCategoryTATForm.value.timeUnit, [Validators.required]],
      action: [this.ticketReasonCategoryTATForm.value.action, [Validators.required]],
      mappingId: [""],
      escalatedTime: [
        this.ticketReasonCategoryTATForm.value.escalatedTime,
        [Validators.pattern(Regex.numeric), Validators.required]
      ],
      mediumTime: [this.ticketReasonCategoryTATForm.value.mediumTime, Validators.required],
      level: [this.ticketReasonCategoryTATForm.value.level, Validators.required]
    });
  }

  onAddticketReasonCategoryTATField() {
    this.ticketReasonCategoryTATSubmitted = true;
    if (this.ticketReasonCategoryTATForm.valid) {
      this.ticketReasonCategoryTAT.push(this.ticketReasonCategoryTATFormGroup());
      this.ticketReasonCategoryTATForm.reset();
      this.ticketReasonCategoryTATSubmitted = false;
      let orderN = this.ticketReasonCategoryTAT.length + 1;
      let level = `Level ${orderN}`;

      this.ticketReasonCategoryTATForm.patchValue({
        orderNumber: orderN,
        level: level
      });
    }
  }

  pageChangedticketReasonCategoryTATData(pageNumber) {
    this.currentPageTicketReasonCategoryTAT = pageNumber;
  }

   editTicketReasonCategory(id) {
    this.ticketReasonCatFormGroup.reset();
    this.ticketReasonCategoryTATForm.reset();
    this.isTicketReasonCategoryEdit = true;
    this.listView = false;
    this.createView = true;
    this.detailView = false;

    if (this.ticketReasonCategoryTAT.controls) {
      this.ticketReasonCategoryTAT.controls = [];
    }

    const url = "/ticketReasonCategory/" + id;
    this.ticketReasonCategoryService.getMethod(url).subscribe(
      (response: any) => {
        this.editTicketReasonCategoryData = response.data;
        const serviceIds: number[] = (this.editTicketReasonCategoryData.service || []).map(
          (s: any) => s.id
        );

        if (serviceIds.length > 0) {
          this.onEditCheckDefault(serviceIds.join(","), this.editTicketReasonCategoryData.id);
        }
        const types = (this.editTicketReasonCategoryData.types || []).map(
        (t: any) => t.type 
        );
        this.ticketReasonCatFormGroup.patchValue({
          categoryName: this.editTicketReasonCategoryData.categoryName,
          status: this.editTicketReasonCategoryData.status,
          service: serviceIds,
          slaTimeP1: this.editTicketReasonCategoryData.slaTimeP1,
          slaTimeP2: this.editTicketReasonCategoryData.slaTimeP2,
          slaTimeP3: this.editTicketReasonCategoryData.slaTimeP3,
          slaUnitP1: this.editTicketReasonCategoryData.slaUnitP1,
          slaUnitP2: this.editTicketReasonCategoryData.slaUnitP2,
          slaUnitP3: this.editTicketReasonCategoryData.slaUnitP3,
          department: this.editTicketReasonCategoryData.department,
          isDefaultProblemDomain: this.editTicketReasonCategoryData.isDefaultProblemDomain,
         types: types
        });

        this.ticketReasonCategoryTAT = this.fb.array([]);
        this.editTicketReasonCategoryData.ticketReasonCategoryTATMappingList.forEach(element => {
          this.ticketReasonCategoryTAT.push(this.fb.group(element));
        });
        this.ticketReasonCategoryTAT.patchValue(
          this.editTicketReasonCategoryData.ticketReasonCategoryTATMappingList
        );

        let orderN = this.ticketReasonCategoryTAT.length + 1;
        let level = `Level ${orderN}`;
        this.ticketReasonCategoryTATForm.patchValue({
          orderNumber: orderN,
          level: level
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


  trcAllDetails(data) {
    this.listView = false;
    this.createView = false;
    this.detailView = true;
    this.viewTrcData = data;
    // console.log("this.viewTrcData", this.viewTrcData);
  }

  deleteConfirmonTicketReasonCat(TrcData) {
    if (TrcData) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Ticket Problem Domain?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteTrc(TrcData);
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

  searchTrc() {
    if (!this.searchkey || this.searchkey !== this.searchData) {
      this.currentPageTicketReasonCategoryListdata = 1;
    }
    this.searchkey = this.searchData;
    if (this.showItemPerPage) {
      this.ticketReasonCategoryListdataitemsPerPage = this.showItemPerPage;
    }
    let data: any = {
      filters: [
        {
          filterValue: "",
          filterColumn: "name"
        }
      ],
      page: this.currentPageTicketReasonCategoryListdata,
      pageSize: this.ticketReasonCategoryListdataitemsPerPage,
      sortBy: "createdate"
    };
    if (this.searchTrcName && !this.searchService) {
      this.searchData.filters[0].filterColumn = "name";
      this.searchData.filters[0].filterValue = this.searchTrcName.trim();
      this.searchData.page = this.currentPageTicketReasonCategoryListdata;
      this.searchData.pageSize = this.ticketReasonCategoryListdataitemsPerPage;
      data = this.searchData;
    } else if (!this.searchTrcName && this.searchService) {
      this.searchData.filters[0].filterColumn = "service";
      this.searchData.filters[0].filterValue = this.searchService;
      this.searchData.page = this.currentPageTicketReasonCategoryListdata;
      this.searchData.pageSize = this.ticketReasonCategoryListdataitemsPerPage;
      data = this.searchData;
    } else if (this.searchTrcName && this.searchService) {
      this.searchAllData.filters[0].filterValue = this.searchTrcName.trim();
      this.searchAllData.filters[1].filterValue = this.searchService;
      this.searchAllData.page = this.currentPageTicketReasonCategoryListdata;
      this.searchAllData.pageSize = this.ticketReasonCategoryListdataitemsPerPage;
      data = this.searchAllData;
    }

    // console.log("this.searchData", this.searchData)
    const url = "/ticketReasonCategory/searchAll";
    this.ticketReasonCategoryService.postMethod(url, data).subscribe(
      (response: any) => {
        if (response?.dataList?.length > 0) {
          this.ticketReasonCategoryListData = response.dataList;
          this.ticketReasonCategoryListDatatotalRecords = response.totalRecords;
        } else {
          this.ticketReasonCategoryListData = [];
          this.ticketReasonCategoryListDatatotalRecords = 0;
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: "No Record Found",
            icon: "far fa-times-circle"
          });
        }
      },
      (error: any) => {
        this.ticketReasonCategoryListDatatotalRecords = 0;
        if (error.error.status == 404) {
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: error.error.msg,
            icon: "far fa-times-circle"
          });
          this.ticketReasonCategoryListData = [];
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

  clearSearchTrc() {
    this.searchTrcName = "";
    this.searchService = "";
    this.getTicketReasonCategoryDataList("");
  }

  deleteTrc(data) {
    const url = "/ticketReasonCategory/delete";
    this.ticketReasonCategoryService.postMethod(url, data).subscribe(
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
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (
            this.currentPageTicketReasonCategoryListdata != 1 &&
            this.ticketReasonCategoryListData.length == 1
          ) {
            this.currentPageTicketReasonCategoryListdata =
              this.currentPageTicketReasonCategoryListdata - 1;
          }
          if (!this.searchkey) {
            this.getTicketReasonCategoryDataList("");
          } else {
            this.searchTrc();
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

  pageChangedViewTAT(pageNumber) {
    this.currentPageViewTATListdata = pageNumber;
  }

  getDepartmentType() {
    const url = "/commonList/departmentType";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.departmentTypeData = response.dataList;

        this.searchkey = "";
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

  canExit() {
    if (!this.ticketReasonCatFormGroup.dirty) return true;
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

  onServiceChange(event: any) {
    let serviceId = event.value;
    const url = "/ticketReasonCategory/isReasonCategoryDefault?serviceId=" + serviceId;
    this.ticketReasonCategoryService.getMethod(url).subscribe(
      (response: any) => {
        if (response.data) {
          let isProblemDomain = response.data ? response.data : false;
          if (this.isTicketReasonCategoryEdit) {
            if (
              serviceId == this.editTicketReasonCategoryData.service.id &&
              this.editTicketReasonCategoryData.id == response.dataList[0].id
            ) {
              this.ticketReasonCatFormGroup.get("isDefaultProblemDomain").enable();
              this.probleDomainPatchValue(isProblemDomain);
            } else {
              this.ticketReasonCatFormGroup.get("isDefaultProblemDomain").disable();
              this.probleDomainPatchValue(false);
            }
          } else {
            this.ticketReasonCatFormGroup.get("isDefaultProblemDomain").disable();
            this.probleDomainPatchValue(false);
          }
        } else {
          this.ticketReasonCatFormGroup.get("isDefaultProblemDomain").enable();
          this.probleDomainPatchValue(false);
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

  probleDomainPatchValue(isdefault: boolean) {
    this.ticketReasonCatFormGroup.patchValue({
      isDefaultProblemDomain: isdefault
    });
  }

  onEditCheckDefault(serviceId, reasonId) {
    const url = "/ticketReasonCategory/isReasonCategoryDefault?serviceId=" + serviceId;
    this.ticketReasonCategoryService.getMethod(url).subscribe(
      (response: any) => {
        if (response.data) {
          let isProblemDomain = response.data ? response.data : false;
          if (reasonId == response.dataList[0].id) {
            this.ticketReasonCatFormGroup.get("isDefaultProblemDomain").enable();
            this.probleDomainPatchValue(isProblemDomain);
          } else {
            this.ticketReasonCatFormGroup.get("isDefaultProblemDomain").disable();
            this.probleDomainPatchValue(false);
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
