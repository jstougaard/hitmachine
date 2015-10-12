$(function () {

        var stageId = window.location.hash.substring(1);

        if (!stageId) {
          //stageId = prompt("Please enter a unique tablet id", "pad1");
          //window.location.hash = stageId;
            console.log("No player", $("#setup_container"));
            $("#setup_container")
                .slideDown('slow')
                .find("a").on('click', function() {
                    //console.log("Clicked", $(this), this.hash);
                    stageId = this.hash.substring(1);
                    $("#setup_container").slideUp('slow', run);
                });


        } else {
            run();
        }

        function run() {
            console.log("ID", stageId);

            $("#brick_container").fadeIn();

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

            socket.on('selected-for-stage', function (_stageId, id) {

                if (_stageId == stageId) {

                    if (id) {
                        setSelected(id);
                    } else {
                        removeSelected();
                    }

                } else {
                    // Remove existing selected
                    if (selectedRemote[_stageId]) {
                        $('#' + id).addClass('selected-remote');
                    }

                    if (id) {
                        $('#' + id).addClass('selected-remote');
                    }

                    selectedRemote[_stageId] = id;
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

                socket.emit('selected-for-stage', stageId, selectedId);

                return false;

            });
        }

        document.ontouchmove = function(event){
            event.preventDefault();
        };    
        
    });