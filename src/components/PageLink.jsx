import { NavLink } from 'react-router-dom';
const PageLink = ({ path, text, setIsCollapsed }) => {
  return (
    <NavLink
      onClick={() => setIsCollapsed((prev) => !prev)}
      className={({ isActive }) =>
        `${isActive ? 'font-bold' : 'font-normal'} text-sm`
      }
      to={path}
    >
      {text}
    </NavLink>
  );
};

export default PageLink;
