import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function ArchiveProduct({ product, isActive: initialActive, fetchData }) {
  const notyf = new Notyf();
  const [isActive, setIsActive] = useState(initialActive);

  const archiveToggle = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${product._id}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          notyf.success('Successfully Disabled');
          setIsActive(false); 
          fetchData(); 
        } else {
          notyf.error('Something Went Wrong');
        }
      });
  };

  const activateToggle = () => {
    fetch(`${process.env.REACT_APP_API_URL}/products/${product._id}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          notyf.success('Successfully Enabled');
          setIsActive(true); 
          fetchData(); 
        } else {
          notyf.error('Something Went Wrong');
        }
      });
  };

  return (
    <Button
      variant={isActive ? 'danger' : 'success'}
      size="sm"
      className="w-100"
      onClick={isActive ? archiveToggle : activateToggle}
    >
      {isActive ? 'Disable' : 'Enable'}
    </Button>
  );
}
