import React from 'react';
import './scss/Quest.scss';
import Navigation from '../components/Navigation'

const Quest = (props) => {
    return (
        <div className='Quest page'>
            <div className='Quest_decor'>
                <img src='/img/icons/money.svg' alt='decor' />
            </div>
            <div className='Quest_header'>
                Заработай больше монет
            </div>
            <div className='Quest_list'>
                <div className='Quest_label'>
                    Ежедневные задания
                </div>
                <div className='Quest_element'>
                    <div className='Quest_element_decor'>
                        <img src='/img/upgradePlaceholder.png' alt='decor' />
                    </div>
                    <div className='Quest_element_content'>
                        <div className='Quest_element_content_header'>
                            Ежедневная награда
                        </div>

                        <div className='Quest_element_content_price'>
                            <img src='/img/icons/money.svg' alt='decor' />
                            +5 000
                        </div>

                    </div>
                    <div className='Quest_element_status'>
                        <img src='/img/icons/done.svg' alt='decor' />
                    </div>
                </div>
            </div>
            <div className='Quest_list'>
                <div className='Quest_label'>
                    Список задания
                </div>
                <div className='Quest_element'>
                    <div className='Quest_element_decor'>
                        <img src='/img/upgradePlaceholder.png' alt='decor' />
                    </div>
                    <div className='Quest_element_content'>
                        <div className='Quest_element_content_header'>
                            Ежедневная награда
                        </div>

                        <div className='Quest_element_content_price'>
                            <img src='/img/icons/money.svg' alt='decor' />
                            +5 000
                        </div>

                    </div>
                    <div className='Quest_element_status'>
                        <img src='/img/icons/undone.svg' alt='decor' />
                    </div>
                </div>
                <div className='Quest_element'>
                    <div className='Quest_element_decor'>
                        <img src='/img/upgradePlaceholder.png' alt='decor' />
                    </div>
                    <div className='Quest_element_content'>
                        <div className='Quest_element_content_header'>
                            Мяу мяу
                        </div>

                        <div className='Quest_element_content_price'>
                            <img src='/img/icons/money.svg' alt='decor' />
                            +5 000
                        </div>

                    </div>
                    <div className='Quest_element_status'>
                        <img src='/img/icons/undone.svg' alt='decor' />
                    </div>
                </div>
                <div className='Quest_element'>
                    <div className='Quest_element_decor'>
                        <img src='/img/upgradePlaceholder.png' alt='decor' />
                    </div>
                    <div className='Quest_element_content'>
                        <div className='Quest_element_content_header'>
                            Мяу мяу
                        </div>

                        <div className='Quest_element_content_price'>
                            <img src='/img/icons/money.svg' alt='decor' />
                            +5 000
                        </div>

                    </div>
                    <div className='Quest_element_status'>
                        <img src='/img/icons/undone.svg' alt='decor' />
                    </div>
                </div>
                <div className='Quest_element'>
                    <div className='Quest_element_decor'>
                        <img src='/img/upgradePlaceholder.png' alt='decor' />
                    </div>
                    <div className='Quest_element_content'>
                        <div className='Quest_element_content_header'>
                            Мяу мяу
                        </div>

                        <div className='Quest_element_content_price'>
                            <img src='/img/icons/money.svg' alt='decor' />
                            +5 000
                        </div>

                    </div>
                    <div className='Quest_element_status'>
                        <img src='/img/icons/undone.svg' alt='decor' />
                    </div>
                </div>
            </div>

            <Navigation></Navigation>
        </div>
    )
}

export default Quest