CodeMirror.defineMode("diff",function(){return{token:function(a){var b=a.next();a.skipToEnd();if(b=="+")return"plus";if(b=="-")return"minus";if(b=="@")return"rangeinfo"}}}),CodeMirror.defineMIME("text/x-diff","diff");