//VERSION=3
function setup( ){
  return{

    input: [{
      bands:["B04", "B08"],
    }],
    output: [{
      id: "default",
      bands: 1,
      sampleType: SampleType.FLOAT32},
    {
      id: "ndvi_image",
      bands: 3,
      sampleType: SampleType.AUTO}
    ]
  }
}


function evaluatePixel(sample) {
    let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04)

    if (ndvi<-0.5) image = [0.05,0.05,0.05]
    else if (ndvi<-0.2) image = [0.75,0.75,0.75]
    else if (ndvi<-0.1) image = [0.86,0.86,0.86]
    else if (ndvi<0) image = [0.92,0.92,0.92]
    else if (ndvi<0.025) image = [1,0.98,0.8]
    else if (ndvi<0.05) image = [0.93,0.91,0.71]
    else if (ndvi<0.075) image = [0.87,0.85,0.61]
    else if (ndvi<0.1) image = [0.8,0.78,0.51]
    else if (ndvi<0.125) image = [0.74,0.72,0.42]
    else if (ndvi<0.15) image = [0.69,0.76,0.38]
    else if (ndvi<0.175) image = [0.64,0.8,0.35]
    else if (ndvi<0.2) image = [0.57,0.75,0.32]
    else if (ndvi<0.25) image = [0.5,0.7,0.28]
    else if (ndvi<0.3) image = [0.44,0.64,0.25]
    else if (ndvi<0.35) image = [0.38,0.59,0.21]
    else if (ndvi<0.4) image = [0.31,0.54,0.18]
    else if (ndvi<0.45) image = [0.25,0.49,0.14]
    else if (ndvi<0.5) image = [0.19,0.43,0.11]
    else if (ndvi<0.55) image = [0.13,0.38,0.07]
    else if (ndvi<0.6) image = [0.06,0.33,0.04]
    else  image = [0,0.27,0]

    return {
      default: [ ndvi ],
      ndvi_image: image
  }
}