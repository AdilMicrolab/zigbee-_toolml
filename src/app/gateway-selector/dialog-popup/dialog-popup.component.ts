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
  selec_gateway: string = '';

  constructor(
    dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public route: Router,
    private mqtt: Mqtt
  ) {}

  ngOnInit(): void {
    console.log('test', this.data);
    this.selec_gateway = this.data[1];
    this.gateway_array = this.data[3];
  }

  route_set_page() {
    this.gateway_array.forEach((array) => {
      console.log(array);
      if (array[0] == this.selec_gateway) {
        this.mqtt.publish(
          building_info.building_sateraito_prefix +
            this.data[2] +
            '/' +
            this.selec_gateway +
            '/bridge/request/permit_join',
          '{"value": true, "time": 1800}'
          // TODO: remove time to normal and check if next_device should restart timer
        );
      } else {
        this.mqtt.publish(
          building_info.building_sateraito_prefix +
            this.data[2] +
            '/' +
            array[0] +
            '/bridge/request/permit_join',
          '{"value": false}'
        );
      }
    });
    this.route.navigate(['loading-page'], {
      state: this.data,
    });
  }
}

export class DialogExample {
  constructor(public dialogRef: MatDialogRef<DialogPopupComponent>) {}
}
