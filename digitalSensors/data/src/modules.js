//  create in VScode
//  
// array of modules to communicate
//  webReq - string of requested resource (sensor)
let modulesNames = ['AHT20', 'DS18B20', 'INA219', 'BMP280'];  // add your module

/*
	all availables modules and the measured values with properties:
		webReq - http request for get data from sensor
		delayMs - the time between of the requests
		devices - list of devices in module
		device -gName - name of device in modulesGauges class 
				properties for showing of the device values
				scales - available intervals for show of the device value
				labels - labels for the interval values buttons

*/
class MyModules {

	constructor() { }


	getSensor(sensorName) {
		return this.#modulesProperties[sensorName];
	}

	#modulesProperties = {
		AHT20: {
			//  webReq: 'AHT20',   
			delayMs: 10000,  								// частота опроса модуля milliseconds
			devices: ['Fi', 't'], 							// конкретные величины(сенсоры) входящие в модуль
			device:
			{												// описание сенсора
				'Fi': {                
					gName: 'AHT20_H',						// имя в таблице модулей (смотри modulesGauges)
					scales: [								// параметры интервалов шкалы
						{ max: 100, min: 0, count: 10 },	//  max - максимальное значение
						{ max: 100, min: 50, count: 5 },	// min - минимальное значение
						{ max: 50, min: 0, count: 5 }		// count - количество интервалов(на сколько частей делить шкалу)
					],
					labels:									// обозначения кнопок на пенели модуля
						[
							'100', '50:100', '50'
						],
				},
				't': {
					gName: 'AHT20_T',
					scales: [
						{ max: 80, min: -40, count: 6 },
						{ max: 50, min: 0, count: 5 },
						{ max: 0, min: -40, count: 4 }
					],
					labels: [
						'-40:80', '0:50', '-40:0',
					]
				}
			},
		},
		DS18B20: {
			// webReq: 'DS18B20',
			delayMs: 2000,
			devices: ['t'],
			device: {
				't': {
					gName: 'DS18B20',
					scales: [
						{ max: 10, min: -50, count: 6 },
						{ max: 50, min: 0, count: 5 },
						{ max: 110, min: 50, count: 6 },
						{ max: 125, min: 75, count: 5 },
						{ max: 120, min: -20, count : 8}
					],
					labels: [
						'-50:10', '0:50', '50:110', '75:125', '-20:120'
					]
				}
			},
		},
		INA219: {
			//  webReq: 'INA219',
			delayMs: 450,
			devices: ['U', 'I', 'P'],
			device: {
				'I': {
					gName: 'INA219_I',
					scales: [
						{ max: 1, min: 0, count: 5 },
						{ max: 2, min: 0, count: 4 },
						{ max: 4, min: 1, count: 6 },
						{ max: 5, min: 0, count: 5 }
					],
					labels: [
						'0:1', '0:2', '1:4', '0:5'
					]
				},
				'U': {
					gName: 'INA219_U',
					scales: [
						{ max: 5, min: 0, count: 5 },
						{ max: 10, min: 0, count: 5 },
						{ max: 25, min: 0, count: 5 },
						{ max: 15, min: 5, count: 5 }
					],
					labels: [
						'5', '10', '25', '5:15'
					]
				},
				'P': {
					gName: 'INA219_P',
					scales: [
						{ max: 5, min: 0, count: 5 },
						{ max: 10, min: 0, count: 5 },
						{ max: 50, min: 0, count: 5 },
						{ max: 150, min: 0, count: 6 }
					],
					labels: [
						'5', '10', '50', '150'
					]
				},
			},
		},
		BMP280: {
			//  webReq: 'BMP280',
			delayMs: 1100,
			devices: ['P', 't'],
			device: {
				'P': {
					gName: 'BMP280_P',
					scales: [
						{ max: 100, min: 90, count: 5 },
						{ max: 105, min: 95, count: 5 },
						{ max: 102, min: 98, count: 4 }
					],
					labels: [
						'90:100', '95:105', '98:102'
					]
				},
				't': {
					gName: 'BMP280_T',
					scales: [
						{ max: 0, min: -40, count: 4 },
						{ max: 50, min: 0, count: 5 },
						{ max: 50, min: -50 , count: 10 },
					],
					labels: [
						'-40:0', '0:50'
					]
				}
			},
		}
	}

}


