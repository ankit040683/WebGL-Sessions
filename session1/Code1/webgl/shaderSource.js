var srcVertShader =
    "attribute vec2 aVertexPosition;\n"+
    "void main() {\n"+
    "   gl_Position = vec4(aVertexPosition, 0.0, 1.0);\n"+
    "}";

var srcFragShaderFragColor =
    "void main() {\n"+
    "   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n"+
    "}";
