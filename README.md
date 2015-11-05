# HATEOAS link helper

[![Build Status](https://travis-ci.org/traedamatic/hateoas-link-helper.svg?branch=master)](https://travis-ci.org/traedamatic/hateoas-link-helper)

A little package for automatically creating HATEOAS (https://en.wikipedia.org/wiki/HATEOAS) links for pagination. The links will be
generated from the request and the url queries. **At the moment only the restify request is supported.**

New change: The helper now supports all custom query parameter you provide. The parse function automatically iterates
over the query object and extracts all parameter. All parameter that are a "number" will be casted to type Number. 

# Install

```
npm install hateoas-link-helper --save
```

# Little Example

This example shows how you can use the HATEOAS helper with restify, mongoDB and mongoose to get 
a simple pagination functionality. This solution does not use the mongodb "skip" operator.

```javascript

var argsArray = [];

//1. use the helper to generate the parameters
var parameters =  HATEOASLinkHelper.parseParameters(req);


//2. build mongodb query
if (parameters.page && parameters.last) {
    argsArray.push({_id: {$lt: ObjectId(parameters.last)}});
} else {
    argsArray.push({});
}

//push empty projection on array
argsArray.push(null);

var limit = parameters.limit || 10;
argsArray.push({limit: limit, sort: {_id: -1}});

MongooseModel.findAsync.apply(MongooseModel, argsArray)
    .then(function (items) {

        if (items.length < limit) {
            var areMoreItems = false
        } else {

            var lastItem = items[items.length-1];

            return ItemModel.findAsync({_id: {$lt: lastItem._id}}, null, {limit: limit, sort: {_id: -1}})
                .then(function (nextItems) {

                    if (nextItems.length > 0) {
                        parameters.nextLast = lastItem._id.toString();
                    }

                    //3b. use the helper to generate the links
                    var response = {
                        data: items,
                        links: HATEOASLinkHelper.generateLinks(req, parameters, nextItems.length > 0)
                    };

                    res.json(response);

                    return next();

                })
        }

        //3a. no next items, use the helper to generate the links
        var response = {
            data: products,
            links: HATEOASLinkHelper.generateLinks(req, parameters, areMoreUsers)
        };

        res.json(response);

        return next();

    })
    .catch(next);

```

# Tests

Open terminal an go to the project root dir and run:

```
mocha tests
```

(Note: you must have mocha installed globally)

# Further Reading

* HATEOAS (https://en.wikipedia.org/wiki/HATEOAS)
* restify (http://restify.com/)
* What is HATEOAS and why is it important for my REST API? (http://restcookbook.com/Basics/hateoas/)
