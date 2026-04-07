import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TaskManagementService } from "src/app/service/task-management.service";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";

@Component({
  selector: "app-customer-notes",
  templateUrl: "./customer-notes.component.html",
  styleUrls: ["./customer-notes.component.css"]
})
export class CustomerNotesComponent implements OnInit {
  customerId = 0;
  custType: string = "";
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerNotesList: any = [];
  totalRecords: number;
  custData: any;
  staffData: any = [];
  staffDetailModal: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
  }

  ngOnInit() {
    this.getCustomersDetail(this.customerId);
  }
  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.custData = response.customers;
      this.getAllCustomerNotes();
    });
  }

  getAllCustomerNotes() {
    const url = `/findAllCustomerNotesWithPagination/${this.customerId}?page=${this.currentPage}&pageSize=${this.itemsPerPage}`;
    this.customerNotesList = [];
    this.customerManagementService.getMethodForCustomerNotes(url).subscribe(
      async (response: any) => {
        if (response?.customerNotesList?.length === 0) {
          this.customerNotesList = [];
          this.totalRecords = 0;
        } else {
          this.customerNotesList = (await response.customerNotesList?.content) || [];
          this.totalRecords = (await response?.customerNotesList?.totalElements) || 0;
        }
      },
      (error: any) => {
        this.customerNotesList = [];
        this.totalRecords = 0;
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error?.msg || "Failed to fetch customer notes",
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangeEventForChildCustomers(pageNumber: number) {
    this.currentPage = pageNumber;
    this.getAllCustomerNotes();
  }

  itemPerPageChangeEvent(event) {
    this.currentPage = 1;
    this.itemsPerPage = Number(event.value);
    this.getAllCustomerNotes();
  }

  closeModalStaff() {
    this.staffDetailModal = false;
  }

  serviceAreaDetailModal: boolean = false;
  serviceAreaList: any = [];
  branchId: any;
  serviceareaCheck = true;

  getServiceByBranch(e) {
    this.branchId = e.value;
    this.serviceareaCheck = false;
    const url = "/findServiceAreaByBranchId?BranchId=" + this.branchId;
    this.adoptCommonBaseService.getConnection(url).subscribe((response: any) => {
      this.serviceAreaList = response.serviceAreaList;
      //$("#PlanDetailsShow").modal("show");
    });
  }

  onClickServiceArea() {
    this.serviceAreaList = this.staffData.serviceAreasNameList;
    this.serviceAreaDetailModal = true;
  }

  closeModalOfArea() {
    this.serviceAreaDetailModal = false;
  }

  openStaffDetailModal(staffId) {
    this.staffDetailModal = true;
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");
    const url = "/getStaffUser/" + staffId + "?mvnoId=" + mvnoId;
    this.adoptCommonBaseService.get(url).subscribe(
      (response: any) => {
        this.staffData = response.Staff;
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
