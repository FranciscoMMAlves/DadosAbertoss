var request = new XMLHttpRequest();



function getCampingParks(){
    request.open("GET", "http://10.112.76.37/rest/camperparks", false);
    request.send(null);
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
   
    var latLon = [];
    for(var i = 0; i < Data.camping_parks.length; i++){
        latLon.push({lat:Data.camping_parks[i][1],lon:Data.camping_parks[i][2]});
    }
    return latLon;
}

function totalCaravanists(args){
    request.open("GET", "http://10.112.76.37/rest/num_caravanists"+args, false);
    request.send(null);
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
    return Data.total_count;
}
function getTopCountries(args){
    request.open("GET", "http://10.112.76.37/rest/countries"+args, false);
    request.send(null);
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
    var countryData = eval(Data.countries_data);
    var outData = {"countries":['x'],
                    "numberOfRoamers":['Presenças'], "colors":[],"allDataCountries":[],"allDataCounts":[],
                   "max_count":parseInt(Data.max_count),"min_count":parseInt(Data.min_count),"total_count":0};
    var othersCount=0;
    var t_count = 0;
    var num_count = 0;
    for(var i = 0; i < countryData.length; i++){
        if(num_count < 7 && !countryData[i].name.includes("thuraya")){
            num_count++;
            outData.countries.push(countryData[i].name.trim());
            outData.numberOfRoamers.push(countryData[i].value);
            outData.colors.push('#3cdbc0');
        }
        outData.allDataCountries.push(countryData[i].name.trim());
        outData.allDataCounts.push(countryData[i].value);
        t_count += parseInt(countryData[i].value);
    }
    outData.total_count = t_count;
    return outData;
    /*return {"countries":['x','pt','es','fr','it','ir','ru','Outros'],"numberOfRoamers":['Presenças',3,56,45,32,41,55,33], 
        "colors":['#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0'],
                   "max_count":56,"min_count":3,"total_count":243};*/
}

function getRoamersInTowsTop(args){
    request.open("GET", "http://10.112.76.37/rest/towns"+args, false);
    request.send(null);
    var twns = ['x','albufeira','portimao','quarteira','sao sebastiao','almancil','olhos de agua','montenegro'];
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
    var townsData = eval (Data.towns_data);
    var outData = {"towns":['x'],
                   "numberOfRoamers":['Presenças'], "colors":[],"allDataTowns":[],"allDataCounts":[],
                   "max_count":parseInt(Data.max_count),"min_count":parseInt(Data.min_count)};
    var othersCount=0;
    for(var i = 0; i < townsData.length; i++){
        if(i < 7){
            outData.towns.push(townsData[i].name.trim());
            outData.numberOfRoamers.push(townsData[i].value);
            outData.colors.push('#3cdbc0');
        }
        outData.allDataTowns.push(townsData[i].name.trim());
        outData.allDataCounts.push(townsData[i].value);
    }
    return outData;
    /*return {"towns":['x','pt','es','fr','it','ir','ru','Outros'],"numberOfRoamers":['Presenças',3,56,45,32,41,55,33], 
        "colors":['#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0'],
                   "max_count":56,"min_count":3,"total_count":243};*/
}

function getRoamersInDayPeriod(args){
    request.open("GET", "http://10.112.76.37/rest/periods"+args, false);
    request.send(null);
    var returnData = request.responseText;
    //console.log(returnData);
    var Data = eval('(' + returnData + ')');
    var periodData = eval(Data.period_data);
    var outData = {"period":['x','Amanhecer','Manhã','Almoço','Tarde','Jantar','Noite'],
                    "numberOfRoamers":['Presenças',0,0,0,0,0,0], "colors":[],
                   "max_count":parseInt(Data.max_count),"min_count":parseInt(Data.min_count)};
   
    for(var i = 0; i < periodData.length; i++){
        var idx = 0;
        switch(periodData[i].name.substring(2)){
            
            case "daybreak":
                idx = 1;
            break;
            case "morning":
                idx = 2;
            break;
            case "lunch time":
                idx = 3;
            break;
            case "afternoon":
                idx = 4;
            break;
            case "dinner-time":
                idx = 5;
            break;
            case "nighttime":
                idx = 6;
            break;
        }
        if(idx !== 0){
            outData.numberOfRoamers[idx]=(periodData[i].value);
            outData.colors[idx-1]=('#3cdbc0');
        }
    }
    return outData;
    /*return {"period":['x','pt','es','fr','it','ir','ru','Outros'],"numberOfRoamers":['Presenças',3,56,45,32,41,55,33], 
        "colors":['#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0'],
                   "max_count":56,"min_count":3,"total_count":243};*/
}

function decodePeriods(period){
    var mapP = {"daybreak":"Amanhecer", "morning":"Manhã","lunch time":"Almoço","afternoon":"Tarde",
                "dinner-time":"Jantar","nighttime":"Noite"};
    return mapP[period];
}

function getRoamersEntriesAndExits(args){
    
    var mapLocIns = {'airportIn':'Aeroporto', 'VRSAntonioIn':'V.R.S.António','n120_OdeceixeIn':'Odeceixe', 'n266_267monchiqueIn':'Monchique',
                      'ic1_saoMarcosSerraIn':'S.Marcos Serra','a2_saoBartolomeuMessinesIn':'S.BartolomeuMessines', 'n2_ameixalIn':'Ameixal',
                      'ic27_balurcosIn':'Balurcos'};
    var mapLocOuts = {'airport':'Aeroporto', 'VRSAntonio':'V.R.S.António','n120_Odeceixe':'Odeceixe', 'n266_267monchique':'Monchique',
                      'ic1_saoMarcosSerra':'S.Marcos Serra','a2_saoBartolomeuMessines':'S.BartolomeuMessines', 'n2_ameixal':'Ameixal',
                      'ic27_balurcos':'Balurcos'};
    request.open("GET", "http://10.112.76.37/rest/inout"+args, false);
    request.send(null);
    var returnData = request.responseText;
    //console.log(returnData);
    var Data = eval('(' + returnData + ')');
    var entryData = eval(Data.in_data);
    var exitData = eval(Data.out_data);
    var max_in = Data.max_in_count;
    var min_in = Data.min_in_count;
    var max_out = Data.max_out_count;
    var min_out = Data.min_out_count;
    
    var outData = {"location":['x','Aeroporto','Odeceixe','V.R.S.António','S.Marcos Serra','Monchique','Balurcos','Ameixal'],
                   "roamersEntries":['Entradas',0,0,0,0,0,0,0], "roamersExits":['Saídas',0,0,0,0,0,0,0],
                   "colorsEntry":[], "colorsExit":[], "max_in":max_in, "min_in":min_in, "max_out":max_out, "min_out":min_out};
    
    for(var i = 0; i < entryData.length; i++){
        var loc = mapLocIns[entryData[i].name];
        var idx = 0;
        switch(loc){
            case "Aeroporto":
                idx = 1;
            break;
            case "Odeceixe":
                idx = 2;
            break;
            case "V.R.S.António":
                idx = 3;
            break;
            case "S.Marcos Serra":
                idx = 4;
            break;
            case "Monchique":
                idx = 5;
            break;
            case "Balurcos":
                idx = 6;
            break;
            case "Ameixal":
                idx = 7;
            break;
        }
        if(idx !== 0){
            outData.roamersEntries[idx] = entryData[i].value;
            outData.colorsEntry[idx-1] = '#3cdbc0';
        }
    }
    for(var j = 0; j < exitData.length; j++){
        var loc = mapLocOuts[exitData[j].name];
        var idx = 0;
        switch(loc){
            case "Aeroporto":
                idx = 1;
            break;
            case "Odeceixe":
                idx = 2;
            break;
            case "V.R.S.António":
                idx = 3;
            break;
            case "S.Marcos Serra":
                idx = 4;
            break;
            case "Monchique":
                idx = 5;
            break;
            case "Balurcos":
                idx = 6;
            break;
            case "Ameixal":
                idx = 7;
            break;
        }
        if(idx !== 0){
            outData.roamersExits[idx] = (exitData[j].value);
            outData.colorsExit[idx-1] = '#ff7f32';
        }
    }

    
return outData;
    /*return {"location":['x','pt','es','fr','it','ir','ru','Outros'],"roamersEntries":['Entradas',33,56,4,32,31,55,3],
        "roamersExits":['Saídas',3,56,45,32,41,55,33],
                    "colorsEntry":['#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0','#3cdbc0'], 
                    "colorsExit":['#ff7f32','#ff7f32','#ff7f32','#ff7f32','#ff7f32','#ff7f32','#ff7f32'], 
                    "max_in":56, "min_in":3, "max_out":56, "min_out":3};*/
}

 
function getAllFlows(args,granularity){
    request.open("GET", "http://10.112.76.37/rest/points"+args,false);
    request.send(null);
    var returnData = request.responseText;
    //console.log(returnData);
    var Data = eval('(' + returnData + ')');
    var flowData = eval(Data.points);
    var flows =[];
    var ouData = {"flows":flows, "max_count": Data.max_count, "min_count": Data.min_countm};
    for(var i=0, len=flowData.length ; i < len ; i++){
        var date;
        var day;
        var month;
        var timeStamp;
        if(granularity === "day"){
             date = flowData[i].date;
             day = date.split("-")[2];
             month = date.split("-")[1];
             if(day.startsWith("0"))
                day = day.substring(1);
            if(month.startsWith("0"))
                month = month.substring(1);
            var year = date.split("-")[0];
            timeStamp = Date.parse(year + '/' + (month) + '/' + day);
           
         }
        else{
            month = flowData[i].date;
            if(month.startsWith("0"))
                month = month.substring(1);
            timeStamp = Date.parse('2017/' + month);
        }
        flows[i] = [flowData[i].latitude,flowData[i].longitude,timeStamp,flowData[i].count]; 
    }
    ouData.flows = flows;
    return ouData;
    
    //return {"flows":[[37,-7.5, Date.parse('2017/01/02'),5],[37,-7.5, Date.parse('2017/01/05'),2]], "max_count": 5, "min_count": 2};
}



function getFirstData(args){
    
   /* request.open("GET", "http://10.112.76.37/rest/first"+args, false);
    request.send(null);
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
    var flowData = eval(Data.points);
    var flows =[];
    var ouData = {"flows":flows, "max_count": Data.max_count, "min_count": Data.min_countm};
    for(var i=0, len=flowData.length ; i < len ; i++){
        var p = new google.maps.LatLng(parseFloat(flowData[i].latitude),parseFloat(flowData[i].longitude));
        var count = parseInt(flowData[i].count);
        flows.push({location:p,weight:count}); 
        //flows.push(p);
    }
    ouData.flows = flows;
    return ouData;*/
    var request = new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:9000/first", false);
    request.send(null);
    var returnData = request.responseText;
    
    var Data = eval('(' + returnData + ')');
    
    var flowData = eval(Data.points);
    
    var flows =[];
    var ouData = {"flows":flows, "max_count": Data.max_count, "min_count": Data.min_countm};
    for(var i=0, len=flowData.length ; i < len ; i++){
        var date;
        var day;
        var month;
        var timeStamp;
        date = flowData[i].date;
        day = date.split("-")[2];
        month = date.split("-")[1];
        if(day.startsWith("0"))
           day = day.substring(1);
        if(month.startsWith("0"))
           month = month.substring(1);
        var year = date.split("-")[0];
        timeStamp = Date.parse(year + '/' + (month) + '/' + day);
        flows[i] = [flowData[i].latitude,flowData[i].longitude,timeStamp,flowData[i].count]; 
    }
    console.log("END");
    ouData.flows = flows;
    return ouData;
}



//Demo OFDados
function getFirstFlows(args){
    console.log("IN method");
    request.open("GET", "http://127.0.0.1:9000/first", false);
    request.send(null);
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
    console.log(returnData);
    var flowData = eval(Data.points);
    var flows =[];
    var ouData = {"flows":flows, "max_count": Data.max_count, "min_count": Data.min_countm};
    for(var i=0, len=flowData.length ; i < len ; i++){
        var date;
        var day;
        var month;
        var timeStamp;
        date = flowData[i].date;
        day = date.split("-")[2];
        month = date.split("-")[1];
        if(day.startsWith("0"))
           day = day.substring(1);
        if(month.startsWith("0"))
           month = month.substring(1);
        var year = date.split("-")[0];
        timeStamp = Date.parse(year + '/' + (month) + '/' + day);
        flows[i] = [flowData[i].latitude,flowData[i].longitude,timeStamp,flowData[i].count]; 
    }
    ouData.flows = flows;
    return ouData;
}

function getAllDataAg(){
    console.log("IN method");
    request.open("GET", "http://127.0.0.1:9000/alldata", false);
    request.send(null);
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
    
    var flowData = eval(Data.points);
    var flows =[];
    var ouData = {"flows":flows, "max_count": Data.max_count, "min_count": Data.min_countm};
    for(var i=0, len=flowData.length ; i < len ; i++){
        var p = new google.maps.LatLng(parseFloat(flowData[i].latitude),parseFloat(flowData[i].longitude));
        var count = parseInt(flowData[i].count);
        flows.push({location:p,weight:count});
        
    }
    return flows;
}


function getTotals(){
    
    request.open("GET", "http://127.0.0.1:9000/totals", false);
    request.send(null);
    var returnData = request.responseText;
    //console.log("Tot Data:" + returnData);
    var Data = eval('(' + returnData + ')');
    
    return Data.total;
}

function getTotalCars(){
    
    request.open("GET", "http://127.0.0.1:9000/total_cars", false);
    request.send(null);
    var returnData = request.responseText;
    //console.log("Tot Data:" + returnData);
    var Data = eval('(' + returnData + ')');
    
    return Data.total;
}
function getTotalVans(){
    
    request.open("GET", "http://127.0.0.1:9000/total_vans", false);
    request.send(null);
    var returnData = request.responseText;
    //console.log("Tot Data:" + returnData);
    var Data = eval('(' + returnData + ')');
    
    return Data.total;
}
function getTotalTwoWheelers(){
    
    request.open("GET", "http://127.0.0.1:9000/total_two_wheelers", false);
    request.send(null);
    var returnData = request.responseText;
    //console.log("Tot Data:" + returnData);
    var Data = eval('(' + returnData + ')');
    
    return Data.total;
}
function getTotalSemiTrucks(){
    
    request.open("GET", "http://127.0.0.1:9000/total_semi_trucks", false);
    request.send(null);
    var returnData = request.responseText;
    //console.log("Tot Data:" + returnData);
    var Data = eval('(' + returnData + ')');
    
    return Data.total;
}
function getTotalTrucks(){
    
    request.open("GET", "http://127.0.0.1:9000/total_trucks", false);
    request.send(null);
    var returnData = request.responseText;
    //console.log("Tot Data:" + returnData);
    var Data = eval('(' + returnData + ')');
    
    return Data.total;
}



function getVehiclesCount(args){
    request.open("GET", "http://127.0.0.1:9000/vehicles"+args, false);
    request.send(null);
    var returnData = request.responseText;
    //console.log(returnData);
    var Data = eval('(' + returnData + ')');
    var periodData = eval(Data.period_data);
    var outData = {"vehicle":['x','Carros','Motociclos','Carrinhas','Semi-Trailers','Cameões'],
                    "numberOfPasses":['Passagens',0,0,0,0,0], "colors":[],
                   "max_count":parseInt(Data.max_count),"min_count":parseInt(Data.min_count)};
   
    for(var i = 0; i < periodData.length; i++){
        var idx = 0;
        switch(periodData[i].name){
            
            case "Car":
                idx = 1;
            break;
            case "Two-wheelers":
                idx = 2;
            break;
            case "Vans":
                idx = 3;
            break;
            case "Semi-Truck":
                idx = 4;
            break;
            case "Trucks":
                idx = 5;
            break;
        }
        if(idx !== 0){
            outData.numberOfPasses[idx]=(periodData[i].value);
            outData.colors[idx-1]=('#3cdbc0');
        }
    }
    return outData;
    }
    
 function getDirectionsCount(args){
    request.open("GET", "http://127.0.0.1:9000/direction", false);
    request.send(null);
    var returnData = request.responseText;
    //console.log(returnData);
    var Data = eval('(' + returnData + ')');
    var periodData = eval(Data.period_data);
    var outData = {"direction":['x','A chegar','A Partir'],
                    "numberOfPasses":['Passagens',0,0], "colors":[],
                   "max_count":parseInt(Data.max_count),"min_count":parseInt(Data.min_count)};
   
    for(var i = 0; i < periodData.length; i++){
        var idx = 0;
        switch(periodData[i].name){
            
            case "Arriving":
                idx = 1;
            break;
            case "Departing":
                idx = 2;
            break;
        }
        if(idx !== 0){
            outData.numberOfPasses[idx]=(periodData[i].value);
            outData.colors[idx-1]=('#3cdbc0');
        }
    }
    return outData;
 }
 
 function getStreetsCount(args){
    request.open("GET", "http://127.0.0.1:9000/streets"+args, false);
    request.send(null);
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
    var countryData = eval(Data.streets_data);
    var outData = {"countries":['x'],
                    "numberOfRoamers":['Passagens'], "colors":[],"allDataCountries":[],"allDataCounts":[],
                   "max_count":parseInt(Data.max_count),"min_count":parseInt(Data.min_count),"total_count":0};
    var othersCount=0;
    var t_count = 0;
    var num_count = 0;
    for(var i = 0; i < countryData.length; i++){
        if(num_count < 7 ){
            num_count++;
            outData.countries.push(countryData[i].name.trim());
            outData.numberOfRoamers.push(countryData[i].value);
            outData.colors.push('#3cdbc0');
        }
        outData.allDataCountries.push(countryData[i].name.trim());
        outData.allDataCounts.push(countryData[i].value);
        t_count += parseInt(countryData[i].value);
    }
    outData.total_count = t_count;
    
    return outData;
 }
 
  function getSpeedsCount(args){
    request.open("GET", "http://127.0.0.1:9000/speed"+args, false);
    request.send(null);
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
    var countryData = eval(Data.speed_data);
    var outData = {"towns":['x'],
                    "numberOfRoamers":['Passagens'], "colors":[],"allDataTowns":[],"allDataCounts":[],
                   "max_count":parseInt(Data.max_count),"min_count":parseInt(Data.min_count),"total_count":0};
    var othersCount=0;
    var t_count = 0;
    var num_count = 0;
    for(var i = 0; i < countryData.length; i++){
        if(num_count < 7 ){
            num_count++;
            outData.towns.push(countryData[i].name.trim());
            outData.numberOfRoamers.push(countryData[i].value);
            outData.colors.push('#3cdbc0');
        }
        outData.allDataTowns.push(countryData[i].name.trim());
        outData.allDataCounts.push(countryData[i].value);
        t_count += parseInt(countryData[i].value);
    }
    outData.total_count = t_count;
    
    return outData;
 }
 function getConters(){
    request.open("GET", "http://127.0.0.1:9000/conters", false);
    request.send(null);
    var returnData = request.responseText;
    var Data = eval('(' + returnData + ')');
   
    var latLon = [];
    for(var i = 0; i < Data.counters.length; i++){
        
        var splits = Data.counters[i][0].split(",");
        
        latLon.push({lat:parseFloat(splits[0].substring(1)),lon:parseFloat(splits[1].substring(0,(splits[1].length -1)))});
    }
    console.log(latLon);
    return latLon;
 }