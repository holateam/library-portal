var mysql = require('mysql');

const escapeStringRegexp = require('escape-string-regexp');

var configDB = require('../configDB.js');

var pool = mysql.createPool({
    host     : 'localhost',
    user     : configDB.user,
    password : configDB.password,
    database : configDB.database
});

module.exports.addBook = function (bookInfo,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO books (book_id, ISBN, title, author, description, year, pages, cover, status, event) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, NULL)", [bookInfo.isbn, bookInfo.title, bookInfo.author, bookInfo.description, bookInfo.year, bookInfo.pages, bookInfo.cover, bookInfo.status], function (err, result) {
            connection.release();
            if (err) return callback(err);
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
            if (err) return callback(err);

            var book = result[0];
                book.id = book.book_id;
                book.isbn = book.ISBN;

            delete book.book_id;
            delete book.ISBN;

            callback(null, book);
        });
    });
};

module.exports.deleteBookById = function (book_id,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("DELETE FROM books WHERE book_id = ?", [book_id] , function (err, result) {
            connection.release();
            if (err) return callback(err);
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
            if (err) return callback(err);
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
            if (err) return callback(err);
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
            if (err) return callback(err);
            if (result == false) {
                connection.query("INSERT INTO queue(book_id, email) VALUES (?,?)", [data.book_id, data.email] , function (err, result) {
                    connection.release();
                    if (err) return callback(err);
                    callback(null,true);
                });
            }else{
                connection.release();
                callback(null,false);
            }
        });
    });
};

module.exports.getQueueByBookId = function (book_id, callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT email FROM queue WHERE book_id = ?", [book_id] , function (err, result) {
            connection.release();
            if (err) return callback(err);
            callback(null,result);
        });
    });
};

module.exports.createReader = function (readerInfo,callback) {
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO readers (reader_id, name, email, phone) VALUES (NULL, ?, ?, ?);", [readerInfo.name, readerInfo.email, readerInfo.phone] , function (err, result) {
            connection.release();
            if (err) return callback(err);
            var data = {};
            data.reader_id = result["insertId"];
            callback(null, data);
        });
    });
};

module.exports.giveBookById = function (book_id, data, callback) {
    pool.getConnection(function(err, connection) {
        connection.query("INSERT INTO events (event_id, book_id, reader_id, date, term, pawn) VALUES (NULL, ?, ?, ?, ?, ?);", [book_id, data.reader_id, data.date, data.term, data.pawn] , function (err, result) {
            if (err) return callback(err);
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

module.exports.getEventById = function (event_id, callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT * FROM events WHERE event_id = ?", [event_id] , function (err, result) {
            connection.release();
            if(err) callback(err);
            var data = {};
            data.event = result[0];
            callback(null, data);
        });
    });
};

module.exports.takeBookById = function (book_id, callback) {
    pool.getConnection(function(err, connection) {
        connection.query("UPDATE books SET event = ? WHERE book_id = ?", [null, book_id] , function (err, result) {
            connection.release();
            if(err) callback(err);
            var res = result["affectedRows"]? true : false;
            callback(null,res);
        });
    });
};

module.exports.getPortionBooks = function (data, callback) {
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
        connection.query("SELECT * FROM books WHERE date >= DATE(NOW()) - INTERVAL 2 MONTH", function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,result);
        });
    });
};


module.exports.getBooks = function (data, callback) {
    var maxlimit = 1000000000; //18446744073709551615
    var limit = maxlimit;

    var offset = 0;
    var minoffset = 0;

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
        const escSearch = escapeStringRegexp(data.search);
        search ="'" + escSearch.replace(/ /g,"|").toLowerCase() + "'"; // or searchString.split(' ').join('|');
    };
    var searchStatement = search == "" ?  '1=1' : 'LOWER(b.title) REGEXP ' + search + ' OR LOWER(b.author) REGEXP ' + search + ' OR LOWER(b.description) REGEXP ' + search + ' OR LOWER(b.ISBN) REGEXP ' + search;

    var query;
    var queryTotal;
    switch (filter) {
        case "new":
            query = "SELECT b.* FROM books AS b WHERE b.date >= DATE(NOW()) - INTERVAL 2 MONTH AND " + searchStatement + " LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount FROM books AS b WHERE b.date >= DATE(NOW()) - INTERVAL 2 MONTH AND " + searchStatement;
            break;
        case "popular":
            query = "SELECT b.*, count(e.event_id) as cnt FROM books AS b LEFT JOIN events AS e USING(book_id) WHERE " + searchStatement + " GROUP BY b.book_id ORDER BY cnt DESC LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount, b.*, count(e.event_id) as cnt FROM books AS b LEFT JOIN events AS e USING(book_id) WHERE " + searchStatement + " GROUP BY b.book_id ORDER BY cnt DESC;";
            break;
        default:
            query = "SELECT b.* FROM books AS b WHERE " + searchStatement + " LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount FROM books AS b WHERE " + searchStatement;
            break;
    }

    pool.getConnection(function(err, connection) {

        connection.query(query, [limit, offset], function (err, result) {
            if (err) return callback(err);
            connection.query(queryTotal, function (err, total) {
                connection.release();
                if (err) return callback(err);

                var books = result;
                books.forEach(function(item, i, books) {

                    item.id = item.book_id;
                    item.isbn = item.ISBN;

                    delete item.book_id;
                    delete item.ISBN;
                });

                var data = {
                    books: books,
                    filter: filter,
                    search: search,
                    limit: limit,
                    offset:offset,
                    total: total[0]
                };

                callback(null, data);
            });
        });
    });
};

module.exports.getBooksForAdmin = function (data, callback) {
    var maxlimit = 1000000000; //18446744073709551615
    var limit = maxlimit;

    var offset = 0;
    var minoffset = 0;

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
        const escSearch = escapeStringRegexp(data.search);
        search ="'" + escSearch.replace(/ /g,"|").toLowerCase() + "'"; // or searchString.split(' ').join('|');
    };
    var searchStatement = search == "" ?  '1=1' : 'LOWER(b.title) REGEXP ' + search + ' OR LOWER(b.author) REGEXP ' + search + ' OR LOWER(b.description) REGEXP ' + search + ' OR LOWER(b.ISBN) REGEXP ' + search;

    var query;
    var queryTotal;
    switch (filter) {
        case "new":
            query = "SELECT b.*, ev.*, r.* FROM books AS b LEFT JOIN events AS ev ON b.event=ev.event_id LEFT JOIN readers AS r ON ev.reader_id = r.reader_id WHERE b.date >= DATE(NOW()) - INTERVAL 2 MONTH AND " + searchStatement + " LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount FROM books AS b WHERE b.date >= DATE(NOW()) - INTERVAL 2 MONTH AND " + searchStatement;
            break;
        case "popular":
            query = "SELECT b.*, ev.*, r.*, count(e.event_id) as cnt FROM books AS b LEFT JOIN events AS e USING(book_id) LEFT JOIN events AS ev ON b.event=ev.event_id LEFT JOIN readers AS r ON ev.reader_id = r.reader_id WHERE " + searchStatement + " GROUP BY b.book_id ORDER BY cnt DESC LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount, b.*, count(e.event_id) as cnt FROM books AS b LEFT JOIN events AS e USING(book_id) WHERE " + searchStatement + " GROUP BY b.book_id ORDER BY cnt DESC;";
            break;
        case "free":
            query = "SELECT b.*, ev.*, r.* FROM books AS b LEFT JOIN events AS ev ON b.event=ev.event_id LEFT JOIN readers AS r ON ev.reader_id = r.reader_id WHERE b.event IS NULL AND " + searchStatement + " LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount FROM books AS b WHERE b.event IS NULL AND " + searchStatement;
            break;
        case "onhand":
            query = "SELECT b.*, ev.*, r.* FROM books AS b LEFT JOIN events AS ev ON b.event=ev.event_id LEFT JOIN readers AS r ON ev.reader_id = r.reader_id WHERE b.event IS NOT NULL AND " + searchStatement + " LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount FROM books AS b WHERE b.event IS NOT NULL AND " + searchStatement;
            break;
        case "expired":
            query = "SELECT b.*, ev.*, r.* FROM books AS b LEFT JOIN events AS ev ON b.event=ev.event_id LEFT JOIN readers AS r ON ev.reader_id = r.reader_id WHERE DATE(NOW()) > ev.date + INTERVAL ev.term DAY AND " + searchStatement + " LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount FROM books AS b LEFT JOIN events AS ev ON b.event=ev.event_id WHERE DATE(NOW()) > ev.date + INTERVAL ev.term DAY AND " + searchStatement;
            break;
        default:
            query = "SELECT b.*, ev.*, r.* FROM books AS b LEFT JOIN events AS ev ON b.event=ev.event_id LEFT JOIN readers AS r ON ev.reader_id = r.reader_id WHERE " + searchStatement + " LIMIT ? OFFSET ?";
            queryTotal = "SELECT COUNT(b.book_id) AS amount FROM books AS b WHERE " + searchStatement;
            break;
    }

    pool.getConnection(function(err, connection) {

        connection.query(query, [limit, offset], function (err, result) {
            if (err) return callback(err);
            connection.query(queryTotal, function (err, total) {
                connection.release();
                if (err) return callback(err);

                var books = result;
                books.forEach(function(item, i, books) {

                    item.id = item.book_id;
                    item.isbn = item.ISBN;

                    delete item.book_id;
                    delete item.ISBN;
                });

                var data = {
                    books: books,
                    filter: filter,
                    search: search,
                    limit: limit,
                    offset:offset,
                    total: total[0]
                };

                callback(null, data);
            });
        });
    });
};

module.exports.find = function (word, callback) {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT * FROM books WHERE title LIKE '%"+ word +"%' OR author LIKE '%"+ word +"%' OR description LIKE '%"+ word +"%' OR ISBN LIKE '%"+ word +"%'", function (err, result) {
            connection.release();
            if(err) callback(err);
            callback(null,result);
        });
    });
};
