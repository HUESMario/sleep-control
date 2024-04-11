const fs = require("fs");
let currentDate = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;

const convertToNumber = (first, second) => {
    return Number(`${first}${second}`);
} 

const convertToTime = (hour, minutes) => {
    if(minutes < 10) minutes = `0${minutes}`;
    if(hour < 10) hour = `0${hour}`;
    return `${hour}:${minutes}`;
}

const save = data =>
{
    const popUp = document.querySelector("#popUp");
    const fileName = popUp.querySelector("#popUpDate").innerText.split(".").join("-");
    const utilities = require('./utilities.js');
    if(utilities.checkIfEverythingExists(fileName))
    {
        fs.writeFileSync(`./data/${fileName.split("-")[2]}/${fileName.split("-")[1]}/${fileName}.json`, JSON.stringify(data));
        closePopUp();
        return;
    }
    else
    {
        if(utilities.pathExisits(fileName))
        {
            fs.writeFileSync(`./data/${fileName.split("-")[1]}/${fileName.split("-")[2]}/${fileName}.json`, JSON.stringify(data));
            closePopUp();
            return;
        }
        else 
        {
            fs.mkdirSync(`./data/${fileName.split("-")[2]}`);
            fs.writeFileSync(`./data/${fileName.split("-")[1]}/${fileName.split("-")[2]}/${fileName}.json`, JSON.stringify(data));
            closePopUp();
            return;
        }
    }

}

const discard = () => {
    closePopUp();
} 

/**
 * get Data from chosen Date to display
 * @param {Object} date chosen Date 
 */
const getData = date => {
    const dateObj = {
        "day": date.split("-")[0],
        "month": date.split("-")[1],
        "year": date.split("-")[2]
    }
    let data = "Error";
    try {
    data = JSON.parse(fs.readFileSync(`./data/${dateObj.year}/${dateObj.month}/${dateObj.day}-${dateObj.month}-${dateObj.year}.json`));
    }
    catch(e)
    {
        alert("couldnt open your chosen Date.");
        console.log(e);
        console.log("Datei nicht verfügbar");
        console.log(`./data/${dateObj.year}/${dateObj.month}/${dateObj.day}-${dateObj.month}-${dateObj.year}.json`);
        return
    }

    return data;
}
/**
 * create a Line
 * @returns {Node} the Line
 */
const horizontalLine = () => {
    const hr = document.createElement("div")
    hr.id = "hr";
    return hr;
}
/**
 * create File for the chosen day
 * also checks if File exists cause Im lazy
 * @param {Object} date chosen Date
 */
const createFile = (date) => {
    const splitDate = date.split('-');
    const year = splitDate[2];
    const month = splitDate[1];
    const day = splitDate[0];
    const dummyData = {
        "schlafen gegangen": "00:00",
        "aufgestanden": "08:00",
        "schlafenszeit": "00:00",
        "muedigkeitsniveau": "mittel",
        "sportniveau": "mittel",
        "Herausforderung": ""
    }
    //if both exist do nothing
    if(fs.existsSync(`./data`))
    {
        if(fs.existsSync(`./data/${year}`))
        {
            if(fs.existsSync(`./data/${year}/${month}`))
            {
                if(fs.existsSync(`./data/${year}/${month}/${day}-${month}-${year}.json`))
                {
                    return;
                }    
            }
        }
    }
    //check if folder exists
    if(!fs.existsSync(`./data`))
    {
        fs.mkdirSync(`./data`);
    }
    if(!fs.existsSync(`./data/${year}`))
    {
        fs.mkdirSync(`./data/${year}`);
    }
    if(!fs.existsSync(`./data/${year}/${month}`))
    {
        fs.mkdirSync(`./data/${year}/${month}`);
    }
    //check if File exists.
    if(!fs.existsSync(`./data/${year}/${month}/${day}-${month}-${year}.json`))
    {
        fs.writeFileSync(`./data/${year}/${month}/${day}-${month}-${year}.json`, JSON.stringify(dummyData));
    }
}
/**
 * closes the open popUp
 */
const closePopUp = () => {
    const closeEvent = new Event("close Pop Up", {});
    document.dispatchEvent(closeEvent);
    document.querySelector('#popUp').remove();
} 

const calculateTime = (firstTime, secondTime) => {
    const firstTimeObj = {Hour: `${firstTime[0]}${firstTime[1]}`,
                       Minute: `${firstTime[3]}${firstTime[4]}`}
    const secondTimeObj = {Hour: `${secondTime[0]}${secondTime[1]}`,
                       Minute: `${secondTime[3]}${secondTime[4]}`}
    let resultTime = {Hour: 0,
                      Minute: 0};
    resultTime.Minute += Number(firstTimeObj.Minute);
    resultTime.Minute += Number(secondTimeObj.Minute);
    if(resultTime.Minute > 59)
    {
        for(let i = resultTime.Minute; i > 59; i -= 60)
        {
            resultTime.Hour += 1;
            resultTime.Minute = i - 60;
        }
    }
    resultTime.Hour += Number(firstTimeObj.Hour);
    resultTime.Hour += Number(secondTimeObj.Hour);
    resultTime.result = convertToTime(resultTime.Hour, resultTime.Minute);
    
    return resultTime.result;    
}
const computeTime = (goToSleep, wakeUp) =>
{
    let goToSleepH;
    goToSleepH = convertToNumber(goToSleep[0], goToSleep[1]);
    let goToSleepM;
    goToSleepM = convertToNumber(goToSleep[3], goToSleep[4]);
    let wakeUpH = convertToNumber(wakeUp[0], wakeUp[1])
    let wakeUpM = convertToNumber(wakeUp[3], wakeUp[4])
    if(wakeUpH < goToSleepH)
    {
        alert("You can't wake up before you go to sleep, Time Traveller.");
        document.querySelector("#goToSleepInp").value = "00:00";
        document.querySelector("#wakeUpInp").value = "08:00";
        document.querySelector("#sleepTimeP").querySelector("#sleepTimeSpan").innerText = "";
        return "00:00";
    }
    const midnight = convertToTime(24, 0)
    const midnightH = convertToNumber(midnight[0], midnight[1]);
    const midnightM = convertToNumber(midnight[3], midnight[4]);
    const latestSleepHour = 16;
    let sleepTime = "00:00";
    let offsetTime = "00:00";
    if(goToSleepH > latestSleepHour && goToSleepH < midnightH && wakeUpH < latestSleepHour)
    {
        let offsetHour = midnightH - goToSleepH;
        const minuteCalc = 60 - goToSleepM;
        if(minuteCalc > 0 ) offsetHour -= 1;
        offsetTime = `${offsetHour > 9 ? offsetHour : `0${offsetHour}`}:${minuteCalc > 9 ? minuteCalc : `0${minuteCalc}`}`;
        goToSleepH = midnightH;
        goToSleepM = midnightM;
    }
    if(offsetTime != "00:00")
    {
        sleepTime = calculateTime(offsetTime, wakeUp)
        return sleepTime;
    }
    let tempHour = wakeUpH - goToSleepH;
    wakeUpM = Number(wakeUpM);
    goToSleepM = Number(goToSleepM);
    let tempMinute;
    if(wakeUpM == 0) wakeUpM = 60;              //make 60 to calculate it right
    if(goToSleepM == 0) goToSleepM = 60;        //make 60 to calculate it right
    tempMinute = wakeUpM - goToSleepM;
    if(tempMinute < 0)
    {   
        tempMinute += 60;
        tempHour -= 1;
    }
    
    sleepTime = convertToTime(tempHour, tempMinute)
    return sleepTime;
}

/**
 * create pop Up for calender Date.
 * @param {Node} element 
 */
const spawnPopUp = element => {
    //collect Data ////////////////////
    currentDate = element.currentTarget.dataset.date;
    if(currentDate === "" || !currentDate) 
    {
        alert("select a Date");
        return;
    }
    createFile(currentDate);
    const data = getData(currentDate);
    const tempData = data;
    //create Pop Up ///////////////////////
    const popUp = document.createElement('div');
    popUp.id = "popUp";
    //create Date Text ////////////////////
    const datePara = document.createElement("p");
    datePara.id = "popUpDate";
    datePara.innerText = currentDate.split("-").join(".");
    //create close button /////////////////
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "X";
    closeBtn.id = "closeBtn";
    closeBtn.onclick = closePopUp;
    //create go to sleep input ////////////
    const goToSleepInp = document.createElement('input');
    goToSleepInp.type = "time";
    goToSleepInp.id = "goToSleepInp";
    goToSleepInp.value = data["schlafen gegangen"];
    //create wake up input ////////////////
    const wakeUpInp = document.createElement('input');
    wakeUpInp.type = "time";
    wakeUpInp.id = "wakeUpInp";
    wakeUpInp.value = data["aufgestanden"];
    //create Sleeptime paragraph since this will be computed //
    const sleepTime = document.createElement("p");
    sleepTime.id = "sleepTimeP";
    //create sleeptime ////////////////////
    const sleepTimeSpan = document.createElement("span");
    sleepTimeSpan.id = "sleepTimeSpan"
    //create sleeptime Description ////////
    const sleepTimeDesc = document.createElement("span")
    sleepTimeDesc.id = "sleepTimeDesc";
    sleepTimeDesc.innerText = "Berechnete Schlafenszeit: ";
    //create Labels ///////////////////////
    //go to sleep /////////////////////////
    const goToSleepLbl = document.createElement("label")
    goToSleepLbl.innerText = "schlafen gegangen: ";
    goToSleepLbl.htmlFor = "goToSleepInp";
    //wake up /////////////////////////////
    const wakeUpLbl = document.createElement("label");
    wakeUpLbl.innerText = "aufgestanden: ";
    wakeUpLbl.htmlFor = "wakeUpInp";
    //create Line, learn to read dumbass //
    const hr1 = horizontalLine();
    const hr2 = horizontalLine();
    //create containers to store inputs and labels in //
    const goToSleepDiv = document.createElement("div");
    goToSleepDiv.id = "goToSleepDiv";
    const wakeUpDiv = document.createElement("div");
    wakeUpDiv.id = "wakeUpDiv";
    //create 3 toggle tiredstate //////////
    //high Tired //////////////////////////
    const highTiredInput = document.createElement("input")
    highTiredInput.type = "radio";
    highTiredInput.id = "highTiredInput";
    highTiredInput.name = "muede";
    const highTiredLbl = document.createElement("label");
    highTiredLbl.htmlFor = "highTiredInput";
    highTiredLbl.innerText = "sehr";
    //medium Tired ////////////////////////
    const mediumTiredInput = document.createElement("input")
    mediumTiredInput.type = "radio";
    mediumTiredInput.id = "mediumTiredInput";
    mediumTiredInput.name = "muede";
    const mediumTiredLbl = document.createElement("label");
    mediumTiredLbl.htmlFor = "mediumTiredInput";
    mediumTiredLbl.innerText = "mittel";
    //low Tired ///////////////////////////
    const lowTiredInput = document.createElement("input");
    lowTiredInput.type = "radio";
    lowTiredInput.id = "lowTiredInput";
    lowTiredInput.name = "muede";
    const lowTiredLbl = document.createElement("label");
    lowTiredLbl.htmlFor = "lowTiredInput";
    lowTiredLbl.innerText = "wenig"; 
    //description for tiredstate //////////
    const tiredStateDesc = document.createElement("p");
    tiredStateDesc.innerText = "Müdigkeit:";
    //create container for tiredstate /////
    const tiredStateDiv = document.createElement("div");
    tiredStateDiv.id = "tiredStateContainer";
    //create 3 toggle sportstate //////////
    //much Sport //////////////////////////
    const highSportInput = document.createElement("input");
    highSportInput.type = "radio";
    highSportInput.id = "highSportInput";
    highSportInput.name = "sport";
    const highSportLbl = document.createElement("label");
    highSportLbl.htmlFor = "highSportInput";
    highSportLbl.innerText = "viel";
    //medium Sport ////////////////////////
    const mediumSportInput = document.createElement("input");
    mediumSportInput.type = "radio";
    mediumSportInput.id = "mediumSportInput";
    mediumSportInput.name = "sport";
    const mediumSportLbl = document.createElement("label");
    mediumSportLbl.htmlFor = "mediumSportInput";
    mediumSportLbl.innerText = "mittel";
    //low Sport ///////////////////////////
    const lowSportInput = document.createElement("input");
    lowSportInput.type = "radio";
    lowSportInput.id = "lowSportInput";
    lowSportInput.name = "sport";
    const lowSportLbl = document.createElement("label");
    lowSportLbl.htmlFor = "lowSportInput";
    lowSportLbl.innerText = "wenig"; 
    //description for sportstate //////////
    const sportStateDesc = document.createElement("p");
    sportStateDesc.innerText = "Wie Sportlich:";
    //create container for sportstate /////
    const sportStateDiv = document.createElement("div");
    sportStateDiv.id = "sportStateContainer";
    //create textarea for Challenges //////
    const challengeTexts = document.createElement("textarea");
    challengeTexts.id = "challenges";
    challengeTexts.spellcheck = false;
    //create save Button //////////////////
    const saveBtn = document.createElement("button");
    saveBtn.id = "save";
    saveBtn.innerText = "Speichern";
    saveBtn.addEventListener("click", function(){save(tempData)});
    //create discard Button ///////////////
    const discardBtn = document.createElement("button");
    discardBtn.id = "discard";
    discardBtn.innerText = "Verwerfen";
    discardBtn.onclick = discard;
    //compute data ////////////////////////
    goToSleepInp.value = data["schlafen gegangen"];
    wakeUpInp.value = data["aufgestanden"];
    switch(data["muedigkeitsniveau"]){
        case "sehr":
            highTiredInput.checked = "on";
            break;
        case "mittel":
            mediumTiredInput.checked = "on";
            break;
        case "wenig":
            lowTiredInput.checked = "on";
            break;
    }
    switch(data["sportniveau"]){
        case "sehr":
            highSportInput.checked = "on";
            break;
        case "mittel":
            mediumSportInput.checked = "on";
            break;
        case "wenig":
            lowSportInput.checked = "on";
            break;
    }
    challengeTexts.value = data["Herausforderung"];
    
    if(data["schlafenszeit"] === "00:00"){
        sleepTimeSpan.innerText = computeTime(data["schlafen gegangen"], data["aufgestanden"])
        tempData["schlafenszeit"] = sleepTimeSpan.innerText;
    }
    else
    {
        sleepTime.innerText = data["schlafenszeit"];
    }
    //save everything in tempData /////////
    goToSleepInp.addEventListener("focusout", e => {
        tempData["schlafen gegangen"] = e.target.value;
        sleepTimeSpan.innerText = computeTime(tempData["schlafen gegangen"], tempData["aufgestanden"])
        tempData["schlafenszeit"] = sleepTimeSpan.innerText;
    })
    wakeUpInp.addEventListener("focusout", e => {
        tempData["aufgestanden"] = e.target.value;
        sleepTimeSpan.innerText = computeTime(tempData["schlafen gegangen"], tempData["aufgestanden"])
        tempData["schlafenszeit"] = sleepTimeSpan.innerText;
    })
    tiredStateDiv.onclick = () => {;
        tempData["muedigkeitsniveau"] = document.querySelector('input[name="muede"]:checked').labels[0].innerText;
    }
    sportStateDiv.onclick = () => {;
        tempData["sportniveau"] = document.querySelector('input[name="sport"]:checked').labels[0].innerText;
    }
    challengeTexts.addEventListener("focusout", e => {
        tempData["Herausforderung"] = e.target.value;
    })
    //append states to containers /////////
    tiredStateDiv.appendChild(tiredStateDesc);
    tiredStateDiv.appendChild(lowTiredInput);
    tiredStateDiv.appendChild(lowTiredLbl);
    tiredStateDiv.appendChild(mediumTiredInput);
    tiredStateDiv.appendChild(mediumTiredLbl);
    tiredStateDiv.appendChild(highTiredInput);
    tiredStateDiv.appendChild(highTiredLbl);
    sportStateDiv.appendChild(sportStateDesc);
    sportStateDiv.appendChild(lowSportInput);
    sportStateDiv.appendChild(lowSportLbl);
    sportStateDiv.appendChild(mediumSportInput);
    sportStateDiv.appendChild(mediumSportLbl);
    sportStateDiv.appendChild(highSportInput);
    sportStateDiv.appendChild(highSportLbl);
    //append sleepTime desc to sleeptime p //
    sleepTime.prepend(sleepTimeDesc);
    sleepTime.append(sleepTimeSpan);
    //append lbl and inp to container ///// 
    goToSleepDiv.appendChild(goToSleepLbl);
    goToSleepDiv.appendChild(goToSleepInp);
    wakeUpDiv.appendChild(wakeUpLbl);
    wakeUpDiv.appendChild(wakeUpInp);
    //append everything to popUp window ///
    popUp.appendChild(datePara);
    popUp.appendChild(closeBtn);
    popUp.appendChild(hr1);
    popUp.appendChild(goToSleepDiv);
    popUp.appendChild(sleepTime);
    popUp.appendChild(wakeUpDiv);
    popUp.appendChild(tiredStateDiv);
    popUp.appendChild(sportStateDiv);
    popUp.appendChild(challengeTexts);
    popUp.appendChild(hr2);
    popUp.appendChild(saveBtn);
    popUp.appendChild(discardBtn);
    ////////////////////////////////////////////////////////////////
    // spawn Pop Up finally ///////////////
    document.querySelector('html').querySelector('body').appendChild(popUp);
}
module.exports = {
    spawnPopUp: spawnPopUp
}