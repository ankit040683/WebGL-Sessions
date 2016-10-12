var srcVertShader =
    "attribute vec2 aVertexPosition;\n"+
    "uniform mat4 uMVP;\n"+
    "void main() {\n"+
    "   gl_Position = uMVP * vec4(aVertexPosition, 0.0, 1.0);\n"+
    "}";

var srcFragShaderFragColor =
    "precision highp float;\n"+
    "uniform vec3 uColor[2];\n"+
    "uniform float uFactor;\n"+
    "void main() {\n"+
    "   gl_FragColor = vec4(uFactor*uColor[0] + (1.0-uFactor)*uColor[1], 1.0);\n"+
    "}";
