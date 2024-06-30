var jsonSchemaEditor = CodeMirror.fromTextArea
	(document.getElementById('jsonSchemaArea'), {
		mode: "application/json",
		theme: "dracula",
		lineNumbers: true,
		lineWrapping: true,
		scrollbarStyle: "simple",
		extraKeys: {
			"F11": function (cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function (cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		}
	});

var inputJsonEditor = CodeMirror.fromTextArea
	(document.getElementById('inputJson'), {
		mode: "text/x-groovy",
		theme: "dracula",
		lineNumbers: true,
		lineWrapping: true,
		scrollbarStyle: "simple",
		extraKeys: {
			"F11": function (cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function (cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		}
	});
inputJsonEditor.setSize("100%", "100%");
jsonSchemaEditor.setSize("100%", "100%");

function copyJSONSchema() {
	/* Get the text field */
	var copyText = jsonSchemaEditor.getDoc().getValue();
	navigator.clipboard.writeText(copyText);
}
function copyJson(editorName) {
	/* Get the text field */
	if (editorName == "JSON Schema") {
		var copyText = jsonSchemaEditor.getDoc().getValue();
		navigator.clipboard.writeText(copyText);
	} else if (editorName == "Input JSON") {
		var copyText = inputJsonEditor.getDoc().getValue();
		navigator.clipboard.writeText(copyText);
	}
}

function resolveGroovySimpleTemplateScript(){
	postData();
}

async function postData() {
	var button = document.getElementById('resolveGroovySimpleTemplateScript');
	button.disabled = true;
	button.innerText = "Processing.."

	var inputJson = inputJsonEditor.getDoc().getValue();
	var clientid = localStorage.getItem('vivek9237-online-groovy-template-resolver_clientid');
	var clientsecret = localStorage.getItem('vivek9237-online-groovy-template-resolver_clientsecret');
	
	inputJson = btoa(inputJson);

	const url = 'https://script.google.com/macros/s/AKfycbyerGRNnogA8YtGirI2jl1ec1aRGEaw0w1h5Ryhl4K6ujrzcxPqvdf05yvsXb6jpnZR/exec';
	const data = { template : inputJson, clientid : clientid, clientsecret : clientsecret};
	try {
	  const response = await fetch(url, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	  });
	  console.log(response);
	  if (!response.ok) {
		throw new Error('Network response was not ok ' + response.statusText);
	  }
	  const responseData = await response.json(); // Parsing the JSON response
	  console.log(responseData); // Handling the data
	  var output;
	  try{
		output = JSON.parse(responseData.data).output;
		jsonSchemaEditor.getDoc().setValue(output);
	  } catch(error){
		jsonSchemaEditor.getDoc().setValue("Unexpected error! 😔");
	  }
	} catch (error) {
	  console.error('There has been a problem with your fetch operation:', error);
	} finally{
		var resolve_button = document.getElementById('resolveGroovySimpleTemplateScript');
		resolve_button.disabled = false;
		button.innerText = "Resolve >"
	}
  }
  