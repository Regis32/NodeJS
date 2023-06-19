const express = require('express');
const bodyParser = require('body-parser');
const progammer = require('./database/tables/programmer');
const programmer = require('./database/tables/programmer');

const app =  express ();
const port = 5001;

app.use(bodyParser.json());

app.get('/syncDatabase', async(req, res) => {
  const database = require('./database/db');

 try {
    await database.sync();

  res.send('Database sycessfully sync');
  } catch (error) {
    res.send(error);
  }
});

app.post('/createProgrammer', async( req, res) => {

    try {
      const parames = req.body;

      const properties = ['name','javascript','java', 'python'];

      const check = properties.every((property) => {

        return property in parames;
      });
      
        if(!check) {
          const propStr = properties.join(', ');
          res.send(`All parameters needed to creat a programmer must be sent: ${propStr}`);
          return;
        }

        const newProgrammer = await progammer.create({
          name: parames.name,
          javascript: parames.javascript,
          java: parames.java,
          python: parames.python
        });
        
      res.send(newProgrammer);
    } catch (error){
      res.send(error);
    }
});


       app.get('/retrieveProgrammer', async (req, res) => {
       try  {
        const params = req.body;
       
            if ('id' in params) {
              
              const record = await progammer.findByPk(params.id);

              if (record) {
                res.send(record);
              } else{
                res.send('No programmer found using received ID');
              }
                return;
              }

              const records =  await progammer.findAll();

              res.send(records);
            } catch (error) {
              res.send(error);
            }
});


          app.put(`/UpdateProgrammer`, async(req, res) => {
            try {
              const params = req.body;

              if(!('id' in params)){
                res.send(`Missing 'id' in request body`);
                return;
              
              }
              const record = await progammer.findByPk(params.id);

              if(!record){
              
                res.sende(`Programmer ID not found.`);
                return;
              }

              const properties = ['name','python','java','javascript'];

              const cheeck = properties.some((property) => {
                return property in params;
              });

              if(!cheeck){
                const propStr = properties.join(',');
                res.send(`Resquest body doesn't have any the following properties: ${propStr}`);
                return;
              }

          record.name = params.name || record.name;
          record.python = params.python || record.python;
          record.java = params.java || record.java;
          record.javascript = params.javascript || record.javascript;

          await record.save();

          res.send(`${record.id} ${record.name} - Update successfully`);
        } catch(error){
          res.send(error);
        }
});

          app.delete(`/deleteProgrammer`, async (req, res) => {
            try {
              const params = req.body;

              if(!(`id` in params)) {
                res.send(`Missing 'id' in request body`);
                return;
              }
              
              const record = await programmer.findByPk(params.id);

              if(!record){
                res.send(`Programmer ID not found`);
                return;
              }
              
              await record.destroy();

              res.send(`${record.id} ${record.name} - Delete sucecessfully`);
            } catch(error) {
              res.send(error);
            }
});

app.listen(port, () => {
    console.log(`Now listenig on port ${port}`);
});