import * as THREE from 'three'
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import Stats from 'stats.js'
import Dat from 'dat.gui'

export const renderView = () => {
	/* 요소 가져오기 */
	const canvasEl = document.querySelector('canvas')

	/* 카메라 설정 */
	// 원근 카메라
	const perspectiveCamera = new THREE.PerspectiveCamera(
		75, 																		// fov
		window.innerWidth / window.innerHeight, // aspect 
		0.1, 																		// near
		1000, 																	// far
	)
	// 직교 카메라 
	const orthographicCamera = new THREE.OrthographicCamera(
		-(window.innerWidth / window.innerHeight), 	// left
		window.innerWidth / window.innerHeight,    	// right
		1,																				 	// top	
		-1,																					// bottom
		0.1,																				// near
		1000,																				// far
	)
	let camera = perspectiveCamera
	camera.position.set(1, 2, 5)
	camera.zoom = 0.5
	// camera.lookAt(0, 0, 0)
	camera.updateProjectionMatrix()

	/* 빛 설정 */
	const ambientLight = new THREE.AmbientLight('#fff', 0.5) // color, intensity
	const directionalLight = new THREE.DirectionalLight('#fff', 1) // color, intensity
	directionalLight.position.set(1, 1, 2)

	/* 안개 설정 */
	const fog = new THREE.Fog(BACGROUND_COLOR, 2, 7) // color, near, far

	/* 축과 그리드 시각화 설정 */
	const axesHelper = new THREE.AxesHelper(10) // length
	const gridHeler = new THREE.GridHelper(10) // length

	/* 메쉬 설정 */
	const boxGeometry = new THREE.BoxGeometry(2, 2, 2)
	const sphereGeometry = new THREE.SphereGeometry(1, 64, 64)
	const geometry = boxGeometry
	const loadingManager = new THREE.LoadingManager()
	loadingManager.onStart = () => {
		console.log(`All textures load start`)
	}
	loadingManager.onProgress = imageUrl => {
		console.log(`${imageUrl} texture loading`)
	}
	loadingManager.onLoad = () => {
		console.log(`All textures load complete`)
	}
	loadingManager.onError = imageUrl => {
		console.log(`${imageUrl} texture load error`)
	}
	const textureLoader = new THREE.TextureLoader(loadingManager)
	const texture = textureLoader.load('textures/skull/basecolor.jpg')
	texture.wrapS = THREE.RepeatWrapping
	texture.wrapT = THREE.RepeatWrapping
	texture.offset.x = 0.3
	texture.offset.y = 0.3
	texture.repeat.x = 2
	texture.repeat.y = 2
	texture.rotation = THREE.MathUtils.degToRad(45)
	texture.center.x = 0.5
	texture.center.y = 0.5
	const glassColorTexture = textureLoader.load('textures/glass/basecolor.jpg')
	const glassNormalTexture = textureLoader.load('textures/glass/normal.jpg')
	const glassRoughnessTexture = textureLoader.load('textures/glass/roughness.jpg')
	const glassAmbientTexture = textureLoader.load('textures/glass/ambient.jpg')
	const rightTexture = textureLoader.load('textures/minecraft/right.png')
	rightTexture.magFilter = THREE.NearestFilter
	const leftTexture = textureLoader.load('textures/minecraft/left.png')
	leftTexture.magFilter = THREE.NearestFilter
	const topTexture = textureLoader.load('textures/minecraft/top.png')
	topTexture.magFilter = THREE.NearestFilter
	const bottomTexture = textureLoader.load('textures/minecraft/bottom.png')
	bottomTexture.magFilter = THREE.NearestFilter
	const frontTexture = textureLoader.load('textures/minecraft/front.png')
	frontTexture.magFilter = THREE.NearestFilter
	const backTexture = textureLoader.load('textures/minecraft/back.png')
	backTexture.magFilter = THREE.NearestFilter
	const gradientTexture = textureLoader.load('textures/gradient/gradient.png')
	gradientTexture.magFilter = THREE.NearestFilter
	const matcapTexture = textureLoader.load('textures/matcap/material3.jpg')
	const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)
	const envTexture = cubeTextureLoader.setPath('textures/cubeMap/').load([
		// + - 순서
		'px.png', 'nx.png', 
		'py.png', 'ny.png', 
		'pz.png', 'nz.png', 
	])
	const meshBasicMaterial = new THREE.MeshBasicMaterial({
		// color: '#ff0000',
		wireframe: false,
		side: THREE.DoubleSide,
		envMap: envTexture,
	})
	const meshLambertMaterial = new THREE.MeshLambertMaterial({
		color: '#ff0000',
		wireframe: false,
		side: THREE.DoubleSide,
	})
	const meshPhongMaterial = new THREE.MeshPhongMaterial({
		color: '#ff0000',
		wireframe: false,
		shininess: 100,
		flatShading: false,
		side: THREE.DoubleSide,
	})
	const meshStandardMaterial = new THREE.MeshStandardMaterial({
		// color: '#ff0000',
		wireframe: false,
		roughness: 0.1,
		metalness: 2,
		flatShading: false,
		side: THREE.DoubleSide,
		map: glassColorTexture,
		normalMap: glassNormalTexture,
		roughnessMap: glassRoughnessTexture,
		aoMap: glassAmbientTexture,
		aoMapIntensity: 5,
	})
	const meshToonMaterial = new THREE.MeshToonMaterial({
		color: "plum",
		map: gradientTexture,
	})
	const meshNormalMaterial = new THREE.MeshNormalMaterial({})
	const meshMatcapMaterial = new THREE.MeshMatcapMaterial({
		matcap: matcapTexture,
	})
	let material = meshBasicMaterial
	const materials = [
		new THREE.MeshBasicMaterial({map: rightTexture}),
		new THREE.MeshBasicMaterial({map: leftTexture}),
		new THREE.MeshBasicMaterial({map: topTexture}),
		new THREE.MeshBasicMaterial({map: bottomTexture}),
		new THREE.MeshBasicMaterial({map: frontTexture}),
		new THREE.MeshBasicMaterial({map: backTexture}),
	]
	const mesh = new THREE.Mesh(geometry, material)
	const meshes = Array.from({length: 10},() => {
		const tempMesh = mesh.clone()
		tempMesh.position.set(Math.random() * 5 - 2.5, 0, Math.random() * 5 - 2.5)
		return tempMesh
	})
	const meshGroup = new THREE.Group()
	meshGroup.add(...meshes)

	/* 씬 설정 */
	const scene = new THREE.Scene()
	// scene.background = new THREE.Color(BACGROUND_COLOR)
	scene.background = envTexture
	scene.fog = fog
	scene.add(camera)
	scene.add(ambientLight)
	scene.add(directionalLight)
	scene.add(axesHelper)
	scene.add(gridHeler)
	// scene.add(mesh)
	// scene.add(meshGroup)
	scene.add(mesh)

	/* 렌더러 설정 */
	const renderer = new THREE.WebGLRenderer({ 
		canvas: canvasEl, 
		antialias: true,
		alpha: true,
	})
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)
	// renderer.setClearColor(BACGROUND_COLOR)
	// renderer.setClearAlpha(0.5)
	renderer.render(scene, camera)

	/* 이벤트 설정 */
	function handleResize() {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.render(scene, camera)
	}
	window.addEventListener('resize', handleResize)

	/* FPS 시각화 설정 */
	const stats = new Stats()
	document.body.append(stats.domElement)

	/* 카메라 컨트롤 설정 */
	// const arcballControls = new ArcballControls( camera, renderer.domElement, scene )
	// const dragControls = new DragControls( meshes, camera, renderer.domElement )
	/*
	const firstPersonControls = new FirstPersonControls( camera, renderer.domElement )
	firstPersonControls.lookSpeed = 0.5
	firstPersonControls.movementSpeed = 0.3
	firstPersonControls.activeLook = false
	*/
	/*
	const flyControls = new FlyControls( camera, renderer.domElement )
	flyControls.rollSpeed = 0.5
	flyControls.movementSpeed = 0.3
	flyControls.dragToLook = true
	*/
	const orbitControls = new OrbitControls( camera, renderer.domElement )
	orbitControls.enableDamping = true
	orbitControls.enableZoom = true
	orbitControls.maxDistance = 7
	orbitControls.minDistance = 1
	orbitControls.maxPolarAngle = THREE.MathUtils.degToRad(135)
	orbitControls.minPolarAngle = THREE.MathUtils.degToRad(45)
	orbitControls.autoRotate = true
	orbitControls.autoRotateSpeed = 1
	/*
	const pointerLockControls = new PointerLockControls( camera, document.body )
	const keyControllerForPointerLockControls = new KeyController()
	function move() {
		if(keyControllerForPointerLockControls.keys['KeyW']) {
			controls.moveForward(0.5)
		}
		if(keyControllerForPointerLockControls.keys['KeyA']) {
			controls.moveRight(-0.5)
		}
		if(keyControllerForPointerLockControls.keys['KeyS']) {
			controls.moveForward(-0.5)
		}
		if(keyControllerForPointerLockControls.keys['KeyD']) {
			controls.moveRight(0.5)
		}
	}
	*/
	/*
	const trackballControls = new TrackballControls( camera, renderer.domElement )
	trackballControls.maxDistance = 7
	trackballControls.minDistance = 5
	*/
	// const transformControls = new TransformControls( camera, renderer.domElement )
	const controls = orbitControls
	if (controls instanceof TransformControls) {
		controls.attach(meshes[0])
		scene.add(controls)
	}

	/* 애니메이션 설정 */
	let direction = Y_DIRECTION.UP
	const clock = new THREE.Clock()
	// const elapsedTime = clock.getElapsedTime() // 경과시간
	// const delta = clock.getDelta() // 시간차
	function upAndDown() {
		if (meshGroup.position.y > 2) {
			direction = Y_DIRECTION.DOWN
		}
		if (meshGroup.position.y < 0) {
			direction = Y_DIRECTION.UP
		}
		meshGroup.position.y += (direction === Y_DIRECTION.UP ? 0.01 : -1 * 0.01)
	}
	function rotate() {
		const elapsedTime = clock.getElapsedTime()
		meshGroup.children.forEach((mesh) => {
			mesh.rotation.reorder('XYZ') // 각 축을 독립적으로 재설정
			// mesh.rotation.y += 0.01 // radian 단위
			// mesh.rotation.y += THREE.MathUtils.degToRad(1) // deg 단위
			mesh.rotation.set(elapsedTime , elapsedTime , elapsedTime)
		})
	}
	function repeatAnimation() {
		upAndDown()
		rotate()
	
		camera.lookAt(0, 0, 0)
		renderer.render(scene, camera)
		window.requestAnimationFrame(repeatAnimation) // 실행할 애니메이션 함수 안에 requestAnimationFrame함수를 호출함으로써 반복 동작 구현
		stats.update() // FPS 업데이트
		if (!(controls instanceof DragControls) && !(controls instanceof PointerLockControls) && !(controls instanceof TransformControls)) {
			controls.update(1)
		}
		if(controls instanceof PointerLockControls) {
			move()
		}
	}
	function initAnimation() {
		repeatAnimation()
	}	
	initAnimation()

	/* 컨트롤러 설정 */
	const controller = new Dat.GUI()
	controller.add(meshes[0].position, 'x', -5, 5, 0.01).name('X Position of a mesh')
	controller.add(camera.position, 'x', -5, 5, 0.01).name('X Position of a the camera')
}

/* 상수 */
const Y_DIRECTION = {
	UP: 1,
	DOWN: -1
}
const BACGROUND_COLOR = "#fff"

/* 클래스 */
class KeyController {
	constructor() {
		this.keys = new Map()
		window.addEventListener('keydown', (e) => {
			this.keys[e.code] = true
		})
		window.addEventListener('keyup', (e) => {
			this.keys[e.code] = false
		})
	}
}