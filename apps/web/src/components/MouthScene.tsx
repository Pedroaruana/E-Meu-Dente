import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import './MouthScene.css'

export interface ToothInfo {
  fdi: number
  name: string
}

interface MouthSceneProps {
  onBack: () => void
  onToothSelected: (tooth: ToothInfo) => void
}

const TOOTH_TYPES = [
  'molar', 'molar', 'premolar', 'premolar', 'canino', 'incisivo', 'incisivo',
  'incisivo', 'incisivo', 'canino', 'premolar', 'premolar', 'molar', 'molar',
] as const

const TOOTH_NAMES = [
  '2º molar', '1º molar', '2º pré-molar', '1º pré-molar', 'canino', 'incisivo lateral', 'incisivo central',
  'incisivo central', 'incisivo lateral', 'canino', '1º pré-molar', '2º pré-molar', '1º molar', '2º molar',
]

const FDI_UPPER = [17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27]
const FDI_LOWER = [47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37]

export function MouthScene({ onBack, onToothSelected }: MouthSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverLabel, setHoverLabel] = useState<string | null>(null)
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.62
    container.appendChild(renderer.domElement)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

    const scene = new THREE.Scene()
    scene.environment = envTex
    scene.background = new THREE.Color(0x0d1f2b)

    const gc = document.createElement('canvas')
    gc.width = gc.height = 512
    const gg = gc.getContext('2d')!
    const rad = gg.createRadialGradient(256, 256, 40, 256, 256, 250)
    rad.addColorStop(0, 'rgba(46,110,128,.9)')
    rad.addColorStop(0.55, 'rgba(24,62,76,.45)')
    rad.addColorStop(1, 'rgba(13,31,43,0)')
    gg.fillStyle = rad
    gg.fillRect(0, 0, 512, 512)
    const glowTex = new THREE.CanvasTexture(gc)
    glowTex.colorSpace = THREE.SRGBColorSpace
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 7),
      new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false }),
    )
    glow.position.set(0, 0, -3.2)
    scene.add(glow)

    const camHome = new THREE.Vector3(0, 0.4, 3.7)
    const lookHome = new THREE.Vector3(0, 0, 0.1)
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 40)
    camera.position.set(0, 0.9, 6.5)

    const gumMat = new THREE.MeshPhysicalMaterial({ color: 0xd66a76, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.22 })
    const gumDark = new THREE.MeshPhysicalMaterial({ color: 0xc25865, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.26 })

    function toothMaterial() {
      const c = new THREE.Color(0xf5f0e4).lerp(new THREE.Color(0xece3d0), Math.random() * 0.45)
      const m = new THREE.MeshPhysicalMaterial({
        color: c, roughness: 0.24, clearcoat: 1,
        clearcoatRoughness: 0.1, ior: 1.55, sheen: 0.25, sheenColor: new THREE.Color(0xffffff),
      })
      m.envMapIntensity = 0.55
      return m
    }

    // parte de um cubo arredondado generico e afunila os vertices de acordo
    // com a altura (k = 0 na base, 1 no topo) pra cada tipo de dente ficar
    // com o formato certo: incisivo em lamina, canino pontudo, molar mais reto.
    function buildTooth(type: string, w: number, h: number, d: number) {
      const grp = new THREE.Group()
      const mat = toothMaterial()
      const geo = new RoundedBoxGeometry(w, h, d, 5, Math.min(w, d) * 0.34)
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i)
        const k = y / h + 0.5
        if (type === 'incisivo') {
          pos.setZ(i, pos.getZ(i) * (1 - k * 0.42))
          pos.setX(i, pos.getX(i) * (0.86 + k * 0.14))
        } else if (type === 'canino') {
          const s = 1 - k * 0.45
          pos.setX(i, pos.getX(i) * s)
          pos.setZ(i, pos.getZ(i) * s)
        } else {
          pos.setX(i, pos.getX(i) * (0.82 + k * 0.18))
          pos.setZ(i, pos.getZ(i) * (0.84 + k * 0.16))
        }
      }
      geo.computeVertexNormals()
      const crown = new THREE.Mesh(geo, mat)
      crown.castShadow = true
      grp.add(crown)
      grp.userData.crown = crown
      return grp
    }

    const teeth: THREE.Group[] = []
    const Rx = 0.98
    const Rz = 1.18

    function archPoint(theta: number) {
      return new THREE.Vector3(Math.sin(theta) * Rx, 0, Math.cos(theta) * Rz)
    }

    function makeArch(flip: boolean) {
      const arch = new THREE.Group()
      const curvePts: THREE.Vector3[] = []
      for (let i = 0; i <= 24; i++) {
        const th = -1.38 + 2.76 * (i / 24)
        curvePts.push(archPoint(th))
      }
      const gumTube = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePts), 48, 0.17, 16),
        gumMat,
      )
      gumTube.castShadow = true
      gumTube.receiveShadow = true
      arch.add(gumTube)

      for (let i = 0; i < 14; i++) {
        const th = -1.26 + 2.52 * (i / 13)
        const type = TOOTH_TYPES[i]
        const w = type === 'molar' ? 0.24 : type === 'premolar' ? 0.18 : type === 'canino' ? 0.16 : (i === 6 || i === 7) ? 0.19 : 0.15
        const h = type === 'incisivo' ? ((i === 6 || i === 7) ? 0.4 : 0.34) : type === 'canino' ? 0.37 : 0.28
        const d = type === 'molar' ? 0.22 : type === 'premolar' ? 0.17 : type === 'canino' ? 0.14 : 0.1
        const t = buildTooth(type, w, h, d)
        const p = archPoint(th)
        const yTooth = 0.1 + h / 2 - 0.06
        t.position.set(p.x, flip ? -yTooth : yTooth, p.z)
        const yaw = Math.atan2(p.x, p.z)
        if (flip) t.rotation.set(Math.PI, -yaw, 0)
        else t.rotation.y = yaw
        t.userData.info = {
          name: `${TOOTH_NAMES[i]} ${flip ? 'superior' : 'inferior'} ${i < 7 ? 'direito' : 'esquerdo'}`,
          fdi: flip ? FDI_UPPER[i] : FDI_LOWER[i],
        }
        arch.add(t)
        teeth.push(t)

        const collar = new THREE.Mesh(new THREE.TorusGeometry(Math.max(w, d) * 0.5, 0.035, 10, 22), gumDark)
        collar.position.set(p.x, flip ? -0.1 : 0.1, p.z)
        collar.rotation.x = Math.PI / 2
        arch.add(collar)
      }
      return arch
    }

    const mouthGroup = new THREE.Group()
    const lowerArch = makeArch(false)
    lowerArch.position.y = -0.5
    lowerArch.rotation.x = THREE.MathUtils.degToRad(8)
    mouthGroup.add(lowerArch)
    const upperArch = makeArch(true)
    upperArch.position.y = 0.5
    upperArch.rotation.x = THREE.MathUtils.degToRad(-8)
    mouthGroup.add(upperArch)

    const tongueMat = new THREE.MeshPhysicalMaterial({ color: 0xd8707c, roughness: 0.4, clearcoat: 0.75, clearcoatRoughness: 0.22 })
    const tongueGrp = new THREE.Group()
    for (const s of [-1, 1]) {
      const half = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 18), tongueMat)
      half.scale.set(0.62, 0.26, 1.4)
      half.position.set(s * 0.19, 0, 0)
      half.castShadow = true
      tongueGrp.add(half)
    }
    const tongueTip = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 14), tongueMat)
    tongueTip.scale.set(1.05, 0.22, 0.65)
    tongueTip.position.set(0, 0, 0.68)
    tongueGrp.add(tongueTip)
    tongueGrp.position.set(0, 0.16, -0.02)
    lowerArch.add(tongueGrp)

    scene.add(mouthGroup)

    const sc = document.createElement('canvas')
    sc.width = sc.height = 256
    const sg = sc.getContext('2d')!
    const srad = sg.createRadialGradient(128, 128, 10, 128, 128, 120)
    srad.addColorStop(0, 'rgba(0,0,0,.5)')
    srad.addColorStop(1, 'rgba(0,0,0,0)')
    sg.fillStyle = srad
    sg.fillRect(0, 0, 256, 256)
    const shadowTex = new THREE.CanvasTexture(sc)
    const shadowDisc = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 3),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    )
    shadowDisc.rotation.x = -Math.PI / 2
    shadowDisc.position.y = -1.55
    scene.add(shadowDisc)

    const key = new THREE.SpotLight(0xfff3e0, 20, 20, Math.PI / 4.5, 0.5, 1.6)
    key.position.set(2.6, 3.4, 3.8)
    key.target.position.set(0, 0, 0)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    scene.add(key, key.target)
    const fill = new THREE.PointLight(0xbfe4ee, 2.5, 14, 1.8)
    fill.position.set(-3.2, 0.6, 2.6)
    scene.add(fill)
    const rimL = new THREE.PointLight(0x7fd8f0, 3, 14, 1.8)
    rimL.position.set(-1.2, 2.4, -3.4)
    scene.add(rimL)
    scene.add(new THREE.HemisphereLight(0x9cc8d4, 0x142832, 0.22))

    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)
    const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.08, 0.5, 0.96)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(-9, -9)
    const currentLook = lookHome.clone()
    let hovered: THREE.Group | null = null
    let panelOpen = false
    let camAnim: {
      t0: number; dur: number
      fromP: THREE.Vector3; toP: THREE.Vector3
      fromL: THREE.Vector3; toL: THREE.Vector3
      onDone: (() => void) | null
    } | null = null

    // anima a camera de um ponto a outro (posicao + mira) com facilitacao cubica,
    // lido a cada frame no loop principal em vez de usar uma lib de tween externa.
    function flyTo(pos: THREE.Vector3, look: THREE.Vector3, dur: number, onDone: (() => void) | null) {
      camAnim = {
        t0: performance.now(), dur,
        fromP: camera.position.clone(), toP: pos.clone(),
        fromL: currentLook.clone(), toL: look.clone(), onDone,
      }
    }

    function setHover(obj: THREE.Group | null) {
      if (hovered === obj) return
      if (hovered) {
        const crown = hovered.userData.crown as THREE.Mesh
        ;(crown.material as THREE.MeshPhysicalMaterial).emissive.setHex(0x000000)
        hovered.scale.setScalar(1)
      }
      hovered = obj
      if (hovered) {
        const crown = hovered.userData.crown as THREE.Mesh
        const mat = crown.material as THREE.MeshPhysicalMaterial
        mat.emissive.setHex(0x2fa8c4)
        mat.emissiveIntensity = 0.3
        hovered.scale.setScalar(1.09)
        const info = hovered.userData.info as ToothInfo
        setHoverLabel(`${info.name} (${info.fdi})`)
      } else {
        setHoverLabel(null)
      }
    }

    function onPointerMove(e: PointerEvent) {
      const rect = container!.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    function onClick() {
      if (panelOpen || camAnim || !hovered) return
      const target = hovered
      setHover(null)
      const crown = target.userData.crown as THREE.Mesh
      const mat = crown.material as THREE.MeshPhysicalMaterial
      mat.emissive.setHex(0x2fa8c4)
      mat.emissiveIntensity = 0.35

      const wp = new THREE.Vector3()
      target.getWorldPosition(wp)
      const dir = new THREE.Vector3().subVectors(camera.position, wp).normalize()
      const dest = wp.clone().add(dir.multiplyScalar(1.05)).add(new THREE.Vector3(0, 0.08, 0))
      panelOpen = true
      flyTo(dest, wp, 750, () => {
        onToothSelected(target.userData.info as ToothInfo)
      })
    }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('click', onClick)

    function handleResize() {
      const w = container!.clientWidth
      const h = container!.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    flyTo(camHome, lookHome, 1600, null)

    let raf = 0
    const clock = new THREE.Clock()
    let firstFrame = true

    const animate = () => {
      const t = clock.getElapsedTime()

      if (camAnim) {
        const k = Math.min(1, (performance.now() - camAnim.t0) / camAnim.dur)
        const e = 1 - Math.pow(1 - k, 3)
        camera.position.lerpVectors(camAnim.fromP, camAnim.toP, e)
        currentLook.lerpVectors(camAnim.fromL, camAnim.toL, e)
        camera.lookAt(currentLook)
        if (k >= 1) {
          const cb = camAnim.onDone
          camAnim = null
          cb?.()
        }
      } else {
        camera.lookAt(currentLook)
      }

      if (!panelOpen) {
        mouthGroup.rotation.y = THREE.MathUtils.lerp(mouthGroup.rotation.y, pointer.x * 0.4 + Math.sin(t * 0.2) * 0.05, 0.04)
        mouthGroup.rotation.x = THREE.MathUtils.lerp(mouthGroup.rotation.x, -pointer.y * 0.14, 0.04)
      }
      tongueGrp.position.y = 0.16 + Math.sin(t * 0.9) * 0.012

      if (!panelOpen && !camAnim) {
        raycaster.setFromCamera(pointer, camera)
        const hit = raycaster.intersectObjects(teeth, true)[0]
        let grp: THREE.Object3D | null = hit ? hit.object : null
        while (grp && !grp.userData.info) grp = grp.parent
        setHover((grp as THREE.Group) ?? null)
      }

      composer.render()
      if (firstFrame) {
        firstFrame = false
        setLoading(false)
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('click', onClick)
      renderer.dispose()
      pmrem.dispose()
      envTex.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [onToothSelected])

  return (
    <div className="mouth-scene">
      <div ref={containerRef} className="mouth-scene__canvas" />
      {loading && <div className="mouth-scene__loading">preparando o modelo…</div>}
      {hoverLabel && (
        <div
          className="mouth-scene__tip"
          style={{ left: hoverPos.x + 14, top: hoverPos.y }}
        >
          {hoverLabel}
        </div>
      )}
      <p className="mouth-scene__hint">gire com o mouse e clique no dente que está te incomodando</p>
      <button type="button" className="mouth-scene__back" onClick={onBack}>
        ← voltar ao início
      </button>
    </div>
  )
}
