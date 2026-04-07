import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthguardGuard } from "src/app/authguard.guard";
import { CustCafDetailsMenuComponent } from "./cust-caf-details-menu.component";
import { CallDetailsComponent } from "../../call-details/call-details.component";
import { CustomerCafDetailsComponent } from "../customer-caf-details/customer-caf-details.component";
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
// import { CustomerCafChangePlanComponent } from "../customer-caf-changeplan/customer-caf-changeplan.component";
import { CustChargemanagementComponent } from "../cust-chargemanagement/cust-chargemanagement.component";
import { CustServiceManagementComponent } from "../../cust-service-management/cust-service-management.component";

const routes: Routes = [
  {
    path: "",
    component: CustCafDetailsMenuComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "x/:customerId", pathMatch: "full" },
      {
        path: "x/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafDetailsComponent
      },
      {
        path: "chargeManagement/:customerId",
        canActivate: [AuthguardGuard],
        component: CustChargemanagementComponent
      },
      {
        path: "customerCafNotes/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafNotesComponent
      },
      {
        path: "followup/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafFollowupComponent
      },
      {
        path: "callDetails/:customerId",
        canActivate: [AuthguardGuard],
        component: CallDetailsComponent
      },
      {
        path: "customerCafStatus/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafStatusComponent
      },
      {
        path: "customerPlans/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafPlansComponent
      },
      {
        path: "inventoryManagement/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerInventoryManagementComponent
      },
      {
        path: "serviceManagement/:customerId",
        canActivate: [AuthguardGuard],
        component: CustServiceManagementComponent
      },
      {
        path: "invoice/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafInvoiceComponent
      },
      {
        path: "changeDiscount/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafChangeDiscountComponent
      },
      {
        path: "shiftLocation/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafShiftLocationComponent
      },
      {
        path: "payment/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafPaymentComponent
      },
      {
        path: "ledger/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafLedgerComponent
      },
      {
        path: "wallet/:customerId",
        canActivate: [AuthguardGuard],
        component: CustomerCafWalletComponent
      }
      //   {
      //     path: "changeplan/:customerId",
      //     canActivate: [AuthguardGuard],
      //     component: CustomerCafChangePlanComponent
      //   }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerCafRoutingModule {}
