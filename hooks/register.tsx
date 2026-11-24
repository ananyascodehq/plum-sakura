import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'

// Only the accent roles are plum; every gray stays the app's own.
const { theme, problems } = makeColors({
  label: 'Plum sakura',
  roles: { accent: '#a9559a', pro: '#7a5bb0' },
})

const SCENE = 'plum-sakura'

type Pose = 'sit' | 'groom' | 'sleep'
const IDLE_POSES: Pose[] = ['sit', 'groom', 'sleep']

// ---------- colors ----------
const FUR = '#9b8575'
const FURD = '#74624f'
const WHITE = '#f4eee9'
const PINK = '#f2a7b5'
const NOSE = '#e58aa0'
const INK = '#2d2428'

// ---------- tiny deterministic random ----------
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

// ---------- blossoms as plain paths ----------
function bloom(cx: number, cy: number, scale: number, rotDeg: number): string {
  let d = ''
  for (let k = 0; k < 5; k++) {
    const a = ((rotDeg + k * 72) * Math.PI) / 180
    const c = Math.cos(a)
    const s = Math.sin(a)
    const p = (x: number, y: number) =>
      `${(cx + scale * (x * c - y * s)).toFixed(1)} ${(cy + scale * (x * s + y * c)).toFixed(1)}`
    d += `M${p(0, 0)}C${p(-7, -8)} ${p(-6, -18)} ${p(0, -22)}C${p(6, -18)} ${p(7, -8)} ${p(0, 0)}Z`
  }
  return d
}

type Bloom = [x: number, y: number, rot: number, scale: number]

function blooms(color: string, items: Bloom[]): string {
  return `<path fill="${color}" opacity="0.95" d="${items.map(([x, y, r, s]) => bloom(x, y, s, r)).join('')}"/>`
}

function tree(): string {
  return `<svg x="180" y="0" width="1100" height="760" viewBox="0 0 1100 760" overflow="visible">
<g class="t1">
<ellipse cx="1088" cy="34" rx="26" ry="18" fill="#2f2420"/>
<path d="M1180 34 C1150 30 1110 26 1080 28 C1010 40 930 90 850 150 C800 190 760 200 700 260" fill="none" stroke="#2f2420" stroke-width="22" stroke-linecap="round"/>
<path d="M1070 30 C1010 42 930 90 850 148 C800 188 760 198 700 258" fill="none" stroke="#4a3830" stroke-width="2.6" stroke-linecap="round" opacity="0.7"/>
<path d="M850 150 C800 120 760 110 700 70" fill="none" stroke="#3d2f28" stroke-width="10" stroke-linecap="round"/>
<path d="M930 90 C900 40 880 20 850 0" fill="none" stroke="#3d2f28" stroke-width="8" stroke-linecap="round"/>
<path d="M780 190 C750 230 740 280 700 330" fill="none" stroke="#3d2f28" stroke-width="7" stroke-linecap="round"/>
${blooms('#a9559a', [[700, 262, 0, 1.3], [725, 238, 20, 1], [745, 215, 40, 1.15], [702, 70, 10, 1.2], [730, 85, 50, 0.9], [760, 108, 30, 1.1]])}
${blooms('#cf86bf', [[700, 332, 35, 1.1], [738, 292, 15, 0.9], [850, 2, 25, 1.2], [870, 30, 60, 0.85], [805, 130, 5, 1], [830, 170, 45, 1.1]])}
${blooms('#f0c3de', [[770, 175, 12, 0.9], [690, 300, 48, 0.8], [715, 105, 33, 0.8], [890, 60, 20, 1]])}
</g>
<g class="t2">
<ellipse cx="1096" cy="210" rx="20" ry="14" fill="#2f2420"/>
<path d="M1180 194 C1150 198 1120 206 1098 214 C1040 238 1000 262 960 320 C940 350 930 380 900 420" fill="none" stroke="#2f2420" stroke-width="14" stroke-linecap="round"/>
<path d="M980 290 C940 280 910 290 880 270" fill="none" stroke="#3d2f28" stroke-width="6" stroke-linecap="round"/>
${blooms('#a9559a', [[900, 422, 0, 1.1], [880, 272, 30, 1]])}
${blooms('#cf86bf', [[925, 380, 20, 0.9], [955, 330, 50, 1]])}
${blooms('#f0c3de', [[905, 285, 10, 0.85]])}
</g>
</svg>`
}

// The two walls the cat walks between: a stone wall with a lantern on the left...
function leftWall(): string {
  return `<circle cx="180" cy="584" r="64" fill="#f0c987" opacity="0.1"/>
<rect x="110" y="655" width="140" height="90" fill="#3a3541"/>
<path d="M110 677 H250 M110 699 H250 M110 721 H250 M150 655 V677 M200 677 V699 M140 699 V721 M215 699 V721 M175 721 V745" fill="none" stroke="#4a4552" stroke-width="2.5"/>
<rect x="104" y="645" width="146" height="14" rx="3" fill="#4d4755"/>
<rect x="162" y="630" width="36" height="15" fill="#4a4452"/>
<rect x="173" y="600" width="14" height="32" fill="#4a4452"/>
<rect x="156" y="566" width="48" height="36" fill="#4a4452"/>
<rect class="lamp" x="164" y="573" width="32" height="22" fill="#f0c987"/>
<path d="M148 568 L180 542 L212 568Z" fill="#5b5463"/>
<circle cx="180" cy="538" r="5" fill="#5b5463"/>`
}

// ...and a sakura trunk on the right, drawn in the right-anchored frame.
function trunk(): string {
  // A narrow, gnarled trunk that flares into roots at the base, in dark bark brown.
  const body =
    'M1182 -300 L1178 0 C1180 70 1194 110 1188 160 C1182 210 1172 250 1180 310 C1188 380 1172 450 1178 530 C1182 590 1172 640 1158 690 C1142 722 1108 738 1060 746 L1130 738 C1170 744 1230 744 1280 740 C1330 744 1372 750 1394 748 C1352 726 1324 700 1314 650 C1306 590 1318 520 1308 450 C1300 380 1312 320 1304 250 C1298 190 1308 130 1300 60 L1296 0 L1296 -300Z'
  return `<path d="${body}" fill="#2f2420"/>
<path d="M1296 -300 L1296 0 C1308 130 1298 190 1304 250 C1312 320 1300 380 1308 450 C1318 520 1306 590 1314 650 C1324 700 1352 726 1394 748" fill="none" stroke="#1d1411" stroke-width="18" opacity="0.55" stroke-linecap="round"/>
<path d="M1182 -300 L1178 0 C1180 70 1194 110 1188 160 C1182 210 1172 250 1180 310 C1188 380 1172 450 1178 530 C1182 590 1172 640 1158 690 C1142 722 1108 738 1060 746" fill="none" stroke="#54423a" stroke-width="3" opacity="0.8" stroke-linecap="round"/>
<path d="M1212 -60 C1208 100 1222 200 1214 330 C1210 420 1220 520 1212 640 M1254 -60 C1258 90 1246 220 1256 360 C1262 460 1252 560 1260 680 M1280 0 C1284 140 1274 260 1282 400" fill="none" stroke="#4a3830" stroke-width="3" stroke-linecap="round"/>
<path d="M1196 300 q12 5 24 0 M1262 430 q-12 5 -22 0 M1224 560 q10 4 20 -1 M1270 250 q-9 4 -18 0" fill="none" stroke="#3d2e28" stroke-width="2.4" stroke-linecap="round"/>
<ellipse cx="1240" cy="150" rx="17" ry="24" fill="#1d1411"/>
<ellipse cx="1240" cy="150" rx="11" ry="17" fill="none" stroke="#4a3830" stroke-width="2.4"/>
<ellipse cx="1240" cy="150" rx="5" ry="9" fill="none" stroke="#4a3830" stroke-width="2"/>
<path d="M1090 744 C1120 730 1146 718 1166 698 M1360 746 C1340 730 1326 714 1318 696 M1200 744 C1210 726 1214 712 1212 690" fill="none" stroke="#4a3830" stroke-width="3" stroke-linecap="round"/>`
}

// A washed-out Bengal, all brown: sandy coat, soft darker stripes, a slightly lighter muzzle and paws.
const BENGAL = '#c2a07a'
const BENGAL_MARK = '#9f7d58'
const BENGAL_DEEP = '#7c5f43'
const BENGAL_LIGHT = '#d6bc98'
const AMBER = '#d4ac4a'

function bengalCat(): string {
  const stripe = (d: string) => `<path d="${d}" fill="none" stroke="${BENGAL_MARK}" stroke-width="3" stroke-linecap="round"/>`
  return `<ellipse cx="26" cy="100" rx="15" ry="18" fill="${BENGAL}"/><ellipse cx="74" cy="100" rx="15" ry="18" fill="${BENGAL}"/>
<ellipse cx="50" cy="92" rx="26" ry="27" fill="${BENGAL}"/>
<rect x="37" y="92" width="10" height="23" rx="5" fill="${BENGAL}"/><rect x="53" y="92" width="10" height="23" rx="5" fill="${BENGAL}"/>
<ellipse cx="42" cy="115" rx="8" ry="5" fill="${BENGAL_LIGHT}"/><ellipse cx="58" cy="115" rx="8" ry="5" fill="${BENGAL_LIGHT}"/>
<ellipse cx="22" cy="114" rx="9" ry="5" fill="${BENGAL_LIGHT}"/><ellipse cx="78" cy="114" rx="9" ry="5" fill="${BENGAL_LIGHT}"/>
${stripe('M14 92 Q20 90 24 95')}${stripe('M13 102 Q19 100 23 105')}${stripe('M86 92 Q80 90 76 95')}${stripe('M87 102 Q81 100 77 105')}
${stripe('M33 76 Q38 80 36 86')}${stripe('M67 76 Q62 80 64 86')}${stripe('M41 83 Q44 88 42 93')}${stripe('M59 83 Q56 88 58 93')}
${stripe('M39 100 L47 100')}${stripe('M53 100 L61 100')}
<path d="M24 40 L22 6 Q36 8 44 24Z" fill="${BENGAL}"/><path d="M28 33 L27 15 Q34 17 39 26Z" fill="#dcae9a"/>
<path d="M76 40 L78 6 Q64 8 56 24Z" fill="${BENGAL}"/><path d="M72 33 L73 15 Q66 17 61 26Z" fill="#dcae9a"/>
<ellipse cx="50" cy="47" rx="30" ry="25" fill="${BENGAL}"/>
${stripe('M44 25 L45 33')}${stripe('M50 23 L50 32')}${stripe('M56 25 L55 33')}
<path d="M21 49 Q27 47 31 51 M20 56 Q26 55 30 58 M79 49 Q73 47 69 51 M80 56 Q74 55 70 58" fill="none" stroke="${BENGAL_MARK}" stroke-width="2.2" stroke-linecap="round"/>
<ellipse cx="50" cy="58" rx="13" ry="9" fill="${BENGAL_LIGHT}"/>
<g class="blink"><ellipse cx="38" cy="46" rx="4.8" ry="5.6" fill="${AMBER}"/><ellipse cx="38.2" cy="46.6" rx="2.9" ry="4.4" fill="${INK}"/><circle cx="39.4" cy="44.4" r="1.6" fill="#fff"/></g>
<g class="blink"><ellipse cx="62" cy="46" rx="4.8" ry="5.6" fill="${AMBER}"/><ellipse cx="61.8" cy="46.6" rx="2.9" ry="4.4" fill="${INK}"/><circle cx="63" cy="44.4" r="1.6" fill="#fff"/></g>
<ellipse cx="29" cy="57" rx="4.6" ry="2.8" fill="#dca696" opacity="0.5"/><ellipse cx="71" cy="57" rx="4.6" ry="2.8" fill="#dca696" opacity="0.5"/>
<path d="M47 54 Q50 52 53 54 Q51.6 58 50 58.6 Q48.4 58 47 54Z" fill="#cf8a80"/>
<path d="M50 58.6 Q50 62 46.6 62 M50 58.6 Q50 62 53.4 62" fill="none" stroke="#9c6359" stroke-width="1.6" stroke-linecap="round"/>
<path d="M32 56 L16 53 M32 59 L16 60 M68 56 L84 53 M68 59 L84 60" fill="none" stroke="${BENGAL_LIGHT}" stroke-width="1.3" stroke-linecap="round" opacity="0.8"/>`
}

// A hanging sign: iron-and-wood bracket fixed to the window's left edge, the Bengal lounging on the
// beam with her tail dangling off its end, and the board swinging on two ropes below her.
type SignData = { pct: number; five?: number; seven?: number }

function sign(d: SignData): string {
  const full = 160
  const fill = Math.max(0, Math.min(1, d.pct / 100)) * full
  const text = (x: number, y: number, size: number, weight: string, color: string, value: string, anchor = 'middle') =>
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${value}</text>`
  const limitRow = (y: number, name: string, value: number | undefined) =>
    value === undefined
      ? ''
      : `${text(86, y, 15, '500', '#f3e3cc', name, 'start')}${text(246, y, 15, '700', '#fff6e8', `${Math.round(value)}%`, 'end')}`
  return `<g transform="translate(0 168) scale(0.95)">
<path d="M20 60 C60 54 92 34 122 14" fill="none" stroke="#3f2f22" stroke-width="9" stroke-linecap="round"/>
<rect x="-8" y="-30" width="32" height="104" rx="7" fill="#3f2f22"/>
<circle cx="8" cy="-16" r="3.2" fill="#9a8a74"/><circle cx="8" cy="58" r="3.2" fill="#9a8a74"/>
<rect x="14" y="0" width="300" height="15" rx="6" fill="#6a4d35"/>
<path d="M18 5 H306" fill="none" stroke="#86644a" stroke-width="2" stroke-linecap="round"/>
<g class="swing">
<path d="M70 15 L70 68 M262 15 L262 68" fill="none" stroke="#cdb88c" stroke-width="3.4" stroke-linecap="round"/>
<circle cx="70" cy="15" r="3.6" fill="#9a8a74"/><circle cx="262" cy="15" r="3.6" fill="#9a8a74"/>
<rect x="36" y="66" width="260" height="176" rx="12" fill="#7a5a3a"/>
<rect x="44" y="74" width="244" height="160" rx="8" fill="#43301f"/>
<circle cx="53" cy="83" r="2.4" fill="#9a8a74"/><circle cx="279" cy="83" r="2.4" fill="#9a8a74"/>
<circle cx="53" cy="225" r="2.4" fill="#9a8a74"/><circle cx="279" cy="225" r="2.4" fill="#9a8a74"/>
${text(166, 106, 17, '600', '#f3e3cc', 'Memory used')}
${text(166, 156, 46, '700', '#fff6e8', `${d.pct}%`)}
<rect x="86" y="168" width="${full}" height="14" rx="7" fill="#2a1d12"/>
<rect x="86" y="168" width="${fill.toFixed(1)}" height="14" rx="7" fill="#f4a3cf"/>
${limitRow(204, '5-hour limit', d.five)}
${limitRow(226, 'Weekly limit', d.seven)}
</g>
<g transform="translate(236 -98) scale(0.82)">${bengalCat()}</g>
<g class="dang"><path d="M294 -8 C316 -4 324 24 318 54 C314 72 316 86 322 96" fill="none" stroke="${BENGAL}" stroke-width="10" stroke-linecap="round"/><path d="M320 86 L322 98" fill="none" stroke="${BENGAL_DEEP}" stroke-width="10" stroke-linecap="round"/></g>
</g>`
}

// ---------- petals and wind ----------
function petals(n: number, work: boolean): string {
  const r = rng(11)
  const cols = ['#a9559a', '#cf86bf', '#f0c3de', '#8a4a85']
  let out = ''
  for (let i = 0; i < n; i++) {
    const x = 640 + r() * 760
    const dur = work ? 6 + r() * 4 : 12 + r() * 8
    const delay = -(r() * dur)
    const s = 0.8 + r() * 0.9
    out += `<g transform="translate(${x.toFixed(0)} 0)"><path class="p" fill="${cols[i % 4]}" transform="scale(${s.toFixed(2)})" d="M-5 0 C-3 -6 4 -6 6 0 C4 5 -3 5 -5 0Z" style="animation-name:${work ? 'dw' : 'di'}${i % 4};animation-duration:${dur.toFixed(1)}s;animation-delay:${delay.toFixed(1)}s"/></g>`
  }
  return out
}

function whooshes(): string {
  const ys = [120, 210, 300, 400, 330, 180]
  return ys
    .map(
      (y, i) =>
        `<g transform="translate(0 ${y})"><path class="wh" d="M0 0 C70 -14 140 14 230 -2" fill="none" stroke="#ecd0e6" stroke-width="${i % 2 ? 2 : 3}" stroke-linecap="round" style="animation-delay:${(i * 0.15).toFixed(2)}s"/></g>`,
    )
    .join('')
}

// ---------- the cat: flat, round, cute ----------
function face(eyes: 'open' | 'happy', blink = true): string {
  const eyeMarks =
    eyes === 'open'
      ? `<g class="${blink ? 'blink' : ''}"><ellipse cx="36" cy="45" rx="6" ry="7.5" fill="${INK}"/><circle cx="38" cy="42" r="2.4" fill="#fff"/><circle cx="34" cy="48" r="1.2" fill="#fff"/></g>
<g class="${blink ? 'blink' : ''}"><ellipse cx="64" cy="45" rx="6" ry="7.5" fill="${INK}"/><circle cx="66" cy="42" r="2.4" fill="#fff"/><circle cx="62" cy="48" r="1.2" fill="#fff"/></g>`
      : `<path d="M30 47 Q36 40 42 47 M58 47 Q64 40 70 47" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
  return `<path d="M22 38 L24 8 Q35 12 43 24Z" fill="${FUR}"/><path d="M27 32 L28 15 Q34 18 38 25Z" fill="${PINK}"/>
<path d="M78 38 L76 8 Q65 12 57 24Z" fill="${FUR}"/><path d="M73 32 L72 15 Q66 18 62 25Z" fill="${PINK}"/>
<ellipse cx="50" cy="46" rx="31" ry="27" fill="${FUR}"/>
<path d="M50 22 L50 31 M42 24 L44 31 M58 24 L56 31" fill="none" stroke="${FURD}" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="50" cy="57" rx="16" ry="11" fill="${WHITE}"/>
<path d="M46 36 Q50 30 54 36 L55 50 L45 50Z" fill="${WHITE}"/>
${eyeMarks}
<ellipse cx="27" cy="56" rx="5" ry="3" fill="${PINK}" opacity="0.55"/><ellipse cx="73" cy="56" rx="5" ry="3" fill="${PINK}" opacity="0.55"/>
<path d="M46.5 53 Q50 51 53.5 53 Q52 57.5 50 58 Q48 57.5 46.5 53Z" fill="${NOSE}"/>
<path d="M50 58 Q50 62 46 62 M50 58 Q50 62 54 62" fill="none" stroke="#b4707f" stroke-width="1.8" stroke-linecap="round"/>
<path d="M30 55 L12 52 M30 58 L12 59 M70 55 L88 52 M70 58 L88 59" fill="none" stroke="${WHITE}" stroke-width="1.4" stroke-linecap="round" opacity="0.6"/>`
}

function catSit(groom: boolean): string {
  const paw = groom
    ? `<g class="lick"><path d="M62 100 L62 112" stroke="${WHITE}" stroke-width="11" stroke-linecap="round"/><ellipse cx="62" cy="113" rx="8" ry="6" fill="${WHITE}"/></g>`
    : `<ellipse cx="62" cy="113" rx="8" ry="6" fill="${WHITE}"/>`
  return `<ellipse cx="50" cy="118" rx="36" ry="6" fill="#000" opacity="0.2"/>
<g class="tail"><path d="M24 112 C0 110 -6 82 8 70" fill="none" stroke="${FUR}" stroke-width="9" stroke-linecap="round"/><circle cx="8" cy="70" r="4.5" fill="${FURD}"/></g>
<ellipse cx="50" cy="90" rx="28" ry="29" fill="${FUR}"/>
<ellipse cx="50" cy="96" rx="17" ry="23" fill="${WHITE}"/>
<path d="M23 82 Q30 80 33 86 M22 95 Q29 93 32 99 M77 82 Q70 80 67 86 M78 95 Q71 93 68 99" fill="none" stroke="${FURD}" stroke-width="3" stroke-linecap="round"/>
<ellipse cx="38" cy="113" rx="8" ry="6" fill="${WHITE}"/>
${paw}
<g class="${groom ? 'nod' : ''}">${face(groom ? 'happy' : 'open')}</g>`
}

function catSleep(): string {
  return `<ellipse cx="60" cy="118" rx="52" ry="6" fill="#000" opacity="0.2"/>
<g class="breathe"><ellipse cx="64" cy="96" rx="48" ry="24" fill="${FUR}"/>
<path d="M44 76 Q48 84 44 92 M58 73 Q62 82 58 91 M72 74 Q76 83 72 92 M86 78 Q90 86 86 94" fill="none" stroke="${FURD}" stroke-width="3" stroke-linecap="round"/></g>
<ellipse cx="60" cy="114" rx="30" ry="7" fill="${WHITE}"/>
<path d="M108 108 C124 104 120 124 80 120 C60 122 40 122 28 120" fill="none" stroke="${FUR}" stroke-width="10" stroke-linecap="round"/>
<path d="M36 121 L26 120" fill="none" stroke="${FURD}" stroke-width="10" stroke-linecap="round"/>
<path d="M15 84 L13 64 Q25 66 31 76Z" fill="${FUR}"/><path d="M53 84 L55 64 Q43 66 37 76Z" fill="${FUR}"/>
<path d="M18 80 L17 69 Q23 71 27 77Z" fill="${PINK}"/><path d="M50 80 L51 69 Q45 71 41 77Z" fill="${PINK}"/>
<ellipse cx="34" cy="92" rx="24" ry="21" fill="${FUR}"/>
<path d="M34 74 L34 80 M28 75 L29 80 M40 75 L39 80" fill="none" stroke="${FURD}" stroke-width="2.6" stroke-linecap="round"/>
<ellipse cx="34" cy="102" rx="10" ry="6.5" fill="${WHITE}"/>
<path d="M22 94 Q26 99 30 94 M38 94 Q42 99 46 94" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M31.5 98.5 Q34 97 36.5 98.5 Q35 101.5 34 101.5 Q33 101.5 31.5 98.5Z" fill="${NOSE}"/>
<ellipse cx="20" cy="100" rx="4.5" ry="2.8" fill="${PINK}" opacity="0.55"/><ellipse cx="48" cy="100" rx="4.5" ry="2.8" fill="${PINK}" opacity="0.55"/>
<g class="z" style="animation-delay:0s"><path transform="translate(52 62)" d="M0 0 H8 L0 10 H8" fill="none" stroke="#d9c8e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
<g class="z" style="animation-delay:1.3s"><path transform="translate(64 46)" d="M0 0 H8 L0 10 H8" fill="none" stroke="#d9c8e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>
<g class="z" style="animation-delay:2.6s"><path transform="translate(76 30)" d="M0 0 H8 L0 10 H8" fill="none" stroke="#d9c8e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`
}

const leg = (x: number, color: string, cls: string) =>
  `<g class="${cls}"><rect x="${x}" y="46" width="9" height="22" rx="4.5" fill="${color}"/><ellipse cx="${x + 4.5}" cy="67" rx="6" ry="3.6" fill="${WHITE}"/></g>`

function sideBody(): string {
  return `<ellipse cx="52" cy="46" rx="26" ry="13" fill="${WHITE}"/>
<ellipse cx="62" cy="36" rx="34" ry="17" fill="${FUR}"/>
<ellipse cx="36" cy="42" rx="10" ry="12" fill="${WHITE}"/>
<path d="M52 22 Q56 28 52 33 M64 21 Q68 28 64 33 M76 22 Q80 28 76 33" fill="none" stroke="${FURD}" stroke-width="3" stroke-linecap="round"/>
<path d="M28 17 L36 2 Q41 12 38 20Z" fill="${FURD}"/>
<path d="M13 19 L9 3 Q21 6 25 15Z" fill="${FUR}"/><path d="M15 16 L12 7 Q18 9 21 14Z" fill="${PINK}"/>
<circle cx="24" cy="30" r="17" fill="${FUR}"/>
<path d="M25 14 L24 19 M30 15 L28 20" fill="none" stroke="${FURD}" stroke-width="2.6" stroke-linecap="round"/>
<ellipse cx="13" cy="35" rx="8" ry="6" fill="${WHITE}"/>
<path d="M5 31 Q8 29 11 31 Q9.5 34.5 8 34.5 Q6 34 5 31Z" fill="${NOSE}"/>
<g class="blink"><ellipse cx="19" cy="27" rx="3.6" ry="4.8" fill="${INK}"/><circle cx="20.2" cy="25" r="1.4" fill="#fff"/></g>
<ellipse cx="21" cy="37" rx="4" ry="2.5" fill="${PINK}" opacity="0.55"/>
<path d="M10 36 L0 34 M10 38 L0 39" fill="none" stroke="${WHITE}" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>`
}

function catWalk(): string {
  return `<ellipse cx="62" cy="70" rx="42" ry="5" fill="#000" opacity="0.2"/>
<g class="tail"><path d="M96 40 C116 34 120 14 108 6" fill="none" stroke="${FUR}" stroke-width="9" stroke-linecap="round"/><circle cx="108" cy="6" r="4.8" fill="${FURD}"/></g>
${leg(48, FURD, 'lb')}${leg(72, FURD, 'la')}
<g class="bob">${sideBody()}</g>
${leg(34, WHITE, 'la')}${leg(82, FUR, 'lb')}`
}

// Reared up against the wall on the left of its own frame, front paws scratching.
function catClimb(): string {
  return `<g class="tail"><path d="M52 54 C68 60 74 42 64 30" fill="none" stroke="${FUR}" stroke-width="9" stroke-linecap="round"/><circle cx="64" cy="30" r="4.8" fill="${FURD}"/></g>
<g><rect x="26" y="46" width="9" height="22" rx="4.5" fill="${FURD}"/><ellipse cx="30.5" cy="67" rx="6" ry="3.6" fill="${WHITE}"/></g>
<g transform="translate(-48 0) rotate(68 80 50)">${sideBody()}</g>
<g><rect x="38" y="46" width="9" height="22" rx="4.5" fill="${FUR}"/><ellipse cx="42.5" cy="67" rx="6" ry="3.6" fill="${WHITE}"/></g>
<g class="sc1"><path d="M30 14 L7 -2" fill="none" stroke="${WHITE}" stroke-width="8" stroke-linecap="round"/><circle cx="6" cy="-3" r="5" fill="${WHITE}"/></g>
<g class="sc2"><path d="M34 24 L8 10" fill="none" stroke="${WHITE}" stroke-width="8" stroke-linecap="round"/><circle cx="7" cy="9" r="5" fill="${WHITE}"/></g>`
}

// ---------- the walk loop: one long timeline of walking, bonking, turning and climbing ----------
const LOOP = 150 // seconds
const BOX = 150 // the cat's drawn width
const WALL_L = 250 // left edge of the cat when its nose is on the stone wall

type Stop = { t: number; x: number; y?: number; f: 1 | -1; ease?: string }

// WALL_R: left edge of the cat when its nose is on the trunk
const stops = (WALL_R: number): Stop[] => [
  { t: 0, x: WALL_L, f: 1 },
  { t: 3, x: WALL_L, f: 1 },
  { t: 31, x: WALL_R, f: 1 },
  { t: 31.4, x: WALL_R + 5, f: 1 }, { t: 31.8, x: WALL_R - 4, f: 1 }, { t: 32.2, x: WALL_R + 5, f: 1 }, { t: 33, x: WALL_R, f: 1 },
  { t: 33.6, x: WALL_R, f: -1 },
  { t: 61.6, x: WALL_L, f: -1 },
  { t: 62, x: WALL_L - 5, f: -1 }, { t: 62.4, x: WALL_L + 4, f: -1 }, { t: 62.8, x: WALL_L - 5, f: -1 }, { t: 63.6, x: WALL_L, f: -1 },
  { t: 64.2, x: WALL_L, f: 1 },
  { t: 92.2, x: WALL_R, f: 1 },
  { t: 98, x: WALL_R, y: 0, f: 1, ease: 'ease-in-out' },
  { t: 104, x: WALL_R, y: -110, f: 1 },
  { t: 105, x: WALL_R, y: -110, f: 1, ease: 'cubic-bezier(.55,0,.9,.6)' },
  { t: 106.2, x: WALL_R, y: 0, f: 1 },
  { t: 113, x: WALL_R, y: 0, f: 1 },
  { t: 113.6, x: WALL_R, y: 0, f: -1 },
  { t: 141.6, x: WALL_L, f: -1 },
  { t: 142, x: WALL_L - 5, f: -1 }, { t: 142.4, x: WALL_L + 4, f: -1 }, { t: 142.8, x: WALL_L - 5, f: -1 }, { t: 143.6, x: WALL_L, f: -1 },
  { t: 144.2, x: WALL_L, f: 1 },
  { t: 150, x: WALL_L, f: 1 },
]

// 's' sitting and resting, 'w' walking, 'c' reared up on the wall
const POSES: [number, 's' | 'w' | 'c'][] = [[0, 's'], [3, 'w'], [94, 'c'], [106.5, 's'], [112, 'w'], [144.5, 's']]

const pct = (t: number) => ((t / LOOP) * 100).toFixed(4)

function loopCss(rx: number): string {
  const frames = stops(1102 + rx).map(st => {
    const y = st.y ?? 0
    const tf = st.f === 1 ? `translate(${st.x + BOX}px,${y}px) scale(-1,1)` : `translate(${st.x}px,${y}px) scale(1,1)`
    return `${pct(st.t)}%{transform:${tf};${st.ease ? `animation-timing-function:${st.ease}` : ''}}`
  }).join('')
  let css = `.cx,.pw,.pc,.ps{animation-duration:${LOOP}s;animation-iteration-count:infinite;animation-timing-function:linear}
.cx{animation-name:cx}
@keyframes cx{${frames}}
.pw,.pc,.ps{opacity:0}`
  for (const p of ['w', 'c', 's'] as const) {
    let kf = ''
    POSES.forEach(([t, name], i) => {
      const v = name === p ? 1 : 0
      const end = POSES[i + 1]?.[0] ?? LOOP
      kf += `${pct(t)}%{opacity:${v}}${pct(Math.max(t, end - 0.02))}%{opacity:${v}}`
    })
    css += `.p${p}{animation-name:o${p}}@keyframes o${p}{${kf}}`
  }
  css += `.sc1{animation:scA .5s ease-in-out infinite alternate}.sc2{animation:scA .5s ease-in-out infinite alternate-reverse}
@keyframes scA{from{transform:translateY(-5px)}to{transform:translateY(5px)}}
.swing{transform-box:fill-box;transform-origin:50% 0%;animation:swg 5.5s ease-in-out infinite}
@keyframes swg{0%,100%{transform:rotate(-2.2deg)}50%{transform:rotate(2.2deg)}}
.dang{transform-box:fill-box;transform-origin:50% 0%;animation:dg 4s ease-in-out infinite}
@keyframes dg{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(7deg)}}
.lamp{opacity:.8;animation:lp 6s ease-in-out infinite}
@keyframes lp{0%,100%{opacity:.7}50%{opacity:.95}}`
  return css
}

function catLoop(offsetSec: number): string {
  const d = `style="animation-delay:-${offsetSec.toFixed(2)}s"`
  return `<g class="cx" ${d}>
<g class="pw" ${d}><g transform="translate(0 650) scale(1.25)">${catWalk()}</g></g>
<g class="pc" ${d}><g transform="translate(0 650) scale(1.25)">${catClimb()}</g></g>
<g class="ps" ${d}><g transform="translate(12 588) scale(1.25)">${catSit(false)}</g></g>
</g>`
}

// ---------- the whole scene ----------
const CSS = `
.t1,.t2{transform-box:view-box;transform-origin:1100px 0px}
.t1{animation:sw1 12s ease-in-out infinite}
.t2{animation:sw2 9s ease-in-out infinite}
.w .t1{animation:sw1w 14s ease-in-out infinite}
.w .t2{animation:sw2w 11s ease-in-out infinite}
@keyframes sw1{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.4deg)}}
@keyframes sw2{0%,100%{transform:rotate(1deg)}50%{transform:rotate(-1.4deg)}}
@keyframes sw1w{0%,100%{transform:rotate(-1deg)}12%{transform:rotate(-5deg)}30%{transform:rotate(1.5deg)}50%{transform:rotate(-3.5deg)}70%{transform:rotate(0.5deg)}}
@keyframes sw2w{0%,100%{transform:rotate(1deg)}12%{transform:rotate(4deg)}30%{transform:rotate(-2deg)}50%{transform:rotate(3deg)}70%{transform:rotate(-0.5deg)}}
.p{animation-timing-function:ease-in-out;animation-iteration-count:infinite;opacity:0}
@keyframes di0{0%{transform:translate(0,-30px) rotate(0deg);opacity:0}8%{opacity:.95}85%{opacity:.9}100%{transform:translate(-560px,800px) rotate(420deg);opacity:0}}
@keyframes di1{0%{transform:translate(0,-30px) rotate(0deg);opacity:0}8%{opacity:.95}45%{transform:translate(-150px,330px) rotate(200deg)}85%{opacity:.9}100%{transform:translate(-420px,800px) rotate(380deg);opacity:0}}
@keyframes di2{0%{transform:translate(0,-30px) rotate(0deg);opacity:0}8%{opacity:.95}30%{transform:translate(-210px,230px) rotate(120deg)}60%{transform:translate(-190px,500px) rotate(260deg)}85%{opacity:.9}100%{transform:translate(-620px,800px) rotate(500deg);opacity:0}}
@keyframes di3{0%{transform:translate(0,-30px) rotate(0deg);opacity:0}8%{opacity:.95}85%{opacity:.9}100%{transform:translate(-300px,800px) rotate(300deg);opacity:0}}
@keyframes dw0{0%{transform:translate(0,-30px) rotate(0deg);opacity:0}8%{opacity:.95}85%{opacity:.9}100%{transform:translate(-980px,800px) rotate(700deg);opacity:0}}
@keyframes dw1{0%{transform:translate(0,-30px) rotate(0deg);opacity:0}8%{opacity:.95}45%{transform:translate(-420px,300px) rotate(300deg)}85%{opacity:.9}100%{transform:translate(-1100px,800px) rotate(640deg);opacity:0}}
@keyframes dw2{0%{transform:translate(0,-30px) rotate(0deg);opacity:0}8%{opacity:.95}30%{transform:translate(-380px,180px) rotate(240deg)}60%{transform:translate(-640px,520px) rotate(420deg)}85%{opacity:.9}100%{transform:translate(-1000px,800px) rotate(760deg);opacity:0}}
@keyframes dw3{0%{transform:translate(0,-30px) rotate(0deg);opacity:0}8%{opacity:.95}85%{opacity:.9}100%{transform:translate(-820px,800px) rotate(560deg);opacity:0}}
.wh{opacity:0;animation:wh 14s linear infinite}
@keyframes wh{0%,8%{transform:translate(1500px,0);opacity:0}18%{opacity:.5}34%,100%{transform:translate(-420px,60px);opacity:0}}
.blink{transform-box:fill-box;transform-origin:50% 50%;animation:bl 5s infinite}
@keyframes bl{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(0.1)}}
.tail{transform-box:fill-box;transform-origin:85% 95%;animation:ts 3.4s ease-in-out infinite}
.w .tail{animation-duration:0.9s}
@keyframes ts{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(9deg)}}
.la,.lb{transform-box:fill-box;transform-origin:50% 8%;animation-duration:.6s;animation-timing-function:ease-in-out;animation-iteration-count:infinite;animation-direction:alternate}
.la{animation-name:lgA}
.lb{animation-name:lgB}
@keyframes lgA{from{transform:rotate(-22deg)}to{transform:rotate(22deg)}}
@keyframes lgB{from{transform:rotate(22deg)}to{transform:rotate(-22deg)}}
.bob{animation:bob .6s ease-in-out infinite alternate}
@keyframes bob{from{transform:translateY(0)}to{transform:translateY(-2px)}}
.lick{transform-box:fill-box;transform-origin:50% 100%;animation:lk 3.2s ease-in-out infinite}
@keyframes lk{0%,100%{transform:translate(0,0) rotate(0deg)}30%,70%{transform:translate(-6px,-38px) rotate(-12deg)}}
.nod{transform-box:fill-box;transform-origin:50% 90%;animation:nd 3.2s ease-in-out infinite}
@keyframes nd{0%,100%{transform:rotate(0deg)}30%,70%{transform:rotate(-5deg)}}
.breathe{transform-box:fill-box;transform-origin:50% 100%;animation:br 4s ease-in-out infinite}
@keyframes br{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.05)}}
.z{opacity:0;animation:zz 4s ease-in-out infinite}
@keyframes zz{0%{opacity:0;transform:translate(0,6px)}30%{opacity:.8}100%{opacity:0;transform:translate(6px,-14px)}}
@media (prefers-reduced-motion: reduce){*{animation:none !important}.p,.wh{opacity:0 !important}.z{opacity:.6 !important}}
`

function buildScene(work: boolean, pose: Pose, pct: number, offsetSec: number, vw: number, vh: number, data: SignData): string {
  const rx = vw - 1280
  const dy = vh - 760 // a tall window pushes the ground and the cat down; the sign stays at the top
  const nPetals = 5 + Math.round(pct * 0.25) + (work ? 14 : 0)
  let catSvg: string
  if (work) {
    catSvg = catLoop(offsetSec)
  } else if (pose === 'sleep') {
    catSvg = `<g transform="translate(${800 + rx / 2} 591) scale(1.2)">${catSleep()}</g>`
  } else {
    catSvg = `<g transform="translate(${820 + rx / 2} 579) scale(1.3)">${catSit(pose === 'groom')}</g>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="${work ? 'w' : ''}" viewBox="0 0 1280 760" preserveAspectRatio="xMinYMin meet">
<style>${CSS}${loopCss(rx)}</style>
<defs><radialGradient id="moon" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#d9a8d0" stop-opacity="0.26"/><stop offset="100%" stop-color="#d9a8d0" stop-opacity="0"/></radialGradient></defs>
<g transform="translate(${rx} 0)"><circle cx="1110" cy="150" r="190" fill="url(#moon)"/><g transform="translate(80 0)">${trunk()}</g>${tree()}</g>
<g transform="translate(0 ${dy})">
<path d="M-3000 735 L0 735 C200 722 420 740 640 730 C860 720 1060 738 1280 726 L4000 726 L4000 4000 L-3000 4000Z" fill="#2a2530" opacity="0.85"/>
${leftWall()}
${catSvg}
</g>
<g transform="translate(${rx / 2} 0)">${petals(nPetals, work)}${work ? whooshes() : ''}</g>
${sign(data)}
</svg>`
}

// ---------- the mod ----------
export const register: Register = on => {
  let isWorking = false
  let idleCycle = 0
  let ctxPct = 0
  let fiveHour: number | undefined
  let sevenDay: number | undefined
  let warned80 = false
  let warned95 = false
  let workedMs = 0
  let startedAt: number | undefined

  const LOOK: ThemeSetArgs = { colors: theme, backdrop: { scene: SCENE, glass: { blur: 12, opacity: 0.68 } } }

  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) $.ui.toast(unpainted)

    try {
      const set = await $.theme.set(LOOK)
      if (!set.isDrawn) $.ui.status(set.reason)
    } catch (error) {
      $.ui.log(String(error))
      await $.theme.set({ colors: theme })
    }

    $.ui.status(undefined)
    const usage = await $.session.usage()
    ctxPct = usage.context.percent ?? 0
    fiveHour = usage.rateLimits.find(r => r.kind === 'five_hour')?.percentUsed
    sevenDay = usage.rateLimits.find(r => r.kind === 'seven_day')?.percentUsed

    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) {
      if (startedAt === undefined) startedAt = await $.clock.now()
      isWorking = true
      $.ui.invalidate('ui.render')
    }
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) {
      if (startedAt !== undefined) workedMs += (await $.clock.now()) - startedAt
      startedAt = undefined
      isWorking = false
      idleCycle += 1
      $.ui.invalidate('ui.render')
    }
    return next(e)
  })

  on('session.measure', ($, e, next) => {
    const before = `${ctxPct}|${fiveHour}|${sevenDay}`
    ctxPct = e.context.percent ?? ctxPct
    fiveHour = e.rateLimits.find(r => r.kind === 'five_hour')?.percentUsed
    sevenDay = e.rateLimits.find(r => r.kind === 'seven_day')?.percentUsed

    if (ctxPct >= 95 && !warned95) {
      warned95 = true
      $.ui.toast(`Context window ${ctxPct}% full`)
    } else if (ctxPct >= 80 && !warned80) {
      warned80 = true
      $.ui.toast(`Context window ${ctxPct}% full`)
    } else if (ctxPct < 70) {
      warned80 = false
      warned95 = false
    }

    if (`${ctxPct}|${fiveHour}|${sevenDay}` !== before) $.ui.invalidate('ui.render')
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') return next(e)
    if (e.props.scene !== SCENE) return next(e)

    const { Svg } = $.ui.resolve(e)
    const pose: Pose = IDLE_POSES[idleCycle % IDLE_POSES.length] ?? 'sit'
    const live = isWorking && startedAt !== undefined ? (await $.clock.now()) - startedAt : 0
    const offsetSec = ((workedMs + live) / 1000) % LOOP
    const vw = 1280
    const vh = 760

    return (
      <Svg
        source={buildScene(isWorking, pose, ctxPct, offsetSec, vw, vh, { pct: ctxPct, five: fiveHour, seven: sevenDay })}
        alt={
          isWorking
            ? 'Plum cherry blossom branches in a gust of wind, petals streaming past, a cat walking along the ground'
            : 'Plum cherry blossom branches swaying gently, a cat resting below'
        }
      />
    )
  })
}
