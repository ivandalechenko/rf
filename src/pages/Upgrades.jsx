import React from 'react';
import './scss/Upgrades.scss';
import { useState } from 'react';
import Navigation from '../components/Navigation'
import { useEffect } from 'react';
import api from '../api';
import { observer } from 'mobx-react';
import authStore from '../authStore';
import Modal from '../components/Modal'

const Upgrades = (props) => {
    const [page, setpage] = useState('upgrades');
    const [upgrades, setupgrades] = useState([])
    const [balance, setbalance] = useState(authStore.user.balance)

    const [modalUpgrade, setmodalUpgrade] = useState({});
    const [showModal, setshowModal] = useState();


    const getUpgrades = async () => {
        const res = await api.get('/upgrade/notBuyed')
        setupgrades(res.data)
    }
    useEffect(() => {
        getUpgrades()
    }, [])
    useEffect(() => {
        setbalance(authStore.user.balance)
    }, [authStore.lastUserUpdate])

    const openBuyUpgradeModal = async (upgrade) => {
        const upgradeWithGetUpgrades = { ...upgrade, getUpgrades }
        setmodalUpgrade(upgradeWithGetUpgrades);
        setshowModal(true)

    }


    return (
        <div className='Upgrades page'>
            {
                showModal ?
                    <Modal hideModal={setshowModal} upgrade={modalUpgrade} ></Modal>
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
                {/* <div className={`Upgrades_button ${page == 'upgrades' && 'selected'}`} onClick={() => { setpage('upgrades') }}
                >
                    <img src='/img/icons/upgrades2.svg' alt='decor' />
                    Upgrades
                </div> */}
                {/* <div className={`Upgrades_button ${page == 'skins' && 'selected'}`} onClick={() => { setpage('skins') }}>
                    <img src='/img/icons/skins.svg' alt='decor' />
                    Skins
                </div> */}
                {/* <div className={`Upgrades_button ${page == 'boost' && 'selected'}`} onClick={() => { setpage('boost') }}>
                    <img src='/img/icons/boost.svg' alt='decor' />
                    Boost
                </div> */}
            </div>
            <div className='Upgrades_list'>
                {
                    upgrades.map((upgrade) => {
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
                                {
                                    upgrade.avaliable
                                        ? <div className='Upgrades_element_buy_wrapper' onClick={() => { openBuyUpgradeModal(upgrade) }}>
                                            <div className='Upgrades_element_buy'>
                                                <img src='/img/icons/money.svg' alt='decor' />
                                                {upgrade.price}
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
                    })
                }

            </div>
            <Navigation></Navigation>
        </div >
    )
}

export default observer(Upgrades)