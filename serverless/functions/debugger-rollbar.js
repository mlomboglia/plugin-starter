const Rollbar = require('rollbar');
const _ = require('lodash');

const getLevel = (event) => {
    if (event.Level) {
        return event.Level.toLowerCase();
    }

    return 'warning';
}

const getMessage = (event) => {
    const payload = getPayload(event);
    if (typeof(payload) !== 'object') {
        'Unknown error occurred';
    }

    if (_.get(payload, 'more_info.Msg', null)) {
        return _.get(payload, 'more_info.Msg', null);
    }

    if (_.get(payload, 'webhook.response.body', null)) {
        const body = parseJson(_.get(payload, 'webhook.response.body', '{}'));
        if (typeof(body) !== 'object') {
            return body;
        }

        return _.get(body, 'message', null) 
            || _.get(body, 'msg', null) 
            || body;
    }

    return 'Unknown error occurred';
}

const parseJson = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}

const getPayload = (event) => {
    return parseJson(event.Payload);
}

exports.handler = (context, event, callback) => {
    console.log('rollbar init');
    const rollbarConfig = Object.assign({}, event.rollbar, {
        environment: 'production'
    });

    delete event.rollbarConfig;

    const rollbar = new Rollbar({
        accessToken: context.ROLLBAR_TOKEN,
        payload: rollbarConfig,
    });

    const log = (level, msg, custom) => {
        return new Promise(resolve => {
            rollbar[level](msg, custom, resolve)
        });
    }

    const level = getLevel(event);
    const msg = getMessage(event);
    const payload = getPayload(event);
    const custom = _.merge({}, _.omit(event, 'Payload'), { Payload: payload });

    log(level, msg, custom)
        .then(callback);
};
