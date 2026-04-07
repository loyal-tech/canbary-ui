import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import * as moment from "moment";
import { PaymentamountService } from "src/app/service/paymentamount.service";
import { BehaviorSubject } from "rxjs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RecordPaymentService } from "src/app/service/record-payment.service";
import { Regex } from "src/app/constants/regex";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";
import { LoginService } from "src/app/service/login.service";
import { WorkflowAuditDetailsModalComponent } from "../../workflow-audit-details-modal/workflow-audit-details-modal.component";
declare var $: any;

@Component({
  selector: "app-customer-caf-change-discount",
  templateUrl: "./customer-caf-change-discount.component.html",
  styleUrls: ["./customer-caf-change-discount.component.css"]
})
export class CustomerCafChangeDiscountComponent implements OnInit {
  customerId = 0;
  custType: string = "";
  currentPage = 1;
  itemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerNotesList: any = [];
  totalRecords: number;
  customerDetailData: any;
  staffData: any = [];
  staffDetailModal: boolean = false;
  pageLimitOptions = RadiusConstants.pageLimitOptions;
  customerUpdateDiscount = false;
  custCustDiscountList: any = [];
  OlddiscountData: any[];
  customerCustDiscountListdataitemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  customerCustDiscountListdatatotalRecords: String;
  currentPagecustomerCustDiscountListdata = 1;
  CustDiscountShowItemPerPage = 1;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  chargeType = [{ label: "One-time" }, { label: "Recurring" }];
  ifModelIsShow: boolean = false;
  currentPageMasterSlab = 1;
  auditcustid = new BehaviorSubject({
    auditcustid: "",
    checkHierachy: "",
    planId: ""
  });
  MasteritemsPerPage = RadiusConstants.ITEMS_PER_PAGE;
  showItemPerPage = 1;
  workflowAuditData: any;
  MastertotalRecords: String;
  assignDiscountData: any;
  discountFlageType = "";
  AppRjecHeader = "";
  assignAppRejectDiscountForm: FormGroup;
  assignDiscounsubmitted = false;
  staffList: any;
  customerData: any;
  paymentFormGroup: FormGroup;
  customerIdRecord: number;
  updateDiscountcafAccess: boolean = false;
  public loginService: LoginService;
  oldDiscValue = 0;
  newDiscValue = 0;
  discountAuditLogAccess: boolean = false;
  rejectApproveDiscountModal = false;
  isnewDiscount: boolean = true;
  @ViewChild(WorkflowAuditDetailsModalComponent)
  custauditWorkflowModal: WorkflowAuditDetailsModalComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public paymentamountService: PaymentamountService,
    private fb: FormBuilder,
    private recordPaymentService: RecordPaymentService,
    loginService: LoginService
  ) {
    this.loginService = loginService;
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
    this.updateDiscountcafAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_CHANGE_UPDATE_DISCOUNT
        : POST_CUST_CONSTANTS.POST_CUST_CHARGE_CREATE
    );
    this.discountAuditLogAccess = this.loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.PRE_CUST_CAF_CHANGE_DISCOUNT_AUDIT_DETAILS
        : POST_CUST_CONSTANTS.POST_CUST_CAF_CHANGE_DISCOUNT_AUDIT
    );
  }

  ngOnInit() {
    this.assignAppRejectDiscountForm = this.fb.group({
      remark: ["", Validators.required]
    });
    this.paymentFormGroup = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      bank: [""],
      branch: [""],
      chequedate: ["", Validators.required],
      chequeno: ["", [Validators.required, Validators.pattern(Regex.numeric)]],
      customerid: ["", Validators.required],
      paymode: ["", Validators.required],
      referenceno: ["", Validators.required],
      remark: ["", Validators.required],
      bankManagement: ["", Validators.required],
      destinationBank: ["", Validators.required],
      reciptNo: [""],
      type: ["Payment"],
      paytype: [""],
      file: [""],
      tdsAmount: [0],
      abbsAmount: [0],
      invoiceId: ["", Validators.required],
      onlinesource: [""]
    });

    this.getCustomersDetail(this.customerId);
  }
  customerDetailOpen() {
    this.router.navigate([
      "/home/customer-caf-new/details/" + this.custType + "/x/" + this.customerId
    ]);
  }

  getCustomersDetail(custId) {
    const url = "/customers/" + custId;
    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      this.customerDetailData = response.customers;
      this.openCustorUpdateDiscount(this.customerDetailData?.id);
    });
  }

  openCustorUpdateDiscount(id) {
    this.customerUpdateDiscount = true;
    this.getcustDiscountDetails(id, "");
  }

  getcustDiscountDetails(custId, size) {
    let page_list;
    this.OlddiscountData = [];
    if (size) {
      page_list = size;
      this.customerCustDiscountListdataitemsPerPage = size;
    } else {
      if (this.CustDiscountShowItemPerPage == 1) {
        this.customerCustDiscountListdataitemsPerPage = this.pageITEM;
      } else {
        this.customerCustDiscountListdataitemsPerPage = this.CustDiscountShowItemPerPage;
      }
    }

    let custDiscountdatalength = 0;
    const url = "/subscriber/fetchCustomerDiscountDetailServiceLevel/" + custId;
    this.customerManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.custCustDiscountList = response.discountDetails;
        while (custDiscountdatalength < this.custCustDiscountList.length) {
          if (
            this.custCustDiscountList[custDiscountdatalength].discount === null ||
            this.custCustDiscountList[custDiscountdatalength].discount === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].discount = 0;
          }
          this.custCustDiscountList[custDiscountdatalength].discount = parseFloat(
            this.custCustDiscountList[custDiscountdatalength].discount
          ).toFixed(2);

          if (
            this.custCustDiscountList[custDiscountdatalength].newDiscount === null ||
            this.custCustDiscountList[custDiscountdatalength].newDiscount === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].newDiscount = 0;
          }
          this.custCustDiscountList[custDiscountdatalength].newDiscount = parseFloat(
            this.custCustDiscountList[custDiscountdatalength].newDiscount
          ).toFixed(2);

          if (
            this.custCustDiscountList[custDiscountdatalength].discountType === null ||
            this.custCustDiscountList[custDiscountdatalength].discountType === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].discountType = "One-time";
          }
          if (
            this.custCustDiscountList[custDiscountdatalength].newDiscountType === null ||
            this.custCustDiscountList[custDiscountdatalength].newDiscountType === ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].newDiscountType = "One-time";
          }

          if (
            this.custCustDiscountList[custDiscountdatalength].discountExpiryDate !== null &&
            this.custCustDiscountList[custDiscountdatalength].discountExpiryDate !== ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].discountExpiryDate = moment(
              this.custCustDiscountList[custDiscountdatalength].discountExpiryDate
            )
              .utc(true)
              .toDate();
          }

          if (
            this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate !== null &&
            this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate !== ""
          ) {
            this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate = moment(
              this.custCustDiscountList[custDiscountdatalength].newDiscountExpiryDate
            )
              .utc(true)
              .toDate();
          }
          custDiscountdatalength++;
        }
        this.custCustDiscountList = this.custCustDiscountList?.map(item => ({
          ...item,
          isSelected: false,
          isDiscountTypeChanged: false
        }));
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

  custDiscountWorkflowAuditopen(id, auditcustid, planID) {
    this.ifModelIsShow = true;
    this.getworkflowAuditDetails("", auditcustid, "CUSTOMER_DISCOUNT");
    this.paymentamountService.show(id);
    this.auditcustid.next({
      auditcustid,
      checkHierachy: "CUSTOMER_DISCOUNT",
      planId: planID
    });
  }

  getworkflowAuditDetails(size, id, name) {
    let page = this.currentPageMasterSlab;
    let page_list;
    if (size) {
      page_list = size;
      this.MasteritemsPerPage = size;
    } else {
      if (this.showItemPerPage == 0) {
        this.MasteritemsPerPage = 5;
      } else {
        this.MasteritemsPerPage = 5;
      }
    }

    let data = {
      page: page,
      pageSize: this.MasteritemsPerPage
    };

    let url = "/workflowaudit/list?entityId=" + id + "&eventName=" + name;

    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.workflowAuditData = response.dataList;
        this.MastertotalRecords = response.totalRecords;
      },
      (error: any) => {
        if (error.status == 200) {
          this.messageService.add({
            severity: "error",
            summary: "Error",
            detail: error.ERROR,
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
  discountApporeved(data) {
    this.rejectApproveDiscountModal = true;
    this.assignDiscountData = data;
    this.discountFlageType = "approved";
    this.AppRjecHeader = "Approve";
    this.assignAppRejectDiscountForm.reset();
  }
  assignCustDiscountApprove() {
    this.assignDiscounsubmitted = true;
    if (this.assignAppRejectDiscountForm.valid) {
      let url = "/approveChangeDiscountServiceLevel";
      this.getCustomer();
      let assignCAFData = {
        // assignedDate: '',
        // credDocId: '',
        custPackageId: this.assignDiscountData.id,
        // custcafId: '',
        flag: this.discountFlageType,
        // newDiscount: this.assignDiscountData.newDiscount,
        nextStaffId: 0,
        planId: this.assignDiscountData.planId,
        remark: this.assignAppRejectDiscountForm.controls.remark.value,
        staffId: localStorage.getItem("userId")
        // status: ''
      };

      this.customerManagementService.updateMethod(url, assignCAFData).subscribe(
        (response: any) => {
          this.rejectApproveDiscountModal = false;
          if (response.dataList) {
            this.staffList = response.dataList;
            // if (this.discountFlageType == "approved") {
            //   this.approved = true;
            //   this.approveInventoryData = response.dataList;
            //   $("#assignCustomerInventoryModal").modal("show");
            // } else {
            //   this.reject = true;
            //   this.rejectInventoryData = response.dataList;
            //   $("#rejectCustomerInventoryModal").modal("show");
            // }
            $("#customerDiscount").modal("show");
          } else {
            this.openCustorUpdateDiscount(this.customerDetailData.id);
          }
          this.assignAppRejectDiscountForm.reset();
          this.assignDiscounsubmitted = false;
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
  }

  getCustomer() {
    // this.displayRecordPaymentDialog = true;
    const url = "/customers/list?mvnoId=" + localStorage.getItem("mvnoId");
    const custerlist = {};
    this.recordPaymentService.postMethod(url, custerlist).subscribe(
      (response: any) => {
        this.customerData = response.customerList;
        this.paymentFormGroup.patchValue({
          customerid: this.customerIdRecord
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

  async updateDiscount() {
    const data = [];
    for (let index = 0; index < this.custCustDiscountList.length; index++) {
      const row = this.custCustDiscountList[index];
      if (!row.isSelected) continue;

      if (
        row.discount !== row.newDiscount ||
        row.discountType !== row.newDiscountType ||
        row.discountExpiryDate !== row.newDiscountExpiryDate
      ) {
        data.push({
          id: row.id,
          custId: row.custId,
          connectionNo: row.connectionNo,
          serviceName: row.serviceName,
          serviceId: row.serviceId,
          invoiceType: row.invoiceType,
          discount: row.discount,
          newDiscount: row.newDiscount,
          discountType: row.discountType ?? "One-time",
          newDiscountType: row.newDiscountType ?? "One-time",
          discountExpiryDate: row.discountExpiryDate
            ? moment(row.discountExpiryDate).utc(true).toDate()
            : null,
          newDiscountExpiryDate:
            row.newDiscountType === null || row.newDiscountType === "One-time"
              ? null
              : moment(row.newDiscountExpiryDate).utc(true).toDate()
        });
      }
    }

    if (data.length === 0) {
      this.messageService.add({
        severity: "warn",
        summary: "No record selected",
        detail: "Please select at least one record"
      });
      return;
    }

    const url = "/subscriber/changeCustomerDiscountServiceLevel/" + this.customerDetailData.id;

    this.customerManagementService.postMethod(url, data).subscribe(
      (response: any) => {
        this.getcustDiscountDetails(this.customerDetailData.id, "");
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.message
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: error.error.errorMessage,
          detail: error.error.errorMessage
        });
      }
    );
  }

  discountRejected(data) {
    this.rejectApproveDiscountModal = true;
    this.assignDiscountData = data;
    this.discountFlageType = "Rejected";
    this.AppRjecHeader = "Reject";
    this.assignAppRejectDiscountForm.reset();
  }

  changeValue(value) {
    if (!value.dirty) {
      this.isnewDiscount = false;
      let msg = "value required";
    }
  }

  onDiscountTypeChange(data: any) {
    data.isDiscountTypeChanged = true;
  }

  closeRejectApproveCustomer() {
    this.rejectApproveDiscountModal = false;
  }

  closeParentCustt() {
    this.ifModelIsShow = false;
  }
}
