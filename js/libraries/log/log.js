// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
define(function () {
    window.log = function () {
        log.history = log.history || [];
        
        log.history.push(arguments);
        
        if (this.console && this._appular) {
            if (this._appular.config.env === 'develop') {
                console.log.apply(console, arguments);
            }
        }
    };
});