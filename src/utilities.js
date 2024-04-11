const fs = require("fs");
const pathFileExists = date => {
    //does data exist?
    if(fs.existsSync(`./data`))
    {
        //Was Year accessed before?
        if(fs.existsSync(`./data/${date.split("-")[2]}`))
        {
        //was Month accessed before?
            if(fs.existsSync(`./data/${date.split("-")[2]}/${date.split("-")[1]}`))
            {
                //yes
                //so we check for the File
                if(fs.existsSync(`./data/${date.split("-")[2]}/${date.split("-")[1]}/${date}.json`))
                {
                    return true;
                }
            }
        }
    }
    return false;
}

const convertTimeToDecimalTime = time => {
    const minutesToHour = 60;
    let hours = Number(time.split(":")[0]);
    let minutes = Number(time.split(":")[1]);
    minutes = minutes / minutesToHour;
    let combined = hours + minutes;
    if(minutes >= 0)
    {
        combined = Number(combined.toFixed(2));
    }
    return combined;
}

const convertDecimalToTime = time => {
    const minutesToHour = 60;
    const stringTime = JSON.stringify(time) 
    let hours = stringTime.split(".")[0]
    let minutes;
    if(time % 1 == 0) {
        minutes = 0;
    }
    else 
    {
        minutes = Number(`0.${stringTime.split(".")[1].split("\"")[0]}`);
        minutes = Math.trunc(minutes * minutesToHour);
    }
    if(hours < 10) hours = `0${Math.trunc(Number(hours))}`;
    const helpme = Number(minutes).toFixed(0)
    if(minutes < 10) minutes = `0${helpme}`;
    const combined = `${hours}:${minutes}`;
    return combined;
    
}

module.exports = {
    convertDecimalToTime: convertDecimalToTime,
    convertTimeToDecimalTime: convertTimeToDecimalTime,
    checkIfEverythingExists: pathFileExists
}