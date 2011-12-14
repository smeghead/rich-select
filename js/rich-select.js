Event.observe(window, 'load', function(){
  var getElementPosition = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (element.position == 'absolute') break;
                
      element = element.offsetParent || element.parentNode;
    } while (element);

    // if it has scrolled.
    valueT += document.documentElement.scrollTop || document.body.scrollTop || 0;
    valueL += document.documentElement.scrollLeft || document.body.scrollLeft || 0;
    
    return {left: valueL, top: valueT};
  };

  var computedStyle = function(obj, name) {
    if( obj.currentStyle ) { //IE or Opera
      if (name.indexOf("-") != -1) name = name.camelize();
      return  obj.currentStyle[name];
    } else if (getComputedStyle) { //Mozilla or Opera or Safari
      return document.defaultView.getComputedStyle(obj, '').getPropertyValue(name);
    }
    return null;
  };

  var last_keypressed = new Date().getTime();

  $$('select').each(function(select){
    if (select.options.length <= 31) {
      return;
    }
    var text = document.createElement('input');
    text.className = 'rich-select-text';
    var copy_styles = $A([
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left'
    ]);
    var $select = select;
    copy_styles.each(function(elm) {
      text.style[elm] = computedStyle($select, elm);
    });                     
    var box = document.createElement('div');
    box.className = 'rich-select';
    var setupSelectionFunc = function(input_value) {
      var alt = '';
      return function(sel){
        if (input_value && !sel.innerText.match(new RegExp(input_value, 'i'))) {
          return;
        }
        var o = document.createElement('div');
        o.className = 'rich-select-option';
        if (alt.length > 0) {
          o.className += ' ' + alt;
          alt = '';
        } else {
          alt = 'rich-select-option-alt';
        }
        o.innerText = sel.innerText;
        var current_value = sel.getAttribute('value');
        o.setAttribute('data-value', current_value);
        if ($F($select) == current_value) {
          o.className += ' rich-select-option-current';
        }
        o.observe('click', function(){
          $select.value = o.getAttribute('data-value');
          $select.parentNode.removeChild(box);
          $select.style.display = $select.getAttribute('data-orgdisplay');
          link.style.display = 'inline';
        });
        box.appendChild(o);
      };
    };

    box.appendChild(text);

    var link = document.createElement('span');
    link.className = 'rich-select-trigger';
    link.innerHTML = '&nbsp;&nbsp;&nbsp;';
    link.setAttribute('title', 'searchable select interface.');
    link.observe('click', function(ev){
      text.observe('keyup', function(ev){
        var input_value = ev.target.value;
        last_keypressed = new Date().getTime();
        setTimeout(function(){
          if (new Date().getTime() < last_keypressed + 500) {
            return;
          }
          $A(box.childNodes).each(function(child){
            if (child.tagName.toLowerCase() == 'div') {
              box.removeChild(child);
            }
          });
          $A($select.options).each(setupSelectionFunc(input_value));
        }, 500);
      });
      $select.setAttribute('data-orgdisplay', $select.style.display);
      $select.style.display = 'none';
      link.style.display = 'none';
      box.style.position = 'absolute';
      var pos = getElementPosition($select);
      box.style.top = pos.top;
      box.style.left = pos.left;
      $A(box.childNodes).each(function(child){
        if (child.tagName.toLowerCase() == 'div') {
          box.removeChild(child);
        }
      });
      $A($select.options).each(setupSelectionFunc($F(text)));
      $select.parentNode.appendChild(box);
      text.focus();
      Event.stop(ev);
      document.body.observe('click', function(ev){
        Event.stop(ev);
        if (box.parentNode == null) return;
        Element.remove(box);
        $select.style.display = $select.getAttribute('data-orgdisplay');
        link.style.display = 'inline';
      });
    });
    select.insert({after: link});
    select.observe('focus', function(){
    });
    text.observe('click', function(elm){
    });
  });
  //style
  var s = document.createElement('style');
  s.innerText = '' +
    '.rich-select-text {border: 1px solid gray; }' +
    '.rich-select {height:400px; overflow: scroll; z-index: 1000;}' +
    '.rich-select-option {background-color: #eee;cursor: pointer; font-size: 90%; padding: 0px 5px;}' +
    '.rich-select-option:hover {background-color: #ccf;cursor: pointer; font-size: 90%;}' +
    '.rich-select-option-alt {background-color: #ddd;}' +
    '.rich-select-trigger {cursor: pointer; vertical-align: middle; margin: 5px; background-color: #eef; border: 1px solid #dde; border-radius: 8px;}' +
    '';
  document.body.appendChild(s);
});
//  vim: set ts=2 sw=2 sts=2 expandtab fenc=utf-8:
