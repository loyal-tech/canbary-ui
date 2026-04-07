import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { EmailConfigComponent } from "./email-config.component";
import { DeactivateService } from "src/app/service/deactivate.service";

const routes = [{ path: "", component: EmailConfigComponent, canDeactivate: [DeactivateService] }];

@NgModule({
  declarations: [EmailConfigComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule],
})
export class EmailConfigModule {}
