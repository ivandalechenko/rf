import React from 'react';
import './scss/Startup.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { observer } from 'mobx-react';

import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useState } from 'react';
import { useEffect } from 'react';
import authStore from '../authStore';

const Startup = (props) => {
    const [showfirst, setshowfirst] = useState(true);
    const [slide, setslide] = useState(0);
    const handleSlideChange = (swiper) => { setslide(swiper.activeIndex) };
    const navigate = useNavigate()
    useEffect(() => {
        if (slide > 2) {
            setTimeout(() => {
                api.post('/user/comleteTraining')
                navigate('/play')
            }, 2000);
        }
    }, [slide])

    useEffect(() => {
        if (authStore.user.completedTraining) {
            navigate('/play')
        }
    }, [])



    return (
        <>
            <div className='Startup'>
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    modules={[EffectCards]}
                    className="mySwiper"
                    onSlideChange={handleSlideChange}
                >
                    <SwiperSlide>
                        <div className={`Startup_slideHeader ${slide != 0 && ' onone'}`}>
                            Кликайте на экран и зарабатывайте монеты
                        </div>
                        <div className={`Startup_slideSubheader ${slide != 0 && ' onone'}`}>
                            Вы можете использовать бусты и хитрые стратегии
                        </div>
                        <img src='/img/startupElement1.png' alt='decor' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={`Startup_slideHeader ${slide != 1 && ' onone'}`}>
                            Улучшайте свою биржу
                        </div>
                        <div className={`Startup_slideSubheader ${slide != 1 && ' onone'}`}>
                            Используйте карточки, чтобы увеличить свой пассивный доход
                        </div>
                        <img src='/img/startupElement2.png' alt='decor' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={`Startup_slideHeader ${slide != 2 && ' onone'}`}>
                            Приглашайте друзей и получайте бонусы вместе
                        </div>
                        <div className={`Startup_slideSubheader ${slide != 2 && ' onone'}`}>
                            Монеты получите и вы, и ваш друг
                        </div>
                        <img src='/img/startupElement3.png' alt='decor' />
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className={`Startup_slideHeader ${slide != 3 && ' onone'}`}>
                            Используйте монеты для получения вознаграждения при листинге токенов
                        </div>
                        <img src='/img/startupElement4.png' alt='decor' />
                    </SwiperSlide>
                </Swiper>
                <div className='Startup_dark'>
                    <div className='free_img'>
                        <div className='Startup_dark_inner'>
                            <div className={`dot ${slide == 0 && ' selected'}`}></div>
                            <div className={`dot ${slide == 1 && ' selected'}`}></div>
                            <div className={`dot ${slide == 2 && ' selected'}`}></div>
                            <div className={`dot ${slide == 3 && ' selected'}`}></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`Startup Startup_first ${!showfirst && ' hideToTop'}`} onClick={() => setshowfirst(false)}>
                <div className='Startup_decor'>
                    <div className='free_img'>
                        <img src='/img/startupDecor.svg' alt='decor' />
                    </div>
                </div>
                <div className='Startup_header'>
                    НАЗВАНИЕ ПРИЛОЖЕНИЯ
                </div>
                <div className='Startup_subheader'>
                    will be launched
                </div>
                <div className='Startup_where linear-gradient'>
                    on TON
                </div>
                <div className='Startup_info'>
                    Stay tuned
                </div>
                <div className='Startup_infoW'>
                    More info in official channels
                </div>
                <div className='Startup_media'>
                    <a href="https://google.com" className='Startup_media_element'>
                        <img src='/img/mediaPlaceholder.svg' alt='decor' />
                    </a>
                    <a href="https://google.com" className='Startup_media_element'>
                        <img src='/img/mediaPlaceholder.svg' alt='decor' />
                    </a>
                    <a href="https://google.com" className='Startup_media_element'>
                        <img src='/img/mediaPlaceholder.svg' alt='decor' />
                    </a>
                </div>
            </div>
        </>

    )
}

export default observer(Startup)