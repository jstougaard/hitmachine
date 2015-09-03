/// <reference path="../../types/types.ts" />

interface RhythmScope extends ng.IScope {
    pattern: Array<core.RhythmBlock>;
    basePattern?: Array<core.RhythmBlock>;
}

interface EditableRhythmBlock extends core.RhythmBlock {
    isValid?: boolean;
}

function rhythm(): ng.IDirective {

    var resolution: number = 16; // How many blocks in total





    var link = function(scope: RhythmScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) {

        var basePattern: Array<core.RhythmBlock> = scope.basePattern;
        var pattern: Array<core.RhythmBlock> = scope.pattern;

        var newBlock: EditableRhythmBlock = null;

        var canvas = <HTMLCanvasElement> element[0];
        var blockLength: number = canvas.width / resolution;

        scope.$watch("basePattern", function (newValue, oldValue) {
            console.log("Base pattern changed", "rendering", newValue);
            render(canvas);
        }, true);

        scope.$watch("pattern", function (newValue, oldValue) {
            console.log("Pattern changed", "rendering", newValue);
            render(canvas);
        }, true);

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

        var isMouseDown = false;
        canvas.addEventListener('mousedown', function(event:any) {
            // TESTING
            // console.log("BASE", scope.basePattern);

            // Check if clicked existing
            var position = getEventPosition(event);

            if (isValidStartingPoint(position)) {
                newBlock = getBlockAtPosition(position);
                if (newBlock) {
                    // Remove from pattern
                    console.log("Block exists", pattern.indexOf(newBlock));
                    pattern.splice(pattern.indexOf(newBlock), 1);
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
        canvas.addEventListener('mouseup', function(event:any) {
            if (newBlock && newBlock.length>0 && newBlock.isValid) {
                delete newBlock.isValid;
                pattern.push(newBlock);
            }
            newBlock = null;

            // Update scope
            scope.$apply();
            isMouseDown = false;

            render(canvas);
        });
        canvas.addEventListener('mousemove', function(event:any) {
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


        });

        render(canvas);



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
                    ctx.fillStyle = "#ccc";
                    basePattern.forEach(function(block) {
                        ctx.fillRect( block.start * blockLength + 1, 0, block.length * blockLength - 2, canvas.height );
                    });
                    ctx.restore();
                }

                // Draw lines
                for (var i = 1; i < resolution; i++) {
                    ctx.save();

                    if (i % 4 !== 0) {
                        ctx.setLineDash([5, 10]);
                    }

                    ctx.beginPath();
                    ctx.moveTo(i * blockLength, 0);
                    ctx.lineTo(i * blockLength, canvas.height);
                    ctx.stroke();

                    ctx.restore();
                }



                // Draw pattern
                pattern.forEach(function(block) {
                    drawBlock(block, "rgba(64, 128, 180, 0.95)");
                });

                // Draw new block
                if (newBlock && newBlock.length > 0) {
                    drawBlock(newBlock, newBlock.isValid?"rgba(64, 128, 180, 0.75)":"rgba(185, 40, 64, 0.5)");
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
            basePattern: "="
        },
        link: link
    };
}

angular
    .module("core.directives", [])
    .directive("rhythm", rhythm);
