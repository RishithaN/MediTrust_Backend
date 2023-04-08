const { Client } = require("pg")
const dotenv = require("dotenv")
dotenv.config()
 

const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
})


client.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('PostgresSQL DB connected');
	}
});

module.exports = { client };