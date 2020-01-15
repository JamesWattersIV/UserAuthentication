
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
    if (isEmpty(fName) || isEmpty(lName) || isEmpty(Degree) || isEmpty(favCourse) || (Age==0)){
        console.log("Need Info");
        needUserInfo();
        showModal();
    } else {
        console.log("Have Info");
    }
}

function showModal(){
    $('#infoModal').modal('show')
}

function validateAll(){
    let fName = document.getElementById('first-name').value;
    let lName = document.getElementById('last-name').value;
    let Age = document.getElementById('rangeAge').value;
    let Degree = document.getElementById('degree').value;
    let favCourse = document.getElementById('faveCourse').value;
}

//Event Listeners For Elements
document.getElementById('first-name').addEventListener('change', function () {
    alert("changed");
});

document.getElementById('last-name').addEventListener('change', function () {
    alert("changed");
});

document.getElementById('rangeAge').addEventListener('change', function () {
    alert("changed");
});

document.getElementById('degree').addEventListener('change', function () {
    alert("changed");
});

document.getElementById('faveCourse').addEventListener('change', function () {
    alert("changed");
});





