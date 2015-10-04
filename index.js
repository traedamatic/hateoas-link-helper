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
     *
     * Following parameter will be parsed:
     *
     * order
     * sorting
     * limit
     * page
     * last - last if important for the bette mongodb pagination (optional)
     *
     * @param req
     * @returns {{}}
     */
    parseParameters: function (req) {

        var parameters = {};
        if (Object(req.query).hasOwnProperty('order') && Object(req.query).hasOwnProperty('sorting')) {
            parameters.sorting = req.query.sorting;
            parameters.order = req.query.order;
        }

        if (Object(req.query).hasOwnProperty('limit')) {
            parameters.limit = Number(req.query.limit);

            if (isNaN(parameters.limit)) {
                parameters.limit = 5;
            }
        }

        if (Object(req.query).hasOwnProperty('page')) {

            parameters.page = Number(req.query.page);

            if (isNaN(parameters.page)) {
                parameters.page = 1;
            }

        }

        if (Object(req.query).hasOwnProperty('last')) {
            parameters.last = req.query.last;
        }

        return parameters;
    }
};