#include "Util.h"

//   WIFI
#ifndef ESP_SSID
#define ESP_SSID "myESP"
#endif
#ifndef PASSWD
#define PASSWD ""
#endif

//  PIN`S

#ifndef I2C_SCL 
#define I2C_SCL 5
#endif
#ifndef I2C_SDA
#define I2C_SDA 4
#endif
#ifndef ONE_WIRE
#define ONE_WIRE  12
#endif

Util :: Util(){
  
}

void Util::setDebugAddress(bool *debugAddress){
  debug = debugAddress;
}

void Util::showFatalError(){
  Serial.println(F("FATAL ERROR проблемы с файловой системой"));
}

// methods to return of parameters
String  Util::getESP_SSID(){
      return params.sta_ssid;
}
String  Util::getPASSWD(){
    return params.sta_passwd;
}
int  Util::getSclPin(){
  return params.i2c_scl.toInt();
}
int  Util::getSdaPin(){
  return params.i2c_sda.toInt();
}
int  Util::getOneWirePin(){
  return params.one_wire.toInt();
}

/*
 *  interact witch user
 *  a) show short manual
 *  b) show start parameters
 *  c) call methods to install new parameters
 */
void  Util::handleSerial(){
     String comm = Serial.readStringUntil('\n');
     comm.trim();
     Serial.println("____________\n command - " + comm + "\n__________");
     if( comm == "dt")*debug = true;
     else if( comm == "df")*debug = false;
     else if( comm == "w") setNewParameters();
     else if( comm == "rp") readParams();
     else if( comm == "cr")ESP.reset();
     else if( comm == "clear"){
      ESP.eraseConfig();
      ESP.reset();
     } 
     else{
      Serial.println(F("\n   ================================\n"));
      showManual();
     } 
      while(Serial.available() > 0)Serial.read();    
}

/*
 * write parameter walue to PROPS_FILE(see defaultProps)
 * from @param structure
 * return - true if success
 */
bool  Util::writeToPropFile( param par) {
  File file = LittleFS.open(PROPS_FILE, "w");
  if(! file){
    Serial.printf(" Не смог открыть файл %s для записи \n", PROPS_FILE);
    return false;
  }
  Serial.println(F("start make string for record"));
  String res = F("## property file contain properties \n");
  res += F("#\t WIFI settings\n# ESP_SSID :\n");
  if (par.sta_ssid && par.sta_ssid.length() > 2)res += par.sta_ssid ;
  if (par.sta_passwd && par.sta_passwd.length() > 6)res +=  F("\n# PASSWORD\n") + par.sta_passwd;
  res += F("\n# pins for i2c");
  res += F("\n# SCL_PIN \n") ;
  if (par.i2c_scl.length() > 0)res += par.i2c_scl;
  else res+= "" + String(I2C_SCL);
  res += F("\n# SDA_PIN \n");
  if (par.i2c_sda.length() > 0) res += par.i2c_sda;
  else res += "" + String(I2C_SDA);
  res += F("\n# dDS18B20_PIN\n");
  if (par.one_wire.length() > 0)res += par.one_wire;
  else res += "" + String(ONE_WIRE);
  Serial.print(" To Write \n" + res);
  file.print( res.c_str());
  file.close();
  return true;
}

/*
    Start write all parameters to props STRUCTURE
*/
void  Util::initStartParametersDefaultValues() {
  // prepare structure with default values
  params.sta_ssid = ESP_SSID;
  params.sta_passwd = PASSWD;
  params.i2c_scl = String(I2C_SCL).toInt();
  params.i2c_sda = String(I2C_SDA).toInt();  
  params.one_wire = String(ONE_WIRE).toInt();
  Serial.println(F(" Установка параметров  запуска по умолчанию смотри в DefaultProps.h."));
}

/*
 * fill start parameters on start device
 */
bool  Util::fillStartParams( ){
  if(checkFile(PROPS_FILE)){
  // FILE EXSISTS - start fill with parameters
    File file = LittleFS.open(PROPS_FILE, "r");
    return setValuesToParams(file);
  }
  Serial.print(F("Не найдено файла настроек "));
  Serial.println(PROPS_FILE);
  Serial.println(F("если желаете сменить параметры работы для подробностей нажмите символ 'h' "));
  initStartParametersDefaultValues();
  return true;
}

/*
 * check file on exists
 */
bool Util::checkFile(String fileName){  
  File file = LittleFS.open(fileName, "r");
  if (!file) {
    Serial.print(F("WARNING: File system available but Can`t access to file [ "));
    Serial.print( fileName );
    Serial.println(" ]" );
    return false;
  }
  file.close();
  return true;
}

/*
 *  set value to parameter by number of param
 *  in properties file
 */
bool  Util::setValuesToParams( File paramFile){ 
  Serial.println("Читаю параметры"); 
  String cur;
  //  num  - number in order parameters
  //  details see in PROPS_FILE
  int num = 0;
  while ( paramFile.available()) {
    cur = paramFile.readStringUntil('\n');
    cur.trim();
    if(cur.charAt(0) == '#') continue;
    if(cur.length()<1){   // empty param make error and 
      Serial.print(F("ERROR - props file have empty parameters see content of file [ "));
      Serial.print( PROPS_FILE );
      Serial.println(" ]");
      paramFile.close();
      return false;
    }
    Serial.println(cur);
  //  WIFI
    if( num == 0 ) params.sta_ssid = cur;
    if( num == 1 ) params.sta_passwd = cur;
    // pins
    if(num == 2 ) params.i2c_scl = cur.toInt();
    if(num == 3 ) params.i2c_sda = cur.toInt();
    if(num == 4 ) params.one_wire = cur.toInt();
    num++;
  }
  paramFile.close();
  return true;
}

// ===============  serial handlers  ===================

void Util::setNewParameters(){
        delay(300);
        while(Serial.available() > 0) Serial.read();
        Serial.print(F(" Начался процесс ввода параметров! \n 1) Введите имя Wi-Fi сети\n? "));
        while(Serial.available() == 0) delay(60);
        params.sta_ssid = Serial.readStringUntil('\n');
        Serial.print(F("\n 2) Введите пароль сети\n? "));
        while(Serial.available() == 0) delay(60);
        params.sta_passwd = Serial.readStringUntil('\n');
        String num;
        Serial.print(F("\n 3) Введите номер SCL пина интерфейса I2C\n? "));
        while(Serial.available() == 0) delay(60);
        num = Serial.readStringUntil('\n');
        num.trim();
        if( num.length() < 1) params.i2c_scl = String(I2C_SCL);
        else params.i2c_scl = num;
       Serial.print(F("\n 4) Введите номер SDA пина интерфейса I2C\n? "));
        while(Serial.available() == 0) delay(60);
        num = Serial.readStringUntil('\n');
        num.trim();
        if( num.length() < 1) params.i2c_sda = String(I2C_SDA);
        else params.i2c_sda = num;
        Serial.print(F("\n 5) Введите номер пина интерфейса oneWire\n? "));
        while(Serial.available() == 0) delay(60);
        num = Serial.readStringUntil('\n');
        num.trim();
        if( num.length() < 1) params.one_wire = String(ONE_WIRE);
        else params.one_wire = num;
        Serial.println(F("\nЗаписать новые значения 'y' - да, 'n' - нет \n? "));
        while(Serial.available() == 0) delay(60);
        char ch = Serial.read(); 
        if( ch != 'y') {
          Serial.print(F(" Выход без сохранения параметров\n Был введён символ "));
          Serial.println(ch);
          return;
        }
        if( writeToPropFile( params )) Serial.println(F("\n Настройки успешно сохранены "));
        else Serial.println(F("\n Ошибка сохранения файла ")); 
}


void Util::showManual(){
  showFile(MANUAL_FILE);
}

void Util::readParams(){
  showFile(PROPS_FILE);
}

/*
 *  Out content of file to serial port
 *   path - full file name with path
 */
void Util::showFile(const char *path) {
  Serial.printf("Открываю файл [  %s ]\n", path);

  File file = LittleFS.open(path, "r");
  if (!file) {
    Serial.println(F("Не смог прочитать данный файл"));
    return;
  }
  while (file.available()) { Serial.write(file.read()); }
  file.close();
}
