const express = require('express');
const mysql = require('mysql');
const app = express();

// Servir carpetas estáticas (css, img, js)
app.use("/css", express.static(__dirname + "/css"));
app.use("/img", express.static(__dirname + "/img"));
app.use("/js", express.static(__dirname + "/js"));

let conexion = mysql.createConnection({
    host: "localhost",
    database: "blass",
    user: "root",
    password: ""
});

conexion.connect(function(err) {
    if (err) {
        console.error("Error al conectar a MySQL:", err);
        return;
    }
    console.log("Conectado exitosamente a la base de datos MySQL (blass)");
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post("/validar", function(req, res) {
    const datos = req.body;
    console.log(datos);

    let dni = datos.dni;
    let nombres = datos.nombres;
    let celular = datos.celular;
    let correo = datos.correo;

    let registrar = "INSERT INTO info (dni, nombres, celular, correo) VALUES (?, ?, ?, ?)";
    
    conexion.query(registrar, [dni, nombres, celular, correo], function(error) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.send("<h3>Error: Ese DNI ya está registrado.</h3><a href='/'>Volver al formulario</a>");
            }
            console.error(error);
            return res.send("<h3>Ocurrió un error al guardar los datos.</h3><a href='/'>Volver</a>");
        } else {
            console.log("Datos almacenados correctamente");
            res.redirect("/");
        }
    });
});

app.get('/usuarios', (req, res) => {
    conexion.query("SELECT * FROM info", function(error, resultados) {
        if (error) {
            console.error(error);
            return res.send("Error al consultar los clientes");
        }
        res.json(resultados);
    });
});

app.listen(3001, () => {
    console.log("Servidor creado correctamente en http://localhost:3001");
});