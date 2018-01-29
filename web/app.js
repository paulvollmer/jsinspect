const fs = require('fs');
const jsinspect = require('../index')
const concat = require('concat-stream')

window.process = function() {
  const file = 'test.js'
  const filecontent = editorSource.getDoc().getValue();
  fs.writeFile(file, filecontent, function(err) {
    if (err) {
      throw new Error(err)
    }
  });

  var config = {
    threshold:    parseInt(document.getElementById('config-threshold').value),
    identifiers:  true,
    literals:     true,
    minInstances: parseInt(document.getElementById('config-mininstances').value)
  }
  var inspect = new jsinspect.Inspector([file], config)
  var reporterConfig = {
    writableStream: concat(onFinish)
  }
  var reporter = new jsinspect.reporters.json(inspect, reporterConfig)
  inspect.run()

  function onFinish (data) {
    var result = JSON.parse(data)

    var html = ''
    for (var i = 0; i < result.length; i++) {
      html += '<b>Instance '+ (i+1) +'</b>'
      for (var j = 0; j < result[i].instances.length; j++) {
        var instance = result[i].instances[j]
        html += '<p>Line <code>'+instance.lines[0]+'</code> to <code>'+instance.lines[1]+'</code><p>'
        html += '<pre>'+instance.code+'</pre>'
      }
    }

    html += '<b>Raw Data</b>'
    html += '<pre>'+JSON.stringify(result, '', '  ')+'</pre>'

    document.getElementById('result').innerHTML = html
  }
}
