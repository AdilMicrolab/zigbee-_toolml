import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Mqtt } from 'src/app/mqtt.service';
import { Router } from '@angular/router';
import { building_info } from 'src/app/environments/environment';

@Component({
  selector: 'app-dialog-popup',
  templateUrl: './dialog-popup.component.html',
  styleUrls: ['./dialog-popup.component.css'],
})
export class DialogPopupComponent implements OnInit {
  gateway_array: [] = [];
  floor: string;
  selec_gateway: string = '';

  constructor(
    dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public route: Router,
    private mqtt: Mqtt
  ) {}

  ngOnInit(): void {
    this.selec_gateway = this.data[1];
    this.floor = this.data[2];
    this.gateway_array = this.data[3];
    console.log(this.selec_gateway);
    console.log('this isthe gatewayarary ', this.gateway_array);
  }

  route_set_page() {
    this.gateway_array.forEach((array) => {
      if (array[0] == this.selec_gateway) {
        let OpenBridgeTopic = `${building_info.building_sateraito_prefix}${this.floor}/${array[0]}/bridge/request/permit_join`;
        this.mqtt.publish(OpenBridgeTopic, '{"value": true, "time": 1800}');

        // TODO: remove time to normal and check if next_device should restart timer
      } else {
        console.log('Publishing false to ', array[0]);
        let OpenBridgeTopic = `${building_info.building_sateraito_prefix}${this.floor}/${array[0]}/bridge/request/permit_join`;
        this.mqtt.publish(OpenBridgeTopic, '{"value": false}');
      }
    });
    console.log('this is the data being sent ', this.data);
    this.route.navigate(['loading-page'], {
      queryParams: {
        Capacity: this.data[0],
        CurrGateway: this.data[1],
        floor: this.data[2],
        OnlineGateways: this.data[3],
      },
    });
  }
}

export class DialogExample {
  constructor(public dialogRef: MatDialogRef<DialogPopupComponent>) {}
}
