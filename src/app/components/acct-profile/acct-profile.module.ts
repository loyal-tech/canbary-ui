import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { AcctProfileComponent } from "./acct-profile.component";
import { AcctProfileRoutingModule } from "./acct-profile-routing.module";
import { AcctProfileListComponent } from "./acct-profile-list/acct-profile-list.component";
import { AcctProfileCreateComponent } from "./acct-profile-create/acct-profile-create.component";

const routes = [{ path: "", component: AcctProfileComponent }];

@NgModule({
  declarations: [AcctProfileComponent, AcctProfileListComponent, AcctProfileCreateComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, AcctProfileRoutingModule],
})
export class AcctProfileModule {}
