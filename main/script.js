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
    return sort;
}
setInterval(() => {
    console.log(dbundle._ot009);
    let dat = finalRequest();
    dat.then((data) => {
        let els = [];
        let tester = Object.values(data)[0];
        console.log(tester);
        // Object.keys(tester).map((key, index) => {
        // });
        for(let i = 0; i < tester.length; i++) {
            const nel = document.createElement("div");
            const pid = document.createElement("p");
            const pstop = document.createElement("p");
            const ptime = document.createElement("p");
            pid.innerText = tester[i].trainId;
            pstop.innerText = tester[i].stop_name;
            ptime.innerText = tester[i].arrival;

            nel.className = "card"; nel.id = "card";
            pid.className = "pid"; 
            pstop.className = "stop"; 
            ptime.className = "time";

            nel.appendChild(pid); 
            nel.appendChild(pstop); 
            nel.appendChild(ptime);

            els.push(nel);
        }
        // console.log(els);
        let uniques = [...new Set(els)];
        for(let i = 0; i < uniques.length; i++) {
            maintab.appendChild(uniques[i]);
        }
    });
    let i_d = document.getElementById("card");
    // let uniques = [...new Set(els)];

}, 15000);