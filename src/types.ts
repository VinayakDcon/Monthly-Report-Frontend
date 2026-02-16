export interface RFQ {
    RFQ_ID: string;
    Customer: string;
    Received_Date: string;
    Description: string;
    TECHNICAL_OWNERSHIP: string;
    Feasibility_Completed: string;
    Quote_Submitted: string;
    Status: string;
    Outcome: string;
    Converted_Project_ID: string;
    Responsible: string;
}

export interface RFQSummary {
    total_rfqs: number;
    customers: number;
    converted_projects: number;
    conversion_rate: number;
}

export interface FunnelData {
    feasibility: number;
    quote: number;
}

export interface DashboardData {
    summary: RFQSummary;
    status_counts: Record<string, number>;
    closed_won: number;
    funnel: FunnelData;
    top_customers: Record<string, number>;
    table_data: RFQ[];
}

export interface OutlookReportData {
    summary: {
        total_mails: number;
        total_conversations: number;
        start_date: string;
        end_date: string;
    };
    report_data: {
        sendbywho: string;
        sendtowho: string;
        onwhichdatehesend: string;
        whathesend: string;
        whatreplyheget: string;
    }[];
}
