import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  templateUrl: './gateway-selector.component.html',
  styleUrls: ['./gateway-selector.component.css'],
})
export class GatewaySelectorComponent implements OnInit {
  floor_obj: any;
  constructor(private route: Router) {
    this.floor_obj = this.route.getCurrentNavigation()!.extras.state;
  }

  ngOnInit(): void {
    // let floor = this.floor_obj!['floor'];
    // this.subscription = this.mqtt_sub
    // .topic('zigbee/+/bridge/state')
    // .pipe(takeUntil(this.unSubscribe$))
    // .subscribe((message: IMqttMessage) => {
    //   let msg: string = message.payload.toString();
    //   let full_topic: string = message.topic;
    //   let info_array = full_topic
    //     .replace('zigbee/', '')
    //     .replace('/bridge/state', '')
    //     .split('_');
    //   this.current_floor = info_array[0];
    //   this.current_gateway = info_array[1];
    //   this.gateway_info.push({
    //     floor: this.current_floor,
    //     gateway: this.current_gateway,
    //     status: msg,
    //   });
    //   console.log(this.gateway_info);
    //   this.floor_list = [
    //     ...new Set(this.gateway_info.map((a: any) => a.floor)),
    //   ].sort();
    // this._ref.detectChanges();
    //   });
  }
}
