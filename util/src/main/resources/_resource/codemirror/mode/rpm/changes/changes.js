CodeMirror.defineMode("changes",function(a,b){var c=/^-+$/,d=/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)  ?\d{1,2} \d{2}:\d{2}(:\d{2})? [A-Z]{3,4} \d{4} - /,e=/^[\w+.-]+@[\w.-]+/;return{token:function(a){if(a.sol()){if(a.match(c))return"tag";if(a.match(d))return"tag"}return a.match(e)?"string":(a.next(),null)}}}),CodeMirror.defineMIME("text/x-rpm-changes","changes");