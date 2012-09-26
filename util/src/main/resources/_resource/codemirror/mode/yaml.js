CodeMirror.defineMode("yaml",function(){var a=["true","false","on","off","yes","no"],b=new RegExp("\\b(("+a.join(")|(")+"))$","i");return{token:function(a,c){var d=a.peek(),e=c.escaped;c.escaped=!1;if(d=="#")return a.skipToEnd(),"comment";if(c.literal&&a.indentation()>c.keyCol)return a.skipToEnd(),"string";c.literal&&(c.literal=!1);if(a.sol()){c.keyCol=0,c.pair=!1,c.pairStart=!1;if(a.match(/---/))return"def";if(a.match(/\.\.\./))return"def";if(a.match(/\s*-\s+/))return"meta"}if(!c.pair&&a.match(/^\s*([a-z0-9\._-])+(?=\s*:)/i))return c.pair=!0,c.keyCol=a.indentation(),"atom";if(c.pair&&a.match(/^:\s*/))return c.pairStart=!0,"meta";if(a.match(/^(\{|\}|\[|\])/))return d=="{"?c.inlinePairs++:d=="}"?c.inlinePairs--:d=="["?c.inlineList++:c.inlineList--,"meta";if(c.inlineList>0&&!e&&d==",")return a.next(),"meta";if(c.inlinePairs>0&&!e&&d==",")return c.keyCol=0,c.pair=!1,c.pairStart=!1,a.next(),"meta";if(c.pairStart){if(a.match(/^\s*(\||\>)\s*/))return c.literal=!0,"meta";if(a.match(/^\s*(\&|\*)[a-z0-9\._-]+\b/i))return"variable-2";if(c.inlinePairs==0&&a.match(/^\s*-?[0-9\.\,]+\s?$/))return"number";if(c.inlinePairs>0&&a.match(/^\s*-?[0-9\.\,]+\s?(?=(,|}))/))return"number";if(a.match(b))return"keyword"}return c.pairStart=!1,c.escaped=d=="\\",a.next(),null},startState:function(){return{pair:!1,pairStart:!1,keyCol:0,inlinePairs:0,inlineList:0,literal:!1,escaped:!1}}}}),CodeMirror.defineMIME("text/x-yaml","yaml");