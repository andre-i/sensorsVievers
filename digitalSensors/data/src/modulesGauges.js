
/*
	All available gauges for show


for get gauge call 'getGauge(gauge_name)'

	modules gauge_name
	    // DS18B20
		'DS18B20'- t,
		// aht20
		'AHT20_T' - t,
		'AHT20_H' - h( humidity ),
		// ina219
		'INA219_U' - u,
		'INA219_I' - i,
		'INA219_P' - p( power),
		// bmp280
		'BMP280_T' - t,
		'BMP280_P' - p,	

чтобы вставить свой модуль необходимо 
 1) сформировать вид нового измерительного прибора
    подробности на https://canvas-gauges.com/ сайт
	на гитхабе https://github.com/Mikhus/canvas-gauges
	также можно смотреть ниже и переделать по своему вкусу
 2) добавить в объект #all свой прибор(см в нижней части класса)
 3) в классе "MyModules" прописать свой прибор ( подробности там-же )
 4) в html файле добавить кнопки в таблицу, в  переменную devicesButtons  добавить
	описание своей кнопки
 


*/
// gauges sizes calculate from size of browser window
let g_height = 3.2*document.documentElement.clientHeight/4; 

class ModulesGauges {



	constructor(){
		//this.g_height = 3*document.documentElement.clientHeight/4; 
	}

	// =======================================================
	//                DS18B20
	// =======================================================

	//
	ds_t = new RadialGauge({
		renderTo: document.createElement('canvas'),
		width:g_height,
		height:g_height,
		title: 't (DS18B20)',
		units: "°C",
		//fontNumbersSize : 30,
		fontTitleSize: 40,
		fontUnitsSize: 40,
		fontNumbersSize: 35,
		colorStrokeTicks: '#002',
		colorNumbers: '#200',
		colorTitle: 'rgb(1, 1 ,50)',
		colorUnits: 'rgb(20, 30, 1)',
		valueBox: false,
		minValue: -20.0,
		maxValue: 120,
		value: 0,
		majorTicks: [-20, 0, 20, 40, 60, 80, 100, 120],
		minorTicks: 10,
		strokeTicks: true,
		colorPlate: "#cfc",
		colorValueBoxRect: "fff",
		borderShadowWidth: 10,
		borders: false,
		borderOuterWidth: 20,
		needleType: "arrow",
		needleWidth: 5,
		needleCircleSize: 0,
		needleCircleOuter: false,
		needleCircleInner: false,
		colorNeedle: "#020",
		colorNeedleEnd: "#030",
		animationDuration: 1500,
		animationRule: "linear",
		barProgress: false,
		highlights : [ { from : -20.0 , to : 120, color :'#fff' }, ],
	});

	//  ===============================================================================
	/*
	 *   AHT20  termometer and gigrometer panels
	*/
	//  ================================================================================ 

	//	TERMOMETER
	aht_t = new  RadialGauge({
		renderTo: document.createElement('canvas'),  //'AHT10_humidity',
		width:g_height,
		height:g_height,
		title: 't (AHT)',
		units: "°C",
		fontTitleSize: 40,
		fontUnitsSize: 40,
		fontNumbersSize: 35,
		strokeTicks: true,
		colorStrokeTicks: '#fff',
		colorMinorTicks: '#fff',
		colorNumbers: '#318',
		colorPlate: "#ccf",
		colorPlateEnd : '#99c',
		colorTitle: 'rgb(2, 1 ,6)',
		colorUnits: 'rgb(8, 1, 1)',
		valueBox: false,
		minValue: -50,
		maxValue: 50,
		majorTicks: [-50, -40, -30, -20, -10, 0 ,10, 20, 30, 40, 50],
		minorTicks: 10,
		borders: true,
		borderOuterWidth: 10,
		needleType: "arrow",
		needleWidth: 5,
		needleCircleSize: 7,
		needleCircleOuter: true,
		needleCircleInner: false,
		colorNeedle: "#942",
		colorNeedleEnd: "#ffe",
		animationDuration: 1500,
		animationRule: "linear",
		barProgress: false,
		highlights : [ { from : -50, to : 50, color :'#219' }, ],
	});

	// HUMIDITY (HYGROMETER)
	aht_hum = new RadialGauge({
		renderTo: document.createElement('canvas'),  //'AHT10_humidity',
		width:g_height,
		height:g_height,
		title: 'Влажность',
		units: "%",
		//fontNumbersSize : 30,
		fontTitleSize: 40,
		fontUnitsSize: 40,
		fontNumbersSize: 35,
		colorStrokeTicks: '#002',
		colorNumbers: '#200',
		colorTitle: 'rgb(2, 1 ,6)',
		colorUnits: 'rgb(8, 1, 1)',
		colorPlate: "#88f",
		colorPlateEnd : '#cfa',
		valueBox: false,
		minValue: 0,
		maxValue: 100,
		majorTicks: [0, 20, 40, 60, 80, 100],
		minorTicks: 10,
		strokeTicks: true,
		borders: false,
		borderOuterWidth: 20,
		needleType: "arrow",
		needleWidth: 3,
		needleCircleSize: 7,
		needleCircleOuter: true,
		needleCircleInner: false,
		colorNeedle: "#228",
		colorNeedleEnd: "#035",
		animationDuration: 1500,
		animationRule: "linear",
		barProgress: false,
		highlights : [ { from : 0, to : 100, color :'#fff' }, ],
	});

	//  ==================================================================================
	/*
		   INA219          voltage, current, power 
	*/
	//  ==================================================================================

	// voltmeter
	ina_u = new  RadialGauge({
		renderTo: document.createElement('canvas'),  //'AHT10_humidity',
		width:g_height,
		height:g_height,
		title: 'Напряжение',
		units: "В",
		fontTitleSize: 40,
		fontUnitsSize: 40,
		fontNumbersSize: 35,
		strokeTicks: true,
		colorStrokeTicks: '#fff',
		colorMinorTicks: '#fff',
		colorNumbers: '#fff',
		colorTitle: 'rgb(2, 1 ,6)',
		colorUnits: 'rgb(8, 1, 1)',
		colorPlate: "#b97",
		colorPlateEnd : '#964',
		valueBox: false,
		minValue: 0,
		maxValue: 25,
		majorTicks: [0, 5, 10, 15, 20, 25],
		minorTicks: 10,
		borders: false,
		borderOuterWidth: 20,
		needleType: "line",
		needleStart : "12" ,
		needleWidth: 2,
		//needleCircleSize: 4,
		needleCircleOuter: false,
		needeleCircleInner: false,
		colorNeedle: "#321",
		colorNeedleEnd: '#321',
		animationDuration: 1500,
		animationRule: "linear",
		barProgress: false,
		highlights : [ { from : 0, to : 100, color :'#742' }, ],
	});

	//  current  ( ampermeter )
	ina_i = new  RadialGauge({
		renderTo: document.createElement('canvas'),  //'AHT10_humidity',
		width:g_height,
		height:g_height,
		title: 'Сила тока ',
		units: "A",
		fontTitleSize: 40,
		fontUnitsSize: 40,
		fontNumbersSize: 35,
		strokeTicks: true,
		colorStrokeTicks: '#001',
		colorNumbers: '#200',
		colorTitle: 'rgb(2, 1 ,6)',
		colorUnits: 'rgb(8, 1, 1)',
		colorPlate: "#598",
		colorPlateEnd : "#cfe",
		valueBox: false,
		minValue: 0,
		maxValue: 5,
		majorTicks: [0, 1, 2, 3, 4, 5],
		minorTicks: 10,
		borders: false,
		borderOuterWidth: 20,
		needleType: "arrow",
		needleWidth: 5,
		needleCircleSize: 4,
		needleCircleOuter: true,
		colorNeedle: "#111",
		colorNeedleEnd: "#111",
		animationDuration: 1500,
		animationRule: "linear",
		barProgress: false,
		highlights : [ { from : 0, to : 100, color :'#fff' }, ],
	});

	//  power wattmeter
	ina_p = new RadialGauge({
		renderTo: document.createElement('canvas'),  //'INA219 power',
		width:g_height,
		height:g_height / 1,
		title: 'Мощность',
		units: "Вт",
		//fontNumbersSize : 30,
		fontTitleSize: 40,
		fontUnitsSize: 40,
		fontNumbersSize: 35,
		colorStrokeTicks: '#002',
		colorNumbers: '#200',
		colorTitle: 'rgb(2, 1 ,6)',
		colorUnits: 'rgb(8, 1, 1, 1)',
		startAngle: 70,
		ticksAngle: 220,
		valueBox: false,
		minValue: 0,
		maxValue: 150,
		majorTicks: [0, 25, 50, 75, 100, 125, 150],
		minorTicks: 10,
		strokeTicks: true,
		colorPlate: "#ff8",
		borderShadowWidth: 0,
		borders: false,
		borderOuterWidth: 20,
		needleType: "arrow",
		needleWidth: 4,
		needleCircleSize: 7,
		needleCircleOuter: true,
		needleCircleInner: false,
		colorNeedle: "#f11",
		colorNeedleEnd: "#006",
		animationDuration: 500,
		animationRule: "linear",
		barProgress: false,
		highlights : [ { from : 0, to : 250 , color :'#fff' }, ],
	});


	//  =======================================================================================
	/*
	*    BMP280       temperature, pressure
	*/
	//  ========================================================================================
	//
	//	TERMOMETER
	//

	//   temperature
	bmp_t =  new  RadialGauge({
		renderTo: document.createElement('canvas'),  //'AHT10_humidity',
		width:g_height,
		height:g_height,
		title: 't (BMP280)',
		units: "°C",
		fontTitleSize: 40,
		fontUnitsSize: 40,
		fontNumbersSize: 35,
		strokeTicks: true,
		colorStrokeTicks: '#fff',
		colorMinorTicks: '#fff',
		colorNumbers: '#aff',
		colorPlate: "#135",
		colorPlateEnd : '#79b',
		colorTitle: '#ffe',
		colorUnits: '#ffe',
		valueBox: false,
		minValue: -50,
		maxValue: 50,
		majorTicks: [-50, -40, -30, -20, -10, 0 ,10, 20, 30, 40, 50],
		minorTicks: 10,
		borders: true,
		borderOuterWidth: 10,
		needleType: "arrow",
		needleWidth: 5,
		needleCircleSize: 7,
		needleCircleOuter: true,
		needleCircleInner: false,
		colorNeedle: "#741",
		colorNeedleEnd: "#ffe",
		animationDuration: 1500,
		animationRule: "linear",
		barProgress: false,
		highlights : [ { from : -50, to : 50, color :'#136' }, ],
	});

	//   pressure
	bmp_pr = new RadialGauge({
		renderTo: document.createElement('canvas'),  //'BMP280 pressure',
		width:g_height,
		height:g_height / 1,
		title: 'Давление',
		units: "кПа",
		//fontNumbersSize : 30,
		fontTitleSize: 40,
		fontUnitsSize: 40,
		fontNumbersSize: 30,
		colorStrokeTicks: '#002',
		colorNumbers: '#200',
		colorTitle: 'rgb(2, 1 ,6)',
		colorUnits: 'rgb(8, 1, 1, 1)',
		startAngle: 70,
		ticksAngle: 220,
		valueBox: false,
		minValue: 95,
		maxValue: 105,
		majorTicks: [95, 97, 99, 101, 103, 105],
		minorTicks: 10,
		strokeTicks: true,
		colorPlate: "#cce",
		borderShadowWidth: 0,
		borders: false,
		borderOuterWidth: 20,
		needleType: "arrow",
		needleWidth: 5,
		needleCircleSize: 8,
		needleCircleOuter: true,
		needleCircleInner: false,
		colorNeedle: "#333",
		colorNeedleEnd: "#550",
		animationDuration: 500,
		animationRule: "linear",
		barProgress: false,
		highlights : [ { from : -50, to : 50, color :'#fff' }, ],
	});

	#all = {
		// ds18b20
		'DS18B20': this.ds_t,
		// aht20
		'AHT20_T': this.aht_t,
		'AHT20_H': this.aht_hum,
		// ina219
		'INA219_U': this.ina_u,
		'INA219_I': this.ina_i,
		'INA219_P': this.ina_p,
		// bmp280
		'BMP280_T': this.bmp_t,
		'BMP280_P': this.bmp_pr,
	}

	/*
	*	gauge - name appropriated property of sensor
	*/
	getGauge(gaugeName) {
		//console.log('get gauge by name - ' + gaugeName);
		let g = this.#all[gaugeName];
		//console.log(' get gauge - ' + g);
		g.resetScale = function (minVal, maxVal, mTicks, tickCount) {
			g.update({ minValue: minVal, maxValue: maxVal, majorTicks: mTicks, minorTicks: tickCount });
		};
		g.options.renderTo.addEventListener('click', () => {
			this.makeDialog(g);
		});
		return g;
	}

	makeDialog(gauge){
	//	console.log('clickOn ' + gauge.options.title);
		let intervalId = 0;
		let h = document.documentElement.clientHeight - 20;
	//	console.log('height = ' + h);
		let dialog = document.createElement('dialog');
		let label = document.createElement('div');
		label.setAttribute('class', 'hugePanelLabel');
		label.innerHTML = gauge.options.title;
		dialog.appendChild(label);
		let valPanel = document.createElement('div');
		if(navigator.userAgent.indexOf('Chrom')> -1)valPanel.setAttribute('class','chrom_digitPanel');
		else valPanel.setAttribute('class', 'digitPanel');
		valPanel.innerText = gauge.value;
		dialog.appendChild(valPanel);
		document.body.appendChild(dialog);
		dialog.addEventListener('click', () => {
			clearInterval(intervalId);
			dialog.close();
		})
		intervalId = setInterval(
            function() { valPanel.innerText = gauge.value; },
            400
        );
		dialog.showModal(); 
	}

	#isFull = false;

}





