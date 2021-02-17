import React, { useState, useEffect } from 'react';
import { UidContext } from './components/AppContext';
import Routes from "./components/Routes";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getUser } from './actions/user.action';


function App() {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
          console.log(res)
        })
        .catch((err) => console.log("No token (front)", err));
    };
    fetchToken();

    if(uid) dispatch(getUser(uid))


  }, [uid, dispatch]);

  return (
    <UidContext.Provider value={uid}>
      <div className="App">
        <Routes />
      </div>
    </UidContext.Provider>
  );
}

export default App;
