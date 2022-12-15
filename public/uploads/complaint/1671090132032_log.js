var express = require('express')
var fs = require('fs')
var path = require('path')

let isLog = process.env.IS_LOG;

exports.logData = (reqData, resData, apipath,error) => {
    
    //var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    
    if(isLog=='1')
    {
        
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hours = date_ob.getHours();
        let minutes = date_ob.getMinutes();
        let todayDate= year + "-" + month + "-" + date + " " + hours + ":" + minutes;
        
         let data ='DateTime: '+todayDate+'\r\n';    
            data +='API Name: '+apipath+'\r\n';
            data +='Request Data: '+JSON.stringify(reqData)+'\r\n';
            //data +=JSON.stringify(reqData)
            // data +='\r\n';
            data +='Responce Data: '+JSON.stringify(resData)+'\r\n';
            //data +='Error: '+error+'\r\n';
            data += '----------------------------------------------------------------------------\r\n'
            data +='\r\n';
            
        fs.appendFile('access.txt', data, function (err) {
                if (err) throw err;
                
        });
    }
    
};
