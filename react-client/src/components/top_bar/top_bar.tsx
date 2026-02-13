import type { FC, ReactNode } from "react";
import "./top_bar.css";
type TopBarProps = {
  title?: string;
  onMenuClick: () => void;
  right?: ReactNode;
};

const TopBar: FC<TopBarProps> = ({
  title = "Dashboard",
  onMenuClick,
  right,
}) => {
  return (
    <header className="topbar" aria-label="Top bar">
      <div className="topbar__left">
        <button
          type="button"
          className="iconButton topbar__menuBtn"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          ☰
        </button>

        <h1 className="topbar__title">{title}</h1>
      </div>

      <div className="topbar__center">
        <label className="topbar__search" aria-label="Search">
          <span className="topbar__searchIcon" aria-hidden="true">
            ⌕
          </span>
          <input className="topbar__searchInput" placeholder="Search…" />
        </label>
      </div>

      <div className="topbar__right">
        {right ?? (
          <>
            <button type="button" className="button button--ghost">
              Help
            </button>
            <button type="button" className="button">
              New
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;
