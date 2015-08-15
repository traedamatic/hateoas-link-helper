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

        var pathname = req.baseUrl + req.route.path;

        //trim last slash
        pathname = pathname.replace(/\/$/, '');

        var urlObject = {
            protocol: 'https',
            hostname: req.hostname,
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
     * @param req
     * @returns {{}}
     */
    parseParameters: function (req) {

        var parameters = {};
        if (req.query.order != undefined && req.query.sorting != undefined) {
            parameters.sorting = req.query.sorting;
            parameters.order = req.query.order;
        }

        if (req.query.limit != undefined) {
            parameters.limit = Number(req.query.limit);

            if (isNaN(parameters.limit)) {
                parameters.limit = 5;
            }
        }

        if (req.query.page != undefined) {
            parameters.page = Number(req.query.page);

            if (isNaN(parameters.page)) {
                parameters.page = 1;
            }
        }

        return parameters;
    }
};