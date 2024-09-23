import React, { useState } from 'react';

const foodData = {

    
  konafa: [
    { name: 'Chicken Corn Soup', price: '$5.99' },
    { name: 'Chicken Wonton Soup', price: '$4.80' },
    { name: '2 Pcs Chicken With Egg Fried Rice', price: '$9.10' },
    { name: 'aaaa', price: '$500.00' },
    { name: 'knafa', price: '' }
  ],
  drink: [
    { name: 'Pine-Apple Pastry', price: '$12.00' },
    { name: 'Oreo Pastry', price: '$13.00' },
    { name: 'Coca Cola', price: '$0.75' }
  ],
  papaCoffee: [
    { name: 'Coca Cola Regular 1 Liter', price: '$1.50' },
    { name: 'Coca Cola Zero 500ml', price: '$0.99' },
    { name: 'Coca Cola Regular 2.5 Liter', price: '$2.25' },
    { name: 'Coca Cola Regular 1.5 Liter', price: '$2.20' },
    { name: 'Sprite Regular 250ml', price: '$0.75' },
    { name: 'Sprite Regular 1.5 Liter', price: '$2.25' },
    { name: 'Mountain Dew Soft Drink 155ml', price: '$3.90' },
    { name: 'Bavaria Non-Alcoholic Malt Drink Peach Bottle 330ml', price: '$5.00' },
    { name: 'Schweppes Premium Mixer Soda Water 250ml', price: '$2.00' },
    { name: 'ICE MILO', price: '' }
  ],
  baklava: [
    { name: 'Fresh Water-Melon', price: '$6.00' },
    { name: 'Fresh Water-Melon', price: '' }
  ],
  takmem: [
    { name: 'Zinger Burger', price: '$2.34' },
    { name: 'Hot n Crispy Burger', price: '$3.70' },
    { name: 'Cheese Burger', price: '$4.90' },
    { name: 'Mini McRoyale', price: '$4.90' },
    { name: 'Chicken Burger with Cheese', price: '$3.80' },
    { name: 'Grand Chicken Spicy', price: '$7.90' },
    { name: 'Falafil', price: '$80.00' },
    { name: 'Chota Cup', price: '$100.00' },
    { name: 'بيل', price: '$10.00' },
    { name: 'burger', price: '' }
  ],
  HomeDelivery:[
    { name: "Orange Juice", price: "$2.5", image: "orange-juice.png" },
  ],
  KanafaShah : [
        { name: "Masala Fries", price: "$3.24", image: "masala-fries.png" },
        { name: "French Fries", price: "$0.9", image: "french-fries.png" }
      ],
      Pizza: [
        { name: "Veg Cheese Pizza", price: "$3.99" },
        { name: "Double Cheese Pizza", price: "$3.99" },
        { name: "Testing", price: "$50" }
      ],
      Coffee: [
        { name: "Coffee", price: "$2" },
        { name: "Uje pa gas", price: "$3", image: "uje-pa-gas.png" }
      ],
      IceCream: [
          { name: "Strawberry", price: "$8.67", image: "strawberry.png" },
          { name: "Vanilla", price: "$8.99", image: "vanilla.png" },
          { name: "Permuda ice Cream", price: "$23", image: "permuda-ice-cream.png" },
          { name: "PIZZAMESTA", price: "$5", image: "pizzamesta.png" }
        ]

};

const FoodGroup = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
  };

  const getFoodItems = () => {
    return foodData[selectedGroup] || [];
    
  };

  return (
    <div>
      <h1>Food Groups</h1>
      <button onClick={() => handleGroupChange('konafa')}>Konafa</button>
      <button onClick={() => handleGroupChange('drink')}>Drink</button>
      <button onClick={() => handleGroupChange('papaCoffee')}>Papa Coffee</button>
      <button onClick={() => handleGroupChange('baklava')}>Baklava</button>
      <button onClick={() => handleGroupChange('takmem')}>Takmem</button>
      <button onClick={() => handleGroupChange('HomeDelivery')}>Takmem</button>
      <button onClick={() => handleGroupChange('KanafaShah')}>Takmem</button>
      <button onClick={() => handleGroupChange('Pizza')}>Takmem</button>
      <button onClick={() => handleGroupChange('Coffee')}>Takmem</button>
      <button onClick={() => handleGroupChange('IceCream')}>Takmem</button>

      <div>
        {getFoodItems().length > 0 ? (
          <ul>
            {getFoodItems().map((item, index) => (
              <li key={index}>{item.name} {item.price}</li>
            ))}
          </ul>
        ) : (
          <p>No items available</p>
        )}
      </div>
    </div>
  );
};

export default FoodGroup;
