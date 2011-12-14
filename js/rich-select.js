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
                        if( name.indexOf( "-" ) != -1 ) name = name.camelize();
                        return  obj.currentStyle[ name ];
                } else if ( getComputedStyle ) { //Mozilla or Opera or Safari
                        return document.defaultView.getComputedStyle( obj, '' ).getPropertyValue( name );
                }
                return null;
        };
        var selects = $$('select.rich');
        selects.each(function(select){
                var text = document.createElement('input');
                text.className = 'rich-select-text';
                var copy_styles = $A([
                        'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
                        'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
                        'font'
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
                                if (input_value && !sel.innerText.match(input_value)) {
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
                                o.setAttribute('data-value', sel.getAttribute('value'));
                                o.observe('click', function(){
                                        $select.value = o.getAttribute('data-value');
                                        $select.parentNode.removeChild(box);
                                        $select.style.display = $select.getAttribute('data-orgdisplay');
                                });
                                box.appendChild(o);
                        };
                };

                box.appendChild(text);
                select.observe('focus', function(){
                        text.observe('keyup', function(ev){
                                var input_value = ev.target.value;
                                $A(box.childNodes).each(function(child){
                                        if (child.tagName.toLowerCase() == 'div') {
                                                box.removeChild(child);
                                        }
                                });
                                $A($select.options).each(setupSelectionFunc(input_value));
                        });
                        $select.setAttribute('data-orgdisplay', $select.style.display);
                        $select.style.display = 'none';
                        box.style.position = 'absolute';
                        var pos = getElementPosition($select);
                        box.style.top = pos.top;
                        box.style.left = pos.left;
                        $A(box.childNodes).each(function(child){
                                if (child.tagName.toLowerCase() == 'div') {
                                        box.removeChild(child);
                                }
                        });
                        $A($select.options).each(setupSelectionFunc(''));
                        $select.parentNode.appendChild(box);
                });
                text.observe('click', function(elm){
                });
        });

        //style
        var s = document.createElement('style');
        s.innerText = '' +
                '.rich-select {border: 1px solid gray;}' +
                '.rich-select-option {background-color: #eee;cursor: pointer;}' +
                '.rich-select-option-alt {background-color: #ddd;}' +
                '' +
                '' +
                '' +
                '' +
                '';
        document.body.appendChild(s);
});

//  vim: set ts=4 sw=4 sts=4 expandtab fenc=utf-8:

