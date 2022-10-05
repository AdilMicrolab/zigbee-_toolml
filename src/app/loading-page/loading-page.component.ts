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
  constructor(private mqtt_sub: Mqtt, private route: Router) {
    this.routed_data = this.route.getCurrentNavigation()!.extras.state;
  }

  ngOnInit(): void {
    let clicked_gateway = this.routed_data[1].replace('Gateway ', '').trim();
    console.log('ye');
    let topic: string =
      'zigbee/' + this.routed_data[2] + '_' + clicked_gateway + '/bridge/event';
    console.log(topic);
    this.subscription = this.mqtt_sub
      .topic(topic)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let jsonmsg = JSON.parse(msg);
        console.log(jsonmsg);
        this.ieee_addres = jsonmsg['ieee_address'];
        this.device_id = jsonmsg['description'];
        let type = jsonmsg['type'];
        let status = jsonmsg['status'];
        if (status == 'successful' && type == 'device_interview') {
          this.route_next_page(this.device_id, this.ieee_addres);
        }
        // give each gateway a count
        //force it to look at the start of a json
      });
  }
  route_next_page(id: string, i3_address: string) {
    console.log(id);
    if (id.includes('Zigbee 3.0 universal LED-controller')) {
      this.nav_page = 'set-lamps';
      this.route.navigate([this.nav_page], {
        state: [i3_address, id],
      });
    } else if (id.includes('blind')) {
      this.nav_page = 'set-blinds';
      this.route.navigate([this.nav_page], {
        state: [i3_address, id],
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
