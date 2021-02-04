const electron = require('electron');
const { ipcRenderer } = electron;
const ul = document.querySelector('#list');

//add item
ipcRenderer.on('item:add', function(e, item){
    ul.className = "collection"
    const li = document.createElement('li');
    const itemText= document.createTextNode(item);
    li.appendChild(itemText);
    ul.appendChild(li);
});


//clear items
ipcRenderer.on('item:clear', function(){
    ul.innerHTML= '';
    ul.className = '';
});

//remove item
ul.addEventListener('dblclick', removeItem );

function removeItem(e){
    e.target.remove();
    if(ul.children.length ==0){
        ul.className = '';
    }
};
