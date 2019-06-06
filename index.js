const express = require('express')
const app = express()
const port = 3001
const fileUrl = `https://storage.googleapis.com/exp-framework.appspot.com/orders.csv`
const axios = require('axios')

const es = require('event-stream');
const Transform  = require('stream').Transform;
var localStorage = [];

app.get('/load', (request, response) => {

    axios({
        method: 'get',
        url: fileUrl,
        responseType:'stream'
    }).then(res => {

       var transformData = new Transform({ decodeStrings: false });
       transformData._transform = (chunk, encoding, done) => {

            let header    = "email|order_id|item_id|price|action";
            let newHeader = "email_id,order_id,items,total\n";
            let delimiter = "|";
            
            // find and change table header
            if (chunk == header) {
                chunk = newHeader; 
                return done(null, chunk);
            } 
                              
            // create object from string data
            const objectFromStringData = (columns, chunkArr) => {

                let dataObject = {};
                for (let i = 0; i < columns.length; i++) dataObject[columns[i]] = chunkArr[i];
                return dataObject;
            }
            
            // create order from ordred items 
            const makeOutputLine = (items) => {

                let buff       = new Buffer.from(items[0].email);  
                let base64data = buff.toString('base64');
                let newOrder   = {email_id:base64data, order_id:items[0].order_id, items:[],total:0};

                for (let i = 0, leni = items.length; leni > i; i++) {

                   let item = items[i];
                   if (item.action == "refund") item.price = `-${item.price}`;
                   newOrder.total = Number(newOrder.total) + Number(item.price);
                   newOrder.items.push(item.item_id);
                }
                let commaSeparated = makeItCommaSeparated(newOrder);
                return commaSeparated;
            }
            
            // order object to comma separated line
            const makeItCommaSeparated = (order) => {
                
                let commaSeparated = [];
                Object.keys(order).forEach((key) => commaSeparated.push(order[key]));
                let string = JSON.stringify(commaSeparated);
                let noQuotes = string.replace(/"/g,'');
                return noQuotes.slice(1,-1)+'\n';
            }

            let chunkArr   = chunk.split(delimiter),
                columns    = header.split(delimiter);

            let dataObject = objectFromStringData(columns, chunkArr)

            // if no object in localStorage then add one straight away
            if (localStorage.length) {
                
                let lastOrderId = localStorage[localStorage.length - 1].order_id;

                // if new object has the same order_id as previous, continue build order items list in localStorage
                if (lastOrderId == dataObject.order_id) {

                   localStorage.push(dataObject);
                   return done();

                } else {
                    // new order item is from different order, send order chunk, empty localStorage and add item
                    let OrderArray = makeOutputLine(localStorage);
                    localStorage = [];
                    localStorage.push(dataObject);
                    return done(null, OrderArray);
                }
            }
            // push very first order item into localStorage
            localStorage.push(dataObject);
            return done();
       };
        
        res.data
            .pipe(es.split())
            .pipe(transformData)
            .pipe(response)

		/* DO NOT MODIFY BELOW */
    }).catch(err => console.log(err));
})
app.listen(port, () => console.log(`App listening on port http://localhost:${port}`))