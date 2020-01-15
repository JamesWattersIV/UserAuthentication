
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
    needUserInfo();
    document.getElementById('cancel').hidden =false;
    //document.getElementById('saveButton').disabled =false;
}

function refreshPage(){
    window.location.reload();
}

function isEmpty(value){
    if(value == ''){
        return true;
    } else {
        return false;
    }
}

function needUserInfo(){
    document.getElementById('first-name').disabled = false;
    document.getElementById('last-name').disabled = false;
    document.getElementById('rangeAge').disabled = false;
    document.getElementById('degree').disabled = false;
    document.getElementById('faveCourse').disabled = false;
    document.getElementById('edit').disabled = true;

}

function validateEdit(){

    let fName = document.getElementById('first-name').value;
    let lName = document.getElementById('last-name').value;
    let Age = document.getElementById('rangeAge').value;
    let Degree = document.getElementById('degree').value;
    let favCourse = document.getElementById('faveCourse').value;
    console.log("Validating Information");
    if (isEmpty(fName) || isEmpty(lName) || isEmpty(Degree) || isEmpty(favCourse)){
        console.log("Need Info");
        needUserInfo();
    } else {
        console.log("Have Info");
    }

    //Use This to validate Edit
    /*fName.addEventListener('change', function () {
        alert("changed");
    });*/
}