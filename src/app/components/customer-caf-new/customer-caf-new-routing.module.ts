import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthguardGuard } from "src/app/authguard.guard";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";
import { CustomerCafNewComponent } from "./customer-caf-new.component";
import { CustomerCafListComponent } from "./customer-caf-list/customer-caf-list.component";
import { CustomerCafCreateComponent } from "./customer-caf-create/customer-caf-create.component";

const routes: Routes = [
  {
    path: "",
    component: CustomerCafNewComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list/:custType", pathMatch: "full" },
      { path: "list/:custType", component: CustomerCafListComponent, pathMatch: "full" },
      {
        path: "create/:custType",
        canDeactivate: [DeactivateService],
        component: CustomerCafCreateComponent
      },
      {
        path: "edit/:custType/:custId",
        canActivate: [AuthguardGuard],
        component: CustomerCafCreateComponent
      },
      {
        path: "details/:custType",
        loadChildren: () =>
          import("./cust-caf-details-menu/cust-caf-details-menu.module").then(
            m => m.CustCafDetailsMenuModule
          )
      }
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule]
})
export class CustomerCafRoutingModule {}
