var srcVertShader =
    "attribute vec2 aVertexPosition;\n"+
    "attribute vec3 aVertexColor;\n"+
    "uniform mat4 uMVP;\n"+
    "varying vec3 vColor;\n"+
    "void main() {\n"+
    "   gl_Position = uMVP * vec4(aVertexPosition, 0.0, 1.0);\n"+
    "   vColor = aVertexColor;\n"+
    "}";

var srcFragShaderFragColor =
    "precision highp float;\n"+
    "varying vec3 vColor;\n"+
    "void main() {\n"+
    "   gl_FragColor = vec4(vColor, 1.0);\n"+
    "}";
