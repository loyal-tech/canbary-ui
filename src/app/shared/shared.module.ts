import { CommonModule, CurrencyPipe } from "@angular/common";
import { DatePipe, HashLocationStrategy, LocationStrategy } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { NgxPaginationModule } from "ngx-pagination";
import { NgxSpinnerModule } from "ngx-spinner";
// import { ConfirmationService, MessageService } from "primeng/api";
import { CalendarModule } from "primeng/calendar";
import { ChartModule } from "primeng/chart";
import { CheckboxModule } from "primeng/checkbox";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { FocusTrapModule } from "primeng/focustrap";
import { InputSwitchModule } from "primeng/inputswitch";
import { MessagesModule } from "primeng/messages";
import { MultiSelectModule } from "primeng/multiselect";
import { ListboxModule } from "primeng/listbox";
import { PanelModule } from "primeng/panel";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { RippleModule } from "primeng/ripple";
import { TableModule, TableRadioButton } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { RatingModule } from "primeng/rating";
import { ToastModule } from "primeng/toast";
import { InputTextModule } from "primeng/inputtext";
import { AuthguardGuard } from "../authguard.guard";
import { CustomerDetailsComponent } from "../components/common/customer-details/customer-details.component";
import { InvoiceDetalisModelComponent } from "../components/invoice-detalis-model/invoice-detalis-model.component";
import { AuthInterceptor } from "../service/auth.interceptor";
import { ClientGroupService } from "../service/client-group.service";
import { CustomerService } from "../service/customer.service";
import { AgmCoreModule } from "@agm/core";
import { MatTableModule } from "@angular/material/table";
import { OrganizationChartModule } from "primeng/organizationchart";
import { InvoicePaymentDetailsModalComponent } from "../components/invoice-payment-details-modal/invoice-payment-details-modal.component";
import { PaginatorModule } from "primeng/paginator";
// import { NpDatepickerModule } from 'angular-nepali-datepicker';
import { PaymentAmountModelComponent } from "../components/payment-amount-model/payment-amount-model.component";
import { AccordionModule } from "primeng/accordion";
import { ToggleButtonModule } from "primeng/togglebutton";
import { CardModule } from "primeng/card";
import { SplitButtonModule } from "primeng/splitbutton";
import { ChipsModule } from "primeng/chips";
import { CustomMinDirective } from "../directive/custom-min-validator.directive";
import { CustomMaxDirective } from "../directive/custom-max-validator.directive";
import { NumberValidatorDirective } from "../directive/number-validator.directive";
import { CustChargemanagementComponent } from "src/app/components/cust-chargemanagement/cust-chargemanagement.component";
import { WorkflowAuditDetailsModalComponent } from "src/app/components/workflow-audit-details-modal/workflow-audit-details-modal.component";
import { CustomerplanGroupDetailsModalComponent } from "src/app/components/customerplan-group-details-modal/customerplan-group-details-modal.component";
import { CustServiceManagementComponent } from "../components/cust-service-management/cust-service-management.component";
import { CustomerWithdrawalmodalComponent } from "src/app/components/customer-withdrawalmodal/customer-withdrawalmodal.component";
import { CustCreditNoteComponent } from "../components/cust-credit-note/cust-credit-note.component";
import { MultiplecustomerSelectComponent } from "../components/multiplecustomer-select/multiplecustomer-select.component";
import { SimpleSearchComponent } from "../components/simple-search/simple-search.component";
import { CustomerInventoryDetailsComponent } from "../components/customer-inventory-details/customer-inventory-details.component";
import { CustomerInventoryManagementComponent } from "../components/customer-inventory-management/customer-inventory-management.component";
import { CommonInventoryManagementComponent } from "../components/common-inventory-management/common-inventory-management.component";
import { SplitterModule } from "primeng/splitter";
import { FieldTempMappingComponent } from "../components/field-temp-mapping/field-temp-mapping.component";
import { FieldTempMappingModule } from "../components/field-temp-mapping/field-temp-mapping.module";
import { FieldmappingService } from "../service/fieldmapping.service";
import { ChildCustChangePlanComponent } from "src/app/components/child-cust-change-plan/child-cust-change-plan.component";
import { DividerModule } from "primeng/divider";
import { CustomDecimalDirective } from "../directive/custom-decimal-validator.directive";
import { AddServiceComponent } from "../components/add-service/add-service.component";
import { CommonPlanComponent } from "../components/common-plan/common-plan.component";
import { CommonQuotationManagementComponent } from "../components/common-quotation-management/common-quotation-management.component";
import { CommonChargeComponent } from "../components/common-charge/common-charge.component";
import { PromiseToPayDetailsModalComponent } from "../components/promisetopay-details-modal/promisetopay-details-modal.component";
import { PlanChargeComponent } from "../components/plan/plan-charge/plan-charge.component";
import { CustomerSelectComponent } from "../components/customer-select/customer-select.component";
import { PlanConnectionNoComponent } from "../components/plan-connection-no/plan-connection-no.component";
import { QuotaDetailsModalComponent } from "../components/quota-details-modal/quota-details-modal.component";
import { BadgeModule } from "primeng/badge";
import { CustChangePlanComponent } from "../components/cust-change-plan/cust-change-plan.component";
import { StaffSelectModelComponent } from "../components/staff-select-model/staff-select-model.component";
import { CustomerNearByDevicesComponent } from "../components/customer-near-by-devices/customer-near-by-devices.component";
import { CustChangeStatusComponent } from "../components/cust-change-status/cust-change-status.component";
import { SelectStaffComponent } from "../components/common/select-staff/select-staff.component";
import { SelectDeviceComponent } from "../components/common/select-device/select-device.component";
import { CustChangePasswordComponent } from "../components/customer/cust-change-password/cust-change-password.component";
import { DialogModule } from "primeng/dialog";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectButtonModule } from "primeng/selectbutton";
import { CustomerInventorySpecificationParamsComponent } from "../components/customer-inventory-specification-params/customer-inventory-specification-params.component";
import { AllServiceAreaPolygon } from "../components/common/all-service-area-polygon/all-service-area-polygon.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { FieldsetModule } from "primeng/fieldset";
import { CustomerViewDetailsComponent } from "../components/customer/customer-view-details/customer-view-details.component";
import { CallDetailsComponent } from "../components/call-details/call-details.component";
import { SearchDetailComponent } from "../components/search-details/search-details.component";
import { CustomCurrencyPipe } from "../components/model/custom-currency";

@NgModule({
  declarations: [
    CustChangePlanComponent,
    StaffSelectModelComponent,
    CustomerInventorySpecificationParamsComponent,
    CustomMaxDirective,
    CustomMinDirective,
    NumberValidatorDirective,
    CustomDecimalDirective,
    InvoicePaymentDetailsModalComponent,
    PaymentAmountModelComponent,
    InvoiceDetalisModelComponent,
    CustomerDetailsComponent,
    CustChargemanagementComponent,
    WorkflowAuditDetailsModalComponent,
    CustomerWithdrawalmodalComponent,
    CustomerplanGroupDetailsModalComponent,
    CustServiceManagementComponent,
    CustCreditNoteComponent,
    MultiplecustomerSelectComponent,
    SimpleSearchComponent,
    CustomerInventoryDetailsComponent,
    CustomerInventoryManagementComponent,
    CommonInventoryManagementComponent,
    ChildCustChangePlanComponent,
    AddServiceComponent,
    CommonPlanComponent,
    CommonQuotationManagementComponent,
    CommonChargeComponent,
    PromiseToPayDetailsModalComponent,
    PlanChargeComponent,
    CustomerSelectComponent,
    PlanConnectionNoComponent,
    QuotaDetailsModalComponent,
    CustomerNearByDevicesComponent,
    CustChangeStatusComponent,
    SelectStaffComponent,
    AllServiceAreaPolygon,
    SelectDeviceComponent,
    CustChangePasswordComponent,
    CustomerViewDetailsComponent,
    CallDetailsComponent,
    SearchDetailComponent,
    CustomCurrencyPipe
  ],
  imports: [
    CommonModule,
    DialogModule,
    AccordionModule,
    BadgeModule,
    CardModule,
    SplitButtonModule,
    ToggleButtonModule,
    OrganizationChartModule,
    MatTableModule,
    MatTooltipModule,
    MultiSelectModule,
    ListboxModule,
    TabViewModule,
    TableModule,
    FocusTrapModule,
    ConfirmDialogModule,
    MessagesModule,
    CalendarModule,
    ToastModule,
    DropdownModule,
    CheckboxModule,
    RippleModule,
    InputTextModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    MatIconModule,
    NgxPaginationModule,
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: "danger"
    }),
    ReactiveFormsModule,
    InputSwitchModule,
    NgxSpinnerModule,
    MatSlideToggleModule,
    NgbModule,
    ChartModule,
    PanelModule,
    FieldsetModule,
    ProgressSpinnerModule,
    RatingModule,
    PaginatorModule,
    AgmCoreModule.forRoot({
      apiKey: RadiusConstants.GOOGLE_MAPS_API_KEY,
      libraries: ["places", "drawing", "geometry"]
    }),
    SplitterModule,
    DividerModule,
    ChipsModule,
    RadioButtonModule,
    SelectButtonModule,
    GooglePlaceModule
  ],
  exports: [
    CustChangePlanComponent,
    DialogModule,
    StaffSelectModelComponent,
    CustomerInventorySpecificationParamsComponent,
    InvoiceDetalisModelComponent,
    CustomerDetailsComponent,
    CustomerInventoryDetailsComponent,
    CustomerInventoryManagementComponent,
    CommonInventoryManagementComponent,
    PaymentAmountModelComponent,
    InvoicePaymentDetailsModalComponent,
    WorkflowAuditDetailsModalComponent,
    CustomerWithdrawalmodalComponent,
    CustomerplanGroupDetailsModalComponent,
    CustChargemanagementComponent,
    CustomMaxDirective,
    NumberValidatorDirective,
    CustomMinDirective,
    CustomDecimalDirective,
    CustServiceManagementComponent,
    CustCreditNoteComponent,
    AccordionModule,
    CardModule,
    SplitButtonModule,
    BadgeModule,
    ToggleButtonModule,
    OrganizationChartModule,
    MultiplecustomerSelectComponent,
    MatTableModule,
    MatTooltipModule,
    MultiSelectModule,
    ListboxModule,
    TabViewModule,
    TableModule,
    FocusTrapModule,
    ConfirmDialogModule,
    MessagesModule,
    CalendarModule,
    ToastModule,
    DropdownModule,
    CheckboxModule,
    RippleModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    NgSelectModule,
    HttpClientModule,
    MatIconModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    InputSwitchModule,
    NgxSpinnerModule,
    MatSlideToggleModule,
    NgbModule,
    ChartModule,
    PanelModule,
    FieldsetModule,
    ProgressSpinnerModule,
    RatingModule,
    PaginatorModule,
    InputTextModule,
    SimpleSearchComponent,
    ChildCustChangePlanComponent,
    DividerModule,
    ChipsModule,
    RadioButtonModule,
    AddServiceComponent,
    CommonPlanComponent,
    CommonQuotationManagementComponent,
    CommonChargeComponent,
    PromiseToPayDetailsModalComponent,
    PlanChargeComponent,
    CustomerSelectComponent,
    PlanConnectionNoComponent,
    QuotaDetailsModalComponent,
    CustomerNearByDevicesComponent,
    CustChangeStatusComponent,
    SelectStaffComponent,
    AllServiceAreaPolygon,
    SelectDeviceComponent,
    CustChangePasswordComponent,
    SelectButtonModule,
    CustomerViewDetailsComponent,
    CallDetailsComponent,
    SearchDetailComponent,
    CustomCurrencyPipe
  ],
  providers: [
    // ConfirmationService,
    ClientGroupService,
    CustomerService,
    AuthguardGuard,
    FieldmappingService,
    [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    // MessageService,
    DatePipe,
    CurrencyPipe,
    CustomCurrencyPipe
  ]
})
export class SharedModule {}
