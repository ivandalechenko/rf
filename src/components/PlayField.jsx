import React, { useRef, useEffect, useState } from 'react';
import './scss/PlayField.scss';
import authStore from '../authStore';
import resourceStore from '../resourceStore';
import { observer } from 'mobx-react';
import api from '../api';

const PlayField = ({ startFly, setweight, setfuel, setRocketBigger, isStation }) => {
    const [touchPoints, setTouchPoints] = useState([]);
    const [viewResources, setviewResources] = useState([]);
    const canvasRef = useRef(null);
    const lastTapTimeout = useRef(null);
    const tapCount = useRef(0);
    const newCargoRef = useRef([]);
    const newCargoWeightRef = useRef(0);

    const [insideRocket, setinsideRocket] = useState('notSet');


    // ракета 140 на 200

    // КАНВАС СТАРТ

    useEffect(() => {
        if (insideRocket == false) {
            successSwipe();
        }
    }, [insideRocket])


    useEffect(() => {
        const rocketH = 200;
        const rocketW = 140;

        const rocketTop = window.innerHeight / 2 - rocketH / 2;
        const rocketBot = window.innerHeight / 2 + rocketH / 2;
        const rocketLeft = window.innerWidth / 2 - rocketW / 2;
        const rocketRight = window.innerWidth / 2 + rocketW / 2;
        if (touchPoints.length > 0) {
            if (touchPoints[touchPoints.length - 1].x > rocketLeft && touchPoints[touchPoints.length - 1].x < rocketRight && touchPoints[touchPoints.length - 1].y > rocketTop && touchPoints[touchPoints.length - 1].y < rocketBot) {
                if (insideRocket === false || insideRocket === 'notSet') {
                    setinsideRocket(true)
                    // console.log('swap to true');
                }
            } else {
                if (insideRocket === true) {
                    setinsideRocket(false)
                    // console.log('swap to false');
                }
            }
        }

    }, [touchPoints]);
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing

        for (let i = 0; i < touchPoints.length - 1; i++) {
            const startPoint = touchPoints[i];
            const endPoint = touchPoints[i + 1];
            const alpha = (i + 1) / touchPoints.length; // Calculate alpha based on point position
            context.strokeStyle = `rgba(255, 255, 255, ${alpha})`; // Adjust color and alpha
            context.beginPath();
            context.moveTo(startPoint.x, startPoint.y);
            context.lineTo(endPoint.x, endPoint.y);
            context.stroke();
            context.closePath();
        }
    }, [touchPoints]);

    const handleTouchStart = (e) => {
        const touch = e.targetTouches[0];
        setTouchPoints([{ x: touch.clientX, y: touch.clientY }]);
    };

    const handleTouchMove = (e) => {
        const touch = e.targetTouches[0];
        setTouchPoints((prevPoints) => [
            ...prevPoints,
            { x: touch.clientX, y: touch.clientY }
        ].slice(-20));
    };

    const handleTouchEnd = () => {
        if (touchPoints.length === 0) {
            return;
        }
        setTouchPoints([]);
    };

    // КАНВАС КОНЕЦ
    const triggerVibration = (pattern) => {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
        try {
            window.Telegram.WebApp.HapticFeedback.impactOccurred("medium")
        } catch (error) {

        }
    };

    useEffect(() => {
        return () => {
            // Очистка таймера при размонтировании компонента
            if (lastTapTimeout.current) {
                clearTimeout(lastTapTimeout.current);
                // console.log('Таймер очищен при размонтировании');
                api.post('/user/tap', { cargo: newCargoRef.current, cargoWeight: newCargoWeightRef.current, tapCount: tapCount.current })
            }
        };
    }, []);

    useEffect(() => {
        if (isStation) {
            registerTap(0, 0, true)
        }
    }, [isStation])

    const registerTap = (newCargo, newCargoWeight, permanent = false) => {

        if (!permanent) {
            newCargoRef.current = newCargo;
            newCargoWeightRef.current = newCargoWeight;
            tapCount.current += 1;
        }
        // console.log('Регистрирую тап');
        // console.log('lastTapTimeout перед установкой:', lastTapTimeout.current);
        if (lastTapTimeout.current) {
            // console.log('Очищаю предыдущий таймер:', lastTapTimeout.current);
            clearTimeout(lastTapTimeout.current)
        }
        lastTapTimeout.current = setTimeout(async () => {
            // console.log('Отправляю тап на сервер');
            const res = await api.post('/user/tap', { cargo: newCargoRef.current, cargoWeight: newCargoWeightRef.current, tapCount: tapCount.current })
            authStore.setUser(res.data)
            tapCount.current = 0;
            lastTapTimeout.current = null;
            // console.log('lastTapTimeout.currentпосле отправки:', lastTapTimeout.current);
        }, permanent ? 1 : 1000);
        // console.log('lastTapTimeout.currentпосле установки:', lastTapTimeout.current);
    }

    const updateUserCargoAndFuel = async (resourceType, fuelSpent) => {
        let user = authStore.user;
        const resources = await resourceStore.getResources();
        let newCargo = user.cargo;
        let newCargoWeight = user.cargoWeight;
        let newFuel = Math.floor(user.fuel - fuelSpent);
        for (let i = 0; i < fuelSpent; i++) {
            newCargo.push(resourceType)
            const resource = resources.find(obj => obj['level'] === resourceType);
            newCargoWeight += resource.weight;
        }
        if (newCargoWeight > user.cargoCapacity) {
            newCargoWeight = user.cargoCapacity
        }
        user.cargo = newCargo;
        user.cargoWeight = newCargoWeight;
        user.fuel = newFuel
        setfuel(newFuel)
        setweight(newCargoWeight)
        authStore.setUser(user)
        registerTap(newCargo, newCargoWeight)
    }

    const successSwipe = async () => {
        setRocketBigger()
        triggerVibration(100);
        let user = authStore.user;
        // console.log(user);
        startFly();
        let resourceType;
        const mLevel = authStore.user.canMine;
        const lLevel = authStore.user.luck;
        const resources = await resourceStore.getResources();
        // console.log('user');
        // console.log(user);
        // console.log('res');
        // console.log(resources);
        // console.log(`-`);
        // console.log(`Уровень копания: ${mLevel} Уровень удачи: ${lLevel}`);
        for (let i = 0; i < user.minePower; i++) {
            let user = authStore.user;
            if (user.fuel >= 1 && user.cargoWeight < user.cargoCapacity) {
                if (mLevel == 0) {
                    resourceType = 1;
                    await updateUserCargoAndFuel(resourceType, 1);
                } else {
                    let randForThisSwipe = getRandomValue(1, 100);
                    // console.log(`Зарандомил число ${randForThisSwipe}`);
                    // Цикл проходки по ресурсам
                    for (let resourceLevel = 1; resourceLevel <= mLevel + 1; resourceLevel++) {

                        const resource = resources.find(obj => obj['level'] === resourceLevel);
                        // console.log("resource");
                        // console.log(resource);
                        const resourceLuckLevelsList = resource.canMineLevel.find(obj => obj['canMineLevel'] === mLevel);
                        // console.log("resourceLuckLevelsList");
                        // console.log(resourceLuckLevelsList);
                        const chanceForThisResource = resourceLuckLevelsList.luckLevel.find(obj => obj['luckLevel'] === lLevel);
                        const percent = chanceForThisResource.percent

                        // console.log("chanceForThisResource");
                        // console.log(chanceForThisResource);
                        randForThisSwipe -= percent

                        // console.log(`Шанс на получение "${resource.name}" - ${percent}%, осталось шансов ${randForThisSwipe}`);
                        if (randForThisSwipe <= 0) {
                            // console.log(`Выпало "${resource.name}"`);
                            // console.log(`-`);
                            await updateUserCargoAndFuel(resourceLevel, 1);
                            resourceType = resourceLevel;
                            resourceLevel = 999;
                        }
                    }
                }

                if (viewResources.length < 25 || (resourceType > 2)) {
                    // Отображение ресурсов ниже
                    let res = viewResources;
                    const speed = getRandomValueFloat2(1, 4);
                    res.push({ type: resourceType, speed, spawnX: getRandomValue(-40, 40), key: Math.random() });
                    setviewResources(res)
                    setTimeout(() => {
                        let res = viewResources;
                        res.shift();
                        setviewResources(res)
                    }, 1000 * speed);
                }
            }
        }


    }
    function getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function getRandomValueFloat2(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) * 100) / 100 + min;
    }

    return (
        <div
            className='PlayField'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >

            {
                viewResources.map((resource) => {

                    return <div className='free_img PlayField_resource' style={{ animation: `resourceAnim ${resource.speed}s 1 linear forwards`, left: `${resource.spawnX}vw` }} key={resource.key}>
                        <img src={`/img/resources/${resource.type}.png`} alt='decor' />
                    </div>
                })
            }


            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                className="swipe-canvas"
            />
            {/* <canvas
                ref={canvasRef}
                width={100}
                height={100}
                className="swipe-canvas"
            /> */}
        </div>
    );
};

export default observer(PlayField);
