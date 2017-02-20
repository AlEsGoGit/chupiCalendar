(function(){


	/* Constructor */
	this.ChupiCalendar= function(container,options={}) {
		this.options=mergeOptions(this.defaults,options);
		this.container=container;
		this.currentDate=new Date();
		this.header;
		this.weekTable;
		this.daysTable;
		init.call(this);
	}

	/* CLASS ATTRS*/

	/* ...for the week row */
	ChupiCalendar.prototype.daysTitles={
		es:["DO","LU","MA","MI","JU","VI","SA"],
		en:["SU","MO","TU","WE","TH","FR","SA"]
	};

	/* ...fir the header */
	ChupiCalendar.prototype.monthsTitles={
		es:["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
		en:["January","Frebruary","March","April","May","June","July","August","September","October","November","December"]
	};

	/* default options */ 
	ChupiCalendar.prototype.defaults={
		lan:"en",
		firstDay: 2,
	};

	/* API */

	/* Changes the options */
	ChupiCalendar.prototype.setOptions=function(options = {}){
		this.options=mergeOptions(this.defaults,options);
	}

	/* Changes the current date */
	ChupiCalendar.prototype.setDate=function(date){
		this.currentDate=date;
	}

	/* Repaint */
	ChupiCalendar.prototype.refresh=function(){
		paintHeader.call(this);
		paintWeek.call(this);
		paintDays.call(this);
	}

	/* PRIVATE FUNCTIONS */

	/*
	* Renders static elements.
	*/
	function init(){

		//Create container
		var calendarContainer=document.createElement('div');
		calendarContainer.className=" calendar-container ";

		//Create header
		var headerContainer=document.createElement('div');
		headerContainer.className=" calendar-header ";
		//Create header elements
		var previousButton=document.createElement('button');
		previousButton.innerHTML="<";
		var divaux=document.createElement('div');
		divaux.appendChild(previousButton);
		headerContainer.appendChild(divaux);

		this.header=document.createElement('div');
		headerContainer.appendChild(this.header);

		var nextButton=document.createElement('button');
		nextButton.innerHTML=">";
		var divaux=document.createElement('div');
		divaux.appendChild(nextButton);
		headerContainer.appendChild(divaux);

		//Create table container
		var tableContainer=document.createElement('div');
		//Create table week
		this.weekTable=document.createElement('div');
		this.weekTable.className=" calendar-table calendar-table-week ";
		//Create table days
		this.daysTable=document.createElement('div');
		this.daysTable.className=" calendar-table calendar-table-days ";

		tableContainer.appendChild(this.weekTable);
		tableContainer.appendChild(this.daysTable);

		//Append everything to container
		calendarContainer.appendChild(headerContainer);
		calendarContainer.appendChild(tableContainer); 
		this.container.appendChild(calendarContainer);

		//Add events to buttons
		var context=this;
		previousButton.addEventListener('click',function(){
			changeDateEvent(-1,context);
			context.refresh(context.currentDate);
		});
		nextButton.addEventListener('click',function(){
			changeDateEvent(1,context);
			context.refresh(context.currentDate);
		});

		this.refresh(this.currentDate);
	}

	/*
	* Renders the header (Month + Year)
	*/
	function paintHeader(){
		this.header.innerHTML=this.monthsTitles[this.options.lan][this.currentDate.getMonth()]+" "+this.currentDate.getFullYear();
	}

	/*
	* Renders the week row
	*/
	function paintWeek(){
		this.weekTable.innerHTML="";
		var headerRow=document.createElement('ul');
		var nextDay;
		for (i=0; i<7;i++){
			nextDay=document.createElement('li');
			divaux=document.createElement('div');
			divaux.innerHTML=this.daysTitles[this.options.lan][(i+this.options.firstDay)%7];
			nextDay.appendChild(divaux);
			headerRow.appendChild(nextDay);
		}
		this.weekTable.appendChild(headerRow);
	}

	/*
	* Renders the days table
	*/
	function paintDays(){
		var today=new Date();
		days=getDays(this.currentDate,this);
		this.daysTable.innerHTML="";
		for(i=0;i<days.length;i++){
			if(i%7==0){
				nextRow=document.createElement("ul");
				this.daysTable.appendChild(nextRow);
			}
			nextDay=document.createElement("li");
			auxdiv=document.createElement("div");
			auxdiv.className=" day-cell ";
			auxdiv.innerHTML=days[i].getDate();
			nextDay.appendChild(auxdiv);
			auxdiv=document.createElement("div");
			auxdiv.className=" event-cell ";
			nextDay.appendChild(auxdiv);
			nextDay.setAttribute('data-day',days[i].getDate());
			nextDay.setAttribute('data-month',days[i].getMonth()+1);
			if(days[i].getMonth()!=this.currentDate.getMonth()){
				nextDay.className=" other-month ";
			}
			if(days[i].getDate()==today.getDate() && days[i].getMonth()==today.getMonth()){

				nextDay.className=nextDay.className+" today ";
			}
			nextRow.appendChild(nextDay);
		}
	}

	/* EVENTS */

	/* Event for the previous next buttons */
	function changeDateEvent(newDate,context){
		context.currentDate.setMonth(context.currentDate.getMonth()+newDate);
	}

	/* HELPER FUNCTIONS */

	/*
	* Get an array with the days in the current month
	*/
	function getDays(givenDate,context){
		var lastDayDate= new Date(givenDate.getFullYear(),givenDate.getMonth()+1,0),
		lastDay = lastDayDate.getDate(),
		firstDayPosition = (7+new Date(givenDate.getFullYear(),givenDate.getMonth(),1).getDay()-(context.options.firstDay)%7)%7;
		lastDayPosition= (firstDayPosition+lastDay)%7;

		var days=[];
		for(i = firstDayPosition-1; i>=0;i--){
			days.push(new Date(givenDate.getFullYear(),givenDate.getMonth(),0-i));
		}

		for(i = 1; i<=lastDay;i++){
			days.push(new Date(givenDate.getFullYear(),givenDate.getMonth(),i));
		}

		for(i = 1; i<=7-lastDayPosition;i++){
			days.push(new Date(givenDate.getFullYear(),givenDate.getMonth()+1,i));
		}
		return days;
	}

	/*
	* Merge two options objects. The second object overrides the first.
	*/
	function mergeOptions(defaults,options){
		var extended={};
		var prop;
		for(prop in defaults){
			if (options.hasOwnProperty(prop)){
				extended[prop]=options[prop];
			}else{
				extended[prop]=defaults[prop];
			}
		}
		return extended;
	}

}())