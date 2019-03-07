function loadView(view) {
    return $.get('views/' + view + '.html');
}

function loadViews(views) {
    return Promise.all(views.map(function (view) {
        return loadView(view);
    })).then(function (viewsHtml) {
        viewsHtml.forEach(function (html, i) {
            $('page[name=' + views[i] + ']').append(html);
        });
    });
}

function go(view)
{
    $('page').removeClass('active');
    $('page[name=' + view + ']').addClass('active');
}

// Define a placeholder where that holds all partial views
var $placeholder = $('placeholder');

var views = $('placeholder page').map(function (i, page) {
    return $(page).attr('name')
}).toArray();

loadViews(views).then(function () {

    // here all view are ready

    // alert('Views are loaded');

})
