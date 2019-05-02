const express = require('express')
const app = express()
const port = 3000
const fileUrl = `https://storage.googleapis.com/exp-framework.appspot.com/orders.csv`
const axios = require('axios')

app.get('/load', (request, response) => {
    axios({
        method: 'get',
        url: fileUrl,
        responseType:'stream'
    }).then(res => {
        /* DO NOT MODIFY ABOVE */
        
        /* INSERT YOUR CODE HERE */
        res.data.pipe(response);

		/* DO NOT MODIFY BELOW */
    }).catch(err => console.log(err));
})

app.listen(port, () => console.log(`App listening on port http://localhost:${port}`))