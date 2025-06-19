import express from 'express';
import router from './Routes/index.js'
import {connect} from './Connection.js'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})

connect()

const app = express()
const port = process.env.PORT

//uses
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    //res.send("paso por la funcion app.use ****************************************")
    const originalJson = res.json.bind(res);
    function convertDatesToArgentina(obj) {
        if (Array.isArray(obj)) {
            console.log("detectoque es un array")
            return obj.map(convertDatesToArgentina);
        } else if (obj && typeof obj === 'object') {
            const result = {};
            for (const key in obj) {
                const value = obj[key];
                if (value instanceof Date) {
                // Convertimos al huso horario UTC−3
                    const argentinaDate = new Date(value.getTime() - (3 * 60 * 60 * 1000));
                    result[key] = argentinaDate.toISOString().replace('Z', '-03:00');
                //} else {
                //    result[key] = convertDatesToArgentina(value);
                } else {
                    result[key] = value;
                }
            }
            return result;
        }
        return obj;
    }

    res.json = (data) => {
        const converted = convertDatesToArgentina(data);
        return originalJson(converted);
    };

    console.log("paso por la funcion app.use *************************************")
    next()
})
app.use('/', router)
app.set('appName', 'Reparaciones Bogado')



app.use((req, res, next) => {
  const originalJson = res.json.bind(res);

  function convertDatesToArgentina(obj) {
    if (Array.isArray(obj)) {
      return obj.map(convertDatesToArgentina);
    } else if (obj && typeof obj === 'object') {
      const result = {};
      for (const key in obj) {
        const value = obj[key];
        if (value instanceof Date) {
          // Convertimos al huso horario UTC−3
          const argentinaDate = new Date(value.getTime() - (3 * 60 * 60 * 1000));
          result[key] = argentinaDate.toISOString().replace('Z', '-03:00');
        } else {
          result[key] = convertDatesToArgentina(value);
        }
      }
      return result;
    }
    return obj;
  }

  res.json = (data) => {
    const converted = convertDatesToArgentina(data);
    return originalJson(converted);
  };

  next();
});

app.listen(port, () =>{
    console.log(`aplicacion ${app.get('appName')} corriendo en localhost puerto ${port}`)
})

