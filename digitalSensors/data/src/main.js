
/*

*/
class DevicesController {
    #controls; // buttons of controls device`s visibility
    #gauges;  // all gauges of all modules
    #activeDev = {}; // all online sensors 
    #modules = {}; //  modules properties
    #owner; //  device owner - any html blocks element( div and e.t.c)
    #intervalId = 0; // interval function number for stop watch
    #delay = 20000;  // time beetwen requests of server

    constructor(devicesButtons, deviceOwner) {
        this.#controls = devicesButtons; // object with all controll of visibility buttons
        this.#gauges = new ModulesGauges();
        this.#modules = new MyModules();
        this.#owner = deviceOwner;
    }

    showActiveDevices() {
        let d = '';
        for (let name in this.#activeDev) d += name + ' : ';
        console.log('Connected sensors ' + d);
    }

    /*
     sensorName - module name( INA129 and e.t.c.)
    */
    addDevices(sensorName) {
        if( !sensorName)return;
        //console.log('create sensor - ' + sensorName);
        let devWorker = new DeviceWorker(); // handler and creator of device
        let sensor = this.#modules.getSensor(sensorName);
        let devNames = sensor.devices;
        let controls = this.#controls[sensorName];
        for (let name of devNames) {
            let props = sensor.device[name];
            let gauge = this.#gauges.getGauge(props.gName);
            let device = devWorker.createPanel(gauge, props, this.#owner, (controls[name]));
            this.#activeDev[props.gName] = device;
        }
       //console.log('current delay - ' + sensor.delayMs)
        if (this.#delay > sensor.delayMs) this.#delay = sensor.delayMs;
    }

    /*
        start of server request
    */
    startWatch() {
        let myHandler = this.getValuesHandler(this.#activeDev);
        //    // debug info
        //    for (let d in this.#activeDev) console.log('name=' + d + '   device=' + this.#activeDev[d]);
        let delay = this.#delay;
        //console.log('DevicesController.startWatch "delay" = ' + delay);
        // end debug info
        let h = this.handleRequest.bind(this, '/values', myHandler.bind(this));
        this.#intervalId = setInterval(
            h,
            delay
        );
        //console.log('IntervalId = ' + this.#intervalId);
    }

    /*
        handle server response 
        and return handler for connected sensors
    */
    getValuesHandler(devicesHandlers) {
        let myHandler = function (values, isError) {
            if(isError){
                this.showError(values);
                return;
            }
            let res;
            try {
                res = JSON.parse(values);
            } catch (err) {
                res = { e : '' + values + '<br> ошибка [ ' +  err + ' ]' }
            }
            for (let sensor in res) {
                let dig = res[sensor];
                if (!dig && dig != 0) return;
                if (Number.isFinite(dig) && dig > -60 ) {
                    dig = Math.floor(dig * 10) / 10;
                    if (sensor == 'BMP280_P') dig = Math.floor(dig)/1000;
                    devicesHandlers[sensor].gauge.update({ value: dig });
                } else {
                    this.showError('Неверные данные - ' + dig);
                }
            }
        }
        return myHandler;
    }

    clear() {
        this.#owner.innerText = "";
        //  this.#devices = {};
        let but = document.getElementsByClassName('valButton');
        for (let b of but) {
            if (b.classList.contains('button-enabled-active'))
                b.classList.toggle('button-enabled-active');
        }
        clearInterval(this.#intervalId);
        for (let dev in this.#activeDev)this.#activeDev[dev] = null;
        this.#activeDev = {};
        this.#delay = 20000;
        document.getElementById('errPanel').innerHTML = "";
    }


    handleRequest(request, handler) {
        //console.log(' make request');
        let xhttp = new XMLHttpRequest();
        try {
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    //console.log("HTTP status = " + this.status);
                    let answer = this.responseText;
                    if (this.status == 200) {
                        //console.log("GET/200 - [ " + answer + ' ]');
                        handler(answer, false);
                        return;
                    }
                    if(this.status == 0){
                        handler(' ESP8266 не отвечает ! ', true);
                        return;
                    } else if (this.status >= 300) {
                        if (answer == undefined || answer == '') {
                            answer = ' Проблема на сервере статус ответа <u>' +
                                this.status + '</u>';
                        }
                        console.log("ERROR from server on load data [ " + answer + " ] status=" + this.status);
                        handler(answer, true)
                    }
                }
            };
            xhttp.open("GET", request, true);
            xhttp.send();
        } catch (error) {
            console.log("catched error: " + e);
            if (error) {
                document.getElementById('errPanel').innerText = error;
            }
        }
    }

    init() {
        this.clear();
        for (let d in this.#controls) {
            //console.log('d in modules - ' + d);
            let s = this.#controls[d];
            //console.log( 's - ' + s);
            for (let b in s) {
                let el = s[b];
                //console.log('b [ ' + b + ']  el - ' + el);
                if (el.classList.contains('button-enabled')) el.classList.toggle('button-enabled');
                if (el.classList.contains('button-enabled-active')) el.classList.toggle('button-enabled-active');
            }
        }
        //  answer - data from server, isErr = true if response status > 300 
        function initHandler(answer, err) {
            if (err) {
                this.showError(answer);
            } else {
                let sArray = answer.trim().split(':');
                //console.log('get modules - "' + sArray.toString() + '"');
                //  create devices panels to hold gauges
                for (let sName of sArray) {
                    let sensor = this.#controls[sName];
                    //console.log(' sensor - "' + sensor + '"');
                    for (let b in sensor) {
                        sensor[b].classList.toggle('button-enabled');
                    }
                    //console.log('try create devices');
                    this.addDevices(sName);
                }
                this.showActiveDevices();
                document.getElementById('errPanel').innerText = "";
                this.startWatch();
            }
        }
        let h = initHandler.bind(this);
        this.handleRequest('/list', h);
    }

    showError(answer) {
        this.clear();
        document.getElementById('errPanel').innerHTML = "<h2>Проблемы с чтением значений</h2>" +
            " <div><big><b>" + answer + "</b></big></div><h2>Проверьте состояние устройства(ESP8266) и попробуйте обновить список модулей</h2>";
    }



}
//  ==========================  END  DevicesController ===============================
//  =================================================================================


