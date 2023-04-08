const express = require("express")
const app = express()


const cors = require("cors")


app.use(cors())

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

const { client } = require("./DBConnect");

app.listen(3000, () => {
  console.log("app listening on port 3000")
});


app.get("/", function(req, res) {
    res.send("It's working!")
});


app.post("/medicineDetails" , function(req , res) { 
    medid = 123456789//req.body.medid

    client.query('SELECT * from medicines where medid = $1' , [medid], (err, result) => {
      
        if(err){
            throw err;
        }
        else{
    
          res.send({sending_details : result})
    
    
        }
    
      })
});



app.post("/login", function(req, res) {

    const email = req.body.e
    const pwd = req.body.pwd

    console.log(email)


    var status = "fail"
    var role = 0;

    client.query('SELECT * from users where email = $1 and password = $2' , [email , pwd], (err, result) => {
        
        if(err){
            throw err;
        }
        else{

          console.log(result)

            if(result.rowCount === 1){
                status = "success";
                console.log("hey heree");
                role = result.rows[0].category;

            }

        }

        console.log(status);
        res.send({sending : status , role : role})

      })

    
});



      app.post("/signup" , function(req , res) { 

        console.log("hello")

        const email = req.body.email
        const password = req.body.password
        const mobile = req.body.mobile
        const name = req.body.name
        const role = parseInt(req.body.role)


        console.log(role)


        var status = "fail"
        var roleCheck = 0;
    
        client.query('SELECT * from users where email = $1 or mobile = $2' , [email , mobile], (err, result) => {
          
            if(err){
                throw err;
            }
            else{
        
              if(result.rowCount != 0){
                    status = "fail"
                    console.log("hey")
              }
              else{

                console.log("here")

                client.query('insert into users(name , password , mobile , email , category) values($1 , $2 , $3 , $4 , $5)' , [ name , password , mobile , email , role] , (err , result) => {

                    if(err){
                        throw err;
                    }

                    else{
                        
                            status = "success"
                            roleCheck = role
                            console.log(status)

                            console.log(status);
                            res.send({sending : status , role : roleCheck})
                        
                    }

                });

              }
              
        
            }
        
          })
    });



    app.post("/pharmacyDetails" , function(req , res) {

        const medid = 123456789//req.body.medid;

        var status = "none"


        client.query('SELECT * from pharmacy where pharmid in (select pharmid from availability where medid = $1) ' , [medid], (err, result) => {
          
            if(err){
                throw err;
            }
            else{
        
              if(result.rowCount != 0){
                  
                status = "yes"
              }
              

              console.log(status);
              res.send({sending : status , result : result.rows})
              
        
            }
        
          })

    });

    

    app.get("/doctors" , function(req , res) {



        client.query('SELECT * from doctors', (err, result) => {
          
            if(err){
                throw err;
            }
            else{
        
              res.send({result_data : result})
              
        
            }
        
          })


        



    });



    app.post("/manufacturer/addMed" , function(req , res){

      const name = req.body.name
      const exp = req.body.exp
      const date = req.body.date
      const medid = req.body.medid
      const mrp = req.body.mrp

      var status = "fail";

      client.query('SELECT * FROM medicines where medid = $1' , [medid] , (err , result) => {

        if(err){
          throw err;
        }


        else{

          if(result.rowCount === 0){

            client.query('INSERT INTO medicines VALUES($1 , $2 , $3 , $4 , $5)', [medid , name , exp , date , mrp], (err, result) => {
          
              if(err){
                  throw err;
              }
              else{
      
                status = "success"
                console.log(status)
                res.send({sending : status})
                
          
              }
          
            })

          }

          else{
            status = "already"
            console.log(status)
            res.send({sending : status})
          }

        }

      });

    });


    app.post("/retailer/addRetail" , function(req , res) {


      const name = req.body.name
      const id = req.body.id
      const loc = req.body.loc

      var status = "fail"

      client.query("SELECT * from pharmacy where name = $1" , [name] , (err , result) => {

        if(err){
          throw err;
        }
        else{
          if(result.rowCount === 0){

              client.query("INSERT INTO pharmacy(name , pincode) values($1 , $2)" , [name , loc] , (err , result) => {

                if(err){
                  throw err;
                }
                else{
                    status = "Added new retailer"
                    res.send({sending : status})

                }

              });

          }
          else{
                    status = "Already added"
                    res.send({sending : status})
          }


        }

      });

    });


    app.post("/retailer/addAvail" , function(req , res) {


      const name = req.body.name
      const id = req.body.id

      var status = "fail"

      client.query("INSERT into availability values($1 , $2)", [name , id] , (err , result) => {


        if(err){
          throw err;
        }

        else{
          status = "added";
          res.send({sending : status})

        }

      })


    });