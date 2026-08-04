import { menuItemImg } from '../utils/images';

export function MenuItemRow({ item, onAdd, showAdd = false }) {
  return (
    <div className="menu-item">
      <img
        className="menu-item-thumb"
        src={menuItemImg(item.image)}
        alt={item.name}
        loading="lazy"
      />
      <div className="menu-item-body">
        <div className="menu-item-top">
          <span className="menu-item-name">{item.name}</span>
          {item.badge && <span className="menu-item-badge">{item.badge}</span>}
          <span className="menu-item-fill" />
          <span className="menu-item-price">${item.price.toFixed(2)}</span>
        </div>
        <p className="menu-item-desc">{item.description}</p>
      </div>
      {showAdd && onAdd && (
        <button type="button" className="add-btn" onClick={() => onAdd(item)} aria-label="Add to cart">
          +
        </button>
      )}
    </div>
  );
}

export function MenuColumn({ eyebrow, title, items, onAdd, showAdd }) {
  return (
    <div className="menu-col">
      <div className="menu-col-head">
        <span className="col-eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
      </div>
      {items?.map((it) => (
        <MenuItemRow key={it._id} item={it} onAdd={onAdd} showAdd={showAdd} />
      ))}
    </div>
  );
}

export function MenuDivider() {
  return (
    <div className="menu-divider-col" aria-hidden="true">
      <span className="diamond" />
      <span className="divider-line" />
      <span className="diamond" />
    </div>
  );
}
