import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  templateUrl: './device-page.component.html',
  styleUrls: ['./device-page.component.css'],
})
export class DevicePageComponent implements OnInit {
  constructor(private ActRoute: ActivatedRoute, private route: Router) {}
  FloorNumber: string;
  GatewaysOnline: string[];
  ngOnInit(): void {
    this.ActRoute.queryParams.subscribe((params) => {
      this.FloorNumber = params['FloorNumber'];
      this.GatewaysOnline = params['OnlineGateways'];
      console.log(this.GatewaysOnline, 'yeeees');
    });
  }

  RouteGateway() {
    this.route.navigate(['/gateway-selector'], {
      queryParams: {
        FloorNumber: this.FloorNumber,
        OnlineGateways: this.GatewaysOnline,
      },
    });
  }
  RouteTestEnv() {
    this.route.navigate(['/light-show'], {
      queryParams: {
        FloorNumber: this.FloorNumber,
      },
    });
  }
}
