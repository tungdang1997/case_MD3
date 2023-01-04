const userService = require('../../service/userService')
const fs = require("fs");
const qs = require("qs");
const connection = require("../../model/connection");
const productService = require("../../service/productService");
const categoryService = require("../../service/userService")

class UserRouting {
    login(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/login.html', "utf-8", (err, loginHtml) => {
                if (err) {
                    console.log(err.message);
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                loginHtml = loginHtml.replace('{notification}', '');
                res.write(loginHtml);
                res.end();
            });
        } else {
            let dataLogin = '';
            req.on('data', chunk => {
                dataLogin += chunk;
            });
            req.on('end', async () => {
                const user = qs.parse(dataLogin);
                await userService.login(user, res);
            });
        }
    }

    register(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/signup.html', "utf-8", (err, registerHtml) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                registerHtml = registerHtml.replace('{notification}', '');
                res.write(registerHtml);
                res.end();
            });
        } else {
            let dataRegister = '';
            req.on('data', chunk => {
                dataRegister += chunk;
            });
            req.on('end', () => {
                const newUser = qs.parse(dataRegister);
                userService.register(newUser, res);
            });
        }
    }

    admin(req, res) {
        fs.readFile('./views/menu/admin.html', "utf-8", (err, adminHtml) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(adminHtml);
            res.end();
        });
    }

    user(req, res) {
        let html = '';
        fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.getProducts();
                products.forEach((value, index1) => {
                    html += '<tr>';
                    html += `<td>${index1 + 1}</td>`
                    html += `<td>${value.name}</td>`
                    html += `<td>${value.price}</td>`
                    html += `<td>${value.quantity}</td>`
                    html += `<td>${value.IMG}</td>`
                    html += `<td> <form action="/user/addProductToOrder/${value.id}" method="post"> <input type="number" name="quantity"> <button type="submit">Thêm</button></form></td>`
                    html += '</tr>';
                })
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            userHtml = userHtml.replace('{products}', html);
            res.write(userHtml);
            res.end();
        });
    }

    async showCart(req, res) {
        let html = ''
        let idOrderFind = await productService.getIdOrder(userService.getIdUser());
        let total = await userService.getTotalPrice(idOrderFind);
        if (req.method === 'GET') {
            fs.readFile('./views/user/cart.html', "utf-8", async (err, cartHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    let idOrderFind = await productService.getIdOrder(userService.getIdUser());
                    let products = await productService.getProductsFromOrderD(idOrderFind);
                    products.forEach((value, index5) => {
                        html += '<tr>';
                        html += `<td>${index5 + 1}</td>`
                        html += `<td>${value.name}</td>`
                        html += `<td>${value.price}</td>`
                        html += `<td>${value.quantity}</td>`
                        html += `<td>${value.img}</td>`
                        html += `<td><a href="/user/deleteProduct/${value.id}" ><button type="button">Delete</button></a></td>`
                        html += '</tr>';
                    })
                }
                res.writeHead(200, {'Content-Type': 'text/html'});
                cartHtml = cartHtml.replace('{products}', html);
                cartHtml = cartHtml.replace('{total}', total[0].total);
                res.write(cartHtml);
                res.end();
            })
        } else {

        }
    }

    async showDeleteProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/deleteProduct.html', "utf-8", async (err, deleteHtml2) => {
                let product = await userService.findProductById(id);
                deleteHtml2 = deleteHtml2.replace('{name}', product[0].name);
                deleteHtml2 = deleteHtml2.replace('{price}', product[0].price);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(deleteHtml2);
                res.end();
            });
        } else {
            await userService.deleteProduct(id)
            res.writeHead(301, {'location': '/user/showCart'});
            res.end();
        }
    }

    async buyProduct(req, res) {
        let idOrderFind = await productService.getIdOrder(userService.getIdUser());
        await userService.buyProduct(idOrderFind);
        fs.readFile('./views/user/cart.html', "utf-8", async (err, cartHtml) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            cartHtml = cartHtml.replace('{products}', '');
            cartHtml = cartHtml.replace('{total}', 0);
            res.write(cartHtml);
            res.end();
        })
    }

    async deleteCart(req, res) {
        let idOrderFind = await productService.getIdOrder(userService.getIdUser());
        await userService.deleteCart(idOrderFind);
        fs.readFile('./views/user/cart.html', "utf-8", async (err, cart) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            cart = cart.replace('{products}', '');
            cart = cart.replace('{total}', 0);
            res.write(cart);
            res.end();
        })
    }

}

module.exports = new UserRouting();