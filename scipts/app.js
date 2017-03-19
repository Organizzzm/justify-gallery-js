$.getJSON('http://82.196.1.83:9571/', function (data) {
    $('.gallery').justifyGallery({
        data: data,
        maxHeight: 200,
        margin: 4
    });
});