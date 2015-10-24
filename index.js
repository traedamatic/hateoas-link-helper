/**
 * HATEOAS link helper
 * @author Nicolas Traeder <traeder@codebility.com>
 * @license MIT
 * @date 08-2015
 */
'use strict';

var urlParser = require('url');


module.exports = {
    /**
     * generate the links from the request, original parameters
     * and hasNext information.
     *
     * @param {Object} req
     * @param {Object} originalParameters
     * @param {boolean}hasNext
     * @return {Array}
     */
    generateLinks: function (req, originalParameters, hasNext) {

        //HATEOAS links
        var links = [];

        //copy
        var inputParameters = {};
        for (var index in originalParameters) {
            inputParameters[index] = originalParameters[index];
        }

        //only for last identifier
        if (inputParameters.nextLast) {
            var nextLast = inputParameters.nextLast;
            delete (inputParameters.nextLast);
        }

        //only for last identifier
        if (inputParameters.prevLast) {
            var prevLast = inputParameters.prevLast;
            delete (inputParameters.prevLast);
        }


        var pathname = req.route.path,
            hostname = req.header('host');

        //trim last slash
        pathname = pathname.replace(/\/$/, '');

        var urlObject = {
            protocol: req.isSecure() ? 'https' : 'http',
            host: hostname,
            pathname: pathname
        };

        links.push(
            {
                rel: "home",
                href: urlParser.format(urlObject)
            }
        );

        urlObject.query = inputParameters;

        links.push(
            {
                rel: "self",
                href: urlParser.format(urlObject)
            }
        );

        if (hasNext === true) {
            //create next url
            if (Object(inputParameters).hasOwnProperty("page") && typeof inputParameters.page === "number") {
                inputParameters.page++;
            } else {
                inputParameters.page = 2;
            }

            if (nextLast) {
                inputParameters.last = nextLast;
            }

            urlObject.query = inputParameters;

            links.push(
                {
                    rel: "next",
                    href: urlParser.format(urlObject)
                }
            );
        }

        if (inputParameters.page > 2) {

            inputParameters.page = inputParameters.page - 2;

            delete(urlObject.query);

            if (inputParameters.page > 1) {
                urlObject.query = inputParameters;
            }

            if (prevLast) {
                inputParameters.last = prevLast;
            }

            links.push(
                {
                    rel: "prev",
                    href: urlParser.format(urlObject)
                }
            );

        }

        return links;
    },
    /**
     * parse the parameter from the incoming request
     * All parameter in the req.query object will parsed
     *
     * @param req the request with query object
     * @returns {{}}
     */
    parseParameters: function (req) {
        var parameters = {};

        if (!req.query) {
            return parameters;
        }

        for (var key in req.query) {
            if( req.query.hasOwnProperty( key ) ) {
                if (!isNaN(req.query[key])) {
                    parameters[key] = Number(req.query[key]);
                } else {
                    parameters[key] = req.query[key];
                }
            }
        }

        // fix NaN values for pagination
        //TODO: put in config
        if (parameters.limit && isNaN(parameters.limit)) {
            parameters.limit = 5;
        }

        if (parameters.limit && isNaN(parameters.page)) {
            parameters.page = 1;
        }

        return parameters;
    }
};