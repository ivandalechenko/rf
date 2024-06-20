import React from 'react';
import './scss/Flame.scss';
import { useRive, Rive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { useEffect } from 'react';

const Flame = ({ flameStatus, stop }) => {
    const { RiveComponent, rive } = useRive({
        src: '/img/flame.riv',
        stateMachines: 'State Machine 1'
    });

    useEffect(() => {
        setTimeout(() => {
            if (rive) {
                if (flameStatus) {
                    rive.play();
                } else {
                    rive.stop();
                    rive.reset();
                }
            }
        }, Math.floor(Math.random() * (300 - 100 + 1)) + 100);
    }, [flameStatus])
    return (
        <RiveComponent
            style={{ minWidth: '70px', minHeight: '80px', opacity: flameStatus, transition: "opacity 500ms" }}
        />
    )
}

export default Flame