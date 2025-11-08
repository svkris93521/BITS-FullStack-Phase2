import React from 'react';

const ItemCard = ({ item }) => {
  return (
    <article className="item-card">
      <img src={item.image || '/placeholder-item.png'} alt={item.name} className="item-image" />
      <div className="item-body">
        <h3 className="item-title">{item.name}</h3>
        <p className="item-meta">Category: {item.category || 'N/A'}</p>
        <p className="item-desc">{item.description || ''}</p>
      </div>
    </article>
  );
};

export default ItemCard;
