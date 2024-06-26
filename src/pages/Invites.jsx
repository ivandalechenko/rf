import React from 'react';
import './scss/Invites.scss';
import Navigation from '../components/Navigation'
import { useEffect } from 'react';
import api from '../api';
import { useState } from 'react';
import authStore from '../authStore';
import { toast } from 'react-toastify';

const Invites = (props) => {
    const [refCount, setrefCount] = useState(0);
    useEffect(() => {
        const start = async () => {
            const res = await api.get('/user/myReferalsCount')
            setrefCount(res.data)
        }
        start()
    }, [])


    return (
        <div className='Invites page'>
            <div className='Invites_header'>
                Пригласите друзей
            </div>
            <div className='Invites_subHeader'>
                Вы и ваш друг получите бонусы
            </div>
            <div className='Invites_tgDifferentElements'>
                <div className='Invites_tgDifferentElement'>
                    <div className='Invites_tgDifferentElement_decor'>
                        {/* <img src='/img/upgradePlaceholder.png' alt='decor' /> */}
                        <img src='/img/icons/friends.svg' alt='decor' />
                    </div>
                    <div className='Invites_tgDifferentElement_content'>
                        <div className='Invites_tgDifferentElement_content_header'>
                            Пригласить друга
                        </div>
                        <div className='Invites_tgDifferentElement_content_value'>
                            <img src='/img/icons/money.svg' alt='decor' />
                            +5 000
                            <span>для вас и вашего друга</span>
                        </div>
                    </div>
                </div>
                <div className='Invites_tgDifferentElement'>
                    <div className='Invites_tgDifferentElement_decor'>
                        {/* <img src='/img/upgradePlaceholder.png' alt='decor' /> */}
                        <img src='/img/icons/friendsPlus.svg' alt='decor' />
                    </div>
                    <div className='Invites_tgDifferentElement_content'>
                        <div className='Invites_tgDifferentElement_content_header'>
                            Пригласить друга c Telegram Premium
                        </div>
                        <div className='Invites_tgDifferentElement_content_value'>
                            <img src='/img/icons/money.svg' alt='decor' />
                            +25 000
                            <span>для вас и вашего друга</span>
                        </div>
                    </div>
                </div>
                {/* <div className='Invites_more_wrapper'>

                    <div className='Invites_more linear-gradient'>
                        Больше бонусов
                    </div>
                </div> */}
            </div>
            <div className='Invites_list'>
                <div className='Invites_label'>
                    Список ваших друзей
                    {/* <img src='/img/icons/refrash.svg' alt='decor' /> */}
                </div>
                <div className='Invites_count'>
                    {
                        refCount
                            ? <>Вы пригласили {refCount} друзей</>
                            : <>Вы ещё никого не пригласили</>
                    }
                </div>
            </div>
            <div className='Invites_buttons'>
                <div className='Invites_button Invites_buttonL linear-gradient' onClick={() => {
                    const invText = `https://t.me/share/url?text=` + encodeURIComponent(`https://t.me/rockettapbot/game?startapp=${authStore.user.tgId}\n\nГо в ракетку`)
                    window.Telegram.WebApp.openTelegramLink(invText);
                }}>
                    Пригласить друга
                </div>
                <div className='Invites_button linear-gradient' onClick={() => {
                    navigator.clipboard.writeText(`https://t.me/rockettapbot/game?startapp=${authStore.user.tgId}`);
                    toast.success('Ссылка успешно скопирована')
                }}>
                    <img src='/img/icons/copy.svg' alt='decor' />
                </div>
            </div>
            <Navigation></Navigation>
        </div>
    )
}

export default Invites