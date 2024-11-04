import { model, models, Schema } from "mongoose";


const OrderSchema = new Schema({

    line_items: {
        type: Object,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    paid: {
        type: Boolean,
        required: true,
    },

})

export const Order = models.Order || model('Order', OrderSchema)