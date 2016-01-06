var UI = require('ui');
var lights = [
  {
    title: 'Living Room',
    subtitle: 'loading...',
    address: 106,
  }, 
  {
    title: 'ESP8266',  
    subtitle: 'loading...',
    address: 177
  }
];
var menu = new UI.Menu({
              sections: [{
                title: 'Light Switches',
                items: lights
              }]
            });

getLightStates(); // get states of lights
menu.show(); // show lights and there states in menu


 
menu.on('select', function(event) { // actionHandeler for lightToggles
  toggleState(lights[event.itemIndex].address,event.itemIndex); 
});


 
function getLightStates(){
  for(var i = 0; i<lights.length; i++){
    var content = fetchLightState(lights[i].address);
    if(content == "light: on"){
      lights[i].subtitle = 'on';
    } else if(content == "light: off"){
      lights[i].subtitle = 'off';
    } else{
      lights[i].subtitle = 'no connection...';
    }
  }
}


function fetchLightState(lightAddress){
  var content = "";
  var req = new XMLHttpRequest();
  req.open('GET','http://192.168.1.'+lightAddress+'/cgi-bin/json.cgi?get=state',true);
  req.onload = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        var response = JSON.parse(req.responseText);
        content = response.content;
        //var city = response.address.city;
        console.log("content: " + content);
        if(content !== "" && content !== undefined){
          return content;
        }
      } 
    }
  };
  req.send(null);
}


function toggleState(lightAddress,lightIndex){
   var content = fetchLightState(lightAddress);
   var state = "";
   if(content == "light: on"){
      state ="off";
    } else if(content == "light: off"){
      state ="on";
    }
   var req = new XMLHttpRequest();
   req.open('GET','http://192.168.1.'+lightAddress+'/cgi-bin/json.cgi?set='+state,true);
   req.onload = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        lights[lightIndex].subtitle = state;
        menu.show();
        }   
      } 
  };
  req.send(null);
}


