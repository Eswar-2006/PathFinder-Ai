import React, { useEffect, useRef, useState } from 'react';

interface MermaidChartProps {
    chart: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart }) => {
    const [svg, setSvg] = useState<string>('');
    const [hasError, setHasError] = useState<boolean>(false);
    const id = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);

    useEffect(() => {
        let isMounted = true;
        const renderChart = async () => {
            if ((window as any).mermaid) {
                try {
                    (window as any).mermaid.initialize({
                        startOnLoad: false,
                        theme: 'dark',
                        securityLevel: 'loose'
                    });
                    const { svg: renderedSvg } = await (window as any).mermaid.render(id.current, chart);
                    if (isMounted) {
                        setSvg(renderedSvg);
                        setHasError(false);
                    }
                } catch (err) {
                    console.warn("Mermaid rendering warning:", err);
                    if (isMounted) setHasError(true);
                }
            }
        };

        renderChart();
        return () => {
            isMounted = false;
        };
    }, [chart]);

    if (hasError || !svg) {
        return (
            <div className="my-4 p-4 rounded-xl bg-black/40 border border-purple-500/20 text-xs font-mono text-purple-200 overflow-x-auto whitespace-pre">
                {chart}
            </div>
        );
    }

    return (
        <div 
            className="my-4 p-4 rounded-xl bg-black/30 border border-white/10 flex justify-center overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: svg }} 
        />
    );
};

export default MermaidChart;
