'use client';

import { useState } from 'react';
import { Icon, Button } from '@shopify/polaris';
import {
  MenuHorizontalIcon,
  AppsIcon,
} from '@shopify/polaris-icons';
import './styles/AppsSettings.css';

// Installed apps data
const installedApps = [
  {
    id: '1',
    name: 'Advanced COD',
    description: '$11.99 USD every 30 days',
    icon: '/images/Installedchannels/imgi_7_2d8d7e95e9c424cbc0ba3ca8374ef1ed_200x200.png',
  },
  {
    id: '2',
    name: 'TinySEO',
    description: '$14.00 USD every 30 days + usage fees',
    icon: '/images/Installedchannels/imgi_10_9e850173749ed1fed1175c97237dc3cb_200x200.png',
  },
  {
    id: '3',
    name: 'Online Store',
    description: '',
    icon: '/images/Installedchannels/imgi_11_650f1a14fa979ec5c74d063e968411d4_200x200.png',
  },
  {
    id: '4',
    name: 'Chatway Live Chat & WhatsApp',
    description: '',
    icon: '/images/Installedchannels/imgi_12_17e2a61657104d2ffed4486981037b5b_200x200.png',
  },
  {
    id: '5',
    name: 'YourToken: Loyalty & Rewards',
    description: '',
    icon: '/images/Installedchannels/imgi_13_88a434cd0a80dba18ecb18ab88e55151_200x200.png',
  },
  {
    id: '6',
    name: 'Judge.me Reviews',
    description: '',
    icon: '/images/Installedchannels/imgi_14_8cada0f5da411a64e756606bb036f1ed_200x200.png',
  },
  {
    id: '7',
    name: 'Shiprocket: eCommerce Shipping',
    description: '',
    icon: '/images/Installedchannels/imgi_15_fc14b70f3ba850c4411e17ab2a8833d4_200x200.png',
  },
  {
    id: '8',
    name: 'Google & YouTube',
    description: '',
    icon: '/images/Installedchannels/imgi_16_a78e004f44cded1b6998e7a6e081a230_200x200.png',
  },
  {
    id: '9',
    name: 'Essential Trust Badges',
    description: '',
    icon: '/images/Installedchannels/imgi_17_447aa873cb88a7ec294e5b0963f7f12e_200x200.png',
  },
  {
    id: '10',
    name: 'Point of Sale',
    description: '',
    icon: '/images/Installedchannels/imgi_18_2448d61edfcf9699130b7bc74e3b490c_200x200.png',
  },
  {
    id: '11',
    name: 'TrustShop - Reviews',
    description: '',
    icon: '/images/Installedchannels/imgi_19_97bd740ed0597c4d5220e15ae930308d_200x200.png',
  },
  {
    id: '12',
    name: 'Section Store',
    description: '',
    icon: '/images/Installedchannels/imgi_20_9379d0b061b8a54c2b057c1fa14544c8_200x200.png',
  },
];

// Uninstalled apps data
const uninstalledApps = [
  {
    id: '1',
    name: 'Shipping & Delivery - ShipZip',
    description: '',
    icon: '/images/Installedchannels/imgi_21_e245cf8aac42adce595f03d3391ef1cd_200x200.png',
  },
  {
    id: '2',
    name: 'Payflow',
    description: '',
    icon: '/images/Installedchannels/imgi_22_ff3b61a8718cbdeb80d3a8dcf0b25014_200x200.png',
  },
  {
    id: '3',
    name: 'Glow Videos',
    description: '',
    icon: '/images/Installedchannels/imgi_23_059be247b65a321a159530a4d0998ea7_200x200.png',
  },
  {
    id: '4',
    name: 'Discounty',
    description: '',
    icon: '/images/Installedchannels/imgi_12_17e2a61657104d2ffed4486981037b5b_200x200.png',
  },
  {
    id: '5',
    name: 'CK: WhatsApp',
    description: '',
    icon: '/images/Installedchannels/imgi_13_88a434cd0a80dba18ecb18ab88e55151_200x200.png',
  },
  {
    id: '6',
    name: 'WATI: Whatsapp Chat',
    description: '',
    icon: '/images/Installedchannels/imgi_14_8cada0f5da411a64e756606bb036f1ed_200x200.png',
  },
  {
    id: '7',
    name: 'BL Custom HTML CSS JS Liquid',
    description: '',
    icon: '/images/Installedchannels/imgi_15_fc14b70f3ba850c4411e17ab2a8833d4_200x200.png',
  },
  {
    id: '8',
    name: 'Fontify',
    description: '',
    icon: '/images/Installedchannels/imgi_16_a78e004f44cded1b6998e7a6e081a230_200x200.png',
  },
];

function AppsSettings() {
  const [activeTab, setActiveTab] = useState('installed');

  const currentApps = activeTab === 'installed' ? installedApps : uninstalledApps;

  return (
    <>
      {/* Apps List Card */}
      <div className="settings-card">
        <div className="apps-card-inner">
          <div className="apps-list-wrapper">
            {/* Tabs */}
            <div className="apps-tabs-container">
              <div className="apps-tabs">
                <button
                  className={`apps-tab ${activeTab === 'installed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('installed')}
                >
                  Installed
                </button>
                <button
                  className={`apps-tab ${activeTab === 'uninstalled' ? 'active' : ''}`}
                  onClick={() => setActiveTab('uninstalled')}
                >
                  Uninstalled
                </button>
              </div>
              <button className="apps-sort-btn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5H17M6 10H14M9 15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Divider between tabs and list */}
            <div className="apps-tabs-divider"></div>

            {/* Apps List */}
            <div className="apps-list">
              {currentApps.map((app, index) => (
                <div key={app.id}>
                  <div className="apps-row">
                    <div className="apps-icon">
                      <img src={app.icon} alt={app.name} />
                    </div>
                    <div className="apps-info">
                      <div className="apps-name">{app.name}</div>
                      {app.description && (
                        <div className="apps-description">{app.description}</div>
                      )}
                    </div>
                    <button className="apps-menu-btn">
                      <Icon source={MenuHorizontalIcon} />
                    </button>
                  </div>
                  {index < currentApps.length - 1 && <div className="apps-divider"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learn More */}
      <div className="apps-learn-more">
        <a href="#">Learn more about apps</a>
      </div>
    </>
  );
}

export default AppsSettings;
