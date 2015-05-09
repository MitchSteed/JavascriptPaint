
var debugMode = false;

var model = {
    init: function() {
        model.shapes = [];
    },
    addNewShape: function(newShape) {
        model.shapes.push(newShape);
    },
    getShapes: function(){

    }
};

var drawingController = {
    init: function() {},
    initLine: function(position) {
        var line = {
            "type": "line",
            "point1": {
                "x":position.x,
                "y":position.y
            },
            "point2": {
                "x":position.x,
                "y":position.y
            },
            "color": controller.getCurrentColor()
        };
        controller.setNewCurrentShape(line);
    },
    draggedLine: function(position) {
         controller.currentShape["point2"] = {
            "x":position.x,
            "y":position.y
        };
    },
    initSquare: function(position) {
        var square = {
            "type":"square",
            "topLeftCorner": {
                "x":position.x,
                "y":position.y
            },
            "width":0,
            "height":0,
            "color": controller.getCurrentColor()
        };
        drawingController.initPoint = position;
        controller.setNewCurrentShape(square);
    },
    draggedSquare: function(position) {
        controller.currentShape["width"] = position.x - drawingController.initPoint.x;
        controller.currentShape["height"] = position.y - drawingController.initPoint.y;
    },
    initRectangle: function(position) {
        var rectangle = {
            "type":"rectangle",
            "topLeftCorner": {
                "x":position.x,
                "y":position.y
            },
            "width":0,
            "height":0,
            "color": controller.getCurrentColor()
        };
        drawingController.initPoint = position;
        controller.setNewCurrentShape(rectangle);
    },
    draggedRectangle: function(position) {
        controller.currentShape["width"] = position.x - drawingController.initPoint.x;
        controller.currentShape["height"] = position.y - drawingController.initPoint.y;
    },
};

var mouseController = {
    init: function() {
        mouseController.mouseIsPressed = false;
    },
    mouseClicked: function(event) {

    },
    mousePressed: function(event) {
        if(controller.drawingMode) {
            mouseController.mouseIsPressed = true;
            position = mouseController.getMousePosition(event);
            if(debugMode) {
                console.log("Mouse Pressed")
                mouseController.printPosition(position);
            }
            if (controller.currentMode === modes["line"]) {
                drawingController.initLine(position);
            }
            else if (controller.currentMode === modes["square"]) {
                drawingController.initSquare(position);
            }
            else if (controller.currentMode === modes["rectangle"]) {
                drawingController.initRectangle(position);
            }
            controller.render();
        }
    },
    mouseDragged: function(event) {
        if (mouseController.mouseIsPressed && controller.drawingMode) {
            position = mouseController.getMousePosition(event);
            if(debugMode) {
                console.log("Mouse Dragged");
                mouseController.printPosition(position);
            }
            if (controller.currentMode === modes["line"]) {
                drawingController.draggedLine(position);
            }
            else if (controller.currentMode === modes["square"]) {
                drawingController.draggedSquare(position);
            }
            else if (controller.currentMode === modes["rectangle"]) {
                drawingController.draggedRectangle(position);
            }
            controller.render();
        }
    },
    mouseReleased: function(event) {
        if(controller.drawingMode) {
            mouseController.mouseIsPressed = false;
            if(debugMode) {
                console.log("Mouse Released");
                mouseController.printPosition(position);
            }
            controller.render();
        }
    },
    getMousePosition: function(event) {
        var rect = document.getElementById("main-canvas").getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };

    },
    printPosition: function(position) {
        console.log("X: " + position.x);
        console.log("Y: " + position.y);
    }
};

/*
* Control for all operations
*/
var controller = {
    /*
    * Initializes event listeners on the button
    */
    init: function() {
        controller.currentMode = modes["line"]
        controller.currentShape = null;
        controller.drawingMode = true;
        $("#square-button").on("click", function(){
            controller.currentMode = modes["square"];
            buttonView.setSelected($(this));
            controller.drawingMode = true;
        });

        $("#circle-button").on("click", function(){
            controller.currentMode = modes["circle"];
            buttonView.setSelected($(this));
            controller.drawingMode = true;
        });

        $("#rectangle-button").on("click", function(){
            controller.currentMode = modes["rectangle"];
            buttonView.setSelected($(this));
            controller.drawingMode = true;
        });

        $("#ellipse-button").on("click", function(){
            controller.currentMode = modes["ellipse"];
            buttonView.setSelected($(this));
            controller.drawingMode = true;
        });

        $("#triangle-button").on("click", function(){
            controller.currentMode = modes["triangle"];
            buttonView.setSelected($(this));
            controller.drawingMode = true;
        });

        $("#select-button").on("click", function(){
            controller.currentMode = modes["select"];
            buttonView.setSelected($(this));
            controller.drawingMode = false;
        });
        $("#line-button").on("click", function(){
            controller.currentMode = modes["line"];
            buttonView.setSelected($(this));
            controller.drawingMode = true;
        });
        $("#delete-button").on("click", function(){
            controller.drawingMode = false;
        });
        // add canvas listeners
        $("#main-canvas").on("mousedown", mouseController.mousePressed);
        $("#html").on("mousemove", mouseController.mouseDragged);
        $("#html").on("mouseup", mouseController.mouseReleased);
    },
    getCurrentColor: function() {
        return $("#color-picker").val();
    },
    setNewCurrentShape: function(newShape) {
        controller.currentShape = newShape;
        model.addNewShape(newShape);
    },
    getShapes: function() {
        return model.shapes;
    },
    render: function() {
        canvasView.render();
    }
};

/*
* Controls the buttons
*/
var buttonView = {
    init: function() {},
    /*
    * Clears all the selected buttons
    */
    clearAll: function() {
        $(".btn").each(function() {
            $(this).attr("class", "btn btn-lg btn-default");
        });
    },
    /*
    * Clears the individually selected button (probably same thing as above...)
    */
    clearSelected: function() {
        $(".btn-success").attr("class", "btn btn-lg btn-default");   
    },
    /*
    * Sets a button as selected in the view. Clears any other button that is selected
    */
    setSelected: function(btn) {
        this.clearSelected();
        btn.attr("class", "btn btn-lg btn-success");
    }
};

var canvasView = {
    init: function() {},
    render: function() {
        var canvas = document.getElementById("main-canvas");
        var context = canvas.getContext("2d");
        context.clearRect(0,0, canvas.width, canvas.height);
        var shapes = controller.getShapes();
        shapes.forEach(function(shape) {
            context.beginPath();
            if (debugMode) {
                console.log("render");
                console.log(shape);
            }
            if (shape["type"] === "line") {
                context.moveTo(shape["point1"]["x"], shape["point1"]["y"]);
                context.lineTo(shape["point2"]["x"], shape["point2"]["y"]);
                context.strokeStyle = "#" + shape["color"];
                context.stroke();
            }
            else if (shape["type"] === "square" || shape["type"] ==="rectangle") {
                context.rect(shape["topLeftCorner"]["x"],
                    shape["topLeftCorner"]["y"],
                    shape["width"],
                    shape["height"])
                    context.fillStyle = "#" + shape["color"];
                    context.fill();
            }
        });
    }
};

var modes = {
    "square": 0,
    "rectangle": 1,
    "circle": 2,
    "ellipse": 3,
    "triangle": 4,
    "select": 5,
    "line": 6,
    "unknown": 999
};


// wait for the document to be ready
$(function() {
    // initialize the controller
    controller.init();
    // initalize the views
    buttonView.init();
    canvasView.init();

    // finally initialize the model
    model.init();
});

/*
* Simple debug tool
*/
window.debug = function() {
    console.log("Debug on: " + debugMode);
    console.log("Current Mode: " + controller.currentMode);
    console.log("Drawing Mode: " + controller.drawingMode);
    console.log("Model Shapes: " + model.shapes);
}

window.toggleDebug = function() {
    debugMode = !debugMode;
}