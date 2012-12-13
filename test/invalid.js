
// NOTES:
//  - the errors actually still need to be reviewed to check that they
//    are fully correct interpretations of the IDLs

var wp = require("../")
,   expect = require("expect.js")
,   pth = require("path")
,   fs = require("fs")
;
describe("Parses all of the invalid IDLs to check that they blow up correctly", function () {
    var dir = pth.join(__dirname, "widlproc/test/invalid/idl")
    ,   skip = {}
    ,   idls = fs.readdirSync(dir)
                  .filter(function (it) { return (/\.widl$/).test(it) && !skip[it]; })
                  .map(function (it) { return pth.join(dir, it); })
    ,   errors = idls.map(function (it) { return pth.join(__dirname, "error", pth.basename(it).replace(".widl", ".json")); })
    ;
    
    for (var i = 0, n = idls.length; i < n; i++) {
        var idl = idls[i], error = JSON.parse(fs.readFileSync(errors[i], "utf8"));
        var func = (function (idl, err) {
            return function () {
                var error;
                try {
                    var ast = wp.parse(fs.readFileSync(idl, "utf8"));
                    console.log(JSON.stringify(ast, null, 4));
                }
                catch (e) {
                    error = e;
                }
                finally {
                    expect(error).to.be.ok();
                    expect(error.message).to.equal(err.message);
                    expect(error.line).to.equal(err.line);
                }
                
            };
        }(idl, error));
        it("should produce the right error for " + idl, func);
        // XXX break as we make progress
        if (i === 4) break;
    }
});


// ․[ { type: 'whitespace',
//     value: '// getraises and setraises are not longer valid Web IDL\n' },
//   { type: 'identifier', value: 'interface' },
//   { type: 'whitespace', value: ' ' },
//   { type: 'identifier', value: 'Person' },
//   { type: 'whitespace', value: ' ' },
//   { type: 'whitespace',
//     value: '\n\n  // An attribute that can raise an exception if it is set to an invalid value.\n  ' },
//   { type: 'whitespace',
//     value: '\n\n  // An attribute whose value cannot be assigned to, and which can raise an\n  // exception some circumstances.\n  ' },
//   { type: 'whitespace',
//     value: '\n  // This attribute always throws a SomeException and never returns a value.\n  ' },
//   { type: 'other', value: '{' },
//   { type: 'identifier', value: 'attribute' },
//   { type: 'whitespace', value: ' ' },
//   { type: 'identifier', value: 'DOMString' },
//   { type: 'whitespace', value: ' ' },
//   { type: 'identifier', value: 'name' },
//   { type: 'whitespace', value: ' ' },
//   { type: 'identifier', value: 'setraises' },
// 
// 
