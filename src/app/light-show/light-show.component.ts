import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Mqtt } from 'src/app/mqtt.service';
import { IMqttMessage } from 'ngx-mqtt';
import { ActivatedRoute } from '@angular/router';
import { Subscription, takeUntil, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { building_info } from 'src/app/environments/environment';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-light-show',
  templateUrl: './light-show.component.html',
  styleUrls: ['./light-show.component.css'],
})
export class LightShowComponent implements OnInit, AfterViewInit, OnDestroy {
  IndividSubscription!: Subscription;
  GroupSubscription!: Subscription;
  floor: string;
  unSubscribe$ = new Subject();
  ShowIndivDevices: boolean = true;
  GatewayId: string;
  array_of_lamps: Array<string> = [];
  paginatorLength: number;
  IndividualTabularData: any;
  GroupTabularData: any;
  ShowIndividual: boolean = true;
  DisplayColumnsIndiv: string[] = [
    'friendlyName',
    'Gateway',
    'deviceType',
    'IeeeAddress',
    'vendor',
    'Options',
  ];

  DisplayColumnsGroups: string[] = [
    'friendlyName',
    'Gateway',
    'Members',
    'vendor',
    'Options',
  ];
  FilteredIndivData;
  FilteredGroupData;
  dataSource = new MatTableDataSource();
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  // dataSource = ELEMENT_DATA;
  constructor(private mqtt_sub: Mqtt, private ActRoute: ActivatedRoute) {}
  @ViewChild('empTbSort') empTbSort = new MatSort();
  ngOnInit(): void {
    this.ActRoute.queryParams.subscribe((params) => {
      this.floor = params['FloorNumber'];
    });
    this.subscribeIndiv();
    // this.SubscribeGroup();
  }

  subscribeIndiv() {
    let general_topic = `ml/sateraito/${this.floor}/+/bridge/devices`;
    this.IndividSubscription = this.mqtt_sub
      // .topic(building_info.building_sateraito_prefix + '+/+/bridge/state')
      .topic(general_topic)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let jsonmsg: any[] = JSON.parse(msg);
        let specific_topic = message.topic.toString();
        this.GatewayId = this.findDiff(general_topic, specific_topic).replace(
          '/bridge/devices',
          ''
        );
        this.FilteredIndivData = jsonmsg
          .filter((elm) => {
            return (
              elm.friendly_name.includes('lamp') ||
              elm.friendly_name.includes('0x')
            );
          })
          .map((elm) => {
            return {
              friendlyName: elm.friendly_name ?? 'Not Defined',
              IeeeAddress: elm.ieee_address ?? 'Not Defined',
              vendor: elm.definition.vendor ?? 'Not Defined',
              deviceType: elm.definition.description ?? 'Not Defined',
              Gateway: this.GatewayId ?? 'Not Defined',
            };
          });

        this.IndividualTabularData = this.FilteredIndivData.concat(
          this.IndividualTabularData
        );
        this.dataSource.data = this.IndividualTabularData.filter((elm) => {
          return elm != undefined;
        });
        console.log(this.dataSource.data);
      });
  }

  SubscribeGroup() {
    let group_topic = `ml/sateraito/${this.floor}/+/bridge/groups`;

    this.GroupSubscription = this.mqtt_sub
      // .topic(building_info.building_sateraito_prefix + '+/+/bridge/state')
      .topic(group_topic)
      .pipe(takeUntil(this.unSubscribe$))
      .subscribe((message: IMqttMessage) => {
        let msg: string = message.payload.toString();
        let jsonmsg: any[] = JSON.parse(msg);
        let specific_topic = message.topic.toString();
        this.GatewayId = this.findDiff(group_topic, specific_topic).replace(
          '/bridge/groups',
          ''
        );
        console.warn('OUTPUT', this.GatewayId, typeof this.GatewayId);
        console.warn('JSON OUTPUT', jsonmsg);
        this.FilteredGroupData = jsonmsg.map((elm) => {
          let vendor = 'Not Defined';
          let friendlyNameGroup = elm.friendly_name;
          console.log(friendlyNameGroup, 'YAAAAAAAAAAAAAAAAAAAAAAAA');
          if (friendlyNameGroup.includes('light')) {
            vendor = 'Lamp';
          } else {
            vendor = 'blind';
          }
          return {
            friendlyName: elm.friendly_name ?? 'Not Defined',
            Members: elm.members.length ?? 'Not Defined',
            vendor: vendor ?? 'Not Defined',
            Gateway: this.GatewayId ?? 'Not Defined',
          };
        });
        this.GroupTabularData = this.FilteredGroupData.concat(
          this.GroupTabularData
        );
        this.dataSource.data = this.GroupTabularData.filter((elm) => {
          return elm != undefined;
        });
      });
  }

  ToggleGroup() {
    this.ShowIndividual = !this.ShowIndividual;
    if (this.ShowIndividual == true) {
      this.subscribeIndiv();
      this.dataSource.data = this.IndividualTabularData;
      this.dataSource.data = this.dataSource.data.filter((elm) => {
        return elm != undefined;
      });
    } else {
      this.SubscribeGroup();
      this.dataSource.data = this.GroupTabularData;
      this.dataSource.data = this.dataSource.data.filter((elm) => {
        return elm != undefined;
      });
    }
  }

  findDiff(general_topic: string, specific_topic: string) {
    let diff = '';
    specific_topic.split('').forEach(function (val, i) {
      if (val != general_topic.charAt(i)) diff += val;
    });
    return diff;
  }

  @ViewChild('GroupPaginator') paginatorGroup: MatPaginator;
  @ViewChild('IndivPaginator') paginatorIndiv: MatPaginator;

  ngAfterViewInit() {
    if (this.ShowIndividual == true) {
      this.dataSource.paginator = this.paginatorIndiv;
    } else {
      this.dataSource.paginator = this.paginatorGroup;
    }
    this.dataSource.sort = this.empTbSort;
    // debugger;
  }

  ToggleDevice(friendly_name: string, gateway: string) {
    let publish_topic: string = `${building_info.building_sateraito_prefix}${this.floor}/${gateway}/${friendly_name}/set`;
    this.mqtt_sub.publish(publish_topic, '{"state": "TOGGLE"}');
    console.log(publish_topic);
  }
  ngOnDestroy() {
    this.unSubscribe$.next('');
    this.unSubscribe$.complete();
  }
}
