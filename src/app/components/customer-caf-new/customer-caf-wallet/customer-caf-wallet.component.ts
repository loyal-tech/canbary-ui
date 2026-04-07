import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { MessageService } from "primeng/api";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { AdoptCommonBaseService } from "src/app/service/adopt-common-base.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SystemconfigService } from "src/app/service/systemconfig.service";
import { CustomerWithdrawalmodalComponent } from "../../customer-withdrawalmodal/customer-withdrawalmodal.component";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-customer-caf-wallet",
  templateUrl: "./customer-caf-wallet.component.html",
  styleUrls: ["./customer-caf-wallet.component.css"]
})
export class CustomerCafWalletComponent implements OnInit {
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
  custLedgerForm: FormGroup;
  custLedgerSubmitted = false;
  customerLedgerSearchKey: string;
  currentPagecustLedgerList = 1;
  legershowItemPerPage = 1;
  custLedgerItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  pageITEM = RadiusConstants.ITEMS_PER_PAGE;
  postdata: any = {
    CREATE_DATE: "",
    END_DATE: "",
    id: "",
    amount: "",
    balAmount: "",
    custId: "",
    description: "",
    refNo: "",
    transcategory: "",
    transtype: ""
  };
  customerLedgerData: any = {
    custname: "",
    plan: "",
    status: "",
    username: "",
    customerLedgerInfoPojo: {
      openingAmount: "",
      closingBalance: ""
    }
  };
  customerLedgerListData: any;
  currency: any;
  custLedgertotalRecords: String;
  withdrawalAmountModal: CustomerWithdrawalmodalComponent;
  wCustID = new BehaviorSubject({
    wCustID: "",
    WalletAmount: ""
  });
  getWallatData = [];
  WalletAmount: any;
  displayDialogWithDraw: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private customerManagementService: CustomermanagementService,
    public adoptCommonBaseService: AdoptCommonBaseService,
    public fb: FormBuilder
  ) {
    this.customerId = Number(this.route.snapshot.paramMap.get("customerId")!);
    this.custType = this.route.snapshot.parent.paramMap.get("custType")!;
  }

  ngOnInit() {
    this.custLedgerForm = this.fb.group({
      startDateCustLedger: ["", Validators.required],
      endDateCustLedger: ["", Validators.required]
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
    });
  }

  addWalletIncustomer(id) {
    let custID = "";
    if (id.value) {
      custID = id.value;
    } else {
      custID = id;
    }
    const data = {
      CREATE_DATE: "",
      END_DATE: "",
      amount: "",
      balAmount: "",
      custId: custID,
      description: "",
      id: "",
      refNo: "",
      transcategory: "",
      transtype: ""
    };
    const url = "/wallet";
    this.customerManagementService.postMethod(url, data).subscribe((response: any) => {
      this.getWallatData = response;
      this.WalletAmount = response.customerWalletDetails;
    });
  }

  withdrawalAmountModel(wCustID, WalletAmount) {
    this.displayDialogWithDraw = true;

    this.wCustID.next({
      wCustID,
      WalletAmount
    });
  }
}
