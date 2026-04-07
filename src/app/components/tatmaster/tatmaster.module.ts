import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { TATmasterComponent } from "./tatmaster.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: TATmasterComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [TATmasterComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class TATmasterModule {}
