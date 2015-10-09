$(function () {

        var playerId = window.location.hash;

        if (!playerId) {
          playerId = prompt("Please enter a player id", "player1");
          window.location.hash = playerId;
        }

        console.log(playerId);

        var socket = io();
        var selectedId = null;
        var remoteSelectedId = -1;

        function setSelected(id) {
          $('.brick').removeClass('selected');
          $('#' + id).addClass('selected');
          selectedId = id;
        }

        function removeSelected() {
          $('.brick').removeClass('selected');
          selectedId = null;
        }

        socket.on('selected', function(_playerId, id){
          
          if (_playerId == playerId) {
            
            if (id) {
              setSelected(id);
            } else {
              removeSelected();
            }
            
          } else {

            $('#' + remoteSelectedId).removeClass('selected-remote');
            if (id) {
              $('#' + id).addClass('selected-remote');
            }
            remoteSelectedId = id;

          }
          
        });


        $(".brick").click(function () {
            if ($(this).hasClass('selected-remote')) return false;

            var id = $(this).attr('id');              
            if (id != selectedId) {
              setSelected(id);
            } else {
              removeSelected();
            }

            socket.emit('selected', playerId, selectedId);        
            
            return false;

        });

        document.ontouchmove = function(event){
            event.preventDefault();
        };    
        
    });