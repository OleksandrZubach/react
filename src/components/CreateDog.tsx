import React from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import useLocalStorage from '../effects/useLocalStorage';

type Dog = {
  _id: string;
  name: string;
  age: number;
  breed: string;
  color: string;
};

const CreateDog: React.FC = () => {
  const [token] = useLocalStorage('token', '');
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      breed: formData.get('breed') as string,
      color: formData.get('color') as string,
    };

    try {
      // Отримуємо випадкове зображення собаки
      const dogImageResult = await axios.get('https://dog.ceo/api/breeds/image/random');
      data['image'] = dogImageResult.data.message;

      // Надсилаємо дані собаки до API
      await axios.post('https://dogs.kobernyk.com/api/v1/dogs', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Переходимо на головну сторінку після успішного запиту
      navigate('/');
    } catch (error) {
      console.error('Failed to create dog:', error);
    }
  };

  return (
    <>
      <Link to="/">Back</Link>
      <form onSubmit={onSubmit}>
        <label>
          Name:
          <input type="text" name="name" required />
        </label>
        <br />
        <label>
          Age:
          <input type="number" name="age" required />
        </label>
        <br />
        <label>
          Breed:
          <input type="text" name="breed" required />
        </label>
        <br />
        <label>
          Color:
          <input type="text" name="color" required />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreateDog;
