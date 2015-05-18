#!/usr/bin/env node --harmony

var app = require('koa')();
var router = require('koa-router')();
var fs = require('fs');

var handlebars = require('handlebars');

router.get('/', function *(next) {
	var template = fs.readFileSync('templates/index.xml', 'utf-8');
	var rendered = handlebars.compile(template);
	this.body = rendered();
});

console.log('listening on http://localhost:3000');
app
	.use(router.routes())
	.listen(3000);
;
