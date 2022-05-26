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
    let count = 0;
    dat.then((data) => {
        var na = [];
        let keyholder = [];

        Object.keys(data).map((key, index) => {
            let i_d = document.querySelectorAll("#card");
            let divides = document.querySelectorAll(".divider");
            let idtp = [...document.querySelectorAll(".pid")];
            let stoptp = document.getElementsByClassName("stop");
            let timetp = document.getElementsByClassName("time");

            let modArr = [];

            if(data[key].length < 10) {
                keyholder.push(data[key]);
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
                if(idsToFill.length === na.length) {
                    console.log(na);
                    console.log(idsToFill);
                    for(let i = 0; i < idsToFill.length; i++) {
                        if(idsToFill[i].length == na[i].length) {
                            console.log("idstofill[i] is same as na[i] in length");
                            // for(let j = 0; j < idsToFill[i].length; j++) {
                            //     // idsToFill[i][j].innerText = "new value : "+ data[key][i].trainId;
                            //     console.log(data[key]);
                            // }
                        } else if(na[i].length > idsToFill[i].length) {
                            console.log("na is grater than ids");
                            idsToFill = spliceArray(idtp, na);
                        }
                    }
                } else {
                    console.log("so far not good");
                }


                // let allnodes = removeDivide();
                // let ttda = spliceArray(allnodes, na);

                let dividers = [...document.querySelectorAll(".divide")];
                let allChildren = [...maintab.children];
                allChildren.shift();
                let temp_indices = dividers.map((divider) => allChildren.indexOf(divider));
                let interval = allChildren.slice(0, temp_indices[0]); 
                if(na.length == temp_indices.length) {
                    for(let i = 0; i < temp_indices.length; i++) {
                        if(na[i].length < interval.length) {
                            let el = interval[0];
                            let elInx = allChildren.indexOf(el);
                            allChildren.splice(elInx, 1);
                            maintab.removeChild(el);
                        }
                        if(na.length < temp_indices.length || na[i].length > interval.length) {
                            //find the index of the trip that is the same as the index of the interval??
                            temp_indices = dividers.map((divider) => allChildren.indexOf(divider));
                            console.log(temp_indices);
                            if(interval.length == 1 && na[i].length > interval.length) {
                                console.log(interval);
                            } else {
                                console.log("interval.length = "+interval.length);
                                console.log("na[i].length ??? = " + na[i].length);
                            }
                        }
                        interval = allChildren.slice(temp_indices[i]+1, temp_indices[i+1]);
                    }
                }

                count++;
            }
        });
    });
}, 15000);