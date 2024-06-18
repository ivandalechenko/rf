import React from 'react';
import './scss/Play.scss';
import Navigation from '../components/Navigation'
// import { useState } from 'react';
import { useState } from 'react';
import { useRive, Rive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useEffect } from 'react';

import PlayField from '../components/PlayField'
import authStore from '../authStore';
import resourceStore from '../resourceStore';
import { observer } from 'mobx-react';
import Modal from '../components/Modal'


import api from '../api';

const Play = observer((props) => {
    const [isStation, setisStation] = useState(false);
    const [speed, setspeed] = useState(0)
    const [isFly, setisFly] = useState(false)
    const [weight, setweight] = useState(authStore.user.cargoWeight);
    const [fuel, setfuel] = useState(Math.floor(authStore.user.fuel));
    const [maxWeight, setmaxWeight] = useState(authStore.user.cargoCapacity);
    const [maxFuel, setmaxFuel] = useState(authStore.user.maxFuel);
    const [balance, setbalance] = useState(authStore.user.balance);
    const [showModal, setshowModal] = useState(false);
    const [soldResources, setsoldResources] = useState([]);
    const [earned, setearned] = useState(0);
    const [rocketScale, setrocketScale] = useState(1);


    // Анимационные вопросы корабля и станции
    const { RiveComponent, rive } = useRive({
        src: '/flames/1.riv',
        stateMachines: 'State Machine 1'
    });

    const startFly = () => {
        setisFly(true)
        rive.play();
    }

    useEffect(() => {

        let spd = 0;
        const updateSpeed = (i) => {
            if (i == 0) {
                spd = 0
            }
            setTimeout(() => {
                if (i > 475) {
                    spd = spd + .2;
                } else if (i > 450) {
                    spd = spd + .4;
                } else if (i > 425) {
                    spd = spd + .6;
                } else if (i > 400) {
                    spd = spd + .8;
                } else if (i > 375) {
                    spd = spd + 1.1;
                } else if (i > 350) {
                    spd = spd + 1.5;
                } else {
                    spd = spd + 2;
                }
                setspeed(spd)
                if (i < 500) {
                    updateSpeed(i + 1)
                }
            }, 1);
        }
        if (isFly && speed == 0) {
            updateSpeed(0)
        }
    }, [isFly])

    useEffect(() => {
        // console.log('ОБНОВЛЯЮ FUEL');
        setfuel(Math.floor(authStore.user.fuel))
    }, [authStore.lastUserUpdate])

    useEffect(() => {
        authStore.updateUser()
        setInterval(() => {
            setrocketScale(prevScale => prevScale > 1.05 ? prevScale - 0.05 : prevScale)
        }, 100);
    }, [])

    const setRocketBigger = () => {
        setrocketScale(prevScale => prevScale > 1.5 ? prevScale : prevScale > 1.3 ? prevScale + 0.05 : prevScale + 0.10)
    }

    useEffect(() => {
        const arriveToStation = async () => {
            if (isStation) {
                const user = authStore.user;
                const resources = await resourceStore.getResources();
                let profit = 0;
                let soldResourcesList = [];

                for (let i = 0; i < user.cargo.length; i++) {
                    const resource = resources.find(obj => obj['level'] === user.cargo[i]);
                    profit += resource.price;
                    const soldResource = soldResourcesList.find(sR => sR['level'] === user.cargo[i])
                    if (soldResource) {
                        soldResource.count += 1;
                        soldResource.profit += resource.price;
                    } else {
                        soldResourcesList.push({ level: user.cargo[i], count: 1, profit: resource.price })
                    }
                }

                console.log(profit);
                console.log(soldResourcesList);
                setsoldResources(soldResourcesList)
                setearned(profit)
                if (profit > 0) {
                    setshowModal(true)
                }

                const res = await api.post("/user/sell");
                setweight(0)
                authStore.setUser(res.data)
                setbalance(res.data.balance)
                setisFly(false)
                setspeed(0)
                rive.stop();
                rive.reset();
            }
        }
        arriveToStation()
    }, [isStation])

    return (
        <div className='Play' style={{ '--animation-speed': `${20 / (speed / 100)}s` }}>
            {
                isStation && showModal ?
                    <Modal hideModal={setshowModal} resources={soldResources} earned={earned}>gav gav</Modal>
                    : <></>}
            <div className='Play_buttons'>
                {
                    !isStation
                        ? <>
                            <div className='Play_button Play_button_station' onClick={() => (setisStation(true))}>
                                <div className='Play_button_header ' >
                                    Station
                                </div>
                                <div className='Play_button_content'>
                                    <img src='/img/icons/station.svg' alt='decor' />
                                </div>
                            </div>
                            <div className='Play_button'>
                                <div className='Play_button_header'>
                                    Resources
                                </div>
                                <div className='Play_button_content'>
                                    <img src='/img/icons/resources.svg' alt='decor' />
                                    {weight}/{maxWeight}
                                </div>
                            </div>
                            <div className='Play_button'>
                                <div className='Play_button_header'>
                                    Fuel
                                </div>
                                <div className='Play_button_content'>
                                    <img src='/img/icons/fuel.svg' alt='decor' />
                                    {/* {acceleration}/1000 */}
                                    {fuel}/{maxFuel}
                                </div>
                            </div>
                        </>
                        : <>
                            <div className='Play_button'>
                                <div className='Play_button_header'>
                                    Money
                                </div>
                                <div className='Play_button_content'>
                                    <img src='/img/icons/money.svg' alt='decor' />
                                    {balance}
                                </div>
                            </div>
                        </>
                }
            </div>

            <div className='Play_items'>
                <div className='free_img Play_station'>
                    <img src='/img/station.png' className={`${!isStation && 'dnone'}`} alt='decor' />
                </div>
                <div className="free_img Play_rocketAndFlames" style={{ transform: `scale(${Math.floor(rocketScale * 100) / 100})` }}>
                    <div className={`free_img Play_flames ${isStation && 'dnone'}`}>
                        <div className='Play_flames_inner'>
                            <RiveComponent
                                style={{ width: '66px', height: '100px' }}
                            />
                        </div>
                    </div>
                    <div className="free_img Play_rocket">
                        <img src='/img/rocket.png' alt='decor' />
                    </div>
                </div>
                <div className="free_img" style={{ opacity: isStation ? 0 : 1 }}>
                    <PlayField setRocketBigger={setRocketBigger} startFly={startFly} setweight={setweight} setfuel={setfuel} ></PlayField>
                </div>


            </div>
            <div className='Play_balansir'></div>
            <Navigation isBack={isStation} backFunc={() => { setisStation(false) }} ></Navigation>
        </div>
    )
})

export default Play