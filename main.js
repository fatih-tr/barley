
/*
variables
*/
var model;
var img;
var classNames = [];
var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".png"];    
function Validate(oForm) {
    img = oForm.getElementsByTagName("input");
    for (var i = 0; i < img.length; i++) {
        var oInput = img[i];
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }
                
                if (!blnValid) {
                    alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));
                    return false;
                }
            }
        }
    }
  
    return true;
}
/*
get the the class names 
*/
function getClassNames(indices) {
    var outp = []
    for (var i = 0; i < indices.length; i++)
        outp[i] = classNames[indices[i]]
    return outp
}

/*
load the class names 
*/
async function loadDict() {
  
    loc = 'model/class_names.txt'
    
    await $.ajax({
        url: loc,
        dataType: 'text',
    }).done(success);
}

/*
load the class names
*/
function success(data) {
    const lst = data.split(/\n/)
    for (var i = 0; i < lst.length - 1; i++) {
        let symbol = lst[i]
        classNames[i] = symbol
    }
}

/*
get indices of the top probs
*/
function findIndicesOfMax(inp, count) {
    var outp = [];
    for (var i = 0; i < inp.length; i++) {
        outp.push(i); // add index to output array
        if (outp.length > count) {
            outp.sort(function(a, b) {
                return inp[b] - inp[a];
            }); // descending sort the output array
            outp.pop(); // remove the last index (index of smallest element in output array)
        }
    }
    return outp;
}

/*
find predictions
*/
function findTopValues(inp, count) {
    var outp = [];
    let indices = findIndicesOfMax(inp, count)
    // show  scores
    for (var i = 0; i < indices.length; i++)
        outp[i] = inp[indices[i]]
    return outp
}


/*
set the table of the predictions 
*/
function setTable(names, probs) {
    //loop over the predictions 
    for (var i = 0; i < names.length; i++) {
        let sym = document.getElementById('sym' + (i + 1))
        let prob = document.getElementById('prob' + (i + 1))
        sym.innerHTML = names[i]
        prob.innerHTML = Math.round(probs[i] * 100)
    }
    document.getElementById("Result").innerHTML = sym.innerHTML[0];

}    

/*
get the prediction 
*/
function predict(imgData) {
	tf.tidy(() => {
      
		//get the prediction 
		const pred = model.predict(preprocess(imgData)).dataSync()
		    
		//retreive the highest probability class label 
		const idx = pred.argMax();
		
		//find the predictions 
        const indices = findIndicesOfMax(pred, 1)
        const probs = findTopValues(pred, 1)
        const names = getClassNames(indices) 
        //set the table 
        //setTable(names, probs) 
        document.getElementById("Result").innerHTML = names
        document.getElementById("Probability").innerHTML = probs
    });
  }
	    

function preprocess(img)
{
return tf.tidy(()=>{
    //convert the image data to a tensor 
    let tensor = tf.fromPixels(img)
    //resize to 50 X 50
    const resized = tf.image.resizeBilinear(tensor, [299, 299]).toFloat()
    // Normalize the image 
    const offset = tf.scalar(255.0);
    //const normalized = tf.scalar(1.0).sub(resized.div(offset));
    const normalized = ((tf.scalar(1.0).resized).div(offset);
    //We add a dimension to get a batch shape 
    const batched = normalized.expandDims(0)
    return batched
})
}

/*
load the model
*/

async function start(img) {
    
    Validate(img)
    //load the model 
    model = await tf.loadModel('model2/model.json')
        
    document.getElementById('status').innerHTML = 'Model Yüklendi';
        
    predict(img)
    
    //load the class names
    await loadDict()

    //else
        //return false    
    
}


