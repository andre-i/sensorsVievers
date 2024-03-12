#include "Sensors.h"


Sensors :: Sensors(){} 


void Sensors::init(Util* u){
  util = u;
  int pin = util->getOneWirePin();
  Serial.print("OW pin - ");
  Serial.println(pin);
  if(pin < 1){
    Serial.println(F(" ERROR  CREATE DS18B20 handler[ Sensors() ]"));
    Serial.println(F("setDefault value for ow"));
    pin = ONE_WIRE;
  }
  Wire.begin(util->getSdaPin(), util->getSclPin());
  //DallasTemperature dt(&ow);
  //dt.begin();
  //Serial.print(F("Ds18b20 count ="));
  //Serial.println(ds18b20->getDeviceCount());
  //ds18b20 = &dt;
}

/*   try init modules
 *    if success, then set 1 to appropriate member in list
 */
bool Sensors::initDevices(int *list, float *values){
  bool res = false;
  // DS18B20_S:     
  ow = new OneWire(util->getOneWirePin());
  ds18b20 = new DallasTemperature(ow);
  ds18b20->begin(); 
  DeviceAddress dsAddress;
  ds18b20->getAddress(dsAddress, 0);
  Serial.print(F("Ds18b20 count ="));
  Serial.println(ds18b20->getDeviceCount());
  if(ds18b20->getDeviceCount()) {
    list[DS18B20_S] = 1;
    res = true;
    ds18b20->setResolution(dsAddress, DS18B20_RESOLUTION);
    ds18b20->setWaitForConversion(false);  // makes it async
    ds18b20->requestTemperatures();
  }
  //    INA219_S:
  if( ina.begin(util->getSdaPin(), util->getSclPin()) ){
    // Напряжение в 12ти битном режиме + 4х кратное усреднение
    ina.setResolution(INA219_VBUS, INA219_RES_12BIT_X4);      
    // Ток в 12ти битном режиме + 128х кратное усреднение
    ina.setResolution(INA219_VSHUNT, INA219_RES_12BIT_X128);     
    list[INA219_S] = 1;
    if(!res) res = true;
  }
  //   AHT20_S:
  if(aht20.begin() == 0) {
    aht20.startMeasurementReady(/* crcEn = */true);
    list[AHT20_S] = 1;
    if(!res) res = true;
  }
   //   BMP280_S:
  if( bmp.begin()){
    /* Default settings from datasheet. */
    bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,     /* Operating Mode. */
                  Adafruit_BMP280::SAMPLING_X2,     /* Temp. oversampling */
                  Adafruit_BMP280::SAMPLING_X16,    /* Pressure oversampling */
                  Adafruit_BMP280::FILTER_X16,      /* Filtering. */
                  Adafruit_BMP280::STANDBY_MS_1000); /* Standby time. */
    list[ BMP280_S ] = 1;
    if(!res) res = true;
  }
  return res;
}

// ===================  work with sensors in modules  =================================
// ====================================================================================


/*
 * Read from ds18b20
 *  value - arrays hold all sensors values
 *  number of member linced witch current sensor 
 *  for arrays numbers see DefaultProps
 */
void Sensors::refreshDS18B20( float *values){
  values[DS18B20_T] = ds18b20->getTempCByIndex(0);
    ds18b20->requestTemperatures();
}

/*
 * read from AHT20( aht10 )
 *  value - arrays hold all sensors values
 *  number of member linced witch current sensor 
 */
void Sensors::refreshAHT20( float *values){
       if(aht20.startMeasurementReady(false)){
        values[AHT20_T] = aht20.getTemperature_C();
        values[AHT20_H] = aht20.getHumidity_RH();
      }
}

/*
 * read from INA219
 *  value - arrays hold all sensors values
 *  number of member linced witch current sensor 
 */
void Sensors::refreshINA219( float *values){
    values[INA219_U] = ina.getVoltage();
    values[INA219_I] = ina.getCurrent();
    values[INA219_P] = ina.getPower();
}

/*
 * read from BMP280
 *  value - arrays hold all sensors values
 *  number of member linced witch current sensor 
 */
void Sensors::refreshBMP280( float *values ){
   values[BMP280_T] = bmp.readTemperature();
   values[BMP280_P] = bmp.readPressure();
}




//
