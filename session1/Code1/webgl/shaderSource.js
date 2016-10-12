var srcVertShader =
    "attribute vec2 aVertexPosition;\n"+
    "attribute vec3 aVertexColor;\n"+
    "uniform mat4 uMVP;\n"+
    "varying vec3 vVertexColor;\n"+
    "void main() {\n"+
    "   gl_Position = uMVP * vec4(aVertexPosition, 0.0, 1.0);\n"+
    "   vVertexColor = aVertexColor;\n"+
    "}";

var srcFragShaderFragColor =
    "precision highp float;\n"+
    "varying vec3 vVertexColor;\n"+
    "void main() {\n"+
    "   gl_FragColor = vec4(vVertexColor, 1.0);\n"+
    "}";
