import "./data.js";

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
        // let tofind = "043300_Q..N";
        Object.keys(data).map((key, index) => {
            if(data[key].length < 10) {
                for(let i = 0; i < data[key].length; i++) {
                    const nel = document.createElement("div");
                    const pid = document.createElement("p");
                    const pstop = document.createElement("p");
                    const ptime = document.createElement("p");
                    pid.innerText = data[key][i].trainId;
                    pstop.innerText = data[key][i].stop_name;
                    ptime.innerText = data[key][i].arrival;

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
                const divider = document.createElement("div");
                divider.className = "divide";
                maintab.appendChild(divider);
            }
        });
    });
}
toStart_toRecover();

setInterval(() => {
    console.log(dbundle._ot009);
    let dat = finalRequest();
    dat.then((data) => {
        let objSize = Object.keys(data);
        console.log(data);
        Object.keys(data).map((key, index) => {
            let i_d = document.querySelectorAll("#card");
            let idtp = document.querySelectorAll(".pid");
            let stoptp = document.getElementsByClassName("stop");
            let timetp = document.getElementsByClassName("time");

            let arr = [];
            let modArr = [];

            if(data[key].length < 10) {
                //data[key] = array of objects: [{...}, {...}]
                //data[key][i] = object of values {trainid, arrival, location, name}...
                //idtp is object.
                //looping looks like: [0,1][0,1,2,3][0,1,2]... because of every length of data[key] for every key can be different.
                //idtp[i] will not work because the querySelectorAll returns them all in one nodelist with a constant incremental.
                //  solution? -> convert idtp to a 2d array so ([pid.1, pid.2], [pid.3,pid.4,pid.5]...) so that the lengths of each data key corresponds to the lengths of each array of pids.

                //convert here
                for(let j = 0; j < idtp.length; j++) {
                    arr.push(idtp[j]);
                }
                for(let i = 0; i < data[key].length; i++) {
                    //
                }
            }
        });
    });
}, 15000);