var UI = require('ui');
var lights = [
  {
    title: 'Living Room',
    subtitle: 'no state',
    address: 'Zwolle',
  }, 
  {
    title: 'ESP8266',  
    subtitle: 'no state',
    address: 'Deventer'
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
//  toggleState(lights[event.itemIndex].address,event.itemIndex); 
  toggleState(event.itemIndex);
});


 
function getLightStates(){
  for(var i = 0; i<lights.length; i++){
    fetchLightState(i);
  }
  menu.show();
}


function fetchLightState(lightIndex){
  var address = lights[lightIndex].address;
  var content = "";
  var req = new XMLHttpRequest();
 // req.open('GET','http://192.168.1.'+address+'/cgi-bin/json.cgi?get=state',false);
  req.open('GET','http://api.openweathermap.org/data/2.5/weather?q='+address+'&appid=f9243c8dd03d09b687242bcf57715f48',false);
  req.ontimeout = function (e) {
    lights[lightIndex].subtitle = 'timout...';
  };
  
  req.onerror = function (e) {
    lights[lightIndex].subtitle = 'error...';
  };
  req.onload = function () {
    //lights[lightIndex].subtitle = 'loading...'+address;
    if (req.readyState === 4) {
      if (req.status === 200) {
        var response = JSON.parse(req.responseText);
        content = response.name; // HAS TO BE CONTENT FOR PROPER JSON
        console.log("content: " + content);
        if(content !== "" && content !== undefined){
          if(content == "light: on"){
             lights[lightIndex].subtitle = 'on';
          } else if(content == "light: off"){
             lights[lightIndex].subtitle = 'off';
          } else if(content == "Zwolle"){
             lights[lightIndex].subtitle = 'Zwolle';
          } else if(content == "Deventer"){
             lights[lightIndex].subtitle = 'Deventer';
          }
          return content;
        }
      } else{
        lights[lightIndex].subtitle = 'bad request...';
      }
    }
  };
  req.send(null);
}


function toggleState(lightIndex){
  var address = lights[lightIndex].address;
  var content = fetchLightState(address);
  var state = "";
  if(content == "light: on"){
    state ="off";
  } else if(content == "light: off"){
    state ="on";
  }
  var req = new XMLHttpRequest();
  req.open('GET','http://192.168.1.'+address+'/cgi-bin/json.cgi?set='+state,false);
  req.onload = function () {
    if (req.readyState === 4) {
      if (req.status === 200) {
        var response = JSON.parse(req.responseText);
        content = response.content;
        lights[lightIndex].subtitle = content;
      } else{
        return "no connection...";  
      }  
    } 
  };
  req.send(null);
}


