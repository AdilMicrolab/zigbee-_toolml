import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { Mqtt } from '../mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { Router } from '@angular/router';
@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css'],
})
export class LoadingPageComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  unSubscribe$ = new Subject();
  routed_data: any;
  ieee_addres: string = '';
  device_id: string = '';
  nav_page: string = '';
  floor_gateway: string = '';
  constructor(private mqtt_sub: Mqtt, private route: Router) {
    this.routed_data = this.route.getCurrentNavigation()!.extras.state;
  }

  ngOnInit(): void {
    let clicked_gateway = this.routed_data[1].replace('Gateway ', '').trim();
    this.floor_gateway = this.routed_data[2] + '_' + clicked_gateway;
    let topic: string = 'zigbee/' + this.floor_gateway + '/bridge/event';
    console.log(topic);

    this.subscription = this.mqtt_sub // this sub is to recount incase we added devices
      .topic('zigbee/' + this.floor_gateway + '/bridge/devices')
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let jsonmsg = JSON.parse(msg);
        let count = Object.keys(jsonmsg).length;
      });

    this.subscription = this.mqtt_sub
      .topic(topic)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let jsonmsg = JSON.parse(msg);
        console.log('message');
        console.log(jsonmsg['data']);
        this.ieee_addres = jsonmsg['data']['ieee_address'];
        this.device_id = jsonmsg['data']['definition']['description'];
        let type = jsonmsg['type'];
        let status = jsonmsg['data']['status'];
        if (status == 'successful' && type == 'device_interview') {
          this.route_next_page(this.device_id, this.ieee_addres);
        }
        // give each gateway a count
        //force it to look at the start of a json
      });
  }
  route_next_page(id: string, i3_address: string) {
    if (id.includes('Zigbee 3.0 universal LED-controller')) {
      this.nav_page = 'set-lamps';
      this.route.navigate([this.nav_page], {
        state: [
          i3_address,
          'lamp',
          this.floor_gateway,
          this.routed_data[0],
          this.routed_data[3],
        ],
      });
    } else if (id.includes('blind')) {
      this.nav_page = 'set-lamps';
      this.route.navigate([this.nav_page], {
        state: [
          i3_address,
          'blind',
          this.floor_gateway,
          this.routed_data[0],
          this.routed_data[3],
        ],
      });
    } else {
      console.log('UNIDENTIFIED PRODUCT FOUND');
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe$.next('');
    this.unSubscribe$.complete();
  }
}
