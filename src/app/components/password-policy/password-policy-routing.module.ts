import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MultiSelectModule } from "primeng/multiselect";
import { PasswordPolicyComponent } from "./password-policy.component";
import { AuthguardGuard } from "src/app/authguard.guard";
import { PasswordListComponent } from "./password-list/password-list.component";
import { PasswordCreateComponent } from "./password-create/password-create.component";

const routes: Routes = [
  {
    path: "",
    component: PasswordPolicyComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "list", pathMatch: "full" },
      { path: "list", component: PasswordListComponent, pathMatch: "full" },
      {
        path: "create",
        component: PasswordCreateComponent,
      },
      {
        path: "edit/:mvnoId",
        canActivate: [AuthguardGuard],
        component: PasswordCreateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), MultiSelectModule],
  exports: [RouterModule],
})
export class PasswordRoutingModule {}
