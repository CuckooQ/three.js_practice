import * as THREE from 'three'
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
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	// 빛의 영향을 받지 않는 기본 재질
	const basicMaterial = new THREE.MeshBasicMaterial({
		color: '#ff0000'
	})
	// 빛의 영향을 받는 기본 재질
	const standardMaterial = new THREE.MeshStandardMaterial({
		color: '#ff0000'
	})
	let material = standardMaterial
	// const mesh = new THREE.Mesh(geometry, material)
	const meshes = Array.from({length: 10},() => {
		const mesh = new THREE.Mesh(geometry, material)
		mesh.position.set(Math.random() * 5 - 2.5, 0, Math.random() * 5 - 2.5)
		return mesh
	})

	/* 씬 설정 */
	const scene = new THREE.Scene()
	scene.background = new THREE.Color(BACGROUND_COLOR)
	scene.fog = fog
	scene.add(camera)
	scene.add(ambientLight)
	scene.add(directionalLight)
	scene.add(axesHelper)
	scene.add(gridHeler)
	// scene.add(mesh)
	meshes.forEach((mesh) => scene.add(mesh))

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

	/* 애니메이션 설정 */
	let direction = Y_DIRECTION.UP
	const clock = new THREE.Clock()
	// const elapsedTime = clock.getElapsedTime() // 경과시간
	// const delta = clock.getDelta() // 시간차
	function upAndDown(mesh) {
		if (mesh.position.y > 2) {
			direction = Y_DIRECTION.DOWN
		}
		if (mesh.position.y < 0) {
			direction = Y_DIRECTION.UP
		}
		mesh.position.y += (direction === Y_DIRECTION.UP ? 0.01 : -1 * 0.01)
	}
	function rotate(mesh) {
		// mesh.rotation.y += 0.01 // radian 단위
		// mesh.rotation.y += THREE.MathUtils.degToRad(1) // deg 단위
		mesh.rotation.y = clock.getElapsedTime() 
	}
	function repeatAnimation() {
		meshes.forEach((mesh) => {
			upAndDown(mesh)
			rotate(mesh)
		})
		camera.lookAt(0, 0, 0)
		renderer.render(scene, camera)
		window.requestAnimationFrame(repeatAnimation) // 실행할 애니메이션 함수 안에 requestAnimationFrame함수를 호출함으로써 반복 동작 구현
		stats.update() // FPS 업데이트
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