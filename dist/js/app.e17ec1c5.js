(function(t){function e(e){for(var a,s,c=e[0],l=e[1],o=e[2],p=0,f=[];p<c.length;p++)s=c[p],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&f.push(r[s][0]),r[s]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a]);u&&u(e);while(f.length)f.shift()();return i.push.apply(i,o||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],a=!0,c=1;c<n.length;c++){var l=n[c];0!==r[l]&&(a=!1)}a&&(i.splice(e--,1),t=s(s.s=n[0]))}return t}var a={},r={app:0},i=[];function s(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=t,s.c=a,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)s.d(n,a,function(e){return t[e]}.bind(null,a));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=e,c=c.slice();for(var o=0;o<c.length;o++)e(c[o]);var u=l;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("cd49")},"094b":function(t,e,n){},2499:function(t,e,n){},"3fb8":function(t,e,n){"use strict";n("5897")},"40a3":function(t,e,n){},5897:function(t,e,n){},"680b":function(t,e,n){},7718:function(t,e,n){"use strict";n("c848")},"9ae0":function(t,e,n){},b1bc:function(t,e,n){"use strict";n("40a3")},c003:function(t,e,n){"use strict";n("2499")},c848:function(t,e,n){},cd49:function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("2b0e"),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"container h-100"},[n("div",{staticClass:"row h-100"},[t._m(0),n("div",{staticClass:"col-12 my-auto",attrs:{id:"emulator"}},[t._m(1),n("div",{staticClass:"row px-0 my-auto"},[n("div",{staticClass:"col-5 col-md-4 col-lg-3 pr-1"},[n("registers")],1),n("div",{staticClass:"col-7 col-md-8 col-lg-9 pl-1"},[n("editor",{on:{play:function(e){return t.play(e)}}})],1)]),n("div",{staticClass:"row px-0 pt-2"},[n("div",{staticClass:"col-7 pr-1"},[n("tutorial")],1),n("div",{staticClass:"col-5 pl-1"},[n("instruction")],1)]),t._m(2)])])])])},i=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"col-12 mt-3 mb-0"},[n("h1",[t._v("iRISC")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"row px-0 my-auto"},[n("div",{staticClass:"col-5 col-md-4 col-lg-3 pr-1 text-left"},[n("h5",{staticClass:"mb-0"},[t._v("registers")])]),n("div",{staticClass:"col-7 col-md-8 col-lg-9 pl-1 text-left"},[n("h5",{staticClass:"mb-0"},[t._v("editor")])])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"row px-0"},[n("div",{staticClass:"col-7 pr-1 text-right"},[n("h5",{staticClass:"mb-0"},[t._v("tutorial")])]),n("div",{staticClass:"col-5 pl-1 text-right"},[n("h5",{staticClass:"mb-0"},[t._v("instruction")])])])}],s=(n("13d5"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container pl-1 pr-0 py-1 position-relative"},[n("prism-editor",{attrs:{id:"editor",highlight:t.highlighter,"tab-size":1,"insert-spaces":!1,"line-numbers":""},model:{value:t.program,callback:function(e){t.program=e},expression:"program"}}),n("div",{attrs:{id:"buttons"}},[n("i",{staticClass:"stop fas fa-stop mx-1 clickable"}),n("i",{staticClass:"play fas fa-play mx-1 clickable",on:{click:function(e){return t.$emit("play",t.program)}}}),n("i",{staticClass:"step fas fa-step-forward clickable"})])],1)}),c=[],l=n("e57a"),o=(n("cabf"),n("c197")),u=(n("a878"),a["default"].extend({name:"editor",components:{PrismEditor:l["a"]},data:function(){return{program:""}},methods:{highlighter:function(t){return Object(o["highlight"])(t,o["languages"].armv7,"ARMv7")}}})),p=u,f=(n("c003"),n("2877")),d=Object(f["a"])(p,s,c,!1,null,"1bbfe7c6",null),b=d.exports,m=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"})},h=[],v={name:"registers",props:{msg:String}},g=v,O=(n("3fb8"),Object(f["a"])(g,m,h,!1,null,"17604a07",null)),y=O.exports,j=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"})},_=[],x=a["default"].extend({name:"instruction"}),C=x,w=(n("7718"),Object(f["a"])(C,j,_,!1,null,"e90a5d10",null)),k=w.exports,E=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"})},$=[],P=a["default"].extend({name:"tutorial"}),S=P,T=(n("b1bc"),Object(f["a"])(S,E,$,!1,null,"2be398d2",null)),z=T.exports,q=n("262e"),A=n("2caf"),M=n("d4ec"),Z=n("bee2"),N=(n("99af"),n("4160"),n("159b"),n("9072")),I=function(t){Object(q["a"])(n,t);var e=Object(A["a"])(n);function n(t,a,r,i){var s;return Object(M["a"])(this,n),s=e.call(this),s.message=t,s.statement=a,s.tokenIndex=r,s.lineNumber=i,s}return Object(Z["a"])(n,[{key:"constructHelper",value:function(){this.statement.forEach((function(t,e){"".concat("comma"==t.type?"":" ").concat(t.content)}))}}]),n}(Object(N["a"])(Error)),J=function(t){Object(q["a"])(n,t);var e=Object(A["a"])(n);function n(t,a,r,i){return Object(M["a"])(this,n),e.call(this,t,a,r,i)}return Object(Z["a"])(n,[{key:"what",value:function(){}}]),n}(I),R=function(){function t(e,n){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;Object(M["a"])(this,t),this.statement=e,this.lineNumber=n,this.currentToken=a}return Object(Z["a"])(t,[{key:"nextToken",value:function(){if(this.currentToken<this.statement.length)return this.statement[this.currentToken++];throw new J("Unexpected instruction end '"+this.statement[this.statement.length-1].content+"'.",this.statement,this.lineNumber,this.statement.length-1)}}]),t}(),H=function(t){Object(q["a"])(n,t);var e=Object(A["a"])(n);function n(){return Object(M["a"])(this,n),e.apply(this,arguments)}return Object(Z["a"])(n,[{key:"splitOpCode",value:function(t){}}]),n}(R),U=function(t){Object(q["a"])(n,t);var e=Object(A["a"])(n);function n(t,a){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return Object(M["a"])(this,n),e.call(this,t,a,r)}return n}(H),B=(n("680b"),n("9ae0"),a["default"].extend({name:"emulator",components:{editor:b,registers:y,instruction:k,tutorial:z},data:function(){return{lines:[]}},computed:{nodes:function(){var t=this;return this.lines.reduce((function(e,n,a){var r=t.parse(n,a);return null!==r&&e.push(r),e}),[])}},methods:{play:function(t){this.lines=Object(o["tokenize"])(t,o["languages"].armv7).reduce((function(t,e){return e instanceof o["Token"]&&("end"!==e.type?t[t.length-1].push(e):t.push([])),t}),[[]]),console.log(this.nodes)},parse:function(t,e){return 0===t.length?null:"bi-operand"===t[0].type?new U(t,e,0):null}}})),D=B,F=(n("e58e"),Object(f["a"])(D,r,i,!1,null,null,null)),G=F.exports,K=n("5f5b"),L=n("b1e0");n("f9e3"),n("2dd8"),n("15f5");o["languages"].armv7={"line-comment":{pattern:/\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},"bi-operand":{pattern:/\b(cmn|cmp|mov|mvn|teq|tst)s?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,alias:"operation"},"tri-operand":{pattern:/\b(adc|add|and|bic|eor|orr|rsb|rsc|sbc|sub)s?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,alias:"operation"},branch:{pattern:/\b(b|bl|bx)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,alias:"operation"},shift:{pattern:/\b(lsl|lsr|asr|ror|rrx)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,alias:"operation"},register:{pattern:/\b(r([0-9]|(10|11|12))|(sp|lr|pc))\b/i},hex:{pattern:/#?\b0x(\d|[a-f])+\b/i,alias:"immediate"},bin:{pattern:/#?\b0b(0|1)+\b/i,alias:"immediate"},oct:{pattern:/#?\b0[0-7]+\b/i,alias:"immediate"},dec:{pattern:/#?\b(0d)?(\d)+\b/i,alias:"immediate"},comma:/,/,label:/^\b[A-Za-z_][A-Za-z_\d]+\b:/m,"op-label":/(?!^)\b[A-Za-z_][A-Za-z_\d]+\b/m,end:/\n/m},a["default"].use(K["a"]),a["default"].use(L["a"]),a["default"].config.productionTip=!1,new a["default"]({render:function(t){return t(G)}}).$mount("#app")},e58e:function(t,e,n){"use strict";n("094b")}});
//# sourceMappingURL=app.e17ec1c5.js.map