import { useState, useEffect } from "react";
import { testService } from "../api/testService.ts";
import type { TestRecord } from "../types/test.ts";
import TestForm from "../components/TestForm.tsx";
import PerformanceChart from "../components/performanceChart.tsx";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

function Dashboard() {
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("All");

  const subjects = ["All", ...new Set(tests.map((t) => t.subject))];

  const filterData =
    selectedSubject === "All"
      ? tests
      : tests.filter((t) => t.subject === selectedSubject);
      useEffect(() => {
    loadData();
}, []);

  const heatmapData = Object.entries(
    tests.reduce((acc,t)=>{
      const date = new Date(t.test_date).toISOString().split("T")[0];
      if(!acc[date]){
        acc[date] = {total:0 , count:0};
      }
      acc[date].total += t.percentage;
      acc[date].count++;
      return acc;
    },{} as Record<string, {total: number, count: number}>)
  ).map(([date, val])=> {
    return{
     date,
     count: Math.ceil((val.total / val.count) / 25)
    }
  })

  const loadData = async () => {
    console.log("1. Fetching data...");
    try {
      setLoading(true);
      const data = await testService.getTests();
      console.log("2. data still fetciing");
      setTests(data);
    } catch (err) {
      console.log("Falied to fetch the tests");
    } finally {
      console.log("4. Turning loading OFF");
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (subject: string) =>{
    if(!confirm(`Do you want to delete all entries for ${subject}?`)){
      return
    }
    await testService.deleteBySubject(subject);
    setSelectedSubject("All");
    loadData()
  };

  const handleDelete = async (id:number) =>{
    if(!confirm("Do you want to delete the test?")){
      return
    }
    await testService.deleteTest(id)
    loadData()
  }
    useEffect(() => {
    loadData();
}, []);

  if(loading){
    return <div className="min-h-screen flex items-center justify-center text-slate-500 text-lg">
      Fetching kali's record.. 
    </div>
  };

  return (
  <div className="min-h-screen bg-slate-50">
    {/* Header */}
    <div className="bg-white border-b border-slate-200 px-6 py-4 mb-6">
      <h1 className="text-2xl font-extrabold text-center bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
        KALI'S TEST TRACKER
      </h1>
    </div>

    <div className="max-w-7xl mx-auto px-6 pb-10">
      {/* Top Row — Filter + Form */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        
        {/* Left — Filter + Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 w-full lg:w-80 shrink-0">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4">
            Add Test
          </h2>
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Filter by Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {subjects.map((s) => (
                <option value={s} key={s}>{s}</option>
              ))}
            </select>
          </div>
          <TestForm onTestAdded={loadData} selectedSubject={selectedSubject}/>
         {selectedSubject !== "All" && (
  <div className="mt-6">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-semibold text-slate-600">{selectedSubject}</h3>
      <button
        onClick={() => handleDeleteSubject(selectedSubject)}
        className="text-xs text-red-500 hover:text-red-700 font-medium"
      >
        Delete Subject
      </button>
    </div>
    <div className="flex flex-col gap-2">
      {filterData.map((t) => (
        <div key={t.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 text-xs">
          <span className="text-slate-700 font-medium">{t.marks_obtained}/{t.total_marks}</span>
          <span className="text-slate-500">{t.percentage?.toFixed(1)}%</span>
          <span className="text-slate-400">
            {new Date(t.test_date).toLocaleDateString()}
          </span>
          <button
            onClick={() => handleDelete(t.id!)}
            className="text-red-400 hover:text-red-600 ml-2"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)}
        </div>

        {/* Right — Chart Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-1">
          <PerformanceChart data={filterData} />
        </div>
      </div>

      {/* Bottom — Heatmap Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
          Activity Heatmap
        </h3>
        <CalendarHeatmap
          startDate={new Date('2026-01-01')}
          endDate={new Date('2026-12-31')}
          values={heatmapData}
          classForValue={(value: any) =>
            value ? `color-scale-${value.count}` : "color-empty"
          }
        />
      </div>
    </div>
  </div>
)
  };

export default Dashboard;
