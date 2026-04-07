import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerService } from "src/app/service/customer.service";
import { StaffService } from "src/app/service/staff.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";

declare var $: any;

@Component({
  selector: "app-select-staff",
  templateUrl: "./select-staff.component.html",
  styleUrls: ["./select-staff.component.css"]
})
export class SelectStaffComponent implements OnInit {
  @Input() selectedStaff: any = [];
  @Input() isPaymentOwnerType: boolean = false;
  @Output() selectedStaffChange = new EventEmitter();
  @Output() closeStaff = new EventEmitter();
  newFirst = 0;

  parentStaffListdataitemsPerPageForStaff = RadiusConstants.ITEMS_PER_PAGE;
  parentstaffListdatatotalRecords: any;
  currentPageParentStaffListdata = 1;

  searchDeatil = "";
  staffData = [];
  displayDTVHistory: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private customerService: CustomerService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.newFirst = 0;
    this.getStaffDetailById();
    // this.selectedStaff = [];
    this.displayDTVHistory = true;
  }

  getStaffDetailById() {
    let currentPageForStaff;
    currentPageForStaff = this.currentPageParentStaffListdata;
    const data = {
      page: currentPageForStaff,
      pageSize: this.parentStaffListdataitemsPerPageForStaff
    };

    const url = "/staffuser/Activestaff?product=BSS";
    this.adoptCommonBaseService.post(url, data).subscribe((response: any) => {
      this.staffData = response.staffUserlist;
      this.parentstaffListdatatotalRecords = response.pageDetails.totalRecords;
      // this.staffDataList.forEach((element, i) => {
      //   element.displayLabel = element.fullName + " (Ph: " + element.phone + ")";
      //   this.data.push(element.id);
        if (this.isPaymentOwnerType) {
        if (this.commondropdownService.isChangeStaff) {
            const matchedStaff = this.staffData.find(staff => staff.id === this.selectedStaff[0].id);
            if (matchedStaff) {
            this.selectedStaff = matchedStaff;
            }
        } else {
            let userId = Number(localStorage.getItem("userId"));
            const matchedStaff = this.staffData.find(staff => staff.id === userId);
            if (matchedStaff) {
            this.selectedStaff = matchedStaff;
            }
        }
        }

    });
  }

  searchStaffByName() {
    this.newFirst = 0;

    var searchData = {
      filters: [
        {
          filterDataType: "",
          filterValue: this.searchDeatil.trim(),
          filterColumn: "any",
          filterOperator: "equalto",
          filterCondition: "and"
        },
        {
          filterColumn: "status",
          filterValue: "Active",
          filterOperator: "equalto",
          filterCondition: "and"
        }
      ],
      page: this.currentPageParentStaffListdata,
      pageSize: this.parentStaffListdataitemsPerPageForStaff
    };
    this.staffService.staffSearch(searchData).subscribe(
      (response: any) => {
        if (response.responseCode === 404 || response.responseCode === 204) {
          this.parentstaffListdatatotalRecords = 0;
          this.staffData = [];
          this.messageService.add({
            severity: "info",
            summary: "Info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.staffData = response.dataList;
         if (this.isPaymentOwnerType) {
            if (this.commondropdownService.isChangeStaff) {
                const matchedStaff = this.staffData.find(staff => staff.id === this.selectedStaff[0].id);
                if (matchedStaff) {
                this.selectedStaff = matchedStaff;
                }
            } else {
                let userId = Number(localStorage.getItem("userId"));
                const matchedStaff = this.staffData.find(staff => staff.id === userId);
                if (matchedStaff) {
                this.selectedStaff = matchedStaff;
                }
            }
            }

           this.parentstaffListdatatotalRecords = response.totalRecords;
        }
      },
      (error: any) => {
        this.parentstaffListdatatotalRecords = 0;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  paginateStaff(event) {
    this.currentPageParentStaffListdata = event.page + 1;
    // this.newFirst = event.first;
    this.parentStaffListdataitemsPerPageForStaff = event.rows;
    if (this.searchDeatil) {
      this.searchStaffByName();
    } else {
      this.getStaffDetailById();
    }
  }

  clearSearchForm() {
    this.searchDeatil = "";

    this.currentPageParentStaffListdata = 1;
    this.getStaffDetailById();
  }

  saveSelstaff() {
    this.selectedStaffChange.emit(this.selectedStaff);
    this.commondropdownService.isChangeStaff = true;
    
    // this.staffCustList = [
    //   
    //     id: Number(this.selectedStaffCust.id),
    //     name: this.selectedStaffCust.firstname,
    //   },
    // ];
    // this.modalCloseStaff();
    this.modalCloseStaff();
  }

  modalCloseStaff() {
    this.displayDTVHistory = false;
    this.closeStaff.emit();
    this.currentPageParentStaffListdata = 1;
    this.newFirst = 1;
    this.searchDeatil = "";
    this.staffData = [];
  }
}
