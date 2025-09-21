import { faBars, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import PageLink from './PageLink';
const PAGES_LINKS = [
  {
    id: 1,
    path: '/',
    text: 'Home',
  },
  {
    id: 2,
    path: '/explore',
    text: 'Explore',
  },
  {
    id: 3,
    path: '/courses',
    text: 'Courses',
  },
  {
    id: 4,
    path: '/about',
    text: 'About',
  },
  {
    id: 5,
    path: '/contact',
    text: 'Contact',
  },
  {
    id: 6,
    path: '/register',
    text: 'Register',
  },
  {
    id: 7,
    path: '/login',
    text: 'Login',
  },
];
const UserLogedIn = false;
const Header = ({ isDark, toggleTheme }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <header className="min-h-16 flex items-center bg-primary-light dark:bg-primary-dark dark:text-white">
      <div className="container mx-auto">
        <nav className="content flex items-center gap-3">
          {/* Company Title */}
          <h3 className="text-2xl font-medium">Clerk App</h3>
          {/* Bars Icon */}
          <div className="hidden max-md:flex justify-end flex-1 ">
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="cursor-pointer"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          {/* Pages Links */}
          <div
            className={`${isCollapsed ? 'max-md:max-h-[350px]' : 'max-md:max-h-0'} z-10 overflow-hidden transition-[max-height] duration-500 bg-primary-light dark:bg-primary-dark max-md:absolute left-0 top-16 w-full flex-1 min-md:flex justify-end`}
          >
            <ul
              className={`max-md:container max-md:mx-auto max-md:flex-col max-md:items-start flex items-center gap-2`}
            >
              {PAGES_LINKS.map((pageLink) => {
                if (pageLink.path === '/courses') {
                  if (UserLogedIn === true) {
                    return (
                      <PageLink
                        key={pageLink.id}
                        path={pageLink.path}
                        text={pageLink.text}
                        setIsCollapsed={setIsCollapsed}
                      />
                    );
                  } else {
                    return null;
                  }
                }

                return (
                  <PageLink
                    key={pageLink.id}
                    path={pageLink.path}
                    text={pageLink.text}
                    setIsCollapsed={setIsCollapsed}
                  />
                );
              })}
            </ul>
          </div>
          {/* Dark & light mood */}
          <div>
            {isDark ? (
              <button className="cursor-pointer" onClick={toggleTheme}>
                <FontAwesomeIcon icon={faSun} />
              </button>
            ) : (
              <button className="cursor-pointer">
                <FontAwesomeIcon onClick={toggleTheme} icon={faMoon} />
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
