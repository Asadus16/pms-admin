import '@shopify/polaris/build/esm/styles.css';
import '../src/styles/globals.css';
import '../src/index.css';
import Providers from './providers';

export const metadata = {
    title: 'Shopify Admin Dashboard',
    description: 'Shopify Admin Dashboard',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}


