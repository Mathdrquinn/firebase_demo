$(document).ready(function() {

    var userFire;
    var UserFB;
    var user;

    var fire = new Firebase('https://fiery-torch-4029.firebaseio.com/');

    var users = fire.child('users');

    users.once('value', function(snapshot) {
        console.log(snapshot.val());

        $('#output1').html('')

        for (var i in snapshot.val()) {
            var user = snapshot.child(i).val();
            console.log(snapshot.child(i).val());
            $('#output1').append('<p class=\'card ' + snapshot.child(i).name() + '\'> <img class=\'cardPic\' src=\'http://placehold.it/50x50\' alt=\'placeholder\'/> First: ' + user.first + ', Hobby:' + user.hobby + ' <br/> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate dignissimos ex exercitationem magnam officiis optio pariatur perspiciatis quae veniam voluptate? Aut dolores ea eos, explicabo impedit nostrum optio pariatur velit.</p>');
        }

    }, function(errorObj) {
        console.log('Error: ' + errorObj);
    })

    users.on('child_added', function(snapshot) {
        var newUser = snapshot.val();
        $('#added').text('Added: ' + newUser.first + ' ' + newUser.last)
    })

    users.on('child_changed', function(snapshot) {
        var changed = snapshot.val()
        $('#updated').text('Updated: ' + changed.first + ' ' + changed.last)
    })

    users.on('child_removed', function(snapshot) {
        var deletedUser = snapshot.val();
        $('#removed').text('Removed: ' + deletedUser.first + ' ' + deletedUser.last)
    })

    $('#form').on('submit', function(e) {
        e.preventDefault();
        var updateUser = $('#updateName').val();
        var newHobby = $('#updateHobby').val();
        console.log('update: ' + updateUser);
        updateRef = users.child(updateUser);

        updateRef.update({hobby: newHobby})
    });

    $('#removeForm').on('submit', function(e) {
        e.preventDefault();
        var deletedUser = $('#removeUser').val();
        users.child(deletedUser).remove(function(error) {
            if (error) {
                alert('Error, invalid name')
            }
            else {console.log('that was good');}
        });
    });

    $('#input2').keypress(function(e) {
        if(e.keyCode == 13) {

            var first = $('#input1').val();
            var last = $('#input2').val();
            var hobby = 'sitting';

            var firstUserID = users.push({first: first, last: last, hobby: hobby});
            var userKey = firstUserID.name();
            console.log(firstUserID);
            console.log(userKey);

            console.log(users.child('kevin').name())

        }
    })

    $('#retrieve').on('submit', function(e) {
        e.preventDefault();

        users.on('value', function (snapshot) {

            for (var i in snapshot.val()) {
                if (snapshot.child(i).val().first === $('#nameFinder').val()) {
                    console.log(snapshot.child(i).name())
                    $('.' + snapshot.child(i).name()).css('background-color', 'lightblue');
                }
            }
        })
    })

    $('#login').on('click', function(e) {
        e.preventDefault();
        fire.authWithOAuthPopup("facebook", function(error, authData) {
            console.log('facebook should show');
        },{
            remember: "default",
            scope: "public_profile,email,user_friends"
        });
    })

    $('#logout').on('click', function (e) {
        e.preventDefault();
        fire.unauth();
        console.log('logout');
    })

    fire.onAuth(function(authData) {
        if (authData) {
            // user authenticated with Firebase
            console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);

            fire.child('users').child(authData.uid).set(authData)
            fire.child('users').child(authData.uid).update({comment: 'hello'});
            userFire = fire.child('users').child(authData.uid);
            userFire.on('value', function (snapshot) {
                user = snapshot.val();
                userFB = user.facebook;
                console.log('user');
                console.log(user);
                console.log(userFB);
                $('h1').text('Hello ' + userFB.displayName);
                $('.card').html('<span>I can make this card do so much</span>');
                console.log('poop')
                $('.card:nth-child(2)').css('background-color', 'lightblue');
            })
        } else {
            // user is logged out
        }
    });
});