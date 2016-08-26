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

module.exports.updateBookById = function (book_id, changedFields, callback) {
    var query = "UPDATE books SET ";
    for (var key in changedFields) {
        query += key + " = " + changedFields[key] + ", ";
    }
    query = query.substring(0, query.length - 2);
    query += " WHERE book_id = " + book_id + ";";
    pool.getConnection(function(err, connection) {
        connection.query(query, function (err, result) {
            connection.release();
            if(err) callback(err);
            var data={};
            data.affectedRows = result["affectedRows"];
//            var res = result["affectedRows"]? true : false;
            callback(null, data);
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
            connection.query("UPDATE books SET event = ? WHERE book_id = ?",  [res, book_id], function (err,result){
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

module.exports.getPortionBooks = function (data, callback) {
    pool.getConnection(function(err, connection) {
        console.log("data.limit: " + data.limit);
        console.log("data.offset: " + data.offset);
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


module.exports.getBooksAlt = function (data, callback) {
    var maxlimit = parseInt(1000000000); //18446744073709551615
    var limit = maxlimit;

    var offset = parseInt(0);
    var minoffset = parseInt(0);

    var filter = "all";

    var search = "";

    if (data.filter) {
        filter = data.filter;
    };

    if (data.limit) {
        limit = parseInt(data.limit);
    };

    if (data.offset) {
        offset = parseInt(data.offset);
    };

    if (data.search) {
        search ="'" + data.search.replace(/ /g,"|") + "'"; // or searchString.split(' ').join('|');
    };
    var searchStatement = search == "" ?  '1=1' : 'b.title REGEXP ' + search + ' OR b.author REGEXP ' + search + ' OR b.description REGEXP ' + search + ' OR b.ISBN REGEXP ' + search;
    console.log("searchStatement: " + searchStatement);

    var quary;
    var queryTotal;
    switch (filter) {
        case "new":
            quary = "SELECT b.* FROM books AS b WHERE b.date >= curdate() - 60 AND " + searchStatement + " LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount FROM books AS b WHERE b.date >= curdate() - 60 AND " + searchStatement;
            break;
        case "popular":
            quary = "SELECT b.*, count(e.event_id) as cnt FROM books AS b LEFT JOIN events AS e USING(book_id) WHERE " + searchStatement + " GROUP BY b.book_id ORDER BY cnt DESC LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount, b.*, count(e.event_id) as cnt FROM books AS b LEFT JOIN events AS e USING(book_id) WHERE " + searchStatement + " GROUP BY b.book_id ORDER BY cnt DESC;";
            break;
        default:
            quary = "SELECT b.* FROM books AS b WHERE " + searchStatement + " LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount FROM books AS b WHERE " + searchStatement;
            break;
    }

    pool.getConnection(function(err, connection) {
        console.log(limit);
        console.log("quary: " + quary);
        console.log("queryTotal: " + queryTotal);

        connection.query(quary, [limit, offset], function (err, result) {
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
                            "isbn": result[i].ISBN,
                            "title": result[i].title,
                            "author": result[i].author,
                            "description": result[i].description,
                            "year": result[i].year,
                            "cover": result[i].cover,
                            "pages": result[i].pages,
                            "status": result[i].status,
                            "busy": result[i].event  == null? false : true
                        }
                    );
                });
                var data = {};
                data.filter = filter;
                data.books = books;
                //data.total = total[0]['amount'];
                data.total = total[0];
                callback(null, data);
            });
        });
    });
};

module.exports.find = function (word, callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT * FROM books WHERE title LIKE '%"+ word +"%' OR author LIKE '%"+ word +"%' OR description LIKE '%"+ word +"%' OR ISBN LIKE '%"+ word +"%'", function (err, result) {
            connection.release();
            console.log(result);
            if(err) callback(err);
            callback(null,result);
        });
    });
};
