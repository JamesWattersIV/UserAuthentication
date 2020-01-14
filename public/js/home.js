
//Display element when checkbox is selected
function DisplaySignup(){
    if (document.getElementById('emailRegister').checked){
        document.getElementById('emailRegCard').style.display = 'flex';
    } else {
        document.getElementById('emailRegCard').style.display = 'none';
    }
}

//JavaScript For Age Slider

let slider = document.getElementById("rangeAge");
let output = document.getElementById("AgeInput");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}