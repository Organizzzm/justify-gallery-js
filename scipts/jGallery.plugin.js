(function ($) {
    var pluginName = 'justifyGallery';

    /**
     * The actual plugin constructor
     * @param element
     * @param options
     * @constructor
     */
    function Plugin(element, options) {
        this.$container = $(element);

        this.list = [];
        this.data = options.data;
        this.maxHeight = options.maxHeight || 200; // Default xax height of images
        this.imgCount = 0;
        this.margin = options.margin || 4; // Default margin

        this.init();
    };

    /**
     * Calc height
     * @param data
     * @param width
     * @returns {number}
     */
    Plugin.prototype.getHeight = function (data, width) {
        width -= data.length * this.margin;
        var h = 0;
        for (var i = 0; i < data.length; ++i) {
            h += data[i].width / data[i].height;
        }
        return width / h;
    };

    /**
     * Calc width and set styles
     * @param data
     * @param height
     */
    Plugin.prototype.setSize = function (data, height) {

        for (var i = 0; i < data.length; ++i) {
            var width = height * data[i].width / data[i].height,
                height = height;

            this.list.push({
                width: width,
                height: height,
                src: 'http://82.196.1.83:9571/' + data[i].filename,
                number: this.imgCount++
            });
        }
    };

    /**
     * Mainly calculate function
     * @param data
     * @param maxHeight
     * @param width
     */
    Plugin.prototype.calcImgSize = function (data, maxHeight, width) {
        var row = 0;
        this.list = []; // Clear list
        this.imgCount = 0; // Clear image number

        w: while (data.length > 0) {
            for (var i = 1; i < data.length + 1; i++) {
                var slice = data.slice(0, i);
                var h = this.getHeight(slice, width);
                if (h < maxHeight) {
                    this.setSize(slice, h);
                    row++;
                    data = data.slice(i);
                    continue w;
                }
            }
            this.setSize(slice, maxHeight);
            row++;
            break;
        }
    };

    /**
     * Render DOM and past to gallery container
     */
    Plugin.prototype.render = function () {
        var domList = [],
            self = this;

        self.list.forEach(function(item){
            var container = $('<div class="gallery__item"><img class="gallery__img"></div>'),
                img = container.find('img');

            container.css({
                width: item.width,
                height: item.height,
                margin: self.margin / 2
            });

            img.attr('src', item.src);

            img.on('error', function () {
                item.number >= 0? self.data.splice(item.number, 1) : null;

                self.calcImgSize(self.data, self.maxHeight, self.$container.innerWidth());
                self.render();
            });

            img.on('load', function (e) {
                e.target.classList.add('gallery__img--show');
            });

            domList.push(container);
        });

        self.$container.html(domList);
    };

    /**
     * Bind events
     */
    Plugin.prototype.bindEvents = function () {
        var self = this;

        $(window).on('resize', function () {
            self.calcImgSize(self.data, self.maxHeight, self.$container.innerWidth());
            self.render();
        });
    };

    /**
     * Init
     */
    Plugin.prototype.init = function () {
        this.bindEvents();
        this.calcImgSize(this.data, this.maxHeight, this.$container.innerWidth());
        this.render();
    };

    /**
     * Create plugin exemplar
     * @param options
     * @returns {*}
     */
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };
})(jQuery);


