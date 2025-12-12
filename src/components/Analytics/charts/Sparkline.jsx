const Sparkline = ({ data, color = '#12acf0', dashed = false, width: propWidth, height: propHeight }) => {
    const width = propWidth || 80;
    const height = propHeight || 28;
    const points = data || [1, 3, 1, 2, 5, 2, 1, 4, 6, 3, 2, 8, 4, 2];
    const max = Math.max(...points) || 1;
    const baseline = height - 2;
    const maxBumpHeight = height - 6;

    const getY = (point) => baseline - (point / max) * maxBumpHeight;

    let pathData = '';

    for (let i = 0; i < points.length; i++) {
        const x = (i / (points.length - 1)) * width;
        const y = getY(points[i]);

        if (i === 0) {
            pathData = `M ${x} ${y}`;
        } else {
            const prevX = ((i - 1) / (points.length - 1)) * width;
            const prevY = getY(points[i - 1]);
            const cpx = (prevX + x) / 2;
            pathData += ` C ${cpx} ${prevY}, ${cpx} ${y}, ${x} ${y}`;
        }
    }

    return (
        <svg width={width} height={height} style={{ display: 'block' }}>
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={dashed ? "4 2" : "none"}
            />
        </svg>
    );
};

export const DualSparkline = ({ data1, data2, color1 = '#12acf0', color2 = '#c4c4c4' }) => {
    const width = 80;
    const height = 28;
    const baseline = height - 2;
    const maxBumpHeight = height - 6;

    const allPoints = [...(data1 || []), ...(data2 || [])];
    const max = Math.max(...allPoints) || 1;

    const createPath = (data) => {
        const getY = (point) => baseline - (point / max) * maxBumpHeight;

        let pathData = '';

        for (let i = 0; i < data.length; i++) {
            const x = (i / (data.length - 1)) * width;
            const y = getY(data[i]);

            if (i === 0) {
                pathData = `M ${x} ${y}`;
            } else {
                const prevX = ((i - 1) / (data.length - 1)) * width;
                const prevY = getY(data[i - 1]);
                const cpx = (prevX + x) / 2;
                pathData += ` C ${cpx} ${prevY}, ${cpx} ${y}, ${x} ${y}`;
            }
        }

        return pathData;
    };

    return (
        <svg width={width} height={height} style={{ display: 'block' }}>
            <path
                d={createPath(data2 || [1, 1, 2, 1, 2, 3, 1, 2, 3, 1, 2, 4, 2, 1])}
                fill="none"
                stroke={color2}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="3 2"
            />
            <path
                d={createPath(data1 || [1, 2, 1, 1, 4, 2, 1, 3, 5, 2, 1, 6, 3, 2])}
                fill="none"
                stroke={color1}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default Sparkline;

