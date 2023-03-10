import * as THREE from '../js/three.module.js'
class App {
    constructor() {
        this._initialize();
    }
    _initialize() {
        this.domWebGL = document.createElement('div');
        document.body.appendChild(this.domWebGL);
        let scene = new THREE.Scene();
        let renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x000000, 1.0);
        this.domWebGL.appendChild(renderer.domElement);  
        window.onresize = this.resize.bind(this); 
        
        this.renderer = renderer;
        this.scene = scene;
        this._setupModel();
        this._setupLights()
        this._setupCamera();
        this.resize();
    }
    _setupModel() {
        // 경로 및 직사각형 모델 구성
        const path = new THREE.SplineCurve( [
            new THREE.Vector2( 10, 5 ),
            new THREE.Vector2( 5, 5 ),
            new THREE.Vector2( 5, 10 ),
            new THREE.Vector2( -5, 10 ),
            new THREE.Vector2( -5, 5 ),
            new THREE.Vector2( -10, 5 ),
            new THREE.Vector2( -10, -5 ),
            new THREE.Vector2( -5, -5 ),
            new THREE.Vector2( -5, -10 ),
            new THREE.Vector2( 5, -10 ),
            new THREE.Vector2( 5, -5 ),
            new THREE.Vector2( 10, -5 ),
            new THREE.Vector2( 10, 5 ),
        ] );
        this.path = path;
        const points = path.getPoints( 100 );
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color : 0xffff00 } );
        const pathLine = new THREE.Line( geometry, material );
        pathLine.rotation.x = Math.PI * .5;
        this.scene.add(pathLine);
        const boxGeometry = new THREE.BoxGeometry(1, 1, 3);
        const boxMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        this.scene.add(boxMesh);
        this.boxMesh = boxMesh;
    }
    update(time) {
        // 직사각형 모델을 경로에 따라 이동시킴
        const boxTime = time * .0001;
        const boxPosition = new THREE.Vector3();
        const boxNextPosition = new THREE.Vector2();
        
        this.path.getPointAt(boxTime % 1, boxPosition);
        this.path.getPointAt((boxTime + 0.01) % 1, boxNextPosition);
        
        this.boxMesh.position.set(boxPosition.x, 0, boxPosition.y);
        this.boxMesh.lookAt(boxNextPosition.x, 0, boxNextPosition.y);
    }
    _setupLights() {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(30, 50, 20);
        this.scene.add(light);
    }
    _setupCamera() {
        const fov = 60;
        const aspect = 1;
        const zNear = 0.1;
        const zFar = 1000;
        
        let camera = new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
        camera.position.set(40, 40, 40).multiplyScalar(0.3);
        camera.lookAt(0,-2,0);
        
        this.scene.add(camera);
        this.camera = camera;
    }
    render(time) {
        requestAnimationFrame(this.render.bind(this));
        this.update(time);
        this.renderer.render(this.scene, this.camera);
    }
    resize() {
        let camera = this.camera;
        let renderer = this.renderer;
        
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}
window.onload = function() {
    (new App()).render(0);
}