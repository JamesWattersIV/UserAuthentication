exports.isFirstLogin = function (db,userID){
    db.findOne({_id:userID}, function(err,foundUser) {
        if (err) {
            console.log(err, "No User Found");
        } else {
            //console.log(foundUser, 'User Found');
            if (foundUser.fName == undefined){
                console.log('First Login');
            } else {
                console.log('Already Logged In Before');
            }

           db.updateOne(
                {_id:userID}, //The record we are looking for
                {fName:'James',lName:'Watters',Age:23,degree:'BSc Geoinformatics',favCourse:'CSC'}, //Fields to update
                function(err){
                    if(err){
                        console.log(err,"could not update");
                    } else {
                        console.log("Successful Update");
                    }
                }
            );
        }
    });
};

