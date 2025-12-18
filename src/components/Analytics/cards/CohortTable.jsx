import { useState } from 'react';
import { BlockStack, InlineStack, Button } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const CohortTable = () => {
    const [cohortType, setCohortType] = useState('lead');
    const leadCohorts = [
        { cohort: 'All cohorts', customers: '1,285', retention: '28%', months: ['75%', '65%', '52%', '45%', '38%', '32%', '28%', '24%', '20%', '18%', '15%', '12%'], isHeader: true },
        { cohort: 'Dec 2024', customers: '125', retention: '32%', months: ['80%', '70%', '60%', '50%', '42%', '38%', '35%', '32%', '30%', '28%', '25%', '32%'] },
        { cohort: 'Jan 2025', customers: '98', retention: '28%', months: ['78%', '68%', '58%', '48%', '40%', '35%', '32%', '30%', '28%', '26%', '28%', ''] },
        { cohort: 'Feb 2025', customers: '112', retention: '30%', months: ['82%', '72%', '62%', '52%', '44%', '38%', '34%', '32%', '30%', '30%', '', ''] },
        { cohort: 'Mar 2025', customers: '143', retention: '25%', months: ['76%', '66%', '56%', '46%', '38%', '32%', '28%', '26%', '25%', '', '', ''] },
        { cohort: 'Apr 2025', customers: '89', retention: '22%', months: ['74%', '64%', '54%', '44%', '36%', '30%', '26%', '22%', '', '', '', ''] },
        { cohort: 'May 2025', customers: '156', retention: '35%', months: ['85%', '75%', '65%', '55%', '48%', '42%', '35%', '', '', '', '', ''] },
        { cohort: 'Jun 2025', customers: '134', retention: '30%', months: ['80%', '70%', '60%', '50%', '42%', '30%', '', '', '', '', '', ''] },
        { cohort: 'Jul 2025', customers: '167', retention: '28%', months: ['78%', '68%', '58%', '48%', '28%', '', '', '', '', '', '', ''] },
        { cohort: 'Aug 2025', customers: '145', retention: '26%', months: ['76%', '66%', '56%', '26%', '', '', '', '', '', '', '', ''] },
        { cohort: 'Sep 2025', customers: '178', retention: '24%', months: ['74%', '64%', '24%', '', '', '', '', '', '', '', '', ''] },
        { cohort: 'Oct 2025', customers: '192', retention: '22%', months: ['72%', '22%', '', '', '', '', '', '', '', '', '', ''] },
        { cohort: 'Nov 2025', customers: '206', retention: '18%', months: ['18%', '', '', '', '', '', '', '', '', '', '', ''] },
    ];
    
    const occupancyCohorts = [
        { cohort: 'All months', customers: 'AED 8,500', retention: 'AED 425K', months: ['85%', '82%', '78%', '75%', '72%', '70%', '68%', '65%', '63%', '60%', '58%', '55%'], isHeader: true },
        { cohort: 'Dec 2024', customers: 'AED 8,200', retention: 'AED 410K', months: ['88%', '85%', '82%', '80%', '78%', '75%', '72%', '70%', '68%', '65%', '63%', '60%'] },
        { cohort: 'Jan 2025', customers: 'AED 8,800', retention: 'AED 440K', months: ['90%', '87%', '84%', '82%', '80%', '78%', '75%', '73%', '70%', '68%', '65%', ''] },
        { cohort: 'Feb 2025', customers: 'AED 9,200', retention: 'AED 460K', months: ['92%', '89%', '86%', '84%', '82%', '80%', '78%', '75%', '73%', '70%', '', ''] },
        { cohort: 'Mar 2025', customers: 'AED 8,600', retention: 'AED 430K', months: ['86%', '83%', '80%', '78%', '75%', '73%', '70%', '68%', '65%', '', '', ''] },
        { cohort: 'Apr 2025', customers: 'AED 8,400', retention: 'AED 420K', months: ['84%', '81%', '78%', '76%', '73%', '70%', '68%', '65%', '', '', '', ''] },
        { cohort: 'May 2025', customers: 'AED 9,000', retention: 'AED 450K', months: ['90%', '87%', '84%', '82%', '80%', '78%', '75%', '', '', '', '', ''] },
        { cohort: 'Jun 2025', customers: 'AED 8,700', retention: 'AED 435K', months: ['87%', '84%', '82%', '80%', '78%', '75%', '', '', '', '', '', ''] },
        { cohort: 'Jul 2025', customers: 'AED 8,500', retention: 'AED 425K', months: ['85%', '82%', '80%', '78%', '75%', '', '', '', '', '', '', ''] },
        { cohort: 'Aug 2025', customers: 'AED 8,300', retention: 'AED 415K', months: ['83%', '80%', '78%', '75%', '', '', '', '', '', '', '', ''] },
        { cohort: 'Sep 2025', customers: 'AED 8,600', retention: 'AED 430K', months: ['86%', '84%', '82%', '', '', '', '', '', '', '', '', ''] },
        { cohort: 'Oct 2025', customers: 'AED 8,900', retention: 'AED 445K', months: ['89%', '87%', '', '', '', '', '', '', '', '', '', ''] },
        { cohort: 'Nov 2025', customers: 'AED 9,100', retention: 'AED 455K', months: ['91%', '', '', '', '', '', '', '', '', '', '', ''] },
    ];

    const cohorts = cohortType === 'lead' ? leadCohorts : occupancyCohorts;
    const monthHeaders = cohortType === 'lead' 
        ? ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11']
        : ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11'];
    const col2Header = cohortType === 'lead' ? 'Leads Created' : 'ADR';
    const col3Header = cohortType === 'lead' ? 'Conversion rate' : 'RevPAR';

    const getHeatmapColor = (value) => {
        if (!value) return { bg: 'transparent', text: '#6d7175' };
        const num = parseFloat(value);
        if (num >= 80) return { bg: '#1e40af', text: 'white' };
        if (num >= 70) return { bg: '#3b82f6', text: 'white' };
        if (num >= 60) return { bg: '#60a5fa', text: 'white' };
        if (num >= 50) return { bg: '#93c5fd', text: '#1e3a5f' };
        if (num >= 40) return { bg: '#bfdbfe', text: '#1e3a5f' };
        if (num > 0) return { bg: '#dbeafe', text: '#1e3a5f' };
        return { bg: 'transparent', text: '#6d7175' };
    };

    return (
        <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="center">
                <ChartHeading title={cohortType === 'lead' ? 'Lead Cohort Retention / Follow-up Quality' : 'Occupancy Cohort (Short-Term Stays)'} />
                <Button
                    size="slim"
                    onClick={() => setCohortType(cohortType === 'lead' ? 'occupancy' : 'lead')}
                >
                    Switch to {cohortType === 'lead' ? 'Occupancy Cohort' : 'Lead Cohort'}
                </Button>
            </InlineStack>
            <div style={{ overflowX: 'auto', maxHeight: '370px', overflowY: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: '12px', minWidth: '1100px' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '100px', whiteSpace: 'nowrap', position: 'sticky', left: 0, background: 'white' }}>Cohort</th>
                            <th style={{ textAlign: 'right', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '90px', whiteSpace: 'nowrap' }}>{col2Header}</th>
                            <th style={{ textAlign: 'right', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '110px', whiteSpace: 'nowrap' }}>{col3Header}</th>
                            {monthHeaders.map((month, i) => (
                                <th key={i} style={{ textAlign: 'center', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '75px', whiteSpace: 'nowrap' }}>{month}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {cohorts.map((row, index) => (
                            <tr key={index} style={{ background: row.isHeader ? '#f3f3f3' : 'transparent' }}>
                                <td style={{ padding: '8px 12px', borderBottom: '1px solid #f3f3f3', fontWeight: row.isHeader ? 600 : 400, whiteSpace: 'nowrap', position: 'sticky', left: 0, background: row.isHeader ? '#f3f3f3' : 'white' }}>{row.cohort}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #f3f3f3', fontWeight: row.isHeader ? 600 : 400, whiteSpace: 'nowrap' }}>{row.customers}</td>
                                <td style={{ padding: '8px 12px', textAlign: 'right', borderBottom: '1px solid #f3f3f3', fontWeight: row.isHeader ? 600 : 400, whiteSpace: 'nowrap' }}>{row.retention}</td>
                                {row.months.map((month, mIndex) => {
                                    const colors = getHeatmapColor(month);
                                    return (
                                        <td key={mIndex} style={{ padding: '8px 12px', textAlign: 'center', background: colors.bg, color: colors.text, borderBottom: '1px solid #f3f3f3', fontWeight: row.isHeader ? 600 : 400, whiteSpace: 'nowrap' }}>{month}</td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </BlockStack>
    );
};

export default CohortTable;

