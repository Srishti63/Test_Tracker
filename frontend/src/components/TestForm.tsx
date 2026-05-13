import React,{useState , useEffect} from "react";
import type { CreateTestRecord } from "../types/test";
import { testService } from "../api/testService";

interface Props {
    onTestAdded: () => void
    selectedSubject : string;
}

const TestForm: React.FC<Props> = ({onTestAdded , selectedSubject}) =>{
    const [formData ,setFormData] = useState<CreateTestRecord>({
        subject : selectedSubject === "All" ? ' ': selectedSubject,
        marks_obtained : 0,
        total_marks : 100,
        test_date : new Date().toISOString()
    })

    const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
        const submitData = {
            ...formData,
            test_date: new Date(formData.test_date).toISOString() 
        }
        await testService.createTest(submitData);
        setFormData({
            subject: '',
            marks_obtained: 0,
            total_marks: 100,
            test_date: new Date().toISOString().split('T')[0]
        })
        onTestAdded();
    } catch (err) {
        console.error(err);
    }
}
    useEffect(() => {
    if(selectedSubject !== "All") {
        setFormData(prev => ({...prev, subject: selectedSubject}))
    } else {
        setFormData(prev => ({...prev, subject: ''}))
    }
}, [selectedSubject])  

return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
    <input
      type="text"
      required
      placeholder="Subject Name"
      value={formData.subject}
      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      onChange={e => setFormData({...formData, subject: e.target.value})}
    />
    <input
      type="number"
      required
      placeholder="Marks Obtained"
      value={formData.marks_obtained || ''}
      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      onChange={e => setFormData({...formData, marks_obtained: Number(e.target.value)})}
    />
    <input
      type="number"
      required
      placeholder="Total Marks"
      value={formData.total_marks || ''}
      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      onChange={e => setFormData({...formData, total_marks: Number(e.target.value)})}
    />
    <input
      type="date"
      required
      value={formData.test_date}
      className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      onChange={e => setFormData({...formData, test_date: e.target.value})}
    />
    <button
      type="submit"
      disabled={!formData.subject}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors"
    >
      Add Test Result
    </button>
  </form>
);
};

export default TestForm;