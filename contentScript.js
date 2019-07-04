// contentScript.js

//deal with newly loaded tweets
function DOMModificationHandler(){
    $(this).unbind('DOMSubtreeModified.event1');
    setTimeout(function(){
        modify();
        $('#timeline').bind('DOMSubtreeModified.event1',DOMModificationHandler);
    },10);
};

$('#timeline').bind('DOMSubtreeModified.event1',DOMModificationHandler);

function modify(){
     
  $('.username.u-dir.u-textTruncate > b').each(function(index){
		username = $(this).html()
		addTag($(this), username); 
  });  
  
  $('.js-retweet-text > a').each(function(index){
		username = $(this)[0].pathname;
		username = username.replace(/^\/+/g, '');
		addTag($(this), username); 
  });  

};

function addTag(tag, name){
	

  const troll = '&#9773;';
 
  
	if (/.*[\d]{8}/i.test(name)) {
		
		if (/troll/i.test(name)) return
		
    console.log('Adding troll tags');
		markup = `<span class="troll red">&nbsp;${troll}</span>`
		tag.html(markup);
	}
    
  chrome.storage.sync.get({ twitterati: [], favoriteColor: 'red'}, 
		function(items) { 

			items.twitterati.forEach(function(user, index){
				if (user.name == name){
					markup = `${user.name}&nbsp;&nbsp;<a class="troll ${user.color}" title="${user.note}">${user.glyph}</a>`
					tag.html(markup);
				}
			});
	  
    }
  );  
   
	
}
