import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
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

export interface MouthSceneHandle {
  resetCamera: () => void
}

type FlyTo = (pos: THREE.Vector3, look: THREE.Vector3, dur: number, onDone: (() => void) | null) => void

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

export const MouthScene = forwardRef<MouthSceneHandle, MouthSceneProps>(function MouthScene(
  { onBack, onToothSelected },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoverLabel, setHoverLabel] = useState<string | null>(null)
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(true)
  // onToothSelected muda de referencia a cada render do App (state subindo).
  // Se ela entrasse nas deps do useEffect da cena, o efeito inteiro reiniciaria
  // bem no momento do clique — destruindo e recriando o WebGL, o que parecia
  // um "refresh" da pagina. Guardamos a versao mais recente numa ref em vez disso.
  const onToothSelectedRef = useRef(onToothSelected)
  onToothSelectedRef.current = onToothSelected

  // panelOpen controlava a interacao (hover/clique) só de dentro do closure do
  // efeito abaixo, sem nenhuma forma de ser reiniciado de fora — por isso, ao
  // voltar da tela de resultado, a cena ficava "travada" no dente anterior.
  // Guardando numa ref e expondo resetCamera via useImperativeHandle, o App
  // consegue pedir pra cena voltar ao estado inicial de verdade.
  const panelOpenRef = useRef(false)
  const flyToRef = useRef<FlyTo | null>(null)
  const homeRef = useRef({ pos: new THREE.Vector3(0, 0.4, 3.7), look: new THREE.Vector3(0, 0, 0.1) })

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      panelOpenRef.current = false
      flyToRef.current?.(homeRef.current.pos, homeRef.current.look, 900, null)
    },
  }))

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

    const camHome = homeRef.current.pos
    const lookHome = homeRef.current.look
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 40)
    camera.position.set(0, 0.9, 6.5)

    const gumMat = new THREE.MeshPhysicalMaterial({ color: 0xd66a76, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.22 })

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
      const geo = new RoundedBoxGeometry(w, h, d, 6, Math.min(w, d) * 0.22)
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i)
        const k = y / h + 0.5
        if (type === 'incisivo') {
          pos.setZ(i, pos.getZ(i) * (1 - k * 0.42))
          pos.setX(i, pos.getX(i) * (0.86 + k * 0.14))
        } else if (type === 'canino') {
          // afunilamento suave: ponta um pouco mais fina que os vizinhos, sem
          // virar cone. Esse tipo nao recebe o arredondamento generico abaixo
          // pra nao somar dois estreitamentos e exagerar na ponta.
          // Math.max(k, 0) evita passar numero negativo pro Math.pow — sem
          // isso, um k bem perto de zero (tipo -0.0000001 por imprecisao de
          // ponto flutuante) vira NaN, porque potencia fracionaria de numero
          // negativo nao existe nos reais e o JS devolve NaN nesse caso.
          const s = 1 - Math.pow(Math.max(k, 0), 1.6) * 0.5
          pos.setX(i, pos.getX(i) * s)
          pos.setZ(i, pos.getZ(i) * s)
        } else {
          pos.setX(i, pos.getX(i) * (0.82 + k * 0.18))
          pos.setZ(i, pos.getZ(i) * (0.84 + k * 0.16))
        }
        // arredonda a borda de mordida/mastigacao (topo 30%) dos dentes que
        // nao sao canino, pra tirar a cara de "caixinha" com topo reto.
        if (type !== 'canino' && k > 0.7) {
          const roundT = (k - 0.7) / 0.3
          const pull = 1 - roundT * 0.22
          pos.setX(i, pos.getX(i) * pull)
          pos.setZ(i, pos.getZ(i) * pull)
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

      // largura "real" de cada dente, usada tanto pra construir a coroa quanto
      // pra calcular a posicao dele na arcada.
      const baseWidths = TOOTH_TYPES.map((type, i) =>
        type === 'molar' ? 0.22 : type === 'premolar' ? 0.19 : type === 'canino' ? 0.17 : (i === 6 || i === 7) ? 0.185 : 0.16,
      )
      const totalWidth = baseWidths.reduce((sum, w) => sum + w, 0)
      // posiciona cada dente proporcionalmente a sua propria largura em vez de
      // passos angulares iguais — antes, dentes estreitos (lateral, pre-molar)
      // sobravam vao enquanto os largos (molar, incisivo central) ficavam ok.
      let cursor = 0
      const centers = baseWidths.map((w) => {
        const center = cursor + w / 2
        cursor += w
        return center / totalWidth
      })

      for (let i = 0; i < 14; i++) {
        const th = -1.26 + 2.52 * centers[i]
        const type = TOOTH_TYPES[i]
        // largura de colocacao 8% maior que a largura "real", só o suficiente
        // pra fechar o vao entre os dentes sem virar um bloco so.
        const baseW = baseWidths[i]
        const w = baseW * 1.08
        const h = type === 'incisivo' ? ((i === 6 || i === 7) ? 0.34 : 0.31) : type === 'canino' ? 0.33 : 0.29
        const d = type === 'molar' ? 0.2 : type === 'premolar' ? 0.17 : type === 'canino' ? 0.15 : 0.11
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
      }
      return arch
    }

    const mouthGroup = new THREE.Group()
    const lowerArch = makeArch(false)
    lowerArch.position.y = -0.44
    lowerArch.rotation.x = THREE.MathUtils.degToRad(8)
    mouthGroup.add(lowerArch)
    const upperArch = makeArch(true)
    upperArch.position.y = 0.38
    upperArch.rotation.x = THREE.MathUtils.degToRad(-8)
    mouthGroup.add(upperArch)

    // uma unica malha (sem costura entre pecas), com um sulco central raso
    // esculpido nos vertices do topo da esfera antes da escala esticar tudo
    // no formato de lingua.
    const tongueMat = new THREE.MeshPhysicalMaterial({ color: 0xd8707c, roughness: 0.4, clearcoat: 0.75, clearcoatRoughness: 0.22 })
    const tongueGeo = new THREE.SphereGeometry(0.62, 32, 24)
    const tonguePos = tongueGeo.attributes.position
    for (let i = 0; i < tonguePos.count; i++) {
      const x = tonguePos.getX(i)
      const y = tonguePos.getY(i)
      if (y > 0.25) {
        const grooveT = Math.max(0, 1 - Math.abs(x) / 0.22)
        if (grooveT > 0) tonguePos.setY(i, y - grooveT * 0.09 * (y / 0.62))
      }
    }
    tongueGeo.computeVertexNormals()
    const tongueGrp = new THREE.Mesh(tongueGeo, tongueMat)
    tongueGrp.scale.set(1.0, 0.32, 1.55)
    tongueGrp.castShadow = true
    tongueGrp.position.set(0, 0.14, 0.03)
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
    flyToRef.current = flyTo

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
      if (panelOpenRef.current || camAnim || !hovered) return
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
      panelOpenRef.current = true
      flyTo(dest, wp, 750, () => {
        onToothSelectedRef.current(target.userData.info as ToothInfo)
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

      if (!panelOpenRef.current) {
        mouthGroup.rotation.y = THREE.MathUtils.lerp(mouthGroup.rotation.y, pointer.x * 0.4 + Math.sin(t * 0.2) * 0.05, 0.04)
        mouthGroup.rotation.x = THREE.MathUtils.lerp(mouthGroup.rotation.x, -pointer.y * 0.14, 0.04)
      }
      tongueGrp.position.y = 0.16 + Math.sin(t * 0.9) * 0.012

      if (!panelOpenRef.current && !camAnim) {
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
  }, [])

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
      <div className="mouth-scene__logo">
        <span className="mouth-scene__logo-mark">🦷</span>
        <span className="mouth-scene__logo-text">E Meu Dente?</span>
      </div>
      <button type="button" className="mouth-scene__back" onClick={onBack}>
        ← voltar ao início
      </button>
    </div>
  )
})
