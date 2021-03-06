"use strict";

var db = require("../lib/db");
var Q = require("Q");
var Room = require("./Room");

function getRooms() {
    var deferred = Q.defer();
    db.rooms.find({}, function(error, docs) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            var rooms = docs.map(function(d) { return new Room(d); });
            deferred.resolve(rooms);
        }
    });
    return deferred.promise;
}

function saveRoom(room) {
    var deferred = Q.defer();
    db.rooms.update({location: room.location}, room, {upsert: true}, function(error) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(room);
        }
    });
    return deferred.promise;
}

function findRoom(location) {
    var deferred = Q.defer();
    db.rooms.findOne({location: location}, function(error, room) {
        if (error) {
            deferred.reject(new Error(error));
        }
        else {

            if(room !== null) {
                room = new Room(room);
            }

            deferred.resolve(room);
        }
    });
    return deferred.promise;
}

module.exports = {
    saveRoom : saveRoom,
    getAll : getRooms,
    findRoom: findRoom
};
