var mysql = require('mysql');
var configDB = require('../configDB.js');

var pool = mysql.createPool({
    host     : 'localhost',
    user     : configDB.user,
    password : configDB.password,
    database : configDB.database
});

module.exports.addBook = function (bookInfo,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO books (book_id, title, author, description, year, pages, cover, status, event) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, NULL)", [bookInfo.title, bookInfo.author, bookInfo.description, bookInfo.year, bookInfo.pages, bookInfo.cover, bookInfo.status], function (err, result) {
            connection.release();
            if(err) callback(err);
            var data = {};
            data.id = result["insertId"];
            callback(null, data);
        });
    });
};

module.exports.getBook = function (book_id,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT * FROM books WHERE book_id = ?", [book_id] , function (err, result) {
            connection.release();
            if(err) callback(err);
            var book = {
                    "id": result[0].book_id,
                    "isbn": result[0].isbn,
                    "title": result[0].title,
                    "author": result[0].author,
                    "description": result[0].description,
                    "year": result[0].year,
                    "cover": result[0].cover,
                    "pages": result[0].pages,
                    "status": result[0].status,
                    "busy": result[0].event  == null? false : true
            };
            callback(null, book);
        });
    });
};

module.exports.getBooks = function (filter,callback) {
    var quary;
    var queryTotal;
    switch (filter) {
        case "new":
            quary = "SELECT * FROM books WHERE status = 1;";
            queryTotal = "SELECT COUNT (book_id) AS amount FROM books WHERE status = 1;";
            break;
        case "popular":
            quary = "SELECT * FROM books WHERE status = 0;";
            queryTotal = "SELECT COUNT (book_id) AS amount FROM books WHERE status = 0;";
            break;
        default:
            quary = "SELECT * FROM books;";
            queryTotal = "SELECT COUNT (book_id) AS amount FROM books";
            break;
    }
    pool.getConnection(function(err, connection) {
        connection.query(quary, function (err, result) {
            if(err) callback(err);
            connection.query(queryTotal, function (err, total) {
                connection.release();
                if(err) callback(err);
                //var res = JSON.stringify(result);
                var books=[];
                result.forEach(function(item, i, result) {
                    books.push(
                        {
                            "id": result[i].book_id,
                            "isbn": result[i].isbn,
                            "title": result[i].title,
                            "author": result[i].author,
                            "description": result[i].description,
                            "year": result[i].year,
                            "cover": result[i].cover,
                            "pages": result[i].pages,
                            "status": result[i].status,
                            "busy": result[0].event  == null? false : true
                        }
                    );
                });
                var data = {};
                data.filter = filter;
                data.books = books;
                data.total = total[0]['amount'];
                callback(null, data);
            });
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

module.exports.deleteBookById = function (book_id,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("DELETE FROM books WHERE book_id = ?", [book_id] , function (err, result) {
            connection.release();
            if(err) callback(err);
            var data={};
            data.affectedRows = result["affectedRows"];
            var res = result["affectedRows"]? true : false;
            callback(null, data);
        });
    });
};

module.exports.deleteBookWithIdInList = function (ids_array,callback) {
    pool.getConnection(function(err, connection) {
//        var placeholders = Array(ids_array.length + 1).join('?').split('').join();
        var placeholders = '?,'.repeat(ids_array.length - 1) + '?';
        var querystring = "DELETE FROM books WHERE book_id IN (" + placeholders + ")";
        connection.query(querystring, ids_array, function (err, result) {
            connection.release();
            if(err) callback(err);
            var data={};
            data.affectedRows = result["affectedRows"];
            var res = result["affectedRows"]? true : false;
            callback(null, data);
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
            callback(null,result);
        });
    });
};

module.exports.getQueueByBookId = function (book_id, callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT email FROM queue WHERE book_id = ?", [book_id] , function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,result);
        });
    });
};

module.exports.createReader = function (readerInfo,callback) {
    console.log(readerInfo);
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO readers (reader_id, name, email, phone) VALUES (NULL, ?, ?, ?);", [readerInfo.name, readerInfo.email, readerInfo.phone] , function (err, result) {
            connection.release();
            if(err) callback(err);
            var data = {};
            data.reader_id = result["insertId"];
            callback(null, data);
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

module.exports.giveBookById = function (book_id, data, callback) {
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO events (event_id, book_id, reader_id, date, term, pawn) VALUES (NULL, ?, ?, ?, ?, ?);", [book_id, data.reader_id, data.date, data.term, data.pawn] , function (err, result) {
            if(err) callback(err);
            var res = result["insertId"];
            connection.query("UPDATE books SET event = ? WHERE book_id = ?",  [res, data.book_id], function (err,result){
                connection.release();
                var data = {};
                data.event_id = res;
                callback(null, data);
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

module.exports.getBooksTest = function (filter, callback) {

	if (filter == 0) {
        var err = new Error('This will crash');
		callback(err);
	} else {
        var result = {
            "success": true,
            "data": {
                "total" : 100,
                "offset" : 111,
                "limit" : 22,
                "filter" : filter,
                "books" : [
                    {
                        "id": 33,
                        "title": "...",
                        "authors": "...",
                        "busy": false,
                        "year" : 2015,
                        "new" : true
                    },
                ]
            }
        };

//        var res = JSON.stringify(result);
    	callback(null, result);
	}
};

module.exports.getPortionBooks = function (data,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT * FROM books LIMIT ? OFFSET ?", [data.limit, data.offset] , function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,result);
        });
    });
};

module.exports.getPopular = function (callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT book_id, COUNT(book_id) AS cnt FROM events GROUP BY book_id ORDER BY cnt DESC", function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,result);
        });
    });
};

module.exports.getNew = function (callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT * FROM books WHERE date >= curdate() - 60", function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,result);
        });
    });
};
