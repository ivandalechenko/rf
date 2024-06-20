import React from 'react';
import './scss/Upgrades.scss';
import { useState } from 'react';
import Navigation from '../components/Navigation'
import { useEffect } from 'react';
import api from '../api';
import { observer } from 'mobx-react';
import authStore from '../authStore';
import Modal from '../components/Modal'
import { toast } from 'react-toastify';

const Upgrades = (props) => {
    const [page, setpage] = useState('upgrades');
    const [upgrades, setupgrades] = useState([])
    const [boosts, setboosts] = useState([])
    const [balance, setbalance] = useState(authStore.user.balance)

    const [modalUpgrade, setmodalUpgrade] = useState({});
    const [showModal, setshowModal] = useState();


    const getUpgrades = async () => {
        authStore.setLoader(true);
        const res = await api.get('/upgrade/notBuyed')
        setupgrades(res.data)
        authStore.setLoader(false);
    }
    const getBoosts = async () => {
        const now = Date.now();
        const user = authStore.user;
        const lastFuelBoostTime = new Date(user.lastFuelBoost)
        const lastFuelBoost = lastFuelBoostTime.getTime();
        const lastRageTime = new Date(user.lastRage)
        const lastRage = lastRageTime.getTime();
        let boosts = [
            {
                avaliable: false,
                slug: 'fuel 1',
                level: 1,
                description: "Мгновенно восполняет запасы топлива",
                name: "Топливо",
                price: 0,
            },
            {
                avaliable: false,
                slug: 'rage 1',
                level: 1,
                description: "Вы на 30 секунд влетаете в пояс астероидов, количество ресурсов за свайп увеличивается в 10 раз, а расход топлива падает в 3 раза",
                name: "Пояс астероидов",
                price: 0,
            }
        ]
        if (user.lastFuelBoost) {
            const timeElapsed = now - lastFuelBoost;
            console.log(timeElapsed);
            if (timeElapsed > 24 * 60 * 60 * 1000) {
                boosts[0].avaliable = true;
            }
        } else {
            boosts[0].avaliable = true;
        }
        if (user.lastRage) {
            const timeElapsed = now - lastRage;
            if (timeElapsed > 12 * 60 * 60 * 1000) {
                boosts[1].avaliable = true;
            }
        } else {
            boosts[1].avaliable = true;
        }

        // всегда включает рейдж
        // boosts[1].avaliable = true;

        setboosts(boosts)
    }
    useEffect(() => {
    }, [])
    useEffect(() => {
        setbalance(authStore.user.balance)
    }, [authStore.lastUserUpdate])

    const openBuyUpgradeModal = async (upgrade) => {
        let upgradeWithGetUpgrades;
        if (page == 'upgrades') {
            upgradeWithGetUpgrades = { ...upgrade, getUpgrades: getUpgrades }
        } else {
            upgradeWithGetUpgrades = { ...upgrade, getUpgrades: getBoosts }
        }
        setmodalUpgrade(upgradeWithGetUpgrades);
        setshowModal(true)
    }
    useEffect(() => {
        if (page == 'upgrades') {
            getUpgrades()
        } else if (page == 'boost') {
            getBoosts()
        }
    }, [page])
    return (
        <div className='Upgrades page'>
            {
                showModal ? <>
                    <Modal hideModal={setshowModal} upgrade={modalUpgrade} ></Modal>
                </>
                    : <></>}
            <div className='Upgrades_money_wrapper'>
                <div className='Upgrades_money'>
                    <div className='Upgrades_money_header'>
                        Money
                    </div>
                    <div className='Upgrades_money_content'>
                        <img src='/img/icons/money.svg' alt='decor' />
                        {balance}
                    </div>
                </div>
            </div>
            <div className='Upgrades_buttons'>
                <div className={`Upgrades_button ${page == 'upgrades' && 'selected'}`} onClick={() => { setpage('upgrades') }}
                >
                    <img src='/img/icons/upgrades2.svg' alt='decor' />
                    Upgrades
                </div>
                {/* <div className={`Upgrades_button ${page == 'skins' && 'selected'}`} onClick={() => { setpage('skins') }}>
                    <img src='/img/icons/skins.svg' alt='decor' />
                    Skins
                </div> */}
                <div className={`Upgrades_button ${page == 'boost' && 'selected'}`} onClick={() => { setpage('boost') }}>
                    <img src='/img/icons/boost.svg' alt='decor' />
                    Boost
                </div>
            </div>
            <div className='Upgrades_list'>

                {
                    page == 'upgrades'
                        ? <>
                            {upgrades.length > 0
                                ? <>
                                    <div className='Invites_label'>
                                        Доступные
                                    </div>
                                    {upgrades.map((upgrade) => {
                                        if (upgrade.avaliable) {
                                            return <div className='Upgrades_element' key={upgrade._id}>
                                                <div className='Upgrades_element_decor'>
                                                    <img src={`/img/upgrades/${upgrade.slug.split(' ')[0]}.svg`} alt='decor' />
                                                    <div className='Upgrades_element_lvl'>
                                                        {upgrade.level} lvl
                                                    </div>
                                                </div>
                                                <div className='Upgrades_element_content'>
                                                    <div className='Upgrades_element_header'>
                                                        {upgrade.name}
                                                    </div>
                                                    <div className='Upgrades_element_profit'>

                                                        <div className='Upgrades_element_profit_header'>
                                                            {upgrade.description}
                                                        </div>
                                                    </div>
                                                    <div className='Upgrades_element_buy_wrapper' onClick={() => { openBuyUpgradeModal(upgrade) }}>
                                                        <div className='Upgrades_element_buy'>
                                                            <img src='/img/icons/money.svg' alt='decor' />
                                                            {upgrade.price}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    })}

                                    <div className='Invites_label'>
                                        Закрытые
                                    </div>
                                    {upgrades.map((upgrade) => {
                                        if (!upgrade.avaliable) {
                                            return <div className='Upgrades_element' key={upgrade._id}>
                                                <div className='Upgrades_element_decor'>
                                                    <img src={`/img/upgrades/${upgrade.slug.split(' ')[0]}.svg`} alt='decor' />
                                                    <div className='Upgrades_element_lvl'>
                                                        {upgrade.level} lvl
                                                    </div>
                                                </div>
                                                <div className='Upgrades_element_content'>
                                                    <div className='Upgrades_element_header'>
                                                        {upgrade.name}
                                                    </div>
                                                    <div className='Upgrades_element_profit'>

                                                        <div className='Upgrades_element_profit_header'>
                                                            {upgrade.description}
                                                        </div>
                                                    </div>
                                                    <div className='Upgrades_element_buy_wrapper' >
                                                        <div className='Upgrades_element_buy' onClick={() => {
                                                            let reqUgrade = [];
                                                            for (let i = 0; i < upgrade.requirement.length; i++) {
                                                                const upg = upgrades.find((upg) => upg.slug == upgrade.requirement[i])
                                                                reqUgrade.push(upg.name)
                                                            }
                                                            let reqText = `Для открытия улучшения "${upgrade.name}" вам необходимо купить`;
                                                            for (let i = 0; i < reqUgrade.length; i++) {
                                                                if (i == 0) {
                                                                    reqText += `: "${reqUgrade[i]}"`;
                                                                } else {
                                                                    reqText += `, "${reqUgrade[i]}"`;
                                                                }
                                                            }
                                                            toast.info(reqText)

                                                        }}>
                                                            <img src='/img/icons/lock.svg' alt='decor' />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    })}</>
                                : <></>
                            }
                        </>
                        : <></>
                }
                {
                    page == 'boost'
                        ? <>{boosts.map((boost) => {
                            return <div className='Upgrades_element' key={boost.name}>
                                <div className='Upgrades_element_decor'>
                                    <img src={`/img/upgrades/${boost.slug.split(' ')[0]}.svg`} alt='decor' />
                                </div>
                                <div className='Upgrades_element_content'>
                                    <div className='Upgrades_element_header'>
                                        {boost.name}
                                    </div>
                                    <div className='Upgrades_element_profit'>

                                        <div className='Upgrades_element_profit_header'>
                                            {boost.description}
                                        </div>
                                    </div>
                                    {
                                        boost.avaliable
                                            ? <div className='Upgrades_element_buy_wrapper' onClick={() => { openBuyUpgradeModal(boost) }}>
                                                <div className='Upgrades_element_buy'>
                                                    Активировать
                                                </div>
                                            </div>
                                            : <div className='Upgrades_element_buy_wrapper' >
                                                <div className='Upgrades_element_buy'>
                                                    <img src='/img/icons/lock.svg' alt='decor' />
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                        })}</>
                        : <></>
                }

            </div>
            <Navigation></Navigation>
        </div >
    )
}

export default observer(Upgrades)