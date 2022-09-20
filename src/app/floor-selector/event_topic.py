{
   "data":{
      "definition":{
         "description":"Zigbee 3.0 universal LED-controller, 5 channel, RGBCCT LED",
         "exposes":[
            {
               "features":[
                  {
                     "access":7,
                     "description":"On/off state of this light",
                     "name":"state",
                     "property":"state",
                     "type":"binary",
                     "value_off":"OFF",
                     "value_on":"ON",
                     "value_toggle":"TOGGLE"
                  },
                  {
                     "access":7,
                     "description":"Brightness of this light",
                     "name":"brightness",
                     "property":"brightness",
                     "type":"numeric",
                     "value_max":254,
                     "value_min":0
                  },
                  {
                     "access":7,
                     "description":"Color temperature of this light",
                     "name":"color_temp",
                     "presets":[
                        {
                           "description":"Coolest temperature supported",
                           "name":"coolest",
                           "value":150
                        },
                        {
                           "description":"Cool temperature (250 mireds / 4000 Kelvin)",
                           "name":"cool",
                           "value":250
                        },
                        {
                           "description":"Neutral temperature (370 mireds / 2700 Kelvin)",
                           "name":"neutral",
                           "value":370
                        },
                        {
                           "description":"Warm temperature (454 mireds / 2200 Kelvin)",
                           "name":"warm",
                           "value":454
                        },
                        {
                           "description":"Warmest temperature supported",
                           "name":"warmest",
                           "value":500
                        }
                     ],
                     "property":"color_temp",
                     "type":"numeric",
                     "unit":"mired",
                     "value_max":500,
                     "value_min":150
                  },
                  {
                     "access":7,
                     "description":"Color temperature after cold power on of this light",
                     "name":"color_temp_startup",
                     "presets":[
                        {
                           "description":"Coolest temperature supported",
                           "name":"coolest",
                           "value":150
                        },
                        {
                           "description":"Cool temperature (250 mireds / 4000 Kelvin)",
                           "name":"cool",
                           "value":250
                        },
                        {
                           "description":"Neutral temperature (370 mireds / 2700 Kelvin)",
                           "name":"neutral",
                           "value":370
                        },
                        {
                           "description":"Warm temperature (454 mireds / 2200 Kelvin)",
                           "name":"warm",
                           "value":454
                        },
                        {
                           "description":"Warmest temperature supported",
                           "name":"warmest",
                           "value":500
                        },
                        {
                           "description":"Restore previous color_temp on cold power on",
                           "name":"previous",
                           "value":65535
                        }
                     ],
                     "property":"color_temp_startup",
                     "type":"numeric",
                     "unit":"mired",
                     "value_max":500,
                     "value_min":150
                  },
                  {
                     "description":"Color of this light in the CIE 1931 color space (x/y)",
                     "features":[
                        {
                           "access":7,
                           "name":"x",
                           "property":"x",
                           "type":"numeric"
                        },
                        {
                           "access":7,
                           "name":"y",
                           "property":"y",
                           "type":"numeric"
                        }
                     ],
                     "name":"color_xy",
                     "property":"color",
                     "type":"composite"
                  }
               ],
               "type":"light"
            },
            {
               "access":2,
               "description":"Triggers an effect on the light (e.g. make light blink for a few seconds)",
               "name":"effect",
               "property":"effect",
               "type":"enum",
               "values":[
                  "blink",
                  "breathe",
                  "okay",
                  "channel_change",
                  "finish_effect",
                  "stop_effect"
               ]
            },
            {
               "access":1,
               "description":"Link quality (signal strength)",
               "name":"linkquality",
               "property":"linkquality",
               "type":"numeric",
               "unit":"lqi",
               "value_max":255,
               "value_min":0
            }
         ],
         "model":"511.000",
         "options":[
            {
               "access":2,
               "description":"Controls the transition time (in seconds) of on/off, brightness, color temperature (if applicable) and color (if applicable) changes. Defaults to `0` (no transition).",
               "name":"transition",
               "property":"transition",
               "type":"numeric",
               "value_min":0
            },
            {
               "access":2,
               "description":"When enabled colors will be synced, e.g. if the light supports both color x/y and color temperature a conversion from color x/y to color temperature will be done when setting the x/y color (default true).",
               "name":"color_sync",
               "property":"color_sync",
               "type":"binary",
               "value_off":false,
               "value_on":true
            }
         ],
         "supports_ota":false,
         "vendor":"Iluminize"
      },
      "friendly_name":"00/office/06_04/rgblight",
      "ieee_address":"0x84fd27fffe78b755",
      "status":"successful",
      "supported":true
   },
   "type":"device_interview"
}