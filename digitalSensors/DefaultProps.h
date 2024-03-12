#ifndef DefaultProps
  #define DefaultProps

//   Pins
#define LED_PIN 2
#define ONE_WIRE  12
#define I2C_SCL  5
#define I2C_SDA 4
#define MOSFET_PIN 15  // it may be connect led to indicate no protect voltage input 
#define BUTTON_PIN 13  //  must pullUp


//   WIFI
//  NOTE: established by softAP will have default IP address of 192.168.4.2
#define ESP_SSID  "ESP8266" 
#define PASSWD "my.esp8266" 
#define PORT 80


#define PROPS_FILE  "startProperties.txt"
// default proterties ordep in PROPS_FILE
// " ESP_SSID ->  PASSWORD ->  SCL_PIN -> SDA_PIN ->  DS18B20_PIN "
#define MANUAL_FILE "help.txt"

//  debug mode
#define DEBUG false

// ============================ modules ==============================
#define DS18B20_S  1
#define AHT20_S    2
#define BMP280_S   3
#define INA219_S   4
//  =========================  sensors in modules  ===================
#define DS18B20_T   0
#define AHT20_T   1
#define AHT20_H   2
#define INA219_U  3
#define INA219_I  4
#define INA219_P  5
#define BMP280_T  6
#define BMP280_P  7

#define MODULES_COUNT 4
#define SENSORS_COUNT 8

//  DS18B20
#define DS18B20_RESOLUTION 10


//  end DefaultProps
#endif
