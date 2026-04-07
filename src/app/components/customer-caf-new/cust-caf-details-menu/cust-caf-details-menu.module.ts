import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { TabViewModule } from "primeng/tabview";
import { CardModule } from "primeng/card";
import { CustCafDetailsMenuComponent } from "./cust-caf-details-menu.component";
import { SplitterModule } from "primeng/splitter";
import { AccordionModule } from "primeng/accordion";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { CustomerCafDetailsComponent } from "../customer-caf-details/customer-caf-details.component";
import { CustomerCafRoutingModule } from "./cust-caf-details-menu-routing.module";
import { CustomerCafNotesComponent } from "../customer-caf-notes/customer-caf-notes.component";
import { CustomerInventoryManagementComponent } from "../customer-inventory-management/customer-inventory-management.component";
import { CustomerCafStatusComponent } from "../customer-caf-status/customer-caf-status.component";
import { CustomerCafFollowupComponent } from "../customer-caf-followup/customer-caf-followup.component";
import { CustomerCafPlansComponent } from "../customer-caf-plans/customer-caf-plans.component";
import { CustomerCafInvoiceComponent } from "../customer-caf-invoice/customer-caf-invoice.component";
import { CustomerCafChangeDiscountComponent } from "../customer-caf-change-discount/customer-caf-change-discount.component";
import { CustomerCafShiftLocationComponent } from "../customer-caf-shiftlocation/customer-caf-shiftlocation.component";
import { CustomerCafPaymentComponent } from "../customer-caf-payment/customer-caf-payment.component";
import { CustomerCafLedgerComponent } from "../customer-caf-ledger/customer-caf-ledger.component";
import { CustomerCafWalletComponent } from "../customer-caf-wallet/customer-caf-wallet.component";
import { CustChargemanagementComponent } from "../cust-chargemanagement/cust-chargemanagement.component";
import { CustServiceManagementComponent } from "../../cust-service-management/cust-service-management.component";
@NgModule({
  imports: [
    DialogModule,
    CommonModule,
    CustomerCafRoutingModule,
    SharedModule,
    TabViewModule,
    CardModule,
    SplitterModule,
    AccordionModule,
    TableModule,
    DropdownModule,
    ButtonModule
  ],
  declarations: [
    CustCafDetailsMenuComponent,
    CustomerCafDetailsComponent,
    CustomerCafNotesComponent,
    CustomerCafStatusComponent,
    CustomerCafFollowupComponent,
    CustomerCafPlansComponent,
    CustomerInventoryManagementComponent,
    CustomerCafInvoiceComponent,
    CustomerCafChangeDiscountComponent,
    CustomerCafShiftLocationComponent,
    CustomerCafPaymentComponent,
    CustomerCafLedgerComponent,
    CustomerCafWalletComponent,
    CustChargemanagementComponent,
    CustServiceManagementComponent
  ]
})
export class CustCafDetailsMenuModule {}
