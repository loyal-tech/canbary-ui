import { NgModule } from "@angular/core";
import { Routes, RouterModule, CanActivate } from "@angular/router";
import { CustomerListComponent } from "./customer-list/customer-list.component";
import { AuthguardGuard } from "src/app/authguard.guard";
import { CustomerCreateComponent } from "./customer-create/customer-create.component";
import { CustomerComponent } from "./customer.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";

const routes: Routes = [
  {
    path: "",
    component: CustomerComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list/:custType", pathMatch: "full" },
      { path: "list/:custType", component: CustomerListComponent, pathMatch: "full" },
      {
        path: "create/:custType",
        canDeactivate: [DeactivateService],
        component: CustomerCreateComponent,
      },
      {
        path: "edit/:custType/:custId",
        canActivate: [AuthguardGuard],
        component: CustomerCreateComponent,
      },
      {
        path: "details/:custType",
        loadChildren: () =>
          import("../customer/cust-details-menu/cust-details-menu.module").then(
            m => m.CustDetailsMenuModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
