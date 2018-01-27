$(function(){

  // FUNKCJE POMOCNICZE
  function initSortable() {
    $('.card-list').sortable({
      connectWith: '.card-list',
      placeholder: 'card-placeholder'
    }).disableSelection();
  }

  // KANBAN
  var board = {
    name: 'Tablica Kanban',
    createColumn: function(column) {
      this.element.append(column.element);
      initSortable();
    },
    element: $('#board .column-container')
  };

  $('.create-column').click(function(){
      var columnName = prompt('Enter a column name');
      $.ajax({
          url: baseUrl + '/column',
          method: 'POST',
    	  data: {
              name: columnName
          },
          success: function(response){
              var column = new Column(response.id, columnName);
              board.createColumn(column);
          }
     });
  });

  // KLASA KANBAN COLUMN
  function Column(id, name) {
    var self = this;

    this.id = id;
    this.name = name || 'No name given';
    this.element = createColumn();

    function createColumn() {
      // TWORZENIE NOWYCH WĘZŁÓW
      var column = $('<div class="column"></div>');
      var columnTitle = $('<h2 class="column-title">' + self.name + '</h2>');
      var columnCardList = $('<ul class="card-list"></ul>');
      var columnDelete = $('<button class="btn-delete">x</button>');
      var columnAddCard = $('<button class="column-add-card">Dodaj kartę</button>');

      // PODPINANIE ODPOWIEDNICH ZDARZEŃ POD WĘZŁY
      columnDelete.click(function() {
        self.deleteColumn();
      });
      columnAddCard.click(function(event) {
        var cardName = prompt("Enter the name of the card");
	    event.preventDefault();
        $.ajax({
            url: baseUrl + '/card',
            method: 'POST',
            data: {
                name: cardName,
                bootcamp_kanban_column_id: self.id
            },
            success: function(response) {
            var card = new Card(response.id, cardName);
            self.createCard(card);
            }
        });
        self.createCard(new Card(cardName));
      });

      // KONSTRUOWANIE ELEMENTU KOLUMNY
      column.append(columnTitle)
      .append(columnDelete)
      .append(columnAddCard)
      .append(columnCardList);
      return column;
    }
  }
  Column.prototype = {
    createCard: function(card) {
      this.element.children('ul').append(card.element);
    },
    deleteColumn: function() {
        var self = this;
        $.ajax({
            url: baseUrl + '/column/' + self.id,
            method: 'DELETE',
            success: function(response){
                self.element.remove();
            }
        });
    }

  // KLASA KANBAN CARD
  function Card(id, name) {
    var self = this;

    this.id = id;
    this.name = name || 'No name given';
    this.element = createCard();

    function createCard() {
      var card = $('<li class="card"></li>');
      var cardDeleteBtn = $('<button class="btn-delete">x</button>');
      var cardDescription = $('<p class="card-description"></p>');
      cardDeleteBtn.click(function(){
        self.removeCard();
      });
      card.append(cardDeleteBtn);
      cardDescription.text(self.name);
      card.append(cardDescription)
      return card;
    }
  }
  Card.prototype = {
    removeCard: function() {
        var self = this;
        $.ajax({
            url: baseUrl + '/card/' + self.id,
            method: 'DELETE',
            success: function(){
                self.element.remove();
            }
        });    
    }
  }

  // TWORZENIE NOWYCH EGZEMPLARZY KOLUMN
  var todoColumn = new Column('Do zrobienia');
  var doingColumn = new Column('W trakcie');
  var doneColumn = new Column('Skończone');

  // DODAWANIE KOLUMN DO TABLICY
  board.createColumn(todoColumn);
  board.createColumn(doingColumn);
  board.createColumn(doneColumn);

  // TWORZENIE NOWYCH EGZEMPLARZY KART
  var card1 = new Card('Nowe zadanie');
  var card2 = new Card('stworzyc tablice kanban');

  // DODAWANIE KART DO KOLUMN
  todoColumn.createCard(card1);
  doingColumn.createCard(card2);
    
  var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
  var myHeaders = {
  'X-Client-Id': 'X-Client-Id',
  'X-Auth-Token': 'X-Auth-Token'
  };
    
  $.ajaxSetup({
      headers: myHeaders
  });
    
  $.ajax({
      url: baseUrl + '/board',
      method: 'GET',
      success: function(response) {
          setupColumns(response.columns);
    }
  });
    
  function setupColumns(columns) {
      columns.forEach(function (column) {
          var col = new Column(column.id, column.name);
          board.createColumn(col);
      });
  }
    
  function setupColumns(columns) {
      columns.forEach(function (column) {
          var col = new Column(column.id, column.name);
          board.createColumn(col);
          setupCards(col, column.cards);
      });
  }
    
  function setupCards(col, cards) {
      cards.forEach(function (card) {
          var card = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
          col.createCard(card);
  	  })
  }
    
})
