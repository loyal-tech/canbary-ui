import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { CoaComponent } from "./coa.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: CoaComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [CoaComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class CoaModule {}
