import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Item {
  id: number;
  title: string;
  image: string;
  // Add other properties as needed
}

interface Props {
  items: Item[];
}

const PaginatedList: React.FC<Props> = ({ items }) => {
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index range for current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentItems);
  console.log(currentPage);

  // Function to handle page change
  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
console.log(items.length)
  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  console.log(pageNumbers);

  return (
    <div>
      {currentItems.map(item => (
        <div className='myeats-card' key={item.id}>
          <Link to={`/recipe/${item.id}/information`}>
            <img src={item.image}></img>
            <p>{item.title}</p>
          </Link>
        </div>
      ))}
      <div>
        {pageNumbers.map(number => (
          <button key={number} onClick={() => handleClick(number)}>
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaginatedList;
