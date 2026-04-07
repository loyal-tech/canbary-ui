import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { GenerateTrialBillRunComponent } from "./generate-trial-bill-run.component";

const routes = [{ path: "", component: GenerateTrialBillRunComponent }];

@NgModule({
  declarations: [GenerateTrialBillRunComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class GenerateTrialBillRunModule {}
