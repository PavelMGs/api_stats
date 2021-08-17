const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('./database');
const cors = require('cors');
const {User, Statistic} = require('./Models');
const validator = require("validator");

sequelize.sync().then(() => console.log('db is on'));

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Allow', 'GET, POST, DELETE')
    next();
});

app.get('/:page', async (req, res) => {
    const start = (+req.params.page - 1) * 16 + 1;
    const end = +req.params.page * 16;

    if(validator.isInt(req.params.page)) {
        try {
            const users = await User.findAll({
                where: {
                    id: {
                        [Op.between]: [start, end]
                    }
                }
            });
            const stats = await Statistic.findAll({
                where: {
                    user_id: {
                        [Op.between]: [start, end]
                    }
                }
            });
            let statistic = [];
            for (let i = 0; i < users.length; i++) {
                let current_user = await stats.filter((item) => users[i].id === item.user_id);
                let total_clicks = current_user.reduce((res, item) => res + item.dataValues.clicks, 0);
                let total_views = current_user.reduce((res, item) => res + item.dataValues.page_views, 0);
                statistic.push({
                    user_id: users[i].id,
                    clicks: total_clicks,
                    page_views: total_views
                })
            }
            const allUsers = await User.findAll()
            const pagesCount = Math.floor(allUsers.length / 16)
            res.status(200).json({ users, statistic, pagesCount })
        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.sendStatus(400);
    }
})

app.get('/user/:id/:from/:to', async (req, res) => {
    if(validator.isInt(req.params.id)
        && validator.isDate(req.params.from)
        && validator.isDate(req.params.to)) {
        const fromDate = await new Date(req.params.from);
        const toDate = await new Date(req.params.to);

        try {
            const user = await User.findOne({
                where: {
                    id: +req.params.id,
                }
            })
            const stats = await Statistic.findAll({
                where: {
                    user_id: +req.params.id,
                    date: {
                        [Op.between]: [fromDate, toDate]
                    }
                }
            })
            res.status(200).json({ user, stats })
        } catch (err) {
            res.sendStatus(500);
        }
    } else res.sendStatus(400);
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
    console.log('app is running');
})