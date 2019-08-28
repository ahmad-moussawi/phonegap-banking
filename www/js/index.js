var $placeholder;
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

    // debugger;

    $('page').removeClass('active');
    $('page[name=' + view + ']').addClass('active');

    // trigger an event with arguments, arguments is of type Array<Object>
    $placeholder.trigger('navigate', [view]);
}


function onBatteryStatus(status) {

    console.log(status);

    $('.battery-status-level').css('width', status.level + '%');

    if (status.isPlugged) {
        $('.battery-status-level').addClass('plugged')
    } else {
        $('.battery-status-level').removeClass('plugged')
    }

    console.log("Level: " + status.level + " isPlugged: " + status.isPlugged);
}


document.addEventListener('deviceready', function () {

    // Define a placeholder where that holds all partial views
    $placeholder = $('placeholder');

    // Read the views definition from the index.html page
    var views = $('placeholder page').map(function (i, page) {
        return $(page).attr('name')
    }).toArray();

    console.log('Logging a message');

    loadViews(views).then(function () {

        $('placeholder page[label]').each(function (i, page) {

            // always declare a jQuery variable when you want to use more than many time.
            // $ is a function = jQuery
            var $page = $(page);

            var label = $page.attr('label');
            var name = $page.attr('name');

            // another way
            // var cssClass = $page.hasClass('active') ? 'active' : '';
            // var $button = $('<a id="nav-' + name + '" onclick="go(\'' + name + '\')" class="' + cssClass + '">' + label + '</a>');

            var $button = $('<a/>')
                .attr('id', 'nav-' + name)
                .attr('onclick', "go('" + name + "')")
                .html(label);

            if ($page.hasClass('active')) {
                $button.addClass('active');
            }

            $('#bottom-footer').append($button);
        });

        $('.date').html(new Date())

        // here all view are ready


        function cameraSuccess(imageData) {
            $('.camera-image')
                .attr('src', "data:image/jpeg;base64," + imageData);
        }

        function cameraError(error) {
            console.log(error)
            alert('3a chu kheyif 🤢');
        }

        $('#openCamera').click(function () {
            console.log('open camera clicked');
            navigator.camera.getPicture(cameraSuccess, cameraError, {
                quality: 20,
                destinationType: Camera.DestinationType.DATA_URL
            });

        })


    })


    // listen to navigate event
    $placeholder.on('navigate', function (event, view) {

        $('#bottom-footer a').removeClass('active');
        $('#nav-' + view).addClass('active');

        if (view === 'about') {
            $('.date').html(new Date());
        }

        if (view === 'account-list') {

            var $list = $('#account-list');

            AccountsService.accounts().then(function (accounts) {

                $list.empty();

                accounts.forEach(function (account) {
                    var $item = $(
                        '<div class="item">\
                            <div class="item-account-row-1">\
                                <div class="account-name">' + account.name + '</div>\
                                <div class="account-balance">' + account.currency + ' ' + account.balance + '</div>\
                            </div>\
                            <div class="account-number">' + account.number + '</div>\
                            <div class="account-activity">Last activity on ' + account.last_activity + '</div>\
                        </div>'
                    );

                    $list.append($item);
                });
            })
        }


    });

    window.addEventListener("batterystatus", onBatteryStatus, false);

}, false);


