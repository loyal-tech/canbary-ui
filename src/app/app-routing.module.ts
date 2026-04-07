import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AclClassConstants } from "../../src/app/constants/aclClassConstants";
import { AclConstants } from "../../src/app/constants/aclOperationConstants";
import { AuthguardGuard } from "./authguard.guard";
import { CustomerDetailsComponent } from "./components/common/customer-details/customer-details.component";
import { HomeComponent } from "./components/home/home.component";
import { MapsComponent } from "./components/maps/maps.component";
import { LoginComponent } from "./components/login/login.component";
import { LocationComponent } from "./components/location/location.component";
import { CustomerPayComponent } from "./components/customer-pay/customer-pay.component";
import { CustomerViewDetailsComponent } from "./components/customer/customer-view-details/customer-view-details.component";
import { CustomerVerifyListComponent } from "./components/customer-verify-list/customer-verify-list.component";
import { CallDetailsComponent } from "./components/call-details/call-details.component";
import { SearchDetailComponent } from "./components/search-details/search-details.component";
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";

const routes: Routes = [
  { path: "", component: LoginComponent },
  // { path: '**', redirectTo: 'login' },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "reset-password",
    component: ResetPasswordComponent
  },
  {
    path: "customer/payMethod/:hash",
    component: CustomerPayComponent
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthguardGuard],
    children: [
      { path: "", redirectTo: "dashbord", pathMatch: "full" },
      {
        path: "dashbord",
        loadChildren: () =>
          import("./components/dashbord/dashbord.module").then(m => m.DashbordModule)
      },
      {
        path: "templateManagement",
        loadChildren: () =>
          import("./components/template-management/template-management.module").then(
            m => m.TemplateManagementModule
          )
      },
      {
        path: "smsConfig",
        loadChildren: () =>
          import("./components/sms-config/sms-config.module").then(m => m.SmsConfigModule)
      },
      {
        path: "emailConfig",
        loadChildren: () =>
          import("./components/email-config/email-config.module").then(m => m.EmailConfigModule)
      },
      {
        path: "smsNotification",
        loadChildren: () =>
          import("./components/sms-notification/sms-notification.module").then(
            m => m.SmsNotificationModule
          )
      },
      {
        path: "emailNotification",
        loadChildren: () =>
          import("./components/email-notification/email-notification.module").then(
            m => m.EmailNotificationModule
          )
      },
      {
        path: "radiusProfile",
        loadChildren: () =>
          import("./components/acct-profile/acct-profile.module").then(m => m.AcctProfileModule)
      },
      {
        path: "coadm",
        loadChildren: () => import("./components/coa/coa.module").then(m => m.CoaModule)
      },
      {
        path: "authResponse",
        loadChildren: () =>
          import("./components/auth-response/auth-response.module").then(m => m.AuthResponseModule)
      },
      {
        path: "acctCdr",
        loadChildren: () =>
          import("./components/acct-cdr/acct-cdr.module").then(m => m.AcctCdrModule)
      },
      {
        path: "businessunit",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_BUSINESS_UNIT_VIEW,
          classId: AclClassConstants.ACL_BUSINESSUNIT,
          accessIdForAllOpreation: AclConstants.OPERATION_BUSINESS_UNIT_ALL,
          operation: "businessunit"
        },
        loadChildren: () =>
          import("./components/business-unit/business-unit.module").then(m => m.BusinessUnitModule)
      },
      {
        path: "investmentCode",
        loadChildren: () =>
          import("./components/investment-code/investment-code.module").then(
            m => m.InvestmentCodeModule
          )
      },
      {
        path: "subbusinessunit",
        loadChildren: () =>
          import("./components/sub-buisness-unit/sub-buisness-unit.module").then(
            m => m.SubBuisnessUnitModule
          )
      },
      {
        path: "radiusrole",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_ROLE_VIEW,
          classId: AclClassConstants.ACL_ROLE,
          accessIdForAllOpreation: AclConstants.OPERATION_ROLE_ALL,
          operation: "radiusrole"
        },
        loadChildren: () =>
          import("./components/role-management/role-management.module").then(
            m => m.RoleManagementModule
          )
      },
      {
        path: "roleManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_ROLE_VIEW,
          classId: AclClassConstants.ACL_ROLE,
          accessIdForAllOpreation: AclConstants.OPERATION_ROLE_ALL,
          operation: "radiusrole"
        },
        loadChildren: () =>
          import("./components/role-management/role-management.module").then(
            m => m.RoleManagementModule
          )
      },
      {
        path: "radiusgroup",
        loadChildren: () =>
          import("./components/radius-client-group/radius-client-group.module").then(
            m => m.RadiusClientGroupModule
          )
      },
      {
        path: "radiusclient",
        loadChildren: () =>
          import("./components/radius-client/radius-client.module").then(m => m.RadiusClientModule)
      },
      {
        path: "net-Conf",
        loadChildren: () =>
          import("./components/netConf/net-conf-list.module").then(m => m.netConfModule)
      },

      {
        path: "radiuscustomer",
        loadChildren: () =>
          import("./components/radius-customer/radius-customer.module").then(
            m => m.RadiusCustomerModule
          )
      },
      {
        path: "radiusTemplateManagement",
        loadChildren: () =>
          import("./components/radius-template/radius-template.module").then(
            m => m.RadiusTemplateModule
          )
      },
      {
        path: "dbMappingMaster",
        loadChildren: () =>
          import("./components/db-mapping-master/db-mapping-master.module").then(
            m => m.DbMappingMasterModule
          )
      },
      {
        path: "driverManagement",
        loadChildren: () =>
          import("./components/device-driver/device-driver.module").then(m => m.DeviceDriverModule)
      },
      // {
      //   path: "migratiommanagement",
      //   loadChildren: () =>
      //     import("./components/migration/migration.module").then(m => m.MigrationModule),
      // },

      {
        path: "tacacsmanagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_TAX_VIEW,
          classId: AclClassConstants.ACL_TAX,
          accessIdForAllOpreation: AclConstants.OPERATION_TAX_ALL,
          operation: "tacasmanagement"
        },
        loadChildren: () =>
          import("./components/tacas-management/tacas-management.module").then(
            m => m.TacasManagementModule
          )
      },
      {
        path: "tacasConfiguration",
        loadChildren: () =>
          import("./components/tacas-configuration/tacas-configuration.module").then(
            m => m.TacasConfigurationModule
          )
      },
      {
        path: "tacacsStaff",
        loadChildren: () =>
          import("./components/tacacs-staff/tacacs-staff.module").then(m => m.TacacsStaffModule)
      },
      {
        path: "tacacsDevice",
        loadChildren: () =>
          import("./components/tacacs-device/tacacs-device.module").then(m => m.TacacsDeviceModule)
      },
      {
        path: "tacacsDeviceGroup",
        loadChildren: () =>
          import("./components/tacacs-device-group/tacacs-device-group.module").then(
            m => m.TacacsDeviceGroupModule
          )
      },
      {
        path: "tacacsAuthenticationAudit",
        loadChildren: () =>
          import("./components/tacacs-authentication-audit/tacacs-authentication-audit.module").then(
            m => m.TacacsAuthenticationAuditModule
          )
      },
      {
        path: "tacacsCommandset",
        loadChildren: () =>
          import("./components/tacacs-commandset/tacacs-commandset.module").then(
            m => m.TacacsCommandsetModule
          )
      },
      {
        path: "accessControlList",
        loadChildren: () =>
          import("./components/access-control-list/access-control-list.module").then(
            m => m.AccessControlListModule
          )
      },

      {
        path: "radiusstaff",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_STAFF_VIEW,
          classId: AclClassConstants.ACL_STAFF,
          accessIdForAllOpreation: AclConstants.OPERATION_STAFF_ALL,
          operation: "radiusstaff"
        },
        loadChildren: () =>
          import("./components/radius-staff/radius-staff.module").then(m => m.RadiusStaffModule)
      },
      {
        path: "mvno",
        loadChildren: () => import("./components/mvno/mvno.module").then(m => m.MvnoModule)
      },
      {
        path: "liveuser",
        loadChildren: () =>
          import("./components/live-user/live-user.module").then(m => m.LiveUserModule)
      },
      {
        path: "proxy-server",
        loadChildren: () =>
          import("./components/proxy-server/proxy-server.module").then(m => m.ProxyServerModule)
      },
      {
        path: "dictionary",
        loadChildren: () =>
          import("./components/dictionary/dictionary.module").then(m => m.DictionaryModule)
      },
      {
        path: "device",
        loadChildren: () =>
          import("./components/device-management/device-management.module").then(
            m => m.DeviceManagementModule
          )
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./components/profile-management/profile.module").then(m => m.ProfileModule)
      },

      {
        path: "taxManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_TAX_VIEW,
          classId: AclClassConstants.ACL_TAX,
          accessIdForAllOpreation: AclConstants.OPERATION_TAX_ALL,
          operation: "taxManagement"
        },
        loadChildren: () =>
          import("./components/tax-management/tax-management.module").then(
            m => m.TaxManagementModule
          )
      },
      {
        path: "chargeManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_CHARGE_VIEW,
          classId: AclClassConstants.ACL_CHARGE,
          accessIdForAllOpreation: AclConstants.OPERATION_CHARGE_ALL,
          operation: "chargeManagement"
        },
        loadChildren: () =>
          import("./components/charge-management/charge-management.module").then(
            m => m.ChargeManagementModule
          )
      },
      {
        path: "serviceManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_PLAN_SERVICE_VIEW,
          classId: AclClassConstants.ACL_SERVICE,
          accessIdForAllOpreation: AclConstants.OPERATION_PLAN_SERVICE_ALL,
          operation: "serviceManagement"
        },
        loadChildren: () =>
          import("./components/service-management/service-management.module").then(
            m => m.ServiceManagementModule
          )
      },
      {
        path: "planManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_POSTPAID_PLAN_VIEW,
          classId: AclClassConstants.ACL_POSTPAID_PLAN,
          accessIdForAllOpreation: AclConstants.OPERATION_POSTPAID_PLAN_ALL,
          operation: "planManagement"
        },
        loadChildren: () =>
          import("./components/plan-management/plan-management.module").then(
            m => m.PlanManagementModule
          )
      },
      {
        path: "planMapping",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_SPECIAL_PLAN_MAPPING_VIEW,
          classId: AclClassConstants.ACL_CUST_SPECIAL_PLAN_MAPPING,
          accessIdForAllOpreation: AclConstants.OPERATION_SPECIAL_PLAN_MAPPING_ALL,
          operation: "planMapping"
        },
        loadChildren: () =>
          import("./components/plan-mapping/plan-mapping.module").then(m => m.PlanMappingModule)
      },
      {
        path: "dunningRules",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_DUNNING_RULE_VIEW,
          classId: AclClassConstants.ACL_CLASS_DUNNING_RULE,
          accessIdForAllOpreation: AclConstants.OPERATION_DUNNING_RULE_ALL,
          operation: "dunningRules"
        },
        loadChildren: () =>
          import("./components/dunning-rules/dunning-rules.module").then(m => m.DunningRulesModule)
      },
      {
        path: "qosPolicyManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_QOS_POLICY_VIEW,
          classId: AclClassConstants.ACL_QOS_POLICY,
          accessIdForAllOpreation: AclConstants.OPERATION_QOS_POLICY_ALL,
          operation: "qosPolicyManagement"
        },
        loadChildren: () =>
          import("./components/qos-policy/qos-policy.module").then(m => m.QosPolicyModule)
      },
      {
        path: "countryManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_COUNTRY_VIEW,
          classId: AclClassConstants.ACL_COUNTRY,
          accessIdForAllOpreation: AclConstants.OPERATION_COUNTRY_ALL,
          operation: "countryManagement"
        },
        loadChildren: () =>
          import("./components/country-management/country-management.module").then(
            m => m.CountryManagementModule
          )
      },
      {
        path: "subareaManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_COUNTRY_VIEW,
          classId: AclClassConstants.ACL_COUNTRY,
          accessIdForAllOpreation: AclConstants.OPERATION_COUNTRY_ALL,
          operation: "subareaManagement"
        },
        loadChildren: () =>
          import("./components/sub-area-management/subArea-management.module").then(
            m => m.SubAreaManagementModule
          )
      },
      {
        path: "buildingManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_COUNTRY_VIEW,
          classId: AclClassConstants.ACL_COUNTRY,
          accessIdForAllOpreation: AclConstants.OPERATION_COUNTRY_ALL,
          operation: "buildingManagement"
        },
        loadChildren: () =>
          import("./components/building-management/building-management.module").then(
            m => m.BuildingManagementModule
          )
      },
      {
        path: "stateManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_STATE_VIEW,
          classId: AclClassConstants.ACL_STATE,
          accessIdForAllOpreation: AclConstants.OPERATION_STATE_ALL,
          operation: "stateManagement"
        },
        loadChildren: () =>
          import("./components/state-management/state-management.module").then(
            m => m.StateManagementModule
          )
      },
      {
        path: "cityManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_CITY_VIEW,
          classId: AclClassConstants.ACL_CITY,
          accessIdForAllOpreation: AclConstants.OPERATION_CITY_ALL,
          operation: "cityManagement"
        },
        loadChildren: () =>
          import("./components/city-management/city-management.module").then(
            m => m.CityManagementModule
          )
      },
      {
        path: "pincodeManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_PINCODE_VIEW,
          classId: AclClassConstants.ACL_PINCODE,
          accessIdForAllOpreation: AclConstants.OPERATION_PINCODE_ALL,
          operation: "pincodeManagement"
        },
        loadChildren: () =>
          import("./components/pincode-management/pincode-management.module").then(
            m => m.PincodeManagementModule
          )
      },
      {
        path: "areaManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_AREA_VIEW,
          classId: AclClassConstants.ACL_AREA,
          accessIdForAllOpreation: AclConstants.OPERATION_AREA_ALL,
          operation: "areaManagement"
        },
        loadChildren: () =>
          import("./components/area-management/area-management.module").then(
            m => m.AreaManagementModule
          )
      },
      {
        path: "discountManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_DISCOUNT_VIEW,
          classId: AclClassConstants.ACL_DISCOUNT,
          accessIdForAllOpreation: AclConstants.OPERATION_DISCOUNT_ALL,
          operation: "discountManagement"
        },
        loadChildren: () =>
          import("./components/discount-management/discount-management.module").then(
            m => m.DiscountManagementModule
          )
      },
      // {
      //   path: "customer/:custType",
      //   canActivate: [AuthguardGuard],
      //   data: {
      //     operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
      //     classId: AclClassConstants.ACL_CUSTOMER,
      //     accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
      //     operation: "customer",
      //   },
      //   loadChildren: () =>
      //     import("./components/customer-old/customer-old.module").then(m => m.CustomerOldModule),
      // },
      {
        path: "customer",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
          classId: AclClassConstants.ACL_CUSTOMER,
          accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
          operation: "customer"
        },
        loadChildren: () =>
          import("./components/customer/customer.module").then(m => m.CustomerModule)
      },
      // {
      //   path: "customer",
      //   canActivate: [AuthguardGuard],
      //   data: {
      //     operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
      //     classId: AclClassConstants.ACL_CUSTOMER,
      //     accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
      //     operation: "customer",
      //   },
      //   loadChildren: () =>
      //     import("./componen                                                                            ts/postpaid-customer/postpaid-customer.module").then(m => m.PostpaidCustomerModule),
      // },
      // {
      //   path: "prepaid-customer",
      //   canActivate: [AuthguardGuard],
      //   data: {
      //     operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
      //     classId: AclClassConstants.ACL_CUSTOMER,
      //     accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
      //     operation: "prepaid-customer",
      //   },
      //   loadChildren: () =>
      //     import("./components/prepaid-customer-copy/prepaid-customer.module").then(
      //       m => m.PrepaidCustomerModule
      //     ),
      // },
      {
        path: "partner",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_PARTNER_VIEW,
          classId: AclClassConstants.ACL_PARTNER,
          accessIdForAllOpreation: AclConstants.OPERATION_PARTNER_ALL,
          operation: "partner"
        },
        loadChildren: () => import("./components/partner/partner.module").then(m => m.PartnerModule)
      },
      {
        path: "userProfile",
        canActivate: [AuthguardGuard],
        // data: {
        //   operationId: AclConstants.OPERATION_PARTNER_VIEW,
        //   classId: AclClassConstants.ACL_PARTNER,
        //   accessIdForAllOpreation: AclConstants.OPERATION_PARTNER_ALL,
        //   operation: "partner",
        // },
        loadChildren: () =>
          import("./components/user-profile/user-profile.module").then(m => m.UserProfileModule)
      },
      {
        path: "buildingConfigManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_PARTNER_VIEW,
          classId: AclClassConstants.ACL_PARTNER,
          accessIdForAllOpreation: AclConstants.OPERATION_PARTNER_ALL,
          operation: "partner"
        },
        loadChildren: () =>
          import("./components/building-config-management/building-config-management.module").then(
            m => m.BuildingConfigManagementModule
          )
      },
      {
        path: "serviceArea",
        loadChildren: () =>
          import("./components/service-area/service-area.module").then(m => m.ServiceAreaModule)
      },
      {
        path: "customer-caf/:custType",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
          classId: AclClassConstants.ACL_CUSTOMER,
          accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
          operation: "customer-caf"
        },
        loadChildren: () =>
          import("./components/customer-caf/customer-caf.module").then(m => m.CustomerCafModule)
      },
      {
        path: "customer-template",
        canActivate: [AuthguardGuard],
        // data: {
        //   operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
        //   classId: AclClassConstants.ACL_CUSTOMER,
        //   accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
        //   operation: "customer-template",
        // },
        loadChildren: () =>
          import("./components/customer-template/customer-template.module").then(
            m => m.CustomerTemplateModule
          )
      },
      // {
      //   path: "add-service",
      //   canActivate: [AuthguardGuard],
      //   // data: {
      //   //   operationId: AclConstants.OPERATION_CUSTOMER_VIEW,
      //   //   classId: AclClassConstants.ACL_CUSTOMER,
      //   //   accessIdForAllOpreation: AclConstants.OPERATION_CUSTOMER_ALL,
      //   //   operation: "customer-template",
      //   // },
      //   loadChildren: () =>
      //     import("./components/add-service/add-service.module").then(
      //       m => m.AddServiceModule
      //     ),
      // },
      {
        path: "ticketManagement",
        loadChildren: () =>
          import("./components/ticket-management/ticket-management.module").then(
            m => m.TicketManagementModule
          )
      },
      {
        path: "openOpportunity",
        loadChildren: () =>
          import("./components/junk-email/junk-email.module").then(m => m.JunkEmailModule)
      },
      {
        path: "ticketReason",
        loadChildren: () =>
          import("./components/ticket-reason/ticket-reason.module").then(m => m.TicketReasonModule)
      },
      {
        path: "resolutionMaster",
        loadChildren: () =>
          import("./components/resolution-master/resolution-master.module").then(
            m => m.ResolutionMasterModule
          )
      },
      {
        path: "networkDevice",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_NETWORK_DEVICES_VIEW,
          classId: AclClassConstants.ACL_NETWORK_DEVICES,
          accessIdForAllOpreation: AclConstants.OPERATION_NETWORK_DEVICES_ALL,
          operation: "networkDevice"
        },
        loadChildren: () =>
          import("./components/network-device/network-device.module").then(
            m => m.NetworkDeviceModule
          )
      },
      {
        path: "auditLog",
        loadChildren: () =>
          import("./components/audit-log/audit-log.module").then(m => m.AuditLogModule)
      },
      {
        path: "billtemplate",
        loadChildren: () =>
          import("./components/billtemplate/billtemplate.module").then(m => m.BilltemplateModule)
      },
      {
        path: "teams",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_TEAMS_VIEW,
          classId: AclClassConstants.ACL_TEAMS,
          accessIdForAllOpreation: AclConstants.OPERATION_TEAMS_ALL,
          operation: "teams"
        },
        loadChildren: () => import("./components/teams/teams.module").then(m => m.TeamsModule)
      },
      {
        path: "recordPayment",
        loadChildren: () =>
          import("./components/record-payment/record-payment.module").then(
            m => m.RecordPaymentModule
          )
      },
      {
        path: "searchPayment",
        loadChildren: () =>
          import("./components/search-payment/search-payment.module").then(
            m => m.SearchPaymentModule
          )
      },
      {
        path: "billRunMaster",
        loadChildren: () =>
          import("./components/bill-run-master/bill-run-master.module").then(
            m => m.BillRunMasterModule
          )
      },
      {
        path: "billRunMaster/:type",
        loadChildren: () =>
          import("./components/bill-run-master/bill-run-master.module").then(
            m => m.BillRunMasterModule
          )
      },
      {
        path: "invoiceMaster",
        loadChildren: () =>
          import("./components/invoice-master/invoice-master.module").then(
            m => m.InvoiceMasterModule
          )
      },
      {
        path: "prepaid-invoiceMaster",
        loadChildren: () =>
          import("./components/prepaid-invoice-master/prepaid-invoice-master.module").then(
            m => m.PrepaidInvoiceMasterModule
          )
      },
      {
        path: "TrialBill",
        loadChildren: () =>
          import("./components/trial-bill/trial-bill.module").then(m => m.TrialBillModule)
      },
      {
        path: "customerDetail",
        component: CustomerDetailsComponent
      },
      {
        path: "viewDetail",
        component: CustomerViewDetailsComponent
      },
      {
        path: "searchDetail",
        component: SearchDetailComponent
      },
      {
        path: "planBundle",
        loadChildren: () =>
          import("./components/plan-bundle/plan-bundle.module").then(m => m.PlanBundleModule)
      },
      {
        path: "trialInvoice",
        loadChildren: () =>
          import("./components/trial-invoice/trial-invoice.module").then(m => m.TrialInvoiceModule)
      },
      {
        path: "customer-documents/:custType/:id",
        loadChildren: () =>
          import("./components/customer-documents/customer-documents.module").then(
            m => m.CustomerDocumentsModule
          )
      },
      {
        path: "SystemConfig",
        loadChildren: () =>
          import("./components/systemconfig/systemconfig.module").then(m => m.SystemconfigModule)
      },
      {
        path: "change-plan/:id",
        loadChildren: () =>
          import("./components/change-plan/change-plan.module").then(m => m.ChangePlanModule)
      },
      {
        path: "mvnoManagement",
        loadChildren: () =>
          import("./components/mvno-management/mvno-management.module").then(
            m => m.MvnoManagementModule
          )
      },
      {
        path: "generateBillRun",
        loadChildren: () =>
          import("./components/generate-bill-run/generate-bill-run.module").then(
            m => m.GenerateBillRunModule
          )
      },
      {
        path: "generateTrialBillRun",
        loadChildren: () =>
          import("./components/generate-trial-bill-run/generate-trial-bill-run.module").then(
            m => m.GenerateTrialBillRunModule
          )
      },
      // {
      //   path: "prepaid-customer-caf",
      //   loadChildren: () =>
      //     import("./components/prepaid-customer-caf/prepaid-customer-caf.module").then(
      //       m => m.PrepaidCustomerCafModule
      //     ),
      // },
      {
        path: "team-hierarchy",
        loadChildren: () =>
          import("./components/team-hierarchy/team-hierarchy.module").then(
            m => m.TeamHierarchyModule
          )
      },
      {
        path: "Template",
        loadChildren: () =>
          import("./components/template/template.module").then(m => m.TemplateModule)
      },
      {
        path: "product",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_PRODUCT_MANAGEMENT_VIEW,
          classId: AclClassConstants.ACL_PRODUCT,
          accessIdForAllOpreation: AclConstants.OPERATION_PRODUCT_MANAGEMENT_ALL,
          operation: "product"
        },
        loadChildren: () =>
          import("./components/product-management/product-management.module").then(
            m => m.ProductManagementModule
          )
      },

      {
        path: "productCategory",
        loadChildren: () =>
          import("./components/product-category-management/product-category-management.module").then(
            m => m.ProductCategoryManagementModule
          )
      },
      {
        path: "vendorManagement",
        loadChildren: () =>
          import("./components/vendor-management/vendor-management.module").then(
            m => m.VendorManagementModule
          )
      },
      {
        path: "popManagement",
        loadChildren: () =>
          import("./components/pop-managements/pop-managements.module").then(
            m => m.PopManagementsModule
          )
      },
      {
        path: "bulkConsumption",
        loadChildren: () =>
          import("./components/bulk-consumption/bulk-consumption.module").then(
            m => m.BulkConsumptionModule
          )
      },
      {
        path: "externalItemManagement",
        loadChildren: () =>
          import("./components/external-item-management/external-item-management.module").then(
            m => m.ExternalItemManagementModule
          )
      },

      {
        path: "warehouseManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_WARE_HOUSE_VIEW,
          classId: AclClassConstants.ACL_WARE_HOUSE,
          accessIdForAllOpreation: AclConstants.OPERATION_WARE_HOUSE_ALL,
          operation: "warehouseManagement"
        },
        loadChildren: () =>
          import("./components/warehouse-management/warehouse-management.module").then(
            m => m.WarehouseManagementModule
          )
      },
      {
        path: "inwards",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_INWARD_VIEW,
          classId: AclClassConstants.ACL_INWARD,
          accessIdForAllOpreation: AclConstants.OPERATION_INWARD_ALL,
          operation: "inwards"
        },
        loadChildren: () => import("./components/inwards/inwards.module").then(m => m.InwardsModule)
      },
      {
        path: "outwards",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_OUTWARD_VIEW,
          classId: AclClassConstants.ACL_OUTWARD,
          accessIdForAllOpreation: AclConstants.OPERATION_OUTWARD_ALL,
          operation: "outwards"
        },
        loadChildren: () =>
          import("./components/outwards/outwards.module").then(m => m.OutwardsModule)
      },
      {
        path: "maps",
        component: MapsComponent
      },
      {
        path: "assignedInventory",
        loadChildren: () =>
          import("./components/assigned-inventory/assigned-inventory.module").then(
            m => m.AssignedInventoryModule
          )
      },
      {
        path: "ipManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_IPPOOL_VIEW,
          classId: AclClassConstants.ACL_IPPOOL,
          accessIdForAllOpreation: AclConstants.OPERATION_IPPOOL_ALL,
          operation: "ipManagement"
        },
        loadChildren: () =>
          import("./components/ip-management/ip-management.module").then(m => m.IpManagementModule)
      },
      {
        path: "manageBalance",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_MANAGE_BALANCE_VIEW,
          classId: AclClassConstants.ACL_PARTNER_PAYMENT,
          accessIdForAllOpreation: AclConstants.OPERATION_MANAGE_BALANCE_ALL,
          operation: "manageBalance"
        },
        loadChildren: () =>
          import("./components/manage-balance/manage-balance.module").then(
            m => m.ManageBalanceModule
          )
      },
      {
        path: "leased-line-customer",
        loadChildren: () =>
          import("./components/leased-line-customer/leased-line-customer.module").then(
            m => m.LeasedLineCustomerModule
          )
      },
      {
        path: "invoice/recordPayment",
        loadChildren: () =>
          import("./components/invoice-record-payment/invoice-record-payment.module").then(
            m => m.InvoiceRecordPaymentModule
          )
      },
      {
        path: "invoice/search-payment",
        loadChildren: () =>
          import("./components/invoice-search-payment/invoice-search-payment.module").then(
            m => m.InvoiceSearchPaymentModule
          )
      },
      {
        path: "planGroup",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_PLAN_GROUP_VIEW,
          classId: AclClassConstants.ACL_PLAN_GROUP,
          accessIdForAllOpreation: AclConstants.OPERATION_PLAN_GROUP_ALL,
          operation: "planGroup"
        },
        loadChildren: () =>
          import("./components/plan-group/plan-group.module").then(m => m.PlanGroupModule)
      },
      {
        path: "otp",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_OTP_VIEW,
          classId: AclClassConstants.ACL_OTP,
          accessIdForAllOpreation: AclConstants.OPERATION_OTP_ALL,
          operation: "otp"
        },
        loadChildren: () => import("./components/otp/otp.module").then(m => m.OtpModule)
      },
      {
        path: "ticket-reason-category",
        loadChildren: () =>
          import("./components/ticket-reason-category/ticket-reason-category.module").then(
            m => m.TicketReasonCategoryModule
          )
      },
      {
        path: "ticket-reason-sub-category",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_SUB_REASON_CATEGORY_VIEW,
          classId: AclClassConstants.ACL_TICKET_REASON_SUB_CATEGORY,
          accessIdForAllOpreation: AclConstants.OPERATION_SUB_REASON_CATEGORY_ALL,
          operation: "ticket-reason-sub-category"
        },
        loadChildren: () =>
          import("./components/ticket-reason-sub-category/ticket-reason-sub-category.module").then(
            m => m.TicketReasonSubCategoryModule
          )
      },
      {
        path: "bankManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_BANK_MANAGEMENT_VIEW,
          classId: AclClassConstants.ACL_BANK_MANAGEMENT,
          accessIdForAllOpreation: AclConstants.OPERATION_BANK_MANAGEMENT_ALL,
          operation: "bankManagement"
        },
        loadChildren: () =>
          import("./components/bankmanagement/bankmanagement.module").then(
            m => m.BankmanagementModule
          )
      },
      {
        path: "timeBasePolicy",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_TIME_BASE_POLICY_VIEW,
          classId: AclClassConstants.ACL_TIME_BASE_POLICY,
          accessIdForAllOpreation: AclConstants.OPERATION_TIME_BASE_POLICY_ALL,
          operation: "timeBasePolicy"
        },
        loadChildren: () =>
          import("./components/time-base-policy/timebasepolicy.module").then(
            m => m.TimebasepolicyModule
          )
      },
      {
        path: "branch-management",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_BRANCH_VIEW,
          classId: AclClassConstants.ACL_BRANCH,
          accessIdForAllOpreation: AclConstants.OPERATION_BRANCH_ALL,
          operation: "branch-management"
        },
        loadChildren: () =>
          import("./components/branch-management/branch-management.modules").then(
            m => m.BranchManagementModule
          )
      },
      {
        path: "reported-problem",
        loadChildren: () =>
          import("./components/reported-problem/reported-problem.module").then(
            m => m.ReportedProblemModule
          )
      },
      {
        path: "lead-source-master",
        loadChildren: () =>
          import("./components/lead-source-master/lead-source-master.module").then(
            res => res.LeadSourceMasterModule
          )
      },
      {
        path: "lead-management",
        loadChildren: () =>
          import("./components/lead-management/lead-management.module").then(
            res => res.LeadManagementModule
          )
      },
      {
        path: "rejected-reason-master",
        loadChildren: () =>
          import("./components/rejected-reason-master/rejected-reason-master.module").then(
            res => res.RejectedReasonMasterModule
          )
      },
      // {
      //   path: "postpaid-rejected-reason-master",
      //   loadChildren: () =>
      //     import("./components/postpaid-rejected-reason-master/postpaid-rejected-reason-master.module").then(
      //       res => res.PostpaidRejectedReasonMasterModule
      //     ),
      // },
      {
        path: "prepaid-rejected-reason-master",
        loadChildren: () =>
          import("./components/prepaid-rejected-reason-master/prepaid-rejected-reason-master.module").then(
            res => res.PrepaidRejectedReasonMasterModule
          )
      },
      {
        path: "dbr-problem",
        loadChildren: () =>
          import("./components/dbr-report/dbr-report.module").then(m => m.DbrReportModule)
      },
      {
        path: "TAT_Matrics",
        loadChildren: () =>
          import("./components/tat-matrics/tat-Matrics.module").then(m => m.TatMatricsModule)
      },
      {
        path: "myOrganizationCustomer",
        loadChildren: () =>
          import("./components/myorganizationcustomer/myorganizationcustomer.module").then(
            m => m.MyorganizationcustomerModule
          )
      },
      {
        path: "lead-documents/:id",
        loadChildren: () =>
          import("./components/lead-documents/lead-documents.module").then(
            m => m.LeadDocumentsModule
          )
      },
      {
        path: "partnerDocument/:id",
        loadChildren: () =>
          import("./components/partner-documenet/partner-document.module").then(
            m => m.PartnerDocumenetModule
          )
      },
      {
        path: "mystaff/:id",
        loadChildren: () =>
          import("./components/my-staff-details/my-staff-details.module").then(
            m => m.MyStaffDetailsModule
          )
      },
      {
        path: "ticketmaster",
        loadChildren: () =>
          import("./components/tatmaster/tatmaster.module").then(m => m.TATmasterModule)
      },
      {
        path: "region",
        loadChildren: () =>
          import("./components/region-management/region-management.module").then(
            m => m.RegionManagementModule
          )
      },
      {
        path: "inventory-request",
        loadChildren: () =>
          import("./components/inventory-request/inventory-request.module").then(
            m => m.InventoryRequestModule
          )
      },
      {
        path: "businessVertical",
        loadChildren: () =>
          import("./components/business-vertical-management/business-vertical-management.module").then(
            m => m.BusinessVerticalManagementModule
          )
      },
      {
        path: "subbusinessVertical",
        loadChildren: () =>
          import("./components/sub-business-vertical/sub-business-vertical.module").then(
            m => m.SubBusinessVerticalManagementModule
          )
      },
      {
        path: "casmanagement",
        loadChildren: () =>
          import("./components/cas-management/cas-management.modules").then(
            m => m.casManagementModules
          )
      },
      {
        path: "sector",
        loadChildren: () =>
          import("./components/sector-management/sector-management.modules").then(
            m => m.SectorManagementtModules
          )
      },
      {
        path: "navMaster",
        loadChildren: () =>
          import("./components/nav-master/navmaster.module").then(m => m.NavmasterModule)
      },
      {
        path: "acs-master",
        loadChildren: () =>
          import("./components/acs-master/acs-master.modules").then(m => m.AcsMasterModules)
      },
      {
        path: "goverment-integration",
        loadChildren: () =>
          import("./components/goverment-integration/goverment-integration.modules").then(
            m => m.GovermentIntegrationModules
          )
      },
      {
        path: "field-temp-mapping",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/field-temp-mapping/field-temp-mapping.module").then(
            m => m.FieldTempMappingModule
          )
      },
      {
        path: "voucherManagement",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/voucher-configuration/voucher-configuration.module").then(
            m => m.VoucherConfigurationModule
          )
      },
      {
        path: "vasManagement",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/vas-management/vas-management.module").then(
            m => m.VasManagementModule
          )
      },
      {
        path: "location",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/location/location.module").then(m => m.LocationModule)
      },
      {
        path: "voucherBatch",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/voucher-batch/voucher-batch.module").then(m => m.VoucherBatchModule)
      },

      {
        path: "voucher",
        canActivate: [AuthguardGuard],
        loadChildren: () => import("./components/voucher/voucher.module").then(m => m.VoucherModule)
      },

      {
        path: "leadbeta",
        loadChildren: () =>
          import("./components/lead-beta/lead-beta.module").then(m => m.LeadBetaModule)
      },
      {
        path: "enterprise-lead",
        loadChildren: () =>
          import("./components/enterprise-lead/enterprise-lead.module").then(
            m => m.EnterpriseLeadModule
          )
      },
      {
        path: "quickInvoice",
        loadChildren: () =>
          import("./components/quick-invoice/quick-invoice.module").then(m => m.QuickInvoiceModule)
      },
      {
        path: "KPI-management",
        loadChildren: () =>
          import("./components/kpi-management/kpi-management.module").then(
            m => m.KpiManagementModule
          )
      },
      {
        path: "target-management",
        loadChildren: () =>
          import("./components/target-management/target-management.module").then(
            m => m.TargetManagementModule
          )
      },
      {
        path: "my-achievement",
        loadChildren: () =>
          import("./components/my-achievement/my-achievement.module").then(
            m => m.MyAchievementModule
          )
      },
      {
        path: "departmentManagement",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/department-management/department-management.module").then(
            m => m.DepartmentManagementModule
          )
      },
      {
        path: "payment-gateway-configuration",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/payment-gateway-configuration/payment-gateway-configuration.module").then(
            m => m.PaymentGatewayConfigurationModule
          )
      },
      {
        path: "migration",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/migration/migration.module").then(m => m.MigrationModule)
      },
      {
        path: "feedback",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/feedback/feedback.module").then(m => m.FeedbackModule)
      },
      {
        path: "integration-configuration",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/integration-configuration/integration-configuration.module").then(
            m => m.IntegrationConfigurationModule
          )
      },
      {
        path: "integration-audit",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/integration-audit/integration-audit.module").then(
            m => m.IntegrationAuditModule
          )
      },
      {
        path: "audit-report",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/audit-management/audit-management.module").then(
            m => m.AuditManagementModule
          )
      },
      {
        path: "third-party-integration-menu",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/third-party-menu/third-party-menu.module").then(
            m => m.ThirdPartyMenuModule
          )
      },
      {
        path: "mvno-documents/:id",
        loadChildren: () =>
          import("./components/mvno-documents/mvno-documents.module").then(
            m => m.MvnoDocumentsModule
          )
      },
      {
        path: "access-response",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/radius-access-response-managemnt/radius-access-response-managemnt.module").then(
            m => m.RadiusAccessResponseManagementModule
          )
      },
      {
        path: "partnerbilltemplate",
        loadChildren: () =>
          import("./components/partner-bill-template/partner-bill-template.module").then(
            m => m.PartnerBilltemplateModule
          )
      },
      {
        path: "vlanManagement",
        loadChildren: () =>
          import("./components/vlan-management/vlan-profile.module").then(m => m.VlanProfileModule)
      },
      {
        path: "radiusipManagement",
        canActivate: [AuthguardGuard],
        data: {
          operationId: AclConstants.OPERATION_RADIUSIPPOOL_VIEW,
          classId: AclClassConstants.ACL_RADIUSIPPOOL,
          accessIdForAllOpreation: AclConstants.OPERATION_RADIUSIPPOOL_ALL,
          operation: "radiusipManagement"
        },
        loadChildren: () =>
          import("./components/radius-ip/radius-ip.module").then(m => m.RadiusIpManagementModule)
      },
      {
        path: "faulty-mac",
        loadChildren: () =>
          import("./components/fulty-mac-management/fulty-mac-management.module").then(
            m => m.FultyMacManagementModule
          )
      },
      {
        path: "tat-for-task",
        loadChildren: () =>
          import("./components/task-for-tatmaster/task-for-tatmaster.module").then(
            m => m.TaskForTATmasterModule
          )
      },
      {
        path: "task-category",
        loadChildren: () =>
          import("./components/task-ticket-category/task-ticket-category.module").then(
            m => m.TaskTicketCategoryModule
          )
      },
      {
        path: "task-sub-category",
        loadChildren: () =>
          import("./components/task-ticket-sub-category/task-ticket-sub-category.module").then(
            m => m.TaskTicketSubCategoryModule
          )
      },
      {
        path: "taskManagement",
        loadChildren: () =>
          import("./components/task-ticket-management/task-ticket-management.module").then(
            m => m.TaskTicketManagementModule
          )
      },
      {
        path: "technicianDiary",
        loadChildren: () =>
          import("./components/task-calendar/task-calendar.module").then(m => m.TaskCalendarModule)
      },
      {
        path: "technicianDiaryDetails/:calType/:id",
        loadChildren: () =>
          import("./components/task-calendar-details/task-calendar-details-management.module").then(
            m => m.TaskCalendarDetaillsManagementModule
          )
      },
      {
        path: "search-customer",
        canActivate: [AuthguardGuard],
        component: CustomerVerifyListComponent
      },
      {
        path: "callDetails/:customerId",
        canActivate: [AuthguardGuard],
        component: CallDetailsComponent
      },
      {
        path: "knowledgebase",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/knowledge-base/knowledge-base.module").then(
            m => m.KnowledgeBaseModule
          )
      },
      {
        path: "schedular-management",
        canActivate: [AuthguardGuard],
        loadChildren: () =>
          import("./components/schedular-management/schedular-management.module").then(
            m => m.SchedularManagementModule
          )
      },
      {
        path: "resolutiontaskMaster",
        loadChildren: () =>
          import("./components/resolution-task-master/resolution-task-master.module").then(
            m => m.ResolutionTaskMasterModule
          )
      },
      {
        path: "password-policy",
        loadChildren: () =>
          import("./components/password-policy/password-policy.module").then(
            m => m.PasswordPolicyModule
          )
      },
      {
        path: "proforma-invoice",
        loadChildren: () =>
          import("./components/proforma-invoice/proforma-invoice.module").then(
            m => m.PerformaInvoiceModule
          )
      },
      {
        path: "ticket-finding",
        loadChildren: () =>
          import("./components/ticket-finding/ticket-finding.module").then(
            m => m.TicketFindingModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
