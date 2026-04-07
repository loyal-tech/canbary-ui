import { NgModule } from "@angular/core";
import { Routes, RouterModule, CanActivate } from "@angular/router";
// import { CustomerListComponent } from "./customer-list/customer-list.component";
import { AcctProfileListComponent } from "./acct-profile-list/acct-profile-list.component";
import { AuthguardGuard } from "src/app/authguard.guard";
import { AcctProfileCreateComponent } from "./acct-profile-create/acct-profile-create.component";
// import { CustomerComponent } from "./customer.component";
import { AcctProfileComponent } from "./acct-profile.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { MultiSelectModule } from "primeng/multiselect";

const routes: Routes = [
  {
    path: "",
    component: AcctProfileComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list", pathMatch: "full" },
      { path: "list", component: AcctProfileListComponent, pathMatch: "full" },
      {
        path: "create",
        component: AcctProfileCreateComponent,
      },
      {
        path: "edit/:profileIdId/:mvnoId",
        component: AcctProfileCreateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule],
})
export class AcctProfileRoutingModule {}
