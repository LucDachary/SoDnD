/*
 * TODO : reformuler
 * Set this boolean to true when a draggable element has successfuly
 * been dropped. Then we know we can remove the original element.
 *
 * When catching dragend event, if it still is false, then the draggable
 * element has has not been moved successfuly.
 */
dnd_successful = false;

/*
 * Set all the <span> and <img> DnD events up.
 * Most of the browser have already set <img> DnD events up, but we
 * override them to define a specific behavior.
 */
//TODO : check why it doesn't work
/*
var spans = document.getElementsByTagName('span');
var imgs = document.getElementsByTagName('img');
var draggables = spans.concat(imgs);
*/

var draggables = new Array();
var spans = document.getElementsByTagName('span');
var imgs = document.images;
for(var k = 0; k < spans.length; k++)
{
	draggables.push(spans[k]);
}
for(var j = 0; j < imgs.length; j++)
{
	draggables.push(imgs[j]);
}

for(var i = 0; i < draggables.length; i++)
{
	draggables[i].addEventListener('dragstart', function(event){
		event.target.style.background = "green";

		/* Allow specific type of transfers */
		event.dataTransfer.effectAllowed = "move";

		/* 
		 * Set the data to send to the dropzone.
		 * Two cases :
		 * 1 - it is a picture, make a text/html data string.
		 * 2 - it is plain text, make a simple text/plain data string.
		 */
		var src = event.target.getAttribute('src');
		var alt = event.target.getAttribute('alt');
		if(null != src) //Case 1
			event.dataTransfer.setData("text/html", '<img src="' + src + '" alt="' + alt + '"/>');
		else //Case 2
			event.dataTransfer.setData("text/plain", event.target.innerText || event.target.textContent);

		dnd_successful = false;
	});

	draggables[i].addEventListener('drag', function(event){
		/*
		 * This event is called permanently while the 
		 * draggable element is moved by the user.
		 */
	});

	draggables[i].addEventListener('dragend', function(event){
		if(dnd_successful)
			event.target.parentNode.removeChild(event.target);
		else
			event.target.style.background = 'white';
	});
}

var dropzone = document.getElementById('mydropzone');

dropzone.addEventListener('dragenter', function(event){
	event.target.style.background = "#CCCCCC";
	event.preventDefault();
});

dropzone.addEventListener('dragleave', function(event){
	event.target.style.background = "white";
});

dropzone.addEventListener('dragover', function(event){
	/*
	 * Allow the moves
	 */
	event.dataTransfer.dropEffect = "move";
	/*
	 * Override the default behavior which consist
	 * to avoid any DnD operation.
	 */
	event.preventDefault();
	return false;
});


dropzone.addEventListener('drop', function(event){
	var mylist = document.getElementById('mylist');
	mylist.style.visibility = "visible";

	/*
	 * Two cases :
	 * 1 - there is a text/html content, certainly a picture.
	 * 2 - there is a text/plain content, make a <span>.
	 */
	var html = event.dataTransfer.getData("text/html");
	if("" != html) //Case 1
	{
		mylist.innerHTML += html;
	}
	else
	{
		var span = document.createElement('span');
		span.innerHTML = event.dataTransfer.getData("text/plain");
		mylist.appendChild(span);
	}

	event.target.style.background = 'white';
	dnd_successful = true;

	event.preventDefault(); //Prevent Firefox from redirecting the page
});
