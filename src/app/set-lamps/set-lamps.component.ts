import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Mqtt } from '../mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PopuperrorComponent } from './popuperror/popuperror.component';
import { building_info } from 'src/app/environments/environment';

@Component({
  selector: 'app-set-lamps',
  templateUrl: './set-lamps.component.html',
  styleUrls: ['./set-lamps.component.css'],
})
export class SetLampsComponent implements OnInit, OnDestroy {
  IeeeAddress: string;
  DeviceType: string;
  FloorGateway: string;
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
  GroupTag: string = '';
  click_source: string = '';
  Capacity: string = '';
  GatewayInfo: string = '';
  friendly_name: string = '';

  constructor(
    private route: Router,
    private mqtt_sub: Mqtt,
    private dialog: MatDialog,
    private ActRoute: ActivatedRoute
  ) {
    // let routed_data = ['0x84fd27fffe78b755', 'lamp', '10_1', 43, []];
    this.room_type = ['office', 'meeting', 'common'];
  }

  ngOnInit(): void {
    this.ActRoute.queryParams.subscribe((params) => {
      this.IeeeAddress = params['Address'];
      this.DeviceType = params['DeviceType'];
      this.FloorGateway = params['FloorGateway'];
      this.Capacity = params['Capacity'];
      this.GatewayInfo = params['OnlineGateways'];
    });

    this.floor = this.FloorGateway.split('/')[0];
    this.gateway = this.FloorGateway.split('/')[1];

    if (this.DeviceType == 'lamp') {
      this.GroupTag = 'light_01';
    } else if (this.DeviceType == 'blind') {
      this.GroupTag = 'blinds';
    }
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
    console.log(event);
    this.click_source = event.explicitOriginalTarget.innerHTML;
    console.log(this.click_source, 'FOUND CLICK SOURCE');
    this.friendly_name =
      // this.floor +
      // '/' +
      this.selectedRoomtype +
      '/' +
      this.selectedOffice +
      '/' +
      this.DeviceType +
      this.selectedDevice;

    this.device_topic =
      '"' + this.IeeeAddress + '"' + ', "to": "' + this.friendly_name;

    this.group_name =
      // this.floor +
      // '/' +
      this.selectedRoomtype +
      '/' +
      this.selectedOffice +
      '/group/' +
      this.GroupTag;
    this.group_check();
    this.rename_msg = '{"from":' + this.device_topic + '"}';
    this.check_rename_response();
    this.mqtt_sub.publish(
      building_info.building_sateraito_prefix +
        this.FloorGateway +
        '/bridge/request/device/rename',
      this.rename_msg
    );
    console.log(this.friendly_name);
  }

  check_rename_response() {
    console.log(
      building_info.building_sateraito_prefix +
        this.FloorGateway +
        '/bridge/response/device/rename'
    );
    this.subscription = this.mqtt_sub
      .topic(
        building_info.building_sateraito_prefix +
          this.FloorGateway +
          '/bridge/response/device/rename'
      )
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe(
        (message: IMqttMessage) => {
          let msg = JSON.parse(message.payload.toString());
          console.log(msg['error']);
          console.log(msg['status']);
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
          } else if (
            msg['status'] == 'error' &&
            msg['error'].includes('already in use')
          ) {
            console.log('already in use name');
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
      .topic(
        building_info.building_sateraito_prefix +
          this.FloorGateway +
          '/bridge/groups'
      )
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        console.log('the groups ', msg);
        console.log('the group were looking for', this.group_name);
        if (this.IeeeAddress !== '' && msg.includes(this.group_name)) {
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
      building_info.building_sateraito_prefix +
      this.FloorGateway +
      '/bridge/request/group/add';
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
      building_info.building_sateraito_prefix +
      this.FloorGateway +
      '/bridge/request/group/members/add';
    console.log('adding device ', this.friendly_name, ' to ', this.group_name);
    this.mqtt_sub.publish(device_add_topic, add_msg);
    //TODO: could check if its already in group but it wouldnt matter too much
    this.route_next();
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async turn_on_and_off() {
    console.log('turning on and off');
    let friendly_name_no_building = this.friendly_name.replace(this.floor, '');
    // above line removes from e.g. 13/office/12/
    for (let step = 0; step < 5; step++) {
      this.mqtt_sub.publish(
        building_info.building_sateraito_prefix +
          this.FloorGateway +
          '/' +
          friendly_name_no_building +
          '/set',
        '{"state": "OFF"}'
      );
      await this.sleep(1000);
      this.mqtt_sub.publish(
        building_info.building_sateraito_prefix +
          this.FloorGateway +
          '/' +
          friendly_name_no_building +
          '/set',
        '{"state": "ON"}'
      );
    }
  }
  route_next() {
    console.log(' the click source is    ', this.click_source);
    this.turn_on_and_off();
    if (this.click_source.includes('Next Device')) {
      this.route.navigate(['loading-page'], {
        queryParams: {
          floor: this.floor,
          OnlineGateways: this.GatewayInfo,
          Capacity: this.Capacity,
          CurrGateway: this.FloorGateway.split('/')[1],
        },
      });
    } else if (this.click_source.includes('Finished')) {
      let gateway_topic =
        building_info.building_sateraito_prefix +
        this.FloorGateway +
        '/bridge/request/permit_join';
      this.mqtt_sub.publish(gateway_topic, '{"value": false}');
      console.log('closing gateway at ', gateway_topic);
      this.route.navigate(['gateway-selector'], {
        queryParams: {
          FloorNumber: this.floor,
          OnlineGateways: this.GatewayInfo,
        },
      });
      // this.IeeeAddress = params['Address'];
      // this.DeviceType = params['DeviceType'];
      // this.FloorGateway = params['FloorGateway'];
      // this.Capacity = params['Capacity'];
      // this.GatewayInfo = params['OnlineGateways'];
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
        data: [this.DeviceType],
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
