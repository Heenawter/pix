//Server setup
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

//Database setup
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('pixdb.db');

//Setup database if it doesn't exist
db.serialize(function() {

    //Parent table "albums"
    db.run("CREATE TABLE if not exists albums (" +
        "user TEXT, " +
        "album_name TEXT, " +
        "PRIMARY KEY (user, album_name)" +
        ") without rowid");

    //Child table "images"
    //Will delete corresponding rows if row in parent is deleted
    db.run("CREATE TABLE if not exists images (" +
        "user TEXT, " +
        "album_name TEXT, " +
        "img_name TEXT, " +
        "img_src TEXT, " +
        "PRIMARY KEY (user, album_name, img_name), " +
        "FOREIGN KEY (user, album_name) REFERENCES albums (user, album_name) " +
        "ON UPDATE CASCADE ON DELETE CASCADE" +
        ") without rowid");

    //NOTE: Foreign key constraints don't work unless enabled through the sqlite3 shell.

});


//Connection
io.on('connection', function(socket){


    //add album
    socket.on('add_album', function (album) {
        //album is an object with fields client, user, and album_name

        //is the client logged in
        if (album.client !== undefined) {
            //is the client the owner of the page they're trying to add to
            if (album.client === album.user) {
                //did they name the bloody thing
                let name_without_spaces = album.album_name.replace(/ /g,"");
                if (name_without_spaces.length > 0) {
                    //check for special characters
                    let name_trimmed = album.album_name.trim();
                    let error_msg = checkName(name_trimmed);
                    if(!error_msg) {
                        socket.send("ERROR: No special characters allowed.");
                    }
                    else {
                        //check if name in use
                        db.all("SELECT album_name FROM albums WHERE (user = '"
                            + album.user + "' AND album_name = '"
                            + name_trimmed + "')", function(err,rows){

                            if (rows.length > 0) {
                                socket.send("ERROR: Name in use.");
                            } else {
                                //name not in use
                                //insert album
                                 db.run("INSERT INTO albums (user, album_name) VALUES ('"
                                 + album.user + "', '"
                                 + name_trimmed + "')");
                            }
                        });
                    }
                } else {
                    socket.send("ERROR: You need to name your album");
                }
            } else {
                socket.send("ERROR: You can't add an album to someone else's account");
            }
        } else {
            socket.send("ERROR: You're not logged in!");
        }
    });



    //delete album
    socket.on('delete_album', function (album) {
        //album is an object with fields client, user, and album_name

        //is the client logged in
        if (album.client !== undefined) {
            //is the client the owner of the page they're trying to delete from
            if (album.client === album.user) {
                //is this the last album they have?
                db.all("SELECT album_name FROM albums WHERE (user = '" + album.user + "')", function(err,rows){
                    let album_num = rows.length;

                    //remove album images
                    db.run("DELETE FROM images WHERE (user = '"
                        + album.user + "' AND album_name = '"
                        + album.album_name + "')");

                    //remove album
                    db.run("DELETE FROM albums WHERE (user = '"
                        + album.user + "' AND album_name = '"
                        + album.album_name + "')");

                    //add default album if needed
                    if (album_num === 1) {
                        db.run("INSERT INTO albums (user, album_name) VALUES ('"
                            + album.user + "', 'Default')");
                    }
                });
            } else {
                socket.send("ERROR: You can't remove an album from someone else's account");
            }
        } else {
            socket.send("ERROR: You're not logged in!");
        }
    });



    //add image
    socket.on('add_image', function (image) {
        //image is an object with fields client, user, album_name, img_name, and img_src

        //is the client logged in
        if (image.client !== undefined) {
            //is the client the owner of the page they're trying to add to
            if (image.client === image.user) {
                //did they name the bloody thing
                let name_without_spaces = image.img_name.replace(/ /g,"");
                if (name_without_spaces.length > 0) {
                    //check for special characters
                    let name_trimmed = image.img_name.trim();
                    let error_msg = checkName(name_trimmed);
                    if(!error_msg) {
                        socket.send("ERROR: No special characters allowed.");
                    }
                    else {
                        //check if name in use
                        db.all("SELECT img_name FROM images WHERE (user = '"
                            + image.user + "' AND album_name = '"
                            + image.album_name + "' AND img_name = '"
                            + name_trimmed + "')", function(err,rows){

                            if (rows.length > 0) {
                                socket.send("ERROR: Name in use.");
                            } else {
                                //name not in use
                                //insert image
                                db.run("INSERT INTO images (user, album_name, img_name, img_src) VALUES ('"
                                    + image.user + "', '"
                                    + image.album_name + "', '"
                                    + image.img_name + "', '"
                                    + image.img_src + "')");
                            }
                        });
                    }
                } else {
                    socket.send("ERROR: You need to name your image");
                }
            } else {
                socket.send("ERROR: You can't add an image to someone else's album");
            }
        } else {
            socket.send("ERROR: You're not logged in!");
        }
    });



    //delete image
    socket.on('delete_image', function (image) {
        //image is an object with fields client, user, album_name, img_name, and img_src

        //is the client logged in
        if (image.client !== undefined) {
            //is the client the owner of the page they're trying to add to
            if (image.client === image.user) {
                //remove image
                db.run("DELETE FROM albums WHERE (user = '"
                    + image.user + "' AND album_name = '"
                    + image.album_name + "' AND img_name = '"
                    + image.img_name + "')");
            } else {
                socket.send("ERROR: You can't remove an image from someone else's album");
            }
        } else {
            socket.send("ERROR: You're not logged in!");
        }
    });



    //get albums
    socket.on('get_albums', function (user) {
        db.all("SELECT album_name FROM albums WHERE (user = '" + user + "')", function(err,rows){
            //send albums to client
            socket.emit('get_albums', rows);
        });
    });



    //get album image names
    socket.on('get_album_image_names', function (album) {
        db.all("SELECT img_name FROM images WHERE (user = '"
            + album.user + "' AND album_name = '"
            + album.album_name + "')", function(err,rows){
            //send album image names to client
            socket.emit('get_album_image_names', rows);
        });
    });



    //get album images
    socket.on('get_album_images', function (album) {
        db.all("SELECT img_name, img_src FROM images WHERE (user = '"
            + album.user + "' AND album_name = '"
            + album.album_name + "')", function(err,rows){
            //send album images to client
            socket.emit('get_album_images', rows);
        });
    });



    //get image
    socket.on('get_image', function (image) {
        db.all("SELECT img_name, img_src FROM images WHERE (user = '"
            + image.user + "' AND album_name = '"
            + image.album_name + "' AND img_name = '"
            + image.img_name + "')", function(err,row){
            //send image to client
            socket.emit('get_image', row);
        });
    });

});

//Database Helper Function
//check name format
function checkName(name) {
    let good_format = true;
    let name_without_legal_chars = name.replace(/[A-Za-z0-9'" "]/g,"");

    if (name_without_legal_chars.length > 0) {
        good_format = false;
    }
    return good_format;
}

//db.close();
