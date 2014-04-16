/**
 * This file handles the setup requests.
 * User: ofer
 * Date: 07/09/13
 */
var mongodb = require('mongodb');
var Db = mongodb.Db;
var Connection = mongodb.Connection;
var Server = mongodb.Server;
var BSON = mongodb.BSONPure;
var ObjectID = mongodb.ObjectID;
var assert = require('assert');

var SONGS_DATA = {
    "users": [
        {
            "track_id": "spotify:track:1zng9uqqXoPkmU05nsAlsw",
            "user_id": 0,
            "engagement": 0.9,
            "happiness": 0.5,
            "excitement": 0.6,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:1zng9uqqXoPkmU05nsAlsw",
            "user_id": 1,
            "engagement": 0.9,
            "happiness": 0.5,
            "excitement": 0.7,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:1zng9uqqXoPkmU05nsAlsw",
            "user_id": 2,
            "engagement": 0.7,
            "happiness": 0.6,
            "excitement": 0.4,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:1zng9uqqXoPkmU05nsAlsw",
            "user_id": 3,
            "engagement": 0.7,
            "happiness": 0.5,
            "excitement": 0.2,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:1zng9uqqXoPkmU05nsAlsw",
            "user_id": 4,
            "engagement": 0.6,
            "happiness": 0.9,
            "excitement": 0.9,
            "meditation": 0.2
        },
        {
            "track_id": "spotify:track:4KaHvV6CcOI9F0WDdToZdv",
            "user_id": 0,
            "engagement": 0.6,
            "happiness": 0.7,
            "excitement": 0.8,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:4KaHvV6CcOI9F0WDdToZdv",
            "user_id": 1,
            "engagement": 0.4,
            "happiness": 0.8,
            "excitement": 0.9,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:4KaHvV6CcOI9F0WDdToZdv",
            "user_id": 2,
            "engagement": 0.7,
            "happiness": 0.8,
            "excitement": 0.8,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:4KaHvV6CcOI9F0WDdToZdv",
            "user_id": 3,
            "engagement": 0.6,
            "happiness": 0.9,
            "excitement": 0.9,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:4KaHvV6CcOI9F0WDdToZdv",
            "user_id": 4,
            "engagement": 0.3,
            "happiness": 0.9,
            "excitement": 0.8,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:7zkDEBSxkcBVsStS4qBFpK",
            "user_id": 0,
            "engagement": 0.4,
            "happiness": 0.8,
            "excitement": 0.8,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:7zkDEBSxkcBVsStS4qBFpK",
            "user_id": 1,
            "engagement": 0.5,
            "happiness": 0.7,
            "excitement": 0.9,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:7zkDEBSxkcBVsStS4qBFpK",
            "user_id": 2,
            "engagement": 0.5,
            "happiness": 0.9,
            "excitement": 0.9,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:7zkDEBSxkcBVsStS4qBFpK",
            "user_id": 3,
            "engagement": 0.6,
            "happiness": 0.85,
            "excitement": 0.8,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:7zkDEBSxkcBVsStS4qBFpK",
            "user_id": 4,
            "engagement": 0.3,
            "happiness": 0.9,
            "excitement": 0.85,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:5J2aWRLoOL57CUkkzZjZWy",
            "user_id": 0,
            "engagement": 0.2,
            "happiness": 0.7,
            "excitement": 0.8,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:5J2aWRLoOL57CUkkzZjZWy",
            "user_id": 1,
            "engagement": 0.6,
            "happiness": 0.6,
            "excitement": 0.7,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:5J2aWRLoOL57CUkkzZjZWy",
            "user_id": 2,
            "engagement": 0.7,
            "happiness": 0.7,
            "excitement": 0.7,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:5J2aWRLoOL57CUkkzZjZWy",
            "user_id": 3,
            "engagement": 0.4,
            "happiness": 0.6,
            "excitement": 0.6,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:5J2aWRLoOL57CUkkzZjZWy",
            "user_id": 4,
            "engagement": 0.9,
            "happiness": 0.2,
            "excitement": 0.3,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:4tCWWnk3BXinf7FllmSyHW",
            "user_id": 0,
            "engagement": 0.8,
            "happiness": 0.3,
            "excitement": 0.4,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:4tCWWnk3BXinf7FllmSyHW",
            "user_id": 1,
            "engagement": 0.8,
            "happiness": 0.2,
            "excitement": 0.3,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:4tCWWnk3BXinf7FllmSyHW",
            "user_id": 2,
            "engagement": 0.9,
            "happiness": 0.2,
            "excitement": 0.3,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:4tCWWnk3BXinf7FllmSyHW",
            "user_id": 3,
            "engagement": 0.8,
            "happiness": 0.1,
            "excitement": 0.3,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:4tCWWnk3BXinf7FllmSyHW",
            "user_id": 4,
            "engagement": 0.4,
            "happiness": 0.1,
            "excitement": 0.3,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:65toUsVt1FtvxMx5frUuRa",
            "user_id": 0,
            "engagement": 0.5,
            "happiness": 0.9,
            "excitement": 0.8,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:65toUsVt1FtvxMx5frUuRa",
            "user_id": 1,
            "engagement": 0.8,
            "happiness": 0.7,
            "excitement": 0.7,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:65toUsVt1FtvxMx5frUuRa",
            "user_id": 2,
            "engagement": 0.2,
            "happiness": 0.5,
            "excitement": 0.4,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:65toUsVt1FtvxMx5frUuRa",
            "user_id": 3,
            "engagement": 0.5,
            "happiness": 0.4,
            "excitement": 0.5,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:65toUsVt1FtvxMx5frUuRa",
            "user_id": 4,
            "engagement": 0.4,
            "happiness": 0.7,
            "excitement": 0.9,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:74EV0g12ihUoOUXMprFpZB",
            "user_id": 0,
            "engagement": 0.3,
            "happiness": 0.6,
            "excitement": 0.7,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:74EV0g12ihUoOUXMprFpZB",
            "user_id": 1,
            "engagement": 0.6,
            "happiness": 0.8,
            "excitement": 0.8,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:74EV0g12ihUoOUXMprFpZB",
            "user_id": 2,
            "engagement": 0.3,
            "happiness": 0.8,
            "excitement": 0.3,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:74EV0g12ihUoOUXMprFpZB",
            "user_id": 3,
            "engagement": 0.7,
            "happiness": 0.9,
            "excitement": 0.8,
            "meditation": 0.1
        },
        {
            "track_id": "spotify:track:74EV0g12ihUoOUXMprFpZB",
            "user_id": 4,
            "engagement": 0.3,
            "happiness": 0.6,
            "excitement": 0.7,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:09cIsMJYUQNwIePXy0UjWK",
            "user_id": 0,
            "engagement": 0.9,
            "happiness": 0.4,
            "excitement": 0.4,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:09cIsMJYUQNwIePXy0UjWK",
            "user_id": 1,
            "engagement": 0.3,
            "happiness": 0.1,
            "excitement": 0.4,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:09cIsMJYUQNwIePXy0UjWK",
            "user_id": 2,
            "engagement": 0.4,
            "happiness": 0.6,
            "excitement": 0.6,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:09cIsMJYUQNwIePXy0UjWK",
            "user_id": 3,
            "engagement": 0.6,
            "happiness": 0.7,
            "excitement": 0.7,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:09cIsMJYUQNwIePXy0UjWK",
            "user_id": 4,
            "engagement": 0.6,
            "happiness": 0.5,
            "excitement": 0.5,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:2uisasUp51sEogjSx91Qsy",
            "user_id": 0,
            "engagement": 0.6,
            "happiness": 0.8,
            "excitement": 0.5,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:2uisasUp51sEogjSx91Qsy",
            "user_id": 1,
            "engagement": 0.4,
            "happiness": 0.4,
            "excitement": 0.3,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:2uisasUp51sEogjSx91Qsy",
            "user_id": 2,
            "engagement": 0.8,
            "happiness": 0.5,
            "excitement": 0.5,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:2uisasUp51sEogjSx91Qsy",
            "user_id": 3,
            "engagement": 0.1,
            "happiness": 0.8,
            "excitement": 0.1,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:2uisasUp51sEogjSx91Qsy",
            "user_id": 4,
            "engagement": 0.4,
            "happiness": 0.3,
            "excitement": 0.1,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:2lJOKQmXQ5yiRyCTE5FyDE",
            "user_id": 0,
            "engagement": 0.9,
            "happiness": 0.3,
            "excitement": 0.3,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:2lJOKQmXQ5yiRyCTE5FyDE",
            "user_id": 1,
            "engagement": 0.8,
            "happiness": 0.2,
            "excitement": 0.3,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:2lJOKQmXQ5yiRyCTE5FyDE",
            "user_id": 2,
            "engagement": 0.8,
            "happiness": 0.1,
            "excitement": 0.3,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:2lJOKQmXQ5yiRyCTE5FyDE",
            "user_id": 3,
            "engagement": 0.8,
            "happiness": 0.2,
            "excitement": 0.2,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:2lJOKQmXQ5yiRyCTE5FyDE",
            "user_id": 4,
            "engagement": 0.9,
            "happiness": 0.1,
            "excitement": 0.2,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:1CmUZGtH29Kx36C1Hleqlz",
            "user_id": 0,
            "engagement": 0.2,
            "happiness": 0.8,
            "excitement": 0.9,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:1CmUZGtH29Kx36C1Hleqlz",
            "user_id": 1,
            "engagement": 0.3,
            "happiness": 0.9,
            "excitement": 0.8,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:1CmUZGtH29Kx36C1Hleqlz",
            "user_id": 2,
            "engagement": 0.4,
            "happiness": 0.7,
            "excitement": 0.6,
            "meditation": 0.2
        },
        {
            "track_id": "spotify:track:1CmUZGtH29Kx36C1Hleqlz",
            "user_id": 3,
            "engagement": 0.3,
            "happiness": 0.3,
            "excitement": 0.6,
            "meditation": 0.1
        },
        {
            "track_id": "spotify:track:1CmUZGtH29Kx36C1Hleqlz",
            "user_id": 4,
            "engagement": 0.2,
            "happiness": 0.6,
            "excitement": 0.5,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:1ZZH2HBk5lHv6JiqJXPmsn",
            "user_id": 0,
            "engagement": 0.7,
            "happiness": 0.8,
            "excitement": 0.4,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:1ZZH2HBk5lHv6JiqJXPmsn",
            "user_id": 1,
            "engagement": 0.6,
            "happiness": 0.9,
            "excitement": 0.4,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:1ZZH2HBk5lHv6JiqJXPmsn",
            "user_id": 2,
            "engagement": 0.8,
            "happiness": 0.6,
            "excitement": 0.5,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:1ZZH2HBk5lHv6JiqJXPmsn",
            "user_id": 3,
            "engagement": 0.4,
            "happiness": 0.2,
            "excitement": 0.3,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:1ZZH2HBk5lHv6JiqJXPmsn",
            "user_id": 4,
            "engagement": 0.4,
            "happiness": 0.5,
            "excitement": 0.3,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:1jji1sWxZOo7eWnXifT7yP",
            "user_id": 0,
            "engagement": 0.8,
            "happiness": 0.7,
            "excitement": 0.7,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:1jji1sWxZOo7eWnXifT7yP",
            "user_id": 1,
            "engagement": 0.9,
            "happiness": 0.5,
            "excitement": 0.3,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:1jji1sWxZOo7eWnXifT7yP",
            "user_id": 2,
            "engagement": 0.9,
            "happiness": 0.6,
            "excitement": 0.4,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:1jji1sWxZOo7eWnXifT7yP",
            "user_id": 3,
            "engagement": 0.9,
            "happiness": 0.7,
            "excitement": 0.7,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:1jji1sWxZOo7eWnXifT7yP",
            "user_id": 4,
            "engagement": 0.7,
            "happiness": 0.7,
            "excitement": 0.5,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:6nek1Nin9q48AVZcWs9e9D",
            "user_id": 0,
            "engagement": 0.4,
            "happiness": 0.2,
            "excitement": 0.5,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:6nek1Nin9q48AVZcWs9e9D",
            "user_id": 1,
            "engagement": 0.5,
            "happiness": 0.4,
            "excitement": 0.4,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:6nek1Nin9q48AVZcWs9e9D",
            "user_id": 2,
            "engagement": 0.5,
            "happiness": 0.9,
            "excitement": 0.9,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:6nek1Nin9q48AVZcWs9e9D",
            "user_id": 3,
            "engagement": 0.6,
            "happiness": 0.5,
            "excitement": 0.6,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:6nek1Nin9q48AVZcWs9e9D",
            "user_id": 4,
            "engagement": 0.8,
            "happiness": 0.8,
            "excitement": 0.6,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:70cTMpcgWMcR18t9MRJFjB",
            "user_id": 0,
            "engagement": 0.2,
            "happiness": 0.8,
            "excitement": 0.8,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:70cTMpcgWMcR18t9MRJFjB",
            "user_id": 1,
            "engagement": 0.3,
            "happiness": 0.5,
            "excitement": 0.6,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:70cTMpcgWMcR18t9MRJFjB",
            "user_id": 2,
            "engagement": 0.4,
            "happiness": 0.6,
            "excitement": 0.6,
            "meditation": 0.2
        },
        {
            "track_id": "spotify:track:70cTMpcgWMcR18t9MRJFjB",
            "user_id": 3,
            "engagement": 0.3,
            "happiness": 0.7,
            "excitement": 0.5,
            "meditation": 0.1
        },
        {
            "track_id": "spotify:track:70cTMpcgWMcR18t9MRJFjB",
            "user_id": 4,
            "engagement": 0.4,
            "happiness": 0.7,
            "excitement": 0.7,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:3zvHOVC4jikl6jORSr6OLE",
            "user_id": 0,
            "engagement": 0.6,
            "happiness": 0.7,
            "excitement": 0.8,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:3zvHOVC4jikl6jORSr6OLE",
            "user_id": 1,
            "engagement": 0.7,
            "happiness": 0.8,
            "excitement": 0.8,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:3zvHOVC4jikl6jORSr6OLE",
            "user_id": 2,
            "engagement": 0.3,
            "happiness": 0.6,
            "excitement": 0.6,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:3zvHOVC4jikl6jORSr6OLE",
            "user_id": 3,
            "engagement": 0.8,
            "happiness": 0.9,
            "excitement": 0.9,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:3zvHOVC4jikl6jORSr6OLE",
            "user_id": 4,
            "engagement": 0.6,
            "happiness": 0.4,
            "excitement": 0.4,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:3lpDrxUkr0tIe1kmJvdK7d",
            "user_id": 0,
            "engagement": 0.2,
            "happiness": 0.7,
            "excitement": 0.8,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:3lpDrxUkr0tIe1kmJvdK7d",
            "user_id": 1,
            "engagement": 0.2,
            "happiness": 0.8,
            "excitement": 0.7,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:3lpDrxUkr0tIe1kmJvdK7d",
            "user_id": 2,
            "engagement": 0.3,
            "happiness": 0.5,
            "excitement": 0.8,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:3lpDrxUkr0tIe1kmJvdK7d",
            "user_id": 3,
            "engagement": 0.2,
            "happiness": 0.4,
            "excitement": 0.8,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:3lpDrxUkr0tIe1kmJvdK7d",
            "user_id": 4,
            "engagement": 0.2,
            "happiness": 0.3,
            "excitement": 0.6,
            "meditation": 0.2
        },
        {
            "track_id": "spotify:track:0gOyllwzM7IvfuYZ903zNv",
            "user_id": 0,
            "engagement": 0.7,
            "happiness": 0.9,
            "excitement": 0.7,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:0gOyllwzM7IvfuYZ903zNv",
            "user_id": 1,
            "engagement": 0.4,
            "happiness": 0.7,
            "excitement": 0.4,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:0gOyllwzM7IvfuYZ903zNv",
            "user_id": 2,
            "engagement": 0.5,
            "happiness": 0.7,
            "excitement": 0.6,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:0gOyllwzM7IvfuYZ903zNv",
            "user_id": 3,
            "engagement": 0.6,
            "happiness": 0.8,
            "excitement": 0.5,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:0gOyllwzM7IvfuYZ903zNv",
            "user_id": 4,
            "engagement": 0.6,
            "happiness": 0.7,
            "excitement": 0.5,
            "meditation": 0.2
        },
        {
            "track_id": "spotify:track:14NE9H2mqNnzTPrAKQt479",
            "user_id": 0,
            "engagement": 0.6,
            "happiness": 0.2,
            "excitement": 0.3,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:14NE9H2mqNnzTPrAKQt480",
            "user_id": 1,
            "engagement": 0.5,
            "happiness": 0.2,
            "excitement": 0.3,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:14NE9H2mqNnzTPrAKQt481",
            "user_id": 2,
            "engagement": 0.8,
            "happiness": 0.3,
            "excitement": 0.4,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:14NE9H2mqNnzTPrAKQt482",
            "user_id": 3,
            "engagement": 0.6,
            "happiness": 0.4,
            "excitement": 0.4,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:14NE9H2mqNnzTPrAKQt483",
            "user_id": 4,
            "engagement": 0.3,
            "happiness": 0.3,
            "excitement": 0.5,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:0myeTJ993kXE4vN0IPchcc",
            "user_id": 0,
            "engagement": 0.4,
            "happiness": 0.4,
            "excitement": 0.4,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:0myeTJ993kXE4vN0IPchcc",
            "user_id": 1,
            "engagement": 0.3,
            "happiness": 0.1,
            "excitement": 0.3,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:0myeTJ993kXE4vN0IPchcc",
            "user_id": 2,
            "engagement": 0.7,
            "happiness": 0.6,
            "excitement": 0.5,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:0myeTJ993kXE4vN0IPchcc",
            "user_id": 3,
            "engagement": 0.5,
            "happiness": 0.5,
            "excitement": 0.4,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:0myeTJ993kXE4vN0IPchcc",
            "user_id": 4,
            "engagement": 0.8,
            "happiness": 0.5,
            "excitement": 0.4,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:2xYlyywNgefLCRDG8hlxZq",
            "user_id": 0,
            "engagement": 0.7,
            "happiness": 0.9,
            "excitement": 0.6,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:2xYlyywNgefLCRDG8hlxZq",
            "user_id": 1,
            "engagement": 0.6,
            "happiness": 0.9,
            "excitement": 0.6,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:2xYlyywNgefLCRDG8hlxZq",
            "user_id": 2,
            "engagement": 0.5,
            "happiness": 0.8,
            "excitement": 0.6,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:2xYlyywNgefLCRDG8hlxZq",
            "user_id": 3,
            "engagement": 0.5,
            "happiness": 0.8,
            "excitement": 0.5,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:2xYlyywNgefLCRDG8hlxZq",
            "user_id": 4,
            "engagement": 0.5,
            "happiness": 0.8,
            "excitement": 0.5,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:6B182GP3TvEfmgUoIMVUSJ",
            "user_id": 0,
            "engagement": 0.4,
            "happiness": 0.8,
            "excitement": 0.4,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:6B182GP3TvEfmgUoIMVUSJ",
            "user_id": 1,
            "engagement": 0.5,
            "happiness": 0.7,
            "excitement": 0.5,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:6B182GP3TvEfmgUoIMVUSJ",
            "user_id": 2,
            "engagement": 0.3,
            "happiness": 0.6,
            "excitement": 0.5,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:6B182GP3TvEfmgUoIMVUSJ",
            "user_id": 3,
            "engagement": 0.6,
            "happiness": 0.6,
            "excitement": 0.6,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:6B182GP3TvEfmgUoIMVUSJ",
            "user_id": 4,
            "engagement": 0.6,
            "happiness": 0.5,
            "excitement": 0.5,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:2UKARCqDrhkYDoVR4FN5Wi",
            "user_id": 0,
            "engagement": 0.2,
            "happiness": 0.6,
            "excitement": 0.9,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:2UKARCqDrhkYDoVR4FN5Wi",
            "user_id": 1,
            "engagement": 0.3,
            "happiness": 0.6,
            "excitement": 0.8,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:2UKARCqDrhkYDoVR4FN5Wi",
            "user_id": 2,
            "engagement": 0.3,
            "happiness": 0.7,
            "excitement": 0.7,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:2UKARCqDrhkYDoVR4FN5Wi",
            "user_id": 3,
            "engagement": 0.4,
            "happiness": 0.7,
            "excitement": 0.8,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:2UKARCqDrhkYDoVR4FN5Wi",
            "user_id": 4,
            "engagement": 0.5,
            "happiness": 0.6,
            "excitement": 0.9,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:3AJwUDP919kvQ9QcozQPxg",
            "user_id": 0,
            "engagement": 0.4,
            "happiness": 0.4,
            "excitement": 0.3,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:3AJwUDP919kvQ9QcozQPxg",
            "user_id": 1,
            "engagement": 0.4,
            "happiness": 0.6,
            "excitement": 0.3,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:3AJwUDP919kvQ9QcozQPxg",
            "user_id": 2,
            "engagement": 0.7,
            "happiness": 0.5,
            "excitement": 0.5,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:3AJwUDP919kvQ9QcozQPxg",
            "user_id": 3,
            "engagement": 0.5,
            "happiness": 0.5,
            "excitement": 0.3,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:3AJwUDP919kvQ9QcozQPxg",
            "user_id": 4,
            "engagement": 0.4,
            "happiness": 0.5,
            "excitement": 0.3,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:4VqPOruhp5EdPBeR92t6lQ",
            "user_id": 0,
            "engagement": 0.6,
            "happiness": 0.8,
            "excitement": 0.7,
            "meditation": 0.2
        },
        {
            "track_id": "spotify:track:4VqPOruhp5EdPBeR92t6lQ",
            "user_id": 1,
            "engagement": 0.5,
            "happiness": 0.7,
            "excitement": 0.5,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:4VqPOruhp5EdPBeR92t6lQ",
            "user_id": 2,
            "engagement": 0.5,
            "happiness": 0.6,
            "excitement": 0.8,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:4VqPOruhp5EdPBeR92t6lQ",
            "user_id": 3,
            "engagement": 0.4,
            "happiness": 0.6,
            "excitement": 0.9,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:4VqPOruhp5EdPBeR92t6lQ",
            "user_id": 4,
            "engagement": 0.6,
            "happiness": 0.6,
            "excitement": 0.7,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:0S7zL7ae0KpOSPKeFQpHo8",
            "user_id": 0,
            "engagement": 0.5,
            "happiness": 0.6,
            "excitement": 0.9,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:0S7zL7ae0KpOSPKeFQpHo9",
            "user_id": 1,
            "engagement": 0.5,
            "happiness": 0.6,
            "excitement": 0.8,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:0S7zL7ae0KpOSPKeFQpHo10",
            "user_id": 2,
            "engagement": 0.4,
            "happiness": 0.6,
            "excitement": 0.6,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:0S7zL7ae0KpOSPKeFQpHo11",
            "user_id": 3,
            "engagement": 0.5,
            "happiness": 0.5,
            "excitement": 0.7,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:0S7zL7ae0KpOSPKeFQpHo12",
            "user_id": 4,
            "engagement": 0.4,
            "happiness": 0.7,
            "excitement": 0.8,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:2t5RDjZmQIHf21VWunkXDm",
            "user_id": 0,
            "engagement": 0.8,
            "happiness": 0.4,
            "excitement": 0.4,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:2t5RDjZmQIHf21VWunkXDm",
            "user_id": 1,
            "engagement": 0.6,
            "happiness": 0.4,
            "excitement": 0.5,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:2t5RDjZmQIHf21VWunkXDm",
            "user_id": 2,
            "engagement": 0.7,
            "happiness": 0.3,
            "excitement": 0.6,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:2t5RDjZmQIHf21VWunkXDm",
            "user_id": 3,
            "engagement": 0.6,
            "happiness": 0.4,
            "excitement": 0.5,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:2t5RDjZmQIHf21VWunkXDm",
            "user_id": 4,
            "engagement": 0.2,
            "happiness": 0.5,
            "excitement": 0.5,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:4EeC062v5HNOHEltMGI0S5",
            "user_id": 0,
            "engagement": 0.5,
            "happiness": 0.8,
            "excitement": 0.8,
            "meditation": 0.1
        },
        {
            "track_id": "spotify:track:4EeC062v5HNOHEltMGI0S6",
            "user_id": 1,
            "engagement": 0.5,
            "happiness": 0.8,
            "excitement": 0.7,
            "meditation": 0.2
        },
        {
            "track_id": "spotify:track:4EeC062v5HNOHEltMGI0S7",
            "user_id": 2,
            "engagement": 0.4,
            "happiness": 0.7,
            "excitement": 0.6,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:4EeC062v5HNOHEltMGI0S8",
            "user_id": 3,
            "engagement": 0.3,
            "happiness": 0.9,
            "excitement": 0.7,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:4EeC062v5HNOHEltMGI0S9",
            "user_id": 4,
            "engagement": 0.6,
            "happiness": 0.6,
            "excitement": 0.6,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:7iyr2AP7JbsactrEySUyNX",
            "user_id": 0,
            "engagement": 0.9,
            "happiness": 0.5,
            "excitement": 0.5,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:7iyr2AP7JbsactrEySUyNX",
            "user_id": 1,
            "engagement": 0.9,
            "happiness": 0.5,
            "excitement": 0.4,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:7iyr2AP7JbsactrEySUyNX",
            "user_id": 2,
            "engagement": 0.9,
            "happiness": 0.5,
            "excitement": 0.4,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:7iyr2AP7JbsactrEySUyNX",
            "user_id": 3,
            "engagement": 0.8,
            "happiness": 0.4,
            "excitement": 0.4,
            "meditation": 0.2
        },
        {
            "track_id": "spotify:track:7iyr2AP7JbsactrEySUyNX",
            "user_id": 4,
            "engagement": 0.8,
            "happiness": 0.3,
            "excitement": 0.3,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:5oE6INocVL9viDow5y8QNM",
            "user_id": 0,
            "engagement": 0.4,
            "happiness": 0.6,
            "excitement": 0.6,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:5oE6INocVL9viDow5y8QNM",
            "user_id": 1,
            "engagement": 0.6,
            "happiness": 0.6,
            "excitement": 0.5,
            "meditation": 0.7
        },
        {
            "track_id": "spotify:track:5oE6INocVL9viDow5y8QNM",
            "user_id": 2,
            "engagement": 0.6,
            "happiness": 0.5,
            "excitement": 0.5,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:5oE6INocVL9viDow5y8QNM",
            "user_id": 3,
            "engagement": 0.6,
            "happiness": 0.5,
            "excitement": 0.5,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:5oE6INocVL9viDow5y8QNM",
            "user_id": 4,
            "engagement": 0.6,
            "happiness": 0.5,
            "excitement": 0.5,
            "meditation": 0.9
        },
        {
            "track_id": "spotify:track:5Uf0llmR4IIkyOzkgINbL5",
            "user_id": 0,
            "engagement": 0.5,
            "happiness": 0.8,
            "excitement": 0.5,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:5Uf0llmR4IIkyOzkgINbL6",
            "user_id": 1,
            "engagement": 0.5,
            "happiness": 0.8,
            "excitement": 0.5,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:5Uf0llmR4IIkyOzkgINbL7",
            "user_id": 2,
            "engagement": 0.4,
            "happiness": 0.9,
            "excitement": 0.5,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:5Uf0llmR4IIkyOzkgINbL8",
            "user_id": 3,
            "engagement": 0.3,
            "happiness": 0.9,
            "excitement": 0.3,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:5Uf0llmR4IIkyOzkgINbL9",
            "user_id": 4,
            "engagement": 0.4,
            "happiness": 0.9,
            "excitement": 0.3,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:2GAIycsMaDVtMtdvxzR2xI",
            "user_id": 0,
            "engagement": 0.8,
            "happiness": 0.6,
            "excitement": 0.4,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:2GAIycsMaDVtMtdvxzR2xI",
            "user_id": 1,
            "engagement": 0.8,
            "happiness": 0.5,
            "excitement": 0.4,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:2GAIycsMaDVtMtdvxzR2xI",
            "user_id": 2,
            "engagement": 0.8,
            "happiness": 0.4,
            "excitement": 0.3,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:2GAIycsMaDVtMtdvxzR2xI",
            "user_id": 3,
            "engagement": 0.8,
            "happiness": 0.3,
            "excitement": 0.3,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:2GAIycsMaDVtMtdvxzR2xI",
            "user_id": 4,
            "engagement": 0.9,
            "happiness": 0.3,
            "excitement": 0.2,
            "meditation": 0.5
        }
    ],
    "global": [
        {
            "track_id": "spotify:track:1zng9uqqXoPkmU05nsAlsw",
            "engagement": 0.76,
            "happiness": 0.6,
            "excitement": 0.56,
            "meditation": 0.72
        },
        {
            "track_id": "spotify:track:4KaHvV6CcOI9F0WDdToZdv",
            "engagement": 0.52,
            "happiness": 0.82,
            "excitement": 0.84,
            "meditation": 0.4
        },
        {
            "track_id": "spotify:track:7zkDEBSxkcBVsStS4qBFpK",
            "engagement": 0.46,
            "happiness": 0.83,
            "excitement": 0.85,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:5J2aWRLoOL57CUkkzZjZWy",
            "engagement": 0.56,
            "happiness": 0.56,
            "excitement": 0.62,
            "meditation": 0.58
        },
        {
            "track_id": "spotify:track:4tCWWnk3BXinf7FllmSyHW",
            "engagement": 0.74,
            "happiness": 0.18,
            "excitement": 0.32,
            "meditation": 0.54
        },
        {
            "track_id": "spotify:track:65toUsVt1FtvxMx5frUuRa",
            "engagement": 0.48,
            "happiness": 0.64,
            "excitement": 0.66,
            "meditation": 0.56
        },
        {
            "track_id": "spotify:track:74EV0g12ihUoOUXMprFpZB",
            "engagement": 0.44,
            "happiness": 0.74,
            "excitement": 0.66,
            "meditation": 0.5
        },
        {
            "track_id": "spotify:track:09cIsMJYUQNwIePXy0UjWK",
            "engagement": 0.56,
            "happiness": 0.46,
            "excitement": 0.52,
            "meditation": 0.6
        },
        {
            "track_id": "spotify:track:2uisasUp51sEogjSx91Qsy",
            "engagement": 0.46,
            "happiness": 0.56,
            "excitement": 0.3,
            "meditation": 0.78
        },
        {
            "track_id": "spotify:track:2lJOKQmXQ5yiRyCTE5FyDE",
            "engagement": 0.84,
            "happiness": 0.18,
            "excitement": 0.26,
            "meditation": 0.86
        },
        {
            "track_id": "spotify:track:1CmUZGtH29Kx36C1Hleqlz",
            "engagement": 0.28,
            "happiness": 0.66,
            "excitement": 0.68,
            "meditation": 0.36
        },
        {
            "track_id": "spotify:track:1ZZH2HBk5lHv6JiqJXPmsn",
            "engagement": 0.58,
            "happiness": 0.6,
            "excitement": 0.38,
            "meditation": 0.52
        },
        {
            "track_id": "spotify:track:1jji1sWxZOo7eWnXifT7yP",
            "engagement": 0.84,
            "happiness": 0.64,
            "excitement": 0.52,
            "meditation": 0.76
        },
        {
            "track_id": "spotify:track:6nek1Nin9q48AVZcWs9e9D",
            "engagement": 0.56,
            "happiness": 0.56,
            "excitement": 0.6,
            "meditation": 0.44
        },
        {
            "track_id": "spotify:track:70cTMpcgWMcR18t9MRJFjB",
            "engagement": 0.32,
            "happiness": 0.66,
            "excitement": 0.64,
            "meditation": 0.3
        },
        {
            "track_id": "spotify:track:3zvHOVC4jikl6jORSr6OLE",
            "engagement": 0.6,
            "happiness": 0.68,
            "excitement": 0.7,
            "meditation": 0.58
        },
        {
            "track_id": "spotify:track:3lpDrxUkr0tIe1kmJvdK7d",
            "engagement": 0.22,
            "happiness": 0.54,
            "excitement": 0.74,
            "meditation": 0.34
        },
        {
            "track_id": "spotify:track:0gOyllwzM7IvfuYZ903zNv",
            "engagement": 0.56,
            "happiness": 0.76,
            "excitement": 0.54,
            "meditation": 0.46
        },
        {
            "track_id": "spotify:track:14NE9H2mqNnzTPrAKQt479",
            "engagement": 0.56,
            "happiness": 0.28,
            "excitement": 0.38,
            "meditation": 0.78
        },
        {
            "track_id": "spotify:track:0myeTJ993kXE4vN0IPchcc",
            "engagement": 0.54,
            "happiness": 0.42,
            "excitement": 0.4,
            "meditation": 0.72
        },
        {
            "track_id": "spotify:track:2xYlyywNgefLCRDG8hlxZq",
            "engagement": 0.56,
            "happiness": 0.84,
            "excitement": 0.56,
            "meditation": 0.44
        },
        {
            "track_id": "spotify:track:6B182GP3TvEfmgUoIMVUSJ",
            "engagement": 0.48,
            "happiness": 0.64,
            "excitement": 0.5,
            "meditation": 0.54
        },
        {
            "track_id": "spotify:track:2UKARCqDrhkYDoVR4FN5Wi",
            "engagement": 0.34,
            "happiness": 0.64,
            "excitement": 0.82,
            "meditation": 0.46
        },
        {
            "track_id": "spotify:track:3AJwUDP919kvQ9QcozQPxg",
            "engagement": 0.48,
            "happiness": 0.5,
            "excitement": 0.34,
            "meditation": 0.76
        },
        {
            "track_id": "spotify:track:4VqPOruhp5EdPBeR92t6lQ",
            "engagement": 0.52,
            "happiness": 0.66,
            "excitement": 0.72,
            "meditation": 0.46
        },
        {
            "track_id": "spotify:track:0S7zL7ae0KpOSPKeFQpHo8",
            "engagement": 0.46,
            "happiness": 0.6,
            "excitement": 0.76,
            "meditation": 0.46
        },
        {
            "track_id": "spotify:track:2t5RDjZmQIHf21VWunkXDm",
            "engagement": 0.58,
            "happiness": 0.4,
            "excitement": 0.5,
            "meditation": 0.54
        },
        {
            "track_id": "spotify:track:4EeC062v5HNOHEltMGI0S5",
            "engagement": 0.46,
            "happiness": 0.76,
            "excitement": 0.68,
            "meditation": 0.28
        },
        {
            "track_id": "spotify:track:7iyr2AP7JbsactrEySUyNX",
            "engagement": 0.86,
            "happiness": 0.44,
            "excitement": 0.4,
            "meditation": 0.46
        },
        {
            "track_id": "spotify:track:5oE6INocVL9viDow5y8QNM",
            "engagement": 0.56,
            "happiness": 0.54,
            "excitement": 0.52,
            "meditation": 0.8
        },
        {
            "track_id": "spotify:track:5Uf0llmR4IIkyOzkgINbL5",
            "engagement": 0.42,
            "happiness": 0.86,
            "excitement": 0.42,
            "meditation": 0.42
        },
        {
            "track_id": "spotify:track:2GAIycsMaDVtMtdvxzR2xI",
            "engagement": 0.82,
            "happiness": 0.42,
            "excitement": 0.32,
            "meditation": 0.46
        }
    ]
};

SetupProvider = function (host, port) {
//    this.db = new Db('node_mongo_Brainify', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
//    this.db.open(function () {
//    });
    var provider = this;
    var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI || "mongodb://127.0.0.1:27017";
    Db.connect(connectionString, function(err, db1) {
        if (err) {
            console.log(err);
        } else {
            provider.db = db1;
        }
    });
};

MatchProvider = require('./matchprovider').MatchProvider;
var matchProvider = new MatchProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);

// Resets the DB
SetupProvider.prototype.reset = function (callback) {

    var provider = this;
    this.db.collection('emotiv_samples', function(err, collection) {
        collection.remove({}, {w: 0});
    });
    this.db.collection('spotify_played_intervals', function(err, collection) {
        collection.remove({}, {w: 0});
    });
    this.db.collection('spotify_global_rating', function(err, collection) {
        collection.remove({}, {w: 0});
    });
    this.db.collection('spotify_private_rating', function(err, collection) {
        collection.remove({}, {w: 0});
    });
    this.db.collection('users', function(err, collection) {
        collection.remove({},{w:1}, function(error, removedNum){
            console.log("removed " + removedNum + " user records.");
            matchProvider.getUserCollection(function (error, users_collection) {
                if (error) {
                    // Log this!
                    console.log("Error: Error getting global rating collection!");
                    console.log(error);
                    callback(error);
                }
                else {
                    users_collection.insert({user_id: 0, last_sample_time:0, last_volume_action:0, last_song_action:0}, {w: 0});
                    provider.insertSongsData(callback);
                }
            });
        });
    });
};

// Inserts songs data into the DB
SetupProvider.prototype.insertSongsData = function (callback) {
    var users_counter = 0;
    var global_counter = 0;

    var users_data = SONGS_DATA.users;
    var global_data = SONGS_DATA.global;

    userProvider.getGlobalRatingCollection(function (error, global_rating_collection) {
        if (error) {
            // Log this!
            console.log("Error: Error getting global rating collection!");
            console.log(error);
            callback(error);
        } else {
            global_data.forEach(function(song_data) {
                var record = {
                    song_id:song_data.track_id,
                    samples_num: 10000,
                    meditation: song_data.meditation,
                    engagement:song_data.engagement,
                    happiness:song_data.happiness,
                    excitement:song_data.excitement
                };

                global_rating_collection.insert(record, {w: 0});
                global_counter++;
            });
        }
    });

    userProvider.getPrivateRatingCollection(function (error, private_rating_collection) {
        if (error) {
            // Log this!
            console.log("Error: Error getting global rating collection!");
            console.log(error);
            callback(error);
        } else {
            users_data.forEach(function(song_data) {
                var record = {
                    song_id:song_data.track_id,
                    user_id:song_data.user_id,
                    samples_num: 3000,
                    meditation: song_data.meditation,
                    engagement:song_data.engagement,
                    happiness:song_data.happiness,
                    excitement:song_data.excitement
                };

                private_rating_collection.insert(record, {w: 0});
                users_counter++;
            });
        }
    });

    callback(null,users_counter, global_counter);
};

exports.SetupProvider = SetupProvider;