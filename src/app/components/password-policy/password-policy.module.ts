import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PasswordPolicyComponent } from "./password-policy.component";
import { PasswordCreateComponent } from "./password-create/password-create.component";
import { PasswordListComponent } from "./password-list/password-list.component";
import { PasswordRoutingModule } from "./password-policy-routing.module";
import { SharedModule } from "src/app/shared/shared.module";

const routes = [{ path: "", component: PasswordPolicyComponent }];

@NgModule({
  declarations: [PasswordPolicyComponent, PasswordCreateComponent, PasswordListComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PasswordRoutingModule, SharedModule]
})
export class PasswordPolicyModule {}
