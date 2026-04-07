import { AgmCoreModule } from "@agm/core";
import { NgModule } from "@angular/core";
import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BlankComponent } from "./components/blank/blank.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AclGernericComponentComponent } from "./components/generic-component/acl/acl-gerneric-component/acl-gerneric-component.component";
import { HomeComponent } from "./components/home/home.component";
import { MapsComponent } from "./components/maps/maps.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { SharedModule } from "./shared/shared.module";

import { ConfirmationService, MessageService } from "primeng/api";
import { DeactivateService } from "./service/deactivate.service";
import { NavMasterComponent } from "./components/nav-master/nav-master.component";
import { VendorManagementComponent } from "./components/vendor-management/vendor-management.component";
import { LoginComponent } from "./components/login/login.component";
import { NgxCaptchaModule } from "@binssoft/ngx-captcha";
import { CacheInterceptor, CacheInterceptorProvider } from "./service/cache-interceptor";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { InMemoryCacheProvider } from "./service/cache-in-memory";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CustomerPayComponent } from "./components/customer-pay/customer-pay.component";
import { CustomerVerifyListComponent } from "./components/customer-verify-list/customer-verify-list.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";

@NgModule({
  declarations: [
    LoginComponent,
    AclGernericComponentComponent,
    AppComponent,
    BlankComponent,
    FooterComponent,
    HomeComponent,
    MapsComponent,
    SidebarComponent,
    CustomerPayComponent,
    CustomerVerifyListComponent,
    ResetPasswordComponent
  ],
  imports: [
    NgxCaptchaModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // NpDatepickerModule,
    SharedModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    }),
    AgmCoreModule.forRoot({
      apiKey: RadiusConstants.GOOGLE_MAPS_API_KEY,
      libraries: ["places"]
    }),
    GooglePlaceModule,
    FullCalendarModule
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DeactivateService,
    InMemoryCacheProvider,
    CacheInterceptorProvider,
    Title
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
