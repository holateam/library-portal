/* ----------------------------- begin view ----------------------------------*/
var view = {
  showElement: function (element) {
    for (var i = 0; i < arguments.length; i++)
      $(arguments[i]).css('display', 'block');
  },
  hideElement: function (element) {
    for (var i = 0; i < arguments.length; i++)
      $(arguments[i]).css('display', 'none');
  },
  showErrEmail: function () {
    var c = '.input-group';
    $(c).removeClass('has-success');
    $(c).addClass('has-error');
    view.hideElement('.glyphicon-ok');
    view.showElement('.glyphicon-remove');
  },
  showSuccessEmail: function () {
    var c = '.input-group';
    $(c).removeClass('has-error');
    $(c).addClass('has-success');
    view.hideElement('.glyphicon-remove');
    view.showElement('.glyphicon-ok');
  },
  addBookItem: function (book) {
    return $('#pattern').html()
      .replace(/{id}/g, book.id)
      .replace(/{title}/g, book.title)
      .replace(/{author}/g, book.author);
  },
  addBooksItems: function (books, doClean) {
    var content = $('#content');
    var contentHTML = ((doClean) ? '' : content.html());

    for (var i in books) {
      contentHTML += view.addBookItem(books[i]);
    }

    content.html(contentHTML);
    $('.blockI').matchHeight(); // Aligns all the height of the book
  },
  showZeroSearch: function (searchText, pathUrl) {
    if (pathUrl === '') {
      $('#content .row> :not(#pattern)').remove();
    } else {
      $('#bookID').remove();
      $('#content .row .book_list_row:not(#pattern)').remove();
    }
    $('#zero_search').remove();
    var textZeroSearch = '<div id="zero_search"><div class="col-md-2 col-sm-2 col-lg-2"><img src="/img/books/no-cover.jpg"></div><div class="col-md-10 col-sm-10 col-lg-10"><h3>Find "' + searchText + '" was harder than we thought</h3> <p>Please ensure that the request is correct or reframe it.</p></div></div></div>';
    $('#content .row').append(textZeroSearch);
  },
  nullToDash: function (string) {
    return (((string == null) || (string == 0)) ? '-' : string);
  },

  addBooksListRow: function (book) {
    var date;
    if (book.date) {
      date = new Date(book.date);
      date.setDate(date.getDate() + book.term);
      date = date.toDateString();
    }

    return $('#pattern').html()
      .replace(/{id}/g, book.id)
      .replace(/{title}/g, book.title)
      .replace(/{author}/g, book.author)
      .replace(/{name}/g, view.nullToDash(book.name))
      .replace(/{email}/g, view.nullToDash(book.email))
      .replace(/{phone}/g, view.nullToDash(book.phone))
      .replace(/{date}/g, view.nullToDash(date))
      .replace(/{pawn}/g, view.nullToDash(book.pawn));
  },

  addBooksList: function (books) {
    var content = $('#table_content');
    var contentHTML = '';

    for (var i in books) {
      console.log(view.addBooksListRow(books[i]));
      contentHTML += view.addBooksListRow(books[i]);
    }

    content.html(contentHTML);

    $('.book_list_row').click(function () {
      $(location).attr('href', 'admin/book/' + $(this).attr('data-book-id'));
    });
  },

  fillBookInfo: function (book) {
    $('#bookID').attr('book-id', book.id);
    $('#bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
    $('#titleBook').html(book.title);
    $('#author').html(book.author);
    $('#year').html(book.year);
    $('#pages').html(book.pages);
    $('#isbn').html(book.isbn);
    $('#bookDescriptionText').html(book.description);
    $('#bookID').attr('busy', book.event);

    var nameClassIsBook = (book.event === null) ? '.freeBook' : '.busyBook';
    $(nameClassIsBook).css('display', 'block');
  },
  normalDateFormat: function (date) {
    return date.toISOString().substring(0, 10);
  },
  addPopUpBlock: function (title, text) {
    $('#main').after('<div id="test-modal" class="mfp-hide white-popup-block"><h1>' + title + '</h1><p>' + text + '</p><p><a class="popup-modal-dismiss" href="#">X</a></p></div>');
  },

  showError: function (text) {
    swal('Ооопс!', text, 'error');
  },

  showSuccess: function (text) {
    swal('Отлично!', text, 'success');
  },

  showSubscribe: function (text, bookId) {
    swal({
        title: 'Отлично!',
        text: text,
        type: 'input',
        showCancelButton: true,
        closeOnConfirm: false,
        animation: 'slide-from-top',
        inputPlaceholder: 'Введи свой e-mail',
        showLoaderOnConfirm: true
      },
      function (inputValue) {
        if (inputValue === false) {
          return false;
        }

        if (!controller.validateEmail(inputValue)) {
          swal.showInputError('Ты где-то ошибся. Проверь введенные данные.');
          return false;
        }

        doAjaxQuery('GET', '/books/' + bookId + '/order', inputValue, function (res) {
          this.showSuccess('Твой e-mail ' + inputValue + '\nдобавлен в список ожидания.');
        });
      });
  }
};
/* ------------------------------- end view ----------------------------------*/

/* --------------------------- begin controller ------------------------------*/
var controller = {
  validateEmail: function (value) {
    var regex = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,10}$/;
    return regex.test(value);
  }
};
/* --------------------------- end controller --------------------------------*/


/* ------------------------ Jquery Ajax function ---------------------------- */

function doAjaxQuery(method, url, data, callback) {
  $.ajax({
    type: method,
    url: url,
    contentType: 'application/json',
    dataType: 'json',
    data: ((method == 'POST') ? JSON.stringify(data) : data),
    success: function (res) {
      if (!res.success) {
        view.showError(res.msg);
        return;
      }
      callback(res);
    },
    error: function (jqXHR, textStatus) {
      view.showError('Ошибка ' + textStatus);
    }
  });
}

$(function () {
  $('.popup-modal').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#username',
    modal: true
  });
  $(document).on('click', '.popup-modal-dismiss', function (e) {
    e.preventDefault();
    $.magnificPopup.close();
  });
});

var global = {
  view_limit_on_page_load: 12,
  total_items_exist: Number.POSITIVE_INFINITY,
  number_of_items_onscroll: 6
};
