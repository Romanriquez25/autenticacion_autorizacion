const poolConfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'Clow2508!',
    database: 'softjobs',
    allowExitOnIdle: true
};

let pool;

import('pg').then(pg => {
    pool = new pg.default.Pool(poolConfig);
});

const getUsuarios = async (req, res) => {
    const response = await pool.query('SELECT * FROM usuarios');
    res.status(200).json(response.rows);

};
const registrarUsuario = async (userData) => {
    const query = `
        INSERT INTO usuarios (email, password, rol, lenguaje)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`;

    const values = [userData.email, userData.password, userData.rol, userData.lenguage];

    try {
        const result = await pool.query(query, values);
        return result.rows[0]; // Devuelve el usuario recién registrado
    } catch (error) {
        throw error; // Captura y relanza cualquier error
    }
};

const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount)
    throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }
    }
    


export { getUsuarios,registrarUsuario,verificarCredenciales };