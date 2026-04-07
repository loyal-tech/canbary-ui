import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { GenerateBillRunComponent } from "./generate-bill-run.component";

const routes = [{ path: "", component: GenerateBillRunComponent }];

@NgModule({
  declarations: [GenerateBillRunComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class GenerateBillRunModule {}
