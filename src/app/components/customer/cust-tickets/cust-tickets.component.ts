import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { DatePipe } from "@angular/common";
import * as FileSaver from "file-saver";
import { TicketManagementService } from "../../../service/ticket-management.service";
import { CustomerService } from "src/app/service/customer.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { LoginService } from "src/app/service/login.service";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
declare var $: any;
@Component({
  selector: "app-cust-tickets",
  templateUrl: "./cust-tickets.component.html",
  styleUrls: ["./cust-tickets.component.scss"]
})
export class CustTicketsComponent implements OnInit {
  custType: any;
  // loggedInStaffId = localStorage.getItem("userId");
  // partnerId = Number(localStorage.getItem("partnerId"));
  customerId: number;
  custData: any = {};

  custTicketList: any = [];

  isDisable: boolean = false;
  createTicketAccess: boolean = false;

  pageLimitOptions = RadiusConstants.pageLimitOptions;
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  totalRecords: String;
  ticketShowItemPerPage = 1;
  ticketBaseTotalRecords: any;

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
  serviceAreaList: any;
  serviceAreaDetail : boolean = false;
  staffDetailModal : boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    public PaymentamountService: PaymentamountService,
    private customerManagementService: CustomermanagementService,
    private ticketManagementService: TicketManagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    private route: ActivatedRoute,
    public customerService: CustomerService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private datePipe: DatePipe,
    loginService: LoginService
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.createTicketAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_TICKETS_CREATE_TICKET
        : POST_CUST_CONSTANTS.POST_CUST_TICKETS_CREATE_TICKETS
    );
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  async ngOnInit() {
    let custData1 = history.state.data;
    this.getCustomersDetail(this.customerId);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custData = response.customers;
        this.getcustTicket(custId, "");
      },
      (error: any) => {
        // console.log(error, "error")
      }
    );
  }

  customerDetailOpen() {
    this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
  }

  getcustTicket(custId, size) {
    const page = this.currentPage || 1;

    if (size) {
      this.itemsPerPage = size;
    } else if (this.ticketShowItemPerPage === 1) {
      this.itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    } else {
      this.itemsPerPage = this.ticketShowItemPerPage;
    }

    const url = "/case/getCasesByCustomer/" + custId;
    const ticketData = {
      page: page,
      pageSize: this.itemsPerPage
    };

    this.ticketManagementService.postMethod(url, ticketData).subscribe(
      (response: any) => {
        this.custTicketList = response.dataList;
        this.totalRecords = response.totalRecords;
        if (response.responseMessage) {
          this.messageService.add({
            severity: this.custTicketList?.length ? "success" : "info",
            summary: "Message",
            detail: response.responseMessage,
            icon: "far fa-info-circle"
          });
        }
      },
      (error: any) => {
        const errorMessage = error?.error?.ERROR;
        this.messageService.add({
          severity: errorMessage ? "error" : "info",
          summary: errorMessage ? "Error" : "Info",
          detail: errorMessage || "Unable to fetch customer tickets.",
          icon: errorMessage ? "far fa-times-circle" : "far fa-info-circle"
        });
      }
    );
  }

  pageChangedTicketConfig(pageNumber) {
    this.currentPage = pageNumber;
    this.getcustTicket(this.custData.id, "");
  }

  TotalTicketItemPerPage(event) {
    this.ticketShowItemPerPage = Number(event.value);
    if (this.currentPage > 1) {
      this.currentPage = 1;
    }
    this.getcustTicket(this.custData.id, this.ticketShowItemPerPage);
  }

  openStaffDetailModal(id) {
    this.staffDetailModal = true;
    let mvnoId =
      localStorage.getItem("mvnoId") === "1"
        ? this.custData?.mvnoId
        : localStorage.getItem("mvnoId");

    const url = "/staffuser/" + id + "?mvnoId=" + mvnoId;
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
  onClickServiceArea() {
    this.serviceAreaList = this.staffData.serviceAreasNameList;
    this.serviceAreaDetail = true;
  }

  closeServiceArea(){
    this.serviceAreaDetail = false;
  }

  closeStaffDetails(){
    this.staffDetailModal = false;
  }
}
