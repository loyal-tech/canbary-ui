import { Component, OnInit } from "@angular/core";
import { CUSTOMER_PREPAID, CUSTOMER_POSTPAID } from "src/app/RadiusUtils/RadiusConstants";
import { LoginService } from "src/app/service/login.service";
import { ActivatedRoute } from "@angular/router";
import { POST_CUST_CONSTANTS, PRE_CUST_CONSTANTS } from "src/app/constants/aclConstants";

@Component({
  selector: "app-customer-caf-new",
  templateUrl: "./customer-caf-new.component.html",
  styleUrls: ["./customer-caf-new.component.css"]
})
export class CustomerCafNewComponent implements OnInit {
  custType;
  title = CUSTOMER_PREPAID + "Caf";
  isShowMenu = true;
  isShowCreateView = true;
  isShowListView = true;
  createAccess: boolean = false;
  constructor(
    private route: ActivatedRoute,
    loginService: LoginService
  ) {
    this.custType = this.route.snapshot.firstChild.paramMap.get("custType")!;
    this.custType == "Prepaid"
      ? (this.title = CUSTOMER_PREPAID)
      : (this.title = CUSTOMER_POSTPAID );
    this.createAccess = loginService.hasPermission(
      this.custType == "Prepaid"
        ? PRE_CUST_CONSTANTS.CREATE_PRE_CUST_CAF_LIST
        : POST_CUST_CONSTANTS.CREATE_POST_CUST_CAF
    );
  }
  ngOnInit(): void {
    const childUrlSegment = this.route.firstChild.snapshot.url[0].path;
    if (childUrlSegment === "list") {
      this.isShowMenu = true;
      this.isShowListView = true;
      this.isShowCreateView = false;
    } else if (childUrlSegment === "create" || childUrlSegment === "edit") {
      this.isShowMenu = true;
      this.isShowCreateView = true;
      this.isShowListView = false;
    } else {
      this.isShowMenu = false;
      this.isShowCreateView = false;
      this.isShowListView = false;
    }
  }
}
