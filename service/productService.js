const connection = require('../model/connection');
// const products = require("mysql/lib/protocol/packets/Field");
// const fs = require('fs');
// const qs = require('qs');

class ProductService {

    getCategory() {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query('select * from category', (err, category) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(category);
                }
            });
        })
    }

    getProducts() {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query('select * from products', (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            });
        })
    }

    add(product) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO products(name, price, quantity)
                         values ("${product.name}", ${product.price}, ${product.quantity})`;
            connect.query(sql, function (err) {
                if (err) {
                    reject(err);
                } else {
                    console.log('Insert Data Success');
                    resolve(product);
                }
            })
        });
    }

    findById(id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`select *
                                         from products
                                         where id = ${id}`, (err, product) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(product);
                }
            });
        })
    }

    delete(id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(` delete 
                                          from products
                                          where id = ${id}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Delete Success !!!');
                    resolve(products);
                }
            });
        })
    }

    quantityAfterBuy(quantity, id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update products
                                         set quantity = ${quantity}
                                         where id = ${id}`, (err, quantity) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Edit Success !!!');
                    resolve(quantity);
                }
            });
        })
    }

    edit(product, id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update products
                                         set name  = '${product.name}',
                                             price = ${product.price}
                                         where id = ${id}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Edit Success !!!');
                    resolve(products);
                }
            });
        })
    }

    findProductByName(nameP) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`select *
                                         from products
                                         where name = '${nameP}'`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Find Success !!!');
                    resolve(products);
                }
            });
        })
    }

    findProductByPrice(price1, price2) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`select *
                                         from products
                                         where price between ${price1} and ${price2}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Find Success !!!');
                    resolve(products);
                }
            });
        })
    }

    findProductByCategory(idC) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`select *
                                         from products
                                         where idCategory = ${idC}`, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Find Success !!!');
                    resolve(products);
                }
            });
        })
    }

    createOrder(idUser) {
        let connect = connection.getConnection();
        const sql = `INSERT INTO orders(idUser, status)
                     values (${idUser}, false)`;
        connect.query(sql, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Insert Data Success !!!');
            }
        })
    }

    //Người dùng đang đăng nhập đã có hóa đơn chưa?
    checkOrder(idU) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            const sql = `select *
                         from orders
                         where idUser = ${idU}
                           and status = false`  //Status = false : chưa thanh toán
            connect.query(sql, (err, results) => {
                if (err) {
                    reject(err);
                }
                if (results.length === 0) {
                    resolve(false) // false : Người dùng không có hóa đơn chưa thanh toán
                } else {
                    resolve(true);
                }
            })
        })
    }

    getIdOrder(idU) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            const sql = `select *
                         from orders
                         where idUser = ${idU}
                           and status = false`
            connect.query(sql, (err, results) => {
                if (err) {
                    reject(err)
                }
                resolve(results[0].id)
            })
        })
    }

    getQuantityP(id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            const sql = `select products.quantity
                         from products
                         where id = ${id}`
            connect.query(sql, (err, results) => {
                if (err) {
                    reject(err)
                }
                resolve(results[0])
            })
        })
    }

    //Thêm sản phẩm vào hóa đơn(oD)
    addProductToOrderDetail(quantity, idO, idP) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO orderdetail(quantity, idOrder, idProduct)
                         values (${quantity}, ${idO}, ${idP})`;
            connect.query(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Insert Data Success');
                    resolve('Đã thêm vào orderDetail');
                }
            })
        })
    }

    getProductsFromOrderD(idO) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            const sql = `select SUM(orderdetail.quantity) as quantity, products.id, products.name, products.price
                         from orderdetail d
                                  join products p on d.idProduct = p.id
                                  join order o on o.id = d.idOrder
                         where idOrder = ${idO}
                         group by id`
            connect.query(sql, (err, products) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            });
        })
    }

    editImage(image, id) {
        let connect = connection.getConnection();
        return new Promise((resolve, reject) => {
            connect.query(`update products
                                         set image = '${image}',
                                             where id = ${id}`, (err, image) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Edit Success !!!');
                    resolve(image);
                }
            })
        })
    }
}

module.exports = new ProductService();