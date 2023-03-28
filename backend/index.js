// basic express server
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyparser = require('body-parser');

const { Op } = require("sequelize");

// add body parser
app.use(express.json());
app.use(bodyparser.json());


// setup cors
app.use(cors({
    origin: '*'
}));


// import database connection from config folder
const db = require('./config/db');

// test db connection
try {
    db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// import models
const FoodItem = require('./models/foodItem');
const FoodLog = require('./models/foodLog');
const TravelMethod = require('./models/travelMethod');
const TravelJourney = require('./models/travelJourney');
const Tip = require('./models/tip');

// create associations
FoodLog.belongsTo(FoodItem);
FoodItem.hasMany(FoodLog);
TravelJourney.belongsTo(TravelMethod);
TravelMethod.hasMany(TravelJourney);


// sync models with database and alter
db.sync({alter: true});

// setup routes
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

// post route for creating a food log
app.post('/foodlog', (req, res) => {
    // create a food log
    FoodLog.create({
        date: req.body.date,
        foodItemId: req.body.foodItemId,
        mass: req.body.mass
    });
    res.send('Food log created');
    }
);

// get route for getting all food logs
app.get('/foodlogs', (req, res) => {
    // get all food logs
    FoodLog.findAll({
        include: [FoodItem]
    }).then(foodLogs => {
        res.send(foodLogs);
    });
    }
);

// get route for getting all food items
app.get('/fooditems', (req, res) => {
    // get all food items
    FoodItem.findAll().then(foodItems => {
        res.send(foodItems);
    });
    }
);

// create travel routes
// post route for creating a travel journey
app.post('/traveljourney', (req, res) => {
    // create a travel journey
    TravelJourney.create({
        date: req.body.date,
        travelMethodId: req.body.travelMethodId,
        distance: req.body.distance
    });
    res.send('Travel journey created');
    }
);

// get route for getting all travel journeys
app.get('/traveljourneys', (req, res) => {
    // get all travel journeys
    TravelJourney.findAll({
        include: [TravelMethod]
    }).then(travelJourneys => {
        res.send(travelJourneys);
    });
    }
);

// get route for getting all travel methods
app.get('/travelmethods', (req, res) => {
    // get all travel methods
    TravelMethod.findAll().then(travelMethods => {
        res.send(travelMethods);
    });
    }
);

// get route to get total carbon output for travel and food seperately
app.get('/splitcarbonyesterday', (req, res) => {
    let travelCarbonTotal = 0;
    let foodCarbonTotal = 0;
    // get all travel journeys
    TravelJourney.findAll({
        include: [TravelMethod]
    }).then(travelJourneys => {
        travelJourneys.forEach(travelJourney => {
            travelCarbonTotal += travelJourney.distance * travelJourney.travelMethod.carbonOutput;
        });
        // get all food logs
        FoodLog.findAll({
            include: [FoodItem],
        }).then(foodLogs => {
			// maths
            foodLogs.forEach(foodLog => {
                foodCarbonTotal += foodLog.mass * foodLog.foodItem.carbonOutput;
            });
            res.send([
                {
                    name: "Travel",
                    carbonTotal: travelCarbonTotal
                },
                {
                    name: "Food",
                    carbonTotal: foodCarbonTotal
                }
            ]);
        });
    });
    }
);

// get route to get total carbon output for travel and food combined for today
app.get('/totalcarbontoday', (req, res) => {
    let carbonTotal = 0;
    // get all travel journeys
    TravelJourney.findAll({
        include: [TravelMethod],
        where: {
        date: {
            [Op.between]: [new Date(new Date().setDate(new Date().getDate())), new Date(new Date().setDate(new Date().getDate()) + 1)]
        }
    }
    }).then(travelJourneys => {
        travelJourneys.forEach(travelJourney => {
            carbonTotal += travelJourney.distance * travelJourney.travelMethod.carbonOutput;
        });
        // get all food logs
        FoodLog.findAll({
            include: [FoodItem],
            where: {
                date: {
                    [Op.between]: [new Date(new Date().setDate(new Date().getDate())), new Date(new Date().setDate(new Date().getDate()) + 1)]
                }
            }
        }).then(foodLogs => {
            foodLogs.forEach(foodLog => {
                carbonTotal += foodLog.mass * foodLog.foodItem.carbonOutput;
            });
            res.send({
                carbonTotal: carbonTotal
            });
        });

    });
    }
);

// create route to get total carbon output for travel and food combined for yesterday
app.get('/totalcarbonyesterday', (req, res) => {
    let carbonTotal = 0;
    // get all travel journeys
    TravelJourney.findAll({
        include: [TravelMethod],
        where: {
            date: {
                [Op.between]: [new Date(new Date().setDate(new Date().getDate() - 1)), new Date(new Date().setDate(new Date().getDate()))]
            }        }
    }).then(travelJourneys => {
        travelJourneys.forEach(travelJourney => {
            carbonTotal += travelJourney.distance * travelJourney.travelMethod.carbonOutput;
        });
        // get all food logs
        FoodLog.findAll({
            include: [FoodItem],
            where: {
                date: {
                    [Op.between]: [new Date(new Date().setDate(new Date().getDate() - 1)), new Date(new Date().setDate(new Date().getDate()))]
                }            }
        }).then(foodLogs => {
            foodLogs.forEach(foodLog => {
                carbonTotal += foodLog.mass * foodLog.foodItem.carbonOutput;
            });
            res.send({
                carbonTotal: carbonTotal
            });
        });

    });
    }
);


// routes for deleting food logs and travel journeys
app.delete('/foodlog/:id', (req, res) => {
    FoodLog.destroy({
        where: {
            id: req.params.id
        }
    });
    res.send('Food log deleted');
    }
);

app.delete('/traveljourney/:id', (req, res) => {
    TravelJourney.destroy({
        where: {
            id: req.params.id
        }
    });
    res.send('Travel journey deleted');
    }
);

// function to decide carbon image
function carbonImage(carbonTotal) {
    if (carbonTotal < 10000/365) {
        return "happy-alive";
    } else if (carbonTotal < 16000/365) {
        return "sad-dying";
    } else {
        return "sad-dead";
    }
}

// > 16 sad dead
// > 10 sad dying
// everything else happy alive
// route to decide image to use depending on combined carbon total
app.get('/carbonimage', (req, res) => {
    let carbonTotal = 0;
    // get all travel journeys
    TravelJourney.findAll({
        include: [TravelMethod],
        where: {
            date: new Date(new Date().setDate(new Date().getDate() - 1))
        }
    }).then(travelJourneys => {
        travelJourneys.forEach(travelJourney => {
            carbonTotal += travelJourney.distance * travelJourney.travelMethod.carbonOutput;
        });
        // get all food logs
        FoodLog.findAll({
            include: [FoodItem],
            where: {
                date: new Date(new Date().setDate(new Date().getDate() - 1))
            }
        }).then(foodLogs => {
            foodLogs.forEach(foodLog => {
                carbonTotal += foodLog.mass * foodLog.foodItem.carbonOutput;
            });
            res.send({
                image: carbonImage(carbonTotal)
            });
        });
    });
    }
);

// route to get tips
app.get('/tips', (req, res) => {
    // get all tips
    Tip.findAll().then(tips => {
        res.send(tips);
    });
    }
);

app.listen(port, () => {
    console.log(`Envirodash backend app listening at http://localhost:${port}`);
    }
);