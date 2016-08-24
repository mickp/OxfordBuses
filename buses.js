var app_id = "2abd3053";
var app_key = "4b939ffdd7490c5052517ea1d00824d0";
var app_auth = "app_id=" + app_id + "&app_key=" + app_key;
var app_postscript = "&group=no"
var stops = ["340001111OPP", "340000005C1", "340000006R4", "34000000702", "340000864A3"];
var sample = '{"atcocode":"340001111OPP","smscode":"oxfadgwt","request_time":"2016-08-24T20:59:57+01:00","bearing":"NE","stop_name":"Elms Parade Shops","departures":{"all":[{"mode":"bus","line":"S1","line_name":"S1","direction":"Gloucester Green Bus Station (Oxford City Centre)","operator":"SCOX","aimed_departure_time":"21:01","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:01"},{"mode":"bus","line":"4","line_name":"4","direction":"Masons Road East (Wood Farm)","operator":"OXBC","aimed_departure_time":"21:04","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:04"},{"mode":"bus","line":"4A","line_name":"4A","direction":"Masons Road East (Wood Farm)","operator":"OXBC","aimed_departure_time":"21:24","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:24"},{"mode":"bus","line":"S1","line_name":"S1","direction":"Gloucester Green Bus Station (Oxford City Centre)","operator":"SCOX","aimed_departure_time":"21:31","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:31"},{"mode":"bus","line":"4A","line_name":"4A","direction":"Masons Road East (Wood Farm)","operator":"OXBC","aimed_departure_time":"21:44","dir":"inbound","date":"2016-08-24","source":"Traveline timetable (not a nextbuses live region)","best_departure_estimate":"21:44"}]}}'

$(document).ready(function(){
    var topdiv = $("#buses");
    $.each(stops, function(junk, stop){
      var url = "http://transportapi.com/v3/uk/bus/stop/" + stop + "/live.json?";
      //data = JSON.parse(sample);
      $.getJSON(url, app_auth + app_postscript, function(data) {
      //$.getJSON('sample.json', app_auth, function(data) {
        var stopdiv = $('<div class="bus_stop"></div>').attr({id: stop}).text(data.stop_name);
        var tab = $('<table></table>');
        $.each(data.departures.all, function(junk, dep){
          tab.append("<tr> <td>", dep.best_departure_estimate, "</td> <td>", dep.line, "</td></tr>")
        });
        stopdiv.append(tab);
        topdiv.append(stopdiv);
      });
    });
});