(function(e){function t(t){for(var n,a,c=t[0],o=t[1],l=t[2],d=0,f=[];d<c.length;d++)a=c[d],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&f.push(i[a][0]),i[a]=0;for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n]);u&&u(t);while(f.length)f.shift()();return s.push.apply(s,l||[]),r()}function r(){for(var e,t=0;t<s.length;t++){for(var r=s[t],n=!0,c=1;c<r.length;c++){var o=r[c];0!==i[o]&&(n=!1)}n&&(s.splice(t--,1),e=a(a.s=r[0]))}return e}var n={},i={app:0},s=[];function a(t){if(n[t])return n[t].exports;var r=n[t]={i:t,l:!1,exports:{}};return e[t].call(r.exports,r,r.exports,a),r.l=!0,r.exports}a.m=e,a.c=n,a.d=function(e,t,r){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(a.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)a.d(r,n,function(t){return e[t]}.bind(null,n));return r},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],o=c.push.bind(c);c.push=t,c=c.slice();for(var l=0;l<c.length;l++)t(c[l]);var u=o;s.push([0,"chunk-vendors"]),r()})({0:function(e,t,r){e.exports=r("cd49")},"094b":function(e,t,r){},"23c8":function(e,t,r){"use strict";r("a90c")},"4d66":function(e,t,r){},"5f01":function(e,t,r){"use strict";r("c2f8")},"680b":function(e,t,r){},"6e0d":function(e,t,r){},"9ae0":function(e,t,r){},a59d:function(e,t,r){"use strict";r("4d66")},a901:function(e,t,r){"use strict";r("d837")},a90c:function(e,t,r){},a94e:function(e,t,r){"use strict";r("d2fb")},c2f8:function(e,t,r){},cd2f:function(e,t,r){},cd49:function(e,t,r){"use strict";r.r(t);r("e260"),r("e6cf"),r("cca6"),r("a79d");var n,i,s,a=r("2b0e"),c=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{attrs:{id:"app"}},[r("div",{staticClass:"container-fluid h-100"},[r("div",{staticClass:"row h-100"},[r("div",{staticClass:"col-12 h-100",attrs:{id:"emulator"}},[e._m(0),r("div",{staticClass:"row px-0",staticStyle:{height:"calc(100% - 36px)"}},[r("div",{staticClass:"col-5 col-md-4 col-lg-3 pr-1"},[r("registers")],1),r("div",{staticClass:"col-7 col-md-8 col-lg-9 pl-1",staticStyle:{height:"calc(100% - 232px)"}},[r("div",{staticClass:"row px-0 h-100"},[r("div",{staticClass:"col-8 pr-1"},[r("editor",{on:{run:function(t){return e.start(t)}}})],1),r("div",{staticClass:"col-4 pl-1"},[r("tutorial")],1)]),r("div",{staticClass:"row px-0 pt-2",staticStyle:{height:"210px"}},[r("div",{staticClass:"col-6 pr-1"},[r("instruction")],1),r("div",{staticClass:"col-6 pl-1"},[r("memory")],1)]),e._m(1)])])])])])])},o=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"row px-0",staticStyle:{height:"24px"}},[r("div",{staticClass:"col-5 col-md-4 col-lg-3 pr-1 text-left"},[r("h5",{staticClass:"mb-0"},[e._v("registers")])]),r("div",{staticClass:"col-7 col-md-8 col-lg-9 pl-1 text-left"},[r("div",{staticClass:"row px-0"},[r("div",{staticClass:"col-8 pr-1"},[r("h5",{staticClass:"mb-0"},[e._v("editor")])]),r("div",{staticClass:"col-4 pl-1"},[r("h5",{staticClass:"mb-0"},[e._v("tutorial")])])])])])},function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"row px-0",staticStyle:{height:"24px"}},[r("div",{staticClass:"col-6 pr-1 text-left"},[r("h5",{staticClass:"mb-0"},[e._v("assembler")])]),r("div",{staticClass:"col-6 pl-1 text-left"},[r("h5",{staticClass:"mb-0"},[e._v("memory")])])])}],l=(r("a15b"),r("d81d"),r("d3b7"),r("96cf"),r("1da1")),u=r("5530"),d=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"prism-container pl-1 pr-0 py-1 position-relative",on:{mouseover:e.hover}},[r("prism-editor",{attrs:{id:"editor",highlight:e.highlighter,"tab-size":1,"insert-spaces":!1,"line-numbers":""},model:{value:e.program,callback:function(t){e.program=t},expression:"program"}}),r("div",{attrs:{id:"buttons"}},[r("i",{staticClass:"stop fas fa-stop mx-1 clickable",on:{click:e.stop}}),r("i",{staticClass:"play fas fa-play mx-1 clickable",on:{click:function(t){return e.$emit("run",e.program)}}}),r("i",{staticClass:"step fas fa-step-forward clickable"})]),r("div",{attrs:{id:"error"}},[r("div",{staticClass:"p-1",staticStyle:{"border-radius":"0.3rem","background-color":"#191d21"}},[""!==e.tooltip.title?[r("div",{staticStyle:{color:"crimson"}},[e._v(e._s(e.tooltip.title))]),r("div",[e._v(e._s(e.tooltip.message))])]:e.errors.length>0?r("div",[e._v(" "+e._s(e.errors.length)+" errors ")]):e._e()],2)])],1)},f=[],h=(r("99af"),r("c740"),r("4160"),r("caad"),r("ac1f"),r("2532"),r("466d"),r("1276"),r("159b"),r("cb29"),r("c19f"),r("fb2c"),r("9a8c"),r("a975"),r("735e"),r("c1ac"),r("d139"),r("3a7b"),r("d5d6"),r("82f8"),r("e91f"),r("60bd"),r("5f96"),r("3280"),r("3fcc"),r("ca91"),r("25a1"),r("cd26"),r("3c5d"),r("2954"),r("649e"),r("219c"),r("170b"),r("b39a"),r("72f7"),r("3835")),p=r("2909"),b=r("ade3");(function(e){e[e["AND"]=0]="AND",e[e["EOR"]=1]="EOR",e[e["SUB"]=2]="SUB",e[e["RSB"]=3]="RSB",e[e["ADD"]=4]="ADD",e[e["ADC"]=5]="ADC",e[e["SBC"]=6]="SBC",e[e["RSC"]=7]="RSC",e[e["TST"]=8]="TST",e[e["TEQ"]=9]="TEQ",e[e["CMP"]=10]="CMP",e[e["CMN"]=11]="CMN",e[e["ORR"]=12]="ORR",e[e["MOV"]=13]="MOV",e[e["BIC"]=14]="BIC",e[e["MVN"]=15]="MVN",e[e["LDR"]=16]="LDR",e[e["STR"]=17]="STR",e[e["B"]=32]="B",e[e["BL"]=33]="BL",e[e["BX"]=34]="BX"})(s||(s={}));var m,g,v,R={and:s.AND,eor:s.EOR,sub:s.SUB,rsb:s.RSB,add:s.ADD,adc:s.ADC,sbc:s.SBC,rsc:s.RSC,tst:s.TST,teq:s.TEQ,cmp:s.CMP,cmn:s.CMN,orr:s.ORR,mov:s.MOV,bic:s.BIC,mvn:s.MVN,ldr:s.LDR,str:s.STR,bx:s.BX,bl:s.BL,b:s.B};n={},Object(b["a"])(n,s.AND,"Bitwise AND"),Object(b["a"])(n,s.EOR,"Bitwise XOR"),Object(b["a"])(n,s.SUB,"Subtraction"),Object(b["a"])(n,s.RSB,"Reverse Subtraction"),Object(b["a"])(n,s.ADD,"Addition"),Object(b["a"])(n,s.ADC,"Add with Carry"),Object(b["a"])(n,s.SBC,"Subtract with Carry"),Object(b["a"])(n,s.RSC,"Reverse Subtraction with Carry"),Object(b["a"])(n,s.TST,"Test"),Object(b["a"])(n,s.TEQ,"Test Equivalence"),Object(b["a"])(n,s.CMP,"Compare"),Object(b["a"])(n,s.CMN,"Compare Negative"),Object(b["a"])(n,s.ORR,"Bitwise OR"),Object(b["a"])(n,s.MOV,"Move"),Object(b["a"])(n,s.BIC,"Bit Clear"),Object(b["a"])(n,s.MVN,"Move Negative"),Object(b["a"])(n,s.LDR,"Load"),Object(b["a"])(n,s.STR,"Store"),Object(b["a"])(n,s.B,"Branch"),Object(b["a"])(n,s.BL,"Branch and Link"),Object(b["a"])(n,s.BX,"Branch and Exchange"),i={},Object(b["a"])(i,s.AND,"Performs a bitwise AND operation and stores the result."),Object(b["a"])(i,s.EOR,"Performs a bitwise exclusive OR operation and stores the result."),Object(b["a"])(i,s.SUB,"Performs an arithmetic subtraction from left to right and stores the result."),Object(b["a"])(i,s.RSB,"Performs an arithmetic subtraction from right to left and stores the result."),Object(b["a"])(i,s.ADD,"Performs an arithmetic addition and stores the result."),Object(b["a"])(i,s.ADC,"???"),Object(b["a"])(i,s.SBC,"???"),Object(b["a"])(i,s.RSC,"???"),Object(b["a"])(i,s.TST,"Performs a bitwise AND operation, sets the CPSR flags and discards the result."),Object(b["a"])(i,s.TEQ,"Performs a bitwise XOR operation, sets the CPSR flags and discards the result."),Object(b["a"])(i,s.CMP,"Performs an arithmetic subtraction, sets the CPSR flags and discards the result."),Object(b["a"])(i,s.CMN,"Performs an arithmetic addition, sets the CPSR flags and discards the result."),Object(b["a"])(i,s.ORR,"Performs a bitwise OR operation and stores the result."),Object(b["a"])(i,s.MOV,"Stores the second operand value in the destination register."),Object(b["a"])(i,s.BIC,"Performs a bitwise AND operation with the complement of the second operand."),Object(b["a"])(i,s.MVN,"Stores the additive inverse of the second operand value in the destination register."),Object(b["a"])(i,s.LDR,"Loads the data at the memory address in the source register into the destination register."),Object(b["a"])(i,s.STR,"Stores the data in the destination register into the memory address of the source register."),Object(b["a"])(i,s.B,"Branches to the provided instruction address or label."),Object(b["a"])(i,s.BL,"Branches to the provided instruction address or label and stores the return address."),Object(b["a"])(i,s.BX,"Branches to the provided instruction address or label and optionally changes instruction type.");(function(e){e[e["R0"]=0]="R0",e[e["R1"]=1]="R1",e[e["R2"]=2]="R2",e[e["R3"]=3]="R3",e[e["R4"]=4]="R4",e[e["R5"]=5]="R5",e[e["R6"]=6]="R6",e[e["R7"]=7]="R7",e[e["R8"]=8]="R8",e[e["R9"]=9]="R9",e[e["R10"]=10]="R10",e[e["R11"]=11]="R11",e[e["R12"]=12]="R12",e[e["SP"]=13]="SP",e[e["LR"]=14]="LR",e[e["PC"]=15]="PC"})(v||(v={}));var O,j=["r0","r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11","r12","sp","lr","pc"],y={r0:v.R0,r1:v.R1,r2:v.R2,r3:v.R3,r4:v.R4,r5:v.R5,r6:v.R6,r7:v.R7,r8:v.R8,r9:v.R9,r10:v.R10,r11:v.R11,r12:v.R12,sp:v.SP,lr:v.LR,pc:v.PC},_=(m={},Object(b["a"])(m,v.R0,"Register 0"),Object(b["a"])(m,v.R1,"Register 1"),Object(b["a"])(m,v.R2,"Register 2"),Object(b["a"])(m,v.R3,"Register 3"),Object(b["a"])(m,v.R4,"Register 4"),Object(b["a"])(m,v.R5,"Register 5"),Object(b["a"])(m,v.R6,"Register 6"),Object(b["a"])(m,v.R7,"Register 7"),Object(b["a"])(m,v.R8,"Register 8"),Object(b["a"])(m,v.R9,"Register 9"),Object(b["a"])(m,v.R10,"Register 10"),Object(b["a"])(m,v.R11,"Register 11"),Object(b["a"])(m,v.R12,"Register 12"),Object(b["a"])(m,v.SP,"Stack Pointer"),Object(b["a"])(m,v.LR,"Link Register"),Object(b["a"])(m,v.PC,"Program"),m),k=(g={},Object(b["a"])(g,v.R0,"General Purpose Register."),Object(b["a"])(g,v.R1,"General Purpose Register."),Object(b["a"])(g,v.R2,"General Purpose Register."),Object(b["a"])(g,v.R3,"General Purpose Register."),Object(b["a"])(g,v.R4,"General Purpose Register."),Object(b["a"])(g,v.R5,"General Purpose Register."),Object(b["a"])(g,v.R6,"General Purpose Register."),Object(b["a"])(g,v.R7,"General Purpose Register."),Object(b["a"])(g,v.R8,"General Purpose Register."),Object(b["a"])(g,v.R9,"General Purpose Register."),Object(b["a"])(g,v.R10,"General Purpose Register."),Object(b["a"])(g,v.R11,"General Purpose Register."),Object(b["a"])(g,v.R12,"General Purpose Register."),Object(b["a"])(g,v.SP,"The memory address for the top of the stack."),Object(b["a"])(g,v.LR,"The return address of the current function."),Object(b["a"])(g,v.PC,"The memory address of the next instruction."),g);(function(e){e[e["EQ"]=0]="EQ",e[e["NE"]=1]="NE",e[e["CS"]=2]="CS",e[e["CC"]=3]="CC",e[e["MI"]=4]="MI",e[e["PL"]=5]="PL",e[e["VS"]=6]="VS",e[e["VC"]=7]="VC",e[e["HI"]=8]="HI",e[e["LS"]=9]="LS",e[e["GE"]=10]="GE",e[e["LT"]=11]="LT",e[e["GT"]=12]="GT",e[e["LE"]=13]="LE",e[e["AL"]=14]="AL"})(O||(O={}));var x,T={eq:O.EQ,ne:O.NE,cs:O.CS,cc:O.CC,mi:O.MI,pl:O.PL,vs:O.VS,vc:O.VC,hi:O.HI,ls:O.LS,ge:O.GE,lt:O.LT,gt:O.GT,le:O.LE,al:O.AL,"":O.AL};(function(e){e[e["LSL"]=0]="LSL",e[e["LSR"]=1]="LSR",e[e["ASR"]=2]="ASR",e[e["ROR"]=3]="ROR"})(x||(x={}));var C,S,w,E,N={lsl:x.LSL,lsr:x.LSR,asr:x.ASR,ror:x.ROR};(function(e){e[e["N"]=0]="N",e[e["Z"]=1]="Z",e[e["C"]=2]="C",e[e["V"]=3]="V"})(E||(E={}));var I,P=(C={},Object(b["a"])(C,E.N,"N"),Object(b["a"])(C,E.Z,"Z"),Object(b["a"])(C,E.C,"C"),Object(b["a"])(C,E.V,"V"),C),A=(S={},Object(b["a"])(S,E.N,"Negative Flag (N)"),Object(b["a"])(S,E.Z,"Zero Flag (Z)"),Object(b["a"])(S,E.C,"Carry Flag (C)"),Object(b["a"])(S,E.V,"Overflow Flag (V)"),S),L=(w={},Object(b["a"])(w,E.N,"This bit is set when the signed result of the operation is negative."),Object(b["a"])(w,E.Z,"This bit is set when the result of the operation is equal to zero."),Object(b["a"])(w,E.C,"This bit is set when the operation results in an unsigned overflow."),Object(b["a"])(w,E.V,"This bit is set when the operation results in a signed overflow."),w);(function(e){e[e["REGISTER"]=0]="REGISTER",e[e["IMMEDIATE"]=1]="IMMEDIATE"})(I||(I={}));r("fb6a");var M=r("d4ec"),B=r("bee2"),D=r("262e"),G=r("2caf"),V=r("9072"),F=function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(e,n,i,s){var a;return Object(M["a"])(this,r),a=t.call(this),a.message=e,a.statement=n,a.lineNumber=i,a.tokenIndex=s,a}return Object(B["a"])(r,[{key:"type",get:function(){return"IriscError"}},{key:"constructHelper",value:function(){return"".concat(this.lineNumber," : ").concat(this.tokenIndex," ").concat(this.message)}}]),r}(Object(V["a"])(Error)),U=function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(e,n,i,s){return Object(M["a"])(this,r),t.call(this,e,n,i,s)}return Object(B["a"])(r,[{key:"type",get:function(){return"SyntaxError"}}]),r}(F),Z=function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(e,n,i,s){return Object(M["a"])(this,r),t.call(this,e,n,i,s)}return Object(B["a"])(r,[{key:"type",get:function(){return"NumericalError"}}]),r}(F),$=function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(e,n,i,s){return Object(M["a"])(this,r),t.call(this,e,n,i,s)}return Object(B["a"])(r,[{key:"type",get:function(){return"AssemblyError"}}]),r}(F),z=function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(e,n,i,s){return Object(M["a"])(this,r),t.call(this,e,n,i,s)}return Object(B["a"])(r,[{key:"type",get:function(){return"RuntimeError"}}]),r}(F);r("90d7"),r("25f0"),r("843c");function X(e){return e&=4294967295,Math.log2(e&-e)}function q(e){return e&=4294967295,Math.round(Math.log2(e))}function Q(e,t){return e>>t|e<<32-t}function H(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return console.log((t>>>0).toString(2)),console.log((t>>>0).toString(2).padEnd(e,"0")),console.log((t>>>0).toString(2).padEnd(e,"0").split("")),(t>>>0).toString(2).padEnd(e,"0").split("").map((function(e){return parseInt(e,10)}))}var J,W=function(){function e(t,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;Object(M["a"])(this,e),this._statement=t,this._lineNumber=r,this._currentToken=n}return Object(B["a"])(e,[{key:"statement",get:function(){return this._statement}},{key:"lineNumber",get:function(){return this._lineNumber}},{key:"nextToken",value:function(){if(this._currentToken<this._statement.length)return this._statement[this._currentToken++];throw new U("Unexpected instruction end '"+this._statement[this._statement.length-1].content+"'.",this._statement,this._lineNumber,this._statement.length-1)}},{key:"peekToken",value:function(){if(this._currentToken<this._statement.length)return this._statement[this._currentToken];throw new U("Unexpected instruction end '"+this._statement[this._statement.length-1].content+"'.",this._statement,this._lineNumber,this._statement.length-1)}},{key:"hasToken",value:function(){return this._currentToken<this._statement.length}},{key:"parseComma",value:function(e){if("comma"==e.type)return!0;throw new U("COMMA expected between operands - received "+e.type+" '"+e.content+"', instead.",this._statement,this._lineNumber,this._currentToken-1)}},{key:"parseReg",value:function(e){if("register"==e.type)return y[e.content];throw new U("REGISTER expected - received "+e.type.toUpperCase()+" '"+e.content+"' instead.",this._statement,this._lineNumber,this._currentToken-1)}},{key:"parseImm",value:function(e,t){var r,n=0,i=Object(p["a"])(e.content).reverse();if("bin"==e.alias)n=2,r=i.findIndex((function(e){return!"01".includes(e)}));else if("oct"==e.alias)n=8,r=i.findIndex((function(e){return!"01234567".includes(e)}));else if("dec"==e.alias)n=10,r=i.findIndex((function(e){return!"0123456789".includes(e)}));else{if("hex"!=e.alias)throw new U("IMMEDIATE value expected - received "+e.type.toUpperCase()+" '"+e.content+"' instead.",this._statement,this._lineNumber,this._currentToken);n=16,r=i.findIndex((function(e){return!"0123456789abcdef".includes(e)}))}r=i.length-r;var s=parseInt(e.content.slice(r),n);if(!t||s<Math.pow(2,t))return s;throw new Z("IMMEDIATE value '"+e.content+"' (decimal "+s+") is greater than the "+t+"-bit maximum.",this._statement,this._lineNumber,this._currentToken)}},{key:"parseShiftedImm",value:function(e,t){console.log(t);var r=this.parseImm(e),n=0;if(0==r)return[r,n];var i=X(r),s=q(r);if(console.log(s,i),s>31)throw new Z("IMMEDIATE value '".concat(e.content,"' (decimal ").concat(r,") cannot be represented in 32 bits."),this._statement,this._lineNumber,this._currentToken);if(s-i>t)throw new Z("IMMEDIATE value '".concat(e.content,"' (decimal ").concat(r,") cannot be implicitly represented with a maximum set-bit width of ").concat(t,"."),this._statement,this._lineNumber,this._currentToken);return s>t&&(r=Q(r,s-7),n=32-(s-7)),[r,n]}}]),e}(),K=(r("7db0"),r("b64b"),function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(){return Object(M["a"])(this,r),t.apply(this,arguments)}return Object(B["a"])(r,[{key:"op",get:function(){return this._op}},{key:"cond",get:function(){return this._cond}},{key:"setFlags",get:function(){return this._setFlags}},{key:"splitOpCode",value:function(e){var t,r="",n="",i="",s=["cmp","cmn","tst","teq"];r=null!==(t=Object.keys(R).find((function(t){return e.content.slice(0,t.length)===t})))&&void 0!==t?t:"";var a=e.content.substring(r.length);return 1!==a.length&&3!==a.length||(n=a[0],a=a.substring(1)),i=a,s.includes(r)&&(n="s"),[r,n,i]}}]),r}(W));(function(e){e[e["TEXT"]=0]="TEXT",e[e["DATA"]=1]="DATA",e[e["GLOBAL"]=2]="GLOBAL"})(J||(J={}));var Y={".text":J.TEXT,".data":J.DATA,".global":J.GLOBAL},ee=function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(e,n){var i,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;if(Object(M["a"])(this,r),i=t.call(this,e,n,s),!Y[i.peekToken().content])throw new U("Unrecognised directive '".concat(i.peekToken().content,"'."),e,n,s);if(i.directive=Y[i.nextToken().content],i.hasToken())throw new U("Unexpected token '".concat(i.peekToken().content,"' after valid section declaration end."),e,n,s+1);return i}return Object(B["a"])(r,[{key:"isText",get:function(){return this.directive===J.TEXT}},{key:"isData",get:function(){return this.directive===J.DATA}},{key:"isGlobal",get:function(){return this.directive===J.GLOBAL}}]),r}(W),te=function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(e,n){var i,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;if(Object(M["a"])(this,r),i=t.call(this,e,n,s),i._identifier=i.nextToken().content.slice(0,-1),i.hasToken())throw new U("Unexpected token '".concat(i.peekToken().content,"' after valid data declaration end."),e,n,s);return i}return Object(B["a"])(r,[{key:"identifier",get:function(){return this._identifier}}]),r}(W),re=function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(e,n){var i,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;Object(M["a"])(this,r),i=t.call(this,e,n,s),i._immShift=0,i.parseComma(i.nextToken());var a=i.parseRegOrImm(),c=Object(h["a"])(a,2),o=c[0],l=c[1];if(i._Rm=o,i._type=l,i.isReg&&i.hasToken()&&i.parseShift(),i.hasToken())throw new U("Unexpected token '".concat(i.peekToken().content,"' after valid instruction end."),i._statement,i._lineNumber,i._currentToken+1);return i}return Object(B["a"])(r,[{key:"isReg",get:function(){return this._type===I.REGISTER}},{key:"isImm",get:function(){return this._type===I.IMMEDIATE}},{key:"shifted",get:function(){return void 0!==this._Rs}},{key:"shiftedByReg",get:function(){return this._shiftType===I.REGISTER}},{key:"shiftedByImm",get:function(){return this._shiftType===I.IMMEDIATE}},{key:"parseRegOrImm",value:function(){var e,t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:8;try{e=this.parseReg(this.peekToken()),t=I.REGISTER}catch(c){if(!(c instanceof U))throw c}if(void 0===e)try{if(8==r){var n=this.parseShiftedImm(this.peekToken(),r),i=Object(h["a"])(n,2),s=i[0],a=i[1];e=s,this._immShift=a}else e=this.parseImm(this.peekToken(),r);t=I.IMMEDIATE}catch(c){if(!(c instanceof U))throw c}if(void 0===e||void 0===t)throw new U("Expected either REGISTER or IMMEDIATE value - received ".concat(this.peekToken().type.toUpperCase()," '").concat(this.peekToken().content,"' instead."),this._statement,this._lineNumber,this._currentToken);return this.nextToken(),[e,t]}},{key:"parseShift",value:function(){if(this.parseComma(this.nextToken()),"shift"!==this.peekToken().type)throw new U("The comma after the final operand indicates an optional shift, but no shift was found.",this._statement,this._lineNumber,this._currentToken);this._shift=N[this.nextToken().content];var e=this.parseRegOrImm(5),t=Object(h["a"])(e,2),r=t[0],n=t[1];this._Rs=r,this._shiftType=n}},{key:"unpack",value:function(){return[this._Rm,this._shift,this._Rs,this._immShift]}}]),r}(W),ne=function(e){Object(D["a"])(r,e);var t=Object(G["a"])(r);function r(e,n){var i,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;Object(M["a"])(this,r),i=t.call(this,e,n,s);var a=i.splitOpCode(i.nextToken()),c=Object(h["a"])(a,3),o=c[0],l=c[1],u=c[2];return i._op=R[o],i._setFlags=0!==l.length,i._cond=T[u],i._Rd=i.parseReg(i.nextToken()),i.peekToken(),i._flex=new re(e,n,i._currentToken),i}return Object(B["a"])(r,[{key:"unpack",value:function(){return[this._op,this._cond,this._setFlags,this._Rd,this._flex]}},{key:"assemble",value:function(){}}]),r}(K),ie=a["default"].observable({running:!1,paused:!1,step:!1,delay:1e3,cpu:{registers:new Uint32Array(new ArrayBuffer(64)),observableRegisters:Array(16).fill(0),cpsr:[!1,!1,!1,!1]},memory:{memstart:0,text:[],labels:{}},errors:[],hoveredError:null}),se={running:function(){return ie.running},paused:function(){return ie.paused},step:function(){return ie.step},delay:function(){return ie.delay},registers:function(){return ie.cpu.observableRegisters},cpsr:function(){return ie.cpu.cpsr},memory:function(){return Object(u["a"])(Object(u["a"])({},ie.memory),{},{textSize:ie.memory.text.length})},errors:function(){return ie.errors},hoveredError:function(){return ie.hoveredError}},ae={start:function(){ie.running=!0},pause:function(){ie.paused=!0},stop:function(){ie.running=!1,ie.paused=!1},instruction:function(e){return ie.memory.text[(e-ie.memory.memstart)/32]},reset:function(){ie.cpu.registers=new Uint32Array(new ArrayBuffer(64)),ie.cpu.cpsr=a["default"].observable([!1,!1,!1,!1]),this.cpu.observeRegisters()},addError:function(e){ie.errors.push(e)},hoverError:function(e){ie.hoveredError=e},unhoverError:function(){ie.hoveredError=null},cpu:{setRegister:function(e,t){a["default"].set(ie.cpu.registers,e,t),this.observeRegisters()},observeRegisters:function(){ie.cpu.observableRegisters=Object(p["a"])(ie.cpu.registers)},checkFlags:function(e){console.log("checking flags"),console.log(e);var t=H(4,e),r=ie.cpu.cpsr,n=!1;switch(e){case O.EQ:case O.NE:n=r[E.Z];break;case O.CS:case O.CC:n=r[E.C];break;case O.MI:case O.PL:n=r[E.N];break;case O.VS:case O.VC:n=r[E.V];break;case O.HI:case O.LS:n=r[E.C]&&!r[E.Z];break;case O.GE:case O.LT:n=r[E.N]==r[E.V];break;case O.GT:case O.LE:n=r[E.N]==r[E.V]&&!r[E.Z];break;default:return!0}return 1===t[0]&&(n=!n),n},setFlags:function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:" ";console.log("setting flags");var i=H(32,e)[31],s=H(32,t)[31],c=H(32,r)[31],o=H(33,r);console.log(i,s,c,o),console.log("".concat(o[31]," === 1"),1===o[31]),a["default"].set(ie.cpu.cpsr,E.N,1===o[31]),console.log("".concat(4294967295&r," === 0"),0===(4294967295&r)),a["default"].set(ie.cpu.cpsr,E.Z,0===(4294967295&r)),console.log("".concat(o[32]," === 1"),1===o[32]),a["default"].set(ie.cpu.cpsr,E.C,1===o[32]),"+"==n?a["default"].set(ie.cpu.cpsr,E.V,i===s&&i!==c):"-"==n&&a["default"].set(ie.cpu.cpsr,E.V,i!==s&&s===c),console.log(ie.cpu.cpsr)}},memory:{addInstruction:function(e){ie.memory.text.push(e)},addLabel:function(e,t){a["default"].set(ie.memory.labels,e,t)},hasLabel:function(e){return void 0!==ie.memory.labels[e]},label:function(e){return ie.memory.labels[e]},clear:function(){ie.memory.memstart=0,ie.memory.text=[],ie.memory.labels={},ie.errors=[]}},execute:function(e){console.log("execute",e),e instanceof ne&&le(e)}};function ce(e){var t,r,n=e.unpack(),i=Object(h["a"])(n,4),s=i[0],a=i[1],c=i[2],o=i[3];if(e.isImm)return Q(s,o);(t=ie.cpu.registers[s],e.shifted)&&(r=e.shiftedByImm?c:ie.cpu.registers[c],t=oe(a,t,r));return t}function oe(e,t,r){switch(e){case x.LSL:return t<<r;case x.LSR:return 0==r&&(r=32),t>>r;case x.ROR:return Q(t,r);default:throw new z("While attempting to perform a flex operand optional shift.",[],-1,-1)}}function le(e){var t=e.unpack(),r=Object(h["a"])(t,5),n=r[0],i=r[1],a=r[2],c=r[3],o=r[4];if(!ae.cpu.checkFlags(i))return!1;console.log(n,i,a,c,o);var l=ce(o);switch(n){case s.MOV:a&&ae.cpu.setFlags(ie.cpu.registers[c],l,l),ae.cpu.setRegister(c,l);break;case s.MVN:a&&ae.cpu.setFlags(ie.cpu.registers[c],-l,-l),ae.cpu.setRegister(c,-l);break;case s.CMP:ae.cpu.setFlags(ie.cpu.registers[c],l,ie.cpu.registers[c]-l,"-");break;case s.CMN:ae.cpu.setFlags(ie.cpu.registers[c],l,ie.cpu.registers[c]+l,"+");break;case s.TST:ae.cpu.setFlags(ie.cpu.registers[c],l,ie.cpu.registers[c]&l);break;case s.TEQ:ae.cpu.setFlags(ie.cpu.registers[c],l,ie.cpu.registers[c]^l);break}return!0}var ue=Object(u["a"])(Object(u["a"])({},ae),{},{getters:se}),de=(r("13d5"),r("c197"));function fe(e){return Object(de["tokenize"])(e,de["languages"].armv7).reduce((function(e,t){return t instanceof de["Token"]&&("end"===t.type?e.push([]):"whitespace"!==t.type&&e[e.length-1].push(t)),e}),[[]])}function he(e){return e.reduce((function(e,t,r){var n=pe(t,r);return null!==n&&e.push(n),e}),[])}function pe(e,t){if(0===e.length)return null;try{if("bi-operand"===e[0].type)return new ne(e,t,0);if("label"===e[0].type&&1===e.length)return new te(e,t,0);if("op-label"===e[0].type)throw new U("Invalid label-like token detected, did you forget a colon?",e,t,0)}catch(r){r instanceof F&&ue.addError(r)}return null}function be(e){var t;(function(e){e[e["Text"]=0]="Text",e[e["Data"]=1]="Data"})(t||(t={}));var r=t.Text;e.forEach((function(e,n){if(e instanceof ee)e.isText&&(r=t.Text),e.isData&&(r=t.Data);else if(e instanceof te){if(r!==t.Text)throw new $("Cannot declare branchable labels outside of the text section.",e.statement,e.lineNumber,-1);if(ue.memory.hasLabel(e.identifier))throw new $("Cannot declare multiple labels with the same name: '".concat(e.identifier,"'."),e.statement,e.lineNumber,0);ue.memory.addLabel(e.identifier,32*ue.getters.memory().textSize),"main"===e.identifier&&ue.cpu.setRegister(v.PC,ue.memory.label("main"))}else if(e instanceof K){if(r!==t.Text)throw new $("Cannot declare instructions outside of the .text section.",e.statement,e.lineNumber,-1);ue.memory.addInstruction(e)}}))}function me(e){var t,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:300;return function(){for(var n=this,i=arguments.length,s=new Array(i),a=0;a<i;a++)s[a]=arguments[a];clearTimeout(t),t=setTimeout((function(){return e.apply(n,s)}),r)}}var ge=r("e57a"),ve=(r("cabf"),r("a878"),a["default"].extend({name:"editor",components:{PrismEditor:ge["a"]},data:function(){return{program:"",tooltip:{title:"",message:""}}},computed:{errors:ue.getters.errors},methods:{stop:function(){ue.stop()},hover:function(e){if("token error"===e.target.parentNode.className){var t=e.target.parentNode.dataset["errorIdx"],r=this.errors[t];this.tooltip={title:r.type,message:r.message}}else this.tooltip={message:"",title:""}},highlighter:function(e){var t=Object(de["highlight"])(e,de["languages"].armv7,"ARMv7");if(0===t.length)return"";var r=t.split('<span class="token end">\n</span>'),n=r.map((function(e){var t;return null!==(t=e.match(/<span.*?<\/span>\s*/gim))&&void 0!==t?t:[]}));return this.errors.forEach((function(e,t){var r=n[e.lineNumber],i=-1,s=null===r||void 0===r?void 0:r.findIndex((function(t,r){if(t.includes("whitespace")||i++,i===e.tokenIndex)return!0})),a=null===r||void 0===r?void 0:r[s];void 0!==a&&(r[s]='<span class="token error" data-error-idx="'.concat(t,'">').concat(a,"</span>")),console.log(a,e.message)})),console.log(n),n.map((function(e){return e.join("")})).join('<span class="token end">\n</span>')}},watch:{program:me((function(e){ue.memory.clear();var t=fe(e),r=he(t);be(r)}),500)}})),Re=ve,Oe=(r("a59d"),r("2877")),je=Object(Oe["a"])(Re,d,f,!1,null,"6062abbf",null),ye=je.exports,_e=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},ke=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container text-center"},[r("div",{staticStyle:{"line-height":"200px","font-size":"28px"}},[e._v(" coming soon ")])])}],xe=a["default"].extend({name:"instruction"}),Te=xe,Ce=(r("efda"),Object(Oe["a"])(Te,_e,ke,!1,null,"e41e79f2",null)),Se=Ce.exports,we=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},Ee=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container text-center"},[r("div",{staticStyle:{"line-height":"200px","font-size":"28px"}},[e._v(" coming soon ")])])}],Ne=a["default"].extend({name:"memory"}),Ie=Ne,Pe=(r("a901"),Object(Oe["a"])(Ie,we,Ee,!1,null,"c5d0ddde",null)),Ae=Pe.exports,Le=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"d-flex flex-column container text-left py-3"},[e._l(e.registers,(function(t,n){return r("div",{key:n,staticClass:"register text-truncate",on:{mouseover:function(t){return e.registerTip(n)},mouseleave:e.untip}},[r("span",{staticClass:"register-name"},[e._v(e._s(e.regName[n]))]),e._v(" "+e._s(e.regstr(t))+" ")])})),r("div",{staticClass:"d-flex register cpsr my-3 pr-0"},[r("div",{staticClass:"flex-grow-1",on:{mouseover:function(t){return e.tip(e.cpsrTitle,e.cpsrExplain)},mouseleave:e.untip}},[e._v(" cpsr ")]),e._l(e.flagName,(function(t,n){return r("div",{key:n,staticClass:"flag",on:{mouseover:function(t){return e.tip(e.flagTitle[n],e.flagExplain[n])},mouseleave:e.untip}},[r("span",{staticClass:"flag-name"},[e._v(e._s(e.flagName[n]))]),e._v(" "+e._s(e.flagstr(e.cpsr[n]))+" ")])}))],2),r("div",{staticClass:"register flex-grow-1"},[r("div",[e._v(" "+e._s(e.computedTitle)+" ")]),r("div",{staticClass:"description"},[e._v(" "+e._s(e.computedDescription)+" ")])])],2)},Me=[],Be=(r("a4d3"),r("e01a"),r("4d90"),a["default"].extend({name:"registers",props:{msg:String},data:function(){return{regName:j,regTitle:_,regExplain:k,flagName:P,flagTitle:A,flagExplain:L,cpsrTitle:"CPSR Flags",cpsrExplain:"Four bits in the Current Program Status Register which are used to decide whether a conditional instruction should execute.",title:null,description:null}},computed:{registers:ue.getters.registers,cpsr:ue.getters.cpsr,computedTitle:function(){var e;return null!==(e=this.title)&&void 0!==e?e:"Registers"},computedDescription:function(){var e;return null!==(e=this.description)&&void 0!==e?e:"A simplified view of the data currently stored in the CPU. Hover over the different sections to learn about them."}},methods:{regstr:function(e){return"0x".concat(e.toString(16).padStart(8,"0")," (").concat(e,")")},hexstr:function(e){return"0x".concat(e.toString(16))},flagstr:function(e){return e?"1":"0"},registerTip:function(e){var t=this.registers[e],r=this.hexstr(t);this.tip(this.regTitle[e],"".concat(this.regExplain[e],"\n\nDec: ").concat(t,"\nHex: ").concat(r))},tip:function(e,t){this.title=e,this.description=t},untip:function(){this.title=null,this.description=null}}})),De=Be,Ge=(r("a94e"),Object(Oe["a"])(De,Le,Me,!1,null,"0ebc8f9a",null)),Ve=Ge.exports,Fe=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container px-2"},[r("prism-editor",{attrs:{id:"editor",highlight:e.highlighter,"tab-size":4,"line-numbers":""},model:{value:e.program,callback:function(t){e.program=t},expression:"program"}})],1)},Ue=[],Ze=a["default"].extend({name:"repl",components:{PrismEditor:ge["a"]},data:function(){return{program:""}},methods:{highlighter:function(e){return console.log(e),e}}}),$e=Ze,ze=(r("23c8"),r("d496"),Object(Oe["a"])($e,Fe,Ue,!1,null,"b5048b5c",null)),Xe=(ze.exports,function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)}),qe=[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"container text-center"},[r("div",{staticStyle:{"line-height":"200px","font-size":"28px"}},[e._v(" coming soon ")])])}],Qe=a["default"].extend({name:"tutorial"}),He=Qe,Je=(r("5f01"),Object(Oe["a"])(He,Xe,qe,!1,null,"49492fd2",null)),We=Je.exports,Ke=(r("680b"),r("9ae0"),a["default"].extend({name:"emulator",components:{editor:ye,registers:Ve,memory:Ae,instruction:Se,tutorial:We},computed:Object(u["a"])({},ue.getters),methods:{start:function(){this.running||(ue.reset(),this.errors.length>0?alert("This code has errors!\n\n\t".concat(this.errors.map((function(e){return"".concat(e.constructHelper())})).join("\n\t"))):this.run())},run:function(){var e=Object(l["a"])(regeneratorRuntime.mark((function e(){var t,r,n;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:ue.start(),e.prev=1;case 2:if(!this.running){e.next=18;break}if(t=ue.instruction(this.registers[v.PC]),void 0!==t){e.next=7;break}throw r=this.memory.text[this.memory.textSize-1],new z("Segmentation fault (core dumped)",r.statement,r.lineNumber,-1);case 7:ue.cpu.setRegister(v.PC,this.registers[v.PC]+32),ue.execute(t),n=0;case 10:if(!(n<this.delay||this.paused)||!this.running||this.step){e.next=16;break}return e.next=13,new Promise((function(e){return setTimeout(e,50)}));case 13:n+=50,e.next=10;break;case 16:e.next=2;break;case 18:e.next=23;break;case 20:e.prev=20,e.t0=e["catch"](1),e.t0 instanceof z&&(alert(e.t0.message),ue.stop());case 23:case"end":return e.stop()}}),e,this,[[1,20]])})));function t(){return e.apply(this,arguments)}return t}()}})),Ye=Ke,et=(r("e58e"),Object(Oe["a"])(Ye,c,o,!1,null,null,null)),tt=et.exports,rt=r("5f5b"),nt=r("b1e0");r("f9e3"),r("2dd8"),r("15f5");de["languages"].armv7={"line-comment":{pattern:/\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,greedy:!0},"bi-operand":{pattern:/\b(cmn|cmp|mov|mvn|teq|tst)s?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,alias:"operation"},"tri-operand":{pattern:/\b(adc|add|and|bic|eor|orr|rsb|rsc|sbc|sub)s?(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,alias:"operation"},branch:{pattern:/\b(b|bl|bx)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,alias:"operation"},shift:{pattern:/\b(lsl|lsr|asr|ror|rrx)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al)?\b/i,alias:"operation"},register:{pattern:/\b(r([0-9]|(10|11|12))|(sp|lr|pc))\b/i},immediate:[{pattern:/#\b0x(\d|[a-f])+\b/i,alias:"hex"},{pattern:/#\b0b(0|1)+\b/i,alias:"bin"},{pattern:/#\b0[0-7]+\b/i,alias:"oct"},{pattern:/#\b(0d)?(\d)+\b/i,alias:"dec"}],number:[{pattern:/\b0x(\d|[a-f])+\b/i,alias:"hex"},{pattern:/\b0b(0|1)+\b/i,alias:"bin"},{pattern:/\b0[0-7]+\b/i,alias:"oct"},{pattern:/\b(0d)?(\d)+\b/i,alias:"dec"}],comma:/,/,label:/\b[A-Za-z_][A-Za-z_\d]+\b:/m,"op-label":/\b[A-Za-z_][A-Za-z_\d]+\b/m,end:/\n/m,whitespace:/\s+/,unknown:/.+/},a["default"].use(rt["a"]),a["default"].use(nt["a"]),a["default"].config.productionTip=!1,new a["default"]({render:function(e){return e(tt)}}).$mount("#app")},d2fb:function(e,t,r){},d496:function(e,t,r){"use strict";r("cd2f")},d837:function(e,t,r){},e58e:function(e,t,r){"use strict";r("094b")},efda:function(e,t,r){"use strict";r("6e0d")}});
//# sourceMappingURL=app.89dd74ee.js.map