export interface TestRecord{
	id?: number;
	subject: string;
	marks_obtained: number;
	total_marks: number;
	percentage?: number;
	test_date: string;
	created_at?: string
}

export interface CreateTestRecord{
	subject:string;
	marks_obtained:number;
	total_marks:number;
	test_date:string;
}