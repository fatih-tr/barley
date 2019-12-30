var classNames = [];
var model;

/*
load the class names 
*/
async function loadDict() {
  
    loc = 'model/class_names.txt'
    console.log(loc)
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
    console.log(classNames)	    
    }
}
/*
get the the class names 
*/
function getClassNames(indices) {
    var outp = []
    for (var i = 0; i < indices.length; i++)
        outp[i] = classNames[indices[i]]
    console.log(outp)	
    return outp
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
function preprocess(img)
{
	console.log(img.height)	
	if(img.height>600 && img.width>600) {
		img.height=299
		img.width=299
	}
 	console.log(img.height)
    //convert the image data to a tensor 
	
   img = tf.fromPixels(img).toFloat();
   let normalized = img.div(tf.scalar(255));
/*
    let tensor = tf.fromPixels(img)
    //resize to 50 X 50	
    //const resized = tf.image.resizeBilinear(tensor, [299, 299]).toFloat()
    // Normalize the image 
    const offset = tf.scalar(255.0);
    //const normalized = tf.scalar(1.0).sub(resized.div(offset));
    const normalized = tensor.div(offset);
*/
    //We add a dimension to get a batch shape 
    const batched = normalized.expandDims(0)
    return batched

}
/*
get the prediction 
*/
function predict(imgData) {
        var class_names = ['İnia 431 Altpleno', 'Black Negra Collena', 'Hvalhvas', 'Kankolla', 'RedRojo', 'Salcedo', 'İnia Santa Ana', 'Yellow Armerilla Demorongoni', 'Yelow Armerilla SacoCO', 'İlpainia'] 
        //get the prediction 
        var pred = model.predict(preprocess(imgData)).dataSync()
        console.log(pred)            
        //retreive the highest probability class label 
        const idx = tf.argMax(pred);

                
        //find the predictions 
        var indices = findIndicesOfMax(pred, 1)
        console.log(indices)
        var probs = findTopValues(pred, 1)
        var names = getClassNames(indices) 

        //set the table 
        //setTable(names, probs) 
        document.getElementById("Result").innerHTML = names
        //document.getElementById("Probability").innerHTML = probs
	console.log(names);
        console.log(document.getElementById("Result"));
    
  }

async function start(){
	//img = document.getElementById('image').files[0];
	
        
	var canvas = document.getElementById('canvas');
    	var ctx = canvas.getContext("2d");
    	var img = ctx.getImageData(1, 1, 299, 299);
    	//alert("Width of imgData is: " + img.width);
    	//ctx.putImageData(img, 10, 70);
	
	
        model = await tf.loadModel('model2/model.json')
        
        var status = document.getElementById('status')
      
        status.innerHTML = 'Model Yüklendi'
        
        //document.getElementById('status').innerHTML = 'Model Loaded';
      

        //img = document.getElementById('list').firstElementChild.firstElementChild;
	
	
        //model.predict(tf.zeros([null,50,50,3]))
        
	//load the class names
        await loadDict()
        predict(img)
         
        }
   

					

					  
