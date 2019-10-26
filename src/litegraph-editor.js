(function(global) {
    //Creates an interface to access extra features from a graph (like play, stop, live, etc)
    function Editor(container_id, options) {
        options = options || {};

        //fill container
        var html =
            "<div class='content'><div class='editor-area'><canvas class='graphcanvas' width='1000' height='500' tabindex=10></canvas></div></div>";
        
        var root = document.createElement("div");
        this.root = root;
        root.className = "litegraph-editor";
        root.innerHTML = html;

        this.tools = root.querySelector(".tools");
        this.footer = root.querySelector(".footer");

        var canvas = root.querySelector(".graphcanvas");

        //create graph
        var graph = (this.graph = new LGraph());
        var graphcanvas = (this.graphcanvas = new LGraphCanvas(canvas, graph));
        graphcanvas.background_image = "imgs/grid.png";
        graph.onAfterExecute = function() {
            graphcanvas.draw(true);
        };

        if (options.miniwindow) {
            this.addMiniWindow(300, 200);
        }

        //append to DOM
        var parent = document.getElementById(container_id);
        if (parent) {
            parent.appendChild(root);
        }

        graphcanvas.resize();
        //graphcanvas.draw(true,true);
    }

    global.Editor = LiteGraph.Editor = Editor;

    Editor.prototype.addMiniWindow = function(w, h) {
        var miniwindow = document.createElement("div");
        miniwindow.className = "litegraph miniwindow";
        miniwindow.innerHTML =
            "<canvas class='graphcanvas' width='" +
            w +
            "' height='" +
            h +
            "' tabindex=10></canvas>";
        var canvas = miniwindow.querySelector("canvas");
        var that = this;

        var graphcanvas = new LGraphCanvas(canvas, this.graph);
        graphcanvas.show_info = false;
        graphcanvas.background_image = "imgs/grid.png";
        graphcanvas.scale = 0.25;
        graphcanvas.allow_dragnodes = false;
        graphcanvas.allow_interaction = false;
        graphcanvas.render_shadows = false;
        graphcanvas.max_zoom = 0.25;
        this.miniwindow_graphcanvas = graphcanvas;
        graphcanvas.onClear = function() {
            graphcanvas.scale = 0.25;
            graphcanvas.allow_dragnodes = false;
            graphcanvas.allow_interaction = false;
            graphcanvas.render_shadows = false;
            graphcanvas.max_zoom = 0.25;
            this.miniwindow_graphcanvas = graphcanvas;
            graphcanvas.onClear = function() {
                graphcanvas.scale = 0.25;
                graphcanvas.allow_dragnodes = false;
                graphcanvas.allow_interaction = false;
            };
            graphcanvas.onRenderBackground = function(canvas, ctx) {
                ctx.strokeStyle = "#567";
                var tl = that.graphcanvas.convertOffsetToCanvas([0, 0]);
                var br = that.graphcanvas.convertOffsetToCanvas([
                    that.graphcanvas.canvas.width,
                    that.graphcanvas.canvas.height
                ]);
                tl = this.convertCanvasToOffset(tl);
                br = this.convertCanvasToOffset(br);
                ctx.lineWidth = 1;
                ctx.strokeRect(
                    Math.floor(tl[0]) + 0.5,
                    Math.floor(tl[1]) + 0.5,
                    Math.floor(br[0] - tl[0]),
                    Math.floor(br[1] - tl[1])
                );
            };

            miniwindow.style.position = "absolute";
            miniwindow.style.top = "4px";
            miniwindow.style.right = "4px";

            var close_button = document.createElement("div");
            close_button.className = "corner-button";
            close_button.innerHTML = "X";
            close_button.addEventListener("click", function(e) {
                graphcanvas.setGraph(null);
                miniwindow.parentNode.removeChild(miniwindow);
            });
            miniwindow.appendChild(close_button);

            this.root.querySelector(".content").appendChild(miniwindow);
        };
    }
})(this);
