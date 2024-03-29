import "./data.js";

mapboxgl.accessToken = "";
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

const toMainHtml = (data, count) => {
    return `<div class="trip-general t${count.toString()}t" id="card">
                <p class="pid t${count.toString()}p">${data[0].trainId}</p>
                <p class="stop t${count.toString()}s">${data[0].stop_name} -> ${data[data.length-1].stop_name}</p>
            </div>`
}

let fcall = finalRequest();
let counter = 0;
fcall.then((data) => {
    let len = Object.keys(data).length;
    Object.keys(data).map((key, index) => {
        maintab.innerHTML += toMainHtml(data[key], counter);
        counter++;
        const divider = document.createElement("div");
        divider.className = "divide";
        maintab.appendChild(divider);
    });
    viewTrip(data);
});

const trip = document.getElementById("detail-view");
const btn = document.getElementById("toclose");
trip.style.backgroundColor = `rgb(${1+Math.random()*255}, ${1+Math.random()*255}, ${1+Math.random()*255})`;
trip.style.visibility = 'hidden';

let obj = {
    clickedId: '',
    get selectedId() {
        return this.clickedId;
    },
    set cid(toID) {
        return this.clickedId = toID;
    }
}

function viewTrip(data) {
    var pids = [...document.querySelectorAll(".pid")];
    pids.forEach((pid) => {
        pid.addEventListener("click", (event) => {
            trip.style.visibility = 'visible';
            trip.style.left = "70%";
            trip.style.transition = "1.2s ease";

            obj.cid = pid.textContent;

            Object.keys(data).map((key,index) => {
                if(obj.clickedId != '' && key == obj.clickedId) {
                    for(let i = 0; i < data[obj.clickedId].length; i++) {
                        const newCard = document.createElement('div');
                        const pid = document.createElement('p');
                        const pstop = document.createElement('p');
                        const ptime = document.createElement('p');

                        pid.innerText = obj.clickedId;
                        pstop.innerText = data[obj.clickedId][i].stop_name;
                        ptime.innerText = data[obj.clickedId][i].arrival;

                        pid.className = "pid"; pstop.className = "stop"; ptime.className = "a-time";

                        newCard.appendChild(pid);
                        newCard.appendChild(pstop);
                        newCard.appendChild(ptime);

                        newCard.className = "card-holder";

                        trip.appendChild(newCard);

                    }
                }
            })

            btn.onclick = function() {
                let allCards = document.querySelectorAll(".card-holder");
                allCards.forEach(card => trip.removeChild(card));

                trip.style.left = "150%";
                trip.style.transition = '2s ease';
                trip.style.visibility = 'hidden';
            }
        })
    });
}

setInterval(() => {
    let ncall = finalRequest();
    let currentCount = 0;
    ncall.then((data) => {
        // console.log(data[obj.clickedId]);
        Object.keys(data).map((key, index) => {
            let cpid = document.querySelector(`.t${currentCount.toString()}p`);
            let cstop = document.querySelector(`.t${currentCount.toString()}s`);
            if(cpid != null && cstop != null) {
                cpid.innerText = data[key][0].trainId;
                cstop.innerText = data[key][0].stop_name + " -> " + data[key][data[key].length-1].stop_name;
            }

            let pids = document.querySelectorAll(".pid");
            let pstops = document.querySelectorAll(".stop");
            let ptimes = document.querySelectorAll(".a-time");
            let anotp = trip.children;
            if(obj.clickedId != '' && key == obj.clickedId) {
                console.log(data[obj.clickedId]);
                for(let i = 0; i < data[obj.clickedId].length; i++) {
                    pids[i].innerText = data[obj.clickedId][i].trainId;
                    pstops[i].innerText = data[obj.clickedId][i].stop_name;
                    ptimes[i].innerText = data[obj.clickedId][i].arrival;
                    if(data[obj.clickedId].length < (anotp.length-1)) {
                        trip.removeChild(anotp[1]);
                        pids[i].innerText = data[obj.clickedId][i].trainId;
                        pstops[i].innerText = data[obj.clickedId][i].stop_name;
                        ptimes[i].innerText = data[obj.clickedId][i].arrival;
                        console.log("changes made???");
                    }
                }
                if(data[obj.clickedId] == undefined || data[obj.clickedId] == null) {
                    trip.removeChild(anotp[anotp.length-1]);
                    const doneCard = document.createElement("div");
                    doneCard.className = "error-end-card";
                    const doneMsg = document.createElement("p");
                    doneMsg.innerText = "Trip has ended";
                    doneCard.appendChild(doneMsg);
                    trip.appendChild(doneCard);
                } else {
                    console.log(data[obj.clickedId]);
                }
            }

            currentCount++;
        });
        // viewTrip(data);
    });

}, 15000);

//data.js is rendered by browserify
