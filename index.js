var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
var http = require('http');
var axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

console.log("from index.js");
console.log(process.env.MAPBOX);

let tgd = "";
//https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace
//https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw
//https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g
//https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs
//https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm
//https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz
// https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l
var requestSettings = {
  method: 'GET',
  url: 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw',
  headers: {
      'x-api-key': 'SPukOTiP7c5WMUbp0IVc5YPubN5CPI4jC78bRue0',
  },
  encoding: null
};
function convertFromPOSIX(unix_timestamp) {
  var date = new Date(unix_timestamp*1000);
  var hours = date.getHours();
  var mins = "0" + date.getMinutes();
  var sec = "0"+ date.getSeconds();
  var format = hours + ":" + mins.substring(-2) + ":" + sec.substring(-2);
  return format;
}
function getData(dataIds, dataLocs, dataNames) {
  request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      let arr = [];

      feed.entity.forEach((en) => {
        if(en.tripUpdate) {
          if(en.tripUpdate.trip.routeId == "Q") {
            if(en.tripUpdate.stopTimeUpdate != null) {
              for(let i = 0; i < en.tripUpdate.stopTimeUpdate.length; i++) {
                // console.log(en.tripUpdate.stopTimeUpdate[i].arrival);
                var datajson = {
                  'trainId': en.tripUpdate.trip.tripId,
                  'arrival': convertFromPOSIX(en.tripUpdate.stopTimeUpdate[i].arrival.time),
                  'stopId': dataIds.filter(function(id) {return id.includes(en.tripUpdate.stopTimeUpdate[i].stopId)}),
                  'stop_location': dataFilter(dataLocs, dataIds, en.tripUpdate.stopTimeUpdate[i].stopId),
                  'stop_name': dataFilter(dataNames, dataIds, en.tripUpdate.stopTimeUpdate[i].stopId),
                }
                var onet = Object.assign({}, datajson);
                arr.push(onet);
              }
              dataCB(arr);
            }
          }
        }
      });
    }
  });
}
async function dataCB(data) {
  const preq = await fetch("/stopsmk", {
    'method': 'POST',
    'headers': {
      'Access-Control-Allow-Origin': 'http://localhost:8080/',
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify(data, null, 2)
  });
}

async function mkRequests(path) {
  const req = await fetch(path, {
    'method': 'GET',
    'headers': {
      'Access-Control-Allow-Origin': 'http://localhost:8080/',
    },
  });
  if(req.ok) {
    console.log(path+ " request success");
  }
  return req;
}

function readStopsData() {
  var remaining = '';
  var ids = [], coords = [], names = [];

  const req = mkRequests("/stopsdump");
  return req.then(resp => resp.text()).then((data) => {
    remaining += data;
    var ix = remaining.indexOf('\n');
    while(ix > -1) {
      var line = remaining.slice(0,ix);
      remaining = remaining.substring(ix+1);
      
      ids.push(line.split(",,")[0]);
      names.push(line.split(",,")[1]);
      coords.push(line.split(",,")[2].split(","));
      ix = remaining.indexOf('\n');
    }
    getData(ids, coords, names);
  });
}

function dataFilter(data, ids, currentId) {
  let values = [];
  for(let i = 0; i < data.length; i++) {
    if(ids[i] == currentId) {
      values.push(data[i]);
    }
  }
  return values;
}

function _ot009() {
  console.log("from ot: running.");
  // console.log(process.env.MAPBOX_ACCESSTOKEN);
  return "from ot: returnd";
}
setInterval(readStopsData, 10000);

exports._ot009 = _ot009();
// module.exports = {
//   token: process.env.MAPBOX_ACCESSTOKEN,
// }