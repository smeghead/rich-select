Event.observe(window, 'load', function(){
	var selects = $$('select.rich');
	selects.each(function(select){
		var text = document.createElement('input');
		text.className = 'rich-select-text';
		var $select = select;
		var box = document.createElement('div');
		box.appendChild(text);
		select.observe('focus', function(){
			text.observe('keyup', function(ev){
				var input_value = ev.target.value;
				console.log(input_value);
				$A(box.childNodes).each(function(child){
					if (child.tagName.toLowerCase() == 'div') {
						box.removeChild(child);
					}
				});
				$A($select.options).each(function(sel){
					if (!sel.innerText.match(input_value)) {
						return;
					}
					var o = document.createElement('div');
					o.innerText = sel.innerText;
					o.setAttribute('data-value', sel.getAttribute('value'));
					o.observe('click', function(){
						$select.value = o.getAttribute('data-value');
					});
					box.appendChild(o);
				});
			});
			box.style.position = 'absolute';
			box.style.top = $select.offsetTop;
			box.style.left = $select.offsetLeft + $select.offsetWidth;
			$A($select.options).each(function(sel){
				console.log(sel);
				var o = document.createElement('div');
				o.innerText = sel.innerText;
				o.setAttribute('data-value', sel.getAttribute('value'));
				o.observe('click', function(){
					$select.value = o.getAttribute('data-value');
				});
				box.appendChild(o);
			});
			document.body.appendChild(box);
		});
		text.observe('click', function(elm){
		});
	});
});
