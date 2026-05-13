import api from "../utils/api";
import type  {TestRecord, CreateTestRecord } from "../types/test";




   export const testService = {
    getTests : async() : Promise<TestRecord[]> => {
        const response = await api.get("/api/tests");
        
        console.log("Axios full response body:", response.data);


        const actualData = response.data.data || response.data;

        return Array.isArray(actualData) ? actualData : [];
    },

    createTest : async(TestData : CreateTestRecord): Promise<TestRecord> =>{
        const response = await api.post("/api/tests",TestData)
        console.log("response", response.data);
        return response.data.data;
    },

    deleteTest : async(id:number): Promise<void> => {
        await api.delete(`/api/tests/${id}`)
    },

    deleteBySubject : async(subject: string): Promise<void> =>{
        await api.delete(`/api/tests/subject/${subject}`)
    }
}

