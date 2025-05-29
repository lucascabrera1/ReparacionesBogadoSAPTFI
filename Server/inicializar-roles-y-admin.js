
//agregar roles
db.roles.insertMany ([
    {
        "nombre": "Encargado de Compras",
        "descripcion":"Puede gestionar ordenes de Compras"
    },
    {
        "nombre": "Encargado de Ventas",
        "descripcion":"Puede gestionar las ventas"
    },
    {
        "nombre": "Encargado de Depósito",
        "descripcion":"Corrobora la mercaderia recibida con la mercadería encargada"
    },
    {
        "nombre" : "admin",
        "descripcion" : "gestiona los usuarios del sistema"
    },
])


db.users.insert({
    "nombreUsuario" : "Admin", 
    "email" : "admin@admin.com", 
    "password" : "$2a$04$j5AVBcNR24igf8bTjg9EEuqZ83YQc/0tuNY3WuWQc9MvOEXNPOkJq", 
    "roles" : [db.roles.find({nombre : "admin"})[0]._id]
})
