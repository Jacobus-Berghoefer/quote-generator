import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
import {Quote} from '../models/Quote';
import { v4 as uuidv4} from 'uuid';

interface Props {
  items: Quote[];
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
// console.log(items.length)
  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  // console.log(pageNumbers);

  return (
    <div>
      {currentItems.map(item => (
        <div className='quote-result' key={uuidv4()}>
            <blockquote>{item.text}</blockquote>
            <p>{item.author}</p>
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
