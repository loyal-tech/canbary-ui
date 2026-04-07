import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TATMatricsComponent } from "./tat-Matrics.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: TATMatricsComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [TATMatricsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TatMatricsModule {}
