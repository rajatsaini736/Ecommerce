const { database } = require('../../config/helpers');

module.exports = {

    getAllOrders: (req, res, next) => {
        database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = o.user_id'
            }
        ])
        .withFields([ 'o.id', 'p.title', 'p.description', 'u.username' ])
        .sort({id: .1})
        .getAll()
        .then(orders => {
            if(orders.length>0){
                res.status(200).json(orders);
            } else{
                res.json({message: "No orders found"});
            }
        }).catch(err => console.log(err));
    },

    getOrder: (req, res, next) => {
        const orderId = req.params.id;

        database.table('orders as o')
        .join([
            {
                table: 'orders_details as od',
                on: 'od.order_id = o.id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            }
        ])
        .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'p.image', 'od.quantity as quantityOrdered'])
        .filter({'o.id': orderId})
        .getAll()
        .then(orders => {
            if(orders.length>0){
                res.status(200).json(orders);
            } else{
                res.json({message: `No orders found with order id ${orderId}`});
            }
        }).catch(err => console.log(err));
    },

    addOrder: (req, res, next) => {
        let {userId, products} = req.body;
    
        if( userId != null && userId >0 && !isNaN(userId)){
            database.table('orders')
                .insert({
                    user_id: userId
                })
                .then(newOrderId => {
    
                    if(newOrderId > 0){
                        products.forEach(async (p) => {
                            let data = await database.table('products')
                                .filter({'id': p.id}).withFields(['quantity']).get();
                            let inCart = p.inCart;
                            // DEDUCT THE NUMBER OF PIECES ORDERED FROM THE QUANTITY COLUMN IN DATABASE
                            if(data.quantity > 0){
                                (data).quantity = data.quantity - inCart;
    
                                if(data.quantity < 0){
                                    data.quantity = 0;
                                }
                            }else{
                                data.quantity = 0;
                            }
    
                            // INSERT ORDER DETAILS W.R.T. THE NEW GENERATED ORDER ID
    
                            database.table('orders_details')
                                .insert({
                                    order_id: newOrderId,
                                    product_id: p.id,
                                    quantity: inCart
                                })
                                .then(newId => {
                                    //UPDATING THE QUANTITY COLUMN IN PRODUCT TABLE
                                    database.table('products')
                                        .filter({'id': p.id})
                                        .update({
                                            quantity: data.quantity
                                        })
                                        .then( successNum => {})
                                        .catch(err => console.log(err));
                                })
                                .catch(err => console.log(err));
    
                        })
                    }
                    else{
                        res.json({message: " New order failed while adding order details", success: false});
                    }
                    res.json({
                        message: `Order successfully placed with order id ${newOrderId}`,
                        success: true,
                        order_id: newOrderId,
                        products: products
                    });
                })
                .catch(err => console.log(err));
        }
        else{
            res.json({ message: "New order failed", success: false});
        }
    },

    orderPayment: (req, res, next) => {
        setTimeout(() => {
            res.status(200).json({success: true});
        }, 3000);
    }

}