
//  =================================================================================
//          devicePanel
//  =================================================================================
/*
    create 
        device panel 
                    consist gauge + control scale menu
        buttons for control scale panel and button`s handlers
    add  visibility button and it handler
*/
class DeviceWorker {
	#gauge;
   /*   #scales;
	 #visibilityButton;
	 #devices;
	 #isVisible = false;
	 #owner;   */
 
	 constructor() { }
 
	 checkAndSet(gauge, gProps) {
		 if (!gauge || !gProps) throw Error('Can`t create DevicePanel. Goten values is wrong');
	 }
 
	 /*
		 create panel with gauge( take from modulesGauge) and buttons 
		 for change mode( showed interval ) gauge on panel
		 gauge - one from ModulesGauges class
		 gProps - must be take from devices property of sensor
	 */
	 createPanel(gauge, gProps, owner, controlButton) {
		 this.checkAndSet(gauge, gProps);
		 this.#gauge = gauge;
		 let labels = gProps.labels;
		 let scales = gProps.scales;
		 let panel = document.createElement('div');
		 panel.setAttribute('class', 'devPanel');
	   // panel.setAttribute('style', 'display: inline');
		 let device = {
			 isVisible: false,
			 owner: owner,
			 cButton: controlButton,
			 gauge: gauge,
			 scales: scales,
			 panel: panel,
		 }
		 //   menu buttons
		 let hMenu = this.makeMenu(device, labels);
		 panel.appendChild(hMenu);
		 //  horisontal line
		 let line = document.createElement('hr');
		// line.setAttribute('width', '86%');
		 panel.appendChild(line);
		 //   gauge
		 panel.appendChild(gauge.options.renderTo);
		 gauge.draw();
		 //  controlButton
		 controlButton.onclick = this.toggleVisibility.bind(device);
		 return device;
	 }
 
	 makeMenu(device, labels) {
		 let menu = document.createElement('div');
		 menu.setAttribute('class', 'scalesMenu');
		 let i = 0;
		 for (let label of labels) {
			 let b = document.createElement('button');
			 b.setAttribute('class', 'devButton');
			 b.onclick = this.clickOnButton.bind(device, i);
			 b.innerText = label;
			 menu.appendChild(b);
			 i++;
		 }
		 return menu;
	 }
 
	 setValue( newValue){
		 if( Number.isFinite(newValue) && newValue > -50)gauge.update({ value : newValue});
		 else {
			 document.getElementById('errPanel').innerText = 
				 " Ошибка при получении данных с устройства [ "  + newValue + " ]" + 
				 '<br> Возможно устройство не подключено или неисправно. Попробуйте обновить список.' ;
			 this.toggleVisibility();
		 }
	 }
 
 
	 /*
		 Update scale of device with new values
		  n - number of scale in properties
	 */
	 clickOnButton(n) {
		// console.log('click on - ' + n + '  scales - ' + this.scales);
		 let scale = this.scales[n];
		 let dashLabels = [];
		 let shift = (scale.max - scale.min) / scale.count;
		 let i = 0;
		 dashLabels[0] = scale.min;
		 for (i = 1; i <= scale.count; i++)dashLabels[i] = Math.floor((scale.min + shift * i)*10)/10;
		 let shorDashCount = scale.count > 5 ? 5 : 10;
		 this.gauge.highlights = [  {from: scale.min ,to: scale.max, color: "rgb(255, 255, 255)"}];
		 this.gauge.resetScale(scale.min, scale.max, dashLabels, shorDashCount);
	 }
 
	 toggleVisibility() {
		if(!this.cButton.classList.contains('button-enabled') && 
		    !this.cButton.classList.contains('button-enabled-active')) return;
		 if (this.isVisible) {
			 this.isVisible = false;
			 this.owner.removeChild(this.panel);
			 if (this.cButton.classList.contains('button-enabled-active'))
				 this.cButton.classList.toggle('button-enabled-active');
		 } else {
			 this.isVisible = true;
			 this.owner.appendChild(this.panel);
			 this.panel.setAttribute('style', 'width :' + (this.gauge.options.width + 10) + 'px');
			 this.cButton.classList.toggle('button-enabled-active');
		 }
	 }
 }
