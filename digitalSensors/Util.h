#ifndef Util_h
#define Util_h


#include "DefaultProps.h"
#include <Arduino.h>
#include <LittleFS.h>


class Util {
  public:
    Util();
    void showFatalError();
    bool fillStartParams( );
    void showManual();
    void handleSerial(void);
    // parameters of WIFI and sensors pin
    String getESP_SSID();
    String getPASSWD();
    int getSclPin();
    int getSdaPin();
    int getOneWirePin();
    void setDebugAddress(bool *isDebug);
    


  private:
   //  ------------  variables  ---------------
    bool *debug;
    //  --------  start params   ---------------
    struct param {
      String sta_ssid;
      String sta_passwd;
      String  i2c_scl;
      String i2c_sda;
      String one_wire;
    } params;
    bool isSetParam = false;   
    // it is number of parameter in params order 
    int paramNumber = 0;
   // struct param params;
    bool setValuesToParams( File file);
    void initStartParametersDefaultValues(); // init struct with default parameters
    bool writeToPropFile( param par); 
    bool changeStartParams(char* fileWitchParams);// not impl !
    //  -----------------  LittleFS  -----------------------
    bool checkFile(String fileName);
    // read
    void showFile(const char *fileName);
    // write
    bool writeToFile(char req[]);
    bool write(String fileName, String toWrite);
    //  -----------------  SERIAL  -----------------------------
    void setNewParameters();
    void readParams();
};


#endif
