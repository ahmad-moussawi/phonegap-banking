
/**
 * Load a given view
 * @param string view
 * @returns Promise<string> the view html
 */
function loadView(view) {
    return $.get('views/' + view + '.html');
}

/**
 * Load multiple views and attach them to the DOM
 * @param Array<string> views
 * @returns Promise<Array<string>> the views html as array
 */
function loadViews(views) {

    // Promise.all wait for all promises before emitting the values
    return Promise.all(views.map(function (view) {
        return loadView(view);
    })).then(function (viewsHtml) {
        viewsHtml.forEach(function (html, i) {
            $('page[name=' + views[i] + ']').append(html);
        });
    });
}


/**
 * Navigate to a page
 * @param string view
 */
function go(view) {
    $('page').removeClass('active');
    $('page[name=' + view + ']').addClass('active');

    /*
    if(view === 'about')
    {
        // alert('Going to about 😎');
        $('.date').html(new Date());
    }
    */

    // trigger an event with arguments, arguments is of type Array<Object>
    $placeholder.trigger('navigate', [view]);

}

// Define a placeholder where that holds all partial views
var $placeholder = $('placeholder');

// Read the views definition from the index.html page
var views = $('placeholder page').map(function (i, page) {
    return $(page).attr('name')
}).toArray();

loadViews(views).then(function () {

    $('placeholder page[label]').each(function (i, page) {

        // always declare a jQuery variable when you want to use more than many time.
        // $ is a function = jQuery
        var $page = $(page);

        var label = $page.attr('label');
        var cssClass = $page.hasClass('active') ? 'active' : '';
        var name = $page.attr('name');

        $('#bottom-footer').append('<a onclick="go(\'' + name + '\')" class="' + cssClass + '">' + label + '</a>');
    });

    $('.date').html(new Date())

    // here all view are ready
})


// listen to navigate event
$placeholder.on('navigate', function (event, view) {
    if(view === 'about')
    {
        $('.date').html(new Date());
    }
});
