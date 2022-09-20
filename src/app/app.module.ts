import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { Mqtt } from './mqtt.service';
import { IMqttMessage, MqttModule, IMqttServiceOptions } from 'ngx-mqtt';
import { FloorSelectorComponent } from './floor-selector/floor-selector.component';
import { GatewaySelectorComponent } from './gateway-selector/gateway-selector.component';
import { DevicePageComponent } from './device-page/device-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: 'mqtt.dev.iot.microlab',
  port: 8124,
  path: '/mqtt',
};

@NgModule({
  declarations: [
    AppComponent,
    // HomePageComponent,
    FloorSelectorComponent,
    GatewaySelectorComponent,
    DevicePageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      // {path: 'home-page', component: HomePageComponent},
      { path: '', component: FloorSelectorComponent },
      { path: 'floor-selector', component: FloorSelectorComponent },
      { path: 'gateway-selector', component: GatewaySelectorComponent },
      { path: 'device-page', component: DevicePageComponent },
    ]),
    NgbModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
  ],
  providers: [Mqtt],
  bootstrap: [AppComponent],
})
export class AppModule {}