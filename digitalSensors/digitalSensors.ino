/*
       sensor data SERVER
*/
#include "DefaultProps.h"
#include "Util.h"
#include "Sensors.h"

// global args
Util util;
bool isInit = false;
Sensors sensors;


bool debug = false;
bool myError = false;
String answ = ""; //  data for send to client
const int led = LED_PIN; // pin of onboard LED

//  list of available modules - for position see DeaultProps
int list[] = { 0,0,0,0,0 };
//  values of all sensors in all modules- for position see DeaultProps
float values[] = { -100 , -100 , -100 , -100 , -100 , -100 ,-100 , -100 };

//  protect voltage state
bool isVoltageProtect = true;



//  ======================
//         LITTLEfs
//  ======================
#include <LittleFS.h>

static bool fsOK;
const char* fsName = "LittleFS";
FS* fileSystem = &LittleFS;
LittleFSConfig fileSystemConfig = LittleFSConfig();
File fName;


// ================================================================================
//                                  sensors
// ===================================================================================

void resetValues(){
  for(int i = 0; i < SENSORS_COUNT; i++) values[i] = 0;
  for(int i = 0; i < MODULES_COUNT; i++) list[i] = 0;
}

void getValues(){
  answ = "{";
  if(list[AHT20_S]){
    answ += "\"AHT20_T\":" + String(values[AHT20_T]) + ",\"AHT20_H\":" + String(values[AHT20_H]) + ",";
  }
  if(list[DS18B20_S]){
    answ += "\"DS18B20\":" + String(values[DS18B20_T]) + ",";
  }
  if(list[INA219_S]){
    // Serial.println(values[INA219_U]);

    answ += "\"INA219_U\":" + String(values[INA219_U]) + ",\"INA219_I\":" + String(values[INA219_I]) + ",\"INA219_P\":" + String(values[INA219_P]) + ",";
  }
  if(list[BMP280_S]){
    answ += "\"BMP280_T\":" + String(values[BMP280_T]) + ",\"BMP280_P\":" + String(values[BMP280_P]) + ","; 
  }
  answ = answ.substring(0, answ.length() - 1);
  answ += "}";
  if(debug){
    Serial.print(F("Send values [ "));
    Serial.print(answ);
    Serial.println(" ]");
  }
  if(answ.length() < 4) {
    returnFail("Датчики не отвечают.<br> Попробуйте обновить список подключенных датчиков");
    myError = true;
  }else {
    if(debug) {
      Serial.print(F(" Get from server { "));
      Serial.print(answ);
      Serial.println(" }"); 
    }
    returnData(answ);
    if(myError) myError = false;
  }
}



//  ___________________  call all sensors on init  ____________
//   return client list of sensors
void getSensorsList(){
  resetValues();
  if(! sensors.initDevices(list, values)){
    returnFail(F("Датчиков не обнаружено !!! Подключите датчик и \
 повторите процедуру обнаружения"));
    myError = true;
    isInit = false;
  } else{
    answ = "";
    if( list[INA219_S]){
      answ += "INA219:";
    }  
    if(list[BMP280_S]){
      answ += "BMP280:";
    }
    if(list[AHT20_S]){
      answ += "AHT20:";
    }
    if(list[DS18B20_S]) {
      answ += "DS18B20";
    }
    if(debug){
      Serial.print(F("Send list [ "));
      Serial.print(answ);
      Serial.println(" ]");
    }
    myError = false;
    returnData(answ);
  }
}

// ==========================================
//          esp web server
// ==========================================

#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

ESP8266WebServer server(PORT);

// ====== standart server specific ========

/*
 * create route table
 *  1) for route static content
 *  2) for sensors request
 */
void fillHandlersTable(){
  server.on("/reset", resetChip);
  server.onNotFound(handleNotFound);
  //  Return data of active sensors
  server.on("/values", getValues);
  // Return list of availabes sensors
  server.on("/list",getSensorsList);
  // serve all static files
  server.serveStatic("/", LittleFS, "/src/");
  //enable CORS header in webserver results
  server.enableCORS(true);
}

// reset on http request
void resetChip(){
  Serial.println(F(" RESET CHIP by HTTP request"));
  returnOK();
  ESP.reset();
}

//  server specific
void returnOK() {
  server.send(200, "text/plain", "Ok");
}

void returnFail(String msg) {
  server.send(500, "text/plain", msg + "\n\r");
}

void returnData(String sensorData){
  server.send(200, "text/plain", sensorData);
}


void handleNotFound() {
  // if (isFS && loadFile(NOT_FOUND)) return;
  String message = F("<html><body><br><h1>__RESOURCE_NOT_FOUND __</h1><br><h3><!-- \n -->URI: ");
  message += server.uri();
  message += F("</h3><h3><!-- \n --> Method: ");
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += F("</h3><h3><!-- \n --> Arguments: ");
  message += server.args();
  message += F("</h3><!-- \n --> ");
  for (uint8_t i = 0; i < server.args(); i++) {
    message += F("<h4><!-- \n --> NAME:" )+ server.argName(i) +
    F("</h4><h4>  VALUE:") + server.arg(i) + "</h4>  ";
  }
  message += F("<!-- \n --><br><hr width='60%'><!-- \n -->");
  server.send(404, "text/html", message);
}


//  ==================================================
//          --------------  INIT ------------------
//  ==================================================

/*
 * Init file system on start device
 * if Error set error state
 */
bool initLittleFS(){
  // LittleFS INIT  ------------------------------
  fileSystemConfig.setAutoFormat(false);
  fileSystem->setConfig(fileSystemConfig);
  if(fileSystem->begin()){
    //  if filesystem available -> fill start parameters
    if(!util.fillStartParams()){
      myError = true;
      delay(2000);
      Serial.println(F("\nНет стартовых параметров"));
      return false;
    } 
  }else{
    myError = true;
    util.showFatalError();
    return false;
  }
  return true;
}

/*
 * init wifi system on start device
 */
void initWIFI(){
  IPAddress local_IP(192,168,4,2);
  IPAddress gateway(192,168,4,1);
  IPAddress subnet(255,255,255,0);
  
  Serial.print(F("Setting soft-AP configuration ... "));
  Serial.println(WiFi.softAPConfig(local_IP, gateway, subnet) ? "Ready" : "Failed!");

  Serial.print(F("Setting soft-AP ... "));
  Serial.println(WiFi.softAP(util.getESP_SSID(), util.getPASSWD()) ? "Ready" : "Failed!");
  Serial.print(F("AP password : "));
  Serial.println(util.getPASSWD());
  Serial.print(F("Soft-AP IP address = "));
  Serial.println(WiFi.softAPIP());
  /*
  WiFi.mode(WIFI_STA);
  WiFi.begin( util.getESP_SSID(), util.getPASSWD() );
  Serial.println("");
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    if(Serial.available()>0){
      Serial.println(F("Нет соединения с сетью"));
      util.handleSerial();
      return;
    }
    
  }*/
  //  show wifi parameters
  //Serial.println("");
  //Serial.print(F("Connected to "));
  //Serial.println(util.getESP_SSID());
  //Serial.print(F("IP address: "));
  //Serial.println(WiFi.localIP());
}

/*
 *  Init sensors on startUp system
 */
 void probeSensors(){
    if(! sensors.initDevices(list, values)){
    returnFail(F("Датчиков не обнаружено !!! Подключите датчик и \
 повторите процедуру обнаружения"));
    myError = true;
    isInit = false;
  }
 }

// =============  setup  ==================
void setup() {
  Serial.begin(115200);
  Serial.println("Start APP");
  // LittleFS
  if(! initLittleFS()){
    myError = true;
    return;
  }
  util.showManual();
  debug = true;
  //  pins
  pinMode(led, OUTPUT);
  digitalWrite(led, 0);
  pinMode(MOSFET_PIN, OUTPUT);
  digitalWrite(MOSFET_PIN, !isVoltageProtect);
  pinMode(BUTTON_PIN, INPUT);
  // for DEBUG mode
  util.setDebugAddress(&debug);
  if(debug)Serial.println(F("Start Sensors"));
  sensors.init(&util);
  //    SERVER
  //   WI-FI  
  initWIFI();
  //   SERVER handlers 
  fillHandlersTable();
  server.begin();
  Serial.println(F("HTTP server started"));
  delay(1500);
  probeSensors();
  debug = false;
}



//  =====================================================
//  ======================  LOOP  ==========================
//  =====================================================


/*
 * 
 */
void loop() {
  static uint32_t loopCount;
  static uint8_t pressCount;
  loopCount ++;
  if(loopCount == 96 )loopCount  = 0;
  //  ================= SERIAL ============================
  if(Serial.available() > 0){
    util.handleSerial();
    return;
  }
  //  blynk if ERROR or not
  if(myError ){
    //  blynk on init error
    if(loopCount%3 == 0) digitalWrite(led, !digitalRead(led));// blynk on error
    delay(100);
    return;
  }else if( loopCount%21 == 0 ){
    //   NO ERROR
    digitalWrite(led, !digitalRead(led));// blynk on "Ok"
  }

  // ===================== sensors =========================== 
  //  INA219
  // check protect voltage
  if(list[INA219_S]){
    if(!digitalRead(BUTTON_PIN)){  //  button pressed
      pressCount++;
    }
    else{
      if(pressCount > 8){
        isVoltageProtect = !isVoltageProtect;
        digitalWrite(MOSFET_PIN, !isVoltageProtect);
      }
      if(pressCount)pressCount = 0;
    }
  }
  if(loopCount%5 == 0 && list[INA219_S]){
    sensors.refreshINA219(values);
    if(values[INA219_U] < 0.1) {
      isVoltageProtect = true;
      digitalWrite(MOSFET_PIN, !isVoltageProtect);
    }
  }
  //  BMP280
  if(loopCount%10 == 0 && list[BMP280_S]){
    sensors.refreshBMP280(values);
  }
  // DS18B20
  if(loopCount%15 == 0 && list[DS18B20_S]){
    sensors.refreshDS18B20(values);
  }
  // AHT20
  if(loopCount%95 == 0 && list[AHT20_S]){
    sensors.refreshAHT20(values);
  }
  //  place for other module
  
 
  
  //  ----------  server  -------------
  server.handleClient();
  //MDNS.update();
  delay(100);
}
