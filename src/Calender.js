const table = document.querySelector('table');
const monthNames = table.querySelector('#monthNames').querySelectorAll('th');
const months = [table.querySelector('#firstMonthRows'), table.querySelector('#secondMonthRows'), table.querySelector('#thirdMonthRows'), table.querySelector('#fourthMonthRows'), table.querySelector('#fifthMonthRows')]
const daysOfWeek = 7;
const rowsOfMonth = 5;
const date = new Date()
const popUp = require('./popUp.js');
const getNumberOfDaysInMonth = (thisYear, thisMonth) => 
{
    const date = new Date(thisYear, thisMonth, 0); 
    return date.getDate();
}
let getCurrentDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
document.querySelector('#next').addEventListener("click", ()=>{
    const date = getCurrentDate;
    let oldYear = Number(date.split("-")[2]);
    let oldMonth = Number(date.split("-")[1]);
    let oldDay = Number(date.split("-")[0]);
    oldDay = 1;
    if(oldMonth === 12)
    {
        oldYear += 1;
        oldMonth = 1;
    }
    else
    {
        oldMonth += 1;
    }
    getCurrentDate = `${oldDay}-${oldMonth}-${oldYear}`;
    fillCalender(oldYear, oldMonth);
})
document.querySelector('#previous').addEventListener("click", ()=>{
    const date = getCurrentDate;
    let oldYear = Number(date.split("-")[2]);
    let oldMonth = Number(date.split("-")[1]);
    let oldDay = Number(date.split("-")[0]);
    oldDay = 1;
    if(oldMonth <= 1)
    {
        oldYear -= 1;
        oldMonth = 12;
    }
    else
    {
        oldMonth -= 1;
    }
    getCurrentDate = `${oldDay}-${oldMonth}-${oldYear}`;
    fillCalender(oldYear, oldMonth);
})

const clearCalender = () => {
    for(let i = 0; i < 5; ++i)
    {
        for(let j = 1;j <= daysOfWeek; ++j)
        {
            const selectorDay = `.day${j}`;
            months[i].querySelector(selectorDay).innerHTML = "";
            months[i].querySelector(selectorDay).dataset.date = "";
        }
    }
}

const displayCurrentDate = (thisYear, thisMonth) => {
    const displayDate = `${thisMonth >= 10 ? thisMonth : `0${thisMonth}`}.${thisYear}`;
    const dateSpan = document.querySelector("#current-month");
    dateSpan.innerHTML = displayDate;
}

const clearOldAverageWakeUp = () => {
    const defaultMessage = "Keine Daten!!!";
    document.querySelector("#averageStandUps").querySelector("span").innerHTML = defaultMessage;
}

const clearOldAverageGoToSleep = () => {
    const defaultMessage = "Keine Daten!!!";
    document.querySelector("#averageSleeping").querySelector("span").innerHTML = defaultMessage;
}

const calculateAverageWakeUp = (thisYear, thisMonth) =>
{
    clearOldAverageWakeUp();
    const monthData = [];
    const utilities = require("./utilities.js");
    const fs = require(`fs`);
    for(let dayInMonth = 1; dayInMonth <= 31; ++dayInMonth)
    {
        const date = `${dayInMonth}-${thisMonth}-${thisYear}`
        
        if(utilities.checkIfEverythingExists(date))
        {
            const data = JSON.parse(fs.readFileSync(`./data/${date.split("-")[2]}/${date.split("-")[1]}/${date}.json`));
            monthData.push(data["aufgestanden"]);
        }
    }
    if(!monthData[0]) return;
    let hours = 0;
    let minutes = 0;
    const midnightH = 24;
    const latestSleepTime = 16;
    for(let i = 0; i < monthData.length; ++i)
    {
        let dataHours;
        let dataMinutes;
        dataHours = Number(monthData[i].split(":")[0]);
        dataMinutes = Number(monthData[i].split(":")[1]);
        if(dataHours > latestSleepTime && dataHours < midnightH)
        {
            dataHours -= midnightH;
        }
        if(dataHours < 0)
        {
            dataHours += midnightH;
        }
        hours += dataHours;
        minutes += dataMinutes;
    }
    for(let i = 0; minutes >= 60; minutes = minutes - 60)
    {
        hours += 1;
    }
    //convert them to decimal Time
    let decimalMinutes;
    let decimalHours;
    const minutesToHour = 60;
    if(minutes > 0) 
    {
        const calculatedDecimal = minutes / minutesToHour;
        decimalMinutes = calculatedDecimal; 
    }
    else {decimalMinutes = 0;}

    decimalHours = hours;
    //combine decimal Minutes + Hours for division
    const decimalTimeAndDivide = utilities.convertTimeToDecimalTime(`${hours}:${minutes}`) / monthData.length;
    const convertedTime = utilities.convertDecimalToTime(decimalTimeAndDivide);
    document.querySelector("#averageStandUps").querySelector("span").innerHTML = convertedTime;
}

const calculateAverageGoToSleep = (thisYear, thisMonth) =>
{
    clearOldAverageGoToSleep();
    const monthData = [];
    const utilities = require("./utilities.js");
    const fs = require(`fs`);
    for(let dayInMonth = 1; dayInMonth <= 31; ++dayInMonth)
    {
        const date = `${dayInMonth}-${thisMonth}-${thisYear}`
        
        if(utilities.checkIfEverythingExists(date))
        {
            const data = JSON.parse(fs.readFileSync(`./data/${date.split("-")[2]}/${date.split("-")[1]}/${date}.json`));
            monthData.push(data["schlafen gegangen"]);
        }
    }
    if(!monthData[0]) return;
    let hours = 0;
    let minutes = 0;
    const latestSleepTime = 16;
    const midnightH = 24;
    for(let i = 0; i < monthData.length; ++i)
    {
        let dataHours;
        let dataMinutes;
        dataHours = Number(monthData[i].split(":")[0]);
        dataMinutes = Number(monthData[i].split(":")[1]);
        if(dataHours > latestSleepTime && dataHours < midnightH)
        {
            dataHours -= midnightH;
        }
        if(dataHours < 0)
        {
            dataHours += midnightH;
        }
        hours += dataHours;
        minutes += dataMinutes;
    }
    for(let i = 0; minutes >= 60; minutes = minutes - 60)
    {
        hours += 1;
    }
    //combine decimal Minutes + Hours for division
    const decimalTimeAndDivide = utilities.convertTimeToDecimalTime(`${hours}:${minutes}`) / monthData.length;
    const convertedTime = utilities.convertDecimalToTime(decimalTimeAndDivide);
    document.querySelector("#averageSleeping").querySelector("span").innerHTML = convertedTime;
}

const fillCalender = (thisYear, thisMonth) => {
    clearCalender();
    displayCurrentDate(thisYear, thisMonth);
    calculateAverageWakeUp(thisYear, thisMonth);
    calculateAverageGoToSleep(thisYear, thisMonth);
    document.addEventListener("close Pop Up",
    e => {
        displayCurrentDate(thisYear, thisMonth);
        calculateAverageWakeUp(thisYear, thisMonth);
        calculateAverageGoToSleep(thisYear, thisMonth);
    })
    const dateForFirstDay = new Date(thisYear, thisMonth - 1, 1);
    let getDayOfFirstDay = dateForFirstDay.getDay();
    
    if(getDayOfFirstDay === 0)
    {
        getDayOfFirstDay = 7;
    }
    let displayedDays = 0;
    const numOfDays = getNumberOfDaysInMonth(thisYear, thisMonth);
    for(let i = 0; i < rowsOfMonth; ++i)
    {
        if(i === 0)
        {
            for(let j = getDayOfFirstDay; j <= daysOfWeek; ++j)
            {
                const selectorDay = `.day${j}`;
                months[i].querySelector(selectorDay).innerHTML = displayedDays + 1;
                months[i].querySelector(selectorDay).dataset.date = `${displayedDays + 1}-${thisMonth}-${thisYear}`;
                displayedDays++;
                if(displayedDays >= numOfDays) break;
            }
        }
        else
        {
            for(let j = 1; j <= daysOfWeek; ++j)
            {
                const selectorDay = `.day${j}`;
                months[i].querySelector(selectorDay).innerHTML = displayedDays + 1;
                months[i].querySelector(selectorDay).dataset.date = `${displayedDays + 1}-${thisMonth}-${thisYear}`;
                displayedDays++;
                if(displayedDays >= numOfDays) break;
            }
        }
    }

}
fillCalender(getCurrentDate.split("-")[2], getCurrentDate.split("-")[1]);
for(let i = 0; i < months.length; ++i)
{
    const days = months[i].querySelectorAll('td');
    for(let j = 0;j < days.length; ++j)
    {
        days[j].onclick = popUp.spawnPopUp;
    }
}