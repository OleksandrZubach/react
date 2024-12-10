// import axios from "axios";
// import useLocalStorage from "../effects/useLocalStorage"
// import { Link, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from "react";
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import { useDispatch, useSelector } from 'react-redux';
// import { setDogs, setLoading, setError } from '../store/dogsSlice';


// const Main = () => {
//   const [token, setToken] = useLocalStorage('token', '');
//   const [dogs, setDogs] = useState([] as any[]);
//   const navigate = useNavigate();

//   const logout = () => {
//     setToken('');
//   }

//   const getDogs = () => {
//     if (!token) {
//       return;
//     }
//     axios.get(`https://dogs.kobernyk.com/api/v1/dogs`, {
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     }).then(response => {
//       setDogs(response.data);
//       console.log(response.data);
//     }).catch(error => {
//       // we're going to redirect to login page
//       logout();
//       navigate('/login');
//     });
//   }

//   useEffect(getDogs, []);
  
//   if (token) {
//     return <>
//       Ви авторизовані<br/>
//       <button onClick={logout}>Вийти</button>
//       <br/>
//       {dogs.map(dog => {
//         return <Card sx={{ maxWidth: 345 }}>
//           <CardMedia
//             sx={{ height: 140 }}
//             image={dog.image}
//             title="green iguana"
//           />
//           <CardContent>
//             <Typography gutterBottom variant="h5" component="div">
//               {dog.name}
//             </Typography>
//             <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//               Колір: {dog.color}<br/>
//               Порода: {dog.breed}
//             </Typography>
//           </CardContent>
//           <CardActions>
//             <Link to={`/${dog._id}`}>Деталі</Link>
//           </CardActions>
//         </Card>;
//       })}
//     </>
//   } else {
//     return <>
//       <Link to="/login">Авторизуватися</Link>
//     </>
//   }
// }

// export default Main







import axios from "axios";
import useLocalStorage from "../effects/useLocalStorage";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setDogs, setLoading, setError } from '../store/dogsSlice';

const Main = () => {
  const [token, setToken] = useLocalStorage('token', '');
  const navigate = useNavigate();

  const dispatch = useDispatch(); // Отримання функції для dispatch
  const { dogs, loading, error } = useSelector((state: any) => state.dogs); // Доступ до стану Redux

  const logout = () => {
    setToken('');
    navigate('/login');
  };

  const getDogs = () => {
    if (!token) {
      return;
    }
    dispatch(setLoading(true)); // Позначаємо стан завантаження
    axios
      .get(`https://dogs.kobernyk.com/api/v1/dogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        dispatch(setDogs(response.data)); // Передаємо отримані дані у Redux
      })
      .catch((error) => {
        console.error("Error fetching dogs:", error);
        dispatch(setError("Не вдалося отримати дані"));
        logout(); // У разі помилки перенаправляємо на сторінку авторизації
      })
      .finally(() => {
        dispatch(setLoading(false)); // Знімаємо стан завантаження
      });
  };

  useEffect(() => {
    getDogs();
  }, [token]); // Викликаємо при зміні токена

  // Виводимо стан завантаження або помилки, якщо вони є
  if (loading) {
    return <div>Завантаження...</div>;
  }
  if (error) {
    return <div>Помилка: {error}</div>;
  }

  // Головний вміст компонента
  if (token) {
    return (
      <>
        Ви авторизовані
        <br />
        <div className="inline-block p-8 bg-gradient-to-b from-green-400 via-red-100 to-blue-400">123</div>
        <br />
        <button onClick={logout}>Вийти</button>
        <br />
        {dogs.map((dog: any) => (
          <Card key={dog._id} sx={{ maxWidth: 345, margin: 2 }}>
            <CardMedia
              sx={{ height: 140 }}
              image={dog.image}
              title={dog.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {dog.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Колір: {dog.color}
                <br />
                Порода: {dog.breed}
              </Typography>
            </CardContent>
            <CardActions>
              <Link to={`/${dog._id}`}>Деталі</Link>
            </CardActions>
          </Card>
        ))}
      </>
    );
  } else {
    return <Link to="/login">Авторизуватися</Link>;
  }
};

export default Main;
