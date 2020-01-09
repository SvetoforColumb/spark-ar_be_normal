const Diagnostics = require('Diagnostics');
// @ts-ignore
// @ts-ignore
const Scene = require('Scene');
const Shaders = require('Shaders');
const Materials = require("Materials");
const R = require("Reactive");
const CameraInfo = require('CameraInfo');
const Textures = require('Textures');
const Time = require('Time');
const Patches = require('Patches')
const mat = Materials.get("material0");
const cameraTexture = Textures.get("cameraTexture0");
const cameraColor = cameraTexture.signal;

// get the texture coordinates in fragment stage
// @ts-ignore
const texcoords = Shaders.fragmentStage(Shaders.vertexAttribute({'variableName': Shaders.VertexAttribute.TEX_COORDS}));

var sampled = Shaders.textureSampler(glitchColor(cameraColor), glitchSignal());
Diagnostics.watch("time", Time.ms);


// set texture to sampled
// @ts-ignore
const textureSlot = Shaders.DefaultMaterialTextures.DIFFUSE
// @ts-ignore
mat.setTexture(sampled, {textureSlotName: textureSlot});

function hash(p) {
	// @ts-ignore
	return R.mod(R.mul(R.sin(R.dot(p,(R.pack2(12.9898, 78.233)))), 43758.5453), 2);
}
// @ts-ignore
function glitchSignal() {
    Diagnostics.watch("height", CameraInfo.previewSize.height);
    Diagnostics.watch("width", CameraInfo.previewSize.width);
    
    var distortion = 6.201;

    // @ts-ignore
    var time_p = R.mod(Patches.getScalarValue('time'), distortion);
    Diagnostics.watch("time_p", time_p);
    // @ts-ignore    
    var up = hash(R.pack2(time_p, time_p));
    // @ts-ignore
    var next = hash(R.pack2(R.mul(time_p, 10.0), R.mul(time_p, 10.0)));
    // @ts-ignore
    var st_y_1 = R.add(texcoords.y, 0);
    // @ts-ignore
    var st_x_1 = R.add(texcoords.x, 0);
    // @ts-ignore
    var st_x_2 = R.add(st_x_1, R.mul(R.sin(R.add(R.mul(st_y_1, 20.0), time_p)), 0.01));
    // @ts-ignore
    var st_x_3 = R.mix(st_x_2, R.add(st_x_2, R.mul(R.sin(R.add(R.mul(st_y_1, 20.0), time_p)), 0.1)), R.sub(R.step(up, st_y_1), R.step(R.add(up, 0.1), st_y_1)));
    // @ts-ignore
    var st_x_4 = R.mix(st_x_3, R.add(st_x_2, R.mul(R.sin(R.add(R.mul(st_y_1, 20.0), time_p)), 0.1)), R.sub(R.step(next, st_y_1), R.step(R.add(next, 0.05), st_y_1)));
    const newUV = R.pack2(
        // @ts-ignore
        st_x_4,
        // @ts-ignore
        st_y_1
    );   
    return newUV;
}

function glitchColor(color){

    // vec3 color = texture2D(u_tex0,st).xyz;
    //color r = x, g = y, b = z
    //color = vec3(1.0, 0.4, 0.3);
    var distortion = 6.201;

    // @ts-ignore
    var time_p = R.mod(Patches.getScalarValue('time'), distortion);

    var color_vec3 = R.pack3(color.x, color.y, color.z);
    // var color_1 = color;
    // var color_1 =  R.mix(color, R.pack3(1., R.add(0.0, color.x), R.add(R.mul(R.sin(time_p), 0.9), color.b), R.smoothStep(0.4, 0.5, color_vec3)));
    // высчитываем цвет пикселю
    // var color_2 = R.mix(color_1, texture2D(u_tex0, st + rand(vec2(time_p)) * 0.02).xyz, 0.5);
    //color = mix();
    // var color_2 = R.mix(color_vec3, R.pack3(1.0, 0.3, 0.9), 0.5);



    // @ts-ignore
    var color_0 = R.mix(color_vec3, R.pack3(1.0, R.add(0.0, color_vec3.x), R.add(R.mul(R.sin(time_p), 0.9), color.z)), R.smoothStep(0.4, 0.5, color_vec3));

    // var color_1 = R.mix(color, texture2D(u_tex0, st + rand(vec2(u_time)) * 0.02).xyz, 0.5);

    // var color_1488 = 

    // @ts-ignore
    var t =R.pack3( Shaders.textureSampler(cameraColor, R.add(texcoords, R.mul(hash(R.pack2(time_p, time_p)), 0.002))).x, Shaders.textureSampler(cameraColor, R.add(texcoords, R.mul(hash(R.pack2(time_p, time_p)), 0.02))).y,  Shaders.textureSampler(cameraColor, R.add(texcoords, R.mul(hash(R.pack2(time_p, time_p)), 0.02))).z);

    // @ts-ignore
    var color_1 = R.mix(color_0, t, 0.5);
    

    // Shaders.textureSampler(cameraColor, texcoords)

    var color_red = color_1.x;
    var color_green = color_1.y;
    var color_blue = color_1.z;

    // @ts-ignore
    var new_color = R.pack4(color_red, color_green, color_blue, 1.0);

    return new_color;
}