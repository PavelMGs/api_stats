const { Model, DataTypes } = require('sequelize');
const sequelize = require('./database');
const users = require('./users.json');
const stats = require('./users_statistic.json');

class User extends Model{}

User.init({
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING
    },
    last_name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    gender: {
        type: DataTypes.STRING
    },
    ip_address: {
        type: DataTypes.STRING
    },
}, {
    sequelize,
    modelName: 'user'
});

(async function() {
    const users_records = await User.findAll();
    if(!users_records.length) {
        User.bulkCreate(users, {
            fields: ["id", "first_name", "last_name", "email", "gender", "ip_address", "ip_address"],
            ignoreDuplicates: ["id"]
        })
    }
})()

class Statistic extends Model { }

Statistic.init({
    user_id: {
        type: DataTypes.NUMBER,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE
    },
    page_views: {
        type: DataTypes.NUMBER
    },
    clicks: {
        type: DataTypes.NUMBER
    },
}, {
    sequelize,
    modelName: 'statistic'
});

(async function () {
    const statistics_records = await Statistic.findAll();
    if (!statistics_records.length) {
        Statistic.bulkCreate(stats, {
            fields: ["user_id", "date", "page_views", "clicks"],
            ignoreDuplicates: ["user_id"]
        })
    }
})()

module.exports = {User, Statistic};
