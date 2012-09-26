CodeMirror.defineMode("rust",function(){function h(a,b){return f=a,b}function i(a,b){var c=a.next();if(c=='"')return b.tokenize=j,b.tokenize(a,b);if(c=="'")return f="atom",a.eat("\\")?a.skipTo("'")?(a.next(),"string"):"error":(a.next(),a.eat("'")?"string":"error");if(c=="/"){if(a.eat("/"))return a.skipToEnd(),"comment";if(a.eat("*"))return b.tokenize=k(1),b.tokenize(a,b)}if(c=="#")return a.eat("[")?(f="open-attr",null):(a.eatWhile(/\w/),h("macro","meta"));if(c==":"&&a.match(":<"))return h("op",null);if(c.match(/\d/)||c=="."&&a.eat(/\d/)){var d=!1;return!a.match(/^x[\da-f]+/i)&&!a.match(/^b[01]+/)&&(a.eatWhile(/\d/),a.eat(".")&&(d=!0,a.eatWhile(/\d/)),a.match(/^e[+\-]?\d+/i)&&(d=!0)),d?a.match(/^f(?:32|64)/):a.match(/^[ui](?:8|16|32|64)/),h("atom","number")}return c.match(/[()\[\]{}:;,]/)?h(c,null):c=="-"&&a.eat(">")?h("->",null):c.match(e)?(a.eatWhile(e),h("op",null)):(a.eatWhile(/\w/),g=a.current(),a.match(/^::\w/)?(a.backUp(1),h("prefix","variable-2")):b.keywords.propertyIsEnumerable(g)?h(b.keywords[g],g.match(/true|false/)?"atom":"keyword"):h("name","variable"))}function j(a,b){var c,d=!1;while(c=a.next()){if(c=='"'&&!d)return b.tokenize=i,h("atom","string");d=!d&&c=="\\"}return h("op","string")}function k(a){return function(b,c){var d=null,e;while(e=b.next()){if(e=="/"&&d=="*"){if(a==1){c.tokenize=i;break}return c.tokenize=k(a-1),c.tokenize(b,c)}if(e=="*"&&d=="/")return c.tokenize=k(a+1),c.tokenize(b,c);d=e}return"comment"}}function m(){for(var a=arguments.length-1;a>=0;a--)l.cc.push(arguments[a])}function n(){return m.apply(null,arguments),!0}function o(a,b){var c=function(){var c=l.state;c.lexical={indented:c.indented,column:l.stream.column(),type:a,prev:c.lexical,info:b}};return c.lex=!0,c}function p(){var a=l.state;a.lexical.prev&&(a.lexical.type==")"&&(a.indented=a.lexical.indented),a.lexical=a.lexical.prev)}function q(){l.state.keywords=d}function r(){l.state.keywords=c}function s(a,b){function c(d){return d==","?n(a,c):d==b?n():n(c)}return function(d){return d==b?n():m(a,c)}}function t(a,b){return n(o("stat",b),a,p,u)}function u(a){return a=="}"?n():a=="let"?t(C,"let"):a=="fn"?t(G):a=="type"?n(o("stat"),H,v,p,u):a=="enum"?t(I):a=="mod"?t(K):a=="iface"?t(L):a=="impl"?t(M):a=="open-attr"?n(o("]"),s(w,"]"),p):a=="ignore"||a.match(/[\]\);,]/)?n(u):m(o("stat"),w,p,v,u)}function v(a){return a==";"?n():m()}function w(a){return a=="atom"||a=="name"?n(x):a=="{"?n(o("}"),z,p):a.match(/[\[\(]/)?Y(a,w):a.match(/[\]\)\};,]/)?m():a=="if-style"?n(w,w):a=="else-style"||a=="op"?n(w):a=="for"?n(S,E,F,w,w):a=="alt"?n(w,U):a=="fn"?n(G):a=="macro"?n(X):n()}function x(a){return g=="."?n(y):g=="::<"?n(N,x):a=="op"||g==":"?n(w):a=="("||a=="["?Y(a,w):m()}function y(a){return g.match(/^\w+$/)?(l.marked="variable",n(x)):m(w)}function z(a){if(a=="op"){if(g=="|")return n(B,p,o("}","block"),u);if(g=="||")return n(p,o("}","block"),u)}return g=="mutable"||g.match(/^\w+$/)&&l.stream.peek()==":"&&!l.stream.match("::",!1)?m(A(w)):m(u)}function A(a){function b(c){return g=="mutable"||g=="with"?(l.marked="keyword",n(b)):g.match(/^\w*$/)?(l.marked="variable",n(b)):c==":"?n(a,b):c=="}"?n():n(b)}return b}function B(a){return a=="name"?(l.marked="def",n(B)):a=="op"&&g=="|"?n():n(B)}function C(a){return a.match(/[\]\)\};]/)?n():g=="="?n(w,D):a==","?n(C):m(S,E,C)}function D(a){return a.match(/[\]\)\};,]/)?m(C):m(w,D)}function E(a){return a==":"?n(q,P,r):m()}function F(a){return a=="name"&&g=="in"?(l.marked="keyword",n()):m()}function G(a){return g=="@"||g=="~"?(l.marked="keyword",n(G)):a=="name"?(l.marked="def",n(G)):g=="<"?n(N,G):a=="{"?m(w):a=="("?n(o(")"),s(O,")"),p,G):a=="->"?n(q,P,r,G):a==";"?n():n(G)}function H(a){return a=="name"?(l.marked="def",n(H)):g=="<"?n(N,H):g=="="?n(q,P,r):n(H)}function I(a){return a=="name"?(l.marked="def",n(I)):g=="<"?n(N,I):g=="="?n(q,P,r,v):a=="{"?n(o("}"),q,J,r,p):n(I)}function J(a){return a=="}"?n():a=="("?n(o(")"),s(P,")"),p,J):(g.match(/^\w+$/)&&(l.marked="def"),n(J))}function K(a){return a=="name"?(l.marked="def",n(K)):a=="{"?n(o("}"),u,p):m()}function L(a){return a=="name"?(l.marked="def",n(L)):g=="<"?n(N,L):a=="{"?n(o("}"),u,p):m()}function M(a){return g=="<"?n(N,M):g=="of"||g=="for"?(l.marked="keyword",n(P,M)):a=="name"?(l.marked="def",n(M)):a=="{"?n(o("}"),u,p):m()}function N(a){return g==">"?n():g==","?n(N):g==":"?n(P,N):m(P,N)}function O(a){return a=="name"?(l.marked="def",n(O)):a==":"?n(q,P,r):m()}function P(a){return a=="name"?(l.marked="variable-3",n(Q)):g=="mutable"?(l.marked="keyword",n(P)):a=="atom"?n(Q):a=="op"||a=="obj"?n(P):a=="fn"?n(R):a=="{"?n(o("{"),A(P),p):Y(a,P)}function Q(a){return g=="<"?n(N):m()}function R(a){return a=="("?n(o("("),s(P,")"),p,R):a=="->"?n(P):m()}function S(a){return a=="name"?(l.marked="def",n(T)):a=="atom"?n(T):a=="op"?n(S):a.match(/[\]\)\};,]/)?m():Y(a,S)}function T(a){return a=="op"&&g=="."?n():g=="to"?(l.marked="keyword",n(S)):m()}function U(a){return a=="{"?n(o("}","alt"),V,p):m()}function V(a){return a=="}"?n():a=="|"?n(V):g=="when"?(l.marked="keyword",n(w,W)):a.match(/[\]\);,]/)?n(V):m(S,W)}function W(a){return a=="{"?n(o("}","alt"),u,p,V):m(V)}function X(a){return a.match(/[\[\(\{]/)?Y(a,w):m()}function Y(a,b){return a=="["?n(o("]"),s(b,"]"),p):a=="("?n(o(")"),s(b,")"),p):a=="{"?n(o("}"),s(b,"}"),p):n()}function Z(a,b,c){var d=a.cc;l.state=a,l.stream=b,l.marked=null,l.cc=d;for(;;){var e=d.length?d.pop():u;if(e(f)){while(d.length&&d[d.length-1].lex)d.pop()();return l.marked||c}}}var a=4,b=2,c={"if":"if-style","while":"if-style","else":"else-style","do":"else-style",ret:"else-style",fail:"else-style","break":"atom",cont:"atom","const":"let",resource:"fn",let:"let",fn:"fn","for":"for",alt:"alt",iface:"iface",impl:"impl",type:"type","enum":"enum",mod:"mod",as:"op","true":"atom","false":"atom",assert:"op",check:"op",claim:"op","native":"ignore",unsafe:"ignore","import":"else-style","export":"else-style",copy:"op",log:"op",log_err:"op",use:"op",bind:"op",self:"atom"},d=function(){var a={fn:"fn",block:"fn",obj:"obj"},b="bool uint int i8 i16 i32 i64 u8 u16 u32 u64 float f32 f64 str char".split(" ");for(var c=0,d=b.length;c<d;++c)a[b[c]]="atom";return a}(),e=/[+\-*&%=<>!?|\.@]/,f,g,l={state:null,stream:null,marked:null,cc:null};return p.lex=q.lex=r.lex=!0,{startState:function(){return{tokenize:i,cc:[],lexical:{indented:-a,column:0,type:"top",align:!1},keywords:c,indented:0}},token:function(a,b){a.sol()&&(b.lexical.hasOwnProperty("align")||(b.lexical.align=!1),b.indented=a.indentation());if(a.eatSpace())return null;f=g=null;var c=b.tokenize(a,b);return c=="comment"?c:(b.lexical.hasOwnProperty("align")||(b.lexical.align=!0),f=="prefix"?c:(g||(g=a.current()),Z(b,a,c)))},indent:function(c,d){if(c.tokenize!=i)return 0;var e=d&&d.charAt(0),f=c.lexical,g=f.type,h=e==g;return g=="stat"?f.indented+a:f.align?f.column+(h?0:1):f.indented+(h?0:f.info=="alt"?b:a)},electricChars:"{}"}}),CodeMirror.defineMIME("text/x-rustsrc","rust");