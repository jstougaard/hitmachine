/// <reference path="../../types/types.ts" />

interface RhythmScope extends ng.IScope {
    pattern: Array<core.RhythmBlock>;
    basePattern?: Array<core.RhythmBlock>;
    callOnChange?: Function;
    activeCell?:number;
}

interface RhythmAttributes extends ng.IAttributes {
    pattern: Array<core.RhythmBlock>;
    basePattern?: Array<core.RhythmBlock>;
    callOnChange?: Function;
    activeCell?:number;
    singleBeatPattern?: any;
}

interface EditableRhythmBlock extends core.RhythmBlock {
    isValid?: boolean;
}

function rhythm(): ng.IDirective {

    var resolution: number = 16; // How many blocks in total

    var colors = {
        base: "rgb(215, 220, 222)",
        block: "rgba(52, 152, 219, 0.95)",
        editBlock: "rgba(52, 152, 219, 0.5)",
        invalidBlock: "rgba(231, 76, 60, 0.5)",
        active: "#69D3BF",
        lines: "#7b8a8b"
    };



    var link = function(scope: RhythmScope, element: ng.IAugmentedJQuery, attrs: RhythmAttributes) {

        var basePattern: Array<core.RhythmBlock> = scope.basePattern;
        var pattern: Array<core.RhythmBlock> = scope.pattern || [];

        var newBlock: EditableRhythmBlock = null;

        var canvas = <HTMLCanvasElement> element[0];
        var blockLength: number = canvas.width / resolution;

        // Helper functions // TODO: Refactor
        var getEventPosition = function(event:any): number {
            return Math.floor( event.offsetX / (canvas.width / resolution) );
        };

        var isPositionWithinBlock = function(position: number, block: core.RhythmBlock): boolean {
            return block.start <= position && block.start + block.length > position;
        };

        var getBlockAtPosition = function(position:number) {
            var existingBlock: core.RhythmBlock = null;
            pattern.forEach(function(block: core.RhythmBlock) {
                if (isPositionWithinBlock(position, block)) {
                    existingBlock = block;
                }
            });
            return existingBlock;
        };

        var isAreaEditable = function(position:number): boolean {
            if (!basePattern) {
                return true; // If base pattern is not defined, everything is editable
            }

            var isEditable = false;
            basePattern.forEach(function(block:core.RhythmBlock) {
                if (isPositionWithinBlock(position, block)) {
                    isEditable = true;
                }
            });
            return isEditable;
        };

        var isValidStartingPoint = function(position:number): boolean {
            if (!basePattern) {
                return true; // If base pattern is not defined, everything is editable
            }

            if (getBlockAtPosition(position)) {
                return true; // If block already exists
            }

            return isAreaEditable(position);
        };

        var isValidEndPoint = function(startingPoint:number, position:number): boolean {

            var isValid = true;

            if (position <= startingPoint) {
                return true; // Removing is always valid // TODO: Is this the place to handle that logic?
            }

            // Check for overlap
            pattern.forEach(function(block:core.RhythmBlock) {
                if (position >= block.start && block.start > startingPoint) {
                    isValid = false;
                }
            });

            if (isValid && position >= resolution - 1) {
                return true;
            }

            // Check against base pattern
            if (isValid && basePattern) {
                isValid = false;
                basePattern.forEach(function(block:core.RhythmBlock) {
                    if (isPositionWithinBlock(position, block) || isPositionWithinBlock(position + 1, block)) {
                        isValid = true;
                    }
                });
            }


            return isValid;
        };

        var applyPatternChanges = function() {
            scope.pattern = pattern;
            scope.$apply();

            if (scope.callOnChange) {
                scope.callOnChange();
            }
        };


        if (attrs.activeCell) {
            scope.$watch("activeCell", function (newValue, oldValue) {
                render(canvas);
            }, true);
        }

        if (attrs.basePattern) {
            scope.$watch("basePattern", function (newValue, oldValue) {
                //console.log("Base pattern changed", "rendering", newValue);
                basePattern = newValue;
                render(canvas);
            }, true);
        }

        if (attrs.pattern) {
            scope.$watch("pattern", function (newValue, oldValue) {
                //console.log("Pattern changed", "rendering", newValue);
                pattern = newValue;
                render(canvas);
            }, true);



            var isMouseDown = false;
            if (typeof attrs.singleBeatPattern === 'undefined') {

                // Allow dragging

                canvas.addEventListener('mousedown', function (event:any) {

                    // Check if clicked existing
                    var position = getEventPosition(event);

                    if (isValidStartingPoint(position)) {
                        newBlock = getBlockAtPosition(position);
                        if (newBlock) {
                            // Remove from pattern
                            console.log("Block exists", pattern.indexOf(newBlock));
                            pattern.splice(pattern.indexOf(newBlock), 1);

                            scope.pattern = pattern;
                            newBlock.isValid = true;
                        } else {
                            newBlock = {
                                start: position,
                                length: 1,
                                isValid: true
                            };
                        }
                        isMouseDown = true;
                    }

                    render(canvas);

                }, false);
                canvas.addEventListener('mouseup', function (event:any) {
                    if (!isMouseDown) {
                        return;
                    }

                    var updated = newBlock && newBlock.isValid;
                    if (updated && newBlock.length > 0) {

                        if (newBlock.length > 0) {
                            delete newBlock.isValid;
                            pattern.push(newBlock);
                        }

                    }

                    // Update scope
                    if (updated) {
                        applyPatternChanges();
                    }

                    isMouseDown = false;
                    newBlock = null;
                    render(canvas);
                }, false);
                canvas.addEventListener('mousemove', function (event:any) {
                    // Set cursor
                    var position = getEventPosition(event);
                    var isValid = false;

                    // Define block
                    if (isMouseDown) {
                        isValid = isValidEndPoint(newBlock.start, position);
                        //if (isValid) {
                        newBlock.length = position - newBlock.start + 1;
                        //}
                        newBlock.isValid = isValid;
                        render(canvas);
                    } else {
                        isValid = isValidStartingPoint(position);
                    }

                    element.css("cursor", isValid ? "pointer" : "not-allowed");
                }, false);

                document.addEventListener("keydown", function(event: any) {
                    if (isMouseDown && event.which === 27) {
                        // Pressed ESC
                        console.log("Rhythm keypress", event.which);

                        // Update scope
                        applyPatternChanges();

                        isMouseDown = false;
                        newBlock = null;
                        render(canvas);
                    }

                }, false);
            } else {

                // Single click interaction

                canvas.addEventListener('mousemove', function (event:any) {
                    // Set cursor
                    var position = getEventPosition(event);
                    element.css("cursor", isValidStartingPoint(position) ? "pointer" : "not-allowed");
                });

                canvas.addEventListener('click', function(event: any) {
                    var position = getEventPosition(event);

                    if (isValidStartingPoint(position)) {

                        var existingBlock = getBlockAtPosition(position);

                        if (existingBlock) {
                            // Remove from pattern
                            pattern.splice(pattern.indexOf(existingBlock), 1);
                        } else {
                            // Add to pattern
                            pattern.push({start: position, length: 1});
                        }

                        // Update scope
                        scope.pattern = pattern;
                        scope.$apply();

                        // Pattern is changed
                        if (scope.callOnChange) {
                            scope.callOnChange();
                        }

                        render(canvas);

                    }



                });
            }
        }






        // Handle canvas size
        var container = element.parent();

        //Run function when browser resizes
        jQuery(window).resize( resizeCanvas );

        function resizeCanvas() {
            element.attr('width', $(container).width() ); //max width
            //element.attr('height', $(container).height() ); //max height

            blockLength = canvas.width / resolution;

            //Call a function to redraw other content (texts, images etc)
            render(canvas);
        }

        //Initial call - will also render
        resizeCanvas();



        function render(canvas: HTMLCanvasElement) {



            var ctx: CanvasRenderingContext2D = canvas.getContext("2d");
            var blockMargin = 5;


            // clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //ctx.canvas.width  = window.innerWidth;
            //ctx.canvas.height = window.innerHeight;

            function drawStage() {

                // Draw base pattern
                if (basePattern) {
                    ctx.save();
                    ctx.fillStyle = colors.base;
                    basePattern.forEach(function(block) {
                        ctx.fillRect( block.start * blockLength + 2, 0, block.length * blockLength - 4, canvas.height );
                    });
                    ctx.restore();
                }

                // Draw currently playing beat
                if (typeof scope.activeCell !== "undefined" && scope.activeCell !== null && scope.activeCell >= 0 && scope.activeCell < resolution) {
                    ctx.save();
                    ctx.fillStyle = colors.active;
                    ctx.fillRect( scope.activeCell * blockLength, 0, blockLength, canvas.height );
                    ctx.restore();
                }

                // Draw lines
                for (var i = 1; i < resolution; i++) {
                    ctx.save();

                    if (i % 4 !== 0) {
                        ctx.setLineDash([5, 10]);
                        ctx.strokeStyle = colors.lines;
                    } else {
                        ctx.lineWidth=3;
                        ctx.strokeStyle = "#444";
                    }

                    ctx.beginPath();
                    ctx.moveTo(i * blockLength, 0);
                    ctx.lineTo(i * blockLength, canvas.height);
                    //ctx.strokeStyle = colors.lines;
                    ctx.stroke();

                    ctx.restore();
                }



                // Draw pattern
                pattern.forEach(function(block) {
                    drawBlock(block, colors.block);
                });

                // Draw new block
                if (newBlock && newBlock.length > 0) {
                    drawBlock(newBlock, newBlock.isValid?colors.editBlock:colors.invalidBlock);
                }



            };

            function drawBlock(block:core.RhythmBlock, color:string) {
                ctx.save();
                ctx.fillStyle = color;
                ctx.fillRect( block.start * blockLength + blockMargin, blockMargin, block.length * blockLength - 2 * blockMargin, canvas.height - 2 * blockMargin );
                ctx.restore();
            }

            drawStage();

        }

    };

    return {
        restrict: "A",
        scope: {
            pattern: "=",
            basePattern: "=",
            callOnChange: "&",
            activeCell: "="
        },
        link: link
    };
}

angular
    .module("core.directives", [])
    .directive("rhythm", rhythm);
