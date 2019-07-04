document.onreadystatechange = function () {
	if (document.readyState == "complete") {
    restore_options() 	  
	  document.addEventListener('DOMContentLoaded', restore_options);
	  document.getElementById('save').addEventListener('click', save_options);
	  document.getElementById('add').addEventListener('click', add_user);
	  document.getElementById('delete').addEventListener('click', delete_user);	  
	}
};

function tableToJSON(table) {
    var data = [];

    // first row needs to be headers
    var headers = ['name', 'glyph', 'color', 'note'];

    // go through cells
    for (var i=0; i<table.rows.length; i++) {

        var tableRow = table.rows[i];
        var rowData = {};

        for (var j=0; j<tableRow.cells.length; j++) {

            rowData[ headers[j] ] = tableRow.cells[j].innerText;

        }

        data.push(rowData);
    }       

    return data;
}

function add_user(){
	  
  $('#food tr:last').after(
      "<tr>" +
        "<td>username</td>" +
        "<td>&copy;</td>" +
        "<td>green</td>" +
        "<td>Reason to tag me.</td>" +
      "</tr>"
  );
  
}

function delete_user(){
	$(this).closest('tr').remove();
}

// Saves options to chrome.storage
function save_options() {
	
  var color = document.getElementById('color').value;
  var twitterati = tableToJSON(document.getElementById('food'));
    
  chrome.storage.sync.set({
	twitterati: twitterati,
    favoriteColor: color
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' 
  chrome.storage.sync.get({
	  twitterati: [{ "name": "", "glyph": "卐", "color": "brown", "note": "Enter description"}],
    favoriteColor: 'red'
  }, function(items) {
  	
		var Food = items.twitterati;

		var Th = { $type: "tr", $components: [
				{ $type: "th", $text: "Name" },
				{ $type: "th", $text: "Glyph" },
				{ $type: "th", $text: "Color" },
				{ $type: "th", $text: "Notes" }
			]}

		var Tr = function(item){
			return { $type: "tr", $components: [
				{ $type: "td", $text: item.name },
				{ $type: "td", $text: item.glyph },
				{ $type: "td", $text: item.color },
				{ $type: "td", $text: item.note }
			]}
		}
		var Table = {
			$cell: true, $type: "table", class: "table", id: "food", contenteditable: "true", $components: [
				{ $type: "tbody", $components: Food.map(Tr) }
			]
		}
    document.getElementById('color').value = items.favoriteColor;
    document.getElementById('foods').$cell(Table);
  });
}
