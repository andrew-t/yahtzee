export default `
#ifdef GL_ES
    precision highp float;
#endif

uniform float VALUE;

uniform vec2 u_resolution;
uniform float u_time;

const float CORNER = 0.25;
const float EDGE = 0.55;
const float TUMBLINESS = 10.0;
const float BALL_SIZE = 0.1;
const float DIE_SIZE = 0.4;
const float DIE_ROUNDNESS = 0.15;
const vec3 DIE_COLOUR = vec3(1.0, 0.9, 0.7);
const vec3 DIE_POSITION = vec3(0.0, 0.0, 2.0);

float box(vec3 p, vec3 rad) {
    vec3 d = abs(p) - rad;
    return length(max(d, 0.0)) + min(max(d.x, max(d.y, d.z)), 0.0);
}

const int NOTHING = 0;
const int BALL = 1;
const int DIE = 2;

struct Scene {
	int material;
	float dist;
};

Scene removeBall(Scene current, vec3 p) {
    float dist = BALL_SIZE - length(p);
    if (dist > current.dist)
        return Scene(BALL, dist);
    return current;
}

vec2 rotate(vec2 v, float theta) {
    float s = sin(theta), c = cos(theta);
    return vec2(v.x * c + v.y * s, v.y * c - v.x * s);
}

Scene scene(vec3 p) {
    
    p -= DIE_POSITION;
   
    if (VALUE == 6.0 || VALUE == 5.0 || VALUE == 3.0) p = -p;
    if (VALUE == 2.0 || VALUE == 5.0) p.zx = -p.xz;
    if (VALUE == 4.0 || VALUE == 3.0) p.yz = p.zy;
    
    float tumbliness = max(1.0 - u_time, 0.0) * TUMBLINESS;
    p.xy = rotate(p.xy, tumbliness);
    p.yz = rotate(p.yz, tumbliness * 0.637);
    
    Scene o = Scene(DIE, box(p, vec3(DIE_SIZE)) - DIE_ROUNDNESS);
    // 1
    o = removeBall(o, p - vec3(0.0, 0.0, -EDGE));
    // 2
    o = removeBall(o, p - vec3(EDGE, CORNER, CORNER));
    o = removeBall(o, p - vec3(EDGE, -CORNER, -CORNER));
    // 3
    o = removeBall(o, p - vec3(CORNER, EDGE, CORNER));
    o = removeBall(o, p - vec3(0.0, EDGE, 0.0));
    o = removeBall(o, p - vec3(-CORNER, EDGE, -CORNER));
    // 4
    o = removeBall(o, p - vec3(CORNER, -EDGE, CORNER));
    o = removeBall(o, p - vec3(-CORNER, -EDGE, CORNER));
    o = removeBall(o, p - vec3(CORNER, -EDGE, -CORNER));
    o = removeBall(o, p - vec3(-CORNER, -EDGE, -CORNER));
    // 5
    o = removeBall(o, p - vec3(-EDGE, CORNER, CORNER));
    o = removeBall(o, p - vec3(-EDGE, -CORNER, CORNER));
    o = removeBall(o, p - vec3(-EDGE, -CORNER, -CORNER));
    o = removeBall(o, p - vec3(-EDGE, CORNER, -CORNER));
    o = removeBall(o, p - vec3(-EDGE, 0.0, 0.0));
    // 6
    o = removeBall(o, p - vec3(CORNER, CORNER, EDGE));
    o = removeBall(o, p - vec3(CORNER, 0.0, EDGE));
    o = removeBall(o, p - vec3(CORNER, -CORNER, EDGE));
    o = removeBall(o, p - vec3(-CORNER, CORNER, EDGE));
    o = removeBall(o, p - vec3(-CORNER, 0.0, EDGE));
    o = removeBall(o, p - vec3(-CORNER, -CORNER, EDGE));
	return o;
}

const vec2 e = vec2(0.0, 0.0001);
vec3 normal(vec3 p) {
    return normalize(vec3(
        scene(p + e.yxx).dist - scene(p - e.yxx).dist,
        scene(p + e.xyx).dist - scene(p - e.xyx).dist,
        scene(p + e.xxy).dist - scene(p - e.xxy).dist
    ));
}

const vec3 lightDirection = normalize(vec3(0.3, 0.4, -0.8));

void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.y;

    vec3 p = vec3(0.0);
	vec3 ray = normalize(vec3(uv, 1.));
    int material = NOTHING;

    for (int i = 0; i < 1000; ++i) {
        Scene d = scene(p);
        if (d.dist < 0.001) {
            material = d.material;
            break;
        }
        p += ray * d.dist;
    }
    
    if (material == NOTHING)
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    else {
        vec3 col = DIE_COLOUR;
        float light = dot(normal(p), lightDirection);
        if (material == BALL) {
            col = vec3(1.0);
            light = pow(light, 5.0);
        }
    	gl_FragColor = vec4(col * light, 1.0);
    }
}

`;
