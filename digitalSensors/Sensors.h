#ifndef Sensors_h
#define Sensors_h


#include "DefaultProps.h"
#include "Util.h"
#include <Arduino.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <GyverINA.h>
#include "DFRobot_AHT20.h"
#include <Adafruit_BMP280.h>
#include <Wire.h>



class Sensors{

  public:
    // variable

    // methods
    Sensors();
    void init(Util* );
    //void getValues(int sensor, String answer);
    bool initDevices(int *list, float *values);
    void refreshDS18B20( float *values);
    void refreshAHT20( float *values);
    void refreshINA219( float *values);
    void refreshBMP280( float *values );
    
  private:
    uint8_t ow_pin;
    //String result = "";
    int sensor;
    Util* util;
    
    //  =========  ds18b20  ====================
    OneWire *ow;
    DallasTemperature *ds18b20;
    //  aht20, bmp280
    // Создаем обьект: INA219 ina(Сопротивление шунта, Макс. ожидаемый ток, I2c адрес);
    // INA219 ina(0x41);              // Стандартные настройки для модуля, но измененный адрес
    // INA219 ina(0.05f);             // Стандартный адрес и макс. ток, но другой шунт (0.05 Ом)
    // INA219 ina(0.05f, 2.0f);       // Стандартный адрес, но другой шунт (0.05 Ом) и макс. ожидаемый ток (2А)
    // INA219 ina(0.05f, 2.0f, 0x41); // Полностью настраиваемый вариант, ручное указание параметров
    INA219 ina; 
    //  ============== AHT20  =======================
    DFRobot_AHT20 aht20;  
    //  ===============  BMP280  =====================
    Adafruit_BMP280 bmp;
    
};




#endif
