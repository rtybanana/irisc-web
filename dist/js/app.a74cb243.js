(function(t){function e(e){for(var r,c,s=e[0],o=e[1],l=e[2],f=0,p=[];f<s.length;f++)c=s[f],Object.prototype.hasOwnProperty.call(a,c)&&a[c]&&p.push(a[c][0]),a[c]=0;for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(t[r]=o[r]);u&&u(e);while(p.length)p.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,s=1;s<n.length;s++){var o=n[s];0!==a[o]&&(r=!1)}r&&(i.splice(e--,1),t=c(c.s=n[0]))}return t}var r={},a={app:0},i=[];function c(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=r,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)c.d(n,r,function(e){return t[e]}.bind(null,r));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],o=s.push.bind(s);s.push=e,s=s.slice();for(var l=0;l<s.length;l++)e(s[l]);var u=o;i.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("cd49")},"21f8":function(t,e,n){},"3fb8":function(t,e,n){"use strict";n("5897")},5897:function(t,e,n){},"680b":function(t,e,n){},"7ee0":function(t,e,n){"use strict";n("21f8")},"9ae0":function(t,e,n){},a210:function(t,e,n){},cd49:function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"container h-100"},[n("div",{staticClass:"row h-100"},[t._m(0),n("div",{staticClass:"col-12 my-auto",attrs:{id:"emulator"}},[t._m(1),n("div",{staticClass:"row px-0 my-auto",staticStyle:{"max-height":"500px",height:"500px"}},[n("div",{staticClass:"col-5 col-md-4 col-lg-3 pr-1"},[n("registers")],1),n("div",{staticClass:"col-7 col-md-8 col-lg-9 pl-1"},[n("editor",{on:{play:function(e){return t.play(e)}}})],1)])]),t._m(2)])])])},i=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"col-12 my-3"},[n("h1",[t._v("iRISC")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"row px-0 my-auto"},[n("div",{staticClass:"col-5 col-md-4 col-lg-3 pr-1 text-left"},[n("h5",{staticClass:"mb-0"},[t._v("registers")])]),n("div",{staticClass:"col-7 col-md-8 col-lg-9 pl-1 text-left"},[n("h5",{staticClass:"mb-0"},[t._v("editor")])])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"col-12"},[n("div",{staticClass:"col-6"})])}],c=(n("13d5"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"})}),s=[],o={name:"registers",props:{msg:String}},l=o,u=(n("3fb8"),n("2877")),f=Object(u["a"])(l,c,s,!1,null,"17604a07",null),p=f.exports,d=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container pl-1 pr-0 py-1 position-relative"},[n("prism-editor",{attrs:{id:"editor",highlight:t.highlighter,"tab-size":1,"insert-spaces":!1,"line-numbers":""},model:{value:t.program,callback:function(e){t.program=e},expression:"program"}}),n("div",{attrs:{id:"buttons"}},[n("i",{staticClass:"stop fas fa-stop mx-1 clickable"}),n("i",{staticClass:"play fas fa-play mx-1 clickable",on:{click:function(e){return t.$emit("play",t.program)}}}),n("i",{staticClass:"step fas fa-step-forward clickable"})])],1)},h=[],b=n("e57a"),m=(n("cabf"),n("c197")),v=(n("8ecc"),n("a878"),r["default"].extend({name:"editor",components:{PrismEditor:b["a"]},data:function(){return{program:""}},methods:{highlighter:function(t){return Object(m["highlight"])(t,m["languages"].armv7,"ARMv7")}}})),g=v,y=(n("7ee0"),Object(u["a"])(g,d,h,!1,null,"7c1ff948",null)),O=y.exports,j=n("262e"),x=n("2caf"),_=n("d4ec"),C=n("bee2"),k=(n("99af"),n("4160"),n("159b"),n("9072")),w=function(t){Object(j["a"])(n,t);var e=Object(x["a"])(n);function n(t,r,a,i){var c;return Object(_["a"])(this,n),c=e.call(this),c.message=t,c.statement=r,c.tokenIndex=a,c.lineNumber=i,c}return Object(C["a"])(n,[{key:"constructHelper",value:function(){this.statement.forEach((function(t,e){"".concat("comma"==t.type?"":" ").concat(t.content)}))}}]),n}(Object(k["a"])(Error)),E=function(t){Object(j["a"])(n,t);var e=Object(x["a"])(n);function n(t,r,a,i){return Object(_["a"])(this,n),e.call(this,t,r,a,i)}return Object(C["a"])(n,[{key:"what",value:function(){}}]),n}(w),P=function(){function t(e,n){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;Object(_["a"])(this,t),this.statement=e,this.lineNumber=n,this.currentToken=r}return Object(C["a"])(t,[{key:"nextToken",value:function(){if(this.currentToken<this.statement.length)return this.statement[this.currentToken++];throw new E("Unexpected instruction end '"+this.statement[this.statement.length-1].content+"'.",this.statement,this.lineNumber,this.statement.length-1)}}]),t}(),S=function(t){Object(j["a"])(n,t);var e=Object(x["a"])(n);function n(){return Object(_["a"])(this,n),e.apply(this,arguments)}return Object(C["a"])(n,[{key:"splitOpCode",value:function(t){}}]),n}(P),T=function(t){Object(j["a"])(n,t);var e=Object(x["a"])(n);function n(t,r){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return Object(_["a"])(this,n),e.call(this,t,r,a)}return n}(S),$=(n("680b"),n("9ae0"),r["default"].extend({name:"app",components:{registers:p,editor:O},data:function(){return{lines:[]}},computed:{nodes:function(){var t=this;return this.lines.reduce((function(e,n,r){var a=t.parse(n,r);return null!==a&&e.push(a),e}),[])}},methods:{play:function(t){this.lines=Object(m["tokenize"])(t,m["languages"].armv7).reduce((function(t,e){return e instanceof m["Token"]&&("end"!==e.type?t[t.length-1].push(e):t.push([])),t}),[[]]),console.log(this.nodes)},parse:function(t,e){return"bi-operand"===t[0].type?new T(t,e,0):null}}})),M=$,N=(n("fffb"),Object(u["a"])(M,a,i,!1,null,null,null)),z=N.exports,I=n("5f5b"),J=n("b1e0");n("f9e3"),n("2dd8"),n("15f5");r["default"].use(I["a"]),r["default"].use(J["a"]),r["default"].config.productionTip=!1,new r["default"]({render:function(t){return t(z)}}).$mount("#app")},fffb:function(t,e,n){"use strict";n("a210")}});
//# sourceMappingURL=app.a74cb243.js.map