let defaults = {
    el: '.inlineEditor',
    container: 'body',
};

let transform = (function() {
    var matrixToArray = function(str) {
        if (!str || str == 'none') {
            return [1, 0, 0, 1, 0, 0];
        }
        return str.match(/(-?[0-9\.]+)/g);
    };

    var getPreviousTransforms = function(elem) {
        return elem.css('-webkit-transform') || elem.css('transform') || elem.css('-moz-transform') ||
            elem.css('-o-transform') || elem.css('-ms-transform');
    };

    var getMatrix = function(elem) {
        var previousTransform = getPreviousTransforms(elem);
        return matrixToArray(previousTransform);
    };

    var applyTransform = function(elem, transform) {
        elem.css('-webkit-transform', transform);
        elem.css('-moz-transform', transform);
        elem.css('-o-transform', transform);
        elem.css('-ms-transform', transform);
        elem.css('transform', transform);
    };

    var buildTransformString = function(matrix) {
        return 'matrix(' + matrix[0] +
            ', ' + matrix[1] +
            ', ' + matrix[2] +
            ', ' + matrix[3] +
            ', ' + matrix[4] +
            ', ' + matrix[5] + ')';
    };

    var getTranslate = function(elem) {
        var matrix = getMatrix(elem);
        return {
            x: parseInt(matrix[4]),
            y: parseInt(matrix[5])
        };
    };

    var scale = function(elem, _scale) {
        var matrix = getMatrix(elem);
        matrix[0] = matrix[3] = _scale;
        var transform = buildTransformString(matrix);
        applyTransform(elem, transform);
    };

    var translate = function(elem, x, y) {
        var matrix = getMatrix(elem);
        matrix[4] = x;
        matrix[5] = y;
        var transform = buildTransformString(matrix);
        applyTransform(elem, transform);
    };

    var rotate = function(elem, deg) {
        var matrix = getMatrix(elem);
        var rad1 = deg * (Math.PI / 180);
        var rad2 = rad1 * -1;
        matrix[1] = rad1;
        matrix[2] = rad2;
        var transform = buildTransformString(matrix);
        applyTransform(elem, transform);
    };

    return {
        scale: scale,
        translate: translate,
        rotate: rotate,
        getTranslate: getTranslate
    };
})();

let win = window;

let doc = document;

let template = '';

let section = {
    getText: function() {
        var txt = '';
        if (win.getSelection) {
            txt = win.getSelection().toString();
        } else if (doc.getSelection) {
            txt = doc.getSelection().toString();
        } else if (doc.selection) {
            txt = doc.selection.createRange().text;
        }
        return txt;
    },
    getContainer: function(sel) {
        if (win.getSelection && sel && sel.commonAncestorContainer) {
            return sel.commonAncestorContainer;
        } else if (doc.selection && sel && sel.parentElement) {
            return sel.parentElement();
        }
        return null;
    },
    getSelection: function() {
        if (win.getSelection) {
            return win.getSelection();
        } else if (doc.selection && doc.selection.createRange) { // IE
            return doc.selection;
        }
        return null;
    }
};

let rawEvents = {
    mouseup: function(event) {
        toolbar.updatePos($(this),$('.inlineEditor-toolbar'));
    }
};


let toolbar = {
    updatePos: function(editor, elem) {
        var sel = win.getSelection(),
            range = sel.getRangeAt(0),
            boundary = range.getBoundingClientRect(),
            bubbleWidth = elem.width(),
            bubbleHeight = elem.height(),
            offset = editor.offset().left,
            pos = {
                x: (boundary.left + boundary.width / 2) - (bubbleWidth / 2),
                y: boundary.top - bubbleHeight - 8 + $(document).scrollTop()
            };
        transform.translate(elem, pos.x, pos.y);
    }
};



function InlineEditor(options) {
    let self = this;
    self.config = $.extend({}, defaults, options);
    let config = self.config
    self.$el = $(config.el);
    self.$container = $(config.container);
    self.init();

}



InlineEditor.prototype.init = function() {
    var self = this;
    var config = self.config;
    
    self.$container.append($($('#toolbar').html()));
    self.$container.on('mouseup', config.el, rawEvents.mouseup);
};

InlineEditor.prototype.bindEvents = function() {

}





module.exports = {
    inlineEditor: function(config) {
        return new InlineEditor(config);
    }
};
