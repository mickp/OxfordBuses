var app_id = "2abd3053";
var app_key = "4b939ffdd7490c5052517ea1d00824d0";
var app_auth = "app_id=" + app_id + "&app_key=" + app_key;
var app_postscript = "&group=no"

function Route (stops=[], excludes=[]) {
  this.stops = stops;
  this.excludes = excludes;
};

var routes = {};
routes['from town'] = new Route(["34000000702", "340000864A3", "34000000008"]);
routes['to town'] = new Route(["340001111OPP", "340001812CHP"]);
routes['to pool'] = new Route(["340001812WWC"]);
routes['from pool'] = new Route(['340000710BRO', '340001098OPL'])
routes['to nursery'] = new Route(["340000005C1", "340000005C3", '340000006R4'], ["6", "13"]);

/*var sample = {"atcocode":"340001111OPP","smscode":"oxfadgwt","request_time":"2016-08-24T20:59:57+01:00","bearing":"NE","stop_name":"Elms Parade Shops","departures":{"all":[{"mode":"bus","line":"S1","line_name":"S1","direction":"Gloucester Green Bus Station (Oxford City Centre)","operator":"SCOX","aimed_departure_time":"21:01","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:01"},{"mode":"bus","line":"4","line_name":"4","direction":"Masons Road East (Wood Farm)","operator":"OXBC","aimed_departure_time":"21:04","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:04"},{"mode":"bus","line":"4A","line_name":"4A","direction":"Masons Road East (Wood Farm)","operator":"OXBC","aimed_departure_time":"21:24","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:24"},{"mode":"bus","line":"S1","line_name":"S1","direction":"Gloucester Green Bus Station (Oxford City Centre)","operator":"SCOX","aimed_departure_time":"21:31","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:31"},{"mode":"bus","line":"4A","line_name":"4A","direction":"Masons Road East (Wood Farm)","operator":"OXBC","aimed_departure_time":"21:44","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:44"}]}}*/
var fetchedData = [];

function timeToNum (str) {
  return Number(str.replace(":", "."));
}


$(document).ready(function(){
  buttondiv = $('#buttons');
  $.each(routes, function(key) {
    button = $('<button>');
    button.html(key);
    button.click(function(){fetchBusData(key)});
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
  $.each(fetchedData, function(junk, dep) {
  departures.push({time: dep.best_departure_estimate, 
                   line: dep.line,
                   stop: dep.stop});
  });
  departures.sort(function(a, b){ 
    t1 = timeToNum(a.time);
    t2 = timeToNum(b.time);
    if (t1 - curHour < 0) {t1 += 24;}
    if (t2 - curHour < 0) {t2 += 24;}
    return t1 - t2;
    });
  $.each(departures, function(junk, dep) {
    tab.append(["<tr>",
                  "<td>" + dep.time + "</td>",
                  "<td>" + dep.line + "</td>",
                  "<td>" + dep.stop + "</td>",
               "</tr>"].join('\n'));
    topdiv.append(tab);
  });
}


function fetchBusData(key) {
    $('#buses')[0].innerHTML = '';
    fetchedData = [];
    route = routes[key];
    rx = new RegExp(route.excludes.join('|'));
    $.each(route.stops, function(junk, stop) {
      var url = "http://transportapi.com/v3/uk/bus/stop/" + stop + "/live.json?";
      $.getJSON(url, app_auth + app_postscript, function(data) {
        $.each(data.departures.all, function(junk, departure) {
          if ((route.excludes && !rx.test(departure.line_name)) || route.excludes.length == 0) {
            departure.stop = data.stop_name;
            fetchedData.push(departure);
          }
        });
        updateDisplay();
      });
    });
}
