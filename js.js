var JustifyGallery = function () {
    this.HEIGHTS = [];
    this.list = [];
    this.$container = $('.gallery');
};

JustifyGallery.prototype.getHeight = function (data, width) {
    width -= data.length * 5;
    var h = 0;
    for (var i = 0; i < data.length; ++i) {
        h += data[i].width / data[i].height;
    }
    return width / h;
};

JustifyGallery.prototype.setHeight = function (data, height) {
    this.HEIGHTS.push(height);

    for (var i = 0; i < data.length; ++i) {
        var width = height * data[i].width / data[i].height,
            height = height;

        var container = $('<div class="item"><img></div>');
        var img = container.find('img');

        container.css({
            width: width,
            height: height
        });

        img.attr('src', `http://82.196.1.83:9571/${data[i].filename}`);

        img.on('error', function(e){
            // e.target.parentNode.remove();
        });

        img.on('load', function (e) {
            e.target.classList.add('show');
        });


        this.list.push(container);
    }
};

JustifyGallery.prototype.render = function (data, maxHeight, size) {
    var size = size,
        n = 0, list = data;
    this.list = [];
    this.HEIGHTS = [];

    w: while (list.length > 0) {
        for (var i = 1; i < list.length + 1; i++) {
            var slice = list.slice(0, i);
            var h = this.getHeight(slice, size);
            if (h < maxHeight) {
                this.setHeight(slice, h);
                n++;
                list = list.slice(i);
                continue w;
            }
        }
        this.setHeight(slice, Math.min(maxHeight, h));
        n++;
        break;
    }

    this.$container.html(this.list);
};

var justifyGallery = new JustifyGallery();

$.getJSON('http://82.196.1.83:9571/', function (data) {
    justifyGallery.render(data, 200, $('.gallery').innerWidth() - 17);

    window.addEventListener('resize', function () {
        justifyGallery.render(data, 200, $('.gallery').innerWidth());
    });
});