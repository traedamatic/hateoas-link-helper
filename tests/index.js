/**
 * unit tests for link generation
 */
'use strict';

var expect = require('chai').expect;

/**
 * Unit under test
 */
var HATEOASLinkHelper = require('./../index');


describe('HATEOAS Link Helper Tests', function () {
    describe('method - parseParameters', function () {

        it('parse options from incoming request - only sorting and order', function () {


            var incomingRequest = {
                query: {
                    sorting: '_id',
                    order: 'DESC'
                }
            };

            var parameters = HATEOASLinkHelper.parseParameters(incomingRequest);

            expect(parameters.sorting).to.equal(incomingRequest.query.sorting);
            expect(parameters.order).to.equal(incomingRequest.query.order);

        });

        it('parse options from incoming request - sorting, order and limit ', function () {


            var incomingRequest = {
                query: {
                    sorting: '_id',
                    order: 'DESC',
                    limit: '100'
                }
            };

            var parameters = HATEOASLinkHelper.parseParameters(incomingRequest);

            expect(parameters.sorting).to.equal(incomingRequest.query.sorting);
            expect(parameters.order).to.equal(incomingRequest.query.order);
            expect(parameters.limit).to.equal(parseInt(incomingRequest.query.limit));

        });

        it('parse options from incoming request - set limit to 5 limt is NaN ', function () {


            var incomingRequest = {
                query: {
                    sorting: '_id',
                    order: 'DESC',
                    limit: 'asd'
                }
            };

            var parameters = HATEOASLinkHelper.parseParameters(incomingRequest);

            expect(parameters.sorting).to.equal(incomingRequest.query.sorting);
            expect(parameters.order).to.equal(incomingRequest.query.order);
            expect(parameters.limit).to.equal(5);

        });

        it('parse options from incoming request - set page to 1 because page is NaN ', function () {


            var incomingRequest = {
                query: {
                    sorting: '_id',
                    order: 'DESC',
                    limit: '100',
                    page: 'dsf'
                }
            };

            var parameters = HATEOASLinkHelper.parseParameters(incomingRequest);

            expect(parameters.sorting).to.equal(incomingRequest.query.sorting);
            expect(parameters.order).to.equal(incomingRequest.query.order);
            expect(parameters.limit).to.equal(parseInt(incomingRequest.query.limit));
            expect(parameters.page).to.equal(1);

        });

        it('parse options from incoming request - set page to 10 and last ', function () {


            var incomingRequest = {
                query: {
                    sorting: '_id',
                    order: 'DESC',
                    limit: '100',
                    page: '10',
                    last: '123234dwfsdf23'
                }
            };

            var parameters = HATEOASLinkHelper.parseParameters(incomingRequest);

            expect(parameters.sorting).to.equal(incomingRequest.query.sorting);
            expect(parameters.order).to.equal(incomingRequest.query.order);
            expect(parameters.limit).to.equal(parseInt(incomingRequest.query.limit));
            expect(parameters.page).to.equal(10);

        });

    });

    describe('method - generateLinks', function () {

        var parameters = {
            sorting: '_id',
            order: 'DESC',
            limit: 100,
            page: 10,
            last: '123234dwfsdf23',
            nextLast: '324sdff3f'
        };

        it('should generate links with next with https', function () {

            var request = {
                route: {
                    path: '/api/v1/users'
                },
                isSecure: function () {
                    return true
                },
                header: function (key) {
                    return 'localhost:5555'
                }
            };

            var links = HATEOASLinkHelper.generateLinks(request, parameters,true);

            expect(links).to.be.an('array');

            var home = links.filter(function (link) {
                if (link.rel === 'home') {
                    return true;
                }
            }).pop();

            expect(home.rel).to.equal('home');
            expect(home.href).to.match(/^https/);
            expect(home.href).to.match(/localhost:5555/);

            var next = links.filter(function (link) {
                if (link.rel === 'next') {
                    return true;
                }
            }).pop();


            expect(next.rel).to.equal('next');
            expect(next.href).to.match(/^https/);
            expect(next.href).to.match(/localhost:5555/);
            expect(next.href).to.match(/page=11/);
            expect(next.href).to.match(/last=324sdff3f/);
            expect(next.href).to.not.match(/nextLast/);
            expect(next.href).to.match(/sorting=_id/);
            expect(next.href).to.match(/order=DESC/);

        });

        it('should generate links with next with http', function () {

            var request = {
                route: {
                    path: '/api/v1/users'
                },
                isSecure: function () {
                    return false
                },
                header: function (key) {
                    return 'localhost:5555'
                }
            };

            var links = HATEOASLinkHelper.generateLinks(request, parameters,true);

            expect(links).to.be.an('array');

            var home = links.filter(function (link) {
                if (link.rel === 'home') {
                    return true;
                }
            }).pop();


            expect(home.rel).to.equal('home');
            expect(home.href).to.match(/^http:/);
            expect(home.href).to.match(/localhost:5555/);

            var next = links.filter(function (link) {
                if (link.rel === 'next') {
                    return true;
                }
            }).pop();


            expect(next.rel).to.equal('next');
            expect(next.href).to.match(/^http:/);
            expect(next.href).to.match(/localhost:5555/);
            expect(next.href).to.match(/page=11/);
            expect(next.href).to.match(/last=324sdff3f/);
            expect(next.href).to.match(/sorting=_id/);
            expect(next.href).to.not.match(/nextLast/);
            expect(next.href).to.match(/order=DESC/);

        });


        it('should generate links with next with http and prevNext', function () {

            parameters.prevLast = '2348324732sdf';

            var request = {
                route: {
                    path: '/api/v1/users'
                },
                isSecure: function () {
                    return false
                },
                header: function (key) {
                    return 'localhost:5555'
                }
            };

            var links = HATEOASLinkHelper.generateLinks(request, parameters,true);

            expect(links).to.be.an('array');

            var home = links.filter(function (link) {
                if (link.rel === 'home') {
                    return true;
                }
            }).pop();


            expect(home.rel).to.equal('home');
            expect(home.href).to.match(/^http:/);
            expect(home.href).to.match(/localhost:5555/);

            var next = links.filter(function (link) {
                if (link.rel === 'next') {
                    return true;
                }
            }).pop();


            expect(next.rel).to.equal('next');
            expect(next.href).to.match(/^http:/);
            expect(next.href).to.match(/localhost:5555/);
            expect(next.href).to.match(/page=11/);
            expect(next.href).to.match(/last=324sdff3f/);
            expect(next.href).to.match(/sorting=_id/);
            expect(next.href).to.not.match(/nextLast/);
            expect(next.href).to.match(/order=DESC/);

            var prev = links.filter(function (link) {
                if (link.rel === 'prev') {
                    return true;
                }
            }).pop();


            expect(prev.rel).to.equal('prev');
            expect(prev.href).to.match(/^http:/);
            expect(prev.href).to.match(/localhost:5555/);
            expect(prev.href).to.match(/page=9/);
            expect(prev.href).to.match(/last=2348324732sdf/);
            expect(prev.href).to.match(/sorting=_id/);
            expect(prev.href).to.not.match(/prevLast/);
            expect(prev.href).to.match(/order=DESC/);

        });
    })

});
