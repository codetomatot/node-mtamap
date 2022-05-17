import "./data.js";
// import { token } from "./data.js";

mapboxgl.accessToken = "pk.eyJ1IjoiYm9iLXVzZXIiLCJhIjoiY2tycDM0MjE4MGZsejJ1bXcwczNka3hnNSJ9.JlXSoboCjRDRyUaoHDeUSw";
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10'
});

const groupData = (dtg, key) => {
    return dtg.reduce((result, co) => {
        ( result[co[key]] = result[co[key]] || []).push(co);
        return result;
    }, {});
}
const maintab = document.getElementById("side-display");
async function finalRequest() {
    const freq = await fetch("/stopsmk", 
        {
            'method': 'GET',
            'headers': {
                'Access-Control-Allow-Origin': 'http://localhost:8080/',
                'Content-Type': 'application/json',
            }
        }
    );
    if(freq.ok) {
        console.log("/stopsmk request success");
    }
    var data = await freq.json();
    let sort = groupData(data, 'trainId');
    return sort;
}

function toStart_toRecover() {
    let fcall = finalRequest();
    let counter = 0;
    fcall.then((data) => {
        let tester = Object.values(data)[0];
        console.log(tester);
        for(let i = 0; i < tester.length; i++) {
            const nel = document.createElement("div");
            const pid = document.createElement("p");
            const pstop = document.createElement("p");
            const ptime = document.createElement("p");
            pid.innerText = tester[i].trainId;
            pstop.innerText = tester[i].stop_name;
            ptime.innerText = tester[i].arrival;

            nel.className = "card t"+counter.toString()+"t"; nel.id = "card";
            pid.className = "pid";
            pstop.className = "stop";
            ptime.className = "time";

            nel.appendChild(pid); 
            nel.appendChild(pstop); 
            nel.appendChild(ptime);

            maintab.appendChild(nel);
            counter++;
        }
    });
}
toStart_toRecover();

setInterval(() => {
    console.log(dbundle._ot009);
    let dat = finalRequest();
    dat.then((data) => {
        let tester2 = Object.values(data)[0];
        // let tempid = tester2[0].trainId;

        for(let i = 0; i < tester2.length; i++) {
            console.log("current len: "+tester2.length);
            console.log(tester2);
            let i_d = document.getElementById("card");
            const idtp = document.getElementsByClassName("pid");
            const stoptp = document.getElementsByClassName("stop");
            const timetp = document.getElementsByClassName("time");


            idtp[i].innerText = tester2[i].trainId;
            stoptp[i].innerText = tester2[i].stop_name;
            timetp[i].innerText = tester2[i].arrival;
            console.log("changes made");
            if(tester2.length < (maintab.childElementCount-1)) {
                let toRm = document.querySelector(".t"+(tester2.length).toString()+"t");
                maintab.removeChild(toRm);
                console.log("[*]   extra removed");
            } else if(tester2.length > (maintab.childElementCount-1)) {
                toStart_toRecover();
                console.log("resetting...");
            }
            if((tester2.length == 1) || (idtp[i] == undefined || stoptp[i] == undefined || timetp[i] == undefined)) {
                maintab.removeChild(i_d);
                toStart_toRecover();
                console.log("supposedly reset");
            }
        }
    });

}, 15000);