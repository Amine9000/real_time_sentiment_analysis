import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CirclePlus } from 'lucide-react';
import { CircleMinus } from 'lucide-react';
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index ,data}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <text x={x} y={y} fill="white" textAnchor={'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <foreignObject x={x + 10} y={y - 11} width={20} height={20}>
        {data[index].name === 'Positive' ? <CirclePlus size="20" className="text-white"/> : <CircleMinus size="20" className="text-white" />}
      </foreignObject>
    </g>
  );
};

export default function AdminPieChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={800} height={800}>
        <Pie
          dataKey="value"
          startAngle={180}
          endAngle={0}
          data={data}
          cx="50%"
          cy="100%"
          labelLine={false}
          outerRadius={250}
          fill="#8884d8"
          label={(props) => renderCustomizedLabel({ ...props, data })}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
