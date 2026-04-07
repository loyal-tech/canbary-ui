import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { ADOPT_COMMON_BASE_URL } from '../RadiusUtils/RadiusConstants';
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
@Injectable({
  providedIn: "root"
})
export class StatusCheckService {
  isActiveSalesCrm = false;
  isActiveCMS = false;
  isActivePMS = false;
  isActiveTicketService = false;
  isActiveInventoryService = false;
  isActiveRevenueService = false;
  isActiveRadiusService = false;
  isActiveNotificationService = false;
  isActiveTaskManagementService = false;
  isActiveKPIService = false;
  isActiveIntegrationService = false;
  isActiveNetConfService = false;
  isActiveTacacs = false;
  constructor(private http: HttpClient) {}

  getServiceStatus() {
    const keys = [
      "isActiveSalesCrm",
      "isActiveCMS",
      "isActivePMS",
      "isActiveTicketService",
      "isActiveInventoryService",
      "isActiveRevenueService",
      "isActiveRadiusService",
      "isActiveNotificationService",
      "isActiveTaskManagementService",
      "isActiveKPIService",
      "isActiveIntegrationService",
      "isActiveNetConfService",
      "isActiveTacacs"
    ];

    keys.forEach(key => {
      (this as any)[key] = localStorage.getItem(key) === "true";
    });
  }

  getSaleCrmServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_LEAD_BASE_URL}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveSalesCrm = true;
        localStorage.setItem("isActiveSalesCrm", "true");
      },
      (error: any) => {
        this.isActiveSalesCrm = false;
        localStorage.setItem("isActiveSalesCrm", "false");
      }
    );
  }

  getCMSServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_PRODUCT_MANAGEMENT_BASE_URL}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveCMS = true;
        localStorage.setItem("isActiveCMS", "true");
      },
      (error: any) => {
        this.isActiveCMS = false;
        localStorage.setItem("isActiveCMS", "false");
      }
    );
  }

  getPMSServiceStatus() {
    this.http.get(`${RadiusConstants.PMS_URL}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActivePMS = true;
        localStorage.setItem("isActivePMS", "true");
      },
      (error: any) => {
        this.isActivePMS = false;
        localStorage.setItem("isActivePMS", "false");
      }
    );
  }

  getTicketServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_TICKET_MANAGEMENT}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveTicketService = true;
        localStorage.setItem("isActiveTicketService", "true");
      },
      (error: any) => {
        this.isActiveTicketService = false;
        localStorage.setItem("isActiveTicketService", "false");
      }
    );
  }

  getInventoryServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_INVENTORY_MANAGEMENT_BASE_URL}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveInventoryService = true;
        localStorage.setItem("isActiveInventoryService", "true");
      },
      (error: any) => {
        this.isActiveInventoryService = false;
        localStorage.setItem("isActiveInventoryService", "false");
      }
    );
  }

  getRevenueServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_REVENUE_MANAGEMENT_BASE_URL}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveRevenueService = true;
        localStorage.setItem("isActiveRevenueService", "true");
      },
      (error: any) => {
        this.isActiveRevenueService = false;
        localStorage.setItem("isActiveRevenueService", "false");
      }
    );
  }

  getRadiusServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_RADIUS_BASE_URL}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveRadiusService = true;
        localStorage.setItem("isActiveRadiusService", "true");
      },
      (error: any) => {
        this.isActiveRadiusService = false;
        localStorage.setItem("isActiveRadiusService", "false");
      }
    );
  }

  getNotificationServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_NOTIFICATION_BASE_URL}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveNotificationService = true;
        localStorage.setItem("isActiveNotificationService", "true");
      },
      (error: any) => {
        this.isActiveNotificationService = false;
        localStorage.setItem("isActiveNotificationService", "false");
      }
    );
  }

  getTaskManagementServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_TASK_MANAGEMENT}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveTaskManagementService = true;
        localStorage.setItem("isActiveTaskManagementService", "true");
      },
      (error: any) => {
        this.isActiveTaskManagementService = false;
        localStorage.setItem("isActiveTaskManagementService", "false");
      }
    );
  }

  getKPIServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_KPI_BASE_URL}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveKPIService = true;
        localStorage.setItem("isActiveKPIService", "true");
      },
      (error: any) => {
        this.isActiveKPIService = false;
        localStorage.setItem("isActiveKPIService", "false");
      }
    );
  }

  getIntegrationServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_INTEGRATION_SYSTEM_BASE_URL}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveIntegrationService = true;
        localStorage.setItem("isActiveIntegrationService", "true");
      },
      (error: any) => {
        this.isActiveIntegrationService = false;
        localStorage.setItem("isActiveIntegrationService", "false");
      }
    );
  }

  getTacacsStatus() {
    // this.http
    //   .get(`${RadiusConstants.ADOPT_TACACS_MANAGEMENT_SYSTEM_BASE_URL}/tacacs-service/health`)
    //   .subscribe(
    //     (response: any) => {
    //       this.isActiveTacacs = true;
    //     },
    //     (error: any) => {
    //       this.isActiveTacacs = false;
    //     }
    //   );
    this.isActiveTacacs = false;
    localStorage.setItem("isActiveTacacs", "false");
  }

  getNetConfServiceStatus() {
    this.http.get(`${RadiusConstants.ADOPT_API_GATEWAY_NETCONF_CUSTOMER}/serviceStatus`).subscribe(
      (response: any) => {
        this.isActiveNetConfService = true;
        localStorage.setItem("isActiveNetConfService", "true");
      },
      (error: any) => {
        this.isActiveNetConfService = false;
        localStorage.setItem("isActiveNetConfService", "false");
      }
    );
  }
}
