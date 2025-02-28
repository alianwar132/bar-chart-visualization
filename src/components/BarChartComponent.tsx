import React, { useEffect, useRef } from 'react';

interface BarChartProps {
  data: { label: string; value: number }[];
}

const BarChartComponent: React.FC<BarChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Create chart group
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${padding.left}, ${padding.top})`);
    svg.appendChild(g);

    // Calculate scales
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;

    // Create axes
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    xAxis.setAttribute('transform', `translate(0, ${chartHeight})`);
    g.appendChild(xAxis);

    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.appendChild(yAxis);

    // Create y-axis line
    const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxisLine.setAttribute('x1', '0');
    yAxisLine.setAttribute('y1', '0');
    yAxisLine.setAttribute('x2', '0');
    yAxisLine.setAttribute('y2', chartHeight);
    yAxisLine.setAttribute('stroke', '#6b7280');
    yAxisLine.setAttribute('stroke-width', '1');
    yAxis.appendChild(yAxisLine);

    // Create x-axis line
    const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxisLine.setAttribute('x1', '0');
    xAxisLine.setAttribute('y1', chartHeight);
    xAxisLine.setAttribute('x2', chartWidth);
    xAxisLine.setAttribute('y2', chartHeight);
    xAxisLine.setAttribute('stroke', '#6b7280');
    xAxisLine.setAttribute('stroke-width', '1');
    xAxis.appendChild(xAxisLine);

    // Create y-axis ticks and labels
    const yTickCount = 5;
    for (let i = 0; i <= yTickCount; i++) {
      const yPos = chartHeight - (i / yTickCount) * chartHeight;
      const value = (i / yTickCount) * maxValue;
      
      // Tick
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', '-5');
      tick.setAttribute('y1', yPos.toString());
      tick.setAttribute('x2', '0');
      tick.setAttribute('y2', yPos.toString());
      tick.setAttribute('stroke', '#6b7280');
      tick.setAttribute('stroke-width', '1');
      yAxis.appendChild(tick);
      
      // Grid line
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', '0');
      gridLine.setAttribute('y1', yPos.toString());
      gridLine.setAttribute('x2', chartWidth);
      gridLine.setAttribute('y2', yPos.toString());
      gridLine.setAttribute('stroke', '#374151');
      gridLine.setAttribute('stroke-width', '1');
      gridLine.setAttribute('stroke-dasharray', '2,2');
      g.appendChild(gridLine);
      
      // Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', '-10');
      label.setAttribute('y', yPos.toString());
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('dominant-baseline', 'middle');
      label.setAttribute('fill', '#9ca3af');
      label.setAttribute('font-size', '12');
      label.textContent = value.toFixed(0);
      yAxis.appendChild(label);
    }

    // Create bars and labels
    data.forEach((d, i) => {
      const x = i * (barWidth + barSpacing) + barSpacing / 2;
      const barHeight = (d.value / maxValue) * chartHeight;
      const y = chartHeight - barHeight;
      
      // Bar
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', x.toString());
      bar.setAttribute('y', chartHeight.toString());
      bar.setAttribute('width', barWidth.toString());
      bar.setAttribute('height', '0');
      bar.setAttribute('fill', `hsl(${210 + i * 15}, 70%, 60%)`);
      bar.setAttribute('rx', '4');
      g.appendChild(bar);
      
      // Animate the bar
      const animation = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animation.setAttribute('attributeName', 'height');
      animation.setAttribute('from', '0');
      animation.setAttribute('to', barHeight.toString());
      animation.setAttribute('dur', '0.5s');
      animation.setAttribute('fill', 'freeze');
      bar.appendChild(animation);
      
      const animation2 = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animation2.setAttribute('attributeName', 'y');
      animation2.setAttribute('from', chartHeight.toString());
      animation2.setAttribute('to', y.toString());
      animation2.setAttribute('dur', '0.5s');
      animation2.setAttribute('fill', 'freeze');
      bar.appendChild(animation2);
      
      // Start animations
      animation.beginElement();
      animation2.beginElement();
      
      // Value label
      const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      valueLabel.setAttribute('x', (x + barWidth / 2).toString());
      valueLabel.setAttribute('y', (y - 5).toString());
      valueLabel.setAttribute('text-anchor', 'middle');
      valueLabel.setAttribute('fill', '#ffffff');
      valueLabel.setAttribute('font-size', '12');
      valueLabel.setAttribute('font-weight', 'bold');
      valueLabel.textContent = d.value.toFixed(1);
      g.appendChild(valueLabel);
      
      // X-axis label
      const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      xLabel.setAttribute('x', (x + barWidth / 2).toString());
      xLabel.setAttribute('y', (chartHeight + 20).toString());
      xLabel.setAttribute('text-anchor', 'middle');
      xLabel.setAttribute('fill', '#9ca3af');
      xLabel.setAttribute('font-size', '12');
      xLabel.textContent = d.label;
      xAxis.appendChild(xLabel);
    });

  }, [data]);

  return (
    <svg 
      ref={svgRef} 
      width="100%" 
      height="100%" 
      className="overflow-visible"
    ></svg>
  );
};

export default BarChartComponent;