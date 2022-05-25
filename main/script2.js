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
const toHtml = data => data.map(({trainId, stop_name, arrival}, count) => {
  return `<div class="card t${count.toString()}t" id="card">
            <p class="pid">${trainId}</p>
            <p class="stop">${stop_name}</p>
            <p class="time"> ${arrival} </p>
        </div>`
}).join('')

function toStart_toRecover() {
    let fcall = finalRequest();
    let counter = 0;
    fcall.then((data) => {
        Object.keys(data).map((key, index) => {
            if(data[key].length < 10) {
                maintab.innerHTML += toHtml(data[key], counter);
                counter++;
                const divider = document.createElement("div");
                divider.className = "divide";
                maintab.appendChild(divider);
            }
        });
    });
}
toStart_toRecover();

const countOccur = (arr, value) => {
    return arr.reduce((a, val) => (val === value ? a + 1 : a), 0);
}
function spliceArray(idtp, na) {
    let spliced = [];
    for(let j = 0; j < na.length; j++) {
        spliced.push(idtp.splice(0, na[j].length)); 
    }
    return spliced;
}

setInterval(() => {
    console.log(dbundle._ot009);
    let dat = finalRequest();
    let counter = 0;
    dat.then((data) => {
        Object.keys(data).map((key, index) => {
            //
        });
    });
}, 15000);
