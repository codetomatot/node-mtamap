import "./data.js";

mapboxgl.accessToken = 'pk.eyJ1IjoiYm9iLXVzZXIiLCJhIjoiY2tycDM0MjE4MGZsejJ1bXcwczNka3hnNSJ9.JlXSoboCjRDRyUaoHDeUSw';
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
let updated = false;
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
    var data = await freq.json();
    let sort = groupData(data, 'trainId');
    Object.keys(sort).map((key, index) => {
        // if(updated == true) {
            if(index == 0) {
                for(let i = 0; i < sort[key].length; i++) {
                    let temp_len = sort[key].length;
                    const nel = document.createElement("div");
                    const pid = document.createElement("p");
                    const pstop = document.createElement("p");
                    const ptime = document.createElement("p");
                    pid.innerText = sort[key][i].trainId;
                    pstop.innerText = sort[key][i].stop_name;
                    ptime.innerText = sort[key][i].arrival;
                    nel.className = "card"; pid.className = "pid"; pstop.className = "stop"; ptime.className = "time";
                    nel.appendChild(pid); nel.appendChild(pstop); nel.appendChild(ptime);
                    // if(sort[key].length <= temp_len) {
                        maintab.appendChild(nel);
                        setTimeout(() => {
                            nel.remove();
                        }, 5000)
                    // }
                }
            }
        // }
        // else {
        //     maintab.removeChild(nel);
        //     updated = false;
        // }
    });
    return data;
}
setInterval(() => {
    console.log(dbundle._ot009);
    // truncate();
    finalRequest();
}, 15000);