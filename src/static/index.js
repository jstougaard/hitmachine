$(function () {

        var playerId = window.location.hash;

        if (!playerId) {
          playerId = prompt("Please enter a unique tablet id", "pad1");
          window.location.hash = playerId;
        }

        console.log(playerId);

        var socket = io();
        var selectedId = null;
        var selectedRemote = {};

        function setSelected(id) {
          $('.brick').removeClass('selected');
          $('#' + id).addClass('selected');
          selectedId = id;
        }

        function removeSelected() {
          $('.brick').removeClass('selected');
          selectedId = null;
        }

        socket.on('selected-for-stage', function(_playerId, id){
          
          if (_playerId == playerId) {
            
            if (id) {
              setSelected(id);
            } else {
              removeSelected();
            }
            
          } else {
              // Remove existing selected
              if (selectedRemote[_playerId]) {
                  $('#' + id).addClass('selected-remote');
              }

              if (id) {
                  $('#' + id).addClass('selected-remote');
              }

              selectedRemote[_playerId] = id;
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

            socket.emit('selected-for-stage', playerId, selectedId);
            
            return false;

        });

        document.ontouchmove = function(event){
            event.preventDefault();
        };    
        
    });