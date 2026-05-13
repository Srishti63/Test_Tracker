import { LineChart , Line , XAxis,YAxis, CartesianGrid ,Tooltip, ResponsiveContainer} from "recharts";
import type { TestRecord } from "../types/test";

interface Props{
    data: TestRecord[];
}

const PerformanceChart = ({data} : Props) =>{
    const chartData = data.map(test =>({
        date : new Date(test.test_date).toLocaleDateString(),
        percentage: test.percentage,
        subject: test.subject
    }));

    return (
  <div className="w-full h-80">
    <h3 className="text-lg font-semibold text-slate-700 mb-4">Performance Over Time (%)</h3>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="percentage" stroke="#2563eb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
};

export default PerformanceChart;