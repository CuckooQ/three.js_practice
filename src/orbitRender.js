import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'stats.js'
import Dat from 'dat.gui'

export const renderView = () => {
	/* 요소 가져오기 */
	const canvasEl = document.querySelector('canvas')

	/* 카메라 설정 */
	const camera = new THREE.PerspectiveCamera(
		75, 																		// fov
		window.innerWidth / window.innerHeight, // aspect 
		0.1, 																		// near
		1000, 																	// far
	)
	camera.position.set(3, 4, 5)
	camera.zoom = 0.5
  camera.lookAt(0, 0, 0)
	camera.updateProjectionMatrix()

	/* 빛 설정 */
	const ambientLight = new THREE.AmbientLight('#fff', 0.5) // color, intensity
	const directionalLight = new THREE.DirectionalLight('#fff', 1) // color, intensity
	directionalLight.position.set(1, 1, 2)

	/* 축과 그리드 시각화 설정 */
	const axesHelper = new THREE.AxesHelper(10) // length
	const gridHeler = new THREE.GridHelper(10) // length

	/* 메쉬 설정 */
	function getPlanetGeometry(segmentCount) {
		const geometry = new THREE.SphereGeometry(1, segmentCount, segmentCount)
		const geometryPositionArray = geometry.attributes.position.array
		for (let i = 0; i < geometryPositionArray.length; i += 3) {
			geometryPositionArray[i] += (Math.random() - 0.5) * 0.05
			geometryPositionArray[i + 1] += (Math.random() - 0.5) * 0.05
			geometryPositionArray[i + 2] += (Math.random() - 0.5) * 0.05
		}
		return geometry
	}
	function getPlanetMesh(color, size) {
    const material = new THREE.MeshStandardMaterial({ color, flatShading: true, side: THREE.DoubleSide })
    const mesh =  new THREE.Mesh(geometry, material)
    mesh.scale.set(size, size, size)
    return mesh
  }
  const geometry = getPlanetGeometry(64)
	const geometryPositionArray = geometry.attributes.position.array
  const sunMesh = getPlanetMesh('orange', 2)
  const earthMesh = getPlanetMesh('blue', 0.3)
  const moonMesh = getPlanetMesh('gray', 0.15)
  const rotationMeshGroup = new THREE.Group()
  rotationMeshGroup.position.set(0, 0, 0)
  const innerRotationMeshGroup = new THREE.Group()
  innerRotationMeshGroup.position.set(4.5, 0, 0)
  moonMesh.position.set(0.5, 0, 0)
  innerRotationMeshGroup.add(earthMesh, moonMesh)
  rotationMeshGroup.add(sunMesh, innerRotationMeshGroup)

	/* 씬 설정 */
	const scene = new THREE.Scene()
	scene.background = new THREE.Color(BACGROUND_COLOR)
	scene.add(camera)
	scene.add(ambientLight)
	scene.add(directionalLight)
	scene.add(axesHelper)
	scene.add(gridHeler)
  scene.add(rotationMeshGroup)

	/* 렌더러 설정 */
	const renderer = new THREE.WebGLRenderer({ 
		canvas: canvasEl, 
		antialias: true,
		alpha: true,
	})
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1)
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

	/* 카메라 컨트롤 설정*/
	const controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true

	/* 애니메이션 설정 */
	const clock = new THREE.Clock()
	function rotate() {
    const delta = clock.getDelta()
    rotationMeshGroup.rotation.y += delta
    innerRotationMeshGroup.rotation.y += delta
		moonMesh.rotation.y += delta
  }
	function splash() {
		const elapsedTime = clock.getElapsedTime()
		for(let i = 0; i < geometryPositionArray.length; i += 3) {
			geometryPositionArray[i] += Math.sin(elapsedTime + (Math.random() - 0.5) * 100) * 0.001
			geometryPositionArray[i + 1] += Math.sin(elapsedTime + (Math.random() - 0.5) * 100) * 0.001
			geometryPositionArray[i + 2] += Math.sin(elapsedTime + (Math.random() - 0.5) * 100) * 0.001
		}
		geometry.attributes.position.needsUpdate = true
	}
	function repeatAnimation() {
		rotate()
		splash()
    camera.lookAt(0, 0, 0)
		renderer.render(scene, camera)
		window.requestAnimationFrame(repeatAnimation) // 실행할 애니메이션 함수 안에 requestAnimationFrame함수를 호출함으로써 반복 동작 구현
		stats.update() // FPS 업데이트
		controls.update()
	}
	function initAnimation() {
		repeatAnimation()
	}	
	initAnimation()

	/* 컨트롤러 설정 */
	const controller = new Dat.GUI()
	controller.add(camera.position, 'x', -5, 5, 0.01).name('X Position of a the camera')
  controller.add(camera.position, 'y', -5, 5, 0.01).name('Y Position of a the camera')
  controller.add(camera.position, 'z', -5, 5, 0.01).name('Z Position of a the camera')
}

/* 상수 */
const BACGROUND_COLOR = "#fff"
