const productService = require('../../service/productService');
const fs = require("fs");
const qs = require("qs");
const connection = require("../../model/connection");
const userRouting = require('../handle/userRouting');
const userService = require('../../service/userService');


class ProductRouting {
    showAllProductAdmin(req, res) {
        let htmlAdmin = '';
        fs.readFile('./views/product/show.html', "utf-8", async (err, showHtml) => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.getProducts();
                console.log(products)
                htmlAdmin += `<div class="container">
                <div class="row ">`
                products.forEach((value) => {

                    htmlAdmin += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="../views/menu/IMG/${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a  href="/admin/deleteProduct/${value.id}" ><button class="btn btn-primary" type="submit">Delete</button></a>
                                                    <a href="/admin/editProduct/${value.id}"><button class="btn btn-primary" type="submit">Edit</button></a>
                                                        <a href="/user/purchase/${value.id}"><button class="btn btn-primary" type="submit">Order</button></a>
                </div>
                </div>
                </div>`
                })
            }
            htmlAdmin += "</div></div>"
            showHtml = showHtml.replace('{products}', htmlAdmin);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(showHtml);
            res.end();
        });


    }

    showAddProduct(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/product/add.html', "utf-8", (err, addHtml) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(addHtml);
                res.end();
            });
        }

        if (req.method === 'POST') {
            let dataProduct = '';
            req.on('data', chunk => {
                dataProduct += chunk;
            });
            req.on('end', async () => {
                const newProduct = qs.parse(dataProduct);
                let data = await productService.add(newProduct);
                console.log(data)
                res.writeHead(301, {'location': `/admin/showAllProduct`});
                res.end();
            });
        }
    }

    // showFormUpload(req, res, id) {
    //     if (req.method === 'GET') {
    //         fs.readFile('./views/uploadForm.html', 'utf-8', (err, upLoadHtml) => {
    //             if (err) {
    //                 console.log(err)
    //             } else {
    //                 res.writeHead(200, 'text/html');
    //                 res.write(upLoadHtml);
    //                 res.end();
    //             }
    //         })
    //     } else {
    //         let form = new formidable.IncomingForm();
    //         form.parse(req, async function (err, fields, files) {
    //             if (err) {
    //                 console.log(err)
    //             }
    //             let tmpPath = files.img.filepath;
    //             let newPath = path.join(__dirname, '..', '..', "./views/menu/IMG", files.img.originalFilename);
    //             fs.readFile(newPath, (err) => {
    //                 if (err) {
    //                     fs.copyFile(tmpPath, newPath, (err) => {
    //                         if (err) throw err;
    //                     });
    //                 }
    //             })
    //             await productService.editImage(files.img.originalFilename, id);
    //             res.writeHead(301, {'location': '/admin/showAllProduct'})
    //             res.end();
    //         });
    //     }
    // }

    showEditProduct(req, res, id) {
        if (req.method === "GET") {
            fs.readFile('./views/product/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err);
                } else {
                    let product = await productService.findById(id);
                    editHtml = editHtml.replace('{name}', product[0].name);
                    editHtml = editHtml.replace('{price}', product[0].price);
                    editHtml = editHtml.replace('{img}', product[0].img);
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            });
        } else {
            let productEdit = '';
            req.on('data', chunk => {
                productEdit += chunk
            });
            req.on('end', async (err) => {
                if (err) {
                    console.log(err);
                } else {
                    let product = qs.parse(productEdit);
                    await productService.edit(product, id);
                    res.writeHead(301, {'location': '/admin/showAllProduct'});
                    res.end();
                }
            });
        }
    }

    showDeleteProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/product/delete.html', "utf-8", async (err, deleteHtml) => {
                let product = await productService.findById(id)
                deleteHtml = deleteHtml.replace('{name}', product[0].name);
                deleteHtml = deleteHtml.replace('{price}', product[0].price);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(deleteHtml);
                res.end();
            });
        } else {
            productService.delete(id).then(r => {
                res.writeHead(301, {'location': '/admin/showAllProduct'});
                res.end();
            });

        }
    }

    getCategory = async () => {
        let indexCategory = '';
        let products = await productService.getCategory();
        indexCategory += ''
        for (const value of products) {
            indexCategory += `<a href="/user/resultFindProductByCategory/${value.id}" class="col-12">${value.name}</a>`
        }
        return indexCategory;
    }

    //Hiện thị sản phẩm theo tên
    showFindProductByName = (req, res) => {
        if (req.method === 'POST') {
            let nameProduct = '';
            req.on('data', async chunk => {
                nameProduct += chunk;
            });
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let nameP = qs.parse(nameProduct);
                    let html = '';
                    fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
                        if (err) {
                            console.log(err);
                        } else {
                            let products = await productService.findProductByName(nameP.name);
                            html += `<div class="container">
                <div class="row ">`
                            products.forEach((value) => {
                                html += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="../views/menu/IMG/${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a href="/user/addProductToOrder/${value.id}"><button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button></a>
                </div>
                </div>
                </div>`
                            })


                        }
                        let category1 = await this.getCategory();
                        res.writeHead(301, {'Content-Type': 'text/html'});
                        userHtml = userHtml.replace('{category}', category1);
                        userHtml = userHtml.replace('{products}', html);
                        res.write(userHtml);
                        res.end();
                    });
                }
            })
        }
    }

    //Hiện thị sản phẩm theo giá
    showFindProductByPrice = (req, res) => {
        if (req.method === 'POST') {
            let priceProduct = '';
            req.on('data', chunk => {
                priceProduct += chunk;
                console.log(priceProduct);
            });
            req.on('end', async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    let priceP = qs.parse(priceProduct);
                    console.log(priceP)
                    let html = '';
                    fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
                        if (err) {
                            console.log(err);
                        } else {
                            let products = await productService.findProductByPrice(priceP.price1, priceP.price2);
                            html += `<div class="container">
                <div class="row ">`
                            products.forEach((value) => {
                                html += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="../views/menu/IMG/${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a href="/user/${value.id}"><button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button></a>
                </div>
                </div>
                </div>`
                            })
                        }
                        let category2 = await this.getCategory();
                        res.writeHead(301, {'Content-Type': 'text/html'});
                        userHtml = userHtml.replace('{category}', category2);
                        userHtml = userHtml.replace('{products}', html);
                        res.write(userHtml);
                        res.end();
                    });
                }
            })
        }
    }
    userShowAll = (req, res) => {
        if (req.method === 'POST') {
            let html = '';
            fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
                if (err) {
                    console.log(err);
                } else {
                    let products = await productService.getProducts();
                    html += `<div class="container">
                <div class="row ">`
                    products.forEach((value) => {
                        html += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="../views/menu/IMG/${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a href="/user/${value.id}"><button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button></a>
                </div>
                </div>
                </div>`
                    })
                }
                let category = await this.getCategory();
                res.writeHead(301, {'Content-Type': 'text/html'});
                userHtml = userHtml.replace('{category}', category);
                userHtml = userHtml.replace('{products}', html);
                res.write(userHtml);
                res.end();
            });
        }

    }
    //Hiện thị danh sách Loại
    showFindProductByCategory = (req, res) => {
        if (req.method === 'POST') {
            let html = '';
            fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
                if (err) {
                    console.log(err);
                } else {
                    let products = await productService.getProducts();
                    html += `<div class="container">
                <div class="row ">`
                    products.forEach((value) => {
                        html += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="../views/menu/IMG/${value.IMG}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a href="/user/${value.id}"><button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button></a>
                </div>
                </div>
                </div>`
                    })
                }
                let category3 = await this.getCategory();
                res.writeHead(301, {'Content-Type': 'text/html'});
                userHtml = userHtml.replace('{category}', category3);
                userHtml = userHtml.replace('{products}', html);
                res.write(userHtml);
                res.end();
            });
        }
    }

    //Hiện thị kết quả tìm kiếm theo Loại
    showResultFindProductByCategory = (req, res, id) => {
        if (req.method === 'POST') {
            let html = '';
            fs.readFile('./views/menu/user.html', "utf-8", async (err, userHtml) => {
                if (err) {
                    console.log(err);
                } else {
                    let products = await productService.findProductByCategory(id);
                    html += `<div class="container">
                <div class="row ">`
                    products.forEach((value) => {
                        html += `
                                <div class="col-3 mr-8">
                                    <div class="card mt-12" style="width: 18rem;">
                                        <img src="../views/menu/IMG/${value.img}" class="card-img-top" alt="...">
                                         <div class="card-body">
                                             <h5 class="card-title">${value.name}</h5>
                                                <p class="card-text">Giá: ${value.price}</p> 
                                                <a href="/user/${value.id}"><button class="btn btn-primary" type="submit">Thêm vào giỏ hàng</button></a>
                </div>
                </div>
                </div>`

                    })
                }
                let category4 = await this.getCategory();
                res.writeHead(301, {'Content-Type': 'text/html'});
                userHtml = userHtml.replace('{category}', category4);
                userHtml = userHtml.replace('{products}', html);
                res.write(userHtml);
                res.end();
            });
        }
    }

    //Thêm sản phẩm vào hóa đơn
    async showAddProductToOrder(req, res, idP) {

        // let isExists = await productService.checkOrder(userService.getIdUser());
        // if (!isExists) {
        //
        // }
        await productService.createOrder(userService.getIdUser());
        let idOrderFind = await productService.getIdOrder(userService.getIdUser());
        let quantityP = await productService.getQuantityP(idP);

        if (req.method === 'POST') {
            let quantityBuy = '';
            req.on('data', chunk => {
                quantityBuy += chunk;
            });
            req.on('end', async () => {
                const quantityB = qs.parse(quantityBuy.length);
                if (quantityB.quantity > quantityP.quantity) {
                    res.writeHead(301, {'location': '/user/showCart'});
                    res.end();
                } else {
                    await productService.addProductToOrderDetail(quantityB.quantity, idOrderFind, idP);
                    let quantityAfterBuy = quantityP.quantity - quantityB.quantity;
                    await productService.quantityAfterBuy(quantityAfterBuy, idP);
                    res.writeHead(301, {'location': '/user/showCart'});
                    res.end();
                }
            });
        }
    }
}

module.exports = new ProductRouting();