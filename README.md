# HATEOAS link helper

A little package for automatically creating HATEOAS (https://en.wikipedia.org/wiki/HATEOAS) links for pagination. The links will be
generated from the request and the url queries. **At the moment only the restify request is supported.**

The following parameters will be parsed the url:

* page
* limit
* sorting
* order
* last - The last parameter can hold a identifier of the last element of the latest pagination request

# Install

```
npm install hateoas-link-helper --save
```

# How To

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