var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
    'X-Client-Id': '2744',
    'X-Auth-Token': '7e191582435097cdc621e4c81b997d2a'
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
        setupCards(col, column.cards);
        
        calcWidth();
    });
}

function setupCards(col, cards) {
	cards.forEach(function (card) {
        var card = new Card(card.id, card.name, card.bootcamp_kanban_column_id);
    	col.createCard(card);
  	})
}

function calcWidth() {
    var columns = $('.column');
    var width = (100 / columns.length) + '%';
        
    columns.width(width);     
}

var colorButton = $('input');
    
colorButton.change(function(){
    var cards = $('.card-description');
    cards.css('color', colorButton.val());
});
    