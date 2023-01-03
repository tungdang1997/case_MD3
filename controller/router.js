const userRouting = require('./handle/userRouting');
const productRouting = require('./handle/productRouting');

const router = {
    'login' : userRouting.login,
    'signup': userRouting.register,
    'admin': userRouting.admin,
    'admin/showAllProduct': productRouting.showAllProductAdmin,
    'admin/addProduct': productRouting.showAddProduct,
    'admin/editProduct': productRouting.showEditProduct,
    'admin/deleteProduct': productRouting.showDeleteProduct,
    'user' : productRouting.userShowAll,
    'user/findProductByName': productRouting.showFindProductByName,
    'user/findProductByPrice': productRouting.showFindProductByPrice,
    'user/findProductByCategory': productRouting.showFindProductByCategory,
    'user/resultFindProductByCategory': productRouting.showResultFindProductByCategory,
    'user/addProductToOrder': productRouting.showAddProductToOrder,
    'user/showCart': userRouting.showCart,
    'user/deleteProduct': userRouting.showDeleteProduct,
    'user/purchase': userRouting.buyProduct,
    'user/deleteCart': userRouting.deleteCart,
    'admin/uploadProduct': productRouting.showFormUpload,
}

module.exports = router;