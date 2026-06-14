
interface FlowerProps {
    color: string;
    size: number;
    rotate: number;
    centerColor?: string;
}

function Flower({ color, size, rotate, centerColor = "#facc15" }: FlowerProps) {
    const petalCount = 5;
    const c = size / 2;
    const petalLen = size * 0.38;
    const petalW = size * 0.18;
    const centerR = size * 0.16;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: `rotate(${rotate}deg)`, display: 'block' }}>
            {Array.from({ length: petalCount }).map((_, i) => {
                const angle = (i / petalCount) * 360;
                return (
                    <ellipse
                        key={i}
                        cx={c}
                        cy={c - petalLen * 0.48}
                        rx={petalW}
                        ry={petalLen * 0.6}
                        fill={color}
                        opacity={0.9}
                        transform={`rotate(${angle}, ${c}, ${c})`}
                    />
                );
            })}
            <circle cx={c} cy={c} r={centerR * 0.65} fill={centerColor} />
        </svg>
    );
}

interface FlowerPanelProps {
    side: 'left' | 'right';
    top?: number;
}

const LEFT_FLOWERS: { top: number; color: string; size: number; rotate: number; centerColor?: string; offset: number }[] = [
    { top: 0,   offset: 30,  color: "#fbbf24", size: 46, rotate: 15,  centerColor: "#fef9c3" },
    { top: 120, offset: 70,  color: "#fef08a", size: 40, rotate: -10 },
    { top: 230, offset: 20,  color: "#fde047", size: 48, rotate: 35 },
    { top: 360, offset: 55,  color: "#fbbf24", size: 38, rotate: -20, centerColor: "#fef9c3" },
    { top: 470, offset: 15,  color: "#fef08a", size: 44, rotate: 10 },
    { top: 580, offset: 60,  color: "#fde047", size: 36, rotate: 50 },
    { top: 690, offset: 25,  color: "#fbbf24", size: 42, rotate: -5,  centerColor: "#fef9c3" },
];

const RIGHT_FLOWERS: { top: number; color: string; size: number; rotate: number; centerColor?: string; offset: number }[] = [
    { top: 0,   offset: 30,  color: "#fef08a", size: 40, rotate: -10 },
    { top: 110, offset: 15,  color: "#fde047", size: 48, rotate: 35 },
    { top: 240, offset: 50,  color: "#fbbf24", size: 44, rotate: 20,  centerColor: "#fef9c3" },
    { top: 350, offset: 20,  color: "#fef08a", size: 36, rotate: -30 },
    { top: 460, offset: 45,  color: "#fde047", size: 46, rotate: 15 },
    { top: 580, offset: 10,  color: "#fbbf24", size: 40, rotate: -15, centerColor: "#fef9c3" },
    { top: 700, offset: 40,  color: "#fef08a", size: 38, rotate: 40 },
];

export function FlowerPanel({ side, top = 0 }: FlowerPanelProps) {
    const flowers = side === 'left' ? LEFT_FLOWERS : RIGHT_FLOWERS;

    return (
        <div style={{ position: 'fixed', top, [side]: 0, width: 120, pointerEvents: 'none', zIndex: 0 }}>
            {flowers.map((f, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        top: f.top,
                        [side]: f.offset,
                    }}
                >
                    <Flower color={f.color} size={f.size} rotate={f.rotate} centerColor={f.centerColor} />
                </div>
            ))}
        </div>
    );
}

export default Flower;
