$(document).ready(function () {
    let meassages = [];
    let socket = io.connect('http://localhost:8080');
    let chatForm = $('#chatForm');
    let message = $('#chatInput');
    let chatWindow = $('#chatWindow');
    let userForm = $('#userForm');
    let username = $('#username')
    let users = $('#users');
    let error = $('#error');


    //Submit User Form

    userForm.on('submit',function (e) {
        socket.emit('set user',username.val(),function(data){
            if(data){
                $('#userFormWrap').hide();
                $('#mainWrap').show();
            }else {
                error.html('Username is taken');
            }
        })
        e.preventDefault();

    })

    chatForm.on('submit',function (e) {
        socket.emit('send message',message.val());
        message.val('');
        e.preventDefault();
    })

    socket.on('show message',function (data) {
        chatWindow.append('<strong>'+data.user+'</strong>:'+data.msg+'<br>')
    })
    socket.on('users',function (data) {
        let html = '';
        for(let i = 0;i<data.length;i++){
            html +='<li class="list-group-item">'+data[i]+'</li>'
        }
        users.html(html);
    })

})