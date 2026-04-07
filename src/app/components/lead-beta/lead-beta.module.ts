import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { LeadBetaComponent } from "./lead-beta.component";

const routes = [{ path: "", component: LeadBetaComponent }];

@NgModule({
  declarations: [LeadBetaComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class LeadBetaModule {}
