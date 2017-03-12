$(function () {

    HEIGHTS = [];

    function getheight(images, width) {
        width -= images.length * 5;
        var h = 0;
        for (var i = 0; i < images.length; ++i) {
            h += $(images[i]).data('width') / $(images[i]).data('height');
        }
        return width / h;
    }

    function setheight(images, height) {
        HEIGHTS.push(height);
        for (var i = 0; i < images.length; ++i) {
            $(images[i]).css({
                width: height * $(images[i]).data('width') / $(images[i]).data('height'),
                height: height
            });
            $(images[i]).attr('src', $(images[i]).attr('src').replace(/w[0-9]+-h[0-9]+/, 'w' + $(images[i]).width() + '-h' + $(images[i]).height()));
        }
    }

    function resize(images, width) {
        setheight(images, getheight(images, width));
    }

    function run(max_height) {
        var size = window.innerWidth - 17;

        var n = 0;
        var images = $('img');
        w: while (images.length > 0) {
            for (var i = 1; i < images.length + 1; ++i) {
                var slice = images.slice(0, i);
                var h = getheight(slice, size);
                if (h < max_height) {
                    setheight(slice, h);
                    n++;
                    images = images.slice(i);
                    continue w;
                }
            }
            setheight(slice, Math.min(max_height, h));
            n++;
            break;
        }
        console.log(n, slice);
    }

    window.addEventListener('resize', function () {
        run(200);
    });

    $.getJSON('http://82.196.1.83:9571/', function (data) {
        const container = document.querySelector('.gallery');
        let html = '';

        data.forEach((item) => {
            html += `<img src="http://82.196.1.83:9571/${item.filename}" data-width="${item.width}" data-height="${item.height}">`
        });

        container.innerHTML = html;
        run(200);

    });


});

