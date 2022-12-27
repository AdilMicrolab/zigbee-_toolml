import { Component, OnDestroy, OnInit } from '@angular/core';
import { Mqtt } from 'src/app/mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogPopupComponent } from './dialog-popup/dialog-popup.component';
import { building_info } from 'src/app/environments/environment';

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
  max_capacity: number = 60;
  subscription!: Subscription;
  splitarray: Array<Array<string>> = [];
  unSubscribe$ = new Subject();
  full_gateway_description: Array<any> = [];
  device_count: Array<{ ids: string; count: number }> = [];
  amount_devices: { ids: string; count: number } = { ids: '', count: NaN };
  constructor(
    private route: Router,
    private mqtt_sub: Mqtt,
    private dialog: MatDialog,
    private ActRoute: ActivatedRoute
  ) {
    // console.log(this.floor_obj);
  }
  //TODO: DROP DUPLICATES IN GATEWAY ARRAY
  ngOnInit(): void {
    this.ActRoute.queryParams.subscribe((params) => {
      this.current_floor = params['FloorNumber'];
      this.current_gateways = params['OnlineGateways'];
    });
    this.SplitArrayIntoFloorStatus(this.current_gateways);
    this.splitarray.forEach((gateway_array) =>
      this.get_device_counts_raw(this.current_floor, gateway_array[0])
    );
    // this.current_gateways.forEach
  }
  SplitArrayIntoFloorStatus(array: string[]) {
    //splits array of ["3,{"state":"on"}] into
    // ["3", {"state": "on"}]
    array.forEach((element) => {
      let SplitFloorStatus = element.split(',');
      let ArraySplit = [SplitFloorStatus[0], SplitFloorStatus[1]];
      this.splitarray.push(ArraySplit);
    });
    console.log(this.splitarray, 'yuuuuup');
  }
  get_device_counts_raw(floor: string, sateraito: string) {
    let topic_devices: string =
      building_info.building_sateraito_prefix +
      floor +
      '/' +
      sateraito + //id of sateraito
      '/bridge/devices';
    console.log('topic ', topic_devices);
    this.subscription = this.mqtt_sub
      .topic(topic_devices)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let jsonmsg = JSON.parse(msg);
        let count = Object.keys(jsonmsg).length - 1; //  not sure why but it misscounts by 1
        let prefix: string = building_info.building_sateraito_prefix;
        let id = message.topic
          .replace(prefix, '')
          .replace('/bridge/devices', '')
          .split('/')[1];
        let log_msg = {
          ids: id,
          count: count,
        };
        this.device_count.push(log_msg); // count of devices per gateway
        //this.device_count.sort();
        console.log(this.device_count, ' count');
        this.build_gateway_structure(this.device_count, this.splitarray); // give each gateway a count
        //force it to look at the start of a json
      });
  }
  build_gateway_structure(
    item_count: Array<deviceCountObject>,
    gateway_description: any[]
  ) {
    this.full_gateway_description = [];
    // console.log(gateway_description);
    gateway_description.forEach((element) => {
      let gateway_id: string = element[0];
      let gateway_status = element[1];
      // console.log(gateway_id);
      // console.log(item_count);
      let t = {};
      if (item_count.some((e) => e.ids == gateway_id)) {
        // console.log('gateway id has a count');
        let device_count_array = item_count.filter(
          (obj: { ids: string; count: number }) => {
            return obj.ids === gateway_id;
          }
        )[0];
        let pushmsg = [gateway_id, gateway_status, device_count_array.count];
        this.full_gateway_description.push(pushmsg);
        this.full_gateway_description.filter(
          ((t = {}), (a) => !(t[a] = a in t))
        );
      } else {
        // console.log('gateway has no count');
        // console.log(item_count['4']);
        let pushmsg = [gateway_id, gateway_status, NaN];
        this.full_gateway_description.push(pushmsg);
        this.full_gateway_description.filter(
          ((t = {}), (a) => !(t[a] = a in t))
        );
        console.log(' drop duplicates here', this.full_gateway_description);
      }
    });
  }
  disable_gateways(gateway_status: string, gateway_cap: number) {
    let status = gateway_status.toLowerCase();
    // TODO: set right amount
    if (status == 'offline' || gateway_cap > this.max_capacity) {
      return true;
    } else {
      return false;
    }
  }
  navigate_back() {
    this.route.navigate(['floor-selector'], {});
  }
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    gateway_info: any
  ): void {
    this.dialog.closeAll();
    console.log('testtt', gateway_info);
    let cap_gateway = gateway_info[2];
    let clicked_gateway = gateway_info[0];
    this.dialog.open(DialogPopupComponent, {
      width: '1000px',
      data: [
        cap_gateway,
        clicked_gateway,
        this.current_floor,
        this.splitarray, //gatewayid + state
      ],
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  ngOnDestroy() {
    this.unSubscribe$.next('');
    this.unSubscribe$.complete();
  }
}
