var mysql= require('mysql');

var pool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '1q2w3e4r',
    database : 'library'
});

module.exports.addBook = function (bookInfo,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO books (book_id, title, author, description, year, pages, cover, status, event) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, NULL)", [bookInfo.title, bookInfo.author, bookInfo.description, bookInfo.year, bookInfo.pages, bookInfo.cover, bookInfo.status], function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,result["insertId"]);
        });
    });
};

module.exports.getBook = function (book,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT * FROM books WHERE book_id = ?", [book.book_id] , function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,result);
        });
    });
};

module.exports.getBooks = function (filter,callback) {
    var quary;
    switch (filter) {
        case "all":
            quary = "SELECT * FROM books;";
            break;
        case "new":
            quary = "SELECT * FROM books WHERE status = 1;";
            break;
        case "popular":
            quary = "SELECT * FROM books WHERE status = 0;";
    }
    pool.getConnection(function(err, connection) {
        connection.query(quary, function (err, result) {
            connection.release();
            if(err) callback(err);
            var res = JSON.stringify(result);
            callback(null,res);
        });
    });
};

module.exports.deleteBook = function (book,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("DELETE FROM books WHERE book_id = ?", [book.book_id] , function (err, result) {
            connection.release();
            if(err) callback(err);
            var res = result["affectedRows"]? true : false;
            callback(null,res);
        });
    });
};

module.exports.updateBook = function (book, changedFields, callback) {
    var query = "UPDATE books SET ";
    for (var key in changedFields) {
        query += key + " = " + changedFields[key] + ", ";
    }
    query = query.substring(0, query.length - 2);
    query += " WHERE book_id = " + book.book_id + ";";
    pool.getConnection(function(err, connection) {
        connection.query(query, function (err, result) {
            connection.release();
            if(err) callback(err);
            var res = result["affectedRows"]? true : false;
            callback(null,res);
        });
    });
};

module.exports.addToQueue = function (data,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT * FROM queue WHERE book_id = ? AND email = ?", [data.book_id, data.email] , function (err, result) {
            if(err) callback(err);
            if(result == false){
                connection.query("INSERT INTO queue(book_id, email) VALUES (?,?)", [data.book_id, data.email] , function (err, result) {
                    connection.release();
                    if(err) callback(err);
                    callback(null,true);
                });
            }else{
                connection.release();
                callback(null,false);
            }
        });
    });
};

module.exports.getQueue = function (book,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT email FROM queue WHERE book_id = ?", [book.book_id] , function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,JSON.stringify(result));
        });
    });
};

module.exports.createReader = function (readerInfo,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO readers (reader_id, name, email, phone) VALUES (NULL, ?, ?, ?);", [readerInfo.name, readerInfo.email, readerInfo.phone] , function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,result["insertId"]);
        });
    });
};

module.exports.giveBook = function (data,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO events (event_id, book_id, reader_id, date, term, pawn) VALUES (NULL, ?, ?, ?, ?, ?);", [data.book_id, data.reader_id, data.date, data.term, data.pawn] , function (err, result) {
            if(err) callback(err);
            var res = result["insertId"];
            connection.query("UPDATE books SET event = ? WHERE book_id = ?",  [res, data.book_id], function (err,result){
                connection.release();
                callback(null,res);
            });
        });
    });
};

module.exports.takeBook = function (book,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("UPDATE books SET event = ? WHERE book_id = ?", [null, book.book_id] , function (err, result) {
            connection.release();
            if(err) callback(err);
            var res = result["affectedRows"]? true : false;
            callback(null,res);
        });
    });
};