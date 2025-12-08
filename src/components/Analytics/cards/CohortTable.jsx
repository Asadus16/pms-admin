import { BlockStack } from '@shopify/polaris';
import ChartHeading from '../ChartHeading';

const CohortTable = () => {
    const cohorts = [
        { cohort: 'All cohorts', customers: '4,053', retention: '6.3%', months: ['6.9%', '6.1%', '4.5%', '2.9%', '3.9%', '2.8%', '2.1%', '1.5%', '1.2%', '0.9%', '0.6%', '0.4%'], isHeader: true },
        { cohort: 'Dec 2024', customers: '48', retention: '6.3%', months: ['4.2%', '12.5%', '10.4%', '8.3%', '6.3%', '4.2%', '2.1%', '2.1%', '2.1%', '2.1%', '2.1%', '6.3%'] },
        { cohort: 'Jan 2025', customers: '128', retention: '3.1%', months: ['9.4%', '8.6%', '10.9%', '3.9%', '8.6%', '5.5%', '3.1%', '2.3%', '1.6%', '0.8%', '3.1%', ''] },
        { cohort: 'Feb 2025', customers: '83', retention: '2.4%', months: ['6.0%', '13.3%', '6.0%', '9.6%', '9.6%', '4.8%', '2.4%', '1.2%', '1.2%', '2.4%', '', ''] },
        { cohort: 'Mar 2025', customers: '373', retention: '1.9%', months: ['9.9%', '4.6%', '7.2%', '3.5%', '6.7%', '3.2%', '2.4%', '1.9%', '1.9%', '', '', ''] },
        { cohort: 'Apr 2025', customers: '115', retention: '0.0%', months: ['7.8%', '4.3%', '2.6%', '0.9%', '0.9%', '0.0%', '0.0%', '0.0%', '', '', '', ''] },
        { cohort: 'May 2025', customers: '180', retention: '2.2%', months: ['11.1%', '10.0%', '9.4%', '4.4%', '2.8%', '2.2%', '2.2%', '', '', '', '', ''] },
        { cohort: 'Jun 2025', customers: '135', retention: '1.5%', months: ['8.1%', '14.1%', '6.7%', '3.7%', '1.5%', '1.5%', '', '', '', '', '', ''] },
        { cohort: 'Jul 2025', customers: '599', retention: '1.7%', months: ['8.5%', '7.7%', '3.5%', '1.2%', '1.7%', '', '', '', '', '', '', ''] },
        { cohort: 'Aug 2025', customers: '412', retention: '1.5%', months: ['7.3%', '5.8%', '2.7%', '1.5%', '', '', '', '', '', '', '', ''] },
        { cohort: 'Sep 2025', customers: '523', retention: '1.3%', months: ['6.5%', '4.2%', '1.3%', '', '', '', '', '', '', '', '', ''] },
        { cohort: 'Oct 2025', customers: '687', retention: '0.9%', months: ['5.1%', '0.9%', '', '', '', '', '', '', '', '', '', ''] },
        { cohort: 'Nov 2025', customers: '722', retention: '0.4%', months: ['0.4%', '', '', '', '', '', '', '', '', '', '', ''] },
    ];

    const monthHeaders = ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6', 'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11'];

    const getHeatmapColor = (value) => {
        if (!value) return { bg: 'transparent', text: '#6d7175' };
        const num = parseFloat(value);
        if (num >= 12) return { bg: '#1e40af', text: 'white' };
        if (num >= 9) return { bg: '#3b82f6', text: 'white' };
        if (num >= 6) return { bg: '#60a5fa', text: 'white' };
        if (num >= 3) return { bg: '#93c5fd', text: '#1e3a5f' };
        if (num > 0) return { bg: '#dbeafe', text: '#1e3a5f' };
        return { bg: 'transparent', text: '#6d7175' };
    };

    return (
        <BlockStack gap="300">
            <ChartHeading title="Customer cohort analysis" />
            <div style={{ overflowX: 'auto', maxHeight: '370px', overflowY: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: '12px', minWidth: '1100px' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '100px', whiteSpace: 'nowrap', position: 'sticky', left: 0, background: 'white' }}>Cohort</th>
                            <th style={{ textAlign: 'right', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '90px', whiteSpace: 'nowrap' }}>Customers</th>
                            <th style={{ textAlign: 'right', padding: '8px 12px', color: '#6b7280', fontWeight: 500, borderBottom: '1px solid #e5e7eb', minWidth: '110px', whiteSpace: 'nowrap' }}>Retention rate</th>
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

