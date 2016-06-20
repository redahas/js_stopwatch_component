var Clock = function(conf){
  this.parent = conf.parent;
  this.count = 0;
  this.paused = false;
  this.units = ['hours', 'minutes', 'seconds'];
  this.buttons = ['start', 'pause', 'reset'];
  this.initDom();
};

Clock.prototype.initDom = function(){
  var me = this, unit, button;
  me.dom = document.createElement('div');
  me.dom.className = 'sr-clock';
  me.clockCont = document.createElement('div');
  me.clockCont.className = 'sr-clock__cont';
  for(unit in me.units){
    me.initUnit(me.units[unit]);
    if(me.units.length - unit === 1) continue;
    me.initColon();
  }
  me.buttonsCont = document.createElement('div');
  me.buttonsCont.className = 'sr-buttons__cont';
  for(button in me.buttons){
    me.initButton(me.buttons[button]);
  }
  me.dom.appendChild(me.clockCont);
  me.dom.appendChild(me.buttonsCont);
  me.parent.appendChild(me.dom);
  me.pause.setAttribute('disabled', true);
};

Clock.prototype.initButton = function(func){
  var me = this,
    method = '_' + func;
  me[func] = document.createElement('button');
  me[func].className = ('sr-buttons__cont--button')
  me.initButtonIcon(func);
  me[func].onclick = function(){me[method]();};
  me.buttonsCont.appendChild(me[func]);
};

Clock.prototype.initButtonIcon = function(icon){
  var me = this, iconName;
  switch(icon){
    case 'start':
      iconName = 'fa-play';
      break;
    case 'pause':
    iconName = 'fa-' + icon;
      break;
    case 'reset':
      iconName = 'fa-rotate-left';
      break;
  }
  me[icon].innerHTML = '<i class="fa ' + iconName + '" />'; 
}

Clock.prototype.initColon = function(){
  var me = this;
  me.colon = document.createElement('div');
  me.colon.innerHTML = '';
  me.colon.className = 'sr-clock__cont--colon';
 me.clockCont.appendChild(me.colon);
};

Clock.prototype.initUnit = function(unit){
  var me = this;
  me[unit] = document.createElement('span');
  me[unit].className = 'sr-clock__cont--unit ' + unit;
  me[unit].innerHTML = '00';
  me[unit].count = 0;
  me.clockCont.appendChild(me[unit]);
};

Clock.prototype._resetUnit = function(unit){
  var me = this;
  me[unit].innerHTML = '00';
  me[unit].count = 0;
  me.start.removeAttribute('disabled');
};

Clock.prototype._start = function(){
  var me = this;
  me.start.setAttribute('disabled', true);
  if(!this.paused){
    me.pause.removeAttribute('disabled');
    if(!me.interval){
      me.interval = window.setInterval(function(){
      if(!me.paused){
        me.counter();
        }
      }, 1000);
    }
  }else{
    this.paused = false;
    this.pause.removeAttribute('disabled');
  }
};

Clock.prototype._pause = function(){
  this.paused = true;
  this.pause.setAttribute('disabled', true);
  this.start.removeAttribute('disabled');
}

Clock.prototype._reset = function(){
  var me = this, unit;
  clearInterval(me.interval);
  me.interval = false;
  me.count = 0;
  for(unit in me.units){
    me._resetUnit(me.units[unit]);
  }
  me.paused = false;
  me.start.removeAttribute('disabled');
  me.pause.setAttribute('disabled', true);
  me.resume.setAttribute('disabled', true);
}

Clock.prototype.updateUnit = function (unit){
  var me = this,
    value = me[unit].count;
  if(unit !== 'hours'){
    if((value + 1) % 60 === 0 && value !== 0){            me[unit].count = 0; 
    }else{
      me[unit].count++;
    }
  }else{
    me[unit].count++;
  }
 
  me[unit].innerHTML = (me[unit].count.toString().length === 1) ? '0' + me[unit].count.toString() : me[unit].count.toString();
};

Clock.prototype.counter = function(){
  var me = this;
  me.count++;
  me.updateUnit('seconds');
  if(me.count % 60 === 0 && me.count !== 0) me.updateUnit('minutes');
  if(me.count % 3600 === 0 && me.count !== 0) me.updateUnit('hours');
};

var clock = new Clock({
  parent: document.getElementById('container')
});
