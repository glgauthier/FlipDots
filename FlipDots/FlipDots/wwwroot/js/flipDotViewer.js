const renderer = new THREE.WebGLRenderer();
renderer.setSize(1000, 500);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x616161);

const fov = 50;
const aspect = 2;
const near = 100, far = 10000;

let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 200, 60);
camera.lookAt(0, 0, 0);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();
controls.enabled = false; // todo: add a button to toggle controls vs dot flipping

const light = new THREE.DirectionalLight(0xFFFFFF, 2);
light.position.set(100, 200, 100);
light.lookAt(0, 0, 0);
scene.add(light);

const light2 = new THREE.DirectionalLight(0xFFFFFF, 2);
light2.position.set(-100, -200, -100);
light2.lookAt(0, 0, 0);
scene.add(light2);

let bw = 280, bh = 10, bl = 140;
let boxGeom = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshPhongMaterial({ color: 0x000000 });
let cube = new THREE.Mesh(boxGeom, material);
cube.scale.set(bw+2, bh, bl+2);
cube.position.set(0, -bh/2, 0);
scene.add(cube);

let dots = [];
let radius = 5;
let vdots = 14;
let hdots = 28;

for (let vert = 0; vert < vdots; vert++) {
    for (let horiz = 0; horiz < hdots; horiz++) {
        let cg = new THREE.CylinderGeometry(radius, radius, 1, 32);
        let cm = new THREE.MeshPhongMaterial({ color: 0xffffff });
        let dot = new THREE.Mesh(cg, cm);
        dot.position.set(horiz * 10 - (hdots * 10 / 2) + radius, 0, vert * 10 - (vdots * 10 / 2) + radius);
        dot.geometry.faces.forEach((f, i) => {
            if (f.normal.y == 1) {
                dot.geometry.faces[i].color.setHex(0x000000);
            }
        });
        //https://stackoverflow.com/questions/25231965/threejs-how-to-assign-different-color-for-top-face-of-a-cylinder
        cm.vertexColors = THREE.FaceColors;
        dot.rotation.set(Math.PI, 0, 0);
        dot.name = "dot";
        scene.add(dot);
        dots.push(dot);
    }
}
//scene.add(dots);


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
function updateRenderer() {
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);

    requestAnimationFrame(updateRenderer);
}

updateRenderer();

let lastDot;
function onMouseDrag(event) {
    if (event.buttons == 1) // if the left button is down on the mouse
    {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        let bounds = renderer.domElement.getClientRects()[0];
        mouse.x = ((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1;
        mouse.y = - ((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1;

        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(scene.children);

        for (var i = 0; i < intersects.length; i++) {

            if (intersects[i].object.name == "dot") {
                if (lastDot == intersects[i].object)
                    return;
                lastDot = intersects[i].object;
                flipDot(intersects[i].object);
            }

        }
    }
    event.preventDefault();
    return false;
}

function onMouseClick(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    let bounds = renderer.domElement.getClientRects()[0];
    mouse.x = ((event.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1;
    mouse.y = - ((event.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    for (var i = 0; i < intersects.length; i++) {

        if (intersects[i].object.name == "dot") {
            flipDot(intersects[i].object);
        }

    }
    event.preventDefault();
    return false;
}

function flipDot(dot) {
    if (dot.rotation.x == Math.PI) {
        dot.rotation.set(0, 0, 0);
    } else {
        dot.rotation.set(Math.PI, 0, 0);
    }
}

window.addEventListener('mousemove', onMouseDrag, false);
window.addEventListener('mousedown', onMouseClick, false);