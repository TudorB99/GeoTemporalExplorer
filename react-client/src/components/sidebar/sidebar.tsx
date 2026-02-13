import type { FC } from "react";
import "./sidebar.css";
type NavItem = {
  label: string;
  href: string;
};

type SidebarProps = {
  /** For mobile drawer mode */
  open: boolean;
  onClose: () => void;
  items?: NavItem[];
};

const defaultItems: NavItem[] = [
  { label: "Item 1", href: "#" },
  { label: "Item 2", href: "#" },
  { label: "Item 3", href: "#" },
  { label: "Item 4", href: "#" },
];

const Sidebar: FC<SidebarProps> = ({ open, onClose, items = defaultItems }) => {
  return (
    <aside className="sidebar" data-open={open} aria-label="Sidebar navigation">
      <div className="sidebar__header">
        <div className="sidebar__brand" aria-label="App brand">
          <span className="sidebar__logo" aria-hidden="true" />
          <span className="sidebar__brandText">Geo Temporal Explorer</span>
        </div>

        <button
          type="button"
          className="iconButton sidebar__closeBtn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ✕
        </button>
      </div>

      <nav className="sidebar__nav">
        <ul className="sidebar__list">
          {items.map((item) => (
            <li key={item.label} className="sidebar__item">
              <a className="sidebar__link" href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden="true" />
          <div className="sidebar__userMeta">
            <div className="sidebar__userName">Jane Doe</div>
            <div className="sidebar__userSub">jane@example.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
