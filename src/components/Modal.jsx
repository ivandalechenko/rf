import React from 'react';
import './scss/Modal.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import authStore from '../authStore';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Modal = ({ children, hideModal, resources, earned, upgrade, afk }) => {
    const [hider, sethider] = useState(false);
    useEffect(() => {
        if (hider) {
            setTimeout(() => {
                hideModal();
            }, 500);
        }
    }, [hider])
    const navigate = useNavigate()
    const user = authStore.user;
    const buy = async () => {
        authStore.setLoader(true);
        let res;
        if (upgrade.slug == 'fuel 1') {
            res = await api.post('/user/fuelBoost')
            toast.success('Вы успешно активировали усиление')
        } else if (upgrade.slug == 'rage 1') {
            res = await api.post('/user/rage')
            toast.success('Вы успешно активировали усиление')
        } else {
            res = await api.post('/upgrade/buy', { slugToBuy: upgrade.slug })
            toast.success('Вы успешно купили улучшение')
        }
        authStore.setUser(res.data);
        await upgrade.getUpgrades();
        sethider(true);
        authStore.setLoader(false);
        if (upgrade.slug == 'rage 1') {
            navigate('/play')
        }
    }

    return (
        <div className={`Modal ${hider && 'Modal_hider'}`} onClick={() => { sethider(true) }}>
            <div className={`Modal_inner_under_under ${hider && 'Modal_inner_hider'}`}>
            </div>
            <div className={`Modal_inner_under ${hider && 'Modal_inner_hider'}`}>
            </div>
            <div className={`Modal_inner Modal_inner_above ${hider && 'Modal_inner_hider'}`} onClick={(e) => { e.stopPropagation() }}>
                {
                    resources && <>
                        <div className='Modal_top'>
                            <div className='Modal_header mt16'>
                                You have successfully sold resources
                            </div>
                            <div className='Modal_resources'>

                                {
                                    resources.map((resource) => {
                                        return <div className='Modal_resource' key={resource.level}>
                                            <img src={`/img/resources/${resource.level}.png`} alt='decor' />
                                            <span>X</span> {resource.count}
                                        </div>
                                    })
                                }
                            </div>

                        </div>
                        <div className='Modal_bot'>
                            <div className='Modal_header '>
                                <span>Earned</span> {earned} <img src='/img/icons/money.svg' alt='decor' />
                            </div>
                            <div className='Modal_buttonColored mt32' onClick={() => { sethider(true) }}>
                                Continue
                            </div>
                        </div>
                    </>
                }
                {
                    upgrade && <>
                        <div className='Modal_top'>
                            <img src={`/img/upgrades/${upgrade.slug.split(' ')[0]}.png`} alt='decor' />
                            <div className='Modal_header mt16'>
                                {upgrade.name}
                            </div>
                            <div className='Modal_subHeader mt16'>
                                {upgrade.description}
                            </div>
                            {upgrade.price > 0 &&
                                <div className='Modal_price mt16'>
                                    <img src='/img/icons/money.svg' alt='decor' />
                                    {upgrade.price}
                                    <span>•</span>
                                    {upgrade.level} lvl
                                </div>
                            }
                        </div>
                        {
                            user.balance >= upgrade.price
                                ? <div className='Modal_bot'>
                                    <div className='Modal_buttonColored mt32' onClick={() => { buy() }}>
                                        {upgrade.price > 0 ? <>
                                            Buy
                                        </> : <>
                                            Activate
                                        </>}
                                    </div>
                                </div>
                                : <div className='Modal_bot'>
                                    <div className='Modal_buttonGray mt32'>
                                        Недостаточно денег
                                    </div>
                                </div>
                        }
                    </>
                }
                {
                    afk && <>
                        <div className='Modal_afk_wrapper'>
                            <div className='Modal_afk_decor'>
                                <img src='/img/icons/info.svg' alt='decor' />
                            </div>
                            <div className='Modal_afk_value'>
                                <img src='/img/icons/money.svg' alt='decor' />
                                {
                                    afk > 999
                                        ? <>{Math.floor(afk / 100) / 10}K</>
                                        : <>{afk}</>
                                }

                            </div>
                            <div className='Modal_afk_header'>
                                During your absence, you earned
                            </div>
                        </div>
                        <div className='Modal_bot'>
                            <div className='Modal_buttonColored mt32' onClick={() => { hideModal() }}>
                                Continue
                            </div>
                        </div>

                    </>
                }



            </div>
            <div className={`Modal_cross free_img ${hider && 'Modal_inner_hider'}`}>
                <img src='/img/icons/cross.svg' onClick={() => { sethider(true) }} alt='decor' />
            </div>
        </div>
    )
}

export default Modal