import './general.scss'
import './null.scss'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Startup from './pages/Startup'
import Play from './pages/Play'
import Upgrades from './pages/Upgrades'
import Quest from './pages/Quest'
import Invites from './pages/Invites'
import authStore from './authStore';
import resourceStore from './resourceStore';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useEffect } from 'react';
import Loader from './components/Loader'
import Modal from './components/Modal'

function app() {
  const [afkFarm, setafkFarm] = useState(0);

  useEffect(() => {

    // const token = localStorage.getItem('token') || ''
    // if (token) { authStore.checkAuth() }
    // else {authStore.login(window.Telegram.WebApp.initDataUnsafe.user.id)}
    // window.Telegram.WebApp.expand()
    try {
      window.Telegram.WebApp.expand()
      authStore.login(window.Telegram.WebApp.initDataUnsafe.user.id, window.Telegram.WebApp.initDataUnsafe.start_param)
    } catch (error) {

    }


  }, [])


  useEffect(() => {
    if (authStore.isAuth) {
      resourceStore.updateResources()
    }
  }, [authStore.isAuth])

  useEffect(() => {
    if (authStore.afkFarm > 0) {
      setafkFarm(authStore.afkFarm)
    }
  }, [authStore.afkFarm])
  const hideAfk = () => {
    setafkFarm(0)
  }

  const [login, setlogin] = useState();



  return (
    <>
      {
        authStore.isAuth ?
          <>
            {/* {JSON.stringify(window.Telegram.)} */}
            {authStore.isLoading && <Loader></Loader>}
            {afkFarm > 0 && <Modal afk={afkFarm} hideModal={hideAfk}></Modal>}
            <Router>
              <Routes>
                <Route path="/" element={<Startup></Startup>} />
                <Route path="/play" element={<Play></Play>} />
                <Route path="/upgrades" element={<Upgrades></Upgrades>} />
                <Route path="/quest" element={<Quest></Quest>} />
                <Route path="/invites" element={<Invites></Invites>} />
                {/* <Route path="/logout" element={<div>
                  <button style={{ background: 'black', color: "white" }} onClick={() => {
                    authStore.logout();
                  }}>logout</button>
                </div>} /> */}
              </Routes>
            </Router>
          </>
          :

          <div className='App_auth'>
            {/* {JSON.stringify(window.Telegram.WebApp.initDataUnsafe.user.id)} */}
            залогиньтесь
            <input type="text" value={login} onChange={(e) => { setlogin(e.target.value) }} />
            <button style={{ color: "black" }} onClick={() => {
              authStore.login(login);
            }}>логин</button>
          </div>
      }
    </>
  )
}

export default observer(app)
