import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, takeUntil, Subject, of } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { Mqtt } from '../mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { ActivatedRoute, Router } from '@angular/router';
import { building_info } from '../environments/environment';
@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css'],
})
export class LoadingPageComponent implements OnInit, OnDestroy {
  subscription!: Subscription;
  unSubscribe$ = new Subject();
  ieee_addres: string = '';
  Capacity: string;
  OnlineGateways: Array<string>;
  device_id: string = '';
  nav_page: string = '';
  floor_gateway: string = '';
  floor: string;
  CurrGateway: string;
  count: number = 0;
  status: string = '';
  constructor(
    private mqtt_sub: Mqtt,
    private route: Router,
    private ActRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ActRoute.queryParams.subscribe((params) => {
      this.Capacity = params['Capacity'];
      this.OnlineGateways = params['OnlineGateways'];
      this.CurrGateway = params['CurrGateway'];
      this.floor = params['floor'];
      this.floor_gateway = `${this.floor}/${this.CurrGateway}`;
    });

    // console.log('all data', this.routed_data);
    // let clicked_gateway = this.routed_data[1].replace('Gateway ', '').trim(); //TODO: OMG THIS NEEDS TO GO
    // this.floor_gateway = this.routed_data[2] + '/' + clicked_gateway;
    let topic: string =
      building_info.building_sateraito_prefix +
      this.floor_gateway +
      '/bridge/event';
    console.log(topic);
    // TODO: remove this sub and just pass data through a service or dictionary
    this.subscription = this.mqtt_sub // this sub is to recount incase we added devices
      .topic(
        building_info.building_sateraito_prefix +
          this.floor_gateway +
          '/bridge/devices'
      )
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let jsonmsg = JSON.parse(msg);
        this.count = Object.keys(jsonmsg).length - 1;
      });

    this.subscription = this.mqtt_sub
      .topic(topic)
      //TODO: set reasonable timeout
      .pipe(takeUntil(this.unSubscribe$), timeout(100000)) // 100 seconds
      .pipe(
        catchError((err) => {
          console.log(
            'timeout, cant find any interviewed devices... \n closing gateway'
          );
          this.mqtt_sub.publish(
            building_info.building_sateraito_prefix +
              this.floor_gateway +
              '/bridge/request/permit_join',
            '{"value": false}'
          );
          this.route.navigate(['floor-selector']);

          throw 'error in source. Details: ' + err;
        })
      )
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let jsonmsg = JSON.parse(msg);
        this.ieee_addres = jsonmsg['data']['ieee_address'];
        let type = jsonmsg['type'];
        console.log(jsonmsg);
        this.status = jsonmsg['data']['status'];
        console.log('status: ', this.status, ' \n type:', type);
        if (type == 'device_announce') {
          this.device_id = jsonmsg['data']['friendly_name'];
          this.route_next_page(this.device_id, this.ieee_addres);
        } else if (this.status == 'successful' && type == 'device_interview') {
          this.device_id = jsonmsg['data']['definition']['description'];
          this.route_next_page(this.device_id, this.ieee_addres);
        }
        // give each gateway a count
        //force it to look at the start of a json
      });
  }
  route_next_page(id: string, ieee_addres: string) {
    console.log(id);
    if (id.includes('LED') || id.includes('lamp')) {
      this.nav_page = 'set-lamps';
      this.route.navigate([this.nav_page], {
        queryParams: {
          Address: ieee_addres,
          DeviceType: 'lamp',
          FloorGateway: this.floor_gateway,
          Capacity: this.Capacity, //gateway cap
          OnlineGateways: this.OnlineGateways, //gateway info
        },
      });
    } else if (id.includes('blind')) {
      this.nav_page = 'set-lamps';
      this.route.navigate([this.nav_page], {
        queryParams: {
          Address: ieee_addres,
          DeviceType: 'blind',
          FloorGateway: this.floor_gateway,
          Capacity: this.Capacity, //gateway cap
          OnlineGateways: this.OnlineGateways, //gateway info
        },
      });
    } else {
      console.log('UNIDENTIFIED PRODUCT FOUND');
    }
  }

  navigate_back() {
    // let gateway_selected = this.routed_data[1];
    // let floor = this.routed_data[2];
    // let gateway_state = this.routed_data[3];
    this.mqtt_sub.publish(
      building_info.building_sateraito_prefix +
        this.floor +
        '/' +
        this.CurrGateway +
        '/bridge/request/permit_join',
      '{"value": false}'
    );
    // closing off the gateway before we return
    this.route.navigate(['gateway-selector'], {
      state: [this.floor, this.OnlineGateways],
    });
  }
  ngOnDestroy(): void {
    this.unSubscribe$.next('');
    this.unSubscribe$.complete();
  }
}
