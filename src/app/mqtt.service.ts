import { Injectable } from '@angular/core';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Mqtt {
  message: any;
  topicname: any;
  constructor(private _mqttService: MqttService) {}

  topic(deviceId: string): Observable<IMqttMessage> {
    return this._mqttService.observe(deviceId);
  }
  publish(deviceId: string, message: string) {
    this._mqttService.unsafePublish(deviceId, message, {
      qos: 1,
      retain: false,
    });
  }
}
