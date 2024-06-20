import React from 'react';
import './scss/Quest.scss';
import Navigation from '../components/Navigation'
import { useEffect } from 'react';
import { useState } from 'react';
import api from '../api';
import Modal from '../components/Modal'
import { observer } from 'mobx-react';
import authStore from '../authStore';

const Quest = (props) => {
    const [quests, setquests] = useState([]);
    const [wantToDo, setwantToDo] = useState({});
    const getQuests = async () => {
        const res = await api.get('quest/')
        setquests(res.data)
    }

    useEffect(() => {
        getQuests();
    }, [])




    return (
        <div className='Quest page'>
            {
                wantToDo.slug
                    ? <Modal quest={wantToDo} hideModal={() => { setwantToDo({}) }}></Modal>
                    : <></>
            }

            <div className='Quest_decor'>
                <img src='/img/icons/money.svg' alt='decor' />
            </div>
            <div className='Quest_header'>
                Заработай больше монет
            </div>
            <div className='Quest_list'>
                {
                    quests.find((quest) => quest.daily) ? <>
                        <div className='Quest_label'>
                            Ежедневные задания
                        </div>
                    </> : <></>
                }
                {
                    quests.map((quest, index) => {
                        if (quest.daily) {
                            return <div className='Quest_element'>
                                <div className='Quest_element_decor'>
                                    <img src='/img/upgradePlaceholder.png' alt='decor' />
                                </div>
                                <div className='Quest_element_content'>
                                    <div className='Quest_element_content_header'>
                                        {quest.name}
                                    </div>

                                    <div className='Quest_element_content_price'>
                                        <img src='/img/icons/money.svg' alt='decor' />
                                        +{quest.bounty}
                                    </div>
                                </div>
                                <div className='Quest_element_status'>
                                    <img src={`/img/media/${quest.slug}.svg`} alt='decor' />
                                </div>
                            </div>
                        }
                    })
                }

            </div>
            <div className='Quest_list'>
                <div className='Quest_label'>
                    Список заданий
                </div>
                {
                    quests.map((quest, key) => {
                        if (!quest.daily) {
                            return <div className='Quest_element' key={key}>
                                <div className='Quest_element_decor'>
                                    <img src={`/img/media/${quest.slug}.svg`} alt='decor' />
                                </div>
                                <div className='Quest_element_content'>
                                    <div className='Quest_element_content_header'>
                                        {quest.name}
                                    </div>

                                    <div className='Quest_element_content_price'>
                                        <img src='/img/icons/money.svg' alt='decor' />
                                        +{quest.bounty}
                                    </div>
                                </div>
                                {
                                    authStore.user.completedQuests.includes(quest.slug)
                                        ? <div className='Quest_element_status'>
                                            <img src={`/img/icons/done.svg`} alt='decor' />
                                        </div>
                                        : <div className='Quest_element_status' onClick={() => {
                                            setwantToDo(quest)
                                        }}>
                                            <img src={`/img/icons/undone.svg`} alt='decor' />
                                        </div>
                                }

                            </div>
                        }
                    })
                }
            </div>
            <Navigation></Navigation>
        </div>
    )
}

export default observer(Quest)