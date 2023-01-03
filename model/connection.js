const mysql = require('mysql');

class Connection {
    configToMySql = {
        host     : 'localhost',
        user     : 'root',
        password : '123456',
        database : 'quanlybanhang',
        charset  : 'utf8_general_ci',
    };
    getConnection() {
        return mysql.createConnection(this.configToMySql)
    }

    connecting() {
        this.getConnection().connect((err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('Successful connection')
            }
        });
    }
}

module.exports = new Connection();