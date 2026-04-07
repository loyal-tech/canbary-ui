import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { InvoicePaymentListService } from "src/app/service/invoice-payment-list.service";
import { LoginService } from "src/app/service/login.service";
import { AclClassConstants } from "src/app/constants/aclClassConstants";
import { AclConstants } from "src/app/constants/aclOperationConstants";
import { CustomerdetailsilsService } from "src/app/service/customerdetailsils.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";

declare var $: any;

@Component({
    selector: "app-call-details",
    templateUrl: "./call-details.component.html",
    styleUrls: ["./call-details.component.scss"]
})
export class CallDetailsComponent implements OnInit {
    @Input() custData: any;
    @Input() isCustCAF: boolean = false;
    @Output() backButton = new EventEmitter();
    custType: any;
    loggedInStaffId = localStorage.getItem("userId");
    partnerId = Number(localStorage.getItem("partnerId"));
    customerId: number;
    callDetailsListData: any = [];
    selectedPhoneNumber: string = "";
    selectedRow: any = null;
    currentPagecallDetails = 1;
    callDetailsitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
    callDetailstotalRecords: number = 0;
    pageLimitOptions = RadiusConstants.pageLimitOptions;
    callDetailData: any;
    custID = 0;
    currentPageinvoicePaymentList = 1;
    AclClassConstants;
    AclConstants;
    presentAdressDATA: any = [];
    presentFullAddress: any;
    viewCallDetailsAccess: any;
    phoneNumber: any;
    searchedPhoneNumber = ""; // to keep reference for pagination
    constructor(
        private spinner: NgxSpinnerService,
        public PaymentamountService: PaymentamountService,
        private customerManagementService: CustomermanagementService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        public invoicePaymentListService: InvoicePaymentListService,
        public loginService: LoginService,
        public commondropdownService: CommondropdownService,
        public customerdetailsilsService: CustomerdetailsilsService
    ) {
        this.viewCallDetailsAccess = loginService
            .hasPermission
            //   this.custType == "Prepaid"
            //     ? PRE_CUST_CONSTANTS.PRE_CUST_INVOICES_VIEW
            //     : POST_CUST_CONSTANTS.POST_CUST_INVOICES_VIEW
            ();
        this.AclClassConstants = AclClassConstants;
        this.AclConstants = AclConstants;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    async ngOnInit() {
        if (this.isCustCAF) {
            this.customerId = this.custData.id;
            this.custType = this.custData.custType;
        } else {
            this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
            this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
        }
        this.getCustomersDetail(this.customerId);
    }

    getCustomersDetail(custId) {
        const url = "/customers/" + custId;
        this.customerManagementService.getMethod(url).subscribe((response: any) => {
            this.callDetailData = response.customers;
            this.phoneNumber = response.customers.mobile;
            this.searchCallDetails(this.phoneNumber);
            //Address
            if (this.callDetailData.addressList.length > 0) {
                if (this.callDetailData.addressList[0].addressType) {
                    this.presentFullAddress = this.callDetailData.addressList[0].fullAddress;
                    let areaurl = "/area/" + this.callDetailData.addressList[0].areaId;

                    this.customerdetailsilsService.commonGetMethod(areaurl).subscribe((response: any) => {
                        this.presentAdressDATA = response.data;
                    });
                }
            }
        });
    }

    customerDetailOpen() {
        this.router.navigate(["/home/customer/details/" + this.custType + "/x/" + this.customerId]);
    }

    pageChangedcallDetailsList(pageNumber) {
        this.currentPagecallDetails = pageNumber;
        this.searchCallDetails(this.searchedPhoneNumber);
    }

    TotalItemPerPageCall(event) {
        this.callDetailsitemsPerPage = Number(event.value);
        this.currentPagecallDetails = 1;
        this.searchCallDetails(this.searchedPhoneNumber);
    }

    pageChangedInvoicePaymentList(pageNumber) {
        this.currentPageinvoicePaymentList = pageNumber;
        this.searchCallDetails(this.searchedPhoneNumber);
    }

    searchCallDetails(phoneNumber: string): void {
        if (!phoneNumber) {
            this.messageService.add({
                severity: "warn",
                summary: "Missing phone number",
                detail: "Please provide a valid phone number before searching."
            });
            return;
        }

        this.searchedPhoneNumber = phoneNumber;

        const page = this.currentPagecallDetails || 1;
        const pageSize = this.callDetailsitemsPerPage || 5;

        const url = `/getCustCallLogs/${phoneNumber}`;
        const body = {
            page,
            pageSize
        };

        this.spinner.show();

        this.customerManagementService.postMethod(url, body).subscribe(
            (response: any) => {
                this.spinner.hide();

                if (response?.custCallLogDetails?.content) {
                    this.callDetailsListData = response.custCallLogDetails.content;
                    this.callDetailstotalRecords = response.custCallLogDetails.totalElements;
                } else {
                    this.callDetailsListData = [];
                    this.callDetailstotalRecords = 0;
                }
            },
            (error: any) => {
                this.spinner.hide();
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.error?.ERROR || "Unable to fetch call log details",
                    icon: "far fa-times-circle"
                });
            }
        );
    }

    openViewModal(row: any): void {
        const uniqueId = row?.uniqueId;
        if (!uniqueId) {
            this.messageService.add({
                severity: "warn",
                summary: "Invalid Data",
                detail: "Unique ID is missing."
            });
            return;
        }

        const url = `/getAllCustCallLogs/${uniqueId}`;
        this.spinner.show();

        this.customerManagementService.getMethod(url).subscribe(
            (response: any) => {
                this.spinner.hide();
                if (response?.custCallLogDetails?.length) {
                    this.selectedRow = response.custCallLogDetails[0];
                } else {
                    this.selectedRow = null;
                    this.messageService.add({
                        severity: "info",
                        summary: "No Data",
                        detail: "No call log details found for this entry."
                    });
                }
            },
            (error: any) => {
                this.spinner.hide();
                this.messageService.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.error?.ERROR || "Failed to fetch call log details."
                });
            }
        );
    }
}
