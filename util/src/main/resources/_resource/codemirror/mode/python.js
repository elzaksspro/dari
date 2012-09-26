CodeMirror.defineMode("python",function(a,b){function d(a){return new RegExp("^(("+a.join(")|(")+"))\\b")}function t(a,b){if(a.sol()){var d=b.scopes[0].offset;if(a.eatSpace()){var l=a.indentation();return l>d?s="indent":l<d&&(s="dedent"),null}d>0&&w(a,b)}if(a.eatSpace())return null;var m=a.peek();if(m==="#")return a.skipToEnd(),"comment";if(a.match(/^[0-9\.]/,!1)){var n=!1;a.match(/^\d*\.\d+(e[\+\-]?\d+)?/i)&&(n=!0),a.match(/^\d+\.\d*/)&&(n=!0),a.match(/^\.\d+/)&&(n=!0);if(n)return a.eat(/J/i),"number";var o=!1;a.match(/^0x[0-9a-f]+/i)&&(o=!0),a.match(/^0b[01]+/i)&&(o=!0),a.match(/^0o[0-7]+/i)&&(o=!0),a.match(/^[1-9]\d*(e[\+\-]?\d+)?/)&&(a.eat(/J/i),o=!0),a.match(/^0(?![\dx])/i)&&(o=!0);if(o)return a.eat(/L/i),"number"}return a.match(p)?(b.tokenize=u(a.current()),b.tokenize(a,b)):a.match(i)||a.match(h)?null:a.match(g)||a.match(e)||a.match(k)?"operator":a.match(f)?null:a.match(q)?"keyword":a.match(r)?"builtin":a.match(j)?"variable":(a.next(),c)}function u(a){while("rub".indexOf(a.charAt(0).toLowerCase())>=0)a=a.substr(1);var d=a.length==1,e="string";return function(g,h){while(!g.eol()){g.eatWhile(/[^'"\\]/);if(g.eat("\\")){g.next();if(d&&g.eol())return e}else{if(g.match(a))return h.tokenize=t,e;g.eat(/['"]/)}}if(d){if(b.singleLineStringErrors)return c;h.tokenize=t}return e}}function v(b,c,d){d=d||"py";var e=0;if(d==="py"){if(c.scopes[0].type!=="py"){c.scopes[0].offset=b.indentation();return}for(var f=0;f<c.scopes.length;++f)if(c.scopes[f].type==="py"){e=c.scopes[f].offset+a.indentUnit;break}}else e=b.column()+b.current().length;c.scopes.unshift({offset:e,type:d})}function w(a,b,c){c=c||"py";if(b.scopes.length==1)return;if(b.scopes[0].type==="py"){var d=a.indentation(),e=-1;for(var f=0;f<b.scopes.length;++f)if(d===b.scopes[f].offset){e=f;break}if(e===-1)return!0;while(b.scopes[0].offset!==d)b.scopes.shift();return!1}return c==="py"?(b.scopes[0].offset=a.indentation(),!1):b.scopes[0].type!=c?!0:(b.scopes.shift(),!1)}function x(a,b){s=null;var d=b.tokenize(a,b),e=a.current();if(e===".")return d=b.tokenize(a,b),e=a.current(),d==="variable"||d==="builtin"?"variable":c;if(e==="@")return d=b.tokenize(a,b),e=a.current(),d==="variable"||e==="@staticmethod"||e==="@classmethod"?"meta":c;if(e==="pass"||e==="return")b.dedent+=1;(e===":"&&!b.lambda&&b.scopes[0].type=="py"||s==="indent")&&v(a,b);var f="[({".indexOf(e);return f!==-1&&v(a,b,"])}".slice(f,f+1)),s==="dedent"&&w(a,b)?c:(f="])}".indexOf(e),f!==-1&&w(a,b,e)?c:(b.dedent>0&&a.eol()&&b.scopes[0].type=="py"&&(b.scopes.length>1&&b.scopes.shift(),b.dedent-=1),d))}var c="error",e=new RegExp("^[\\+\\-\\*/%&|\\^~<>!]"),f=new RegExp("^[\\(\\)\\[\\]\\{\\}@,:`=;\\.]"),g=new RegExp("^((==)|(!=)|(<=)|(>=)|(<>)|(<<)|(>>)|(//)|(\\*\\*))"),h=new RegExp("^((\\+=)|(\\-=)|(\\*=)|(%=)|(/=)|(&=)|(\\|=)|(\\^=))"),i=new RegExp("^((//=)|(>>=)|(<<=)|(\\*\\*=))"),j=new RegExp("^[_A-Za-z][_A-Za-z0-9]*"),k=d(["and","or","not","is","in"]),l=["as","assert","break","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","lambda","pass","raise","return","try","while","with","yield"],m=["abs","all","any","bin","bool","bytearray","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip","__import__","NotImplemented","Ellipsis","__debug__"],n={builtins:["apply","basestring","buffer","cmp","coerce","execfile","file","intern","long","raw_input","reduce","reload","unichr","unicode","xrange","False","True","None"],keywords:["exec","print"]},o={builtins:["ascii","bytes","exec","print"],keywords:["nonlocal","False","True","None"]};if(!b.version||parseInt(b.version,10)!==3){l=l.concat(n.keywords),m=m.concat(n.builtins);var p=new RegExp("^(([rub]|(ur)|(br))?('{3}|\"{3}|['\"]))","i")}else{l=l.concat(o.keywords),m=m.concat(o.builtins);var p=new RegExp("^(([rb]|(br))?('{3}|\"{3}|['\"]))","i")}var q=d(l),r=d(m),s=null,y={startState:function(a){return{tokenize:t,scopes:[{offset:a||0,type:"py"}],lastToken:null,lambda:!1,dedent:0}},token:function(a,b){var c=x(a,b);return b.lastToken={style:c,content:a.current()},a.eol()&&a.lambda&&(b.lambda=!1),c},indent:function(a,b){return a.tokenize!=t?0:a.scopes[0].offset}};return y}),CodeMirror.defineMIME("text/x-python","python");