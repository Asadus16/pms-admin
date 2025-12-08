// Chart tooltip data
export const chartTooltipData = {
    'Gross sales': {
        title: 'Gross sales over time',
        description: 'Rough sales revenue, before discounts and returns are factored in over time',
        formula: null
    },
    'Returning customer rate': {
        title: 'Returning customer rate over time',
        description: 'Percentage of customers who placed an order that were returning customers',
        formula: { left: 'Returning customer rate', right: 'returning customers / customers' }
    },
    'Orders fulfilled': {
        title: 'Orders fulfilled over time',
        description: 'Total orders that have been marked as fulfilled',
        formula: null
    },
    'Orders': {
        title: 'Orders over time',
        description: 'Number of orders across all sales channels',
        formula: null
    },
    'Total sales over time': {
        title: 'Total sales over time',
        description: 'Amount spent (subtotal, taxes, shipping, returns, discounts, fees, etc.)',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Total sales breakdown': {
        title: 'Total sales breakdown',
        description: 'Breakdown of amount spent (subtotal, taxes, shipping, returns, discounts, fees, etc.)',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Total sales by sales channel': {
        title: 'Total sales by sales channel',
        description: 'Total sales, broken down by sales channel',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Average order value over time': {
        title: 'Average order value over time',
        description: 'Average order value, factoring in discounts',
        formula: { left: 'Average order value', right: '(gross sales - discounts) / orders' }
    },
    'Total sales by product': {
        title: 'Total sales by product',
        description: 'Total sales, broken down by product',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Sessions over time': {
        title: 'Sessions over time',
        description: 'Number of user sessions in your online store',
        formula: null
    },
    'Conversion rate over time': {
        title: 'Conversion rate over time',
        description: 'Percentage of online store sessions that result in a sale',
        formula: { left: 'Conversion rate', right: 'sessions that completed checkout / sessions' }
    },
    'Conversion rate breakdown': {
        title: 'Conversion rate breakdown',
        description: 'Breakdown of percentage of online store sessions that result in a sale',
        formula: { left: 'Conversion rate', right: 'sessions that completed checkout / sessions' }
    },
    'Sessions by device type': {
        title: 'Sessions by device type',
        description: 'Sessions in your online store, broken down by the user\'s device type',
        formula: null
    },
    'Sessions by location': {
        title: 'Sessions by location',
        description: 'Sessions in your online store, broken down by geographic location',
        formula: null
    },
    'Total sales by social referrer': {
        title: 'Total sales by social referrer',
        description: 'Total sales from social sources, broken down by name',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Customer cohort analysis': {
        title: 'Customer cohort analysis',
        description: 'Returning purchase rates, with customers grouped by month of first purchase',
        formula: null
    },
    'Sessions by landing page': {
        title: 'Sessions by landing page',
        description: 'Sessions in your online store, broken down by the page the user first landed on',
        formula: null
    },
    'Sessions by social referrer': {
        title: 'Sessions by social referrer',
        description: 'Sessions in your online store from social sources, broken down by name',
        formula: null
    },
    'Total sales by referrer': {
        title: 'Total sales by referrer',
        description: 'Total sales, broken down by the name of the site that led to the order',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Sales attributed to marketing': {
        title: 'Sales attributed to marketing',
        description: 'Sales from trackable marketing efforts',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Sessions by referrer': {
        title: 'Sessions by referrer',
        description: 'Sessions in your online store, broken down by the name of the site that led to the session',
        formula: null
    },
    'Total sales by POS location': {
        title: 'Total sales by POS location',
        description: 'Total sales, broken down by physical store location',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
    'Products by sell-through rate': {
        title: 'Products by sell-through rate',
        description: 'Products, broken down by sell-through rate (how quickly they\'re sold)',
        formula: { left: 'Sell-through rate', right: 'inventory units sold / (inventory units sold + ending inventory units)' }
    },
    'POS staff sales total': {
        title: 'POS staff sales total',
        description: 'Number of sales made by the staff member of your retail location',
        formula: { left: 'Total sales', right: 'net sales + additional fees + duties + shipping charges + taxes' }
    },
};

