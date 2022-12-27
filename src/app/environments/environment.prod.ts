import { IMqttServiceOptions } from 'ngx-mqtt';
export const building_info = {
  building: 'ml',
  building_sateraito_prefix: 'ml/sateraito/',
};
export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  username: 'adil',
  password: 'adiL1997',
  clientId: 'zigbee-tool-prod-rw',
  hostname: 'mqtt.prod.iot.microlab',
  protocol: 'ws',
  port: 8124,
  // ca: `-----BEGIN CERTIFICATE-----
  // MIICKjCCAc+gAwIBAgIUIw1nnj1g28UfjaJB7r+3YrTIUOswCgYIKoZIzj0EAwIw
  // ajELMAkGA1UEBhMCTkwxEzARBgNVBAgMClNvbWUtU3RhdGUxEjAQBgNVBAcMCUVp
  // bmRob3ZlbjERMA8GA1UECgwITWljcm9sYWIxHzAdBgNVBAMMFm1xdHQucHJvZC5p
  // b3QubWljcm9sYWIwHhcNMjEwNDA2MTYwOTQ4WhcNMjIwNDA2MTYwOTQ4WjBqMQsw
  // CQYDVQQGEwJOTDETMBEGA1UECAwKU29tZS1TdGF0ZTESMBAGA1UEBwwJRWluZGhv
  // dmVuMREwDwYDVQQKDAhNaWNyb2xhYjEfMB0GA1UEAwwWbXF0dC5wcm9kLmlvdC5t
  // aWNyb2xhYjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABL2zIkwmuiS3V7L/2Cr8
  // 5ZQrdbJv2HSElfSvyy0a0Ey7dqtxjQE54sbuElCCe4dQped2Gu5Wv72g4J7/CTL8
  // TNijUzBRMB0GA1UdDgQWBBSKqsIW73m4PHFw4B5GBK5f5WcjpTAfBgNVHSMEGDAW
  // gBSKqsIW73m4PHFw4B5GBK5f5WcjpTAPBgNVHRMBAf8EBTADAQH/MAoGCCqGSM49
  // BAMCA0kAMEYCIQCwe/r3mcjurhbRI+QSHsw9Q2p+4ApcdvOI/8bM9O1VdwIhALbp
  // oXKk9ILmqnROnPZUTopIPJn3cwEP5SIuQ4jbQ/Mi
  // -----END CERTIFICATE-----`,
  rejectUnauthorized: false,
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
