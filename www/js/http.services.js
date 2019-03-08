(function () {


    var baseUrl = 'http://courses.vivida-apps.com/';

    /**
     * Retrieve accounts from the Backend
     */
    function accounts() {
        return $.get(baseUrl + 'accounts.json');
    }

    window.AccountsService = {
        accounts: accounts
    };

})();
