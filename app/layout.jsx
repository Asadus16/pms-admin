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
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .Polaris-Frame__Navigation,
                    .Polaris-Navigation {
                        width: 240px !important;
                        min-width: 240px !important;
                        max-width: 240px !important;
                    }
                    .Polaris-Navigation__ItemWrapper {
                        padding: 0px 12px !important;
                    }
                    .Polaris-Navigation__Item {
                        padding: 0px 4px 0px 8px !important;
                    }
                    .Polaris-Navigation__PrimaryNavigation,
                    .Polaris-Navigation__Section,
                    .Polaris-Navigation__SectionItems {
                        width: 240px !important;
                        max-width: 240px !important;
                    }
                `}} />
            </head>
            <body>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}


