
//Display element when checkbox is selected
function DisplaySignup(){
    if (document.getElementById('emailRegister').checked){
        document.getElementById('emailRegCard').style.display = 'flex';
    } else {
        document.getElementById('emailRegCard').style.display = 'none';
    }
}

//JavaScript For Age Slider

function ageChanged(val){
    let output = document.getElementById("AgeInput");
    output.innerHTML = val; // Display the default slider value
}

//Enable inputs when edit button is clicked
function editInformation(){
    document.getElementById('first-name').disabled = false;
    document.getElementById('last-name').disabled = false;
    document.getElementById('rangeAge').disabled = false;
    document.getElementById('degree').disabled = false;
    document.getElementById('faveCourse').disabled = false;
    document.getElementById('saveButton').disabled =false;
}