import React, { useEffect, useRef } from 'react';

interface MermaidChartProps {
    chart: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && (window as any).mermaid) {
            (window as any).mermaid.init(undefined, ref.current);
        }
    }, [chart]);

    return (
        <div className="mermaid" ref={ref} suppressHydrationWarning>
            {chart}
        </div>
    );
};

export default MermaidChart;
