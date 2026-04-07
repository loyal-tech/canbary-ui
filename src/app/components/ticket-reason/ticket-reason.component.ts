import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup, FormControl, FormArray } from "@angular/forms";
import { MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { TicketReasonService } from "src/app/service/ticket-reason.service";
import { Regex } from "src/app/constants/regex";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { ServiceAreaService } from "src/app/service/service-area.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
@Component({
  selector: "app-ticket-reason",
  templateUrl: "./ticket-reason.component.html",
  styleUrls: ["./ticket-reason.component.css"]
})
export class TicketReasonComponent implements OnInit {
  ticketReasonGroupForm: FormGroup;
  caseReasonConfigArray: FormArray;
  resolutionReasonData: any;
  serviceAreaData: any;
  staffUserData: any;
  currentPageCaseReasonConfig = 1;
  caseReasonConfigitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  caseReasonConfigtotalRecords: String;
  submitted: boolean = false;
  createCaseReasonData: any;
  tatConsiderationData: any;
  ticketReasonData: any;
  currentPageTicketReasonConfig = 1;
  ticketReasonConfigitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  ticketReasonConfigtotalRecords: any;
  isTicketReasonEdit: boolean = false;
  viewTicketReasonData: any;
  deletedata: any = {
    id: "",
    cityId: "",
    cityName: "",
    code: "",
    countryId: "",
    countryName: "",
    name: "",
    pincodeId: "",
    stateId: "",
    stateName: "",
    status: "",
    timeUnit: "",
    time: ""
  };

  statusOptions = RadiusConstants.status;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  showItemPerPage = 0;
  searchkey: string;
  totalAreaListLength = 0;
  qutaUnitTime = [
    { label: "Minute", value: "MIN" },
    { label: "Hour", value: "HOUR" },
    { label: "Day", value: "DAY" }
  ];
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private ticketReasonService: TicketReasonService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private commondropdownService: CommondropdownService,
    private serviceAreaService: ServiceAreaService
  ) {}

  ngOnInit(): void {
    this.ticketReasonGroupForm = this.fb.group({
      name: ["", Validators.required],
      status: ["", Validators.required],
      // reasonId: ["", Validators.required],
      tatConsideration: ["", Validators.required],
      timeUnit: ["", Validators.required],
      time: ["", [Validators.required, Validators.pattern(Regex.numeric)]]
    });
    this.caseReasonConfigArray = this.fb.array([]);
    this.getResolutionReasons();
    this.getServiceArea();
    this.getStaffUser();
    this.onAddaseReasonConfigField();
    this.getTatConsideration();
    this.getTicketReason("");
  }

  createCaseReasonConfigFormGroup(): FormGroup {
    return this.fb.group({
      caseReasonName: ["", [Validators.required]],
      // reasonid: ['', [Validators.required]],
      serviceareaid: ["", [Validators.required]],
      staffid: ["", [Validators.required]],
      id: [""]
      // timeUnit: ["", [Validators.required]],
      // time: ["", [Validators.required]],
    });
  }

  onAddaseReasonConfigField() {
    this.caseReasonConfigArray.push(this.createCaseReasonConfigFormGroup());
  }

  TotalItemPerPage(event) {
    this.showItemPerPage = Number(event.value);
    if (this.currentPageTicketReasonConfig > 1) {
      this.currentPageTicketReasonConfig = 1;
    }
    if (!this.searchkey) {
      this.getTicketReason(this.showItemPerPage);
    }
  }

  getTicketReason(list) {
    let size;
    this.searchkey = "";
    let page_list = this.currentPageTicketReasonConfig;
    if (list) {
      size = list;
      this.ticketReasonConfigitemsPerPage = list;
    } else {
      // if (this.showItemPerPage == 0) {
      //   this.ticketReasonConfigitemsPerPage = this.pageITEM
      // } else {
      //   this.ticketReasonConfigitemsPerPage = this.showItemPerPage
      // }
      size = this.ticketReasonConfigitemsPerPage;
    }

    const url = "/caseReason";
    let ticketreasondata = {
      page: page_list,
      pageSize: size
    };
    this.ticketReasonService.postMethod(url, ticketreasondata).subscribe(
      (response: any) => {
        this.ticketReasonData = response.dataList;
        this.ticketReasonConfigtotalRecords = response.totalRecords;
        // console.log("this.ticketReasonData", this.ticketReasonData);

        // if (this.showItemPerPage > this.ticketReasonConfigitemsPerPage) {
        //   this.totalAreaListLength =
        //     this.ticketReasonData.length % this.showItemPerPage
        // } else {
        //   this.totalAreaListLength =
        //     this.ticketReasonData.length % this.ticketReasonConfigitemsPerPage
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

  getTatConsideration() {
    const url = "/commonList/TATConsideration";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.tatConsiderationData = response.dataList;
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

  getResolutionReasons() {
    const url = "/resolutionReasons/all?mvnoId=" + localStorage.getItem("mvnoId");
    this.ticketReasonService.getMethod(url).subscribe(
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
  }

  getServiceArea() {
    const url = "/serviceArea/all";
    this.commondropdownService.getMethodWithCache(url).subscribe(
      (response: any) => {
        this.serviceAreaData = response.dataList;
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

  getStaffUser() {
    const url = "/staffuser/allActive";
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.staffUserData = response.staffUserlist;
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

  addEditTicketReason(ticketReasonId) {
    this.submitted = true;
    if (this.ticketReasonGroupForm.valid) {
      if (ticketReasonId) {
        const url = "/caseReason/update";
        this.createCaseReasonData = this.ticketReasonGroupForm.value;
        // this.createCaseReasonData.caseReasonConfigList = this.caseReasonConfigArray.value;
        // this.createCaseReasonData.caseReasonConfigList[0].reasonid = "1";
        this.createCaseReasonData.reasonId = ticketReasonId;
        //return
        this.ticketReasonService.postMethod(url, this.createCaseReasonData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.ticketReasonGroupForm.reset();
              this.getTicketReason("");
              this.isTicketReasonEdit = false;
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
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
        const url = "/caseReason/save";
        this.createCaseReasonData = this.ticketReasonGroupForm.value;
        // this.createCaseReasonData.caseReasonConfigList = this.caseReasonConfigArray.value;
        // this.createCaseReasonData.caseReasonConfigList[0].reasonid = "1";
        delete this.createCaseReasonData.reasonId;
        //return
        this.ticketReasonService.postMethod(url, this.createCaseReasonData).subscribe(
          (response: any) => {
            if (response.responseCode == 406) {
              this.messageService.add({
                severity: "error",
                summary: "Error",
                detail: response.responseMessage,
                icon: "far fa-times-circle"
              });
            } else {
              this.ticketReasonGroupForm.reset();
              this.getTicketReason("");
              this.messageService.add({
                severity: "success",
                summary: "Successfully",
                detail: response.message,
                icon: "far fa-check-circle"
              });
              this.submitted = false;
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

  editTicketReason(ticketReasonId) {
    if (ticketReasonId) {
      this.isTicketReasonEdit = true;
      // this.getTicketReasonById(ticketReasonId);
      // setTimeout(() => {
      //   this.ticketReasonGroupForm.patchValue(this.viewTicketReasonData);
      //
      // }, 1000)

      const url = "/caseReason/" + ticketReasonId;
      this.ticketReasonService.getMethod(url).subscribe(
        (response: any) => {
          this.viewTicketReasonData = response.data;
          this.ticketReasonGroupForm.patchValue(this.viewTicketReasonData);
          this.deletedata = this.viewTicketReasonData;
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

  getTicketReasonById(ticketReasonId) {
    const url = "/caseReason/" + ticketReasonId;
    this.ticketReasonService.getMethod(url).subscribe(
      (response: any) => {
        this.viewTicketReasonData = response.data;
        this.deletedata = this.viewTicketReasonData;
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

  deleteConfirmonTicketReason(ticketReasonId: number) {
    this.getTicketReasonById(ticketReasonId);
    if (ticketReasonId) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Ticket Reason?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.deleteTicketReason(ticketReasonId);
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

  deleteTicketReason(ticketReasonId) {
    const url = "/caseReason/delete";
    //this.deletedata.pincodeId = pincodeId;
    // console.log("this.createQosPolicyData", this.deletedata);
    this.ticketReasonService.postMethod(url, this.deletedata).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          if (this.currentPageTicketReasonConfig != 1 && this.totalAreaListLength == 1) {
            this.currentPageTicketReasonConfig = this.currentPageTicketReasonConfig - 1;
          }
          this.messageService.add({
            severity: "success",
            summary: "Successfully",
            detail: response.responseMessage,
            icon: "far fa-check-circle"
          });
          this.getTicketReason("");
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

  deleteConfirmonCaseReasonConfigField(
    caseReasonConfigFieldIndex: number,
    caseReasonConfigFieldId: number
  ) {
    if (caseReasonConfigFieldIndex || caseReasonConfigFieldIndex == 0) {
      this.confirmationService.confirm({
        message: "Do you want to delete this Case Reason Config?",
        header: "Delete Confirmation",
        icon: "pi pi-info-circle",
        accept: () => {
          this.onRemoveCaseReasonConfig(caseReasonConfigFieldIndex, caseReasonConfigFieldId);
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

  async onRemoveCaseReasonConfig(
    caseReasonConfigFieldIndex: number,
    caseReasonConfigFieldId: number
  ) {
    this.caseReasonConfigArray.removeAt(caseReasonConfigFieldIndex);
  }

  pageChangedCaseReasonConfig(pageNumber) {
    this.currentPageCaseReasonConfig = pageNumber;
  }

  pageChangedTicketReasonConfig(pageNumber) {
    this.currentPageTicketReasonConfig = pageNumber;
    this.getTicketReason("");
  }
}
