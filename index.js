const express = require('express');
const { Op } = require('sequelize');
const sequelize = require('./database');
const cors = require('cors');
const {User, Statistic} = require('./Models');

sequelize.sync().then(() => console.log('asd'));

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
    
    try {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.between]: [start, end]
                }
            }
        });
        const statistic = await Statistic.findAll({
            where: {
                user_id: {
                    [Op.between]: [start, end]
                }
            }
        });
        const allUsers = await User.findAll()
        const pagesCount = Math.floor(allUsers.length / 16)
        res.status(200).json({ users, statistic, pagesCount })
    } catch(err) {
        res.status(500).json(err)
    }
})

app.get('/:id&from&to', async (req, res) => {
    
    try {
        const user = User.findOne({
            where: {
                id: req.params.id
            }
        })
        const stats = Statistic.findAll
    } catch (err) {
        console.log('asdasda')
        res.sendStatus(500).json(err);
    }
})

app.listen(8000, async () => {
    console.log('app is running');
})