import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { IntegrationConfigurationComponent } from "./integration-configuration.component";
import { DeactivateService } from "src/app/service/deactivate.service";
import { InputSwitchModule } from "primeng/inputswitch";

const routes = [
  { path: "", component: IntegrationConfigurationComponent, canDeactivate: [DeactivateService] },
];

@NgModule({
  declarations: [IntegrationConfigurationComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, InputSwitchModule],
})
export class IntegrationConfigurationModule {}
