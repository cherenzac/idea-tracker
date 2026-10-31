'use strict';
const assert=require('node:assert/strict');const {safeUrl,normalizeHits}=require('./news');
for(const url of ['https://username:password@example.com/article','https://trusted.example@evil.example/','http://user@example.com/','javascript:alert(1)','data:text/html,hi','https://','not a url'])assert.equal(safeUrl(url),null,url);
for(const url of ['https://example.com/article?q=ai#section','http://example.com/article'])assert.equal(safeUrl(url),url);
const now=Date.now();const item={objectID:'123',title:'Sample story',created_at:new Date(now).toISOString(),url:'https://trusted.example@evil.example/'};
assert.equal(normalizeHits([item],now)[0].url,'https://news.ycombinator.com/item?id=123');
console.log('PASS: credential-bearing/deceptive URLs rejected; ordinary HTTP(S) preserved; unsafe story URLs fall back to HN discussion.');
