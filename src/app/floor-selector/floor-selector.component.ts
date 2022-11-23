import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Mqtt } from 'src/app/mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { Router } from '@angular/router';
import { Subscription, takeUntil, Subject } from 'rxjs';

@Component({
  templateUrl: './floor-selector.component.html',
  styleUrls: ['./floor-selector.component.css'],
})
export class FloorSelectorComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  message: any;
  floor_selec: string = '';
  devices_selec: any[] = [];
  gateway_info: any = [];
  floor_list: any = [];
  unSubscribe$ = new Subject();
  current_gateway: string = '';
  current_floor: string = '';

  constructor(
    private mqtt_sub: Mqtt,
    private route: Router,
    private _ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('15/11/2022 version');
    this.subscription = this.mqtt_sub
      .topic('zigbee/+/bridge/state')
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let full_topic: string = message.topic;
        let info_array: string[] = full_topic
          .replace('zigbee/', '')
          .replace('/bridge/state', '')
          .split('_');
        this.current_floor = info_array[0];
        this.current_gateway = info_array[1];
        let log_msg = {
          floor: this.current_floor,
          gateway: this.current_gateway,
          status: msg,
        };
        if (!this.gateway_info.includes(log_msg)) {
          this.gateway_info.push(log_msg);
        }
        this.floor_list = [
          ...new Set(this.gateway_info.map((a: any) => a.floor)),
        ].sort();
        // console.log(this.gateway_info);
        // this._ref.detectChanges();
      });
    // this.mqtt_sub.publish('test', 'test');
  }
  match_floors_gateways(
    gateway_info: { floor: string; gateway: string; status: string }[],
    selec_floor: string
  ) {
    this.devices_selec = [];
    const devices = gateway_info.filter(
      (obj: { floor: string; gateway: string; status: string }) => {
        return obj.floor === selec_floor;
      }
    );

    this.devices_selec = [
      ...new Set(devices.map((a: any) => [a.gateway, a.status])),
    ].sort();

    return this.devices_selec;
    // get all devices for each floor and append
  }

  Floor_selected(
    gateway_info: { floor: string; gateway: string; status: string }[],
    floor: any
  ) {
    this.match_floors_gateways(gateway_info, floor);

    this.route.navigate(['gateway-selector'], {
      state: [floor, this.devices_selec],
    });
    //console.log(this.floor_selec);
  }

  ngOnDestroy() {
    this.unSubscribe$.next('');
    this.unSubscribe$.complete();
  }
}
