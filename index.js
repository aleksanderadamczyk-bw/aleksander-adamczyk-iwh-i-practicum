const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.SERVICE_KEY;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get("/", async (req,res) => {
    const processors = "https://api.hubspot.com/crm/v3/objects/2-71313951?properties=name,base_clock_in_ghz,boost_clock_in_ghz,core_count,processor_model";
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(processors, { headers });
        const data = resp.data.results;
        console.log(data);
        res.render('processors', { title: 'Processors | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
})

// * Code for Route 1 goes here

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get("/update-cobj", async (req,res) => {
    recordId = req.query.recordId;
    const getProc = `https://api.hubspot.com/crm/v3/objects/2-71313951/${recordId}?properties=name,base_clock_in_ghz,boost_clock_in_ghz,core_count`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(getProc, { headers });
        const data = resp.data.properties;
        console.log(data);
        // res.json(data);
        res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum', data });      
    } catch (error) {
        console.error(error);
    }
})

// * Code for Route 2 goes here

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const update = {
        properties: {
            "base_clock_in_ghz": req.body.newValBaseClock,
            "core_count": req.body.newValCoreCount,
            "boost_clock_in_ghz": req.body.newValBoostClock,
            "name": req.body.newValName
        }
    }

    recordId = req.query.recordId;
    const updateProc = `https://api.hubspot.com/crm/v3/objects/2-71313951/${recordId}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateProc, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});

//Additional create flow

app.get("/create-cobj", async (req,res) => {
  res.render('create', { title: 'Create Custom Object Form | Integrating With HubSpot I Practicum'});      
})


app.post('/create-cobj', async (req, res) => {
    const createParams = {
        properties: {
            "base_clock_in_ghz": req.body.base_clock_in_ghz,
            "core_count": req.body.core_count,
            "boost_clock_in_ghz": req.body.boost_clock_in_ghz,
            "name": req.body.name, 
            "processor_model": req.body.newValProcModel
        }
    }

    recordId = req.query.recordId;
    const createProc = `https://api.hubspot.com/crm/v3/objects/2-71313951`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(createProc, createParams, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
// * Code for Route 3 goes here

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));