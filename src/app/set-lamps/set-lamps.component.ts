import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ɵɵsetComponentScope,
} from '@angular/core';
import { Router } from '@angular/router';
import { Mqtt } from '../mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopuperrorComponent } from './popuperror/popuperror.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-set-lamps',
  templateUrl: './set-lamps.component.html',
  styleUrls: ['./set-lamps.component.css'],
})
export class SetLampsComponent implements OnInit, OnDestroy {
  ieee_address: string;
  device_type: string;
  floor_gateway: string;
  floor: string = '';
  gateway: string = '';
  room_type: Array<string> = [];
  numbers: Array<string> = [];
  unSubscribe$ = new Subject();
  subscription!: Subscription;
  selectedOffice: string = '';
  selectedRoomtype: string = '';
  selectedDevice: string = '';
  rename_msg: string = '';
  in_group: boolean = true;
  device_topic: string = '';
  group_name: string = '';
  group_tag: string = '';
  click_source: string = '';
  gateway_cap: string = '';
  gateway_info: string = '';
  friendly_name: string = '';
  // form_group = new FormGroup({
  //   form_deviceid: new FormControl('test'),
  // });
  // name = new FormControl('test');
  constructor(
    private route: Router,
    private mqtt_sub: Mqtt,
    private dialog: MatDialog
  ) {
    let routed_data = this.route.getCurrentNavigation()!.extras.state as {
      [key: string]: any;
    };
    // let routed_data = ['0x84fd27fffe78b755', 'lamp', '10_1'];
    this.ieee_address = routed_data[0];
    this.device_type = routed_data[1];
    this.floor_gateway = routed_data[2];
    this.gateway_cap = routed_data[3];
    this.gateway_info = routed_data[4];

    if (this.device_type == 'lamp') {
      this.group_tag = 'light_01';
    } else if (this.device_type == 'blind') {
      // TODO: ask luuk this
      this.group_tag = 'blinds';
    }
    this.room_type = ['office', 'meeting', 'common'];
  }

  ngOnInit(): void {
    this.floor = this.floor_gateway.split('_')[0];
    this.gateway = this.floor_gateway.split('_')[1];
    let range_numbers = [...Array(99).keys()];
    range_numbers.forEach((myNumber) => {
      let formattedNumber = myNumber.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      this.numbers.push(formattedNumber);
    });
  }

  //{"data":{"from":"0x84fd27fffe78b755","homeassistant_rename":false,"to":"10/office/02/lamp03"},"status":"ok"}

  rename(event: any) {
    this.click_source = event.target.name;
    this.friendly_name =
      this.floor +
      '/' +
      this.selectedRoomtype +
      '/' +
      this.selectedOffice +
      '/' +
      this.device_type +
      this.selectedDevice;

    this.device_topic =
      '"' + this.ieee_address + '"' + ', "to": "' + this.friendly_name;

    this.group_name =
      this.floor +
      '/' +
      this.selectedRoomtype +
      '/' +
      this.selectedOffice +
      '/group/' +
      this.group_tag;
    this.group_check();
    this.rename_msg = '{"from":' + this.device_topic + '"}';
    this.check_rename_response();
    this.mqtt_sub.publish(
      'zigbee/' + this.floor_gateway + '/bridge/request/device/rename',
      this.rename_msg
    );
    console.log(this.friendly_name);
  }

  check_rename_response() {
    console.log(
      'zigbee/' + this.floor_gateway + '/bridge/response/device/rename'
    );
    this.subscription = this.mqtt_sub
      .topic('zigbee/' + this.floor_gateway + '/bridge/response/device/rename')
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(
        (message: IMqttMessage) => {
          let msg = JSON.parse(message.payload.toString());
          console.log('checking response...');
          if (
            msg['status'] == 'ok' &&
            msg['data']['to'] == this.friendly_name
          ) {
            console.log(
              'we received a response after renaming to ' + this.friendly_name
            );
            console.log('previous name: ', msg['data']['from']);
            // check if group exists
            if (!this.in_group) {
              // if doesnt exist
              this.group_add();
            } else {
              console.log('group already exists');
            }
            this.device_add_group();
          } else {
            //TODO: if there is no response, clear all subscriptions because it wont sub anymore
            console.log(
              'something went wrong with the response message of the device name'
            );
          }
        }
        // give each gateway a count
        //force it to look at the start of a json
      );
  }
  group_check() {
    this.subscription = this.mqtt_sub
      .topic('zigbee/' + this.floor_gateway + '/bridge/groups')
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        console.log('the groups ', msg);
        console.log('the group were looking for', this.group_name);
        if (this.ieee_address !== '' && msg.includes(this.group_name)) {
          this.in_group = true;
          console.log('group exists');
        } else {
          this.in_group = false;
          console.log('group doesnt exist');
        }
      });
  }

  group_add() {
    let group_add_topic =
      'zigbee/' + this.floor_gateway + '/bridge/request/group/add';
    console.log('adding group', this.group_name);
    this.mqtt_sub.publish(group_add_topic, this.group_name);
  }
  device_add_group() {
    let add_msg =
      '{"group": ' +
      '"' +
      this.group_name +
      '"' +
      ', "device": ' +
      '"' +
      this.friendly_name +
      '"' +
      '}';
    let device_add_topic =
      'zigbee/' + this.floor_gateway + '/bridge/request/group/members/add';
    console.log('adding device ', this.friendly_name, ' to ', this.group_name);
    this.mqtt_sub.publish(device_add_topic, add_msg);
    //TODO: could check if its already in group but it wouldnt matter too much
    this.route_next();
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async route_next() {
    if (this.click_source == 'nextdevice') {
      this.mqtt_sub.publish(
        'zigbee/' + this.floor_gateway + '/' + this.friendly_name,
        '{"state": on}'
      );
      await this.sleep(2000);
      this.mqtt_sub.publish(
        'zigbee/' + this.floor_gateway + '/' + this.friendly_name,
        '{"state": off}'
      );
      await this.sleep(2000);
      this.mqtt_sub.publish(
        'zigbee/' + this.floor_gateway + '/' + this.friendly_name,
        '{"state": on}'
      );

      this.route.navigate(['loading-page'], {
        state: [this.gateway_cap, this.gateway, this.floor, this.gateway_info],
      });
    } else if (this.click_source == 'finisheddevice') {
      let gateway_topic =
        'zigbee/' + this.floor_gateway + '/bridge/request/permit_join';

      this.mqtt_sub.publish(gateway_topic, '{"value": false}');
      console.log('closing gateway at ', gateway_topic);
      this.route.navigate(['gateway-selector'], {
        state: [this.floor, this.gateway_info],
      });
    } else {
      console.log('No relevant click source found');
    }
  }
  room_limit_warning(
    event: Event,
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ) {
    let device_clicked_info: any = event?.target;
    let selected_room_device = device_clicked_info.innerHTML.trim();
    if (!this.numbers.slice(0, 7).includes(selected_room_device)) {
      let dialogref = this.dialog.open(PopuperrorComponent, {
        width: '600px',
        data: [this.device_type],
        enterAnimationDuration,
        exitAnimationDuration,
      });
      dialogref.afterClosed().subscribe((result) => {
        console.log(result);
        if (result.data == 'no') {
          // this.form_group.setValue('');
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.unSubscribe$.next('');
    this.unSubscribe$.complete();
  }
}
