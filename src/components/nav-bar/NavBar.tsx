import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './NavBar.scss';
import accountTreeIcon from '../../assets/icons/account_tree.svg';
import automationIcon from '../../assets/icons/automation.svg';
import contentPasteSearchIcon from '../../assets/icons/content_paste_search.svg';
import historyIcon from '../../assets/icons/history.svg';
import topicIcon from '../../assets/icons/topic.svg';
import twoPagerIcon from '../../assets/icons/two_pager.svg';

function NavBar() {
  const location = useLocation(); // To access the current location and query parameters

  const navItems = [
    { icon: accountTreeIcon, label: 'Account Tree',path: '/insight-ai'  },
    { icon: automationIcon, label: 'Automation', path: '/vertex'  },
    { icon: contentPasteSearchIcon, label: 'Content Paste Search', path: '/first' },
    { icon: historyIcon, label: 'History',path: '/automation' },
    { icon: topicIcon, label: 'Topic', path: '/topic' },
    { icon: twoPagerIcon, label: 'Two Pager', path: '/two-pager' },
  ];

  // Helper function to append query params to each navigation link
  const getNavLinkWithParams = (path: string) => {
    return `${path}${location.search}`; // Append current query parameters
  };

  return (
    <div className="nav-bar">
      <div className="nav-list">
        {navItems.map((item, index) => (
          <li key={index} className="nav-item" title={item.label}>
            <NavLink
              to={getNavLinkWithParams(item.path)} // Append query params to path
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <img src={item.icon} alt={item.label} className="nav-icon" />
            </NavLink>
          </li>
        ))}
      </div>
    </div>
  );
}

export default NavBar;
