import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerService } from "ngx-spinner";
import * as RadiusConstants from "src/app/RadiusUtils/RadiusConstants";
import { CustomermanagementService } from "src/app/service/customermanagement.service";
import { CommondropdownService } from "src/app/service/commondropdown.service";
import { CustomerInventoryManagementService } from "src/app/service/customer-inventory-management.service";
import { FormsModule } from "@angular/forms";

declare var $: any;

@Component({
  selector: "app-customer-near-by-devices",
  templateUrl: "./customer-near-by-devices.component.html",
  styleUrls: ["./customer-near-by-devices.component.css"]
})
export class CustomerNearByDevicesComponent implements OnInit {
  @Input() custId;
  // @Input() type;
  @Output() closeNearLocationModal = new EventEmitter();
  newFirst = 0;

  nearDeviceLocationData;
  customerIdINLocationDevice: any;
  nearLocationModal: boolean = false;
  currentPagenearDeviceLocationList = 1;
  nearDeviceLocationItemPerPage = RadiusConstants.ITEMS_PER_PAGE;
  nearDeviceLocationtotalRecords = 0;

  NetworkDeviceData: any;
  availableOutPorts: any;
  viewPort: any;
  viewPortDialog: boolean = false;
  isEditEnable: boolean = false;
  editMacSerialBtn: any = "";
  inFlag: boolean = false;

  constructor(
    private spinner: NgxSpinnerService,
    private customerManagementService: CustomermanagementService,
    public confirmationService: ConfirmationService,
    public commondropdownService: CommondropdownService,
    private messageService: MessageService,
    private customerInventoryManagementService: CustomerInventoryManagementService
  ) {}

  ngOnInit(): void {
    this.nearLocationModal = true;
    this.newFirst = 0;
    this.nearMyLocation();
  }

  nearMyLocation() {
    const url = "/customers/" + this.custId;

    this.customerManagementService.getMethod(url).subscribe((response: any) => {
      var viewcustomerListData = response.customers;
      this.customerIdINLocationDevice = viewcustomerListData.id;
      this.nearLocation(viewcustomerListData);
    });
  }

  nearLocation(data) {
    const deviceData = {
      latitude: data.latitude,
      longitude: data.longitude
    };
    const url = "/NetworkDevice/getNearbyDevices?customerId=" + this.customerIdINLocationDevice;
    this.customerManagementService.postMethodInventory(url, deviceData).subscribe(
      (response: any) => {
        if (response.responseCode == 406) {
          this.messageService.add({
            severity: "info",
            summary: "info",
            detail: response.responseMessage,
            icon: "far fa-times-circle"
          });
        } else {
          this.nearDeviceLocationData = response.locations;
        }
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.error,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  confirmAttachDeviceUpdate(networkdeviceID: number, portNumber: number) {
    if (!portNumber) {
      this.messageService.add({
        severity: "warn",
        summary: "Warning",
        detail: "Please select an Out Port before adding."
      });
      return;
    }
    if (networkdeviceID && portNumber) {
      this.confirmationService.confirm({
        message: `If the SN Splitter is changed, all associated device mappings—such as downgrade hierarchy bindings between the SN Splitter and Customer Inventory—linked to the previous SN Splitter will be automatically removed.
        <br><br>
        <strong>Confirmation Required:</strong> Are you sure you want to proceed with updating the attached configuration?`,
        acceptLabel: "Yes",
        rejectLabel: "No",
        icon: "pi pi-question-circle",
        accept: () => {
          this.bindNetworkDevice(networkdeviceID, portNumber);
        },
        reject: () => {}
      });
    }
  }

  bindNetworkDevice(networkdeviceID: number, portNumber: number) {
    const deviceData = {};
    const url =
      "/NetworkDevice/bindNetworkDevice?customerId=" +
      this.customerIdINLocationDevice +
      "&networkDeviceId=" +
      networkdeviceID +
      "&portBlockNumber=" +
      portNumber;

    this.customerManagementService.updateInventoryMethod(url, deviceData).subscribe(
      (response: any) => {
        this.NetworkDeviceData = response.locations;
        this.nearsearchClose();
        this.messageService.add({
          severity: "success",
          summary: "Successfully",
          detail: response.customer,
          icon: "far fa-check-circle"
        });
      },
      (error: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: error.error.ERROR,
          icon: "far fa-times-circle"
        });
      }
    );
  }

  pageChangedNearDeviceList(pageNumber) {
    this.currentPagenearDeviceLocationList = pageNumber;
  }

  nearsearchClose() {
    this.nearDeviceLocationData = [];
    this.closeNearLocationModal.emit();
    this.newFirst = 0;
    this.nearLocationModal = false;
  }
  checkAvailblePort(deviceId) {
    this.isEditEnable = true;
    this.editMacSerialBtn = deviceId;

    // Find the current row object
    const selectedDevice = this.nearDeviceLocationData.find(d => d.networkDeviceId === deviceId);

    if (selectedDevice) {
      this.currentParentPorts(selectedDevice, "OUT");
    }
  }

  currentParentPorts(device: any, type: string) {
    const url = `/NetworkDevice/checkPortAvailability?parentDeviceId=${device.networkDeviceId}&parentPortType=${type}`;

    this.customerInventoryManagementService.getMethod(url).subscribe(
      (response: any) => {
        this.availableOutPorts =
          response.dataList != null
            ? response.dataList
                .filter((item: string) => item.includes("OUT-Port"))
                .map(port => ({ label: port, value: port })) // format for p-dropdown
            : [];

        this.spinner.hide();
      },
      (error: any) => this.spinner.hide()
    );
  }

  viewPortBlock(data: any, isParent: boolean) {
    // Get single device object instead of array
    this.viewPort = this.nearDeviceLocationData.find(
      (device: any) => device.portBlockNumber === data.portBlockNumber
    );
    this.viewPortDialog = true; // Open dialog
  }
  closePortDetailsModel() {
    this.viewPortDialog = false;
  }
}
