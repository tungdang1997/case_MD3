const connection = require('../model/connection');
const fs = require('fs');
const qs = require('qs');
const productService = require("./productService");
connection.connecting();
let idUser = null;

class UserService {

    login(user, res) {
        let connect = connection.getConnection();
        connect.query(`SELECT *FROM users`, (err, results) => {
            if (err) {
                console.log(err);
            } else {
                if (user.name === 'admin' && user.password === 'admin') {
                    res.writeHead(301, {'location': '/admin'});
                    res.end();
                } else {
                    let check = false;
                    for (let i = 0; i < results.length; i++) {
                        if (user.name === results[i].name && user.password === results[i].password) {
                            check = true;
                            idUser = results[i].id;
                            res.writeHead(301, {'location': '/admin'});
                            res.end();
                        }
                    }
                    if (!check) {
                        fs.readFile('./views/user/login.html', "utf-8", (err, loginHtml) => {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            loginHtml = loginHtml.replace('{notification}', `<p style="text-align: center; background-color: white">Tài khoản hoặc Mật khẩu không đúng<br>Hãy nhập lại</p>`);
                            res.write(loginHtml);
                            res.end();
                        });
                    }
                }
            }
        });
    }

    // getIdUser(){
    //     return idUser;
    // }

    // getIdUser(id) {
    //     let connect = connection.getConnection();
    //     return new Promise((resolve, reject) => {
    //         const sql = `select *
    //                      from order.id
    //                      where idUser = ${id}
    //                      `
    //         connect.query(sql, (err, results) => {
    //             if (err) {
    //                 reject(err)
    //             }
    //             resolve(results)
    //             console.log(resolve)
    //         })
    //     })
    // }

    // findById(id) {
    //     let connet = Connection.getConnection();
    //     return new Promise((resolve, reject) => {
    //         conne.query(`SELECT * FROM user WHERE id = ${id}`,(err, user) => {
    //             if (err) {
    //                 reject(err)
    //             } else {
    //                 resolve(user)
    //             }
    //         })
    //     })
    // }

    register(newUser, res) {
        let connect = connection.getConnection();
        connect.query(`SELECT * FROM users`, function (err, results) {
            if (err) {
                console.log(err);
            } else {
                let check = false;
                for (let i = 0; i < results.length; i++) {
                    if (newUser.name === results[i].name) {
                        check = true;
                        fs.readFile('./views/user/signup.html', "utf-8", (err, registerHtml) => {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            registerHtml = registerHtml.replace('{notification}', `<p style="text-align: center; background-color: white">Tài khoản đã tồn tại<br>Hãy nhập lại</p>`);
                            res.write(registerHtml);
                            res.end();
                        });
                    }
                }
                if (!check) {
                    let connect = connection.getConnection();
                    connect.query(`INSERT INTO users(name, password)
                                                 values ("${newUser.name}",
                                                         "${newUser.password}")`, function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('Insert Data Success');
                            res.writeHead(301, {'location': '/login'});
                            res.end();
                        }
                    });
                }
            }
        });
    }

    findProductById(idP) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`select products.id, products.name, price
                                         from orderdetail
                                                  join products on idProduct = products.id
                                         where idProduct = ${idP}
                                         group by id`, (err, product) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(product);
                }
            });
        })
    }

    deleteProduct(id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(` delete
                                          from orderdetail
                                          where idProduct = ${id}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Delete Success !!!');
                    resolve(products);
                }
            });
        })
    }

    getTotalPrice(id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            const sql = `select SUM(orderdetail.quantity * price) as total from orderdetail join products p on p.id = orderdetail.idProduct where idOrder = ${id}`
            connect.query(sql, (err, total) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(total);
                }
            });
        })

    }

    buyProduct(idO) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update orderdetail set total.order = true where id = ${idO}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Buy Success !!!');
                    resolve(products);
                }
            });
        })
    }

    deleteCart(idO) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(` delete
                                          from orderdetail
                                          where idOrder = ${idO};
            delete
            from orders
            where id = ${idO}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Delete Success !!!');
                    resolve(products);
                }
            });
        })
    }

}

// new UserService().getIdUser()

module.exports = new UserService();