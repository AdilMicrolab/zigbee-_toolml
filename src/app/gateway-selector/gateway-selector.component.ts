import { Component, OnDestroy, OnInit } from '@angular/core';
import { Mqtt } from 'src/app/mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogPopupComponent } from './dialog-popup/dialog-popup.component';
interface deviceCountObject {
  ids: string;
  count: number;
}

@Component({
  templateUrl: './gateway-selector.component.html',
  styleUrls: ['./gateway-selector.component.css'],
})
export class GatewaySelectorComponent implements OnInit, OnDestroy {
  current_floor: string = '';
  current_gateways: Array<string> = [];
  floor_obj: any;
  max_capacity: number = 50;
  subscription!: Subscription;
  unSubscribe$ = new Subject();
  full_gateway_description: Array<any> = [];
  device_count: Array<{ ids: string; count: number }> = [];
  amount_devices: { ids: string; count: number } = { ids: '', count: NaN };
  constructor(
    private route: Router,
    private mqtt_sub: Mqtt,
    private dialog: MatDialog
  ) {
    this.floor_obj = this.route.getCurrentNavigation()!.extras.state;
  }

  ngOnInit(): void {
    this.current_floor = this.floor_obj!['floor'];
    this.current_gateways = this.floor_obj!['gateways'];
    this.subscription = this.mqtt_sub
      .topic('zigbee/+/bridge/devices')
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let jsonmsg = JSON.parse(msg);
        let count = Object.keys(jsonmsg).length;
        let id = message.topic
          .replace('zigbee/', '')
          .replace('/bridge/devices', '')
          .split('_')[1];
        let log_msg = {
          ids: id,
          count: count,
        };
        this.device_count.push(log_msg); // count of devices per..
        //this.device_count.sort();
        this.build_gateway_structure(this.device_count, this.current_gateways); // give each gateway a count
        //force it to look at the start of a json
      });
  }

  build_gateway_structure(
    item_count: Array<deviceCountObject>,
    gateway_description: any[]
  ) {
    this.full_gateway_description = [];
    console.log(gateway_description);
    gateway_description.forEach((element) => {
      let gateway_id: string = element[0];
      let gateway_status = element[1];
      console.log(gateway_id);
      console.log(item_count);
      if (item_count.some((e) => e.ids == gateway_id)) {
        console.log('gateway id has a count');
        let device_count_array = item_count.filter(
          (obj: { ids: string; count: number }) => {
            return obj.ids === gateway_id;
          }
        )[0];
        let pushmsg = [gateway_id, gateway_status, device_count_array.count];
        this.full_gateway_description.push(pushmsg);
      } else {
        console.log('gateway has no count');
        console.log(item_count['4']);
        let pushmsg = [gateway_id, gateway_status, NaN];
        this.full_gateway_description.push(pushmsg);
      }
    });
  }
  disable_gateways(gateway_status: string, gateway_cap: number) {
    let status = gateway_status.toLowerCase();
    if (status == 'offline' || gateway_cap > 3) {
      return true;
    } else {
      return false;
    }
  }
  navigate_back() {
    this.route.navigate(['floor-selector'], {
      state: {},
    });
  }
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    event: any
  ): void {
    this.dialog.closeAll();
    let cap_gateway = event.target.innerHTML
      .trim()
      .split('cap. ')[1]
      .replace(')', '');
    let clicked_gateway = event.target.innerHTML.trim().split('(')[0];
    this.dialog.open(DialogPopupComponent, {
      width: '2500px',
      data: [cap_gateway, clicked_gateway, this.current_floor],
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  ngOnDestroy() {
    this.unSubscribe$.next('');
    this.unSubscribe$.complete();
  }
}
