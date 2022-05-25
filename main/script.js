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
        // callWhenReady(); //??????
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

function removeDivide() {
    let top = document.getElementById("placehold");
    let dividers = [...document.querySelectorAll(".divide")];
    let allChildren = [...maintab.children];
    allChildren.shift();
    
    let temp_indices = dividers.map((divider) => allChildren.indexOf(divider));
    const removeItem = (items, i) => items.slice(0, i-1).concat(items.slice(i, items.length));

    let init = removeItem(allChildren, temp_indices[0]+1);
    while(temp_indices.length != 0) {
        temp_indices.shift();
        temp_indices = temp_indices.map(val => val -= 1);
        init = removeItem(init, temp_indices[0]+1);
    }
    return init;
}

setInterval(() => {
    console.log(dbundle._ot009);
    let dat = finalRequest();
    dat.then((data) => {
        //const toHtml = data => data.map(({id, name, randomvalue}) => {
//   return `<div class="container">
//   <p class="id">${id}</p>
//   <p class="name">${name}</p>
//   <p class="randomval"> ${randomvalue} </p>
// </div>`

// }).join('')
        var na = [];
        let keyholder = [];

        Object.keys(data).map((key, index) => {
            let i_d = document.querySelectorAll("#card");
            let idtp = [...document.querySelectorAll(".pid")];
            let stoptp = document.getElementsByClassName("stop");
            let timetp = document.getElementsByClassName("time");

            let modArr = [];

            if(data[key].length < 10) {
                keyholder.push(data[key]);
                let count = 0;
                //data[key] = array of objects: [{...}, {...}]
                //data[key][i] = object of values {trainid, arrival, location, name}...
                //idtp is object.
                //looping looks like: [0,1][0,1,2,3][0,1,2]... because of every length of data[key] for every key can be different.
                //idtp[i] will not work because the querySelectorAll returns them all in one nodelist with a constant incremental.
                //  solution? -> convert idtp to a 2d array so ([pid.1, pid.2], [pid.3,pid.4,pid.5]...) so that the lengths of each data key corresponds to the lengths of each array of pids.

                //convert here
                for(let i = 0; i < data[key].length; i++) {
                    modArr.push(i);
                }
                modArr.push("Q"); //extra end value for functionality

                let index = modArr.indexOf(0);
                for(let i = 0; i < countOccur(modArr, 0); i++) {
                    na.push(modArr.slice(index, modArr.indexOf(0,index+1)));
                    index = modArr.indexOf(0, index+1);
                }
                //start changing text content
                let idsToFill = spliceArray(idtp, na);
                // console.log(idsToFill)
                //na = [[0,1],[0,1,2,3],[0,1,2]...]
                //keyholder= [ [{}, {}], [{}, {}, {}, {}], [{}, {}, {]}] ...]
                console.log(keyholder);
                for(let i = 0; i < idsToFill.length; i++) {
                    //
                }
                //


                let allnodes = removeDivide();
                let ttda = spliceArray(allnodes, na);

                let dividers = [...document.querySelectorAll(".divide")];
                let allChildren = [...maintab.children]; //or Array.from(maintab.children)
                allChildren.shift();
                let temp_indices = dividers.map((divider) => allChildren.indexOf(divider));
                let interval = allChildren.slice(0, temp_indices[0]); 
                if(na.length == temp_indices.length) {
                    for(let i = 0; i < temp_indices.length; i++) {
                        if(na[i].length < interval.length) {
                            // console.log("interval len: "+interval.length);
                            // console.log(interval[0]);
                            let el = interval[0];
                            let elInx = allChildren.indexOf(el);
                            allChildren.splice(elInx, 1);
                            // console.log();
                            maintab.removeChild(el);
                        }
                        interval = allChildren.slice(temp_indices[i]+1, temp_indices[i+1]);
                    }
                } else { //handle ending trips here
                    console.log(na.length + "       " + temp_indices.length);
                    if(na.length-1 == temp_indices.length) {
                        console.log(temp_indices);
                    }
                }
            }
        });
    });
}, 15000);
