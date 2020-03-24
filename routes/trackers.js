const express = require('express');
const router = express.Router();
const Tracker = require('../models/tracker');
const _ = require('lodash');

const history_count = 5


function createRouter(socket){
    sendDataToSocket = function (tracker){
        socket.to('main').emit('tracker update', { tracker });
    }
    
    router.post('/track', (req, res, next) =>{
        console.log(req.body)
        // Update CallBack
        updateCallBack = function (err, update)  {
            console.log("Database updated")
            Tracker.getTrackerById(req.body.device.id, (err, tracker) => {
                sendDataToSocket(tracker)
            })
        }
        // Parse boolean variables in request body
        if (req.body.battery.charging == "true"){
            charging = true;
        } else {
            charging = false;
        }

        // Check if tracker exists else create
        Tracker.getTrackerById(req.body.device.id, (err, tracker) => {
            if(tracker){ // Tracker exists update database
                // Add new history point
                let newHistoryPoint = {
                    _id: Number(req.body.position.time),
                    position: {
                        accuracy: Number(req.body.position.accuracy),
                        altitude: Number(req.body.position.altitude),
                        lat: Number(req.body.position.lat),
                        lon: Number(req.body.position.lon),
                        speed: Number(req.body.position.speed)
                    },
                    battery: {
                        level: Number(req.body.battery.level),
                        charging: charging
                    }
                }
                tracker.history.push(newHistoryPoint)

                // sort history points by time
                tracker.history = _.sortBy(tracker.history, [function(h) { return h._id; }]);
                _.reverse(tracker.history);

                // Maintain history length
                if(tracker.history.length >= tracker.history_count) {
                    tracker.history = _.slice(tracker.history, 0, tracker.history_count)
                }

                let newTracker = new Tracker ({
                    _id: tracker._id,
                    pair_password: tracker.pair_password,
                    secret: tracker.secret,
                    public_key: tracker.public_key,
                    history_count: tracker.history_count,
                    history: tracker.history,
                });

                // Update database
                Tracker.updateTracker(tracker._id, newTracker, updateCallBack)
                
            } else { // Tracker does not exist create new
                let newTracker = new Tracker ({
                    _id: req.body.device.id,
                    pair_password: "None",
                    secret: req.body.device.secret,
                    public_key: "None",
                    history_count: history_count,
                    history: [{
                      _id: Number(req.body.position.time),
                      position: {
                        accuracy: Number(req.body.position.accuracy),
                        altitude: Number(req.body.position.altitude),
                        lat: Number(req.body.position.lat),
                        lon: Number(req.body.position.lon),
                        speed: Number(req.body.position.speed)
                      },
                      battery: {
                        level: Number(req.body.battery.level),
                        charging: charging
                      }
                    }],
                });
                // Update Database
                Tracker.addTracker(newTracker, updateCallBack)
            }
        })

        res.json('This is backend, Got your data !');
        
    
    });

    router.get('/',(req, res, next) =>{
        console.log("sending all trackers")
        Tracker.getAllTrackers((err, trackers) =>{
            for (t of trackers) {
                sendDataToSocket(t)
            }
        })
        res.json('Trackers on the way');
    
    });

    router.get('/delete',(req, res, next) =>{
        console.log("deleteing all trackers")
        Tracker.deleteAllTrackers();
        res.json('Trackers are deleted');
    
    });
    
    return router;
}











module.exports = createRouter;