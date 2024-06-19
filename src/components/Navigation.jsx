import React from 'react';
import './scss/Navigation.scss';
import { NavLink } from 'react-router-dom';
const Navigation = ({ isBack, backFunc }) => {
    return (
        <div className='Navigation_wrapper'>
            <div onClick={() => { backFunc() }} className={`Navigation_back ${!isBack && 'dnone'}`}>
                <img src='/img/icons/back.svg' alt='decor' />
                Back
            </div>
            <div className='Navigation_delimeter'></div>
            <div className='Navigation'>
                {/* <NavLink to={'/quest'} className='Navigation_element'>
                    <img src='/img/icons/quest.svg' alt='decor' />
                    <div className='Navigation_text'>
                        Quest
                    </div>
                </NavLink> */}
                <NavLink to={'/play'} className='Navigation_element'>
                    <img src='/img/icons/play.svg' alt='decor' />
                    <div className='Navigation_text'>
                        Play
                    </div>
                </NavLink>
                <NavLink to={'/upgrades'} className='Navigation_element'>
                    <img src='/img/icons/upgrades.svg' alt='decor' />
                    <div className='Navigation_text'>
                        Upgrades
                    </div>
                </NavLink>
                <NavLink to={'/invites'} className='Navigation_element'>
                    <img src='/img/icons/invites.svg' alt='decor' />
                    <div className='Navigation_text'>
                        Invites
                    </div>
                </NavLink>
            </div>
        </div>
    )
}

export default Navigation