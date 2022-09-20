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
  floor_selec: String = '';
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
    this.subscription = this.mqtt_sub
      .topic('zigbee/+/bridge/state')
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let full_topic: string = message.topic;
        let info_array = full_topic
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
        console.log(this.gateway_info);
        // this._ref.detectChanges();
      });
    // this.mqtt_sub.publish('test', 'test');
  }
  match_floors_gateways(info_array: any, selec_floor: String) {
    let test: string = '1';
    console.log(typeof selec_floor, selec_floor);
    console.log(selec_floor === '1');
    const devices = info_array.filter((obj: any) => {
      console.log(obj.floor);
      // console.log(selec_floor);
      return obj.floor === '1';
    });
    // const devices = info_array.find((x: any) => x.floor === selec_floor);
    console.log(devices);
    return devices;
    // get all devices for each floor and append
  }

  Floor_selected(event: any, info_array: any) {
    this.floor_selec = '';
    this.floor_selec = event.target.innerHTML;
    this.match_floors_gateways(info_array, this.floor_selec);
    // let test = this.floor_devices;
    // let devices = Object.keys(test)
    //   .filter(function (k) {
    //     return k.indexOf('floor_selec') == 0;
    //   })
    //   .reduce(function (newData: any, k) {
    //     newData[k] = test[k];
    //     return newData;
    //   }, {});

    this.route.navigate(['gateway-selector'], {
      state: { floor: this.floor_selec },
    });
    //console.log(this.floor_selec);
  }

  ngOnDestroy() {
    this.unSubscribe$.next('');
    this.unSubscribe$.complete();
  }
}
