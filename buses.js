var app_id = "2abd3053";
var app_key = "4b939ffdd7490c5052517ea1d00824d0";
var app_auth = "app_id=" + app_id + "&app_key=" + app_key;
var app_postscript = "&group=no"

var stops = {};
stops['from town'] = ["340000005C1", "34000000702", "340000864A3"];
stops['to town'] = ["340001111OPP", "340001812CHP"];
stops['to pool'] = ["340001812WWC"]
stops['from pool'] = ['340000710BRO', '340001098OPL']
stops['14'] = ['340000006R4']

var sample = '{"atcocode":"340001111OPP","smscode":"oxfadgwt","request_time":"2016-08-24T20:59:57+01:00","bearing":"NE","stop_name":"Elms Parade Shops","departures":{"all":[{"mode":"bus","line":"S1","line_name":"S1","direction":"Gloucester Green Bus Station (Oxford City Centre)","operator":"SCOX","aimed_departure_time":"21:01","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:01"},{"mode":"bus","line":"4","line_name":"4","direction":"Masons Road East (Wood Farm)","operator":"OXBC","aimed_departure_time":"21:04","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:04"},{"mode":"bus","line":"4A","line_name":"4A","direction":"Masons Road East (Wood Farm)","operator":"OXBC","aimed_departure_time":"21:24","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:24"},{"mode":"bus","line":"S1","line_name":"S1","direction":"Gloucester Green Bus Station (Oxford City Centre)","operator":"SCOX","aimed_departure_time":"21:31","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:31"},{"mode":"bus","line":"4A","line_name":"4A","direction":"Masons Road East (Wood Farm)","operator":"OXBC","aimed_departure_time":"21:44","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:44"}]}}'
var allData = [];

function timeToNum (str) {
  return Number(str.replace(":", "."));
};


$(document).ready(function(){
  buttondiv = $('#buttons');
  $.each(stops, function(key) {
    button = $('<button>')
    button.html(key);
    button.click(function(){fetchBusData(stops[key])});
    buttondiv.append(button);
  });
  var topdiv = $("#buses");
  topdiv[0].innerHTML = "";
  var tab = $('<table></table>');
  tab.append(["<tr>",
                "<td>--:--</td>",
                "<td>---</td>",
                "<td>Select a route to fetch data.</td>",
              "</tr>",
              "<tr>",
                "<td>--:--</td>",
                "<td>---</td>",
                "<td></td>",
              "</tr>"].join('\n'));
  topdiv.append(tab);
});


function updateDisplay() {
  var topdiv = $("#buses");
  topdiv[0].innerHTML = "";
  var tab = $('<table></table>');
  var departures = [];
  var curHour = new Date().getHours()
  $.each(allData, function(junk, data) {
    $.each(data.departures.all, function(junk, dep){
      if (timeToNum(dep.best_departure_estimate) - curHour > -1) {
        departures.push({time: dep.best_departure_estimate, 
                         line: dep.line,
                         stop: data.stop_name});
      }
    });
  });
  departures.sort(function(a, b){ return timeToNum(a.time) - timeToNum(b.time) });
  $.each(departures, function(junk, dep) {
    tab.append(["<tr>",
                  "<td>" + dep.time + "</td>",
                  "<td>" + dep.line + "</td>",
                  "<td>" + dep.stop + "</td>",
               "</tr>"].join('\n'));
    topdiv.append(tab);
  });
};


function fetchBusData(stops) {
    $('#buses')[0].innerHTML = '';
    allData = [];
    $.each(stops, function(junk, stop) {
      var url = "http://transportapi.com/v3/uk/bus/stop/" + stop + "/live.json?";
      $.getJSON(url, app_auth + app_postscript, function(data) {
        allData.push(data);
        updateDisplay();
        });
    });
};