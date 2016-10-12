var srcVertShader =
    "attribute vec2 aVertexPosition;\n"+
    "uniform mat4 uMVP;\n"+
    "void main() {\n"+
    "   gl_Position = uMVP * vec4(aVertexPosition, 0.0, 1.0);\n"+
    "}";

var srcFragShaderFragColor =
    "precision highp float;\n"+
    "uniform vec3 uColor;\n"+
    "void main() {\n"+
    "   gl_FragColor = vec4(uColor, 1.0);\n"+
    "}";
